import type { Metadata } from 'next';
const configuredSiteUrl=process.env.NEXT_PUBLIC_SITE_URL || 'https://van-kho.vercel.app';
export const siteUrl=['localhost','127.0.0.1','[::1]'].includes(new URL(configuredSiteUrl).hostname) ? 'https://van-kho.vercel.app' : configuredSiteUrl;
export const shareImage={url:'/images/van-kho-share-v2.jpg',width:1200,height:630,alt:'Văn Khố — Kho tàng văn học trong tầm tay. Nguyễn Văn Đạt & Nguyễn Đức Anh.'};
export function pageMeta(title:string,description:string,path:string):Metadata{return {title,description,alternates:{canonical:path},openGraph:{title:`${title} | Văn Khố`,description,url:path,locale:'vi_VN',type:'website',siteName:'Văn Khố',images:[shareImage]},twitter:{card:'summary_large_image',title,description,images:[shareImage]}};}
export function safeJson(data:unknown){return JSON.stringify(data).replace(/</g,'\\u003c');}
