# Quick Start Guide

## 🚀 Get Up and Running in 3 Steps

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd stream
npm install
```

### Step 2: Start the Backend Server

```bash
cd server
npm start
```

✅ Server should be running on `http://localhost:3001`

### Step 3: Start the Frontend

Open a new terminal:

```bash
cd stream
npm run dev
```

✅ Frontend should be running on `http://localhost:5173`

## 🎯 Test the Platform

1. Open `http://localhost:5173` in your browser
2. Enter your name
3. Click "Create New Meeting"
4. Copy the meeting ID
5. Open a new browser tab/window (or incognito mode)
6. Enter the meeting ID and your name
7. Click "Join Meeting"

You should now see yourself in both windows! 🎉

## 💡 Tips

- Make sure to allow camera and microphone permissions when prompted
- For best results, use Chrome, Firefox, or Edge browsers
- The meeting ID is case-sensitive
- Multiple participants can join the same meeting

## 🐛 Troubleshooting

**Issue: Can't see video/audio**
- Check browser permissions for camera/microphone
- Make sure both frontend and backend servers are running
- Try refreshing the page

**Issue: Connection failed**
- Verify backend is running on port 3001
- Check browser console for errors
- Ensure you're using HTTP (HTTPS required for production)

**Issue: Screen sharing not working**
- Use Chrome or Edge for best screen sharing support
- Grant screen sharing permissions when prompted

---

Happy meeting! 👋

