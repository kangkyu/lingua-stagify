const { OAuth2Client } = require('google-auth-library');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Google OAuth not configured on server' });
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
