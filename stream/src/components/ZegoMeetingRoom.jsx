import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import MeetingRoomOverlay from './MeetingRoomOverlay';
import ScreenAnnotation from './ScreenAnnotation';
import AIChat from './AIChat';
import './ZegoMeetingRoom.css';

function ZegoMeetingRoom({ callId, userName, userId, appID, serverSecret, onLeave }) {
  const zegoKitRef = useRef(null);
  const zegoKitInstanceRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // First user is admin

  useEffect(() => {
    if (!appID || !serverSecret || !callId || !userId) {
      console.error('Missing ZEGOCLOUD credentials');
      return;
    }

    const initializeZego = async () => {
      try {
        // Ensure appID is a number
        const appIDNumber = typeof appID === 'number' ? appID : Number(appID);
        
        if (isNaN(appIDNumber)) {
          throw new Error('ZEGOCLOUD App ID must be a valid number');
        }

        // Generate kitToken using ZEGOCLOUD's method
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appIDNumber, // Must be number
          serverSecret,
          callId, // roomID
          userId, // userID
          userName || `User-${userId.substring(0, 8)}` // userName
        );

        console.log('Generated kitToken, creating ZEGOCLOUD instance...');

        // Create ZEGOCLOUD instance
        const zegoKit = ZegoUIKitPrebuilt.create(kitToken);
        
        if (!zegoKit) {
          throw new Error('Failed to create ZEGOCLOUD instance');
        }

        zegoKitRef.current = zegoKit;
        zegoKitInstanceRef.current = zegoKit;

        // Check if user is admin (first user in room)
        // In a real app, you'd check this from the server
        const existingUsers = zegoKit.getAllUsers ? zegoKit.getAllUsers() : [];
        if (existingUsers.length === 0) {
          setIsAdmin(true);
        }

        // Wait for container to be ready
        const container = document.getElementById('zego-meeting-container');
        if (!container) {
          throw new Error('Container element not found');
        }

        console.log('Joining room...');

        // Join room with configuration
        zegoKit.joinRoom({
          container: container,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnCameraWhenJoining: false, // Start with camera off to avoid device errors
          turnOnMicrophoneWhenJoining: false, // Start with mic off to avoid device errors
          showMyCameraButtonOnView: true,
          showMyMicrophoneButtonOnView: true,
          showAudioVideoSettingsButton: true,
          showTextChat: true,
          showUserList: true,
          showScreenSharingButton: true,
          showLeavingView: false,
          onLeave: () => {
            if (zegoKitRef.current) {
              zegoKitRef.current.destroy();
              zegoKitRef.current = null;
            }
            onLeave();
          },
          // Customize theme - using ZEGOCLOUD's built-in theme options
          theme: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
          },
          // Branding customization (if supported)
          branding: {
            logoURL: '', // Add your logo URL here if you have one
            // Note: Some branding features may require paid plan
          },
          // Customize layout
          layout: 'Grid', // or 'Sidebar', 'Auto'
        });

        console.log('✅ ZEGOCLOUD initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing ZEGOCLOUD:', error);
        console.error('Error details:', {
          appID: appID,
          appIDType: typeof appID,
          hasServerSecret: !!serverSecret,
          callId,
          userId
        });
      }
    };

    initializeZego();

    return () => {
      // Cleanup
      if (zegoKitRef.current) {
        try {
          zegoKitRef.current.destroy();
          zegoKitRef.current = null;
        } catch (error) {
          console.error('Error destroying ZEGOCLOUD:', error);
        }
      }
    };
  }, [callId, userName, userId, appID, serverSecret, onLeave]);

  return (
    <div className="zego-meeting-wrapper">
      <div id="zego-meeting-container" className="zego-meeting-container"></div>
      
      {/* Top right controls - Share and Annotate */}
      <div className="top-right-controls">
        <button
          className="top-control-btn share-btn"
          onClick={() => setShowShareModal(true)}
          title="Share Meeting"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
        
        <button
          className={`top-control-btn annotate-btn ${showAnnotation ? 'active' : ''}`}
          onClick={() => setShowAnnotation(!showAnnotation)}
          title="Annotate Screen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
        </button>
      </div>

      {/* Left side - AI Chat Peek */}
      <div className="ai-chat-peek-container">
        <motion.button
          className={`ai-chat-peek-btn ${showAIChat ? 'active' : ''}`}
          onClick={() => setShowAIChat(!showAIChat)}
          title="AI Assistant"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="ai-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          {!showAIChat && (
            <>
              <div className="ai-message-bubble" style={{ animationDelay: '0s' }}>
                Hey! I'm here 👋
              </div>
              <div className="ai-message-bubble" style={{ animationDelay: '1.33s' }}>
                I can help you! ✨
              </div>
              <div className="ai-message-bubble" style={{ animationDelay: '2.66s' }}>
                Try me out 🚀
              </div>
            </>
          )}
        </motion.button>
      </div>

      {/* Share Meeting Modal */}
      {showShareModal && (
        <MeetingRoomOverlay
          callId={callId}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Screen Annotation Tool */}
      <ScreenAnnotation
        isActive={showAnnotation}
        onClose={() => setShowAnnotation(false)}
        zegoKit={zegoKitInstanceRef.current}
        callId={callId}
      />

      {/* AI Chat Panel */}
      <AIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        zegoKit={zegoKitInstanceRef.current}
        callId={callId}
        userId={userId}
        userName={userName}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default ZegoMeetingRoom;
