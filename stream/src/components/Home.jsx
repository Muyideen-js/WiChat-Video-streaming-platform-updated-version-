import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import WiChatLogo from './WiChatLogo';
import AdsSection from './AdsSection';
import { apiEndpoints } from '../config/apiConfig';
import './Home.css';

function Home() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'
  const [meetingId, setMeetingId] = useState('');
  const [userName, setUserName] = useState(() => {
    // Load saved name from localStorage if available
    return localStorage.getItem('wiChatUserName') || '';
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [createdMeetingId, setCreatedMeetingId] = useState('');

  // ZEGOCLOUD doesn't need token fetching in the same way
  // Token generation is handled by the backend when needed

  const handleCreateMeeting = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsCreating(true);
    setError('');
    try {
      // Create meeting
      const response = await fetch(apiEndpoints.createMeeting(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const meetingId = data.meetingId;
      setCreatedMeetingId(meetingId);

      // Store userName in localStorage for use throughout the app
      localStorage.setItem('wiChatUserName', userName.trim());
      
      // Go directly to meeting
      const userId = uuidv4();
      localStorage.setItem('wiChatUserId', userId);
      window.location.href = `/meeting/${meetingId}`;
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create meeting. Please try again.');
      setIsCreating(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) {
      setError('Please enter a meeting ID');
      return;
    }
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsJoining(true);
    setError('');
    try {
      const response = await fetch(apiEndpoints.checkMeeting(meetingId));
      const data = await response.json();
      
      if (data.exists) {
        // Store userName in localStorage for use throughout the app
        localStorage.setItem('wiChatUserName', userName.trim());
        
        // Go directly to meeting
        const userId = uuidv4();
        localStorage.setItem('wiChatUserId', userId);
        window.location.href = `/meeting/${meetingId}`;
        setIsJoining(false);
      } else {
        setError('Meeting not found. Please check the meeting ID.');
        setIsJoining(false);
      }
    } catch (err) {
      setError('Failed to join meeting. Please try again.');
      setIsJoining(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (activeTab === 'create') {
        handleCreateMeeting();
      } else {
        handleJoinMeeting();
      }
    }
  };

  const copyMeetingId = () => {
    if (createdMeetingId) {
      const meetingUrl = `${window.location.origin}/meeting/${createdMeetingId}`;
      navigator.clipboard.writeText(meetingUrl);
      alert('Meeting URL copied to clipboard! Share this link with others.');
    }
  };

  const copyMeetingUrl = () => {
    if (createdMeetingId) {
      const meetingUrl = `${window.location.origin}/meeting/${createdMeetingId}`;
      navigator.clipboard.writeText(meetingUrl);
      // Show a nice notification instead of alert
      const btn = document.querySelector('.btn-copy-url');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.background = '#43e97b';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 2000);
      }
    }
  };


  return (
    <div className="home-container">
      <AdsSection />
      <div className="home-content">
        <div className="home-header">
          <WiChatLogo />
          <p>Professional video conferencing</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('create');
              setError('');
              setMeetingId('');
            }}
          >
            Create Meeting
          </button>
          <button
            className={`tab ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('join');
              setError('');
            }}
          >
            Join Meeting
          </button>
        </div>

        <div className="home-form">
          <div className="input-group">
            <label htmlFor="userName">Your Name</label>
            <input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              spellCheck="false"
            />
          </div>

          {activeTab === 'join' && (
            <div className="input-group">
              <label htmlFor="meetingId">Meeting ID</label>
              <input
                id="meetingId"
                type="text"
                placeholder="Enter meeting ID"
                value={meetingId}
                onChange={(e) => {
                  setMeetingId(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                spellCheck="false"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {createdMeetingId && activeTab === 'create' && (
            <div className="meeting-created">
              <div className="meeting-url-display">
                <p className="meeting-url-label">Meeting URL:</p>
                <div className="meeting-url-box">
                  <code>{window.location.origin}/meeting/{createdMeetingId}</code>
                  <button 
                    onClick={copyMeetingUrl}
                    className="btn-copy-url"
                    title="Copy meeting URL"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="meeting-url-hint">Share this link with others to join the meeting</p>
              </div>
            </div>
          )}

          <div className="button-group">
            {activeTab === 'create' ? (
              <button 
                onClick={handleCreateMeeting} 
                disabled={isCreating}
                className="btn btn-primary"
              >
                {isCreating ? 'Creating...' : 'Create Meeting'}
              </button>
            ) : (
              <button 
                onClick={handleJoinMeeting}
                disabled={isJoining || !meetingId.trim()}
                className="btn btn-primary"
              >
                {isJoining ? 'Joining...' : 'Join Meeting'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

