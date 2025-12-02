# VideoMeet Server

Backend server for the VideoMeet platform handling Socket.io signaling and room management.

## Running the Server

```bash
npm install
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Server runs on port 3001 by default.

## API Endpoints

- `POST /api/meeting/create` - Create a new meeting
- `GET /api/meeting/:meetingId` - Check if a meeting exists

## Socket Events

### Client → Server
- `join-room` - Join a meeting room
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `ice-candidate` - Send ICE candidate
- `chat-message` - Send chat message

### Server → Client
- `user-joined` - Notify when user joins
- `user-left` - Notify when user leaves
- `existing-participants` - List of existing participants
- `participant-count` - Current participant count
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `ice-candidate` - Receive ICE candidate
- `chat-message` - Receive chat message

