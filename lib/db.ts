import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

if (typeof window === 'undefined') {
  // Use a fallback dummy string during build time if env is not loaded to prevent instantiation crashes
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/artisea?schema=public';
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  prismaClient = globalForPrisma.prisma || new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient;
  }
} else {
  // Provide client-side dummy to prevent compilation issues
  prismaClient = null as any;
}

export const db = prismaClient;
