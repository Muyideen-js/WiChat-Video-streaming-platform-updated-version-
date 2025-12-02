import jwt from 'jsonwebtoken';

// Stream API Secret - Get from https://getstream.io/dashboard
// 
// Option 1: Use environment variable (recommended)
// Create a .env file in the server directory with:
// STREAM_API_SECRET=your_api_secret_here
//
// Option 2: Replace directly below (for quick testing)
const STREAM_API_SECRET = process.env.STREAM_API_SECRET || 'a26sgpcrejaur3vvuetzntnvgtvvtjkvhz34qfp4f4grp6ccdwbahbfx5y5k9aay';

/**
 * Generate a Stream token for a user
 * @param {string} userId - Unique user ID
 * @param {string} userName - User's display name
 * @returns {string} JWT token for Stream API
 */
export function generateStreamToken(userId, userName) {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    user_id: userId,
    iat: now, // Issued at time
    exp: now + (60 * 60), // 1 hour expiry
  };

  // Stream requires the token to be signed with the API secret
  // The secret must match the API key
  const token = jwt.sign(payload, STREAM_API_SECRET, {
    algorithm: 'HS256',
    noTimestamp: false,
  });

  return token;
}

