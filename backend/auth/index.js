import { OAuth2Client } from 'google-auth-library';

export default async function handler(req, res) {
  // This is the index route for /auth - redirect to validate-token
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Use /auth/validate-token for authentication' }));
}