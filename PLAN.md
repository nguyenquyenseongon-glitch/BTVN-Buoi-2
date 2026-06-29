# PLAN.md — Nền tảng công cụ thuế SEONGON

> Kế hoạch xây dựng web app fullstack: nền tảng các công cụ thuế cho SEONGON.
> Bắt nguồn từ công cụ tính thuế TNCN (BTVN Buổi 1) → nâng cấp thành sản phẩm thật.

## 1. Mục tiêu

Xây 1 website có nhiều công cụ thuế (bắt đầu từ tính thuế TNCN), có tài khoản
admin, lưu trữ dữ liệu thật, blog SEO, và quản lý khách hàng tiềm năng (lead)
cho đội sale SEONGON. Deploy public lên Vercel.

**Đối tượng dùng:**
- Khách/người dùng: dùng các công cụ tính thuế miễn phí, để lại thông tin tư vấn.
- Admin (bạn): cập nhật biểu thuế khi luật đổi, viết bài blog, xem lead, xem thống kê.

## 2. Bộ công nghệ (theo khuyến nghị khóa học)

| Thành phần | Lựa chọn |
|---|---|
| Khung web | Next.js 16 (App Router) + TypeScript — bản mới nhất do create-next-app cài |
| Giao diện | Tailwind CSS + shadcn/ui |
| Backend | Next.js API routes (chung repo) |
| Database | Postgres trên Neon (free tier) |
| Kết nối DB | Drizzle ORM |
| Đăng nhập | NextAuth + Google OAuth (chỉ admin) |
| Deploy | Vercel + Neon |
| Mã nguồn | GitHub (public repo) |

**Nguyên tắc:** giữ nguyên thiết kế + công thức tính thuế hiện có, chỉ chuyển nền
tảng sang Next.js để mở rộng được.

## 3. Kiến trúc tổng quan

```
Người dùng (trình duyệt)
        │
        ▼
  Next.js Frontend (giao diện, các trang công cụ)
        │  gọi API
        ▼
  Next.js API routes (backend: /api/*)
        │  truy vấn dữ liệu
        ▼
  Postgres (Neon) ── lưu: lịch sử tính, lead, biểu thuế, bài blog, user
```

Phép tính thuế vẫn chạy ngay ở trình duyệt (nhanh, tức thì). Database dùng để
**lưu trữ và quản lý**, không phải để tính.

## 4. Lộ trình theo giai đoạn

> Mỗi giai đoạn đều **deploy được và dùng được ngay**. Làm xong giai đoạn nào,
> commit + deploy + kiểm tra rồi mới sang giai đoạn sau.

### Giai đoạn 0 — Nền móng (Next.js + chuyển công cụ cũ sang)
- [ ] Khởi tạo project Next.js 14 + TypeScript + Tailwind + shadcn/ui.
- [ ] Chuyển công cụ tính thuế TNCN hiện tại thành component React (giữ nguyên
      thiết kế, màu, logo, công thức 5 bậc + thu nhập miễn thuế).
- [ ] Trang chủ: giới thiệu + danh sách công cụ (ban đầu có 1 công cụ).
- [ ] Push lên GitHub (repo public mới).
- [ ] Deploy Vercel → có URL live.
- **Xong khi:** web chạy đẹp như bản cũ, đã ở trên Next.js + Vercel.
- **Tài khoản cần:** Vercel (đăng nhập bằng GitHub).

### Giai đoạn 1 — Database + lưu trữ (thành fullstack thật)
- [x] **Phần A:** Lưu lịch sử các lần tính thuế ngay trên trình duyệt (localStorage,
      không cần đăng nhập) — nút "Lưu kết quả" + bảng lịch sử.
- [x] **Phần B:** Setup Neon Postgres + Drizzle ORM + `.env.example`.
- [x] **Phần B:** Form "Nhận tư vấn" — khách để lại tên + SĐT + nhu cầu → lưu DB
      (bảng `leads`), qua API route `POST /api/leads`.
- **Xong khi:** có FE + BE + DB thật; gửi form → lưu vào Neon. ✅
- **Còn lại:** thêm `DATABASE_URL` vào biến môi trường trên Vercel để bản
      production cũng lưu được (xem mục Triển khai).
- **Tài khoản cần:** Neon ✅ (đã có).

