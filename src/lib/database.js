// Re-export the API client services for browser compatibility
// Prisma Client cannot run in the browser, so we use API calls or mock data
export { translationService, bookService, userService } from './api.js';
