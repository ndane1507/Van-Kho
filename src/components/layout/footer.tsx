import Link from 'next/link';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-block">
          <Link className="footer-brand" href="/">Văn <em>Khố</em></Link>
          <p>Văn Khố — Thư viện văn học THPT</p>
          <p className="muted">Đọc tác phẩm. Hiểu chiều sâu.</p>
        </div>
        <nav aria-label="Liên kết chân trang" className="footer-nav">
          <span className="footer-title">Khám phá</span>
          <Link href="/thu-vien">Thư viện tác phẩm</Link>
          <Link href="/tac-gia">Tác giả</Link>
          <Link href="/tro-ly-van-hoc">Trợ lý Văn học (AI)</Link>
          <Link href="/gioi-thieu">Về Văn Khố</Link>
        </nav>
        <div className="contact" aria-labelledby="footer-contact">
          <span className="footer-title" id="footer-contact">Liên hệ</span>
          <p className="contact-names">Liên hệ: Nguyễn Đức Anh &amp; Nguyễn Văn Đạt</p>
          <div className="contact-links">
          <a href="mailto:ngducanh15072009@gmail.com">
            <Mail size={15} aria-hidden="true" />ngducanh15072009@gmail.com
          </a>
          <a href="mailto:datnguyen02092009@gmail.com">
            <Mail size={15} aria-hidden="true" />datnguyen02092009@gmail.com
          </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Nội dung phân tích tự biên soạn. Tác phẩm gốc thuộc quyền của các chủ sở hữu tương ứng.</span>
        <span>Người thực hiện: Nguyễn Đức Anh &amp; Nguyễn Văn Đạt</span>
      </div>
      <div className="container footer-colophon" aria-hidden="true">
        <span>VĂN KHỐ · TỦ SÁCH VĂN HỌC THPT</span>
        <span>ĐỌC SÂU · HIỂU KỸ</span>
      </div>
    </footer>
  );
}
