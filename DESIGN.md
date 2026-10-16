# Văn Khố: thiết kế giao diện

Thư viện văn học cho học sinh THPT, theo hướng biên tập và bảo tàng số. Nội dung đọc là trung tâm, dùng bố cục riêng cho trang chủ, danh mục và bài phân tích.

Thiết lập theo design-taste-frontend: `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 2`, `VISUAL_DENSITY: 4`. Bố cục có nhịp và một bài nổi bật; chuyển động chỉ phản hồi thao tác và cuộn tới mục. Không dùng một hệ thống UI thương mại; nền tảng là CSS native và Tailwind 4.

## Tokens

| Vai trò | Sáng | Tối |
|---|---|---|
| Nền | `#f9f6ef` | `#1c1d1a` |
| Bề mặt | `#f0ebe1` | `#262823` |
| Chữ chính | `#292923` | `#eee9de` |
| Chữ phụ | `#66645b` | `#b1b0a3` |
| Điểm nhấn | `#785533` | `#d5b185` |
| Đường phân chia | `#dad5c9` | `#42443b` |
| Focus | `#875b33` | `#e0bd8c` |

Newsreader dùng cho tiêu đề vì brief yêu cầu phong cách văn học và nêu chính font này. Be Vietnam Pro cho nội dung, có hỗ trợ đầy đủ dấu tiếng Việt. next/font tải và phục vụ font từ ứng dụng. Cột bài đọc tối đa 720px; nội dung chính 19px, đoạn dẫn 20px; mobile giữ 18–19px với line-height 1.95. Mô tả danh mục 16px, giới thiệu 17–18px, metadata và nguồn 14px. Control 16px để dễ đọc và tránh tự phóng to trên điện thoại.

Khung ngoài tối đa 1380px, lề 40px desktop, 30px tablet, 16–20px mobile. Các breakpoint 390, 767, 900, 1100px phục vụ chuyển đổi bố cục. Không bo tròn khối bài; control chỉ bo 2px. Một bộ màu xuyên suốt, không đảo sáng/tối giữa các section.

## Các bố cục

- Trang chủ: nhận diện bằng chữ, tìm kiếm, bài nổi bật với tranh, ba lối vào lớp, danh sách đọc tiếp, thể loại/chủ đề và tác giả.
- Thư viện: tìm kiếm luôn hiển thị; bộ lọc thu gọn, tự mở khi URL có điều kiện lọc. Nhãn và control lớn; tác giả/chủ đề ở trang lớp chỉ liệt kê các lựa chọn thuộc lớp. Danh sách có thumbnail từ ảnh thật đã tạo, tên tác phẩm, tác giả, mô tả, lớp và học kỳ. Mobile đưa mô tả xuống hàng riêng để giữ chiều rộng đọc.
- Trang lớp: tab chọn lớp, dẫn nhập riêng cho từng lớp, số tác phẩm/thể loại/học kỳ tính từ dữ liệu, gợi ý cách đọc và đường dẫn nhanh đến học kỳ. Giữ thứ tự chương trình; không lặp số lớp lớn ở mọi hàng.
- Trang đọc: mục lục bên trái, cột đọc, thông tin bên phải. Tablet chuyển thông tin bài xuống dưới; mobile có mục lục thu gọn sticky và thông tin bài vẫn đọc được. Mục lục đóng khi chọn mục để không che nội dung.
- Trang tác giả: thông tin thật, không giả chân dung hoặc dữ kiện chưa có nguồn.
- Giới thiệu: mục đích, 60 bài/50 hồ sơ/3 lớp lấy từ dữ liệu, cấu trúc bài đọc, ba bước sử dụng, lợi ích trước buổi học/khi đọc viết/khi ôn tập và đường dẫn để bắt đầu. Nội dung chỉ giới thiệu website và ích lợi.

Z-index chỉ có ba lớp: nội dung mặc định, mục lục mobile 3, header 5 và skip link 10. Focus rõ; reduced-motion tắt smooth scroll và transition. Theme dùng next-themes, mặc định hệ thống và lưu lựa chọn.

58 minh họa AI và 2 minh họa SVG nội bộ bao phủ toàn bộ 60 tác phẩm, không còn bài chờ ảnh. Mọi bài đều có ảnh ở danh mục và trang đọc. Giao diện không dùng ảnh của bài khác để thay thế. Thumbnail ở danh mục là ảnh bổ trợ, dùng alt rỗng vì tên bài đã có trong cùng liên kết.

