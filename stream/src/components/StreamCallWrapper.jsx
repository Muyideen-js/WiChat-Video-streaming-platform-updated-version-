import { useEffect, useState, useRef } from 'react';
import { StreamVideo, StreamVideoClient, StreamCall } from '@stream-io/video-react-sdk';
import { STREAM_API_KEY } from '../config/streamConfig';
import StreamMeetingRoom from './StreamMeetingRoom';
import './StreamCallWrapper.css';

function StreamCallWrapper({ callId, userName, userId, userToken, onLeave }) {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const clientRef = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    if (!userToken || !userId || !callId) {
      setError('Missing required connection parameters');
      return;
    }

    let isMounted = true;
    setConnectionStatus('connecting');
    setError(null);

    const initializeConnection = async () => {
      try {
        // Create client instance
        const myClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
        });
        clientRef.current = myClient;

        // Connect user to Stream
        await myClient.connectUser(
          {
            id: userId,
            name: userName || `User-${userId.substring(0, 8)}`,
          },
          userToken
        );

        if (!isMounted) {
          myClient.disconnectUser();
          return;
        }

        console.log('✅ User connected to Stream successfully');
        setConnectionStatus('connected');
        setClient(myClient);

        // Wait for connection to stabilize
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create call instance
        const myCall = myClient.call('default', callId);
        callRef.current = myCall;
        setCall(myCall);
        setConnectionStatus('ready');

      } catch (err) {
        console.error('❌ Connection error:', err);
        if (isMounted) {
          setError(err.message || 'Failed to connect to Stream');
          setConnectionStatus('error');
        }
      }
    };

    initializeConnection();

    return () => {
      isMounted = false;
      if (callRef.current) {
        callRef.current.leave().catch(console.error);
      }
      if (clientRef.current) {
        clientRef.current.disconnectUser().catch(console.error);
      }
    };
  }, [userToken, userId, userName, callId]);

  // Loading state
  if (connectionStatus === 'connecting' || connectionStatus === 'connected' || !client || !call) {
    return (
      <div className="stream-connection-wrapper">
        <div className="connection-status">
          <div className="connection-spinner"></div>
          <div className="connection-message">
            {connectionStatus === 'connecting' && <p>Connecting to Stream...</p>}
            {connectionStatus === 'connected' && <p>Initializing call...</p>}
            {connectionStatus === 'ready' && <p>Joining meeting...</p>}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (connectionStatus === 'error' || error) {
    return (
      <div className="stream-connection-wrapper">
        <div className="connection-error">
          <div className="error-icon">⚠️</div>
          <h3>Connection Failed</h3>
          <p>{error || 'Unable to connect to the video service'}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
          <button 
            className="back-button"
            onClick={onLeave}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main meeting room
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamMeetingRoom
          callId={callId}
          userName={userName}
          userId={userId}
          onLeave={onLeave}
        />
      </StreamCall>
    </StreamVideo>
  );
}

export default StreamCallWrapper;
