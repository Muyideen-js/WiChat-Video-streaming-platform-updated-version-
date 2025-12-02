# ZEGOCLOUD Setup Guide

## 🚀 Quick Start

### 1. Get ZEGOCLOUD Credentials

1. Sign up at [ZEGOCLOUD Console](https://console.zegocloud.com/)
2. Create a new project
3. Get your **App ID** and **Server Secret**

### 2. Configure Credentials

**Option 1: Environment Variables (Recommended)**

Create a `.env` file in the `stream` directory:

```env
VITE_ZEGO_APP_ID=your_app_id_here
VITE_ZEGO_SERVER_SECRET=your_server_secret_here
```

**Option 2: Direct Configuration**

Edit `stream/src/config/zegoConfig.js`:

```javascript
export const ZEGO_APP_ID = 'your_app_id_here';
export const ZEGO_SERVER_SECRET = 'your_server_secret_here';
```

### 3. Install Dependencies

```bash
cd stream
npm install
```

### 4. Start the Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd stream
npm run dev
```

## ✨ Features

ZEGOCLOUD provides:
- ✅ Pre-built UI components
- ✅ Video/audio calling
- ✅ Screen sharing
- ✅ Text chat
- ✅ Participant management
- ✅ Fully customizable UI
- ✅ Mobile responsive

## 🎨 Customization

You can customize the UI by:
1. Editing `ZegoMeetingRoom.css` for styling
2. Modifying `ZegoMeetingRoom.jsx` for layout
3. Using ZEGOCLOUD's theme options

## 📚 Documentation

- [ZEGOCLOUD Docs](https://docs.zegocloud.com/)
- [React SDK Guide](https://docs.zegocloud.com/article/14882)
- [UI Customization](https://docs.zegocloud.com/article/14883)

