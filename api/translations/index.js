import prisma from '../lib/prisma.js';

export default async function handler(req, res) {

  if (req.method === 'GET') {
    try {
      const translationCount = await prisma.translation.count();

      if (translationCount === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]));
        return;
      }

      const translations = await prisma.translation.findMany({
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(transformedTranslations));
    } catch (error) {
      console.error('Error fetching translations:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch translations' }));
    }
  } else {
    res.writeHead(405, { 'Allow': 'GET' });
    res.end(`Method ${req.method} Not Allowed`);
  }
}
