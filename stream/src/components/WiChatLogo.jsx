import { motion } from 'framer-motion';
import './WiChatLogo.css';

function WiChatLogo() {
  return (
    <div className="wichat-logo">
      <motion.div
        className="logo-icon"
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="12" fill="url(#logoGradient)" />
          <path
            d="M12 12.5C12 10.567 13.567 9 15.5 9H23C25.2091 9 27 10.7909 27 13V19.5C27 21.433 25.433 23 23.5 23H21.2L17 27.2C16.1139 28.0861 14.6 27.4589 14.6 26.2V23H15.5C13.567 23 12 21.433 12 19.5V12.5Z"
            fill="white"
            opacity="0.95"
          />
          <circle cx="20" cy="16" r="3" fill="url(#logoGradient)" opacity="0.9" />
          <circle cx="15" cy="16" r="1.8" fill="white" opacity="0.9" />
          <defs>
            <linearGradient id="logoGradient" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <div className="logo-text-group">
        <motion.span
          className="logo-text"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          Wi-Chat
        </motion.span>
        <motion.span
          className="logo-tagline"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
        >
          Modern Collaboration Suite
        </motion.span>
      </div>
    </div>
  );
}

export default WiChatLogo;
