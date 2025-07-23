// Authenticated API service that uses session tokens
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get session token from localStorage
const getSessionToken = () => {
  return localStorage.getItem('sessionToken');
};

// Make authenticated API request
const authRequest = async (url, options = {}) => {
  const sessionToken = getSessionToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if session token exists
  if (sessionToken) {
    defaultHeaders['Authorization'] = `Bearer ${sessionToken}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      // Clear invalid session
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      // Optionally redirect to login or refresh page
      window.location.reload();
      return null;
    }

    return response;
  } catch (error) {
    console.error('Auth API request failed:', error);
    throw error;
  }
};

// Authenticated API methods
export const authApi = {
  // User profile operations
  async getUserProfile(userId) {
    const response = await authRequest(`/api/user/${userId}`);
    return response ? response.json() : null;
  },

  async updateUserProfile(userId, profileData) {
    const response = await authRequest(`/api/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response ? response.json() : null;
  },

  // Bookmarks operations  
  async getUserBookmarks(userId) {
    const response = await authRequest(`/api/user/${userId}/bookmarks`);
    return response ? response.json() : null;
  },

  async addBookmark(translationId, bookId) {
    const response = await authRequest('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ translationId, bookId })
    });
    return response ? response.json() : null;
  },

  async removeBookmark(bookmarkId) {
    const response = await authRequest(`/api/bookmarks/${bookmarkId}`, {
      method: 'DELETE'
    });
    return response ? response.json() : null;
  },

  // Translation operations
  async createTranslation(translationData) {
    const response = await authRequest('/api/translations', {
      method: 'POST',
      body: JSON.stringify(translationData)
    });
    return response ? response.json() : null;
  },

  async updateTranslation(translationId, translationData) {
    const response = await authRequest(`/api/translations/${translationId}`, {
      method: 'PUT',
      body: JSON.stringify(translationData)
    });
    return response ? response.json() : null;
  },

  async deleteTranslation(translationId) {
    const response = await authRequest(`/api/translations/${translationId}`, {
      method: 'DELETE'
    });
    return response ? response.json() : null;
  },

  // Book operations
  async createBook(bookData) {
    const response = await authRequest('/api/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
    return response ? response.json() : null;
  },

  async updateBook(bookId, bookData) {
    const response = await authRequest(`/api/books/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
    return response ? response.json() : null;
  },

  async deleteBook(bookId) {
    const response = await authRequest(`/api/books/${bookId}`, {
      method: 'DELETE'
    });
    return response ? response.json() : null;
  }
};

export default authApi;
