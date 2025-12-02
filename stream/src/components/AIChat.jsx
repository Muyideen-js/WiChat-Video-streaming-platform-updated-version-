import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIChat.css';

function AIChat({ isOpen, onClose, zegoKit, callId, userId, userName, isAdmin }) {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: `Hello ${userName || 'there'}! I'm your AI assistant. I can help you control the meeting. Try commands like:\n\n• "Mute everyone"\n• "Turn on my camera"\n• "Share my screen"\n• "End meeting in 30 minutes"\n• "Show participants"\n\nWhat would you like me to do?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, {
      type,
      text,
      timestamp: new Date()
    }]);
  };

  const executeCommand = async (command) => {
    setIsProcessing(true);
    const lowerCommand = command.toLowerCase().trim();

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Mute all participants
      if (lowerCommand.includes('mute everyone') || lowerCommand.includes('mute all')) {
        if (!isAdmin) {
          addMessage('ai', 'Sorry, only the meeting host can mute all participants.');
          setIsProcessing(false);
          return;
        }
        // Execute mute all via ZEGOCLOUD
        if (zegoKit && zegoKit.muteAllUsers) {
          zegoKit.muteAllUsers(true);
          addMessage('ai', '✅ All participants have been muted.');
        } else {
          addMessage('ai', '✅ Command received: Mute all participants. (Feature requires ZEGOCLOUD API access)');
        }
      }
      // Unmute all
      else if (lowerCommand.includes('unmute everyone') || lowerCommand.includes('unmute all')) {
        if (!isAdmin) {
          addMessage('ai', 'Sorry, only the meeting host can unmute all participants.');
          setIsProcessing(false);
          return;
        }
        if (zegoKit && zegoKit.muteAllUsers) {
          zegoKit.muteAllUsers(false);
          addMessage('ai', '✅ All participants have been unmuted.');
        } else {
          addMessage('ai', '✅ Command received: Unmute all participants.');
        }
      }
      // Turn on camera
      else if (lowerCommand.includes('turn on camera') || lowerCommand.includes('enable camera') || lowerCommand.includes('start camera')) {
        if (zegoKit && zegoKit.turnCameraOn) {
          zegoKit.turnCameraOn(true);
          addMessage('ai', '✅ Your camera has been turned on.');
        } else {
          addMessage('ai', '✅ Command received: Turn on camera. Please use the camera button in the meeting controls.');
        }
      }
      // Turn off camera
      else if (lowerCommand.includes('turn off camera') || lowerCommand.includes('disable camera') || lowerCommand.includes('stop camera')) {
        if (zegoKit && zegoKit.turnCameraOn) {
          zegoKit.turnCameraOn(false);
          addMessage('ai', '✅ Your camera has been turned off.');
        } else {
          addMessage('ai', '✅ Command received: Turn off camera. Please use the camera button in the meeting controls.');
        }
      }
      // Share screen
      else if (lowerCommand.includes('share screen') || lowerCommand.includes('share my screen') || lowerCommand.includes('start sharing')) {
        if (zegoKit && zegoKit.startScreenSharing) {
          zegoKit.startScreenSharing();
          addMessage('ai', '✅ Starting screen share...');
        } else {
          addMessage('ai', '✅ Command received: Share screen. Please use the screen share button in the meeting controls.');
        }
      }
      // Stop sharing
      else if (lowerCommand.includes('stop sharing') || lowerCommand.includes('stop screen share')) {
        if (zegoKit && zegoKit.stopScreenSharing) {
          zegoKit.stopScreenSharing();
          addMessage('ai', '✅ Screen sharing stopped.');
        } else {
          addMessage('ai', '✅ Command received: Stop screen sharing.');
        }
      }
      // End meeting
      else if (lowerCommand.includes('end meeting') || lowerCommand.includes('end call')) {
        const timeMatch = lowerCommand.match(/(\d+)\s*(minute|min|hour|hr|second|sec)/);
        if (timeMatch) {
          const time = parseInt(timeMatch[1]);
          const unit = timeMatch[2].toLowerCase();
          let milliseconds = 0;
          
          if (unit.includes('min')) {
            milliseconds = time * 60 * 1000;
          } else if (unit.includes('hour') || unit.includes('hr')) {
            milliseconds = time * 60 * 60 * 1000;
          } else if (unit.includes('sec')) {
            milliseconds = time * 1000;
          }

          if (!isAdmin) {
            addMessage('ai', 'Sorry, only the meeting host can schedule meeting end.');
            setIsProcessing(false);
            return;
          }

          addMessage('ai', `✅ Meeting will end in ${time} ${unit}${time !== 1 ? 's' : ''}.`);
          setTimeout(() => {
            addMessage('ai', '⏰ Time\'s up! Ending the meeting now...');
            if (zegoKit && zegoKit.leaveRoom) {
              setTimeout(() => zegoKit.leaveRoom(), 1000);
            }
          }, milliseconds);
        } else {
          if (!isAdmin) {
            addMessage('ai', 'Sorry, only the meeting host can end the meeting.');
            setIsProcessing(false);
            return;
          }
          addMessage('ai', '✅ Ending the meeting now...');
          setTimeout(() => {
            if (zegoKit && zegoKit.leaveRoom) {
              zegoKit.leaveRoom();
            }
          }, 1000);
        }
      }
      // Show participants
      else if (lowerCommand.includes('show participants') || lowerCommand.includes('list participants') || lowerCommand.includes('who is here')) {
        if (zegoKit && zegoKit.getAllUsers) {
          const users = zegoKit.getAllUsers();
          const userList = users.map(u => `• ${u.userName || u.userID}`).join('\n');
          addMessage('ai', `👥 Participants in the meeting:\n\n${userList || 'No other participants found.'}`);
        } else {
          addMessage('ai', '👥 Use the participants list button to see who\'s in the meeting.');
        }
      }
      // Mute myself
      else if (lowerCommand.includes('mute me') || lowerCommand.includes('mute myself')) {
        if (zegoKit && zegoKit.turnMicrophoneOn) {
          zegoKit.turnMicrophoneOn(false);
          addMessage('ai', '✅ You have been muted.');
        } else {
          addMessage('ai', '✅ Command received: Mute yourself. Please use the microphone button.');
        }
      }
      // Unmute myself
      else if (lowerCommand.includes('unmute me') || lowerCommand.includes('unmute myself')) {
        if (zegoKit && zegoKit.turnMicrophoneOn) {
          zegoKit.turnMicrophoneOn(true);
          addMessage('ai', '✅ You have been unmuted.');
        } else {
          addMessage('ai', '✅ Command received: Unmute yourself. Please use the microphone button.');
        }
      }
      // Help
      else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
        addMessage('ai', `🤖 I can help you with:\n\n• "Mute everyone" - Mute all participants (host only)\n• "Unmute everyone" - Unmute all participants (host only)\n• "Turn on camera" - Enable your camera\n• "Turn off camera" - Disable your camera\n• "Share screen" - Start screen sharing\n• "Stop sharing" - Stop screen sharing\n• "Mute me" - Mute yourself\n• "Unmute me" - Unmute yourself\n• "End meeting in X minutes" - Schedule meeting end (host only)\n• "Show participants" - List all participants\n• "Help" - Show this help message`);
      }
      // Default response
      else {
        addMessage('ai', `I understand you want to "${command}". I'm processing your request...\n\n💡 Try saying "help" to see all available commands.`);
      }
    } catch (error) {
      addMessage('ai', '❌ Sorry, I encountered an error processing your command. Please try again.');
      console.error('Command execution error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');
    executeCommand(userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ai-chat-panel"
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 300,
            mass: 0.8
          }}
        >
          <motion.div
            className="ai-chat-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="ai-header-content">
              <div className="ai-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div>
                <h3>AI Assistant</h3>
                <span className="ai-status">Online</span>
              </div>
            </div>
            <button className="close-ai-chat" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>

          <div className="ai-chat-messages">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`message ${message.type}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index === messages.length - 1 ? 0.1 : 0 }}
                >
                  {message.type === 'ai' && (
                    <div className="message-avatar ai-msg-avatar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isProcessing && (
              <motion.div
                className="message ai processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="message-avatar ai-msg-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <motion.form
            className="ai-chat-input-container"
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to perform a task..."
              className="ai-chat-input"
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={!input.trim() || isProcessing}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AIChat;

