import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import Chat from './Chat';
import './MeetingRoom.css';

const SOCKET_URL = 'http://localhost:3001';

function MeetingRoom({ meetingId, userName, onLeave }) {
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [participantInfo, setParticipantInfo] = useState(new Map()); // socketId -> {userName, userId}
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [messages, setMessages] = useState([]);
  
  const peerConnections = useRef(new Map());
  const userId = useRef(uuidv4());
  const screenShareStream = useRef(null);
  const originalVideoTrack = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Get user media with better error handling
    const initializeMedia = async () => {
      try {
        // First, check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia is not supported in this browser');
        }

        // List available devices first (helps with permission prompt)
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          console.log('Available devices:', devices.length);
        } catch (e) {
          console.log('Could not enumerate devices');
        }

        // Request media with specific constraints - this will trigger browser permission prompt
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            facingMode: 'user',
            frameRate: { ideal: 30 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: { ideal: 48000 }
          },
        });
        
        console.log('Successfully got media stream with', stream.getVideoTracks().length, 'video tracks and', stream.getAudioTracks().length, 'audio tracks');
        setLocalStream(stream);
        setIsVideoOn(true);
        setIsAudioOn(true);

        // Join room after media is obtained
        newSocket.emit('join-room', {
          roomId: meetingId,
          userId: userId.current,
          userName,
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        
        // Try with audio only if video fails
        try {
          console.log('Attempting audio-only fallback...');
          const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            },
          });
          setLocalStream(audioOnlyStream);
          setIsVideoOn(false);
          setIsAudioOn(true);
          
          // Join room with audio only
          newSocket.emit('join-room', {
            roomId: meetingId,
            userId: userId.current,
            userName,
          });
        } catch (audioError) {
          console.error('Error accessing audio:', audioError);
          
          // Allow joining without media - create empty stream
          const emptyStream = new MediaStream();
          setLocalStream(emptyStream);
          setIsVideoOn(false);
          setIsAudioOn(false);
          
          // Still join the room
          newSocket.emit('join-room', {
            roomId: meetingId,
            userId: userId.current,
            userName,
          });
          
          const errorMsg = error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError'
            ? 'Please allow camera/microphone access and refresh the page.'
            : 'Could not access camera/microphone. You can still join but without video/audio.';
          
          alert(errorMsg);
        }
      }
    };

    initializeMedia();

    // Socket event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('existing-participants', (participants) => {
      console.log('Received existing participants:', participants.length);
      participants.forEach((participant) => {
        console.log('Creating peer connection with existing participant:', participant.socketId);
        setParticipantInfo(prev => {
          const newMap = new Map(prev);
          newMap.set(participant.socketId, {
            userName: participant.userName,
            userId: participant.userId
          });
          return newMap;
        });
        createPeerConnection(participant.socketId, true);
      });
    });

    newSocket.on('user-joined', ({ socketId, userName, userId }) => {
      console.log('New user joined:', socketId, userName);
      setParticipantInfo(prev => {
        const newMap = new Map(prev);
        newMap.set(socketId, { userName, userId });
        return newMap;
      });
      createPeerConnection(socketId, false);
    });

    newSocket.on('user-left', ({ socketId }) => {
      peerConnections.current.delete(socketId);
      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        newMap.delete(socketId);
        return newMap;
      });
      setParticipantInfo(prev => {
        const newMap = new Map(prev);
        newMap.delete(socketId);
        return newMap;
      });
    });

    newSocket.on('offer', async ({ offer, senderSocketId }) => {
      console.log('Received offer from', senderSocketId);
      let pc = peerConnections.current.get(senderSocketId);
      
      // Create peer connection if it doesn't exist
      if (!pc) {
        console.log('Creating peer connection for incoming offer from', senderSocketId);
        await createPeerConnection(senderSocketId, false);
        pc = peerConnections.current.get(senderSocketId);
      }
      
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          newSocket.emit('answer', {
            answer,
            targetSocketId: senderSocketId,
          });
          console.log('Sent answer to', senderSocketId);
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      }
    });

    newSocket.on('answer', async ({ answer, senderSocketId }) => {
      console.log('Received answer from', senderSocketId);
      const pc = peerConnections.current.get(senderSocketId);
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('Set remote description from', senderSocketId);
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      } else {
        console.warn('No peer connection found for answer from', senderSocketId);
      }
    });

    newSocket.on('ice-candidate', async ({ candidate, senderSocketId }) => {
      const pc = peerConnections.current.get(senderSocketId);
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      } else {
        console.warn('No peer connection found for ICE candidate from', senderSocketId);
      }
    });

    newSocket.on('participant-count', (count) => {
      setParticipantCount(count);
    });

    newSocket.on('chat-message', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    // Cleanup
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      peerConnections.current.forEach((pc) => pc.close());
      newSocket.disconnect();
    };
  }, [meetingId, userName]);

  const createPeerConnection = async (socketId, isInitiator) => {
    // Don't create duplicate connections
    if (peerConnections.current.has(socketId)) {
      console.log('Peer connection already exists for', socketId);
      return;
    }

    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnections.current.set(socketId, pc);

    // Add local stream tracks
    if (localStream && localStream.getTracks().length > 0) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Received remote stream from', socketId);
      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        newMap.set(socketId, event.streams[0]);
        return newMap;
      });
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Peer connection state with ${socketId}:`, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        // Try to reconnect
        console.log('Connection failed, attempting to recreate...');
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          targetSocketId: socketId,
        });
      }
    };

    // Create and send offer if initiator
    if (isInitiator) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        if (socket) {
          socket.emit('offer', {
            offer,
            targetSocketId: socketId,
          });
          console.log('Sent offer to', socketId);
        }
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const screenVideoTrack = screenStream.getVideoTracks()[0];
      const screenAudioTrack = screenStream.getAudioTracks()[0];
      
      // Store original video track
      const originalTrack = localStream.getVideoTracks()[0];
      if (originalTrack) {
        originalVideoTrack.current = originalTrack;
      }
      
      screenShareStream.current = screenStream;
      
      // Replace video track in local stream for local preview
      if (originalTrack) {
        originalTrack.stop();
      }
      localStream.addTrack(screenVideoTrack);
      
      // Add screen audio if available
      if (screenAudioTrack) {
        const existingAudio = localStream.getAudioTracks()[0];
        if (existingAudio) {
          localStream.removeTrack(existingAudio);
          existingAudio.stop();
        }
        localStream.addTrack(screenAudioTrack);
      }
      
      // Replace track in all peer connections
      peerConnections.current.forEach((pc) => {
        const senders = pc.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
        const audioSender = senders.find((s) => s.track && s.track.kind === 'audio');
        
        if (videoSender && screenVideoTrack) {
          videoSender.replaceTrack(screenVideoTrack).catch(err => {
            console.error('Error replacing video track:', err);
          });
        }
        
        if (audioSender && screenAudioTrack) {
          audioSender.replaceTrack(screenAudioTrack).catch(err => {
            console.error('Error replacing audio track:', err);
          });
        }
      });

      setIsScreenSharing(true);
      console.log('Screen sharing started');

      // Stop screen share when user stops sharing
      screenVideoTrack.onended = () => {
        console.log('Screen share ended by user');
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
      alert('Failed to start screen sharing. Please check permissions.');
    }
  };

  const stopScreenShare = async () => {
    try {
      // Stop screen share tracks
      if (screenShareStream.current) {
        screenShareStream.current.getTracks().forEach(track => track.stop());
        screenShareStream.current = null;
      }

      // Get camera/mic stream
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const newVideoTrack = cameraStream.getVideoTracks()[0];
      const newAudioTrack = cameraStream.getAudioTracks()[0];

      // Remove screen share tracks from local stream
      const screenVideoTrack = localStream.getVideoTracks().find(
        track => track.readyState === 'live' && track.label.includes('screen')
      );
      if (screenVideoTrack) {
        localStream.removeTrack(screenVideoTrack);
      }

      // Add camera track back
      if (newVideoTrack) {
        localStream.addTrack(newVideoTrack);
      }

      // Replace audio track if needed
      if (newAudioTrack) {
        const existingAudio = localStream.getAudioTracks()[0];
        if (existingAudio) {
          localStream.removeTrack(existingAudio);
          existingAudio.stop();
        }
        localStream.addTrack(newAudioTrack);
      }

      // Replace track in all peer connections
      peerConnections.current.forEach((pc) => {
        const senders = pc.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
        const audioSender = senders.find((s) => s.track && s.track.kind === 'audio');
        
        if (videoSender && newVideoTrack) {
          videoSender.replaceTrack(newVideoTrack).catch(err => {
            console.error('Error replacing video track back to camera:', err);
          });
        }
        
        if (audioSender && newAudioTrack) {
          audioSender.replaceTrack(newAudioTrack).catch(err => {
            console.error('Error replacing audio track:', err);
          });
        }
      });

      setIsScreenSharing(false);
      setIsVideoOn(true);
      console.log('Screen sharing stopped, camera restored');
    } catch (error) {
      console.error('Error stopping screen share:', error);
      // If camera access fails, just stop screen share
      setIsScreenSharing(false);
    }
  };

  const handleLeave = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    peerConnections.current.forEach((pc) => pc.close());
    if (socket) {
      socket.disconnect();
    }
    onLeave();
  };

  const sendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('chat-message', {
        roomId: meetingId,
        message: message.trim(),
        userName,
        userId: userId.current,
      });
    }
  };

  // Update peer connections when local stream changes
  useEffect(() => {
    if (localStream && localStream.getTracks().length > 0 && peerConnections.current.size > 0) {
      peerConnections.current.forEach((pc, socketId) => {
        localStream.getTracks().forEach((track) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === track.kind);
          if (sender && sender.track !== track) {
            // Replace existing track
            sender.replaceTrack(track);
          } else if (!sender) {
            // Add new track
            pc.addTrack(track, localStream);
          }
        });
      });
    }
  }, [localStream]);

  return (
    <div className="meeting-room">
      <div className="meeting-header">
        <div className="meeting-info">
          <h2>Meeting: {meetingId}</h2>
          <span className="participant-count">{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="meeting-content">
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          userName={userName}
          participantInfo={participantInfo}
        />
        
        {showChat && (
          <Chat
            messages={messages}
            onSendMessage={sendMessage}
            userName={userName}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>

      <Controls
        isVideoOn={isVideoOn}
        isAudioOn={isAudioOn}
        isScreenSharing={isScreenSharing}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onStartScreenShare={startScreenShare}
        onStopScreenShare={stopScreenShare}
        onToggleChat={() => setShowChat(!showChat)}
        showChat={showChat}
        onLeave={handleLeave}
      />
    </div>
  );
}

export default MeetingRoom;

