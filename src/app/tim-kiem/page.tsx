import {LibraryView,param,type SearchParams} from '@/components/library/library-view';
import {pageMeta} from '@/lib/seo';
export async function generateMetadata({searchParams}:{searchParams:Promise<SearchParams>}){const q=param(await searchParams,'q');return {...pageMeta(q?`Tìm kiếm: ${q}`:'Tìm kiếm','Tìm tác phẩm có dấu hoặc không dấu.','/tim-kiem'),robots:{index:false,follow:true}};}
export default async function SearchPage({searchParams}:{searchParams:Promise<SearchParams>}){return <div className="container page-space"><div className="page-heading"><p className="eyebrow">TRA CỨU THƯ VIỆN</p><h1>Tìm kiếm</h1><p>Tìm bằng tên tác phẩm, tác giả, thể loại hoặc từ khóa. Có dấu hay không dấu đều được.</p></div><LibraryView params={await searchParams} action="/tim-kiem"/></div>;}
