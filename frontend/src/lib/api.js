// API client for database operations
import { API_BASE_URL } from './config.js';

// Helper function to handle API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const translationService = {
  async getAllTranslations() {
    return await apiCall('/translations');
  },

  async getTranslationsByBook(bookId) {
    return await apiCall(`/translations/book/${bookId}`);
  },

  async getTranslationById(id) {
    return await apiCall(`/translations/${id}`);
  },

  async createTranslation(translationData, idToken) {
    return await apiCall('/translations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(translationData)
    });
  },

  async updateTranslation(id, translationData, idToken) {
    return await apiCall(`/translations/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(translationData)
    });
  }
};

export const bookService = {
  async getAllBooks() {
    return await apiCall('/books');
  },

  async getBookById(id) {
    return await apiCall(`/books/${id}`);
  },

  async createBook(bookData, idToken) {
    return await apiCall('/books', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(bookData)
    });
  }
};

export const userService = {
  async getUserBookmarks(userId) {
    // TODO: Implement user bookmarks API endpoint
    // For now return empty arrays until backend endpoint is created
    return {
      translations: [],
      books: []
    };
  }
};
