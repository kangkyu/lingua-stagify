const http = require('http');
const url = require('url');
const path = require('path');

// Import API handlers
const healthHandler = require('./health.js');
const debugHandler = require('./debug.js');
const googleUrlHandler = require('./auth/google-url.js');
const validateTokenHandler = require('./auth/validate-token.js');
const booksHandler = require('./books/index.js');
const bookByIdHandler = require('./books/[id].js');
const translationsHandler = require('./translations/index.js');
const translationsByBookHandler = require('./translations/book/[bookId].js');

const PORT = 3001;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Helper to extract path parameters
  const getPathParams = (pattern, path) => {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith('[') && patternParts[i].endsWith(']')) {
        const paramName = patternParts[i].slice(1, -1);
        params[paramName] = pathParts[i];
      }
    }
    
    return params;
  };

  // Route the request
  try {
    if (pathname === '/api/health') {
      healthHandler(req, res);
    } else if (pathname === '/api/debug') {
      debugHandler(req, res);
    } else if (pathname === '/api/auth/google-url') {
      googleUrlHandler(req, res);
    } else if (pathname === '/api/auth/validate-token') {
      validateTokenHandler(req, res);
    } else if (pathname === '/api/books') {
      booksHandler(req, res);
    } else if (pathname.match(/^\/api\/books\/[^\/]+$/)) {
      // Extract ID from path like /api/books/123
      const id = pathname.split('/')[3];
      req.query = { ...req.query, id };
      bookByIdHandler(req, res);
    } else if (pathname === '/api/translations') {
      translationsHandler(req, res);
    } else if (pathname.match(/^\/api\/translations\/book\/[^\/]+$/)) {
      // Extract bookId from path like /api/translations/book/123
      const bookId = pathname.split('/')[4];
      req.query = { ...req.query, bookId };
      translationsByBookHandler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log('📡 Available endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/debug');
  console.log('  GET  /api/auth/google-url');
  console.log('  POST /api/auth/validate-token');
  console.log('  GET  /api/books');
  console.log('  GET  /api/books/:id');
  console.log('  GET  /api/translations');
  console.log('  GET  /api/translations/book/:bookId');
});
