import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import ZegoCallWrapper from './components/ZegoCallWrapper';
import WiChatLogo from './components/WiChatLogo';
import './App.css';

function MeetingRoute() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(() => {
    // Try to get name from localStorage first
    return localStorage.getItem('wiChatUserName') || '';
  });
  const [userId, setUserId] = useState(() => {
    // Try to get userId from localStorage first
    const savedId = localStorage.getItem('wiChatUserId');
    return savedId || null;
  });
  const [showNameInput, setShowNameInput] = useState(() => {
    // Only show name input if we don't have a name
    return !localStorage.getItem('wiChatUserName');
  });
  const [roomExists, setRoomExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if room exists
    if (roomId) {
      fetch(`http://localhost:3001/api/meeting/${roomId}`)
        .then(res => res.json())
        .then(data => {
          setRoomExists(data.exists);
          setLoading(false);
          if (!data.exists) {
            setTimeout(() => navigate('/startmeeting'), 2000);
          } else {
            // If room exists and we have a name, we can join directly
            const savedName = localStorage.getItem('wiChatUserName');
            const savedUserId = localStorage.getItem('wiChatUserId');
            if (savedName && savedUserId) {
              setUserName(savedName);
              setUserId(savedUserId);
              setShowNameInput(false);
            }
          }
        })
        .catch(() => {
          setLoading(false);
          setTimeout(() => navigate('/startmeeting'), 2000);
        });
    }
  }, [roomId, navigate]);

  const handleJoin = (name) => {
    if (!name.trim()) return;
    const trimmedName = name.trim();
    setUserName(trimmedName);
    // Save name to localStorage
    localStorage.setItem('wiChatUserName', trimmedName);
    
    // Generate or use existing userId
    const savedUserId = localStorage.getItem('wiChatUserId');
    const newUserId = savedUserId || crypto.randomUUID();
    if (!savedUserId) {
      localStorage.setItem('wiChatUserId', newUserId);
    }
    setUserId(newUserId);
    setShowNameInput(false);
  };

  const handleLeave = () => {
    // Clear meeting-specific data but keep userName for next time
    localStorage.removeItem('wiChatUserId');
    navigate('/startmeeting');
  };

  if (loading) {
    return (
      <div className="join-prompt">
        <motion.div
          className="join-prompt-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <WiChatLogo />
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Checking room...</p>
        </motion.div>
      </div>
    );
  }

  if (!roomExists) {
    return (
      <div className="join-prompt">
        <motion.div
          className="join-prompt-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <WiChatLogo />
          <h2>Room Not Found</h2>
          <p>This meeting room doesn't exist or has expired.</p>
          <button onClick={() => navigate('/startmeeting')}>Go Back</button>
        </motion.div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="join-prompt">
        <motion.div
          className="join-prompt-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <WiChatLogo />
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Join Meeting
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Room: <strong>{roomId}</strong>
          </motion.p>
          <motion.input
            type="text"
            placeholder="Enter your name"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleJoin(e.target.value);
              }
            }}
            autoFocus
          />
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const input = document.querySelector('.join-prompt-content input');
              if (input) handleJoin(input.value);
            }}
          >
            Join Meeting
          </motion.button>
          <motion.button
            className="back-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/startmeeting')}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <ZegoCallWrapper
      callId={roomId}
      userName={userName}
      userId={userId}
      onLeave={handleLeave}
    />
  );
}

function App() {
  const [inMeeting, setInMeeting] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleJoinMeeting = async (id, name, uid) => {
    setMeetingId(id);
    setUserName(name);
    setUserId(uid);
    setInMeeting(true);
    // Update URL
    window.history.pushState({}, '', `/meeting/${id}`);
  };

  const handleLeaveMeeting = () => {
    setInMeeting(false);
    setMeetingId(null);
    setUserName(null);
    setUserId(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route 
            path="/meeting/:roomId" 
            element={<MeetingRoute />} 
          />
          <Route 
            path="/startmeeting" 
            element={<Home />} 
          />
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
