# Google OAuth Authentication Setup

This guide will help you set up Google OAuth authentication for the Lingua Stagify app.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console

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

1. Copy your Google Client ID from the credentials page
2. Update the `.env` file in your project root:

```env
VITE_GOOGLE_CLIENT_ID="your_actual_google_client_id_here"
VITE_GOOGLE_REDIRECT_URI="http://localhost:5173/auth/callback"
```

⚠️ **Important**: Never commit your actual Google Client ID to version control if your repository is public.

## Step 3: Test the Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Click "Sign In with Google" to test the authentication flow

## How It Works

The authentication flow:

1. User clicks "Sign In with Google"
2. User is redirected to Google's OAuth consent screen
3. After consent, Google redirects back to `/auth/callback` with an authorization code
4. The app exchanges the code for user information
5. User data is stored locally and the user is signed in

## Current Implementation Notes

- **Frontend-only**: This implementation works entirely in the browser
- **Local storage**: User data is persisted in localStorage (temporary solution)
- **No backend required**: Perfect for development and static hosting
- **Database ready**: The Prisma schema is set up for when you add a backend

## Next Steps for Production

For a production app, consider:

1. Adding a backend API to handle OAuth securely
2. Using a proper database instead of localStorage
3. Implementing proper session management
4. Adding user profile management
5. Setting up proper error handling and logging

## Troubleshooting

### "Client ID not found" error
- Make sure your `.env` file has the correct `VITE_GOOGLE_CLIENT_ID`
- Restart the development server after changing environment variables

### Redirect URI mismatch
- Ensure the redirect URI in your Google Console matches exactly: `http://localhost:5173/auth/callback`
- Check that your `.env` has the correct `VITE_GOOGLE_REDIRECT_URI`

### CORS errors
- This should not happen with the current implementation, but if you see CORS errors, make sure you're accessing the app through `http://localhost:5173` (not a different port)
