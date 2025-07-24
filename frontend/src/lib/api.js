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
  }
};

export const bookService = {
  async getAllBooks() {
    return await apiCall('/books');
  },

  async getBookById(id) {
    return await apiCall(`/books/${id}`);
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
