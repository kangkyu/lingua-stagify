// Frontend OAuth implementation with secure backend
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

// Generate Google OAuth URL - can be done frontend or backend
export const getGoogleAuthUrl = async () => {
  try {
    // Try to get from backend first (preferred for consistency)
    const response = await fetch(`${API_BASE_URL}/api/auth/google/url`);
    if (response.ok) {
      const data = await response.json();
      return data.authUrl;
    }
  } catch (error) {
    console.log('Backend not available, generating auth URL on frontend');
  }

  // Fallback to frontend generation if backend unavailable
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    include_granted_scopes: 'true'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Handle Google OAuth callback by sending code to backend
export const handleGoogleCallback = async (code) => {
  try {
    if (!code) {
      throw new Error('Authorization code not received');
    }

    // Send authorization code to backend for secure token exchange
    const response = await fetch(`${API_BASE_URL}/api/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirectUri: REDIRECT_URI
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Authentication failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify user session (for protected routes)
export const verifyUserSession = async (userId) => {
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.id === userId) {
        return {
          success: true,
          user
        };
      }
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Session verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
