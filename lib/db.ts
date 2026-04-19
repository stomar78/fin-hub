import { PrismaClient } from '@prisma/client';

type GlobalPrisma = {
  prisma: PrismaClient | null;
  prismaInitError: Error | null;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

if (typeof globalForPrisma.prisma === 'undefined') {
  globalForPrisma.prisma = null;
  globalForPrisma.prismaInitError = null;
}

export function getPrismaClient(): PrismaClient | null {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (globalForPrisma.prismaInitError) {
    return null;
  }

  try {
    const client = new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client;
    }

    return client;
  } catch (error) {
    globalForPrisma.prismaInitError = error as Error;

    if (process.env.NODE_ENV !== 'production') {
      const message =
        error instanceof Error ? error.message : 'Unknown Prisma init error';
      console.warn('[db] Prisma client unavailable:', message);
    }

    return null;
  }
}

export default getPrismaClient;
