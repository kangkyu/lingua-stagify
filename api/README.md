# Lingua Stagify Backend API

Secure backend API for handling Google OAuth authentication.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   ```env
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   CLIENT_URL="https://your-frontend-domain.com"
   DATABASE_URL="your_postgresql_connection_string"
   PORT=3001
   ```

3. **Run the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

- `GET /api/auth/google/url` - Get Google OAuth URL
- `POST /api/auth/google/callback` - Handle OAuth callback
- `GET /api/auth/verify/:userId` - Verify user session
- `GET /api/health` - Health check

## Security

- Client secret is stored securely on the server
- CORS configured to only allow requests from your frontend domain
- No sensitive data exposed to the frontend

## Deployment

This backend can be deployed to any Node.js hosting platform:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS/GCP/Azure

Make sure to set all environment variables in your hosting platform.
