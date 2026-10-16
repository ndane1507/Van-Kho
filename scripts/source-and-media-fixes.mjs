import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sources=read('src/content/expanded/sources.json');const mo=sources.find(x=>x.id==='mo-text'),nguyen=sources.find(x=>x.id==='nguyen-tieu-text');mo.url=nguyen.url;mo.title='Mộ (Chiều tối): bản đối chiếu trong bài Mộ, Nguyên tiêu';
fs.writeFileSync('src/content/expanded/sources.json',JSON.stringify(sources,null,2));
const checks=read('research/source-checks.json');Object.assign(checks.find(x=>x.slug==='mo'),{url:mo.url,title:mo.title});fs.writeFileSync('research/source-checks.json',JSON.stringify(checks,null,2));
const media=read('src/content/expanded/media.json');
const meta={'chu-nguoi-tu-tu':['Chữ người tử tù','Người tù viết chữ trong ánh đuốc, quản ngục kính cẩn trong buồng giam.'],'binh-ngo-dai-cao':['Bình Ngô đại cáo','Bút, cuộn giấy và ấn trên bàn, phía xa là núi trong ánh bình minh.'],'hon-truong-ba-da-hang-thit':['Hồn Trương Ba, da hàng thịt','Ghế trống giữa vườn cây sáng và bóng nặng trên tường, gợi xung đột hồn và xác.']};
for(const m of media)if(meta[m.id]){m.title='Minh họa '+meta[m.id][0];m.alt='Tranh AI: '+meta[m.id][1];}
fs.writeFileSync('src/content/expanded/media.json',JSON.stringify(media,null,2));
let p='scripts/research-sources.mjs',s=fs.readFileSync(p,'utf8');s=s.replace("'mo':'chieu-toi'","'mo':'mo-nguyen-tieu-1'").replace('const found=links.find(',"const found=m.slug==='mo'?undefined:links.find(");fs.writeFileSync(p,s);
p='src/components/library/library-view.tsx';s=fs.readFileSync(p,'utf8').replace('Theo lớp & PPCT','Theo lớp & học kỳ').replace('Chỉ hiển thị bài đã biên soạn. Danh mục PPCT và tình trạng nội dung được trình bày tại ','Tìm thêm tài liệu đối chiếu tại ');fs.writeFileSync(p,s);
console.log('Source metadata and illustration descriptions corrected');
