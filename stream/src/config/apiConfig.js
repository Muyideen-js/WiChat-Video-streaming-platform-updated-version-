// API Configuration
// In production, set VITE_API_URL environment variable to your server URL
// For local development, defaults to http://localhost:3001

const getApiUrl = () => {
  // Check for environment variable (set in Netlify or .env file)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();
export const SOCKET_URL = getApiUrl().replace('/api', ''); // Remove /api if present, or use as is

// Helper function to build API endpoints
export const apiEndpoints = {
  createMeeting: () => `${API_URL}/api/meeting/create`,
  checkMeeting: (meetingId) => `${API_URL}/api/meeting/${meetingId}`,
  streamToken: () => `${API_URL}/api/stream/token`,
  zegoToken: () => `${API_URL}/api/zego/token`,
};

