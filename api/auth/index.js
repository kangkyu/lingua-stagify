// Auth endpoints temporarily disabled due to missing config
export default function handler(req, res) {
  res.writeHead(501, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Auth endpoints not configured' }));
}