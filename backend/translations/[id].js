import prisma from '../lib/prisma.js';
import { authenticateUser } from '../auth/middleware.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const translation = await prisma.translation.findUnique({
        where: { id: parseInt(id) },
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
          }
        }
      });

      if (!translation) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Translation not found' }));
        return;
      }

      // Transform response
      const response = {
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
        createdDate: translation.createdAt.toLocaleDateString()
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error('Error fetching translation:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch translation' }));
    }
  } else if (req.method === 'PUT') {
    // Authenticate user
    const authResult = await authenticateUser(req, res);

    if (authResult.error) {
      res.writeHead(authResult.statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: authResult.error }));
      return;
    }

    const user = authResult.user;

    try {
      // Check if translation exists and belongs to user
      const existingTranslation = await prisma.translation.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingTranslation) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Translation not found' }));
        return;
      }

      if (existingTranslation.translatorId !== user.id) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'You can only edit your own translations' }));
        return;
      }

      const {
        originalText,
        translatedText,
        sourceLanguage,
        targetLanguage,
        bookId,
        context,
        chapter,
        pageNumber
      } = req.body;

      // Validate required fields
      if (!originalText || !translatedText || !targetLanguage || !bookId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Missing required fields: originalText, translatedText, targetLanguage, and bookId are required'
        }));
        return;
      }

      // Verify book exists
      const book = await prisma.book.findUnique({
        where: { id: parseInt(bookId) }
      });

      if (!book) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Book not found' }));
        return;
      }

      // Update translation
      const translation = await prisma.translation.update({
        where: { id: parseInt(id) },
        data: {
          originalText,
          translatedText,
          sourceLanguage: sourceLanguage || 'en',
          targetLanguage,
          context,
          chapter,
          pageNumber: pageNumber ? parseInt(pageNumber) : null,
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
          }
        }
      });

      // Transform response
      const response = {
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
        createdDate: translation.createdAt.toLocaleDateString()
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error('Error updating translation:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to update translation' }));
    }
  } else {
    res.writeHead(405, { 'Allow': 'GET, PUT' });
    res.end(`Method ${req.method} Not Allowed`);
  }
}
