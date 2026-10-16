# Văn Khố — Thư viện Văn học THPT

> **SẢN PHẨM HỌC TẬP SỐ**
> **MÔN NGỮ VĂN**
> **Năm học: 2026–2027**
> **Giáo viên: Võ Thị Mỹ Ngà**
> **Học sinh lớp: 12A4**
> **Khóa: K60 Trường THPT Yên Lãng**

## Giới thiệu

**Văn Khố** là website thư viện văn học dành cho học sinh Trung học Phổ thông. Web giúp các em tìm lại bài đang học, khám phá tác giả và bước vào thế giới nghệ thuật của tác phẩm qua những bài phân tích có hệ thống — từ bối cảnh, bố cục đến từng hình tượng và cách biểu đạt.

## Có gì trong web

- **60 bài phân tích tác phẩm** Ngữ văn lớp 10, 11, 12 (chương trình GDPT 2018, bộ Kết nối tri thức): thơ, truyện, kịch, ký, chính luận và phê bình văn học.
- **Hồ sơ tác giả**: tiểu sử, phong cách sáng tác và các tác phẩm liên quan.
- **Tìm kiếm tiếng Việt có dấu/không dấu** theo tên tác phẩm, tác giả, thể loại, chủ đề; bộ lọc chia sẻ qua đường dẫn.
- **Trang đọc tập trung**: mục lục bám theo bài, tóm tắt 60 giây, tranh minh họa, nguồn đối chiếu cho từng phần.
- **Trợ lý Văn học AI**: gợi mở dàn ý, giải thích điển tích, hướng dẫn đọc hiểu đề bài — kể cả từ ảnh chụp; rèn cách nghĩ thay vì dọn sẵn đáp án.
- **Giao diện sáng/tối**, đọc tốt trên điện thoại và máy tính.

## Cách chạy

Yêu cầu Node.js 22.16 trở lên.

```powershell
npm ci
npm run dev
```

Mở http://localhost:3000. Bản production:

```powershell
npm run build
npm start
```

Để dùng Trợ lý AI, tạo file `.env.local` theo mẫu `.env.example` và điền khóa API Gemini (`AI_API_KEY`).

## Công nghệ

Next.js (App Router), TypeScript, Tailwind CSS, next-themes, Zod, Lucide.

## Bản quyền

Nội dung phân tích do nhóm tự biên soạn. Tác phẩm gốc thuộc quyền của các chủ sở hữu tương ứng. Ảnh chân dung ghi rõ nguồn và giấy phép sử dụng.

Người thực hiện: **Nguyễn Đức Anh & Nguyễn Văn Đạt** — Lớp 12A4, Khóa K60, Trường THPT Yên Lãng.
