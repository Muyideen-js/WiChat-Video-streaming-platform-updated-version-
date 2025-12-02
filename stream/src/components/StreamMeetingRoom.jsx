import { useEffect } from 'react';
import {
  useCall,
  ParticipantView,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import './StreamMeetingRoom.css';

function StreamMeetingRoom({ callId, userName, userId, onLeave }) {
  const call = useCall();
  const { useParticipants, useLocalParticipant, useCallState } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const callState = useCallState();

  useEffect(() => {
    if (!call) return;

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 2;

    const joinCall = async () => {
      if (!isMounted) return;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isMounted) return;
        
        await call.join({ create: true });
        console.log('✅ Joined call successfully');
      } catch (error) {
        console.error('❌ Error joining call:', error);
        
        if (!isMounted) return;
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`🔄 Retrying join (attempt ${retryCount}/${maxRetries})...`);
          setTimeout(() => {
            if (isMounted) {
              joinCall();
            }
          }, 1500);
        }
      }
    };

    joinCall();

    const handleCallEnded = () => {
      if (isMounted) {
        onLeave();
      }
    };

    call.on('call.ended', handleCallEnded);

    return () => {
      isMounted = false;
      call.off('call.ended', handleCallEnded);
      call.leave().catch(console.error);
    };
  }, [call, onLeave]);

  if (!call) {
    return (
      <div className="stream-meeting-loading">
        <div className="loading-spinner"></div>
        <p>Initializing call...</p>
      </div>
    );
  }

  // Combine all participants
  const allParticipants = localParticipant 
    ? [localParticipant, ...participants.filter(p => p.sessionId !== localParticipant.sessionId)]
    : participants;

  const totalParticipants = allParticipants.length;

  return (
    <div className="stream-meeting-container">
      <div className="stream-meeting-header">
        <div className="meeting-info">
          <h2>Meeting: {callId}</h2>
          <span className="participant-count">
            {totalParticipants} {totalParticipants === 1 ? 'participant' : 'participants'}
          </span>
        </div>
      </div>

      <div className="stream-meeting-content">
        <div className={`stream-video-grid ${getGridClass(totalParticipants)}`}>
          {allParticipants.length === 0 ? (
            <div className="no-participants">
              <div className="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                <p>Waiting for participants to join...</p>
              </div>
            </div>
          ) : (
            allParticipants.map((participant) => {
              const isLocal = participant.sessionId === localParticipant?.sessionId;
              const name = participant.user?.name || userName || `User-${(participant.userId || userId || '').substring(0, 8)}`;
              const hasVideo = participant.publishedTracks?.includes('video');
              
              return (
                <div 
                  key={participant.sessionId || participant.userId} 
                  className={`stream-participant-tile ${isLocal ? 'local-participant' : ''}`}
                >
                  <div className="stream-participant-wrapper">
                    {hasVideo ? (
                      <ParticipantView participant={participant} />
                    ) : (
                      <div className="stream-avatar-overlay">
                        <div className="stream-avatar-circle">
                          {getInitials(name)}
                        </div>
                      </div>
                    )}
                    <div className="stream-participant-overlay">
                      <div className="stream-participant-name">
                        <span>{name}{isLocal ? ' (You)' : ''}</span>
                        {!hasVideo && (
                          <span className="camera-off-icon" title="Camera off">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98z"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <StreamControls call={call} onLeave={onLeave} />
    </div>
  );
}

// Simple Controls Component using Stream's built-in methods
function StreamControls({ call, onLeave }) {
  const toggleVideo = async () => {
    if (call) await call.camera.toggle();
  };

  const toggleAudio = async () => {
    if (call) await call.microphone.toggle();
  };

  const toggleScreenShare = async () => {
    if (call) {
      const isSharing = call.state.localParticipant?.publishedTracks?.includes('screen_share');
      if (isSharing) {
        await call.disableScreenShare();
      } else {
        await call.enableScreenShare();
      }
    }
  };

  const handleLeave = () => {
    if (call) call.leave();
    onLeave();
  };

  const isVideoOn = call?.camera?.state?.status === 'enabled';
  const isAudioOn = call?.microphone?.state?.status === 'enabled';
  const isScreenSharing = call?.state?.localParticipant?.publishedTracks?.includes('screen_share');

  return (
    <div className="stream-controls">
      <button 
        className={`stream-control-btn ${isVideoOn ? 'active' : ''}`}
        onClick={toggleVideo}
        title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          {isVideoOn ? (
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          ) : (
            <path d="M21 6.5l-3.5-3.5L15 5.5 9 0 2.5 6.5 6 10l-4 4v6h6l4-4 4.5 4.5L21 18l-4-4 4-4V6.5z"/>
          )}
        </svg>
      </button>

      <button 
        className={`stream-control-btn ${isAudioOn ? 'active' : ''}`}
        onClick={toggleAudio}
        title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          {isAudioOn ? (
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          ) : (
            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          )}
        </svg>
      </button>

      <button 
        className={`stream-control-btn ${isScreenSharing ? 'active' : ''}`}
        onClick={toggleScreenShare}
        title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
        </svg>
      </button>

      <button 
        className="stream-control-btn stream-control-btn-danger"
        onClick={handleLeave}
        title="Leave meeting"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.68.28-.26 0-.5-.1-.68-.28L.28 13.1c-.18-.18-.28-.43-.28-.68 0-.26.1-.5.28-.68C3.34 8.78 7.46 7 12 7s8.66 1.78 11.72 4.74c.18.18.28.43.28.68 0 .26-.1.5-.28.68l-2.58 2.58c-.18.18-.43.28-.68.28-.26 0-.5-.1-.68-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
        </svg>
      </button>
    </div>
  );
}

// Helper functions
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getGridClass(count) {
  if (count <= 1) return 'grid-1';
  if (count === 2) return 'grid-2';
  if (count <= 4) return 'grid-4';
  if (count <= 9) return 'grid-9';
  return 'grid-many';
}

export default StreamMeetingRoom;
