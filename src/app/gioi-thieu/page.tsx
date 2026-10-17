import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { authors, works } from '@/lib/content';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta(
  'Về Văn Khố',
  'Tìm hiểu sứ mệnh, tầm nhìn và cách Văn Khố đồng hành cùng học sinh THPT trong việc đọc sâu, hiểu kỹ tác phẩm văn học.',
  '/gioi-thieu'
);

export default function About() {
  return (
    <div className="container page-space about-page">
      <header className="about-intro">
        <div className="page-heading">
          <p className="eyebrow">VỀ VĂN KHỐ</p>
          <h1>
            Đọc để hiểu.{' '}
            <br />
            <em>Hiểu để cảm nhận.</em>
          </h1>
          <p>
            Văn Khố là thư viện tác phẩm và bài phân tích văn học dành cho học sinh THPT. Một nơi để
            tìm lại bài đang học, khám phá người viết và bước vào thế giới nghệ thuật bằng những chi
            tiết cụ thể.
          </p>
          <Link className="button" href="/thu-vien">
            Khám phá thư viện <ArrowRight size={19} />
          </Link>
        </div>
        <div className="about-purpose">
          <h2>
            Mỗi tác phẩm,{' '}
            <br />
            một lối khám phá.
          </h2>
          <p>
            Từ thơ, truyện kể đến kịch và ký, Văn Khố nối kiến thức về tác giả, bối cảnh, nội dung và
            nghệ thuật thành một mạch đọc dễ theo dõi. Bạn có thể đọc từ đầu, tìm thẳng đến phần cần
            hiểu hoặc mở rộng sang những tác phẩm có chung chủ đề.
          </p>
          <div className="about-stats">
            <div>
              <strong>{works.length}</strong>
              <span>bài phân tích</span>
            </div>
            <div>
              <strong>{authors.length}</strong>
              <span>hồ sơ tác giả</span>
            </div>
            <div>
              <strong>3</strong>
              <span>khối lớp 10–12</span>
            </div>
          </div>
        </div>
      </header>

      <section className="about-section" aria-labelledby="about-mission">
        <div>
          <p className="eyebrow">SỨ MỆNH CỦA VĂN KHỐ</p>
          <h2 id="about-mission">
            Văn học{' '}
            <br />
            cho mọi học sinh.
          </h2>
          <p className="muted" style={{ marginTop: '16px', fontSize: '17px', lineHeight: 1.9 }}>
            Văn Khố ra đời từ một quan sát giản dị: nhiều học sinh yêu văn nhưng thiếu một nơi đọc
            đáng tin — vừa bám sát chương trình, vừa khơi được cảm nhận riêng. Sứ mệnh của chúng
            tôi là lấp khoảng trống đó.
          </p>
        </div>
        <div className="about-content-list">
          <div>
            <h3>Đọc sâu, hiểu kỹ</h3>
            <p>
              Mỗi học sinh THPT đều xứng đáng chạm vào vẻ đẹp của tác phẩm trong chương trình —
              miễn phí, có hệ thống, từ lớp 10 đến lớp 12. Mỗi bài phân tích do đội ngũ tự biên
              soạn từ văn bản và bối cảnh xác thực, không sao chép văn mẫu, không trích toàn văn
              tác phẩm.
            </p>
          </div>
          <div>
            <h3>Học cách nghĩ, không học vẹt</h3>
            <p>
              Điểm số bền vững đến từ tư duy: biết đặt câu hỏi, tìm dẫn chứng trong văn bản và diễn
              đạt bằng lời của chính mình. Mọi mục trong thư viện đều dẫn người đọc đi con đường
              đó — từ luận điểm tới bằng chứng, từ cách biểu đạt tới ý nghĩa — thay vì dọn sẵn đáp
              án để chép.
            </p>
          </div>
          <div>
            <h3>Miễn phí, có hệ thống, minh bạch giới hạn</h3>
            <p>
              Toàn bộ {works.length} bài phân tích và {authors.length} hồ sơ tác giả được tổ chức
              theo lớp, học kỳ, thể loại và chủ đề, bám sát Chương trình GDPT 2018 (bộ Kết nối tri
              thức). Chỗ nào chưa kiểm chứng — phạm vi trích, bản dịch, thông tin lịch sử — chúng
              tôi ghi rõ &quot;chưa xác minh&quot; thay vì đoán mò.
            </p>
          </div>
          <div>
            <h3>Người bạn đồng hành AI</h3>
            <p>
              Trợ lý Văn học AI luôn sẵn sàng gợi mở dàn ý, giải thích điển tích và cùng em tháo gỡ
              từng đề bài — kể cả từ ảnh chụp đề kiểm tra hay phiếu học tập. AI hướng dẫn phương
              pháp, còn suy nghĩ và cây bút vẫn là của em.{' '}
              <Link className="text-link" href="/tro-ly-van-hoc">
                Hỏi Trợ lý AI <ArrowRight size={17} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-vision">
        <div>
          <p className="eyebrow">TẦM NHÌN &amp; CAM KẾT</p>
          <h2 id="about-vision">
            Từ tủ sách nhỏ{' '}
            <br />
            tới thói quen đọc.
          </h2>
        </div>
        <div className="about-content-list">
          <div>
            <h3>Tầm nhìn</h3>
            <p>
              Trở thành nơi đầu tiên học sinh tìm đến khi cần hiểu một tác phẩm — và là nơi các em
              quay lại khi muốn đọc thêm một tác phẩm ngoài chương trình. Đọc văn không chỉ để thi,
              mà để có thêm một cách nhìn về con người và cuộc đời.
            </p>
          </div>
          <div>
            <h3>Cam kết học thuật</h3>
            <p>
              Tự biên soạn, có nguồn đối chiếu cho từng mục; tách bạch &quot;phân tích&quot; khỏi
              &quot;sự thật văn bản&quot;; không gán thông tin chưa kiểm chứng; không hiển thị huy
              hiệu kiểm duyệt khi chưa có giáo viên rà soát. Mọi giới hạn được ghi trong bài, không
              giấu ở trang điều khoản.
            </p>
          </div>
          <div>
            <h3>Dành cho ai</h3>
            <p>
              Học sinh muốn chuẩn bị bài trước giờ học, muốn luyện cách viết đoạn văn nghị luận văn
              học, và muốn ôn tập nhanh mà vẫn giữ được mạch của tác phẩm. Giáo viên và phụ huynh
              cũng có thể dùng Văn Khố như tài liệu gợi mở thảo luận trên lớp và ở nhà.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-content">
        <div>
          <p className="eyebrow">BẠN SẼ TÌM THẤY GÌ?</p>
          <h2 id="about-content">
            Từ bối cảnh{' '}
            <br />
            đến từng chi tiết.
          </h2>
        </div>
        <div className="about-content-list">
          <div>
            <h3>Tác phẩm và người viết</h3>
            <p>
              Danh mục theo lớp, học kỳ và thể loại giúp bạn tìm đúng bài. Hồ sơ tác giả giới thiệu
              con người, phong cách sáng tác và những tác phẩm có trong thư viện.
            </p>
          </div>
          <div>
            <h3>Một bài phân tích có mạch</h3>
            <p>
              Phần tổng quan mở lối vào tác phẩm; bối cảnh, bố cục và nội dung tạo nền để đọc sâu.
              Phân tích đi vào hình ảnh, nhân vật, lời thoại và cách biểu đạt, rồi kết nối với nghệ
              thuật, hình tượng và giá trị của tác phẩm.
            </p>
          </div>
          <div>
            <h3>Những điểm tựa khi đọc</h3>
            <p>
              Mục lục dẫn đến từng phần, tóm tắt 60 giây gợi lại ý chính. Tranh minh họa giúp hình
              dung không gian nghệ thuật; mục chủ đề dẫn sang những bài đọc gần nhau.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" id="cach-su-dung" aria-labelledby="about-how">
        <div>
          <p className="eyebrow">CÁCH SỬ DỤNG</p>
          <h2 id="about-how">
            Bắt đầu bằng{' '}
            <br />
            điều bạn muốn hiểu.
          </h2>
        </div>
        <ol className="reading-steps">
          <li>
            <span>01</span>
            <div>
              <h3>Tìm bài đang cần đọc</h3>
              <p>
                Chọn lớp 10, 11 hoặc 12, rồi đến học kỳ tương ứng. Bạn cũng có thể tìm theo tên tác
                phẩm, tác giả hoặc chủ đề; tìm kiếm hỗ trợ cả tiếng Việt có dấu và không dấu.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Chọn độ sâu của lần đọc</h3>
              <p>
                Đọc tổng quan để nắm mạch chính, dùng mục lục để vào phần còn băn khoăn, hoặc theo
                toàn bộ bài phân tích. Khi ôn nhanh, mở mục tóm tắt 60 giây để hệ thống lại kiến
                thức.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Kết nối và tự diễn giải</h3>
              <p>
                Đọc hồ sơ tác giả, khám phá tác phẩm liên quan và theo các chủ đề gợi ý. Ghi lại một
                chi tiết tiêu biểu, giải thích tác dụng của nó rồi viết nhận xét bằng lời của bạn.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="about-section" aria-labelledby="about-benefits">
        <div>
          <p className="eyebrow">ĐỒNG HÀNH VỚI VIỆC HỌC VĂN</p>
          <h2 id="about-benefits">
            Chuẩn bị tốt hơn.{' '}
            <br />
            Cảm nhận sâu hơn.
          </h2>
        </div>
        <div className="about-content-list">
          <div>
            <h3>Trước buổi học</h3>
            <p>
              Làm quen với tác giả, bối cảnh và mạch nội dung. Một câu hỏi được hình thành trước khi
              đọc sẽ giúp bạn chú ý hơn đến những chi tiết đáng bàn trên lớp.
            </p>
          </div>
          <div>
            <h3>Khi đọc và viết</h3>
            <p>
              Quan sát cách một nhận xét được xây dựng từ chi tiết trong văn bản. Từ đó, luyện cách
              lựa chọn dẫn chứng, giải thích ý nghĩa và nối các ý thành một lập luận rõ ràng.
            </p>
          </div>
          <div>
            <h3>Khi ôn tập</h3>
            <p>
              Tra lại phần nghệ thuật, hình tượng và giá trị; đối chiếu những tác phẩm có chung chủ
              đề. Mục lục và tóm tắt giúp trở lại kiến thức cần nhớ mà vẫn giữ được mạch của bài
              đọc.
            </p>
          </div>
        </div>
      </section>

      <section className="about-closing">
        <div>
          <p className="eyebrow">MỞ MỘT TRANG SÁCH</p>
          <h2>Hành trình đọc bắt đầu từ đây.</h2>
          <p>
            Đọc trên máy tính hay điện thoại, chọn giao diện sáng, tối hoặc theo thiết bị để tìm một
            không gian phù hợp với bạn.
          </p>
        </div>
        <div className="about-links">
          {[10, 11, 12].map((grade) => (
            <Link key={grade} href={`/lop-${grade}`}>
              Văn học lớp {grade}
              <ArrowRight size={20} />
            </Link>
          ))}
          <Link href="/tac-gia">
            Khám phá tác giả
            <ArrowRight size={20} />
          </Link>
          <Link href="/tro-ly-van-hoc">
            Hỏi Trợ lý AI
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
