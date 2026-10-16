# Kết quả kiểm tra Văn Khố

Kiểm tra ngày 09/10/2026 trên Windows, bản production Next.js 16.4.0 tại localhost:3000. Không có deployment Vercel trong phiên này.

## Kiểm tra build và dữ liệu

| Kiểm tra | Kết quả |
|---|---|
| Lint | Qua, không lỗi/cảnh báo |
| TypeScript strict | Qua |
| Test dữ liệu | 5/5 qua |
| Build production | Qua; trang tác phẩm/tác giả được sinh tĩnh |
| Kiểm kê PPCT | 91 dòng đọc, 78 mục riêng; 0 dòng thiếu, 0 bản ghi trùng |
| Phạm vi | 60 chọn, 10 loại, 3 hồ sơ tác gia, 5 cần duyệt |
| Bài phân tích công khai | 60, liên kết đúng nguồn và tác giả |
| Rà soát giáo viên | 0; không hiển thị badge kiểm duyệt |

SHA256 của DOCX được lưu ở `src/content/curriculum/provenance.json`. Giới hạn phân trang được ghi rõ trong báo cáo; không suy diễn số trang PPCT.

## Kiểm tra trình duyệt

Playwright Chromium kiểm tra 77 trang, bao gồm toàn bộ 60 trang tác phẩm và các trang lõi.

96 kiểm tra bố cục gồm **8 trang** (trang chủ, thư viện, Tràng giang, Hồn Trương Ba, lớp 10, lớp 11, lớp 12, giới thiệu) × **6 độ rộng** (360, 390, 768, 1024, 1280, 1440px) × **2 theme** (sáng/tối). Không tràn ngang. Ảnh tải được; ảnh chụp trang chủ và Tràng giang được lưu ở `qa/`. Đã trực tiếp xem ảnh desktop/mobile và sáng/tối, kiểm tra dấu tiếng Việt, dòng chữ, cột đọc, ảnh và footer.

12 kiểm tra tương tác đã qua:

1. Tìm “trang giang” không dấu cho đúng một kết quả.
2. Bộ lọc lớp chia sẻ qua URL và giữ khi tải lại.
3. Lọc kết hợp, kết quả rỗng và xóa bộ lọc.
4. Sắp xếp nhan đề theo tiếng Việt.
5. Mục lục desktop, deep link và scroll spy.
6. Theme thủ công ghi nhớ; Hệ thống theo thay đổi sáng/tối của OS.
7. Điều hướng mobile và đóng menu khi chọn trang.
8. Mục lục mobile, tới đúng mục và đóng để không che bài đọc.
9. Reduced motion vô hiệu hóa smooth scroll.
10. Tác phẩm chưa xuất bản trả 404 và vẫn có footer.
11. Giới thiệu chỉ trình bày website và ích lợi, không hiện giới hạn trường học.
12. Thông tin bài đọc không hiện tiết học hoặc giới hạn thư viện trường.

Không có link nội bộ hỏng hoặc lỗi JavaScript ghi nhận. Anchors nội bộ có đích, không có id trùng. Sitemap, robots và hai JSON tải xuống trả 200. Không kiểm tra tự động toàn bộ website nguồn ngoài; các nguồn nội dung được mở đối chiếu trong quá trình biên soạn.

axe-core quét WCAG 2 A/AA và 2.1 AA trên 7 trang × 2 theme, không còn vi phạm tự động. Đã sửa tương phản số thứ tự mục lục. Lighthouse phát hiện thêm tên truy cập của logo và kích thước vùng bấm email; đã sửa. Kiểm tra tự động không thay thế rà soát accessibility thủ công đầy đủ.

Chi tiết máy đọc: `qa/browser-report.json`.

## Hiệu năng local

Các số dưới đây lưu lại phép đo Lighthouse 13.5 của bản ban đầu có bốn bài. Phép đo frontend mới trên trang lớp 12 nằm ở mục cuối tài liệu:

| Chỉ số | Kết quả |
|---|---|
| Performance | 91/100 |
| Accessibility | 100/100 |
| Best Practices | 100/100 |
| SEO | 100/100 |
| LCP lab | 3.4 giây |
| CLS lab | 0 |
| Total Blocking Time | 70ms |

LCP lab chưa đạt mục tiêu 2.5 giây trong lần đo này. TBT không phải INP. Chưa có dữ liệu Core Web Vitals thực địa ở phân vị 75; không khẳng định đạt mục tiêu CWV. Điểm local có thể thay đổi theo máy và điều kiện chạy. Font, ảnh và JavaScript được tối ưu; ảnh phục vụ AVIF/WebP qua next/image.

Báo cáo: `qa/lighthouse-home-final.report.html` và `.json`.

## Phụ thuộc

