import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient({
  adapter,
  log: ["error"],
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}