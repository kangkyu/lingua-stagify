import prisma from '../lib/prisma.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const book = await prisma.book.findUnique({
        where: {
          id: BigInt(id)
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
        id: book.id.toString(),
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
