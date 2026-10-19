# Văn Khố: ảnh chia sẻ và video giới thiệu

- Ảnh chia sẻ: `public/images/van-kho-share-v2.jpg`, 1200 × 630, JPEG.
- Bản gốc: `docs/media/van-kho-share-source.png`.
- Video đang sử dụng: `public/videos/van-kho-introduction-v3.mp4`, 30 giây, 1280 × 720, H.264/AAC, faststart. Thay bằng video do người dùng cung cấp ngày 19/10/2026 (`1792418511054_6911860222625045059_6911860222625045059.mp4`). Chỉ sắp xếp lại container để phát sớm, giữ nguyên luồng hình và âm thanh.
- Không có phụ đề hoặc phần chép lời bên dưới video, theo yêu cầu.
- Video giữ nguyên nội dung và âm thanh của tệp người dùng cung cấp; phát theo thao tác người dùng.
- Ảnh đầu video: `public/images/van-kho-film-poster-v3.jpg`, trích từ chính video thay thế.
- Hai ảnh mới tạo bằng built-in imagegen: `public/images/van-kho-reading-room.webp` và `public/images/van-kho-film-scene.jpg`; bản gốc lưu trong thư mục này.
- `scripts/create-introduction.py` là mã dựng phiên bản cũ v2, không thay thế video hiện dùng v3. Phông Newsreader và Be Vietnam Pro có bản quyền OFL lưu tại `fonts/`.

## Nội dung kịch bản phiên bản cũ (v2, lưu để tham khảo)

1. Văn Khố. Mở một trang sách, mở một thế giới.
2. Từ ý tưởng của Nguyễn Văn Đạt và Nguyễn Đức Anh.
3. Nơi gặp gỡ tác phẩm, tác giả và những cảm nhận riêng.
4. Để mỗi học sinh được đọc sâu, hiểu kỹ, và thêm yêu văn học.
5. Kết nối quá khứ. Truyền cảm hứng cho hiện tại. Văn Khố.

## Prompt ảnh (built-in imagegen)

Create a premium cinematic Vietnamese literature website social sharing cover, horizontal 1.91:1 composition. Brand: Văn Khố. A richly atmospheric antique Vietnamese scholarly library at golden morning light, an open aged book on a dark walnut desk at lower right, ink pen, paper, distant carved wooden bookshelves, subtle traditional Vietnamese pavilion silhouette visible through window, dust particles and warm amber light. Deep espresso brown and aged parchment gold palette. Completely NEW composition, refined editorial photographic realism. Left central area dark with elegant spacious very legible gold typography. Exact text only: large title "Văn Khố"; beneath "Kho tàng văn học trong tầm tay"; small bottom line "Nguyễn Văn Đạt & Nguyễn Đức Anh". Keep all text comfortably inset 10% from edges, correct Vietnamese accents. No extra paragraphs, no watermark, no busy icons. Designed for beautiful readable link previews, evocative literary heritage with modern clarity.

## Chia sẻ link

Open Graph và Twitter dùng cùng ảnh mới. Khi triển khai, `NEXT_PUBLIC_SITE_URL` cần là tên miền công khai của website (mặc định `https://van-kho.vercel.app`). Nền tảng chia sẻ có thể lưu bản xem trước cũ; cần yêu cầu nền tảng thu thập lại URL sau khi triển khai.

## Prompt ảnh mở đầu website (built-in imagegen)

Generate a cinematic editorial photograph for the hero of Văn Khố, a Vietnamese literature library. Portrait 4:5 ratio. A quiet old Vietnamese scholarly room, large open ivory book resting on a worn dark wooden desk in foreground, a few closed aged books, porcelain tea cup, delicate branch of white magnolia. Tall carved wooden window at right opens to a hazy tranquil Vietnamese river, lush green distant banks and limestone hills, faint sampan on the water, pale morning sky. Soft directional natural light, atmospheric dust, authentic tactile paper and ink, beautiful deep brown wood and desaturated olive vegetation with warm ivory highlights. Sophisticated restrained literary heritage, medium format photography, painterly subtle grain, exceptional real materials. Composition: open book prominent in lower center, window vertical at right, no people, no letters, no text, no logo, no watermark, no border. Calm spacious, luminous, not orange, not fantasy, not an advertisement. Full bleed image.

## Prompt ảnh phim (built-in imagegen)

Create a cinematic still frame for a 30-second Vietnamese literature brand film, wide horizontal 16:9, no text or lettering. A quiet traditional Vietnamese library in soft early morning light. Composition: LEFT THIRD is deep subtly detailed dark olive-brown shelving and shadow with generous negative space for separate film typography, RIGHT TWO THIRDS feature an old open Vietnamese poetry book, a small antique ink bowl and natural wooden brush on a beautifully tactile walnut desk, a carved wooden open window with fine white magnolia flowers, distant Vietnamese mountain river visible beyond. Unusually sophisticated restrained film photography, 35mm lens, shallow atmospheric depth, subtle authentic grain, slow contemplative mood, natural ivory paper, desaturated moss green outside, warm wood. Avoid orange oversaturation, candles, people, fantasy, glowing particles, visual clutter. Strong beautiful directional light touching open pages. No border, watermark, logo, or writing added to the image.

