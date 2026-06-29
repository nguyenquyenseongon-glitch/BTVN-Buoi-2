import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

/** Xóa cookie phiên và quay lại /admin. */
export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
