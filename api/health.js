const { handleCors } = require('./config');

module.exports = function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    platform: 'vercel-serverless'
  });
}
