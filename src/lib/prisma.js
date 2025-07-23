import { PrismaClient } from '../generated/prisma/index.js';

// Create a global variable to prevent multiple instances in development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
