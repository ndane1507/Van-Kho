import fs from 'node:fs';
import path from 'node:path';
import { workData } from '../src/content/works.ts';
const root = path.resolve(import.meta.dirname, '..');
const raw = JSON.parse(fs.readFileSync(path.join(root,'src/content/curriculum/ppct-raw.json'),'utf8').replace(/^\uFEFF/,''));
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/\s+/g,' ').trim();
const excluded = ['Múa rối nước','Sự sống và cái chết','Nghệ thuật truyền thống','Phục hồi','Nữ phóng viên','Trí thông minh','Pa-ra-lim-pích','Pa-ra-ma','Giáo dục khai phóng','Đời muối'];
const review = ['Bản hoà âm','Yêu và đồng cảm','Về chính chúng ta','Một đời như kẻ tìm đường','Cộng đồng và cá thể','Nhìn về vốn văn hóa','Năng lực sáng tạo','Hải khẩu','Và tôi vẫn muốn mẹ','Cà Mau quê xứ','Nghệ thuật băm thịt gà','Bước vào đời','Trở về','Xuý Vân'];
const poetry = ['Chùm thơ','Thu hứng','Mùa xuân chín','Bảo kính','Dục Thuý','Con đường không chọn','Nhớ đồng','Tràng giang','Con đường mùa đông','Dương phụ','Thuyền và biển','Độc tiểu','Bài ca','Cảm hoài','Tây Tiến','Đàn ghi ta','Mộ','Nguyên tiêu','Vội vàng'];
const drama = ['Xuý Vân','Huyện đường','Sống, hay','Vĩnh biệt','Nhân vật quan trọng','Giấu của','Hồn trương'];
const criticism = ['Chữ bầu','Một thời đại','Mấy ý nghĩ','Bản hoà âm'];
const political = ['Bình Ngô','Hiền tài','Chiếu cầu hiền','Tuyên ngôn','Tôi có một'];
const starts = (title,list) => list.some(x=>normalize(title)===normalize(x) || normalize(title).startsWith(normalize(x)+' '));
let grade, semester=1, unit='', order=0;
const entries=[], dispositions=[];
for (const row of raw) {
  const text = row.cells.join(' ').replace(/\s+/g,' ').trim();
  const g=text.match(/MÔN\s+NGỮ VĂN\s*-\s*LỚP\s*(10|11|12)/i);
  if(g){grade=Number(g[1]);semester=1;order=0;unit='';continue;}
  if(/^HỌC KÌ\s*(2|II)$/i.test(text)){semester=2;order=0;continue;}
  if(/^Bài\s*\d+:/.test(text)){unit=text;continue;}
  const label=row.cells.find(c=>/^\s*Đọc\s+VB/i.test(c));
  if(!label || !grade) continue;
  const title=label.slice(label.indexOf(':')+1).replace(/\s+/g,' ').trim();
  const decision = /^Tác gia /.test(title)?'author_profile_only':starts(title,excluded)?'exclude_nonliterary':starts(title,review)?'needs_review':'include';
  const reason={include:'Tác phẩm hoặc thể loại văn học trong phạm vi; cần xác minh bản SGK trước khi xuất bản.',exclude_nonliterary:'Văn bản thông tin ngoài phạm vi thư viện tác phẩm.',author_profile_only:'Bài giới thiệu tác gia, chỉ tạo hồ sơ tác giả.',needs_review:'Cần xác minh thể loại, nhan đề hoặc phạm vi trước khi chọn xuất bản.'}[decision];
  dispositions.push({sourceRow:row.index,grade,semester,ppctLessonLabel:label,includeDecision:decision});
  for(const childTitle of title.split(/;\s*/)) {
    let entry=entries.find(e=>e.grade===grade && e.semester===semester && normalize(e.workTitle)===normalize(childTitle));
    if(entry){entry.periodReferences.push(row.cells[1]);entry.sourceRows.push(row.index);continue;}
    const genre=starts(childTitle,poetry)?'Thơ':starts(childTitle,drama)?'Kịch':starts(childTitle,criticism)?'Phê bình văn học':starts(childTitle,political)?'Chính luận':/^Văn tế/.test(childTitle)?'Văn tế':/sử thi/i.test(unit)?'Sử thi':/Truyện về các vị thần/.test(childTitle)?'Thần thoại':/Lời tiễn dặn|Trao duyên/.test(childTitle)?'Truyện thơ':/trong kí|tác phẩm kí/.test(unit)?'Ký':'Văn xuôi';
    entry={id:`ppct-${grade}-${semester}-${order+1}`,grade,semester,schoolYear:'2026 (năm ký tài liệu; chưa xác minh niên khóa)',textbookSeries:'Kết nối tri thức (theo phạm vi prompt)',unitTitle:unit,ppctLessonLabel:label,workTitle:childTitle,excerptTitle:null,genre,lessonOrder:++order,ppctPage:null,sourceRows:[row.index],periodReferences:[row.cells[1]],anthologyGroup:title.includes(';')?title:/Chùm|Truyện về các vị thần/.test(title)?title:null,includeDecision:decision,decisionReason:reason,validationStatus:'ppct_verified_textbook_pending',publicationStatus:'draft',sourcePPCT:'PPCT KET NOI- YL (1).docx'};
    entries.push(entry);
  }
}
const decisions=JSON.parse(fs.readFileSync(path.join(root,'src/content/curriculum/editorial-decisions.json'),'utf8'));
for(const d of decisions){const e=entries.find(x=>x.id===d.curriculumId);if(!e)throw Error(d.curriculumId);e.includeDecision=d.includeDecision;e.genre=d.genre;e.decisionReason=d.reason;e.validationStatus='editorial_cross_checked_textbook_pending';for(const r of dispositions.filter(x=>e.sourceRows.includes(x.sourceRow)))r.includeDecision=d.includeDecision;}
const groups=[10,11,12].flatMap(g=>[1,2].map(s=>{const items=entries.filter(e=>e.grade===g&&e.semester===s);return {grade:g,semester:s,distinctItems:items.length,readingRows:dispositions.filter(e=>e.grade===g&&e.semester===s).length,...Object.fromEntries(['include','exclude_nonliterary','author_profile_only','needs_review'].map(d=>[d,items.filter(e=>e.includeDecision===d).length]))};}));
const readingRows=raw.filter(r=>r.cells.some(c=>/^\s*Đọc\s+VB/i.test(c)));
for(const e of entries){const article=workData.find(w=>w.curriculumId?w.curriculumId===e.id:normalize(w.title)===normalize(e.workTitle));if(article){e.publicationStatus=article.status;e.workId=article.id;e.articleSlug=article.slug;} }
const missingRows=readingRows.filter(r=>!dispositions.some(d=>d.sourceRow===r.index)).map(r=>r.index);
const seenKeys=new Set();const duplicateRecords=entries.filter(e=>{const key=`${e.grade}:${e.semester}:${normalize(e.workTitle)}`;if(seenKeys.has(key))return true;seenKeys.add(key);return false;}).map(e=>e.id);
const report={source:'PPCT KET NOI- YL (1).docx',sourceSignedAt:'2026-08-25',auditedAt:'2026-10-09',rawRows:raw.length,readingRows:readingRows.length,distinctItems:entries.length,groups,missingRows,duplicateRecords:[],mergedRepeatedItems:entries.filter(e=>e.sourceRows.length>1).map(e=>({title:e.workTitle,sourceRows:e.sourceRows,periodReferences:e.periodReferences})),notes:['ppctPage để null: chưa có bản render phân trang đáng tin cậy. sourceRows là chỉ số 0-based trong ppct-raw.json, không phải số trang.','Một dòng Mộ; Nguyên tiêu có một quyết định include và hai đơn vị con.','Nhóm thần thoại và hai-cư chưa tách văn bản con vì chưa đối chiếu SGK.','Danh mục PPCT và bài phân tích xuất bản là hai tập dữ liệu riêng.','Năm 2026 là năm ký trong tài liệu, không suy diễn niên khóa 2026-2027.']};
report.duplicateRecords=duplicateRecords;
report.publishedArticles=workData.filter(w=>w.status==='published').length;
report.humanReviewedArticles=workData.filter(w=>w.status==='published'&&w.humanReviewedAt).length;
fs.writeFileSync(path.join(root,'src/content/curriculum/inventory.json'),JSON.stringify(entries,null,2));
fs.writeFileSync(path.join(root,'src/content/curriculum/row-dispositions.json'),JSON.stringify(dispositions,null,2));
fs.writeFileSync(path.join(root,'src/content/curriculum/audit-report.json'),JSON.stringify(report,null,2));
fs.mkdirSync(path.join(root,'public/data'),{recursive:true});
for(const filename of ['inventory.json','audit-report.json'])fs.copyFileSync(path.join(root,'src/content/curriculum',filename),path.join(root,'public/data',filename));
console.log(JSON.stringify(report,null,2));
if(missingRows.length||duplicateRecords.length) process.exitCode=1;
