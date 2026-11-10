import Link from 'next/link';
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
        <p className="eyebrow">VĂN KHỐ / TRỢ LÝ VĂN HỌC</p>
        <h1>
          Hiểu trang sách.<br />
          <em>Viết rõ ý mình.</em>
        </h1>
        <p>
          Từ một chi tiết chưa hiểu đến một đoạn văn rõ ý.
          Hỏi trực tiếp hoặc gửi ảnh đề bài Ngữ văn lớp 10–12.
        </p>

      </header>

      <div className="ai-workspace">
        <AiTutorChat />
      </div>
    </div>
  );
}
