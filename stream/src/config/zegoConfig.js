// ZEGOCLOUD Configuration
// Get your credentials from https://console.zegocloud.com/
// 
// Option 1: Use environment variable (recommended)
// Create a .env file in the stream directory with:
// VITE_ZEGO_APP_ID=your_app_id_here
// VITE_ZEGO_SERVER_SECRET=your_server_secret_here
//
// Option 2: Replace directly below (for quick testing)

// Convert appID to number (ZEGOCLOUD requires number, not string)
const appIDString = import.meta.env.VITE_ZEGO_APP_ID || 'YOUR_APP_ID';
export const ZEGO_APP_ID = appIDString !== 'YOUR_APP_ID' ? Number(appIDString) : null;
export const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET || 'YOUR_SERVER_SECRET';

// Note: You need to get these from ZEGOCLOUD Console
// Sign up at https://console.zegocloud.com/ and create an app

