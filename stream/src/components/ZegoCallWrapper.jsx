import { ZEGO_APP_ID, ZEGO_SERVER_SECRET } from '../config/zegoConfig';
import ZegoMeetingRoom from './ZegoMeetingRoom';
import './ZegoCallWrapper.css';

function ZegoCallWrapper({ callId, userName, userId, onLeave }) {
  // Check if credentials are set
  if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET || ZEGO_SERVER_SECRET === 'YOUR_SERVER_SECRET') {
    return (
      <div className="zego-setup-required">
        <div className="setup-content">
          <h2>ZEGOCLOUD Setup Required</h2>
          <p>Please configure your ZEGOCLOUD credentials:</p>
          <ol>
            <li>Sign up at <a href="https://console.zegocloud.com/" target="_blank" rel="noopener noreferrer">ZEGOCLOUD Console</a></li>
            <li>Create a new project</li>
            <li>Get your App ID and Server Secret</li>
            <li>Add them to <code>stream/src/config/zegoConfig.js</code> or create a <code>.env</code> file</li>
          </ol>
          <button className="back-button" onClick={onLeave}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ZegoMeetingRoom
      callId={callId}
      userName={userName}
      userId={userId}
      appID={ZEGO_APP_ID}
      serverSecret={ZEGO_SERVER_SECRET}
      onLeave={onLeave}
    />
  );
}

export default ZegoCallWrapper;

