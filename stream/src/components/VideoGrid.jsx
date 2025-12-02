import { useEffect, useRef } from 'react';
import './VideoGrid.css';

function VideoGrid({ localStream, remoteStreams, userName, participantInfo }) {
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Helper to get user initials
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper to get avatar color
  const getAvatarColor = (name) => {
    if (!name) return '#667eea';
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0',
      '#a8edea', '#fed6e3', '#ffecd2', '#fcb69f'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getGridClass = (totalParticipants) => {
    if (totalParticipants <= 1) return 'grid-1';
    if (totalParticipants === 2) return 'grid-2';
    if (totalParticipants <= 4) return 'grid-4';
    if (totalParticipants <= 9) return 'grid-9';
    return 'grid-many';
  };

  const totalParticipants = remoteStreams.size + 1;
  const gridClass = getGridClass(totalParticipants);

  // Check if local video is enabled
  const localHasVideo = localStream && localStream.getVideoTracks().some(
    track => track.enabled && track.readyState === 'live'
  );

  return (
    <div className={`video-grid ${gridClass}`}>
      {/* Local video */}
      {localStream && (
        <div className="video-container local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-element"
            style={{ display: localHasVideo ? 'block' : 'none' }}
          />
            {!localHasVideo && (
              <div 
                className="video-avatar"
                style={{ 
                  background: `linear-gradient(135deg, ${getAvatarColor(userName)} 0%, ${getAvatarColor(userName + '1')} 100%)`
                }}
              >
                <span className="avatar-initials">{getInitials(userName)}</span>
              </div>
            )}
          <div className="video-label">
            <span>{userName} (You)</span>
            {!localHasVideo && (
              <div className="video-status">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98z"/>
                </svg>
                <span>Camera off</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remote videos */}
      {Array.from(remoteStreams.entries()).map(([socketId, stream]) => {
        const info = participantInfo.get(socketId);
        const participantName = info?.userName || 'Participant';
        const hasVideo = stream.getVideoTracks().some(
          track => track.enabled && track.readyState === 'live'
        );

        return (
          <div key={socketId} className="video-container remote-video">
            <video
              ref={(ref) => {
                if (ref) {
                  ref.srcObject = stream;
                }
              }}
              autoPlay
              playsInline
              className="video-element"
              style={{ display: hasVideo ? 'block' : 'none' }}
            />
            {!hasVideo && (
              <div 
                className="video-avatar"
                style={{ 
                  background: `linear-gradient(135deg, ${getAvatarColor(participantName)} 0%, ${getAvatarColor(participantName + '1')} 100%)`
                }}
              >
                <span className="avatar-initials">{getInitials(participantName)}</span>
              </div>
            )}
            <div className="video-label">
              <span>{participantName}</span>
              {!hasVideo && (
                <div className="video-status">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.98z"/>
                  </svg>
                  <span>Camera off</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VideoGrid;
