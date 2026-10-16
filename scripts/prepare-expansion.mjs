import fs from 'node:fs';
const manifest=`
truyen-ve-cac-vi-than-sang-tao-the-gioi|ppct-10-1-1|Truyện về các vị thần sáng tạo thế giới|dan-gian|Thần thoại|than-thoai
 tan-vien-tu-phan-su-luc|ppct-10-1-2|Tản Viên từ Phán sự lục|nguyen-du-truyen-ky|Truyện truyền kỳ|truyen-truyen-ky
chum-tho-hai-cu|ppct-10-1-4|Chùm thơ hai-cư|hai-cu-nhat-ban|Thơ|tho
thu-hung|ppct-10-1-5|Thu hứng|do-phu|Thơ|tho
mua-xuan-chin|ppct-10-1-6|Mùa xuân chín|han-mac-tu|Thơ|tho
ban-hoa-am-ngon-tu|ppct-10-1-7|Bản hòa âm ngôn từ trong Tiếng thu của Lưu Trọng Lư|chu-van-son|Phê bình văn học|phe-binh-van-hoc
hien-tai-la-nguyen-khi|ppct-10-1-8|Hiền tài là nguyên khí của quốc gia|than-nhan-trung|Chính luận|chinh-luan
yeu-va-dong-cam|ppct-10-1-9|Yêu và đồng cảm|phong-tu-khai|Tiểu luận|tieu-luan
chu-bau-len-nha-tho|ppct-10-1-10|Chữ bầu lên nhà thơ|le-dat|Phê bình văn học|phe-binh-van-hoc
hec-to-tu-biet-ang-dro-mac|ppct-10-1-11|Héc-to từ biệt Ăng-đrô-mác|ho-me-ro|Sử thi|su-thi
 dam-san-di-bat-nu-than-mat-troi|ppct-10-1-12|Đăm Săn đi bắt Nữ Thần Mặt Trời|dan-gian|Sử thi|su-thi
xuy-van-gia-dai|ppct-10-1-13|Xúy Vân giả dại|dan-gian|Chèo|cheo
huyen-duong|ppct-10-1-14|Huyện đường|dan-gian|Tuồng|tuong
bao-kinh-canh-gioi|ppct-10-2-3|Bảo kính cảnh giới (Bài 43)|nguyen-trai|Thơ|tho
 duc-thuy-son|ppct-10-2-4|Dục Thúy sơn|nguyen-trai|Thơ|tho
nguoi-cam-quyen-khoi-phuc-uy-quyen|ppct-10-2-5|Người cầm quyền khôi phục uy quyền|victor-hugo|Tiểu thuyết|tieu-thuyet
 duoi-bong-hoang-lan|ppct-10-2-6|Dưới bóng hoàng lan|thach-lam|Truyện ngắn|truyen-ngan
mot-chuyen-dua-nho-nho|ppct-10-2-7|Một chuyện đùa nho nhỏ|chekhov|Truyện ngắn|truyen-ngan
con-duong-khong-chon|ppct-10-2-12|Con đường không chọn|robert-frost|Thơ|tho
vo-nhat|ppct-11-1-1|Vợ nhặt|kim-lan|Truyện ngắn|truyen-ngan
chi-pheo|ppct-11-1-2|Chí Phèo|nam-cao|Truyện ngắn|truyen-ngan
nho-dong|ppct-11-1-3|Nhớ đồng|to-huu|Thơ|tho
con-duong-mua-dong|ppct-11-1-5|Con đường mùa đông|pushkin|Thơ|tho
chieu-cau-hien|ppct-11-1-6|Chiếu cầu hiền|ngo-thi-nham|Chính luận|chinh-luan
 toi-co-mot-uoc-mo|ppct-11-1-7|Tôi có một ước mơ|martin-luther-king|Chính luận|chinh-luan
mot-thoi-dai-trong-thi-ca|ppct-11-1-8|Một thời đại trong thi ca|hoai-thanh|Phê bình văn học|phe-binh-van-hoc
loi-tien-dan|ppct-11-1-9|Lời tiễn dặn|dan-gian|Truyện thơ|truyen-tho
 duong-phu-hanh|ppct-11-1-10|Dương phụ hành|cao-ba-quat|Thơ|tho
thuyen-va-bien|ppct-11-1-11|Thuyền và biển|xuan-quynh|Thơ|tho
song-hay-khong-song|ppct-11-1-12|Sống, hay không sống|shakespeare|Kịch|kich
vinh-biet-cuu-trung-dai|ppct-11-1-13|Vĩnh biệt Cửu Trùng Đài|nguyen-huy-tuong|Kịch|kich
trao-duyen|ppct-11-2-2|Trao duyên|nguyen-du|Truyện thơ|truyen-tho
 doc-tieu-thanh-ki|ppct-11-2-3|Độc Tiểu Thanh kí|nguyen-du|Thơ|tho
ai-da-dat-ten-cho-dong-song|ppct-11-2-4|Ai đã đặt tên cho dòng sông?|hoang-phu-ngoc-tuong|Ký|ky
va-toi-van-muon-me|ppct-11-2-5|Và tôi vẫn muốn mẹ…|svetlana-alexievich|Ký|ky
ca-mau-que-xu|ppct-11-2-6|Cà Mau quê xứ|tran-tuan|Ký|ky
bai-ca-ngat-nguong|ppct-11-2-10|Bài ca ngất ngưởng|nguyen-cong-tru|Thơ|tho
van-te-nghia-si-can-giuoc|ppct-11-2-11|Văn tế nghĩa sĩ Cần Giuộc|nguyen-dinh-chieu|Văn tế|van-te
xuan-toc-do-cuu-quoc|ppct-12-1-1|Xuân Tóc Đỏ cứu quốc|vu-trong-phung|Tiểu thuyết|tieu-thuyet
mua-la-rung-trong-vuon|ppct-12-1-2|Mùa lá rụng trong vườn|ma-van-khang|Tiểu thuyết|tieu-thuyet
cam-hoai|ppct-12-1-3|Cảm hoài|dang-dung|Thơ|tho
 tay-tien|ppct-12-1-4|Tây Tiến|quang-dung|Thơ|tho
 dan-ghi-ta-cua-lor-ca|ppct-12-1-5|Đàn ghi ta của Lor-ca|thanh-thao|Thơ|tho
may-y-nghi-ve-tho|ppct-12-1-8|Mấy ý nghĩ về thơ|nguyen-dinh-thi|Phê bình văn học|phe-binh-van-hoc
hai-khau-linh-tu|ppct-12-1-9|Hải khẩu linh từ – Đền thiêng cửa bể|doan-thi-diem|Truyện truyền kỳ|truyen-truyen-ky
 muoi-cua-rung|ppct-12-1-10|Muối của rừng|nguyen-huy-thiep|Truyện ngắn|truyen-ngan
nhan-vat-quan-trong|ppct-12-1-11|Nhân vật quan trọng|gogol|Kịch|kich
 giau-cua|ppct-12-1-12|Giấu của|long-chuong|Kịch|kich
 tuyen-ngon-doc-lap|ppct-12-2-2|Tuyên ngôn Độc lập|ho-chi-minh|Chính luận|chinh-luan
mo|ppct-12-2-3|Mộ (Chiều tối)|ho-chi-minh|Thơ|tho
nguyen-tieu|ppct-12-2-4|Nguyên tiêu (Rằm tháng giêng)|ho-chi-minh|Thơ|tho
nhung-tro-lo|ppct-12-2-5|Những trò lố hay là Va-ren và Phan Bội Châu|ho-chi-minh|Truyện ngắn|truyen-ngan
nghe-thuat-bam-thit-ga|ppct-12-2-6|Nghệ thuật băm thịt gà|ngo-tat-to|Ký|ky
buoc-vao-doi|ppct-12-2-7|Bước vào đời|dao-duy-anh|Hồi ký|hoi-ky
voi-vang|ppct-12-2-11|Vội vàng|xuan-dieu|Thơ|tho
 tro-ve|ppct-12-2-12|Trở về|hemingway|Truyện ngắn|truyen-ngan
`.trim().split('\n').map(x=>{const [slug,curriculumId,title,authorId,genre,genreSlug]=x.trim().split('|');return {slug,curriculumId,title,authorId,genre,genreSlug};});
fs.writeFileSync('src/content/expansion-manifest.json',JSON.stringify(manifest,null,2));
fs.mkdirSync('src/content/expanded',{recursive:true});
fs.writeFileSync('src/content/expanded/works.json','[]');
fs.writeFileSync('src/content/expanded/authors.json','[]');
fs.writeFileSync('src/content/expanded/sources.json','[]');
fs.writeFileSync('src/content/expanded/media.json','[]');
console.log(manifest.length);
