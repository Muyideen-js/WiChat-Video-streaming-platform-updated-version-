import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { generateStreamToken } from './streamToken.js';
import { generateZegoToken } from './zegoToken.js';

const app = express();
const httpServer = createServer(app);

// Configure CORS for Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active rooms
const rooms = new Map();

// Store socket connections
const socketToRoom = new Map();

// Generate unique meeting ID
app.post('/api/meeting/create', (req, res) => {
  const meetingId = uuidv4().substring(0, 8);
  rooms.set(meetingId, {
    participants: new Map(),
    createdAt: new Date()
  });
  res.json({ meetingId });
});

// Generate Stream token for user (kept for backward compatibility)
app.post('/api/stream/token', (req, res) => {
  const { userId, userName } = req.body;
  
  if (!userId || !userName) {
    return res.status(400).json({ error: 'userId and userName are required' });
  }

  try {
    const token = generateStreamToken(userId, userName);
    console.log(`Generated token for user: ${userId} (${userName})`);
    console.log(`Token preview: ${token.substring(0, 50)}...`);
    res.json({ token });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    res.status(500).json({ error: 'Failed to generate token', details: error.message });
  }
});

// Generate ZEGOCLOUD token for user
// Note: ZEGOCLOUD's prebuilt UI kit can generate tokens client-side for testing
// This endpoint is kept for future production use with server-side token generation
app.post('/api/zego/token', (req, res) => {
  const { userId, roomId } = req.body;
  
  if (!userId || !roomId) {
    return res.status(400).json({ error: 'userId and roomId are required' });
  }

  try {
    // For now, the client-side component handles token generation
    // This endpoint can be used for production server-side token generation
    const tokenData = generateZegoToken(userId, roomId, 0);
    console.log(`Token generation requested for user: ${userId} in room: ${roomId}`);
    res.json({ 
      token: tokenData,
      message: 'Note: Client-side token generation is used. For production, implement server-side token generation.'
    });
  } catch (error) {
    console.error('Error generating ZEGO token:', error);
    res.status(500).json({ error: 'Failed to generate ZEGO token', details: error.message });
  }
});

// Check if meeting exists
app.get('/api/meeting/:meetingId', (req, res) => {
  const { meetingId } = req.params;
  if (rooms.has(meetingId)) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', ({ roomId, userId, userName }) => {
    console.log(`User ${socket.id} (${userName}) joining room ${roomId}`);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        participants: new Map(),
        createdAt: new Date()
      });
      console.log(`Created new room: ${roomId}`);
    }

    const room = rooms.get(roomId);
    
    // Store user info
    room.participants.set(socket.id, {
      userId,
      userName: userName || `User-${userId.substring(0, 6)}`,
      socketId: socket.id
    });

    socketToRoom.set(socket.id, roomId);
    socket.join(roomId);

    console.log(`Room ${roomId} now has ${room.participants.size} participant(s)`);

    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId,
      userName: userName || `User-${userId.substring(0, 6)}`,
      socketId: socket.id
    });

    // Send list of existing participants to the new user
    const existingParticipants = Array.from(room.participants.values())
      .filter(p => p.socketId !== socket.id);
    console.log(`Sending ${existingParticipants.length} existing participants to ${socket.id}`);
    socket.emit('existing-participants', existingParticipants);

    // Send updated participant count to all in room
    io.to(roomId).emit('participant-count', room.participants.size);
  });

  // WebRTC signaling
  socket.on('offer', ({ offer, targetSocketId }) => {
    socket.to(targetSocketId).emit('offer', {
      offer,
      senderSocketId: socket.id
    });
  });

  socket.on('answer', ({ answer, targetSocketId }) => {
    socket.to(targetSocketId).emit('answer', {
      answer,
      senderSocketId: socket.id
    });
  });

  socket.on('ice-candidate', ({ candidate, targetSocketId }) => {
    socket.to(targetSocketId).emit('ice-candidate', {
      candidate,
      senderSocketId: socket.id
    });
  });

  // Chat messages
  socket.on('chat-message', ({ roomId, message, userName, userId }) => {
    io.to(roomId).emit('chat-message', {
      message,
      userName,
      userId,
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const roomId = socketToRoom.get(socket.id);
    
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      const participant = room.participants.get(socket.id);
      
      if (participant) {
        // Notify others
        socket.to(roomId).emit('user-left', {
          socketId: socket.id,
          userId: participant.userId
        });

        room.participants.delete(socket.id);
        io.to(roomId).emit('participant-count', room.participants.size);

        // Clean up empty rooms after 5 minutes
        if (room.participants.size === 0) {
          setTimeout(() => {
            if (rooms.has(roomId) && rooms.get(roomId).participants.size === 0) {
              rooms.delete(roomId);
              console.log(`Room ${roomId} deleted`);
            }
          }, 300000); // 5 minutes
        }
      }
    }

    socketToRoom.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

