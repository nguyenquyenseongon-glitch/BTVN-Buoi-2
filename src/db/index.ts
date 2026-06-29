import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Tái dùng 1 kết nối duy nhất (tránh tạo lại khi hot-reload ở dev).
declare global {
  // eslint-disable-next-line no-var
  var __pgClient: ReturnType<typeof postgres> | undefined;
}

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Thiếu DATABASE_URL. Kiểm tra .env.local (local) hoặc biến môi trường trên Vercel.",
    );
  }
  if (!globalThis.__pgClient) {
    // prepare:false để tương thích connection pooler của Neon.
    globalThis.__pgClient = postgres(url, { prepare: false });
  }
  return globalThis.__pgClient;
}

/** Lấy đối tượng db (Drizzle). Gọi trong API route khi cần truy vấn. */
export function getDb() {
  return drizzle(getClient());
}
