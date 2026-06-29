import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, sessionToken } from "@/lib/admin-auth";

export const runtime = "nodejs";

/** Nhận mật khẩu từ form, đúng thì đặt cookie phiên và vào /admin. */
export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") || "");

  if (!checkPassword(password)) {
    return NextResponse.redirect(new URL("/admin?error=1", req.url), {
      status: 303,
    });
  }

  const res = NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });
  return res;
}
