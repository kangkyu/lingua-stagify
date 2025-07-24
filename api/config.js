// Shared configuration for API functions

// Environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

// CORS configuration
const getCorsHeaders = () => ({
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

// Helper to handle CORS preflight
const handleCors = (req, res) => {
  const headers = getCorsHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
};

// Validation helpers
const validateGoogleConfig = () => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }
  if (!GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET is not configured');
  }
};

const validateDatabaseConfig = () => {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
};

module.exports = {
  // Environment variables
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  DATABASE_URL,
  
  // CORS helpers
  getCorsHeaders,
  handleCors,
  
  // Validation helpers
  validateGoogleConfig,
  validateDatabaseConfig
};
