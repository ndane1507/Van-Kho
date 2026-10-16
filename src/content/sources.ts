import expanded from './expanded/sources.json' with {type:'json'};
import {authorData} from './authors.ts';
const base = [
 {id:'ppct',title:'PPCT Kết nối tri thức, THPT Yên Lãng',kind:'ppct',note:'Tệp người dùng cung cấp, ký ngày 25/08/2026. Dùng để xác định lớp, học kỳ, thứ tự và tiết học; không dùng thay SGK.',accessedAt:'2026-10-09'},
 {id:'trang-giang-text',title:'Huy Cận: Tràng giang, bản văn trên Thi Viện',url:'https://www.thivien.net/Huy-Cận/Tràng-giang/poem-tzEin01iG68zsm2nWGm0IQ',kind:'original_text',note:'Đối chiếu phần bản thơ. Không dùng bài phân tích hoặc bình luận của thành viên làm nội dung.',accessedAt:'2026-10-09'},
 {id:'sgk-kntt',title:'SGK Ngữ văn Kết nối tri thức, lớp 10, 11, 12 (NXB Giáo dục Việt Nam)',kind:'original_text',note:'Nguồn xác định phạm vi bài đọc trong chương trình. Các nhận định phân tích là nội dung tự biên soạn của Văn Khố; chi tiết văn bản cần đối chiếu trực tiếp ấn bản SGK đang sử dụng.',accessedAt:'2026-10-10'},
 {id:'huy-can-museum',title:'Nhà thơ Huy Cận (1919–2005) — Bảo tàng Văn học Việt Nam',url:'https://baotangvanhoc.vn/giai-thuong-ho-chi-minh/dot-1/nha-tho-huy-can-1919-2005/',kind:'research',note:'Nguồn tiểu sử của Bảo tàng Văn học Việt Nam; đối chiếu ngày sinh, ngày mất và quê quán của Huy Cận.',accessedAt:'2026-10-10'},
 {id:'vang-bong',title:'Nhã Nam: Vang bóng một thời, Nguyễn Tuân',url:'https://nhanam.vn/review-sach-vang-bong-mot-thoi-nguyen-tuan',kind:'publisher',note:'Xác nhận tác giả và bối cảnh văn hóa của tập truyện. Không sao chép bài giới thiệu.',accessedAt:'2026-10-09'},
 {id:'binh-ngo-context',title:'Nguyễn Trãi và Bình Ngô đại cáo',url:'https://voer.edu.vn/m/binh-ngo-dai-cao/280bc45f',kind:'research',note:'Tư liệu mở VOER để đối chiếu bối cảnh lịch sử và tác giả; không thay thế nghiên cứu văn bản học.',accessedAt:'2026-10-09'},
 {id:'hon-publisher',title:'NXB Kim Đồng: Hồn Trương Ba da hàng thịt, Tôi và chúng ta',url:'https://nxbkimdong.com.vn/hon-truong-ba-da-hang-thit-toi-va-chung-ta-26',kind:'publisher',note:'Xác nhận tác giả Lưu Quang Vũ, thể loại kịch và ấn bản sách. ISBN 978-604-2-33018-3.',accessedAt:'2026-10-09'}
];

const lifeSources=authorData.flatMap(a=>a.lifeSourceUrl&&a.id!=='huy-can'?[{id:`${a.id}-life`,title:`${a.name} — hồ sơ tiểu sử`,url:a.lifeSourceUrl,kind:'research' as const,note:'Nguồn đối chiếu mốc sinh, mất, nơi sinh hoặc bối cảnh tiểu sử. Các niên đại có độ chính xác thấp hơn hoặc dị bản được ghi chú ngay trong hồ sơ.',accessedAt:'2026-10-10'}]:[]);
export const sourceData=[...base,...expanded,...lifeSources];
