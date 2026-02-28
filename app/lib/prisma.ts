// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
// importing from the custom path you found!
import { PrismaClient } from "../generated/prisma/client/client";

const connectionString = `${process.env.DATABASE_URL}`;

// Initialize the pg pool and the Prisma adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// The Next.js safety wrapper
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Pass the adapter into the PrismaClient just like your snippet
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;