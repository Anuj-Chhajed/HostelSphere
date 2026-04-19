// Prisma config — connection URLs for Supabase
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DATABASE_URL for app runtime (pooled connection)
    url: process.env["DATABASE_URL"],
    // Use DIRECT_URL for migrations/db push (direct connection)
    directUrl: process.env["DIRECT_URL"],
  },
});
