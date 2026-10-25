import dotenv from "dotenv";
import { z } from "zod";

// Load .env file into process.env if present
dotenv.config();

// Schema defining required environment variables and their types
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_BASE_URL: z
    .string()
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message:
          "APP_BASE_URL must be a valid HTTP or HTTPS URL (e.g., http://localhost:5000)",
      },
    )
    .default("http://localhost:5000"),
  CLIENT_URL: z
    .string()
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message:
          "CLIENT_URL must be a valid HTTP or HTTPS URL (e.g., http://localhost:5173)",
      },
    )
    .default("http://localhost:5173"),
  DATABASE_URL: z.string().optional(),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  NEON_BRANCH: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
});

// Safe parse to prevent silent startup failures
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid or missing environment configuration:");
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  // Fail fast: terminate immediately so bad configs are caught at boot time
  process.exit(1);
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;
