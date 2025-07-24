const prisma = require('../../lib/prisma');
const { handleCors } = require('../../config');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    const { bookId } = req.query;

    try {
      const translations = await prisma.translation.findMany({
        where: {
          bookId: parseInt(bookId)
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true
            }
          },
          translator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          bookmarks: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transform the data to match frontend expectations
      const transformedTranslations = translations.map(translation => ({
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
        bookId: translation.book.id,
        coverImage: translation.book.coverImage,
        createdBy: translation.translator.name || translation.translator.email,
        createdDate: translation.createdAt.toLocaleDateString(),
        likesCount: 0, // TODO: Implement likes system
        commentsCount: 0, // TODO: Implement comments system
        tags: [translation.sourceLanguage, translation.targetLanguage, 'classic'] // TODO: Implement dynamic tags
      }));

      res.status(200).json(transformedTranslations);
    } catch (error) {
      console.error('Error fetching translations for book:', error);
      res.status(500).json({ error: 'Failed to fetch translations for book' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
