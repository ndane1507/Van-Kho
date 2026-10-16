import Link from 'next/link';
import {Search,ArrowRight,X} from 'lucide-react';
import {authors,authorFor,entryFor,genres,normalize,topics,works} from '@/lib/content';
import Form from 'next/form';
import {WorkList} from '@/components/works/work-list';
import {Reveal} from '@/components/motion/reveal';
import type {Work} from '@/lib/validation';
export type SearchParams=Record<string,string|string[]|undefined>;
export const param=(params:SearchParams,key:string)=>typeof params[key]==='string'?params[key] as string:'';
export function LibraryView({params,grade,genreSlug,action='/thu-vien',showPicks=false}:{params:SearchParams;grade?:number;genreSlug?:string;action?:string;showPicks?:boolean}){
 const q=param(params,'q'),g=grade?String(grade):param(params,'grade'),genre=genreSlug??param(params,'genre'),author=param(params,'author'),topic=param(params,'topic'),sort=param(params,'sort')||'curriculum';
 const byCurriculum=(a:Work,b:Work)=>entryFor(a)!.grade-entryFor(b)!.grade||entryFor(a)!.semester-entryFor(b)!.semester||entryFor(a)!.lessonOrder-entryFor(b)!.lessonOrder;
 const items=works.filter(work=>{const entry=entryFor(work)!;return (!g||String(entry.grade)===g)&&(!genre||work.genreSlug===genre)&&(!author||work.authorIds.includes(author))&&(!topic||work.topics.includes(topic))&&(!q||normalize([work.title,authorFor(work).name,work.genre,...work.topics,...work.keywords].join(' ')).includes(normalize(q.trim())));}).sort(byCurriculum);
 const filtered=Boolean(q||(!grade&&g)||(!genreSlug&&genre)||author||topic||sort==='az');
 const pickSlugs=['chu-nguoi-tu-tu','mua-xuan-chin','binh-ngo-dai-cao','vo-nhat','trang-giang','trao-duyen','tay-tien','muoi-cua-rung','hon-truong-ba-da-hang-thit'];
 const picks=pickSlugs.map(slug=>works.find(work=>work.slug===slug)).filter((work):work is Work=>Boolean(work)).sort(byCurriculum);
 const availableWorks=works.filter(work=>!grade||entryFor(work)!.grade===grade);
 const availableAuthors=authors.filter(item=>availableWorks.some(work=>work.authorIds.includes(item.id))).sort((a,b)=>a.name.localeCompare(b.name,'vi'));
 const availableTopics=topics.filter(item=>availableWorks.some(work=>work.topics.includes(item))).sort((a,b)=>a.localeCompare(b,'vi'));
 return <>
  {showPicks&&!filtered&&picks.length>0&&<section className="vk-picks" aria-labelledby="vk-picks-title"><div className="vk-sechead"><p className="vk-kicker">Biên tập chọn đọc</p><h2 id="vk-picks-title">Tác phẩm trọng tâm</h2></div><Reveal stagger><WorkList items={picks}/></Reveal><p className="vk-picks-note">Chín bài then chốt của chương trình — đọc trước để nắm mạch lớn, rồi tra cứu toàn bộ danh mục phía dưới.</p></section>}
  <Form className="vk-filter" action={action} scroll={false} role="search" aria-label="Tìm và lọc tác phẩm">
   <div className="vk-searchrow">
    <Search size={22} strokeWidth={1.5} aria-hidden="true"/>
    <label htmlFor="q" className="sr-only">Tìm tác phẩm, tác giả hoặc chủ đề</label>
    <input id="q" name="q" defaultValue={q} placeholder={grade?`Bạn muốn đọc gì ở lớp ${grade}?`:'Tên tác phẩm, tác giả hoặc chủ đề…'}/>
    <button className="vk-searchbtn" type="submit" aria-label="Tìm kiếm"><ArrowRight size={20}/></button>
   </div>
   <details className="vk-filters" open={filtered}>
    <summary>Bộ lọc &amp; sắp xếp{filtered?' · đang lọc':''}</summary>
    <div className="vk-filtergrid">
     {!grade&&<label>Lớp<select name="grade" defaultValue={g}><option value="">Tất cả lớp</option>{[10,11,12].map(value=><option key={value} value={value}>Lớp {value}</option>)}</select></label>}
     {!genreSlug&&<label>Thể loại<select name="genre" defaultValue={genre}><option value="">Tất cả thể loại</option>{genres.map(value=><option key={value.slug} value={value.slug}>{value.name}</option>)}</select></label>}
     <label>Tác giả<select name="author" defaultValue={author}><option value="">Tất cả tác giả</option>{availableAuthors.map(value=><option key={value.id} value={value.id}>{value.name}</option>)}</select></label>
     <label>Chủ đề<select name="topic" defaultValue={topic}><option value="">Tất cả chủ đề</option>{availableTopics.map(value=><option key={value}>{value}</option>)}</select></label>
     <label>Sắp xếp<select name="sort" defaultValue={sort}><option value="curriculum">Theo lớp &amp; học kỳ</option><option value="az">Tên tác phẩm A–Z</option></select></label>
     <button className="button" type="submit">Lọc kết quả</button>
    </div>
   </details>
  </Form>
  <div className="vk-resultline"><p><strong>{items.length}</strong> bài phân tích{q&&<> cho “{q}”</>}</p>{filtered&&<Link className="vk-clear" href={action}><X size={16}/>Xóa bộ lọc</Link>}</div>
  {grade&&items.length>0&&<nav className="vk-jumps" aria-label="Đến học kỳ">{[1,2].map(semester=><a key={semester} href={`#hoc-ky-${semester}`}><span>Học kỳ {semester===1?'I':'II'}</span><small>{items.filter(work=>entryFor(work)!.semester===semester).length} tác phẩm</small></a>)}</nav>}
  {items.length===0?<div className="empty-state"><h2>Chưa tìm thấy tác phẩm</h2><p>Thử một tên ngắn hơn, hoặc xóa bộ lọc để xem tất cả bài đang có.</p><Link className="text-link" href={action}>Xem lại danh mục <ArrowRight size={17}/></Link></div>:grade?<div className="vk-semesters">{[1,2].map(semester=>{
   const semesterWorks=items.filter(work=>entryFor(work)!.semester===semester);
   return <Reveal key={semester} stagger><section id={`hoc-ky-${semester}`} className="vk-semester"><h2 className="vk-semester-head"><span>Học kỳ {semester===1?'I':'II'}</span><small>{semesterWorks.length} bài phân tích</small></h2>{semesterWorks.length?<WorkList items={semesterWorks} showGrade={false}/>:<p className="vk-empty-sem">Không có tác phẩm phù hợp bộ lọc trong học kỳ này.</p>}</section></Reveal>;
  })}</div>:<Reveal stagger><WorkList items={items}/></Reveal>}
  <p className="vk-note">Danh mục theo đúng thứ tự chương trình; mỗi bài là một trang phân tích riêng.</p>
 </>;
}
