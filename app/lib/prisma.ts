// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
// importing from the custom path you found!
import { PrismaClient } from "@prisma/client";

const rawUrl = process.env.DATABASE_URL ?? "";

// Strip any existing sslmode param from the URL to prevent the pg v8
// deprecation warning about ambiguous sslmode values (prefer/require
// being treated as verify-full). We handle SSL explicitly in Pool config.
const url = new URL(rawUrl);
url.searchParams.delete("sslmode");
const connectionString = url.toString();

// Initialize the pg pool with explicit SSL configuration
const pool = new Pool({
  connectionString,
  ssl: true,
});
const adapter = new PrismaPg(pool);

// The Next.js safety wrapper
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Pass the adapter into the PrismaClient just like your snippet
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
