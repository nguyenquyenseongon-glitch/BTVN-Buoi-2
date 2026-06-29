import { loadEnvConfig } from "@next/env";
import type { Config } from "drizzle-kit";

// Nạp biến môi trường giống cách Next.js làm (đọc .env.local).
loadEnvConfig(process.cwd());

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
