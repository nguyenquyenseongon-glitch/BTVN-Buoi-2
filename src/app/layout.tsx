import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans-app",
  display: "swap",
});

const jetMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Công cụ thuế SEONGON",
    template: "%s — Công cụ thuế SEONGON",
  },
  description:
    "Nền tảng công cụ thuế online của Kế toán SEONGON: tính thuế TNCN 2026 và nhiều công cụ khác. Miễn phí, theo quy định mới nhất.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${jetMono.variable}`}>
      <body>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
