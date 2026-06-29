import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { leads } from "@/db/schema";

// postgres.js cần chạy trên Node.js runtime (không phải Edge).
export const runtime = "nodejs";

/** Nhận thông tin tư vấn từ form và lưu vào database. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên và số điện thoại." },
        { status: 400 },
      );
    }

    const db = getDb();
    const [lead] = await db
      .insert(leads)
      .values({
        name,
        phone,
        email: body?.email ? String(body.email).trim() : null,
        topic: body?.topic ? String(body.topic).trim() : null,
        note: body?.note ? String(body.note).trim() : null,
      })
      .returning({ id: leads.id });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("Lỗi khi lưu lead:", err);
    return NextResponse.json(
      { error: "Có lỗi xảy ra, vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
