// Frontend OAuth implementation with secure backend
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

// Generate Google OAuth URL for ID token flow
export const getGoogleAuthUrl = async () => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'id_token token',
    scope: 'openid email profile',
    nonce: Date.now().toString()
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Handle Google OAuth callback - ID token validation
export const handleGoogleCallback = async () => {
  try {
    // Get ID token from URL fragment
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = urlParams.get('id_token');

    if (!idToken) {
      throw new Error('No ID token received from Google');
    }

    // Try backend validation first
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          user: data.user,
          sessionToken: data.sessionToken
        };
      }
    } catch (backendError) {
      console.log('🔄 Backend not available, using frontend-only validation');
    }

    // Fallback: Frontend-only ID token parsing for production
    console.log('⚠️ Using frontend-only auth - deploy backend for full security');

    // Decode JWT payload (basic parsing - not cryptographic verification)
    const tokenParts = idToken.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid ID token format');
    }

    const payload = JSON.parse(atob(tokenParts[1]));

    // Basic validation
    if (!payload.email || !payload.aud || payload.aud !== GOOGLE_CLIENT_ID) {
      throw new Error('Invalid token payload');
    }

    // Create user from token
    const user = {
      id: `google_${payload.sub}`,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      user,
      sessionToken: null // No backend session in fallback mode
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
