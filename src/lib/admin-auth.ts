import crypto from "crypto";
import { cookies } from "next/headers";

// Cổng đăng nhập admin đơn giản bằng mật khẩu.
// Cookie KHÔNG chứa mật khẩu, chỉ chứa 1 token băm từ (mật khẩu + AUTH_SECRET)
// nên không thể giả mạo nếu không biết cả hai.

export const ADMIN_COOKIE = "admin_session";

/** Token phiên = SHA-256(mật khẩu :: AUTH_SECRET). */
export function sessionToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.AUTH_SECRET || "";
  return crypto.createHash("sha256").update(`${pw}::${secret}`).digest("hex");
}

/** So khớp mật khẩu nhập vào với ADMIN_PASSWORD (so sánh hằng-thời-gian). */
export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return false;
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(pw).digest();
  return crypto.timingSafeEqual(a, b);
}

/** Kiểm tra cookie phiên hiện tại có hợp lệ không (dùng trong trang admin). */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return Boolean(process.env.ADMIN_PASSWORD && token && token === sessionToken());
}
