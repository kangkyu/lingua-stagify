const { handleCors, GOOGLE_CLIENT_ID } = require('./config');

module.exports = function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    hasGoogleClientId: !!GOOGLE_CLIENT_ID
  });
}
