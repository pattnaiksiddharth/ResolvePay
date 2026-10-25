import "dotenv/config";
import { defineConfig } from "@prisma/config";

/**
 * Prisma 7 Configuration
 * Neon Best Practice: Migrations and CLI tools use direct (non-pooled) DATABASE_URL_UNPOOLED.
 * Application runtime queries use pooled DATABASE_URL.
 */
function formatPrismaUrl(rawUrl?: string): string {
  if (!rawUrl) {
    return "postgresql://postgres:postgres@localhost:5432/resolvepay_dev?schema=public";
  }
  try {
    const parsed = new URL(rawUrl);
    // Remove channel_binding parameter as Prisma Rust engine does not support it
    parsed.searchParams.delete("channel_binding");
    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "15");
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: formatPrismaUrl(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
