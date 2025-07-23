# Google OAuth Authentication Setup

This guide will help you set up Google OAuth authentication for the Lingua Stagify app with backend integration.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Database setup (PostgreSQL)

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google OAuth2 API"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (for development)
     - Add your production domain when deploying

## Step 2: Configure Environment Variables in Builder.io

Set this environment variable in your Builder.io project settings:

### Frontend Environment Variables:
```env
VITE_GOOGLE_CLIENT_ID="your_actual_google_client_id_here"
```

⚠️ **Note**: Only the Client ID is needed for frontend-only OAuth. The Client Secret is not used or needed.

⚠️ **Important**: Never commit your actual Google credentials to version control.

## Step 3: Set Up Database

1. Make sure your PostgreSQL database is running
2. Push the Prisma schema:
   ```bash
   npm run db:push
   ```

3. (Optional) Seed the database:
   ```bash
   npm run db:seed
   ```

## Step 4: Test the Authentication

1. Start both the API server and frontend:
   ```bash
   npm run dev:full
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - API server
   npm run api

   # Terminal 2 - Frontend
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Click "Sign In with Google" to test the authentication flow

## How It Works

The authentication flow:

1. User clicks "Sign In with Google"
2. Frontend requests auth URL from backend API
3. User is redirected to Google's OAuth consent screen
4. After consent, Google redirects back to `/auth/callback` with an authorization code
5. Frontend sends the code to backend API
6. Backend exchanges code for user info and creates/updates user in database
7. User data is returned and stored in frontend

## Architecture

- **Backend API**: Express server handling OAuth flow securely
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React app consuming the API
- **Authentication**: Server-side OAuth with client-side session management

## API Endpoints

- `GET /api/auth/google` - Get Google OAuth URL
- `POST /api/auth/callback` - Handle OAuth callback
- `GET /api/auth/verify/:userId` - Verify user session
- `GET /api/health` - Health check

## Troubleshooting

### "Client ID not found" error
- Make sure your Builder.io environment variables are set correctly
- Restart both servers after changing environment variables

### Redirect URI mismatch
- Ensure the redirect URI in your Google Console matches exactly: `http://localhost:5173/auth/callback`
- The redirect URI is automatically constructed as `CLIENT_URL + /auth/callback`

### API connection errors
- Make sure the API server is running on port 3001
- Check that `VITE_API_URL` points to the correct API server URL
- Verify CORS settings allow your frontend domain

### Database errors
- Ensure your `DATABASE_URL` is correct
- Make sure the database is running and accessible
- Run `npm run db:push` to sync the schema
