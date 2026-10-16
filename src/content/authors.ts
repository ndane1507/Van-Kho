import expanded from './expanded/authors.json' with {type:'json'};
import {authorLifeData} from './author-life-data.ts';
import portraitRecords from './author-portraits.json' with {type:'json'};
const portraitCaptionFor: Record<string, string> = Object.fromEntries(
 (portraitRecords as Array<{id: string; caption?: string}>)
  .filter((r) => r.caption)
  .map((r) => [r.id, r.caption as string])
);
const base = [
 {id:'huy-can',slug:'huy-can',name:'Huy Cận',period:'Thơ mới',bio:'Huy Cận (1919–2005) là nhà thơ Việt Nam, quê xã Ân Phú, huyện Hương Sơn, tỉnh Hà Tĩnh. Ông là gương mặt tiêu biểu của phong trào Thơ mới; Tràng giang cho thấy một thế giới thơ nơi cảnh sông nước rộng lớn làm hiện rõ cái tôi cô đơn và nhu cầu tìm về sự gắn bó.',style:'Trong Tràng giang, hình ảnh cổ điển như sông, mây, chim được đặt cạnh những vật thể đời thường như cành củi, cánh bèo. Tương phản lớn–nhỏ, gần–xa và sự vắng mặt của cầu đò làm nỗi cô đơn thành cấu trúc của cảnh; nỗi nhớ quê ở cuối bài đưa mạch thơ về nhu cầu thuộc về một nơi chốn.',sourceIds:['huy-can-museum','trang-giang-text'],status:'published',birthDate:'1919-05-31',deathDate:'2005-02-19',birthplace:'Xã Ân Phú, huyện Hương Sơn, tỉnh Hà Tĩnh',featuredWorkId:'trang-giang'},
 {id:'nguyen-tuan',slug:'nguyen-tuan',name:'Nguyễn Tuân',period:'Văn học hiện đại',bio:'Nguyễn Tuân là tác giả tập Vang bóng một thời. Những nếp sống, thú chơi và phẩm cách của một thời đã qua trở thành chất liệu cho thế giới nhân vật của tập truyện.',style:'Trong Chữ người tử tù, Nguyễn Tuân tổ chức tương phản mạnh, chú ý vẻ tài hoa và phẩm cách của nhân vật. Ngôn ngữ miêu tả làm cho một cảnh đời thường có sức gợi như một cảnh tượng nghệ thuật.',sourceIds:['vang-bong','vang-bong'],status:'published'},
 {id:'nguyen-trai',slug:'nguyen-trai',name:'Nguyễn Trãi',period:'Văn học trung đại',bio:'Nguyễn Trãi là nhà văn, nhà thơ và nhân vật lịch sử gắn với cuộc khởi nghĩa Lam Sơn. Bình Ngô đại cáo được viết thay lời Lê Lợi để công bố thắng lợi và nền độc lập của Đại Việt.',style:'Trong Bình Ngô đại cáo, lập luận chính trị gắn với sự quan tâm đến đời sống nhân dân. Giọng điệu biến đổi theo từng phần, từ xác lập nguyên lý đến tố cáo, kể lại cuộc chiến và tuyên bố hòa bình.',sourceIds:['binh-ngo-context','binh-ngo-context'],status:'published'},
 {id:'luu-quang-vu',slug:'luu-quang-vu',name:'Lưu Quang Vũ',period:'Văn học sau 1975',bio:'Lưu Quang Vũ là nhà thơ, nhà viết kịch Việt Nam. Những vở kịch như Hồn Trương Ba, da hàng thịt và Tôi và chúng ta đặt con người trước các lựa chọn khó khăn trong đời sống cá nhân và xã hội.',style:'Tình huống sân khấu tập trung, đối thoại giàu sức tranh luận, các lựa chọn đạo đức được thể hiện qua hành động. Cốt truyện dân gian có thể trở thành điểm xuất phát cho câu hỏi về đời sống hiện đại.',sourceIds:['hon-publisher','hon-publisher'],status:'published'},
 {id:'nguyen-du',slug:'nguyen-du',name:'Nguyễn Du',period:'Văn học trung đại',bio:'Hồ sơ chưa được biên tập.',style:'Chưa xác minh nguồn.',sourceIds:['ppct'],status:'draft'},
 {id:'ho-chi-minh',slug:'ho-chi-minh',name:'Hồ Chí Minh',period:'Văn học hiện đại',bio:'Hồ sơ chưa được biên tập.',style:'Chưa xác minh nguồn.',sourceIds:['ppct'],status:'draft'}
];

const PORTRAIT_AUTHOR_IDS = new Set([
 'han-mac-tu',
 'ho-chi-minh',
 'huy-can',
 'kim-lan',
 'luu-quang-vu',
 'nam-cao',
 'nguyen-du',
 'nguyen-trai',
 'nguyen-tuan',
 'quang-dung',
 'thach-lam',
 'xuan-dieu',
 'xuan-quynh',
 // Đợt 2 (12/10/2026): chân dung Wikimedia Commons, xem src/content/author-portraits.json.
 // LƯU Ý: chỉ bật id khi file public/images/authors/{id}.webp đã tồn tại,
 // test content.test.mjs sẽ báo lỗi nếu thiếu file.
 'ho-me-ro',
 'shakespeare',
 'victor-hugo',
 'pushkin',
 'gogol',
 'chekhov',
 'robert-frost',
 'hemingway',
 'martin-luther-king',
 'do-phu',
 'phong-tu-khai',
 'ngo-thi-nham',
 'nguyen-cong-tru',
 'nguyen-dinh-chieu',
 'vu-trong-phung',
 'ngo-tat-to',
 'dao-duy-anh',
 'hoai-thanh',
 'svetlana-alexievich',
 'thanh-thao',
 // Đợt 3 (12/10/2026): ảnh tư liệu fair-use (tác giả hiện đại) và ảnh di tích
 // (tác giả cổ không còn chân dung xác thực). Mỗi ảnh có chú thích riêng
 // trong author-portraits.json, hiển thị thay cho dòng "Chân dung tác giả".
 'nguyen-huy-tuong',
 'nguyen-dinh-thi',
 'to-huu',
 'nguyen-huy-thiep',
 'hoang-phu-ngoc-tuong',
 'long-chuong',
 'nguyen-du-truyen-ky',
 'than-nhan-trung',
 'doan-thi-diem',
 'dang-dung',
 // Đợt 4 (12/10/2026): ảnh báo chí trong nước (fair-use) + tranh PD cho hồ sơ tập thể.
 'le-dat',
 'ma-van-khang',
 'tran-tuan',
 'chu-van-son',
 'dan-gian',
 'hai-cu-nhat-ban',
]);

export const authorData=[...base.filter(a=>!expanded.some(e=>e.id===a.id)),...expanded].map(a=>{
 const life=authorLifeData[a.id];
 const alreadySourced=a.id==='huy-can';
 const portraitPath=PORTRAIT_AUTHOR_IDS.has(a.id)?`/images/authors/${a.id}.webp`:undefined;
 const portraitCaption=portraitPath?portraitCaptionFor[a.id]:undefined;
 return {...a,...life,portraitPath,portraitCaption,sourceIds:[...a.sourceIds,...(life?.lifeSourceUrl&&!alreadySourced?[`${a.id}-life`]:[])]};
});