### Giai đoạn 2 — Đăng nhập + Trang admin
- [ ] NextAuth + Google OAuth, chỉ cho phép email admin của bạn.
- [ ] Trang admin (sau đăng nhập): xem danh sách lead.
- [ ] Biểu thuế + mức giảm trừ lưu trong DB → admin sửa được khi luật đổi
      (không cần sửa code).
- [ ] Xuất kết quả tính thuế ra PDF / Excel.
- **Xong khi:** đăng nhập được, admin sửa biểu thuế và xem lead.
- **Tài khoản cần:** Google Cloud Console (tạo OAuth credentials).

### Giai đoạn 3 — Thêm nhiều công cụ thuế
- [ ] Công cụ Gross ↔ Net.
- [ ] Công cụ tính BHXH.
- [ ] Công cụ thuế GTGT.
- [ ] (Mỗi công cụ là 1 trang riêng, dùng chung bố cục.)
- **Xong khi:** trang chủ có nhiều công cụ chạy được.

### Giai đoạn 4 — Blog tin tức thuế (SEO)
- [ ] Admin CRUD bài viết (thêm/sửa/xóa, có ảnh, tiêu đề cấp 1-2).
- [ ] Trang blog public + chi tiết bài, có SEO meta.
- **Xong khi:** đăng được bài, người ngoài đọc được, Google index được.

### Giai đoạn 5 — Dashboard + quản lý lead
- [ ] Dashboard: thống kê lượt dùng công cụ, số lead theo thời gian.
- [ ] Quản lý lead: gắn trạng thái (mới / đang tư vấn / xong), ghi chú.
- **Xong khi:** đội sale theo dõi và xử lý lead trên web được.

### Giai đoạn 6 — Tên miền riêng + hoàn thiện
- [ ] Gắn tên miền riêng (tùy chọn, ~$10/năm).
- [ ] Audit toàn diện: bảo mật, responsive, tốc độ, SEO.
- [ ] Sửa các lỗi Critical/High.
- **Xong khi:** sản phẩm hoàn chỉnh, chạy trên tên miền riêng.

## 5. Tài khoản & chuẩn bị cần thiết

**Nguyên tắc: chỉ dùng gói MIỄN PHÍ. Không nhập thẻ, không bị tính tiền.**

| Việc | Khi nào cần | Gói dùng | Chi phí |
|---|---|---|---|
| GitHub | Đã có ✅ | Free | 0đ |
| Vercel | Cuối Giai đoạn 0 | **Hobby (free)** | 0đ |
| Neon (database) | Giai đoạn 1 | Free (0.5GB) | 0đ |
| Google Cloud (OAuth đăng nhập) | Giai đoạn 2 | Free | 0đ |
| Tên miền riêng | Giai đoạn 6 | **Bỏ qua được** — dùng địa chỉ `*.vercel.app` miễn phí | 0đ (hoặc ~$10/năm nếu muốn) |

→ Có thể bắt đầu Giai đoạn 0 ngay, chưa cần tài khoản mới nào. Đến cuối Giai đoạn 0
mới cần tạo Vercel — khi đăng ký nhớ chọn gói **Hobby (Free)**, không chọn Pro.

Giới hạn gói free là quá đủ cho công cụ này (lưu lượng nhỏ). Chỉ khi web rất đông
khách mới cần cân nhắc nâng cấp — lúc đó tính sau.

## 6. Cấu trúc thư mục dự kiến (Next.js)

```
seongon-tax-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Trang chủ (danh sách công cụ)
│   │   ├── thue-tncn/page.tsx    # Công cụ tính thuế TNCN
│   │   ├── admin/                # Trang quản trị (sau login)
│   │   ├── blog/                 # Blog tin tức thuế
│   │   └── api/                  # Backend: /api/leads, /api/history...
│   ├── components/               # Component giao diện dùng chung
│   ├── lib/                      # Công thức tính thuế, tiện ích
│   └── db/                       # Schema + kết nối database
├── public/                       # Logo, ảnh tĩnh
├── .env.example                  # Mẫu biến môi trường (KHÔNG chứa secret)
├── README.md
├── CLAUDE.md                     # Tạo bằng /init
└── PLAN.md                       # File này
```

## 7. Quy tắc làm việc

- Làm tuần tự từng giai đoạn, **không nhảy cóc**.
- Mỗi tính năng: làm → test → commit Git → tiếp.
- **Không bao giờ commit secret** (mật khẩu DB, OAuth key) lên GitHub — dùng `.env`.
- Mỗi giai đoạn xong thì deploy lại và kiểm tra trên URL thật.
