# Deployment Guide - Vercel + Turbo Monorepo

## Quick Deploy

1. **Connect to Vercel:**
   ```bash
   npx vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
   - `VITE_API_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `GOOGLE_CLIENT_ID` - Same as above (for backend)
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
   - `CLIENT_URL` - Same as `VITE_API_URL`

## Architecture

### Frontend (React + Vite)
- Built with `npm run build` (which runs `vite build`)
- Outputs to `dist/` directory
- Served as static files with SPA routing

### Backend (Serverless Functions Only)
- Pure serverless functions in `api/` directory
- No Express server - fully serverless
- Automatically deployed as Vercel serverless functions
- Local development uses `vercel dev`

### Monorepo Benefits
- Single deployment for frontend + backend
- Shared dependencies via npm workspaces
- Turbo available for local development
- Environment variable sharing

## Local Development

```bash
# Install dependencies
npm install

# Start both frontend and serverless API
npm run dev:all

# Or start individually
npm run frontend:dev  # Frontend only (port 5173)
npm run api:dev       # Serverless API only (port 3001)
```

## API Endpoints (Production)

- `GET /api/health` - Health check
- `GET /api/auth/google-url` - Get Google OAuth URL
- `POST /api/auth/validate-token` - Validate Google ID token

## Troubleshooting

### Build Issues
- Ensure all workspaces have `build` scripts
- Check `turbo.json` task dependencies
- Verify `package.json` workspaces configuration

### Environment Variables
- Set both `VITE_*` (frontend) and non-prefixed (backend) versions
- Update `CLIENT_URL` and `VITE_API_URL` to match deployment URL

### CORS Issues
- Verify `CLIENT_URL` matches your Vercel domain
- Check API function CORS headers in `api/` directory
