// ZEGOCLOUD Token Generation
// Note: ZEGOCLOUD's prebuilt UI kit generates tokens client-side using generateKitTokenForTest
// For production, you should generate tokens server-side using their official SDK
// Install: npm install zego-express-auth-generator

// ZEGOCLOUD Server Secret - Get from https://console.zegocloud.com/
// 
// Option 1: Use environment variable (recommended)
// Create a .env file in the server directory with:
// ZEGO_SERVER_SECRET=your_server_secret_here
// ZEGO_APP_ID=your_app_id_here
//
// Option 2: Replace directly below (for quick testing)
const ZEGO_SERVER_SECRET = process.env.ZEGO_SERVER_SECRET || '67805661a89243fdf1fa5d843c5d8615';
const ZEGO_APP_ID = process.env.ZEGO_APP_ID || '939518804';

/**
 * Generate a ZEGOCLOUD token (server-side)
 * Note: The prebuilt UI kit can generate tokens client-side for testing
 * For production, use this server-side token generation
 * 
 * @param {string} userId - User ID
 * @param {string} roomId - Room ID
 * @param {number} privilege - Privilege (1 = host, 0 = participant)
 * @returns {string} ZEGOCLOUD token
 */
export function generateZegoToken(userId, roomId, privilege = 0) {
  if (!ZEGO_SERVER_SECRET || ZEGO_SERVER_SECRET === 'YOUR_SERVER_SECRET') {
    throw new Error('ZEGOCLOUD Server Secret not configured. Please set ZEGO_SERVER_SECRET in .env or zegoToken.js');
  }

  if (!ZEGO_APP_ID || ZEGO_APP_ID === 'YOUR_APP_ID') {
    throw new Error('ZEGOCLOUD App ID not configured. Please set ZEGO_APP_ID in .env or zegoToken.js');
  }

  // Note: For production, you should use ZEGOCLOUD's official token generation
  // The prebuilt UI kit uses generateKitTokenForTest() client-side for development
  // For production tokens, install and use: zego-express-auth-generator
  
  // This is a placeholder - actual token generation requires their SDK
  // The client-side component will handle token generation for now
  console.log(`Token generation requested for user: ${userId}, room: ${roomId}`);
  
  // Return a placeholder token structure
  // In production, replace this with actual token generation using zego-express-auth-generator
  return {
    appID: ZEGO_APP_ID,
    userID: userId,
    roomID: roomId,
    privilege: privilege,
    // Note: Actual token generation should be done with zego-express-auth-generator
  };
}

