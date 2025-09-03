import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, handleCors, validateGoogleConfig } from '../config.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    validateGoogleConfig();

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

    // Create user object from validated Google data
    const user = {
      id: `google_${payload.sub}`,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture
    };

    // Generate session token
    const sessionToken = `session_${payload.sub}_${Date.now()}`;

    res.json({
      success: true,
      user,
      sessionToken
    });
  } catch (error) {
    console.error('Token validation error:', error.message);
    res.status(401).json({
      success: false,
      error: 'Invalid token or authentication failed'
    });
  }
}
