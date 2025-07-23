// API client for database operations
// Since we're in a browser environment, we'll need to make API calls to a backend
// For now, we'll use mock data until a backend API is set up

const API_BASE_URL = '/api'; // This would be your actual API endpoint

// Mock data for development

const mockBooks = [
  {
    id: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    description: "A romantic novel of manners written by Jane Austen in 1813. The story follows the character development of Elizabeth Bennet, the dynamic protagonist who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    language: "en",
    createdAt: new Date('2024-01-10'),
    translationsCount: 2,
    bookmarksCount: 5,
    translations: []
  },
  {
    id: "don-quixote",
    title: "Don Quixote",
    author: "Miguel de Cervantes",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    description: "A Spanish novel by Miguel de Cervantes. It follows the adventures of a hidalgo named Mr. Alonso Quixano who reads so many chivalric romances that he loses his sanity and decides to set out to revive chivalry, undo wrongs, and bring justice to the world.",
    language: "es",
    createdAt: new Date('2024-01-11'),
    translationsCount: 2,
    bookmarksCount: 8,
    translations: []
  },
  {
    id: "les-miserables",
    title: "Les Misérables",
    author: "Victor Hugo",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    description: "A French historical novel by Victor Hugo, first published in 1862, that is considered one of the greatest novels of the 19th century. It follows the lives and interactions of several French characters over a twenty-year period in the early 19th century.",
    language: "fr",
    createdAt: new Date('2024-01-12'),
    translationsCount: 1,
    bookmarksCount: 3,
    translations: []
  },
  {
    id: "sense-and-sensibility",
    title: "Sense and Sensibility",
    author: "Jane Austen",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    description: "Jane Austen's first published novel, exploring the themes of love, money, and the contrast between reason and emotion through the lives of the Dashwood sisters.",
    language: "en",
    createdAt: new Date('2024-01-13'),
    translationsCount: 0,
    bookmarksCount: 2,
    translations: []
  }
];

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const translationService = {
  async getAllTranslations() {
    await delay(300); // Simulate network delay
    return [];
  },

  async getTranslationsByBook(bookId) {
    await delay(300);
    return [];
  }
};

export const bookService = {
  async getAllBooks() {
    await delay(300);
    return mockBooks;
  },

  async getBookById(id) {
    await delay(300);
    return mockBooks.find(book => book.id === id) || null;
  }
};

export const userService = {
  async getUserBookmarks(userId) {
    await delay(300);
    // Mock user bookmarks - in a real app, this would be filtered by userId
    return {
      translations: [],
      books: mockBooks.slice(0, 2)
    };
  }
};
