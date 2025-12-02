import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdsSection.css';

const highlightPhrases = [
  'Hybrid Teams',
  'Product Launches',
  'Client Demos',
  'Async Standups',
];

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 10.5V7C17 5.895 16.105 5 15 5H5C3.895 5 3 5.895 3 7V17C3 18.105 3.895 19 5 19H15C16.105 19 17 18.105 17 17V13.5L21 17.5V6.5L17 10.5Z" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: 'HD Video Quality',
    description: 'Crystal clear video calls'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 8V12" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16H12.01" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8L16 16" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 8L8 16" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Secure & Private',
    description: 'End-to-end encryption'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.939 16.579 16.844 15.828 16.093C15.078 15.343 13.983 14.922 12.922 14.922H5.078C4.017 14.922 2.922 15.343 2.172 16.093C1.421 16.844 1 17.939 1 19V21" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M9 11C11.209 11 13 9.209 13 7C13 4.791 11.209 3 9 3C6.791 3 5 4.791 5 7C5 9.209 6.791 11 9 11Z" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M23 21V19C23 18.114 22.704 17.253 22.161 16.552C21.618 15.852 20.858 15.352 20 15.13" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M16 3.13C16.86 3.35 17.623 3.851 18.168 4.552C18.712 5.254 19.008 6.117 19.008 7.005C19.008 7.893 18.712 8.756 18.168 9.458C17.623 10.159 16.86 10.66 16 10.88" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: 'Unlimited Participants',
    description: 'Connect with everyone'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18Z" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M2 12H4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 12H22" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 4V6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V20" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.93 4.93L6.34 6.34" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.66 17.66L19.07 19.07" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.93 19.07L6.34 17.66" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.66 6.34L19.07 4.93" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Cross Platform',
    description: 'Works everywhere'
  },
];

function AdsSection() {
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % highlightPhrases.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ads-section">
      <motion.div
        className="ads-content"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="ads-header"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            className="ads-title"
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Wi-Chat powers bold collaboration.
          </motion.h2>
          <motion.div 
            className="headline-rotator"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <motion.span 
              className="rotator-label"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              Built for
            </motion.span>
            <div className="rotator-window">
              <AnimatePresence mode="wait">
                <motion.span
                  key={highlightPhrases[highlightIndex]}
                  initial={{ y: '100%', opacity: 0, rotateX: 90 }}
                  animate={{ y: '0%', opacity: 1, rotateX: 0 }}
                  exit={{ y: '-100%', opacity: 0, rotateX: -90 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {highlightPhrases[highlightIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.p 
            className="ads-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            Seamless rooms, live collaboration, and flexible workspaces for modern teams.
          </motion.p>
        </motion.div>

        <motion.div 
          className="features-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {features.map((feature, index) => {
            // Different entrance animations for each card
            const animations = [
              { initial: { opacity: 0, x: -50, rotate: -10 }, animate: { opacity: 1, x: 0, rotate: 0 } },
              { initial: { opacity: 0, y: 50, scale: 0.8 }, animate: { opacity: 1, y: 0, scale: 1 } },
              { initial: { opacity: 0, x: 50, rotate: 10 }, animate: { opacity: 1, x: 0, rotate: 0 } },
              { initial: { opacity: 0, y: -50, scale: 0.8 }, animate: { opacity: 1, y: 0, scale: 1 } },
            ];
            const anim = animations[index % animations.length];
            
            return (
              <motion.div
                key={index}
                className="feature-card"
                initial={anim.initial}
                animate={anim.animate}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.div
                  className="feature-icon"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.9 + index * 0.15, 
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  {feature.icon}
                </motion.div>
                <motion.div 
                  className="feature-content"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.15 }}
                >
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + index * 0.15 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.15 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="ads-footer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="stats-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            {[
              { number: '10K+', label: 'Users' },
              { number: '50K+', label: 'Meetings' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => {
              const statAnimations = [
                { initial: { opacity: 0, y: 30, rotateX: -45 }, animate: { opacity: 1, y: 0, rotateX: 0 } },
                { initial: { opacity: 0, scale: 0.5, rotate: -180 }, animate: { opacity: 1, scale: 1, rotate: 0 } },
                { initial: { opacity: 0, x: 30, rotateY: -45 }, animate: { opacity: 1, x: 0, rotateY: 0 } },
              ];
              const statAnim = statAnimations[index % statAnimations.length];
              
              return (
                <motion.div
                  key={index}
                  className="stat-card"
                  initial={statAnim.initial}
                  animate={statAnim.animate}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.7 + index * 0.2, 
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  <motion.div 
                    className="stat-number"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.9 + index * 0.2,
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <motion.div 
                    className="stat-label"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 2 + index * 0.2 }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AdsSection;
