import prisma from '../lib/prisma.js';

/**
 * Middleware to verify session token and attach user to request
 * Expects Authorization header with Bearer token
 */
export async function authenticateUser(req, res) {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (!authHeader) {
      return { error: 'Authorization header missing', statusCode: 401 };
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return { error: 'Token missing', statusCode: 401 };
    }

    // Find session in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      return { error: 'Invalid session token', statusCode: 401 };
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      // Delete expired session
      await prisma.session.delete({
        where: { id: session.id }
      });
      return { error: 'Session expired', statusCode: 401 };
    }

    return { user: session.user };
  } catch (error) {
    console.error('Authentication error:', error.message);
    return { error: 'Authentication failed', statusCode: 401 };
  }
}