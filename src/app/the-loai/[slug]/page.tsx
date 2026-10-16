import {notFound} from 'next/navigation';
import {genres} from '@/lib/content';
import {LibraryView,type SearchParams} from '@/components/library/library-view';
import {pageMeta} from '@/lib/seo';
export function generateStaticParams(){return genres.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=genres.find(x=>x.slug===slug);return pageMeta(g?.name??'Không tìm thấy','Đọc và khám phá tác phẩm theo thể loại.',`/the-loai/${slug}`);}
export default async function Genre({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<SearchParams>}){const {slug}=await params;const genre=genres.find(g=>g.slug===slug);if(!genre)notFound();return <div className="container page-space"><div className="page-heading"><p className="eyebrow">KHÁM PHÁ THEO THỂ LOẠI</p><h1>{genre.name}</h1><p>Mỗi thể loại mở ra một cách tổ chức thế giới nghệ thuật.</p></div><LibraryView params={await searchParams} genreSlug={slug} action={`/the-loai/${slug}`}/></div>;}
