import { auth, signIn, signOut } from "@/auth";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function AdminPage() {
  const session = await auth();

  // Chưa đăng nhập → hiện nút đăng nhập Google.
  if (!session?.user) {
    return (
      <div className="mx-auto flex max-w-[420px] flex-col items-center px-[22px] py-24 text-center">
        <h1 className="text-[22px] font-extrabold text-[#1E2330]">
          Trang quản trị
        </h1>
        <p className="mt-2 text-[14px] text-[#5E6675]">
          Đăng nhập bằng tài khoản Google của quản trị viên để xem danh sách
          khách hàng đã để lại thông tin tư vấn.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-[10px] bg-[#3E63DD] px-6 py-3 text-[14px] font-bold text-white transition hover:bg-[#2C49B8]"
          >
            Đăng nhập bằng Google
          </button>
        </form>
      </div>
    );
  }

  const db = getDb();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

  return (
    <div className="mx-auto max-w-[1120px] px-[22px] py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1E2330]">
            Khách để lại tư vấn
          </h1>
          <p className="mt-1 text-[13px] text-[#5E6675]">
            Tổng: {rows.length} khách · Đăng nhập: {session.user.email}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="rounded-[10px] border border-[#DCE1EB] bg-white px-4 py-2 text-[13px] font-semibold text-[#5E6675] transition hover:border-[#3E63DD] hover:text-[#3E63DD]"
          >
            Đăng xuất
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-[12px] border border-dashed border-[#DCE1EB] bg-white p-8 text-center text-[14px] text-[#5E6675]">
          Chưa có khách nào để lại thông tin.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[12px] border border-[#DCE1EB] bg-white">
          <table className="w-full text-left text-[13.5px]">
            <thead className="border-b border-[#DCE1EB] text-[12px] uppercase tracking-wide text-[#5E6675]">
              <tr>
                <th className="px-4 py-3 font-semibold">Thời gian</th>
                <th className="px-4 py-3 font-semibold">Họ tên</th>
                <th className="px-4 py-3 font-semibold">SĐT</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Nhu cầu</th>
                <th className="px-4 py-3 font-semibold">Lời nhắn</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#F0F2F7] last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-[#5E6675]">
                    {fmtDate(r.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#1E2330]">
                    {r.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{r.phone}</td>
                  <td className="px-4 py-3 text-[#5E6675]">{r.email || "—"}</td>
                  <td className="px-4 py-3">{r.topic || "—"}</td>
                  <td className="px-4 py-3 text-[#5E6675]">{r.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
