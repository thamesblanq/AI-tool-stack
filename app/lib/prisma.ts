// lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL ?? "";

// Initialize the pg pool with explicit SSL to suppress the pg v8 sslmode warning
const pool = new Pool({
  connectionString,
  ssl: true,
});
const adapter = new PrismaPg(pool);

// The Next.js safety wrapper
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Pass the adapter into the PrismaClient
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
