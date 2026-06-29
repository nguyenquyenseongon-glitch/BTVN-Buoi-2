# Công cụ thuế SEONGON

Nền tảng các công cụ thuế online của **Kế toán SEONGON**. Bắt đầu từ công cụ
tính thuế TNCN 2026, phát triển dần thành nền tảng nhiều công cụ + blog + quản
lý khách hàng.

> Dự án học tập trong khóa Claude Code của SEONGON (nâng cấp từ BTVN Buổi 1).

## Tính năng hiện có

- **Tính thuế TNCN 2026** (`/thue-tncn`): biểu thuế lũy tiến 5 bậc, giảm trừ gia
  cảnh theo Nghị quyết 110/2025, thu nhập miễn thuế, bảo hiểm bắt buộc, tính
  theo tháng hoặc năm, in / lưu PDF.
- **Trang chủ** (`/`): danh sách công cụ.

(Các công cụ Gross↔Net, BHXH, GTGT… và blog, đăng nhập admin sẽ thêm ở các giai
đoạn sau — xem [`PLAN.md`](./PLAN.md).)

## Bộ công nghệ

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- Triển khai trên **Vercel**

## Chạy ở máy (local)

Cần Node.js 18.17 trở lên.

```bash
npm install      # cài thư viện (chỉ cần lần đầu)
npm run dev      # chạy bản phát triển tại http://localhost:3000
```

Các lệnh khác:

```bash
npm run build    # build bản production (kiểm tra lỗi trước khi deploy)
npm start        # chạy bản đã build
npm run lint     # kiểm tra lint
```

## Cấu trúc thư mục

```
src/
├── app/
│   ├── page.tsx              # Trang chủ (danh sách công cụ)
│   ├── thue-tncn/page.tsx    # Trang công cụ tính thuế TNCN
│   ├── layout.tsx            # Bố cục chung (header, footer, font)
│   └── globals.css           # CSS toàn cục
├── components/
│   ├── site-chrome.tsx       # Header + Footer dùng chung
│   ├── TaxTNCNCalculator.tsx # Giao diện công cụ tính thuế (client)
│   └── tncn-tool.css         # CSS riêng cho công cụ tính thuế
└── lib/
    └── tax.ts                # Logic tính thuế TNCN (tách riêng, tái dùng)
public/
└── logo-seongon.png          # Logo
```

## Triển khai

Kết nối repo này với [Vercel](https://vercel.com) → mỗi lần push lên nhánh
`main`, Vercel tự build và cập nhật web.

## Bản quyền

© 2026 Kế toán SEONGON.
