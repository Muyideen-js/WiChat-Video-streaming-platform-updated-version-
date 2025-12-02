import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import WiChatLogo from './WiChatLogo';
import './LandingPage.css';

// Icon components
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
    <path d="M16 3.13a4 4 0 010 7.75"></path>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
  </svg>
);

const MonitorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const UsersGroupIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const HandshakeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"></path>
    <path d="M7 18h1"></path>
    <path d="M16 12h1"></path>
    <path d="M15 9h.01"></path>
    <path d="M21 12h-3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3"></path>
    <path d="M21 12v-2a2 2 0 0 0-2-2h-3"></path>
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Check auth state and persist
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Save to localStorage
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        localStorage.setItem('wiChatUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: displayName
        }));
        // Also save as userName for meeting use
        localStorage.setItem('wiChatUserName', displayName);
      } else {
        setUser(null);
        localStorage.removeItem('wiChatUser');
      }
    });

    // Check localStorage on mount
    const savedUser = localStorage.getItem('wiChatUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (e) {
        localStorage.removeItem('wiChatUser');
      }
    }

    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const container = document.querySelector('.user-avatar-container');
      const dropdown = document.querySelector('.user-dropdown');
      
      if (showUserDropdown && container && dropdown) {
        if (!container.contains(target) && !dropdown.contains(target)) {
          setShowUserDropdown(false);
        }
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleStartMeeting = () => {
    // If not logged in, show modal. Otherwise, go to startmeeting page
    if (!user) {
      setShowModal(true);
    } else {
      // If user is logged in, use their display name as default
      const userDisplayName = user.displayName || user.email?.split('@')[0] || '';
      if (userDisplayName) {
        localStorage.setItem('wiChatUserName', userDisplayName);
      }
      navigate('/startmeeting');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('wiChatUser');
      setUser(null);
      setShowUserDropdown(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setIsLogin(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

    try {
      if (isLogin) {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const displayName = userCredential.user.displayName || name || email?.split('@')[0] || 'User';
        // Save user data
        localStorage.setItem('wiChatUser', JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName
        }));
        // Also save as userName for meeting use
        localStorage.setItem('wiChatUserName', displayName);
        setShowModal(false);
        navigate('/startmeeting');
      } else {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = name || email?.split('@')[0] || 'User';
        // Save user data
        localStorage.setItem('wiChatUser', JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName
        }));
        // Also save as userName for meeting use
        localStorage.setItem('wiChatUserName', displayName);
        setShowModal(false);
        navigate('/startmeeting');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      // Save user data
      localStorage.setItem('goveMeetUser', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'User'
      }));
      setShowModal(false);
      navigate('/startmeeting');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const features = [
    {
      icon: <VideoIcon />,
      title: 'HD Video',
      description: 'Crystal clear quality'
    },
    {
      icon: <ShieldIcon />,
      title: 'Secure',
      description: 'End-to-end encrypted'
    },
    {
      icon: <ZapIcon />,
      title: 'Fast',
      description: 'Ultra-low latency'
    },
    {
      icon: <UsersIcon />,
      title: 'Unlimited',
      description: 'No participant limits'
    }
  ];

  const benefits = [
    { icon: <GlobeIcon />, text: 'No downloads' },
    { icon: <MonitorIcon />, text: 'All devices' },
    { icon: <MonitorIcon />, text: 'Screen share' },
    { icon: <MessageIcon />, text: 'Chat included' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Director, Federal Agency',
      text: 'Wi-Chat transformed our remote collaboration with seamless, reliable communications.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'IT Security Manager',
      text: 'Best video platform for remote teams. Seamless experience and reliable quality.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Department Head',
      text: 'Love the clean interface and intuitive features. Highly recommend!',
      rating: 5
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <motion.nav
        className="landing-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <WiChatLogo />
          <div className="nav-right">
            <motion.button
              className="nav-btn"
              onClick={handleStartMeeting}
              whileTap={{ scale: 0.95 }}
            >
              <PlayIcon />
              <span>{user ? 'Start Meeting' : 'Get Started'}</span>
            </motion.button>
            {user && (
              <div className="user-avatar-container">
                <button 
                  className="user-avatar-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  aria-label="User menu"
                >
                  <div className="user-avatar">
                    {(user.displayName || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-text">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                </button>
                {showUserDropdown && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-avatar">
                        {(user.displayName || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="user-dropdown-info">
                        <div className="user-dropdown-name">{user.displayName || user.email?.split('@')[0] || 'User'}</div>
                        <div className="user-dropdown-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <button className="user-dropdown-item" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>✨</span>
              <span>Trusted by teams worldwide</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Seamless Video
              <br />
              <span className="gradient-text">Conferencing</span>
            </motion.h1>
            
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Connect with your team instantly. High-quality video calls with enterprise-grade security and privacy.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.button
                className="btn-primary"
                onClick={handleStartMeeting}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon />
                <span>{user ? 'Start Meeting' : 'Get Started'}</span>
                <ArrowRightIcon />
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            className="hero-image"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80" 
              alt="Video Meeting" 
              className="hero-img"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Wi-Chat?
          </motion.h2>
          
          <div className="features-grid-new">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card-new"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon-new">
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <div className="benefits-content">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Everything You Need
            </motion.h2>
            <motion.p
              className="benefits-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              All the tools for productive meetings in one place.
            </motion.p>
            
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="benefit-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {benefit.icon}
                  <span>{benefit.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          
          <div className="steps-grid">
            {[
              {
                number: '01',
                title: 'Create Room',
                description: 'Start a new meeting instantly'
              },
              {
                number: '02',
                title: 'Invite Team',
                description: 'Share link with participants'
              },
              {
                number: '03',
                title: 'Connect',
                description: 'Start collaborating'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="step-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '50K+', label: 'Meetings Daily' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="stat-number">{stat.number}</div>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What People Say
          </motion.h2>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="section-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Simple Pricing
          </motion.h2>
          
          <div className="pricing-grid">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['Up to 10 participants', 'HD video quality', 'Screen sharing', 'Chat included']
              },
              {
                name: 'Pro',
                price: '$9',
                period: 'per month',
                features: ['Unlimited participants', 'HD video quality', 'Screen sharing', 'Chat included', 'Record sessions', 'Priority support']
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`pricing-card ${index === 1 ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <h3>{plan.name}</h3>
                <div className="pricing-amount">
                  <span className="price">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <span>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <div className="section-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Perfect For Every Team
          </motion.h2>
          
          <div className="use-cases-grid">
            {[
              {
                title: 'Remote Teams',
                description: 'Connect your distributed team with seamless video meetings and collaboration tools.',
                iconComponent: <UsersGroupIcon />
              },
              {
                title: 'Client Meetings',
                description: 'Professional video calls with clients, partners, and stakeholders worldwide.',
                iconComponent: <HandshakeIcon />
              },
              {
                title: 'Online Classes',
                description: 'Conduct interactive online classes and training sessions with ease.',
                iconComponent: <BookIcon />
              },
              {
                title: 'Webinars',
                description: 'Host large-scale webinars and virtual events with unlimited participants.',
                iconComponent: <MicIcon />
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                className="use-case-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="use-case-icon">{useCase.iconComponent}</div>
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section">
        <div className="section-container">
          <div className="security-content">
            <motion.div
              className="security-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Enterprise-Grade Security</h2>
                  <p>Your privacy and security are our top priorities. Wi-Chat uses enterprise-grade encryption to protect your data and conversations.</p>
              <ul className="security-features">
                {[
                  'End-to-end encryption',
                  'GDPR compliant',
                  'SOC 2 certified',
                  'Regular security audits',
                  'Data encryption at rest',
                  'Secure authentication'
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CheckCircleIcon />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="security-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="security-badge">
                <ShieldIcon />
                <span>Secure</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="faq-grid">
            {[
              {
                question: 'Do I need to download anything?',
                answer: 'No, Wi-Chat works directly in your web browser. No downloads or installations required.'
              },
              {
                question: 'How many people can join a meeting?',
                answer: 'Free plan supports up to 10 participants. Pro plan supports unlimited participants.'
              },
              {
                question: 'Is my data secure?',
                answer: 'Yes, all meetings are end-to-end encrypted and your data is protected with enterprise-grade security.'
              },
              {
                question: 'Can I record meetings?',
                answer: 'Recording is available in the Pro plan. You can record and save your meetings for later viewing.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="faq-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Get Started?</h2>
                <p>Join teams using Wi-Chat for seamless collaboration.</p>
            <motion.button
              className="btn-primary btn-large"
              onClick={handleStartMeeting}
              whileTap={{ scale: 0.95 }}
            >
              <PlayIcon />
              <span>{user ? 'Start Meeting' : 'Get Started'}</span>
              <ArrowRightIcon />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-container">
          <p>&copy; {new Date().getFullYear()} Wi-Chat. All rights reserved.</p>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={handleCloseModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="modal-header">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form className="modal-form" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" placeholder="Enter your name" required />
                  </div>
                )}
                
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="Enter your email" required />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      placeholder="Enter your password" 
                      required 
                      minLength={6} 
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="forgot-link">Forgot password?</a>
                  </div>
                )}

                <button type="submit" className="btn-primary btn-full" disabled={loading}>
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
              </form>

              <div className="modal-divider">
                <span>Or</span>
              </div>

              <div className="social-buttons">
                <button className="social-btn" type="button" onClick={handleGoogleSignIn} disabled={loading}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="modal-footer">
                <p>
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button className="link-btn" onClick={switchMode}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;
