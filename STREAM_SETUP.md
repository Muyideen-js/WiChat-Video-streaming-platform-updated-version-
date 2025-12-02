# Stream API Setup Guide

## Prerequisites

1. Create a Stream account at https://getstream.io
2. Create a new app in the Stream dashboard
3. Get your API Key and API Secret from the dashboard

## Configuration

### 1. Frontend Configuration

Create a `.env` file in the `stream` directory:

```env
VITE_STREAM_API_KEY=your_api_key_here
```

### 2. Backend Configuration

Create a `.env` file in the `server` directory:

```env
STREAM_API_SECRET=your_api_secret_here
```

### 3. Update Config Files

1. **Frontend** (`stream/src/config/streamConfig.js`):
   - Replace `YOUR_STREAM_API_KEY` with your actual API key

2. **Backend** (`server/streamToken.js`):
   - Replace `YOUR_STREAM_API_SECRET` with your actual API secret

## Installation

### Backend Dependencies

```bash
cd server
npm install jsonwebtoken
```

### Frontend Dependencies

```bash
cd stream
npm install @stream-io/video-react-sdk
```

## Features

✅ Video and audio calling
✅ Screen sharing
✅ Chat messaging
✅ Multiple participants
✅ Camera/microphone controls
✅ Modern UI with Stream components

## Stream API Benefits

- **Reliable**: Global edge network for low latency
- **Scalable**: Handles large numbers of participants
- **Easy Integration**: Pre-built React components
- **Free Tier**: 66,000 monthly minutes of HD usage
- **Production Ready**: No need to manage WebRTC infrastructure

## Testing

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd stream
   npm run dev
   ```

3. Open the app and create/join a meeting

## Troubleshooting

- **Token errors**: Make sure your API Secret is correct
- **Connection issues**: Verify your API Key is set correctly
- **No video/audio**: Check browser permissions

For more help, visit: https://getstream.io/video/docs/

