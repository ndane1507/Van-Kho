# Văn Khố: nâng cấp giao diện và phim giới thiệu

## Hướng thiết kế

Redesign toàn bộ giao diện trên kiến trúc Next.js hiện có. Tinh thần thư viện văn học và tạp chí, với khoảng trắng rộng, ảnh giàu không khí, bố cục có nhịp điệu và cách đọc dễ theo dõi. Mức độ biến đổi bố cục 6/10, chuyển động 4/10, mật độ 3/10.

Newsreader phù hợp với nội dung văn học và nhận diện sẵn có của Văn Khố; Be Vietnam Pro giữ phần điều hướng, biểu mẫu và lời giải dễ đọc. Theo yêu cầu điều chỉnh, đã khôi phục nguyên bảng màu cũ trong globals.css: nền kem #FAF7EF, chữ nâu #201B14, điểm nhấn đỏ son #9A3B26; chế độ tối dùng nền nâu #191410 và điểm nhấn #DC9A6B. Bố cục mới được giữ nguyên.

## Kết quả rà soát

- Trang chủ cũ tập trung nhiều chữ ở giữa, ảnh phụ ít đóng vai trò dẫn dắt.
- Đường kẻ đôi, số viền và nhiều nhãn nhỏ làm phân cấp bị phân tán.
- Tìm kiếm thư viện nằm sau chín bài gợi ý, khiến người dùng phải cuộn để tra cứu.
- Video cũ phủ tối ảnh, đổi cảnh ngắt quãng; phông chữ và hình thức gần trình chiếu hơn một phim giới thiệu.
- Hệ thống có sẵn dữ liệu tác phẩm, ảnh minh họa, hồ sơ tác giả, biểu mẫu GET, mục lục và hai chế độ giao diện. Tiếp tục dùng các thành phần này.

## Phạm vi đã thay đổi

- Trang chủ: ảnh riêng, bố cục mở đầu mới, tìm kiếm nhanh, phim với nút phát riêng, bộ chọn tác phẩm bất đối xứng, lối vào từng lớp, chỉ mục thể loại và tác giả.
- Toàn website: hệ màu, kiểu chữ, khoảng cách, điều hướng, trạng thái tương tác, chân trang và các quy tắc trên điện thoại.
- Thư viện và tìm kiếm: đưa biểu mẫu lên đầu, gợi ý gọn, bộ lọc rõ, thứ tự A-Z thực hiện đúng lựa chọn.
- Trang đọc: cột nội dung có giới hạn, mục lục gọn, dẫn chứng dễ nhận ra, ảnh đầu trang lớn hơn.
- Tác giả: danh mục, chân dung, hồ sơ, mốc tiểu sử và phần đọc sâu được đồng bộ.
- Trợ lý AI: khu trò chuyện, bộ câu hỏi, trường nhập và thẻ thông tin đồng bộ; bỏ thẻ main lồng trong main.
- Menu điện thoại: hỗ trợ phím Escape và liên kết điều khiển ARIA.
- Video: 30 giây, năm cảnh với crossfade, chuyển động chậm, giọng đọc tiếng Việt, nhạc nền nguyên bản; không có phụ đề hoặc phần chép lời.
- Cập nhật sau đó: thay phim tự dựng bằng video người dùng cung cấp ngày 19/10/2026, giữ nguyên hình và âm thanh, dùng ảnh đầu video tương ứng. Phiên bản đang phát là `van-kho-introduction-v3.mp4`.

URL, dữ liệu văn học, tên điều hướng, tham số biểu mẫu, liên hệ và các neo đọc bài được giữ ổn định. Không thay đổi backend Trợ lý AI. Phim và ảnh không tự tải toàn bộ hoặc tự phát khi mở trang.

## Tệp chính

- `src/app/editorial.css`: lớp giao diện chung, responsive và chế độ tối.
- `src/app/page.tsx`: trang chủ mới.
- `src/components/media/intro-film.tsx`: trình phát video.
- `scripts/create-introduction.py`: dựng lại phim.
- `docs/media/introduction.md`: thông tin media và prompt.

## Kiểm tra

Build, TypeScript và ESLint đều đạt. Phim được giải mã đủ 750 khung hình / 30 giây. Đã thực hiện 72 kiểm tra bố cục cho trang chủ, thư viện, khối lớp, tác giả, hồ sơ, bài đọc, giới thiệu, Trợ lý AI và tìm kiếm: 360, 768, 1024, 1440 px ở cả chế độ sáng và tối. Tìm kiếm không dấu, lọc, thứ tự tên, trạng thái trống, menu, chuyển giao diện, giảm chuyển động và phát video đều đạt; không có lỗi JavaScript. Có 18 lượt axe ở hai chế độ giao diện, không phát hiện vi phạm trong các quy tắc được áp dụng.

Phụ đề được bỏ theo yêu cầu, vì vậy kiểm tra axe không áp dụng quy tắc `video-caption`; các kiểm tra tương phản, nhãn, landmark và bàn phím còn lại được thực hiện.
