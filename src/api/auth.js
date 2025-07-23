const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Generate Google OAuth URL
export const getGoogleAuthUrl = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get auth URL');
    }

    return data.authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

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
    const response = await fetch(`${API_BASE_URL}/api/auth/verify/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Session verification failed');
    }

    return data;
  } catch (error) {
    console.error('Session verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
