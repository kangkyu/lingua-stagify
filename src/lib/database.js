// Database service layer for browser compatibility
// Since Prisma Client cannot run in the browser, we use localStorage or API calls
import prisma from './prisma.js';

// For now, we'll use localStorage with a fallback to Prisma for development
const isServer = typeof window === 'undefined';

// User service for authentication
export const userService = {
  async createOrUpdateUser(userData) {
    if (isServer) {
      // Server-side: use Prisma
      try {
        let user = await prisma.user.findUnique({
          where: { email: userData.email }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: userData.email,
              name: userData.name,
              avatar: userData.avatar
            }
          });
        } else {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              name: userData.name,
              avatar: userData.avatar
            }
          });
        }

        return user;
      } catch (error) {
        console.error('Database error:', error);
        throw error;
      }
    } else {
      // Client-side: use localStorage (temporary solution)
      const userId = 'user_' + Date.now();
      const user = {
        id: userId,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in localStorage for persistence
      localStorage.setItem(`user_${userData.email}`, JSON.stringify(user));

      return user;
    }
  },

  async getUserById(userId) {
    if (isServer) {
      try {
        return await prisma.user.findUnique({
          where: { id: userId }
        });
      } catch (error) {
        console.error('Database error:', error);
        return null;
      }
    } else {
      // Client-side: get from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        return user.id === userId ? user : null;
      }
      return null;
    }
  },

  async getUserByEmail(email) {
    if (isServer) {
      try {
        return await prisma.user.findUnique({
          where: { email: email }
        });
      } catch (error) {
        console.error('Database error:', error);
        return null;
      }
    } else {
      // Client-side: get from localStorage
      const userData = localStorage.getItem(`user_${email}`);
      return userData ? JSON.parse(userData) : null;
    }
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
