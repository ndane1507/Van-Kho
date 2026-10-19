import Link from 'next/link';
import { Sparkles, Camera, BookOpen, ShieldCheck } from 'lucide-react';
import { pageMeta } from '@/lib/seo';
import { AiTutorChat } from '@/components/ai/ai-tutor-chat';

export const metadata = pageMeta(
  'Trợ lý Văn học AI',
  'Giải đáp thắc mắc Ngữ văn, hướng dẫn lập dàn ý, đọc hiểu tác phẩm và phân tích ảnh đề bài trực tuyến cùng AI.',
  '/tro-ly-van-hoc'
);

export default function AiTutorPage() {
  return (
    <div className="container page-space ai-tutor-page">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link>
        <span>/</span>
        <span>Trợ lý Văn học</span>
      </nav>

      <header className="ai-tutor-header">
        <p className="eyebrow">TRỢ LÝ VĂN HỌC AI · KHÔNG GIAN HỌC TẬP TƯƠNG TÁC</p>
        <h1>
          Người đồng hành{' '}<br />
          <em>cùng từng trang viết.</em>
        </h1>
        <p>
          Giải đáp thắc mắc văn học, hướng dẫn lập dàn ý, gợi mở phương pháp đọc hiểu tác phẩm
          và phân tích trực tiếp từ ảnh chụp đề bài theo chuẩn chương trình GDPT 2018.
        </p>

        <div className="ai-badge-row">
          <span className="ai-badge">
            <BookOpen size={13} /> Chuẩn GDPT 2018 (Lớp 10, 11, 12)
          </span>
          <span className="ai-badge">
            <Camera size={13} /> Nhận diện ảnh đề thi &amp; phiếu học tập
          </span>
          <span className="ai-badge">
            <Sparkles size={13} /> Gợi ý cấu trúc &amp; luận điểm
          </span>
          <span className="ai-badge">
            <ShieldCheck size={13} /> Rèn luyện tư duy độc lập (Không chép văn)
          </span>
        </div>
      </header>

      <div className="ai-workspace">
        <AiTutorChat />
      </div>
    </div>
  );
}
