import { useEffect, useState } from 'react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { STREAM_API_KEY } from '../config/streamConfig';

function StreamProvider({ children, userToken, userId, userName }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!userToken || !userId) return;

    const myClient = new StreamVideoClient({
      apiKey: STREAM_API_KEY,
      user: {
        id: userId,
        name: userName || `User-${userId.substring(0, 6)}`,
      },
      token: userToken,
    });

    setClient(myClient);

    return () => {
      myClient.disconnectUser();
    };
  }, [userToken, userId, userName]);

  if (!client) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        color: 'white'
      }}>
        <div>
          <div className="spinner"></div>
          <p>Connecting to Stream...</p>
        </div>
      </div>
    );
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
}

export default StreamProvider;

