# Văn Khố

Website đọc và học Ngữ văn dành cho học sinh THPT lớp 10–12. Văn Khố giúp tìm tác phẩm, tìm hiểu tác giả và đọc các bài phân tích theo từng luận điểm.

## Tính năng

- Thư viện 60 tác phẩm với tìm kiếm tiếng Việt có dấu hoặc không dấu.
- Lọc theo lớp, thể loại, tác giả và chủ đề; chia sẻ kết quả bằng đường dẫn.
- Bài đọc có mục lục, tóm tắt, luận điểm, dẫn chứng, phân tích và nguồn đối chiếu.
- Hồ sơ 50 tác giả và các tác phẩm liên quan.
- Trợ lý văn học AI hỗ trợ gợi ý cách đọc, dàn ý và nhận xét bài viết; có thể nhận ảnh đề bài.
- Giao diện sáng/tối, thích ứng với điện thoại và máy tính.

## Chạy website

Yêu cầu Node.js 22.19 trở lên và npm.

```bash
npm ci
npm run dev
```

Mở http://localhost:3000. Chạy bản production:

```bash
npm run build
npm start
```

Để sử dụng trợ lý AI, sao chép `.env.example` thành `.env.local` và cấu hình `AI_API_KEY`. Khóa được sử dụng trên máy chủ; không đưa `.env.local` hoặc khóa thật lên GitHub. Các chức năng đọc và tìm kiếm hoạt động khi chưa cấu hình AI.

## Triển khai Vercel

Kết nối repository GitHub với project Vercel và cấu hình `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` cho môi trường Preview/Production. `AI_BASE_URL` phải là địa chỉ HTTPS của dịch vụ AI có thể truy cập từ Internet, không phải localhost. Đặt `NEXT_PUBLIC_SITE_URL` theo domain công khai của website.

Giao diện gọi `/api/tro-ly-van-hoc` trên cùng domain. Khi website chạy tại `https://van-kho.vercel.app`, API tự có địa chỉ `https://van-kho.vercel.app/api/tro-ly-van-hoc`; khóa AI vẫn chỉ được sử dụng trên server.

## Phát triển

Next.js App Router, React, TypeScript, Tailwind CSS và Zod. Source ứng dụng ở `src/`, tài nguyên công khai ở `public/`, công cụ bảo trì ở `scripts/` và kiểm thử ở `tests/`.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`npm ci` thiết lập lớp tương thích API cho bộ lint với minimatch đã vá bảo mật. Nếu cài bằng `--ignore-scripts`, chạy `node scripts/install-minimatch-compat.mjs` trước khi lint hoặc test.

## Nội dung và bản quyền

Bài phân tích do nhóm tự biên soạn và có nguồn đối chiếu. Dẫn chứng diễn ý được phân biệt với trích dẫn nguyên văn; người đọc nên đối chiếu văn bản đang học. Tác phẩm gốc thuộc quyền của chủ sở hữu tương ứng. Ảnh có chú thích nguồn; font đi kèm giấy phép trong `public/fonts/` và `docs/media/fonts/`.

Thực hiện bởi **Nguyễn Đức Anh & Nguyễn Văn Đạt**.
