import Image from "next/image";
import Link from "next/link";

/** Thanh đầu trang dùng chung cho toàn site: logo + điều hướng. */
export function SiteHeader() {
  return (
    <header className="border-b border-[#DCE1EB] bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between gap-4 px-[22px]">
        <Link href="/" className="flex min-w-0 items-center gap-3.5">
          <Image
            src="/logo-seongon.png"
            alt="Kế toán SEONGON"
            width={3275}
            height={1700}
            className="h-9 w-auto"
            priority
          />
          <span className="hidden h-[34px] w-px bg-[#DCE1EB] sm:block" />
          <span className="hidden flex-col leading-tight sm:flex">
            <b className="text-[18px] font-extrabold tracking-tight text-[#1E2330]">
              Kế toán
            </b>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5E6675]">
              Công cụ thuế
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/"
            className="text-sm font-semibold text-[#5E6675] transition-colors hover:text-[#3E63DD]"
          >
            Trang chủ
          </Link>
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#3E63DD] transition-colors hover:text-[#2C49B8]"
          >
            Quản trị
          </Link>
          <span className="hidden rounded-full border border-[#C5D0F7] bg-[#E7ECFC] px-3 py-1.5 font-mono text-[12px] font-bold text-[#3E63DD] sm:inline">
            2026
          </span>
        </nav>
      </div>
    </header>
  );
}

/** Chân trang dùng chung cho toàn site. */
export function SiteFooter() {
  return (
    <footer className="border-t border-[#DCE1EB] bg-white">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-2 px-[22px] py-[22px] text-[13px] text-[#5E6675]">
        <span>© 2026 Kế toán SEONGON — Nền tảng công cụ thuế</span>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-semibold transition-colors hover:text-[#3E63DD]"
          >
            Quản trị
          </Link>
          <span className="font-mono">Cập nhật biểu thuế 2026</span>
        </div>
      </div>
    </footer>
  );
}
