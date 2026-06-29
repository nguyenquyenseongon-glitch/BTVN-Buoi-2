import Link from "next/link";

type Tool = {
  href: string;
  title: string;
  desc: string;
  ready: boolean;
};

const TOOLS: Tool[] = [
  {
    href: "/thue-tncn",
    title: "Tính thuế TNCN 2026",
    desc: "Tính thuế thu nhập cá nhân theo biểu lũy tiến 5 bậc, giảm trừ gia cảnh mới, thu nhập miễn thuế và bảo hiểm bắt buộc.",
    ready: true,
  },
  {
    href: "/gross-net",
    title: "Đổi lương Gross ↔ Net",
    desc: "Quy đổi qua lại giữa lương Gross và lương thực nhận (Net), tính ngược bảo hiểm và thuế.",
    ready: true,
  },
  {
    href: "/bhxh",
    title: "Tính bảo hiểm xã hội",
    desc: "Tính mức đóng BHXH, BHYT, BHTN của người lao động và doanh nghiệp theo mức lương.",
    ready: true,
  },
  {
    href: "/thue-gtgt",
    title: "Tính thuế GTGT",
    desc: "Tính thuế giá trị gia tăng theo các mức thuế suất, hỗ trợ giá đã gồm và chưa gồm thuế.",
    ready: true,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[1120px] px-[22px]">
      <section className="py-12 sm:py-16">
        <p className="mb-3 flex items-center gap-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-[#3E63DD]">
          <span className="h-[3px] w-6 rounded bg-gradient-to-r from-[#0FA8A2] via-[#4A3FB5] to-[#C2155C]" />
          Kế toán SEONGON
        </p>
        <h1 className="max-w-[760px] text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.12] tracking-tight text-[#1E2330]">
          Bộ công cụ thuế online, chính xác theo quy định mới
        </h1>
        <p className="mt-3.5 max-w-[640px] text-[17px] text-[#5E6675]">
          Tính thuế TNCN, đổi lương Gross/Net, bảo hiểm, thuế GTGT… nhanh và miễn
          phí. Cập nhật theo Nghị quyết 110/2025 và biểu thuế áp dụng từ 2026.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2">
        {TOOLS.map((tool) =>
          tool.ready ? (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex flex-col rounded-[14px] border border-[#DCE1EB] bg-white p-6 shadow-[0_14px_40px_-22px_rgba(30,35,48,0.5)] transition-transform hover:-translate-y-0.5 hover:border-[#3E63DD]"
            >
              <div className="mb-3 inline-flex w-fit rounded-full bg-[#E7ECFC] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E63DD]">
                Dùng được ngay
              </div>
              <h2 className="text-[18px] font-bold text-[#1E2330]">
                {tool.title}
              </h2>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#5E6675]">
                {tool.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#3E63DD]">
                Mở công cụ
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ) : (
            <div
              key={tool.title}
              className="flex cursor-default flex-col rounded-[14px] border border-dashed border-[#DCE1EB] bg-white/60 p-6"
            >
              <div className="mb-3 inline-flex w-fit rounded-full bg-[#F4F6FC] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#5E6675]">
                Sắp ra mắt
              </div>
              <h2 className="text-[18px] font-bold text-[#5E6675]">
                {tool.title}
              </h2>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#8A93A3]">
                {tool.desc}
              </p>
            </div>
          ),
        )}
      </section>
    </div>
  );
}
