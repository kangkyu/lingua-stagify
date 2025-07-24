# Local Development Guide

## Quick Start

```bash
# Install all dependencies
npm install

# Option 1: Run both frontend and API together
npm run dev:all

# Option 2: Run separately in different terminals
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:api       # API on http://localhost:3001
```

## Development URLs

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001/api/*
- **Health Check**: http://localhost:3001/api/health

## Troubleshooting

### If `npm run dev:all` fails:
Run the services separately:
```bash
# Terminal 1
npm run dev:frontend

# Terminal 2  
npm run dev:api
```

### If API dev fails:
The API uses Vercel serverless functions. For local development:
1. Make sure you have database connection configured
2. Run `npm run db:push` to setup database schema
3. Use `vercel dev api --listen 3001` for local API testing
4. For full OAuth testing, deploy to Vercel and test there

## Environment Variables

Create `.env.local` in the root:
```env
# Frontend configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Database configuration
DATABASE_URL=your_postgresql_connection_string

# Note: API URL is automatically set to window.location.origin
# No need to set VITE_API_URL unless using external API
```
