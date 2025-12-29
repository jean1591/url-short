import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client instance
 */
class PrismaClientSingleton {
  private static instance: PrismaClient | null = null;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({
        log:
          process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
      });
    }
    return PrismaClientSingleton.instance;
  }
}

export const prisma = PrismaClientSingleton.getInstance();
