'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowUpRight,Search,UserRound} from 'lucide-react';

type AuthorCard={id:string;name:string;slug:string;period:string;bio:string;searchTerms:string;lifeLine:string;workTitle?:string;workSlug?:string;workCount:number;imagePath?:string;imageAlt?:string};
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLocaleLowerCase('vi');

export function AuthorDirectory({authors}:{authors:AuthorCard[]}){
 const [query,setQuery]=useState('');const [period,setPeriod]=useState('Tất cả');
 const periods=useMemo(()=>['Tất cả',...Array.from(new Set(authors.map(a=>a.period))).sort((a,b)=>a.localeCompare(b,'vi'))],[authors]);
 const filtered=useMemo(()=>authors.filter(a=>{
  const matchesPeriod=period==='Tất cả'||a.period===period;
  const target=normalize([a.name,a.searchTerms,a.period,a.bio,a.workTitle??'',a.lifeLine].join(' '));
  return matchesPeriod&&target.includes(normalize(query.trim()));
 }).sort((a,b)=>a.name.localeCompare(b.name,'vi')),[authors,period,query]);
 const gridRef=useRef<HTMLDivElement>(null);
 const hasResults=filtered.length>0;
 useEffect(()=>{
  const el=gridRef.current;if(!el)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||typeof IntersectionObserver==='undefined'){el.classList.add('is-visible');return;}
  const io=new IntersectionObserver((entries)=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');io.disconnect();}},{threshold:0,rootMargin:'0px 0px 20% 0px'});
  io.observe(el);return ()=>io.disconnect();
 },[hasResults]);
 return <section className="author-directory-list" aria-labelledby="directory-list-title">
  <div className="directory-list-heading"><div><p className="eyebrow">DANH MỤC TRA CỨU</p><h2 id="directory-list-title">Tìm một tác giả</h2></div><span>{filtered.length} / {authors.length} hồ sơ</span></div>
  <label className="author-search"><Search size={19}/><span className="sr-only">Tìm theo tên, tác phẩm hoặc thời kỳ</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tên tác giả, tác phẩm, thời kỳ…"/></label>
  <div className="author-period-filter" role="group" aria-label="Lọc theo thời kỳ">{periods.map(item=><button key={item} className={period===item?'active':''} onClick={()=>setPeriod(item)} aria-pressed={period===item}>{item}</button>)}</div>
  {filtered.length>0?<div ref={gridRef} className="author-directory-grid reveal-grid">{filtered.map((a,index)=><article className="directory-author-card" key={a.id}>
   <Link href={`/tac-gia/${a.slug}`} className="directory-card-main"><div className="directory-card-art">{a.imagePath?<Image src={a.imagePath} alt={a.imageAlt??`Minh họa ${a.workTitle??a.name}`} fill sizes="(max-width: 767px) 36vw, (max-width: 1050px) 28vw, 18vw"/>:<div className="directory-monogram" aria-hidden="true"><UserRound size={27}/></div>}<span>{String(index+1).padStart(2,'0')}</span></div><div className="directory-card-meta"><span>{a.period}</span><span>{a.lifeLine}</span></div><h3>{a.name}</h3><p>{a.bio}</p><div className="directory-card-foot"><span>{a.workCount?`${a.workCount} bài đọc${a.workTitle?` · ${a.workTitle}`:''}`:'Hồ sơ tác giả'}</span><ArrowUpRight size={18}/></div></Link>
  </article>)}</div>:<div className="author-empty"><p>Chưa tìm thấy hồ sơ phù hợp.</p><button onClick={()=>{setQuery('');setPeriod('Tất cả')}}>Xóa bộ lọc</button></div>}
 </section>;
}