`npm audit --omit=dev` không ghi nhận lỗ hổng production tại thời điểm kiểm tra. Audit toàn bộ còn 5 cảnh báo mức high trong chuỗi phụ thuộc công cụ lint (braces/micromatch/fast-glob/Next ESLint); registry hiện chưa cung cấp bản vá braces. Không ép hạ Next.js sang một phiên bản lớn cũ để che cảnh báo. Sharp đã được cập nhật lên 0.35.5.

Lighthouse 13.5 khai báo yêu cầu Node >=22.19. Đã chạy thành công với Node 22.16 của máy hiện tại; nên dùng Node 22.19 trở lên để đúng phạm vi hỗ trợ của công cụ này.

## Giới hạn học thuật và triển khai

- 60 bài phân tích là nội dung tự biên soạn có nguồn đối chiếu, chưa được giáo viên rà soát và chưa kiểm tra trực tiếp SGK/SGV.
- Các mục cần duyệt và chưa đủ bài phân tích không hiện như bài hoàn chỉnh.
- Phạm vi trích SGK của Hồn Trương Ba chưa xác minh; ghi rõ pending.
- Chưa có ảnh chân dung có quyền sử dụng; tranh sông chiều được ghi rõ minh họa AI.
- Chưa deploy Vercel. Cần đặt NEXT_PUBLIC_SITE_URL bằng URL chính thức để canonical/sitemap đúng khi deploy.

## Kiểm tra bản mở rộng

77 trang, 96 kiểm tra độ rộng/theme, 12 tương tác: qua. axe ghi nhận 0 vi phạm tự động trên 7 trang ở sáng/tối; không có liên kết nội bộ hỏng, không có lỗi JavaScript. Kiểm tra riêng mọi trang tác phẩm trước khi bổ sung ảnh Muse: 39 ảnh tải được; 21 bài còn thiếu. Hiện đã bổ sung sáu ảnh cho thơ lớp 12, tổng 45 ảnh tải được và 15 bài đang chờ ảnh. Bộ ảnh gồm tranh riêng cho Tây Tiến, Cảm hoài, Đàn ghi ta của Lor-ca, Mộ, Nguyên tiêu và Vội vàng. Đã xem bảng ảnh cùng giao diện giới thiệu, lớp, thư viện ở desktop/mobile.

Ảnh chụp và kết quả nằm ở qa/illustrations-contact-sheet.png, qa/illustration-checks.json và qa/expanded-*.png. Dữ liệu có 56 dẫn nhập mới từ 125 đến 147 từ theo cách đếm khoảng trắng; mỗi bài có tám section cùng hồ sơ tác giả và nguồn tạo đủ cấu trúc trang. Không có ngày giáo viên rà soát được tự tạo.


## Kiểm tra lần chỉnh frontend

Đã tăng cỡ chữ, tổ chức lại trang lớp/thư viện/danh sách tác phẩm, và bổ sung giới thiệu website. Build, lint, năm test dữ liệu và bộ Playwright đã qua: 77 trang, 96 kiểm tra bố cục, 12 tương tác; axe trên bảy trang ở sáng/tối không ghi nhận vi phạm. Nội dung 60 tác phẩm và dữ liệu ảnh được giữ nguyên.

Kiểm tra riêng bằng `node scripts/qa-redesign.mjs`: đo cỡ chữ thật trên bốn trang ở 390/1440px, mô tả danh mục tối thiểu 16px, giới thiệu tối thiểu 17px, bài phân tích tối thiểu 18px. Kiểm tra gợi ý đọc thu gọn, mở bộ lọc trên điện thoại, đường dẫn đến học kỳ II (chín bài lớp 12), nội dung giới thiệu và ảnh chụp. Kết quả ở `qa/redesign-report.json`; ảnh ở `qa/redesign-*.png`.

Lighthouse 13.5 đo lại trang lớp 12 của bản mới: Performance 86, Accessibility 100, Best Practices 100, SEO 100; LCP lab 3.6 giây, CLS 0, TBT 210ms. LCP chưa đạt 2.5 giây trong phép đo local này, chưa có số liệu thực địa. Báo cáo ở `qa/lighthouse-redesign.report.html` và `.json`. Số liệu bản ban đầu phía trên chỉ để lưu lịch sử, không dùng làm số liệu bản mới.



## Cập nhật ảnh thơ lớp 12 và thông tin người thực hiện

Muse xác định các trang thơ lớp 12 trước đó thiếu `mediaId`; phần danh mục chỉ hiển thị số thứ tự. Sáu tranh Muse tạo đã được thêm riêng vào tác phẩm Tây Tiến, Cảm hoài, Đàn ghi ta của Lor-ca, Mộ, Nguyên tiêu và Vội vàng. Đã thêm metadata media, rút các tác phẩm này khỏi danh sách pending và nén tranh về WebP phù hợp giao diện. Tổng trước đó có 45 ảnh riêng, còn 15 tác phẩm chờ ảnh.

