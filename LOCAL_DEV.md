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
The API uses serverless functions that work best on Vercel. For local development:
1. The frontend works standalone with mock data
2. For full OAuth testing, deploy to Vercel and test there
3. Or use `vercel dev` from the root directory

## Environment Variables

Create `.env.local` in the root:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_API_URL=http://localhost:3001
```
