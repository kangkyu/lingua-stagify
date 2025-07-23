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

## Step 2: Configure Environment Variables

### For Frontend App (Builder.io Environment Variables):
```env
VITE_GOOGLE_CLIENT_ID="your_actual_google_client_id_here"
VITE_API_URL="https://your-backend-api-url.com"
```

### For Backend App (Server Environment Variables):
```env
GOOGLE_CLIENT_ID="your_actual_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_actual_google_client_secret_here"
CLIENT_URL="https://your-frontend-url.com"
DATABASE_URL="your_postgresql_connection_string"
PORT=3001
```

✅ **Security**: Client secret is now safely stored on the backend server only.

⚠️ **Important**: Never commit your actual Google credentials to version control.

## Step 3: Deploy and Test

### Option 1: Development (Both Apps Locally)
1. **Start Backend API:**
   ```bash
   cd api
   npm install
   npm run dev
   ```

2. **Start Frontend (in another terminal):**
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

### Option 2: Production (Separate Deployments)
1. **Deploy Backend** to your server platform (Railway, Heroku, etc.)
2. **Deploy Frontend** to Builder.io with `VITE_API_URL` pointing to your backend
3. **Set up redirect URIs** in Google Console for both environments

### Testing Authentication
- Click "Sign In with Google"
- Should redirect to Google, then back to your app with user logged in

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

### "Google OAuth not configured" error
- Make sure both `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_SECRET` are set in Builder.io environment variables
- Restart the development server after changing environment variables
- Check that both environment variables start with `VITE_` prefix

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