Footer có dòng “Người thực hiện: Nguyễn Văn Đạt” ở cuối, tách khỏi thông tin liên hệ đã có.

## Bổ sung 13 tranh minh họa mỹ thuật mới cho các tác phẩm (11/10/2026)

Đã tạo và tích hợp thành công 13 tranh minh họa sơn dầu nghệ thuật chất lượng cao (WebP 1400x933) thay thế cho các hình SVG thô sơ trước đây:
1. **Muối của rừng** (`muoi-cua-rung.webp`): Ông Diểu khoác súng trong rừng sương mây, hoa tử huyền trắng muốt nở bừng trên lối mòn.
2. **Tuyên ngôn Độc lập** (`tuyen-ngon-doc-lap.webp`): Bác Hồ đọc Tuyên ngôn Độc lập tại quảng trường Ba Đình 2/9/1945 giữa rừng cờ đỏ sao vàng.
3. **Xuân Tóc Đỏ cứu quốc** (`xuan-toc-do-cuu-quoc.webp`): Xuân Tóc Đỏ giơ cao vợt trên sân quần vợt Hà Nội xưa giữa đám đông thượng lưu và quan chức thuộc địa.
4. **Văn tế nghĩa sĩ Cần Giuộc** (`van-te-nghia-si-can-giuoc.webp`): Nghĩa binh áo vải cầm tầm vông, gươm dao và đuốc lửa xông lên công đồn trong đêm.
5. **Bài ca ngất ngưởng** (`bai-ca-ngat-nguong.webp`): Nguyễn Công Trứ ung dung cưỡi bò vàng qua đường làng, non xanh và mái chùa xa xa.
6. **Mùa lá rụng trong vườn** (`mua-la-rung-trong-vuon.webp`): Gian nhà Hà Nội chiều 30 Tết, bàn thờ gia tiên ấm cúng bên cành đào và vườn lá vàng rụng.
7. **Cà Mau quê xứ** (`ca-mau-que-xu.webp`): Rừng đước Cà Mau bạt ngàn, xuồng ba lá lướt trên rạch nước lúc bình minh hướng ra biển.
8. **Hải khẩu linh từ – Đền thiêng cửa bể** (`hai-khau-linh-tu.webp`): Ngôi đền cổ bên vách đá cửa biển sóng cuộn, bóng dáng liệt nữ Chế Thắng phu nhân thoảng ẩn hiện giữa sương khói.
9. **Nhân vật quan trọng** (`nhan-vat-quan-trong.webp`): Khlestakov huênh hoang trên ghế bành giữa đám quan chức thị trấn run rẩy cúi lạy hối lộ.
10. **Giấu của** (`giau-cua.webp`): Lão hà tiện Harpagon co ro ôm chặt tráp vàng dưới ánh nến chập chờn trong căn phòng tối.
11. **Những trò lố hay là Va-ren và Phan Bội Châu** (`nhung-tro-lo.webp`): Toàn quyền Va-ren khoa trương diễn thuyết trước cụ Phan Bội Châu uy nghiêm như pho tượng đồng.
12. **Nghệ thuật băm thịt gà** (`nghe-thuat-bam-thit-ga.webp`): Đám tiên chỉ xúm quanh chăm chú quan sát người thợ băm thịt gà chia phần tỉ mỉ giữa đình làng.
13. **Mấy ý nghĩ về thơ** (`may-y-nghi-ve-tho.webp`): Nhà thơ trẻ bên bàn viết dưới ánh đèn dầu trong lán nứa chiến khu Việt Bắc, trăng sáng trên đồi núi.
14. **Bước vào đời** (`buoc-vao-doi.webp`): Kiệt tác hội họa *Wanderer above the Sea of Fog* (1818) của Caspar David Friedrich — biểu tượng kinh điển cho người thanh niên trí thức đứng trước biển sương mờ ảo của tương lai và cuộc đời.
15. **Trở về** (`tro-ve.webp`): Kiệt tác hội họa *The Fog Warning* (1885) của Winslow Homer — người ngư phủ đơn độc dũng cảm trên con thuyền gỗ giữa đại dương mênh mông chèo về bờ sau cuộc chiến với biển cả (phù hợp trọn vẹn văn bản *Ông già và biển cả* của Hemingway).

Hiện tại, **100% toàn bộ 60 tác phẩm trong thư viện Văn Khố** đều đã có tranh mỹ thuật chất lượng cao (WebP 1400x933), hoàn toàn không còn bất kỳ hình SVG tạm bợ nào. Tất cả metadata đã được đồng bộ trong `src/content/expanded/media.json`. Bộ kiểm tra `npm test` đạt 5/5, build production thành công 141 trang tĩnh và bảng kiểm kê hình ảnh `qa/illustrations-contact-sheet.png` đã được cập nhật đầy đủ.


