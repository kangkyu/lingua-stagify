import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ID token is required' }));
      return;
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    
    if (!GOOGLE_CLIENT_ID) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Google Client ID not configured' }));
      return;
    }

    // Verify ID token with Google
    const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid ID token');
    }

    // Find or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          avatar: payload.picture
        }
      });
    } else {
      // Update user info if changed
      dbUser = await prisma.user.update({
        where: { email: payload.email },
        data: {
          name: payload.name,
          avatar: payload.picture
        }
      });
    }

    // Generate session token and store in database
    const sessionToken = `session_${dbUser.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: dbUser.id,
        expiresAt
      }
    });

    // Create user object for response
    const user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      user,
      sessionToken
    }));
  } catch (error) {
    console.error('Token validation error:', error.message);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Invalid token or authentication failed'
    }));
  }
}
