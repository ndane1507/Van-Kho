import fs from 'node:fs';
const edit=(p,f)=>fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const manifest=read('src/content/expansion-manifest.json');
manifest.find(m=>m.slug==='tro-ve').genre='Truyện vừa';manifest.find(m=>m.slug==='tro-ve').genreSlug='truyen-vua';
fs.writeFileSync('src/content/expansion-manifest.json',JSON.stringify(manifest,null,2));
const assets=read('src/content/expanded/media.json');
const works=read('src/content/expanded/works.json');
for(const w of works){if(!assets.some(a=>a.id===w.mediaId))delete w.mediaId;if(w.id==='tro-ve'){w.genre='Truyện vừa';w.genreSlug='truyen-vua';}}
fs.writeFileSync('src/content/expanded/works.json',JSON.stringify(works,null,2));
const pending=manifest.filter(m=>!assets.some(a=>a.id===m.slug)).map(m=>({workId:m.slug,title:m.title,reason:'imagegen_usage_limit_reached',status:'pending'}));
fs.writeFileSync('src/content/expanded/pending-illustrations.json',JSON.stringify(pending,null,2));
const reviewed=['ppct-10-1-7','ppct-10-1-9','ppct-10-1-13','ppct-11-2-6','ppct-12-1-9','ppct-12-2-6','ppct-12-2-7','ppct-12-2-12'];
const decisions=manifest.filter(m=>reviewed.includes(m.curriculumId)).map(m=>({curriculumId:m.curriculumId,includeDecision:'include',genre:m.genre,title:m.title,sourceId:m.slug+'-text',checkedAt:'2026-10-09',reason:'Đã đối chiếu nhan đề, tác giả, diễn biến và hình thức văn học bằng nguồn ghi trong bài. Giữ nguyên nhãn PPCT để truy nguồn; không coi nguồn thứ cấp là xác nhận ấn bản SGK.'}));
fs.writeFileSync('src/content/curriculum/editorial-decisions.json',JSON.stringify(decisions,null,2));
edit('scripts/audit-curriculum.mjs',s=>s.replace("const groups=[10,11,12]",`const decisions=JSON.parse(fs.readFileSync(path.join(root,'src/content/curriculum/editorial-decisions.json'),'utf8'));
for(const d of decisions){const e=entries.find(x=>x.id===d.curriculumId);if(!e)throw Error(d.curriculumId);e.includeDecision=d.includeDecision;e.genre=d.genre;e.decisionReason=d.reason;e.validationStatus='editorial_cross_checked_textbook_pending';for(const r of dispositions.filter(x=>e.sourceRows.includes(x.sourceRow)))r.includeDecision=d.includeDecision;}
const groups=[10,11,12]`).replace("normalize(w.title)===normalize(e.workTitle)","w.curriculumId?w.curriculumId===e.id:normalize(w.title)===normalize(e.workTitle)"));
edit('tests/content.test.mjs',s=>s.replace("norm(e.workTitle)===norm(w.title)","w.curriculumId?e.id===w.curriculumId:norm(e.workTitle)===norm(w.title)").replace("assert.equal(entries.find(e=>e.workTitle.startsWith('Hải khẩu')).includeDecision,'needs_review');","assert.equal(entries.find(e=>e.workTitle.startsWith('Hải khẩu')).includeDecision,'include');").replace("length,4);","length,60);").replace("for(const w of workData){assert.ok", "for(const w of workData){assert.equal(w.sections.length,8);assert.ok(w.sections.find(s=>s.id==='phan-tich').units.length>=3);assert.ok"));
edit('src/app/[grade]/page.tsx',s=>s.replace('import {curriculum,works,entryFor}', 'import {works,entryFor}').replace('import {works,entryFor} from \'@/lib/content\';',''));
fs.writeFileSync('src/app/nguon-tham-khao/page.tsx',`import {sources,media,works} from '@/lib/content';
import {pageMeta} from '@/lib/seo';
export const metadata=pageMeta('Nguồn tham khảo','Tài liệu đối chiếu và thông tin minh họa cho các bài đọc.','/nguon-tham-khao');
export default function Sources(){return <div className="container page-space"><div className="page-heading"><p className="eyebrow">ĐỌC CÓ CĂN CỨ</p><h1>Nguồn tham khảo</h1><p>Tìm hiểu thêm từ những tài liệu đi cùng bài đọc.</p></div><div className="prose-page"><h2>Tài liệu của các bài phân tích</h2><p>Thư viện có {works.length} bài phân tích tự biên soạn. Mỗi bài ghi nguồn đối chiếu ở cuối trang. Tài liệu chương trình dùng để sắp xếp lớp và học kỳ; nguồn văn bản và tài liệu học tập dùng để kiểm tra tác giả, diễn biến, hình ảnh và luận điểm. Các cách đọc trong phần phân tích là nhận định biên tập.</p><ol className="reference-list">{sources.map(s=><li key={s.id}><strong>{s.url?<a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>:s.title}</strong><p>{s.note}</p><small>Đối chiếu: 09/10/2026</small></li>)}</ol><h2>Tranh minh họa</h2><p>{media.length} tranh được tạo riêng bằng OpenAI ImageGen cho Văn Khố. Chú thích trên từng trang xác định đây là minh họa AI. Hình ảnh diễn giải không khí hoặc chi tiết tác phẩm, không được dùng như ảnh tư liệu lịch sử.</p><h2>Dữ liệu danh mục</h2><p><a href="/data/inventory.json" download>Tải danh mục tác phẩm</a> · <a href="/data/audit-report.json" download>Tải bảng đối chiếu tài liệu chương trình</a></p></div></div>;}`);
console.log({articles:works.length+4,images:assets.length+1,pendingImages:pending.length});
