import { GoogleAuth } from 'google-auth-library';
import prisma from '@/lib/prisma.js';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/callback';

const googleAuth = new GoogleAuth({
  credentials: {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uris: [GOOGLE_REDIRECT_URI]
  }
});

// Generate Google OAuth URL
export const getGoogleAuthUrl = () => {
  const oauth2Client = new googleAuth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (code) => {
  try {
    const oauth2Client = new googleAuth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
    );
    
    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const googleUser = await userInfoResponse.json();

    // Check if user exists in database, create if not
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
      // Update user info if it has changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name,
          avatar: googleUser.picture
        }
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify user session (for protected routes)
export const verifyUserSession = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
