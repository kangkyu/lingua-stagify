// API client for database operations
// Since we're in a browser environment, we'll need to make API calls to a backend
// For now, we'll use mock data until a backend API is set up

const API_BASE_URL = '/api'; // This would be your actual API endpoint

// Mock data for development
const mockTranslations = [
  {
    id: '1',
    originalText: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    translatedText: "Es una verdad universalmente reconocida que todo hombre soltero en posesión de una gran fortuna necesita una esposa.",
    sourceLanguage: "en",
    targetLanguage: "es",
    context: "Opening line of the novel",
    chapter: "Chapter 1",
    pageNumber: 1,
    createdAt: new Date('2024-01-15'),
    bookTitle: "Pride and Prejudice",
    author: "Jane Austen",
    bookId: "pride-and-prejudice",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    createdBy: "María García",
    createdDate: "Jan 15, 2024",
    likesCount: 15,
    commentsCount: 3,
    tags: ["en", "es", "classic"]
  },
  {
    id: '2',
    originalText: "I could easily forgive his pride, if he had not mortified mine.",
    translatedText: "Podría perdonar fácilmente su orgullo, si no hubiera herido el mío.",
    sourceLanguage: "en",
    targetLanguage: "es",
    context: "Elizabeth about Darcy",
    chapter: "Chapter 5",
    pageNumber: 15,
    createdAt: new Date('2024-01-16'),
    bookTitle: "Pride and Prejudice",
    author: "Jane Austen",
    bookId: "pride-and-prejudice",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    createdBy: "María García",
    createdDate: "Jan 16, 2024",
    likesCount: 12,
    commentsCount: 5,
    tags: ["en", "es", "romance"]
  },
  {
    id: '3',
    originalText: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.",
    translatedText: "In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long ago one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing.",
    sourceLanguage: "es",
    targetLanguage: "en",
    context: "Opening line of Don Quixote",
    chapter: "Chapter 1",
    pageNumber: 1,
    createdAt: new Date('2024-01-17'),
    bookTitle: "Don Quixote",
    author: "Miguel de Cervantes",
    bookId: "don-quixote",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    createdBy: "Jane Austen",
    createdDate: "Jan 17, 2024",
    likesCount: 20,
    commentsCount: 8,
    tags: ["es", "en", "classic"]
  },
  {
    id: '4',
    originalText: "La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.",
    translatedText: "Freedom, Sancho, is one of the most precious gifts that heaven has bestowed upon men.",
    sourceLanguage: "es",
    targetLanguage: "en",
    context: "Don Quixote on freedom",
    chapter: "Chapter 58",
    pageNumber: 420,
    createdAt: new Date('2024-01-18'),
    bookTitle: "Don Quixote",
    author: "Miguel de Cervantes",
    bookId: "don-quixote",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    createdBy: "John Smith",
    createdDate: "Jan 18, 2024",
    likesCount: 25,
    commentsCount: 12,
    tags: ["es", "en", "philosophy"]
  },
  {
    id: '5',
    originalText: "Il faut, voyez-vous, des émotions aux hommes heureux.",
    translatedText: "Happy people need emotions, you see.",
    sourceLanguage: "fr",
    targetLanguage: "en",
    context: "Philosophical reflection",
    chapter: "Book 1, Chapter 3",
    pageNumber: 45,
    createdAt: new Date('2024-01-19'),
    bookTitle: "Les Misérables",
    author: "Victor Hugo",
    bookId: "les-miserables",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    createdBy: "Jane Austen",
    createdDate: "Jan 19, 2024",
    likesCount: 18,
    commentsCount: 6,
    tags: ["fr", "en", "philosophy"]
  }
];

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
    translations: mockTranslations.filter(t => t.bookId === "pride-and-prejudice")
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
    translations: mockTranslations.filter(t => t.bookId === "don-quixote")
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
    translations: mockTranslations.filter(t => t.bookId === "les-miserables")
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
    return mockTranslations;
  },

  async getTranslationsByBook(bookId) {
    await delay(300);
    return mockTranslations.filter(t => t.bookId === bookId);
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
      translations: mockTranslations.slice(0, 2),
      books: mockBooks.slice(0, 2)
    };
  }
};
