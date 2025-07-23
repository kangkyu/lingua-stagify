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

## Step 3: Test the Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Click "Sign In with Google" to test the authentication flow

## How It Works

The authentication flow (Frontend-Only):

1. User clicks "Sign In with Google"
2. Frontend generates Google OAuth URL directly
3. User is redirected to Google's OAuth consent screen
4. After consent, Google redirects back to `/auth/callback` with an authorization code
5. Frontend exchanges the code directly with Google for user info
6. User data is stored in localStorage for session management

## Architecture

- **Frontend-Only**: No backend required for authentication
- **Client-Side OAuth**: Direct integration with Google's OAuth APIs
- **LocalStorage**: User session persistence in browser
- **Scalable**: Perfect for static deployments (Vercel, Netlify, Fly.dev)

## Troubleshooting

### "Client ID not found" error
- Make sure your `VITE_GOOGLE_CLIENT_ID` is set in Builder.io environment variables
- Restart the development server after changing environment variables
- Check that the environment variable starts with `VITE_` prefix

### Redirect URI mismatch
- Ensure the redirect URI in your Google Console matches exactly:
  - Development: `http://localhost:5173/auth/callback`
  - Production: `https://your-domain.com/auth/callback`
- The redirect URI is automatically constructed as `window.location.origin + /auth/callback`

### CORS errors with Google APIs
- This should not happen since we're calling Google's public APIs directly
- If you see CORS errors, make sure you're not behind a corporate firewall or proxy

### Authentication fails silently
- Check browser console for error messages
- Verify your Google Client ID is correct and active
- Make sure your Google Cloud project has the necessary APIs enabled
