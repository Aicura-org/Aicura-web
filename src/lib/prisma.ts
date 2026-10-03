import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('[Prisma] CRITICAL: DATABASE_URL environment variable is missing.');
}

const pool = new Pool({
  connectionString,
  ssl: false,
  max: 10,
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Clear stale in-memory cached instance so updated schema fields are picked up immediately
if (globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma.$disconnect();
  } catch {}
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
