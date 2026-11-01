import type { MetadataRoute } from 'next';
import {authors,genres,works} from '@/lib/content';
import {siteUrl} from '@/lib/seo';
export default function sitemap():MetadataRoute.Sitemap{const modifiedByPath=new Map(works.map(work=>[`/tac-pham/${work.slug}`,work.updatedAt]));return ['','/thu-vien','/lop-10','/lop-11','/lop-12','/tac-gia','/gioi-thieu','/tro-ly-van-hoc',...works.map(w=>`/tac-pham/${w.slug}`),...authors.map(a=>`/tac-gia/${a.slug}`),...genres.map(g=>`/the-loai/${g.slug}`)].map(p=>({url:`${siteUrl}${p}`,lastModified:modifiedByPath.get(p),changeFrequency:'monthly' as const,priority:p===''?1:0.7}));}
