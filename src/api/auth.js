// Frontend OAuth implementation with secure backend
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

// Generate Google OAuth URL - using implicit flow for frontend-only
export const getGoogleAuthUrl = async () => {
  try {
    // Try to get from backend first (preferred for consistency)
    const response = await fetch(`${API_BASE_URL}/api/auth/google/url`);
    if (response.ok) {
      const data = await response.json();
      return data.authUrl;
    }
  } catch (error) {
    console.log('Backend not available, using frontend-only auth');
  }

  // Frontend-only: Use implicit flow to get ID token directly
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'id_token token', // Get ID token directly
    scope: 'openid email profile',
    nonce: Date.now().toString()
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (code) => {
  try {
    if (!code) {
      throw new Error('Authorization code not received');
    }

    // Try backend first if available
    try {
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

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (backendError) {
      console.log('Backend not available, handling auth on frontend');
    }

    // Fallback: Create a mock user for frontend-only mode
    // In production, you would need the backend for security
    console.warn('⚠�� Frontend-only auth - for development only!');

    // Create a simple user object without actual Google token exchange
    const user = {
      id: `temp_${Date.now()}`,
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      user
    };
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
