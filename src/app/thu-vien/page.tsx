import {LibraryView,type SearchParams} from '@/components/library/library-view';
import {pageMeta} from '@/lib/seo';
export const metadata=pageMeta('Thư viện tác phẩm','Tìm bài phân tích theo lớp, tác giả, thể loại và chủ đề.','/thu-vien');
export default async function Library({searchParams}:{searchParams:Promise<SearchParams>}){return <div className="container page-space"><div className="page-heading"><p className="eyebrow">DANH MỤC TÁC PHẨM</p><h1>Thư viện</h1><p>Chọn một tác phẩm. Đọc theo cách của bạn.</p></div><LibraryView params={await searchParams} showPicks/></div>;}
