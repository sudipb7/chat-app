import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient | undefined;
}

// Edge runtime support
const neon = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(neon);
const db = globalThis.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
