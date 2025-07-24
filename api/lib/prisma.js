import { PrismaClient } from '@prisma/client';

// Create a global variable to prevent multiple instances in development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Gracefully handle disconnection
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
