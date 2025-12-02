import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WiChatLogo from './WiChatLogo';
import './MeetingLanding.css';

function MeetingLanding({ meetingId, userName, onStartMeeting, onGoBack, isCreating }) {
  const [localStream, setLocalStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Get user media for preview
    const initializePreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsVideoOn(true);
        setIsAudioOn(true);
      } catch (error) {
        console.error('Error accessing media:', error);
        setIsVideoOn(false);
        setIsAudioOn(false);
      }
    };

    // Enumerate devices
    const enumerateDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videos = devices.filter(d => d.kind === 'videoinput');
        const audios = devices.filter(d => d.kind === 'audioinput');
        setVideoDevices(videos);
        setAudioDevices(audios);
        if (videos.length > 0) setSelectedVideoDevice(videos[0].deviceId);
        if (audios.length > 0) setSelectedAudioDevice(audios[0].deviceId);
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    };

    initializePreview();
    enumerateDevices();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const handleStartMeeting = () => {
    if (localStream) {
      // Stop preview tracks - they'll be re-requested in the meeting
      localStream.getTracks().forEach(track => track.stop());
    }
    setIsReady(true);
    setTimeout(() => {
      onStartMeeting();
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {!isReady ? (
        <motion.div
          className="meeting-landing"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="landing-background">
            <div className="bg-gradient-1"></div>
            <div className="bg-gradient-2"></div>
            <div className="bg-pattern"></div>
          </div>

          <motion.div
            className="landing-content"
            variants={itemVariants}
          >
            <motion.div
              className="landing-header"
              variants={itemVariants}
            >
              <WiChatLogo />
              <motion.h1
                className="landing-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {isCreating ? 'Room Created!' : 'Ready to Join?'}
              </motion.h1>
              <motion.p
                className="landing-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {isCreating 
                  ? `Your meeting room is ready. Test your devices before starting.`
                  : `You're about to join the meeting. Check your setup below.`
                }
              </motion.p>
            </motion.div>

            <motion.div
              className="meeting-info-card"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="info-row">
                <span className="info-label">Meeting ID</span>
                <motion.span
                  className="info-value"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  {meetingId}
                </motion.span>
              </div>
              <div className="info-row">
                <span className="info-label">Your Name</span>
                <motion.span
                  className="info-value"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  {userName}
                </motion.span>
              </div>
              <div className="info-row share-row">
                <span className="info-label">Meeting Link</span>
                <div className="share-link-container">
                  <motion.input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/meeting/${meetingId}`}
                    className="share-link-input"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  />
                  <motion.button
                    className="btn-copy-link"
                    onClick={() => {
                      const link = `${window.location.origin}/meeting/${meetingId}`;
                      navigator.clipboard.writeText(link);
                      const btn = document.querySelector('.btn-copy-link');
                      if (btn) {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        setTimeout(() => {
                          btn.innerHTML = originalText;
                        }, 2000);
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </motion.button>
                </div>
              </div>
            </motion.div>


            <motion.div
              className="action-buttons"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.button
                className="btn-start-meeting"
                onClick={handleStartMeeting}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.span
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1 }}
                >
                  Start Meeting
                </motion.span>
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                >
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </motion.svg>
              </motion.button>
              <motion.button
                className="btn-back"
                onClick={onGoBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
              >
                Go Back
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="transition-screen"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading-spinner-large"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Joining meeting...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MeetingLanding;

