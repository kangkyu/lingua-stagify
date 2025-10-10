import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

/**
 * Middleware to verify Google ID token and attach user to request
 * Expects Authorization header with Bearer token
 */
export async function authenticateUser(req, res) {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (!authHeader) {
      return { error: 'Authorization header missing', statusCode: 401 };
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return { error: 'Token missing', statusCode: 401 };
    }

    if (!GOOGLE_CLIENT_ID) {
      return { error: 'Google Client ID not configured', statusCode: 500 };
    }

    // Verify ID token with Google
    const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return { error: 'Invalid token', statusCode: 401 };
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          avatar: payload.picture
        }
      });
    } else {
      // Update user info if changed
      user = await prisma.user.update({
        where: { email: payload.email },
        data: {
          name: payload.name,
          avatar: payload.picture
        }
      });
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error.message);
    return { error: 'Authentication failed', statusCode: 401 };
  }
}