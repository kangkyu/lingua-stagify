import prisma from '../lib/prisma.js';

export default async function handler(req, res) {

  if (req.method === 'GET') {
    try {
      const books = await prisma.book.findMany({
        include: {
          authorUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          translations: {
            select: {
              id: true,
              sourceLanguage: true,
              targetLanguage: true
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
      const transformedBooks = books.map(book => ({
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
        translations: book.translations
      }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(transformedBooks));
    } catch (error) {
      console.error('Error fetching books:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch books' }));
    }
  } else {
    res.writeHead(405, { 'Allow': 'GET' });
    res.end(`Method ${req.method} Not Allowed`);
  }
}
