import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight} from 'lucide-react';
import {LibraryView,type SearchParams} from '@/components/library/library-view';
import {entryFor,works} from '@/lib/content';
import {pageMeta} from '@/lib/seo';

const introductions:Record<number,{title:string;description:string;guide:string}>={
 10:{title:'Từ câu chuyện đến vẻ đẹp ngôn từ.',description:'Khám phá thế giới thần thoại, sử thi, thơ ca và sân khấu dân gian. Các bài đọc giúp bạn nhận ra cách một câu chuyện được kể, một hình ảnh được gợi lên và một tiếng nói được cất thành thơ.',guide:'Bắt đầu từ nhân vật và cốt truyện khi đọc truyện kể. Với thơ, chú ý hình ảnh, nhịp điệu và cảm xúc; với sân khấu, theo dõi lời thoại và tình huống.'},
 11:{title:'Đọc điểm nhìn. Hiểu những tâm hồn.',description:'Đi sâu vào truyện ngắn, thế giới trữ tình, truyện thơ, kịch và ký. Từ những số phận đời thường đến những khát vọng lớn, mỗi tác phẩm mở ra một cách nhìn về con người và cuộc sống.',guide:'Khi đọc, hãy hỏi ai đang kể chuyện và điều gì được nhìn qua điểm nhìn ấy. Liên hệ chi tiết với tâm trạng, giọng điệu và xung đột để hiểu chiều sâu tác phẩm.'},
 12:{title:'Đi vào chiều sâu của con người.',description:'Đọc tiểu thuyết, thơ, truyện, kịch, văn tế và những trang hồi ký. Khám phá tiếng cười trào phúng, cảm hứng lịch sử, lựa chọn sống và những câu hỏi về giá trị con người qua từng tác phẩm.',guide:'Theo dõi cách tác giả xây dựng hình tượng, tổ chức tình huống và lựa chọn giọng điệu. Từ chi tiết cụ thể, kết nối nội dung với tư tưởng và giá trị nghệ thuật của toàn bài.'}
};
const getGrade=(slug:string)=>['lop-10','lop-11','lop-12'].includes(slug)?Number(slug.slice(4)):null;
export function generateStaticParams(){return [10,11,12].map(grade=>({grade:`lop-${grade}`}));}
export async function generateMetadata({params}:{params:Promise<{grade:string}>}){const {grade}=await params;const number=getGrade(grade);return pageMeta(number?`Văn học lớp ${number}`:'Không tìm thấy','Khám phá tác phẩm văn học theo lớp và học kỳ.',`/${grade}`);}
export default async function Grade({params,searchParams}:{params:Promise<{grade:string}>;searchParams:Promise<SearchParams>}){
 const {grade}=await params;const number=getGrade(grade);if(!number)notFound();
 const introduction=introductions[number];
 const classWorks=works.filter(work=>entryFor(work)!.grade===number);
 const genreCount=new Set(classWorks.map(work=>work.genreSlug)).size;
 return <div className="container page-space">
  <nav className="grade-tabs" aria-label="Chọn lớp">{[10,11,12].map(item=><Link key={item} href={`/lop-${item}`} aria-current={number===item?'page':undefined}>Lớp {item}</Link>)}</nav>
  <header className="grade-overview">
   <div className="page-heading"><p className="eyebrow">VĂN HỌC · KẾT NỐI TRI THỨC</p><h1>Văn học lớp {number}</h1><p className="grade-tagline">{introduction.title}</p><p>{introduction.description}</p><div className="grade-summary"><span><strong>{classWorks.length}</strong> tác phẩm</span><span><strong>{genreCount}</strong> thể loại</span><span><strong>2</strong> học kỳ</span></div></div>
   <aside className="reading-guide"><p className="eyebrow">GỢI Ý CÁCH ĐỌC</p><h2>Đọc từ chi tiết,<br/>hiểu cả tác phẩm.</h2><p>{introduction.guide}</p><Link className="text-link" href="/gioi-thieu#cach-su-dung">Tìm hiểu cách dùng Văn Khố <ArrowRight size={18}/></Link></aside>
   <details className="mobile-reading-guide"><summary>Gợi ý cách đọc tác phẩm</summary><p>{introduction.guide}</p><Link className="text-link" href="/gioi-thieu#cach-su-dung">Cách dùng Văn Khố <ArrowRight size={18}/></Link></details>
  </header>
  <LibraryView params={await searchParams} grade={number} action={`/${grade}`}/>
 </div>;
}
