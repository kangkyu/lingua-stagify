import prisma from './prisma.js';

// Translations API
export const translationService = {
  // Get all translations with book and translator info
  async getAllTranslations() {
    try {
      const translations = await prisma.translation.findMany({
        include: {
          book: {
            include: {
              authorUser: true
            }
          },
          translator: true,
          bookmarks: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return translations.map(translation => ({
        id: translation.id,
        originalText: translation.originalText,
        translatedText: translation.translatedText,
        sourceLanguage: translation.sourceLanguage,
        targetLanguage: translation.targetLanguage,
        context: translation.context,
        chapter: translation.chapter,
        pageNumber: translation.pageNumber,
        createdAt: translation.createdAt,
        updatedAt: translation.updatedAt,
        bookTitle: translation.book.title,
        author: translation.book.author,
        bookId: translation.book.id,
        coverImage: translation.book.coverImage,
        createdBy: translation.translator.name,
        createdDate: new Date(translation.createdAt).toLocaleDateString(),
        likesCount: Math.floor(Math.random() * 20) + 1, // Placeholder for likes
        commentsCount: Math.floor(Math.random() * 10), // Placeholder for comments
        tags: [translation.sourceLanguage, translation.targetLanguage] // Simple tags for now
      }));
    } catch (error) {
      console.error('Error fetching translations:', error);
      return [];
    }
  },

  // Get translations by book ID
  async getTranslationsByBook(bookId) {
    try {
      const translations = await prisma.translation.findMany({
        where: { bookId },
        include: {
          book: true,
          translator: true,
          bookmarks: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return translations.map(translation => ({
        id: translation.id,
        originalText: translation.originalText,
        translatedText: translation.translatedText,
        sourceLanguage: translation.sourceLanguage,
        targetLanguage: translation.targetLanguage,
        context: translation.context,
        chapter: translation.chapter,
        pageNumber: translation.pageNumber,
        createdAt: translation.createdAt,
        bookTitle: translation.book.title,
        author: translation.book.author,
        createdBy: translation.translator.name,
        createdDate: new Date(translation.createdAt).toLocaleDateString(),
        likesCount: Math.floor(Math.random() * 20) + 1,
        commentsCount: Math.floor(Math.random() * 10),
        tags: [translation.sourceLanguage, translation.targetLanguage]
      }));
    } catch (error) {
      console.error('Error fetching translations by book:', error);
      return [];
    }
  }
};

// Books API
export const bookService = {
  // Get all books with author info
  async getAllBooks() {
    try {
      const books = await prisma.book.findMany({
        include: {
          authorUser: true,
          translations: {
            include: {
              translator: true
            }
          },
          bookmarks: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return books.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        description: book.description,
        language: book.language,
        createdAt: book.createdAt,
        authorUser: book.authorUser,
        translationsCount: book.translations.length,
        bookmarksCount: book.bookmarks.length,
        translations: book.translations
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  // Get book by ID
  async getBookById(id) {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          authorUser: true,
          translations: {
            include: {
              translator: true,
              bookmarks: true
            }
          },
          bookmarks: true
        }
      });

      if (!book) return null;

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        description: book.description,
        language: book.language,
        createdAt: book.createdAt,
        authorUser: book.authorUser,
        translations: book.translations.map(translation => ({
          id: translation.id,
          originalText: translation.originalText,
          translatedText: translation.translatedText,
          sourceLanguage: translation.sourceLanguage,
          targetLanguage: translation.targetLanguage,
          context: translation.context,
          chapter: translation.chapter,
          pageNumber: translation.pageNumber,
          createdBy: translation.translator.name,
          createdDate: new Date(translation.createdAt).toLocaleDateString(),
          likesCount: Math.floor(Math.random() * 20) + 1,
          commentsCount: Math.floor(Math.random() * 10)
        })),
        bookmarksCount: book.bookmarks.length
      };
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  }
};

// Users API
export const userService = {
  // Get user bookmarks
  async getUserBookmarks(userId) {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId },
        include: {
          translation: {
            include: {
              book: true,
              translator: true
            }
          },
          book: {
            include: {
              authorUser: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        translations: bookmarks
          .filter(bookmark => bookmark.translation)
          .map(bookmark => ({
            id: bookmark.translation.id,
            originalText: bookmark.translation.originalText,
            translatedText: bookmark.translation.translatedText,
            sourceLanguage: bookmark.translation.sourceLanguage,
            targetLanguage: bookmark.translation.targetLanguage,
            context: bookmark.translation.context,
            bookTitle: bookmark.translation.book.title,
            author: bookmark.translation.book.author,
            createdBy: bookmark.translation.translator.name,
            createdDate: new Date(bookmark.translation.createdAt).toLocaleDateString(),
            bookmarkedAt: new Date(bookmark.createdAt).toLocaleDateString()
          })),
        books: bookmarks
          .filter(bookmark => bookmark.book)
          .map(bookmark => ({
            id: bookmark.book.id,
            title: bookmark.book.title,
            author: bookmark.book.author,
            coverImage: bookmark.book.coverImage,
            description: bookmark.book.description,
            language: bookmark.book.language,
            bookmarkedAt: new Date(bookmark.createdAt).toLocaleDateString()
          }))
      };
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
      return { translations: [], books: [] };
    }
  }
};
