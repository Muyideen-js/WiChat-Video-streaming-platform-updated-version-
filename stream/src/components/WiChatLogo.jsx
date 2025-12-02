import { motion } from 'framer-motion';
import './WiChatLogo.css';

function WiChatLogo() {
  return (
    <div className="wichat-logo">
      <motion.div
        className="logo-icon"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="6" fill="url(#logoGradient)"/>
          <circle cx="14" cy="14" r="5" fill="white" opacity="0.95"/>
          <circle cx="14" cy="14" r="2.5" fill="url(#logoGradient)"/>
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb"/>
              <stop offset="1" stopColor="#1d4ed8"/>
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <motion.span 
        className="logo-text"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        Wi-Chat
      </motion.span>
    </div>
  );
}

export default WiChatLogo;
