const prisma = require('../lib/prisma');
const { handleCors } = require('../config');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const book = await prisma.book.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          authorUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          translations: {
            include: {
              translator: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          bookmarks: {
            select: {
              id: true
            }
          }
        }
      });

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Transform the data to match frontend expectations
      const transformedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        description: book.description,
        language: book.language,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        translationsCount: book.translations.length,
        bookmarksCount: book.bookmarks.length,
        translations: book.translations.map(translation => ({
          id: translation.id.toString(),
          originalText: translation.originalText,
          translatedText: translation.translatedText,
          sourceLanguage: translation.sourceLanguage,
          targetLanguage: translation.targetLanguage,
          context: translation.context,
          chapter: translation.chapter,
          pageNumber: translation.pageNumber,
          createdAt: translation.createdAt,
          createdBy: translation.translator.name || translation.translator.email,
          createdDate: translation.createdAt.toLocaleDateString()
        }))
      };

      res.status(200).json(transformedBook);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
