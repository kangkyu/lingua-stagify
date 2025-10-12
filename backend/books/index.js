import prisma from '../lib/prisma.js';
import { authenticateUser } from '../auth/middleware.js';

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
  } else if (req.method === 'POST') {
    // Authenticate user
    const authResult = await authenticateUser(req, res);

    if (authResult.error) {
      res.writeHead(authResult.statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: authResult.error }));
      return;
    }

    const user = authResult.user;

    try {
      const { title, author, description, language } = req.body;

      // Validate required fields
      if (!title || !author) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Missing required fields: title and author are required'
        }));
        return;
      }

      // Create book
      const book = await prisma.book.create({
        data: {
          title,
          author,
          description: description || '',
          language: language || 'en',
          authorId: user.id
        },
        include: {
          authorUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Transform response
      const response = {
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        language: book.language,
        coverImage: book.coverImage,
        createdAt: book.createdAt,
        authorUser: book.authorUser
      };

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error('Error creating book:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to create book' }));
    }
  } else {
    res.writeHead(405, { 'Allow': 'GET, POST' });
    res.end(`Method ${req.method} Not Allowed`);
  }
}
