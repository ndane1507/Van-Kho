import Link from 'next/link';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {ArrowRight,BookOpen,MapPin} from 'lucide-react';
import {authors,media,works} from '@/lib/content';
import {Reveal} from '@/components/motion/reveal';
import {WorkList} from '@/components/works/work-list';
import {Artwork} from '@/components/media/artwork';
import {pageMeta,safeJson,siteUrl} from '@/lib/seo';

export const dynamicParams=false;
export function generateStaticParams(){return authors.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const a=authors.find(a=>a.slug===slug);return a?pageMeta(a.name,a.bio,`/tac-gia/${slug}`):{};}
const dateVi=(value:string)=>new Intl.DateTimeFormat('vi-VN',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T00:00:00Z`));
const dateLabel=(exact?:string,year?:string)=>exact?dateVi(exact):year?`Năm ${year}`:'Chưa xác định';

export default async function Author({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const a=authors.find(a=>a.slug===slug);if(!a)notFound();
 const authorWorks=works.filter(w=>w.authorIds.includes(a.id));
 const featured=works.find(w=>w.id===a.featuredWorkId)??authorWorks[0];
 const image=media.find(m=>m.id===featured?.mediaId);
 const selectedSections=featured?.sections.filter(s=>s.kind==='interpretation')??[];
 const closeReading=(selectedSections.length?selectedSections:featured?.sections??[]).slice(0,3);
 const lifeNodes=[
  ...((a.birthDate||a.birthYear)?[{label:'Sinh',value:dateLabel(a.birthDate,a.birthYear),place:a.birthplace}]:[]),
  ...(a.lifeStatus==='living'?[{label:'Hiện tại',value:'Còn sống'}]:a.lifeStatus==='collective'||(!a.deathDate&&!a.deathYear)?[]:[{label:'Mất',value:dateLabel(a.deathDate,a.deathYear)}]),
 ] as {label:string;value:string;place?:string}[];
 const personJson={'@context':'https://schema.org','@type':'Person',name:a.name,description:a.bio,jobTitle:a.period,...(a.birthDate?{birthDate:a.birthDate}:{}),...(a.deathDate?{deathDate:a.deathDate}:{}),...(a.birthplace?{birthPlace:{'@type':'Place',name:a.birthplace}}:{}),url:`${siteUrl}/tac-gia/${slug}`};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJson(personJson)}}/><div className="container page-space author-page">
  <nav className="breadcrumbs" aria-label="Đường dẫn"><Link href="/tac-gia">Tác giả</Link><span>/</span><span>{a.name}</span></nav>
  <header className={`author-masthead ${a.portraitPath||image?'has-author-art':''}`}><div className="author-masthead-copy"><p className="eyebrow">HỒ SƠ TÁC GIẢ <span>·</span> {a.period}</p><h1>{a.name}</h1><p className="author-lede">{a.bio}</p><a className="author-source-link" href="#tieu-su">Xem mốc tiểu sử <ArrowRight size={17}/></a></div>
   <div className="author-facts" id="tieu-su"><div className="author-facts-head"><span>MỐC TIỂU SỬ</span><MapPin size={18}/></div><dl><div><dt>Sinh</dt><dd>{dateLabel(a.birthDate,a.birthYear)}</dd></div><div><dt>Mất</dt><dd>{a.lifeStatus==='living'?'Còn sống':dateLabel(a.deathDate,a.deathYear)}</dd></div><div><dt>Nơi sinh / quê quán</dt><dd>{a.birthplace??(a.lifeStatus==='collective'?'Nhiều cộng đồng và địa phương':'Chưa xác định')}</dd></div></dl>{a.lifeNote&&<p>{a.lifeNote}</p>}</div>
   {a.portraitPath ? (
    <figure className="author-masthead-art author-masthead-portrait">
      <div className="author-portrait-wrap">
        <Image src={a.portraitPath} alt={a.portraitCaption??`Chân dung ${a.name}`} width={400} height={400} className="author-portrait-img" priority/>
      </div>
      <figcaption>{a.portraitCaption??`Chân dung tác giả ${a.name}`}</figcaption>
    </figure>
   ) : image ? (
    <figure className="author-masthead-art"><Artwork asset={image} priority/><figcaption>Minh họa liên quan: {featured?.title ?? 'Tác phẩm'}</figcaption></figure>
   ) : null}
  </header>
  {lifeNodes.length>=2&&<Reveal><section className="timeline" aria-label="Các mốc đời chính"><ol>{lifeNodes.map((node)=><li className="timeline-node" key={node.label}><span className="timeline-dot" aria-hidden="true"/><p className="timeline-label">{node.label}</p><p className="timeline-value">{node.value}</p>{node.place&&<p className="timeline-place">{node.place}</p>}</li>)}</ol></section></Reveal>}
  <section className="author-reading-grid"><div className="author-section-label"><span>01</span><p>CHÂN DUNG<br/>VĂN HỌC</p></div><div className="author-essay"><p className="eyebrow">DẤU ẤN SÁNG TÁC</p><h2>Đọc người viết qua trang viết</h2><p>{a.style}</p></div></section>
  {featured&&<Reveal stagger><section className="author-feature"><div className="author-section-label"><span>02</span><p>TÁC PHẨM<br/>ĐỌC SÂU</p></div><div className="author-feature-body"><div className="author-feature-title"><div><p className="eyebrow">TÁC PHẨM TIÊU BIỂU</p><h2>{featured.title}</h2></div><Link href={`/tac-pham/${featured.slug}`} aria-label={`Mở phân tích ${featured.title}`}><ArrowRight/></Link></div><p className="author-feature-intro">{featured.intro}</p><div className="author-analysis-cards">{closeReading.map((section,index)=><article key={section.id}><span>{String(index+1).padStart(2,'0')} / {section.kind==='interpretation'?'ĐỌC VĂN BẢN':'GỢI Ý ĐỌC'}</span><h3>{section.title}</h3><p>{section.paragraphs.join(' ')}</p></article>)}</div><Link className="text-link author-feature-link" href={`/tac-pham/${featured.slug}`}>Đọc bài phân tích đầy đủ <ArrowRight size={17}/></Link></div></section></Reveal>}
  {authorWorks.length>0&&<Reveal stagger><section className="author-works"><div className="author-works-heading"><div><p className="eyebrow">TRONG VĂN KHỐ</p><h2>Tác phẩm liên quan</h2></div><span><BookOpen size={17}/>{authorWorks.length} bài đọc</span></div><WorkList items={authorWorks}/></section></Reveal>}
 </div></>;
}
