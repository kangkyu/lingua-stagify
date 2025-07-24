const { GOOGLE_CLIENT_ID, handleCors, validateGoogleConfig } = require('../config');

module.exports = function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    validateGoogleConfig();

    // Get redirect URI from request origin
    const origin = req.headers.origin || req.headers.referer?.split('/')[0] + '//' + req.headers.referer?.split('/')[2] || 'http://localhost:5173';
    const redirectUri = `${origin}/auth/callback`;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'id_token token',
      scope: 'openid email profile',
      nonce: Date.now().toString()
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
}
