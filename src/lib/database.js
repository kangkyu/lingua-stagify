// Database service layer for browser compatibility
// Since we now have a backend API, frontend uses API calls instead of direct DB access

// User service for authentication - now client-side only
export const userService = {
  async createOrUpdateUser(userData) {
    // This is no longer used directly - handled by backend API
    throw new Error('Use backend API endpoints for user creation');
  },

  async getUserById(userId) {
    // Client-side: get from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.id === userId ? user : null;
    }
    return null;
  },

  async getUserByEmail(email) {
    // Client-side: get from localStorage
    const userData = localStorage.getItem(`user_${email}`);
    return userData ? JSON.parse(userData) : null;
  },

  async getUserBookmarks(userId) {
    // Mock implementation for now
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      translations: [],
      books: []
    };
  }
};

// Re-export other services from api.js
export { translationService, bookService } from './api.js';
