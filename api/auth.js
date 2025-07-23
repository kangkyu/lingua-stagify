import express from 'express';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
// Removed Prisma for now - add back when database is ready

// Environment variables (secure - server-side only)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 3001;

// Debug: Log environment variables (without secrets)
console.log('🔧 Backend Environment Check:');
console.log('- GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'Set ✅' : 'Missing ❌');
console.log('- GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'Set ✅' : 'Missing ❌');
console.log('- CLIENT_URL:', CLIENT_URL);
console.log('- PORT:', PORT);

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Validate Google ID Token and create session
app.post('/api/auth/validate-token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.log('❌ OAuth validation failed in /validate-token:');
      console.log('- GOOGLE_CLIENT_ID present:', !!GOOGLE_CLIENT_ID);
      console.log('- GOOGLE_CLIENT_SECRET present:', !!GOOGLE_CLIENT_SECRET);
      return res.status(500).json({ error: 'Google OAuth not configured on server' });
    }

    // Debug: Log token details (first 20 chars only for security)
    console.log('🔍 ID Token validation attempt:');
    console.log('- Token preview:', idToken.substring(0, 20) + '...');
    console.log('- Client ID for verification:', GOOGLE_CLIENT_ID);

    // Verify ID token with Google
    const oauth2Client = new GoogleAuth().OAuth2(GOOGLE_CLIENT_ID);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    console.log('✅ Token verified successfully');
    console.log('- User email:', payload.email);
    console.log('- User name:', payload.name);

    if (!payload) {
      throw new Error('Invalid ID token');
    }

    // Create user object from validated Google data
    const user = {
      id: `google_${payload.sub}`,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture
    };

    // Generate session token
    const sessionToken = `session_${payload.sub}_${Date.now()}`;

    console.log('✅ User authenticated:', user.email);

    res.json({
      success: true,
      user,
      sessionToken
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token or authentication failed'
    });
  }
});

// Generate Google OAuth URL
app.get('/api/auth/google/url', (req, res) => {
  try {
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google OAuth not configured on server' });
    }

    const redirectUri = `${CLIENT_URL}/auth/callback`;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      include_granted_scopes: 'true'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

// Google OAuth callback handler
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Google OAuth not configured on server' });
    }

    // Create OAuth client
    const oauth2Client = new GoogleAuth().OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Get user info from Google
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
    );
    
    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const googleUser = await userInfoResponse.json();

    // Create or update user in database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name,
          avatar: googleUser.picture
        }
      });
    }

    // Return user data (without sensitive tokens)
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Authentication failed' 
    });
  }
});

// Verify user session (simplified for testing)
app.get('/api/auth/verify/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // For testing - in production, verify against database/session store
    if (userId && userId.startsWith('google_')) {
      res.json({
        success: true,
        user: {
          id: userId,
          email: 'demo@example.com',
          name: 'Demo User',
          avatar: 'https://via.placeholder.com/150'
        }
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify session'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});

export default app;
