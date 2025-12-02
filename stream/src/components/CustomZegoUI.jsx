import { useEffect, useRef, useState } from 'react';
import ZegoExpressEngine from 'zego-express-engine-webrtc';
import { ZEGO_APP_ID, ZEGO_SERVER_SECRET } from '../config/zegoConfig';
import './CustomZegoUI.css';

function CustomZegoUI({ callId, userName, userId, onLeave }) {
  const zegoEngineRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const containerRef = useRef(null);
  const streamIDRef = useRef(`stream_${userId}_${Date.now()}`);
  const localStreamRef = useRef(null);

  useEffect(() => {
    if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET || ZEGO_SERVER_SECRET === 'YOUR_SERVER_SECRET') {
      setError('ZEGOCLOUD credentials not configured');
      return;
    }

    const initializeZego = async () => {
      try {
        const appID = typeof ZEGO_APP_ID === 'number' ? ZEGO_APP_ID : Number(ZEGO_APP_ID);
        
        if (isNaN(appID)) {
          throw new Error('Invalid ZEGOCLOUD App ID');
        }

        // Create ZEGO Express Engine instance
        const zegoEngine = ZegoExpressEngine.create(appID, ZEGO_SERVER_SECRET);
        zegoEngineRef.current = zegoEngine;

        // Set up event handlers
        zegoEngine.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
          console.log('Room state update:', { roomID, state, errorCode, extendedData });
          if (state === 'DISCONNECTED' && errorCode !== 0) {
            setError(`Connection error: ${extendedData}`);
          }
        });

        zegoEngine.on('roomUserUpdate', (roomID, updateType, userList) => {
          console.log('Room user update:', { roomID, updateType, userList });
          if (updateType === 'ADD') {
            setParticipants(prev => {
              const newUsers = userList.filter(u => !prev.find(p => p.userID === u.userID));
              return [...prev, ...newUsers];
            });
          } else if (updateType === 'DELETE') {
            setParticipants(prev => prev.filter(p => !userList.find(u => u.userID === p.userID)));
          }
        });

        zegoEngine.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
          console.log('Room stream update:', { roomID, updateType, streamList });
          
          if (updateType === 'ADD') {
            for (const stream of streamList) {
              if (stream.userID !== userId) {
                const streamID = stream.streamID;
                
                try {
                  const mediaStream = await zegoEngine.startPlayingStream(streamID);
                  
                  setRemoteStreams(prev => {
                    // Avoid duplicates
                    if (prev.find(s => s.streamID === streamID)) {
                      return prev;
                    }
                    return [...prev, {
                      streamID,
                      userID: stream.userID,
                      userName: stream.userName || `User-${stream.userID.substring(0, 8)}`,
                      mediaStream
                    }];
                  });
                } catch (err) {
                  console.error('Error playing remote stream:', err);
                }
              }
            }
          } else if (updateType === 'DELETE') {
            for (const stream of streamList) {
              const streamID = stream.streamID;
              try {
                zegoEngine.stopPlayingStream(streamID);
              } catch (err) {
                console.error('Error stopping stream:', err);
              }
              setRemoteStreams(prev => prev.filter(s => s.streamID !== streamID));
            }
          }
        });

        // Login to room
        await zegoEngine.loginRoom(callId, {
          userID: userId,
          userName: userName || `User-${userId.substring(0, 8)}`,
        }, {
          roomUpdate: true,
        });

        console.log('✅ Logged into room successfully');

      } catch (err) {
        console.error('❌ Error initializing ZEGOCLOUD:', err);
        setError(err.message || 'Failed to initialize ZEGOCLOUD');
      }
    };

    initializeZego();

    return () => {
      // Cleanup
      if (zegoEngineRef.current) {
        try {
          zegoEngineRef.current.logoutRoom(callId);
          zegoEngineRef.current.destroy();
          zegoEngineRef.current = null;
        } catch (error) {
          console.error('Error cleaning up ZEGOCLOUD:', error);
        }
      }
      // Cleanup local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [callId, userId, userName]);

  const toggleCamera = async () => {
    if (!zegoEngineRef.current) return;

    try {
      if (isCameraOn) {
        // Turn off camera
        await zegoEngineRef.current.stopPublishingStream(streamIDRef.current);
        if (localStream) {
          localStream.getVideoTracks().forEach(track => {
            track.stop();
            localStream.removeTrack(track);
          });
        }
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
      } else {
        // Check if camera is available first
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
          
          if (!hasVideoDevice) {
            setError('No camera device found. Please connect a camera.');
            return;
          }

          // Turn on camera
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: isMicOn,
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          setLocalStream(stream);
          localStreamRef.current = stream;

          // Publish stream
          await zegoEngineRef.current.startPublishingStream(streamIDRef.current, stream);
          setIsCameraOn(true);
          setError(null);
        } catch (err) {
          console.error('Error accessing camera:', err);
          if (err.name === 'NotFoundError') {
            setError('Camera not found. Please connect a camera device.');
          } else if (err.name === 'NotAllowedError') {
            setError('Camera permission denied. Please allow camera access.');
          } else {
            setError('Failed to access camera: ' + err.message);
          }
        }
      }
    } catch (err) {
      console.error('Error toggling camera:', err);
      setError('Failed to toggle camera');
    }
  };

  const toggleMicrophone = async () => {
    if (!zegoEngineRef.current) return;

    try {
      if (isMicOn) {
        // Turn off microphone
        if (localStream) {
          localStream.getAudioTracks().forEach(track => {
            track.stop();
            localStream.removeTrack(track);
          });
        }
        setIsMicOn(false);
      } else {
        // Check if microphone is available first
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasAudioDevice = devices.some(device => device.kind === 'audioinput');
          
          if (!hasAudioDevice) {
            setError('No microphone device found. Please connect a microphone.');
            return;
          }

          // Turn on microphone
          const stream = await navigator.mediaDevices.getUserMedia({
            video: isCameraOn,
            audio: true,
          });
          
          // Merge with existing stream or create new
          if (localStream && isCameraOn) {
            stream.getAudioTracks().forEach(track => {
              localStream.addTrack(track);
            });
          } else {
            setLocalStream(stream);
            localStreamRef.current = stream;
          }

          // Update published stream if camera is already on
          if (isCameraOn && zegoEngineRef.current) {
            await zegoEngineRef.current.stopPublishingStream(streamIDRef.current);
            await zegoEngineRef.current.startPublishingStream(streamIDRef.current, localStream || stream);
          }

          setIsMicOn(true);
          setError(null);
        } catch (err) {
          console.error('Error accessing microphone:', err);
          if (err.name === 'NotFoundError') {
            setError('Microphone not found. Please connect a microphone device.');
          } else if (err.name === 'NotAllowedError') {
            setError('Microphone permission denied. Please allow microphone access.');
          } else {
            setError('Failed to access microphone: ' + err.message);
          }
        }
      }
    } catch (err) {
      console.error('Error toggling microphone:', err);
      setError('Failed to toggle microphone');
    }
  };

  const toggleScreenShare = async () => {
    if (!zegoEngineRef.current) return;

    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (localStream) {
          localStream.getTracks().forEach(track => {
            if (track.kind === 'video' && track.getSettings().displaySurface) {
              track.stop();
            }
          });
        }
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Publish screen share stream
          const screenStreamID = `screen_${userId}_${Date.now()}`;
          await zegoEngineRef.current.startPublishingStream(screenStreamID, stream);
          setIsScreenSharing(true);

          // Stop screen share when user stops sharing
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
        } catch (err) {
          console.error('Error accessing screen:', err);
          setError('Screen sharing not available');
        }
      }
    } catch (err) {
      console.error('Error toggling screen share:', err);
      setError('Failed to toggle screen share');
    }
  };

  const handleLeave = () => {
    if (zegoEngineRef.current) {
      zegoEngineRef.current.logoutRoom(callId);
      zegoEngineRef.current.destroy();
      zegoEngineRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onLeave();
  };

  return (
    <div className="custom-zego-ui">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="meeting-header">
        <div className="meeting-info">
          <h2>Meeting: {callId}</h2>
          <p>{participants.length + 1} participant{participants.length !== 0 ? 's' : ''}</p>
        </div>
        <button className="leave-btn-header" onClick={handleLeave}>
          Leave Meeting
        </button>
      </div>

      <div className="video-grid" ref={containerRef}>
        {/* Local video */}
        <div className="video-item local-video-item">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-element"
          />
          {!isCameraOn && (
            <div className="video-placeholder">
              <div className="avatar-large">{userName?.[0]?.toUpperCase() || 'U'}</div>
              <p className="user-name">{userName || 'You'}</p>
            </div>
          )}
          <div className="video-overlay">
            <span className="video-label">{userName || 'You'}</span>
            <div className="status-badges">
              {!isCameraOn && <span className="badge badge-off">📷 Off</span>}
              {!isMicOn && <span className="badge badge-off">🎤 Off</span>}
            </div>
          </div>
        </div>

        {/* Remote videos */}
        {remoteStreams.map((stream) => (
          <div key={stream.streamID} className="video-item remote-video-item">
            <video
              autoPlay
              playsInline
              srcObject={stream.mediaStream}
              className="video-element"
            />
            <div className="video-overlay">
              <span className="video-label">{stream.userName}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="custom-controls">
        <button
          className={`control-btn ${isCameraOn ? 'active' : ''}`}
          onClick={toggleCamera}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
        >
          <span className="btn-icon">{isCameraOn ? '📹' : '📷'}</span>
          <span className="btn-label">{isCameraOn ? 'Camera On' : 'Camera Off'}</span>
        </button>

        <button
          className={`control-btn ${isMicOn ? 'active' : ''}`}
          onClick={toggleMicrophone}
          title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          <span className="btn-icon">{isMicOn ? '🎤' : '🔇'}</span>
          <span className="btn-label">{isMicOn ? 'Mic On' : 'Mic Off'}</span>
        </button>

        <button
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <span className="btn-icon">{isScreenSharing ? '🖥️' : '📺'}</span>
          <span className="btn-label">{isScreenSharing ? 'Sharing' : 'Share Screen'}</span>
        </button>

        <button className="control-btn danger" onClick={handleLeave}>
          <span className="btn-icon">🚪</span>
          <span className="btn-label">Leave</span>
        </button>
      </div>
    </div>
  );
}

export default CustomZegoUI;

