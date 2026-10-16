import type { Metadata } from 'next';
export const siteUrl=process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export function pageMeta(title:string,description:string,path:string):Metadata{return {title,description,alternates:{canonical:path},openGraph:{title:`${title} | Văn Khố`,description,url:path,locale:'vi_VN',type:'website',siteName:'Văn Khố'},twitter:{card:'summary_large_image',title,description}};}
export function safeJson(data:unknown){return JSON.stringify(data).replace(/</g,'\\u003c');}
