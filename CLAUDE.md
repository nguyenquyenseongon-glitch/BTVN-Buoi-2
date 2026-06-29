@AGENTS.md

# Công cụ thuế SEONGON — context cho Claude Code

Nền tảng công cụ thuế online (Next.js 16 + TypeScript + Tailwind v4, deploy
Vercel). Xem [`PLAN.md`](./PLAN.md) để biết lộ trình theo giai đoạn và
[`README.md`](./README.md) để biết cấu trúc + cách chạy.

## Quy ước

- **Tiếng Việt** cho nội dung hiển thị và bình luận; tên biến/hàm tiếng Anh.
- Logic tính thuế đặt ở `src/lib/` (thuần, không phụ thuộc UI) để tái dùng cho
  cả giao diện lẫn API về sau.
- Mỗi công cụ là 1 trang trong `src/app/<ten-cong-cu>/`.
- CSS riêng của 1 công cụ gói trong 1 class bao ngoài (vd `.tncn-tool`) để không
  ảnh hưởng trang khác; layout chung (header/footer) dùng Tailwind.
- **Không commit secret** (`.env*`, khóa OAuth, mật khẩu DB). Dùng `.env.local`.

## Trước khi deploy

Luôn chạy `npm run build` để bắt lỗi TypeScript/build trước khi push.
