import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight,ArrowUpRight,BookOpen,Users} from 'lucide-react';
import {authors,media,works} from '@/lib/content';
import {pageMeta} from '@/lib/seo';
import {AuthorDirectory} from '@/components/authors/author-directory';
import {Reveal} from '@/components/motion/reveal';

export const metadata=pageMeta('Tác giả','Tra cứu tiểu sử, phong cách và tác phẩm của các tác giả trong thư viện Văn Khố.','/tac-gia');
const yearOf=(date?:string,year?:string)=>date?.slice(0,4)??year;
export default function Authors(){
 const publishedWorks=works.length;
 const directory=authors.map(a=>{
  const work=works.find(w=>w.authorIds.includes(a.id));
  const art=media.find(m=>m.id===work?.mediaId);
  const start=yearOf(a.birthDate,a.birthYear),end=yearOf(a.deathDate,a.deathYear)??(a.lifeStatus==='living'?'nay':undefined);
  return {id:a.id,name:a.name,slug:a.slug,period:a.period,bio:a.bio,searchTerms:a.contributors?.map(c=>c.name).join(' ')??'',lifeLine:start&&end?`${start} — ${end}`:start?`Sinh ${start}`:a.lifeStatus==='collective'?'Tác giả tập thể':'Niên đại chưa xác định',workTitle:work?.title,workSlug:work?.slug,workCount:works.filter(w=>w.authorIds.includes(a.id)).length,imagePath:a.portraitPath??art?.path,imageAlt:a.portraitCaption??(a.portraitPath?`Chân dung ${a.name}`:art?.alt)};
 });
 const spotlight=authors.find(a=>a.id==='huy-can');
 const spotlightWork=works.find(w=>w.id===spotlight?.featuredWorkId)??works.find(w=>w.authorIds.includes('huy-can'));
 const spotlightImage=media.find(m=>m.id===spotlightWork?.mediaId);
 return <div className="container page-space author-directory-page">
  <nav className="breadcrumbs" aria-label="Đường dẫn"><Link href="/">Trang chủ</Link><span>/</span><span>Tác giả</span></nav>
  <header className="directory-heading"><div><p className="eyebrow">CON NGƯỜI · THỜI ĐẠI · TRANG VIẾT</p><h1>Những người<br/><em>viết nên văn chương.</em></h1><p>Tra cứu tác giả qua tiểu sử, dấu ấn sáng tác và những bài đọc có trong thư viện.</p></div><div className="directory-stats"><div><Users size={18}/><strong>{authors.length}</strong><span>hồ sơ tác giả</span></div><div><BookOpen size={18}/><strong>{publishedWorks}</strong><span>bài đọc văn học</span></div></div></header>
  {spotlight&&spotlightWork&&<Reveal><section className="directory-spotlight"><Link href={`/tac-gia/${spotlight.slug}`} className="spotlight-copy"><p className="eyebrow">HỒ SƠ ĐỌC SÂU <span>·</span> {spotlight.period}</p><h2>{spotlight.name}</h2><p>{spotlight.bio}</p><span className="spotlight-work">{spotlightWork.title}<ArrowUpRight size={17}/></span><span className="text-link">Mở hồ sơ tác giả <ArrowRight size={17}/></span></Link>{(spotlight.portraitPath||spotlightImage)&&<Link href={`/tac-gia/${spotlight.slug}`} className="spotlight-art"><Image src={spotlight.portraitPath??spotlightImage!.path} alt={spotlight.portraitPath?`Chân dung ${spotlight.name}`:spotlightImage!.alt} fill sizes="(max-width: 767px) 100vw, 45vw" priority/><span>{spotlight.portraitPath?`Chân dung ${spotlight.name}`:`Đọc ${spotlightWork.title}`}</span></Link>}</section></Reveal>}
  <AuthorDirectory authors={directory}/>
 </div>;
}
