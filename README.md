# Wi-Chat - Modern Video Conferencing Platform

A professional, real-time video meeting application built with React and modern web technologies. Wi-Chat enables seamless video communication for teams, businesses, and individuals - bringing people together no matter where they are.

## About This Project

Wi-Chat was built to solve the challenge of connecting people through high-quality video communication. Whether you're working remotely, conducting online classes, hosting webinars, or simply catching up with your team, Wi-Chat provides a reliable and intuitive platform for all your video conferencing needs.

The application features a clean, modern interface with smooth animations, making every interaction feel polished and professional. From the moment you land on the homepage to joining your first meeting, every step is designed with user experience in mind.

## Key Features

✨ **Core Functionality:**
- 📹 **HD Video & Audio** - Crystal clear video quality with reliable audio transmission
- 🖥️ **Screen Sharing** - Share your screen with participants in real-time
- 💬 **Live Chat** - In-meeting chat for quick messages and collaboration
- 🔊 **Audio Controls** - Mute/unmute your microphone with one click
- 📷 **Video Toggle** - Turn your camera on or off as needed
- 👥 **Multi-Participant Support** - Connect with multiple people simultaneously
- 🎨 **Modern UI** - Beautiful, responsive design that works on all devices
- 🔐 **User Authentication** - Secure login with email/password or Google Sign-In
- 💾 **Persistent Sessions** - Stay logged in across browser sessions

## Technology Stack

**Frontend:**
- React 19 - Modern UI library for building interactive interfaces
- Vite - Lightning-fast build tool and development server
- Framer Motion - Smooth animations and transitions
- React Router DOM - Client-side routing
- Firebase Authentication - Secure user authentication
- ZEGOCLOUD SDK - Professional video conferencing infrastructure

**Backend:**
- Node.js - JavaScript runtime environment
- Express - Web application framework
- Socket.io - Real-time bidirectional communication
- RESTful API - Meeting room management

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v16 or higher recommended)
- npm or yarn package manager
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd video-meet
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd stream
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure Environment Variables:**
   - Set up your Firebase project and add credentials to `stream/src/firebase/config.js`
   - Configure ZEGOCLOUD credentials in `stream/src/config/zegoConfig.js`

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd server
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   The server will run on `http://localhost:3001`

2. **Start the Frontend Development Server:**
   ```bash
   cd stream
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. **Open in Browser:**
   - Navigate to `http://localhost:5173`
   - Sign up or log in to your account
   - Create a new meeting or join an existing one

## How to Use

### Creating a Meeting

1. Click "Get Started" or "Start Meeting" on the landing page
2. If not logged in, you'll be prompted to sign up or log in
3. Enter your name
4. Click "Create Meeting"
5. Share the meeting link or ID with participants

### Joining a Meeting

1. Enter your name
2. Enter the meeting ID provided by the host
3. Click "Join Meeting"
4. Grant camera and microphone permissions when prompted

### During a Meeting

- **Microphone Button** - Toggle your audio on/off
- **Camera Button** - Turn your video on/off
- **Share Screen Button** - Start or stop screen sharing
- **Chat Button** - Open the chat panel to send messages
- **Leave Button** - Exit the meeting

## Project Structure

```
video-meet/
├── stream/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # Configuration files
│   │   ├── firebase/       # Firebase setup
│   │   └── App.jsx         # Main application component
│   └── package.json
├── server/                 # Backend Node.js server
│   ├── server.js           # Main server file
│   └── package.json
└── README.md
```

## Features in Detail

### User Authentication
- Email/password authentication via Firebase
- Google Sign-In integration
- Persistent login sessions using localStorage
- Secure user data management

### Video Conferencing
- Powered by ZEGOCLOUD for reliable video streaming
- Adaptive video quality based on network conditions
- Low latency for real-time communication
- Support for multiple simultaneous participants

### User Interface
- Fully responsive design for mobile, tablet, and desktop
- Smooth animations using Framer Motion
- Modern, clean aesthetic
- Intuitive navigation and controls

## Development Notes

- The application uses WebRTC for peer-to-peer connections where possible
- Socket.io handles signaling and real-time updates
- Firebase provides secure authentication and user management
- ZEGOCLOUD SDK handles video streaming infrastructure
- HTTPS is required for WebRTC in production environments

## Future Enhancements

Potential features for future development:
- [ ] Meeting recording functionality
- [ ] Virtual backgrounds
- [ ] Waiting room feature
- [ ] Meeting password protection
- [ ] Host controls (mute all, remove participants)
- [ ] Breakout rooms
- [ ] Meeting transcripts
- [ ] Mobile app (iOS/Android)
- [ ] Integration with calendar systems
- [ ] File sharing during meetings

## Contributing

This is a personal project, but suggestions and feedback are always welcome! If you'd like to contribute or report issues, please feel free to reach out.

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

---

**Built with passion for connecting people through technology** 💙

For questions or support, please refer to the documentation or open an issue in the repository.
