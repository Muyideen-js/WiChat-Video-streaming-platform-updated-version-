import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ScreenAnnotation.css';

function ScreenAnnotation({ isActive, onClose, zegoKit, callId }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState('pen'); // 'pen', 'eraser', 'text'
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);
  const lastSentRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set default styles
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [color, brushSize]);

  // Listen for annotation data from other users
  useEffect(() => {
    if (!zegoKit || !isActive) return;

    const handleMessage = (message) => {
      try {
        const data = typeof message === 'string' ? JSON.parse(message) : message;
        if (data.type === 'annotation' && data.data) {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          const annotationData = data.data;

          if (annotationData.type === 'draw') {
            const fromX = annotationData.from.x * canvas.width;
            const fromY = annotationData.from.y * canvas.height;
            const toX = annotationData.to.x * canvas.width;
            const toY = annotationData.to.y * canvas.height;

            if (annotationData.tool === 'eraser') {
              ctx.globalCompositeOperation = 'destination-out';
              ctx.lineWidth = annotationData.brushSize;
            } else {
              ctx.globalCompositeOperation = 'source-over';
              ctx.strokeStyle = annotationData.color;
              ctx.lineWidth = annotationData.brushSize;
            }

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
          } else if (annotationData.type === 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      } catch (error) {
        console.error('Error handling annotation message:', error);
      }
    };

    // Subscribe to messages if available
    if (zegoKit.on && typeof zegoKit.on === 'function') {
      zegoKit.on('message', handleMessage);
    }

    return () => {
      if (zegoKit.off && typeof zegoKit.off === 'function') {
        zegoKit.off('message', handleMessage);
      }
    };
  }, [zegoKit, isActive]);

  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (tool === 'text') {
      const pos = getEventPos(e);
      setTextPosition(pos);
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);
    const pos = getEventPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const sendAnnotationData = (data) => {
    if (zegoKit && callId) {
      try {
        // Use ZEGOCLOUD's messaging system to sync annotations
        const message = JSON.stringify({
          type: 'annotation',
          data: data,
          timestamp: Date.now()
        });
        
        // Send via ZEGOCLOUD's chat system
        if (zegoKit.sendBroadcastMessage) {
          zegoKit.sendBroadcastMessage(message);
        } else if (zegoKit.sendMessage) {
          zegoKit.sendMessage(message);
        }
      } catch (error) {
        console.error('Error sending annotation data:', error);
      }
    }
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'text') return;

    const pos = getEventPos(e);
    const ctx = canvasRef.current.getContext('2d');

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    // Sync drawing to other users (throttle to avoid too many messages)
    const now = Date.now();
    if (now - lastSentRef.current > 50) {
      sendAnnotationData({
        type: 'draw',
        from: { x: pos.x / canvasRef.current.width, y: pos.y / canvasRef.current.height },
        to: { x: pos.x / canvasRef.current.width, y: pos.y / canvasRef.current.height },
        color: tool === 'eraser' ? null : color,
        brushSize: tool === 'eraser' ? brushSize * 2 : brushSize,
        tool: tool
      });
      lastSentRef.current = now;
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
    }
  };

  const addText = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = `${brushSize * 5}px Poppins`;
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    setTextInput('');
    setShowTextInput(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sendAnnotationData({ type: 'clear' });
  };

  if (!isActive) return null;

  return (
    <motion.div
      className="screen-annotation-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="annotation-toolbar">
        <div className="tool-group">
          <button
            className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
            title="Pen"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
          </button>
          <button
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path>
            </svg>
          </button>
          <button
            className={`tool-btn ${tool === 'text' ? 'active' : ''}`}
            onClick={() => setTool('text')}
            title="Text"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
          </button>
        </div>

        <div className="tool-group">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
            title="Color"
          />
          <input
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="brush-size"
            title="Brush Size"
          />
          <span className="brush-size-label">{brushSize}px</span>
        </div>

        <div className="tool-group">
          <button className="tool-btn" onClick={clearCanvas} title="Clear">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button className="tool-btn danger" onClick={onClose} title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="annotation-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={(e) => {
          e.preventDefault();
          startDrawing(e.touches[0]);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          draw(e.touches[0]);
        }}
        onTouchEnd={stopDrawing}
      />

      {showTextInput && (
        <motion.div
          className="text-input-overlay"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            left: textPosition.x,
            top: textPosition.y
          }}
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addText();
              }
            }}
            onBlur={addText}
            autoFocus
            placeholder="Type text..."
            className="text-input-field"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default ScreenAnnotation;

