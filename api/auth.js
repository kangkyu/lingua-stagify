import express from 'express';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Environment variables (secure - server-side only)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());

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

// Verify user session
app.get('/api/auth/verify/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
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
