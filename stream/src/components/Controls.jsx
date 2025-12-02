import './Controls.css';

function Controls({
  isVideoOn,
  isAudioOn,
  isScreenSharing,
  onToggleVideo,
  onToggleAudio,
  onStartScreenShare,
  onStopScreenShare,
  onToggleChat,
  showChat,
  onLeave,
}) {
  return (
    <div className="controls">
      <div className="control-group">
        <button
          className={`control-btn ${!isAudioOn ? 'active' : ''}`}
          onClick={onToggleAudio}
          title={isAudioOn ? 'Mute' : 'Unmute'}
        >
          {isAudioOn ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
          <span>{isAudioOn ? 'Mute' : 'Unmute'}</span>
        </button>

        <button
          className={`control-btn ${!isVideoOn ? 'active' : ''}`}
          onClick={onToggleVideo}
          title={isVideoOn ? 'Turn off video' : 'Turn on video'}
        >
          {isVideoOn ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6.5l-4 4v-3.5c0-.55-.45-1-1-1H6.83l1.59-1.59c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L3 8.59l3.01 3.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L6.83 10H16v8H4c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1v-8l4 4V6.5z"/>
            </svg>
          )}
          <span>{isVideoOn ? 'Stop Video' : 'Start Video'}</span>
        </button>

        <button
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={isScreenSharing ? onStopScreenShare : onStartScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
          </svg>
          <span>{isScreenSharing ? 'Stop Sharing' : 'Share'}</span>
        </button>

        <button
          className={`control-btn ${showChat ? 'active' : ''}`}
          onClick={onToggleChat}
          title="Toggle chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          <span>Chat</span>
        </button>

        <button
          className="control-btn leave-btn"
          onClick={onLeave}
          title="Leave meeting"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}

export default Controls;

