import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MeetingRoomOverlay.css';

function MeetingRoomOverlay({ callId, onClose }) {
  const [copied, setCopied] = useState(false);

  const meetingUrl = `${window.location.origin}/meeting/${callId}`;
  const hostName = localStorage.getItem('wiChatUserName') || 'Host';
  const createdAt = new Date().toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="meeting-overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="meeting-overlay-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overlay-header">
            <h3>Share Meeting</h3>
            <button className="close-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="overlay-body">
            <p className="overlay-label">Meeting Link</p>
            <div className="url-container">
              <input
                type="text"
                value={meetingUrl}
                readOnly
                className="url-input"
              />
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <p className="overlay-label">Meeting ID</p>
            <div className="meeting-id-display">
              <code>{callId}</code>
              <button
                className="copy-id-btn"
                onClick={() => {
                  navigator.clipboard.writeText(callId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                title="Copy Meeting ID"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            <div className="smart-preview">
              <p className="smart-preview-label">Smart link preview</p>
              <div className="smart-preview-card">
                <div className="smart-preview-main">
                  <h4 className="smart-preview-title">Wi-Chat instant room</h4>
                  <p className="smart-preview-subtitle">Secure video meeting powered by Wi-Chat</p>
                </div>
                <div className="smart-preview-meta">
                  <div className="smart-preview-host">
                    <div className="smart-preview-avatar">
                      {hostName.charAt(0).toUpperCase()}
                    </div>
                    <div className="smart-preview-host-text">
                      <span className="host-name">Host: {hostName}</span>
                      <span className="host-time">Created {createdAt}</span>
                    </div>
                  </div>
                  <p className="smart-preview-note">Anyone with this link can request to join.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MeetingRoomOverlay;

