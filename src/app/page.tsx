import Link from 'next/link';
import Form from 'next/form';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { Artwork } from '@/components/media/artwork';
import { WorkList } from '@/components/works/work-list';
import { Reveal } from '@/components/motion/reveal';
import { authorFor, authors, genres, topics, works, entryFor } from '@/lib/content';

const gradeLine = [
  'Truyện kể & vẻ đẹp thơ ca',
  'Điểm nhìn & thế giới trữ tình',
  'Tư tưởng & chiều sâu nhân sinh',
];

export default function Home() {
  const featured = works.find((w) => w.slug === 'trang-giang') ?? works[0];
  const latest = works.filter((w) => w.id !== featured.id).slice(0, 6);
  return (
    <div className="container">
      <section className="vk-hero-center" aria-labelledby="vk-hero-title">
        <div className="vk-hero-issue" aria-hidden="true">
          <span>SỐ MỞ ĐẦU — KẾT NỐI TRI THỨC</span>
          <span className="vk-issue-no">{works.length}</span>
        </div>
        <p className="vk-kicker">Thư viện văn học THPT · Đọc sâu · Hiểu kỹ</p>
        <h1 id="vk-hero-title">Đọc chậm,<br />hiểu <em>thật sâu.</em></h1>
        <p className="vk-lede">
          {works.length} bài phân tích tác phẩm từ lớp 10 đến lớp 12 — đi từ bối cảnh,
          bố cục đến từng hình tượng và cách biểu đạt.
        </p>
        <Form className="vk-herosearch" action="/tim-kiem" role="search" aria-label="Tìm trong thư viện">
          <Search size={20} strokeWidth={1.6} aria-hidden="true" />
          <label htmlFor="home-q" className="sr-only">Tìm tác phẩm hoặc tác giả</label>
          <input id="home-q" name="q" placeholder="Tên tác phẩm, tác giả…" autoComplete="off" />
          <button aria-label="Tìm kiếm" type="submit"><ArrowRight size={20} /></button>
        </Form>
        <nav className="vk-quickgrades" aria-label="Vào nhanh theo lớp">
          {[10, 11, 12].map((g) => (
            <Link key={g} href={`/lop-${g}`}>Lớp {g}<ArrowUpRight size={15} /></Link>
          ))}
        </nav>
      </section>

      <Reveal className="vk-featured-wrap">
        <section className="vk-featured" aria-label="Bài phân tích mở đầu">
          <Link href={`/tac-pham/${featured.slug}`} className="vk-coverart" aria-label={`Đọc bài phân tích ${featured.title}`}>
            <Artwork priority />
          </Link>
          <div className="vk-featured-body">
            <p className="vk-kicker">Bài mở đầu</p>
            <h2><Link href={`/tac-pham/${featured.slug}`}>{featured.title}</Link></h2>
            <p className="vk-covermeta">{featured.genre} · Lớp {entryFor(featured)!.grade} · {authorFor(featured).name}</p>
            <p className="vk-coverdesc">{featured.description}</p>
            <p className="art-caption">Tranh sông chiều, minh họa tạo bằng AI.</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="vk-grades" aria-labelledby="vk-grades-title">
          <div className="vk-sechead"><p className="vk-kicker">Mục lục</p><h2 id="vk-grades-title">Ba khối lớp, một hành trình</h2></div>
          <div className="vk-graderows">
            {[10, 11, 12].map((g, i) => (
              <Link href={`/lop-${g}`} key={g} className="vk-graderow">
                <span className="vk-gradenum" aria-hidden="true">0{i + 1}</span>
                <span className="vk-gradebody">
                  <span className="vk-gradetitle">Văn học lớp {g}</span>
                  <span className="vk-gradedesc">{gradeLine[i]}</span>
                </span>
                <span className="vk-gradecount">{works.filter((w) => entryFor(w)!.grade === g).length} bài</span>
                <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal stagger>
        <section className="vk-latest" aria-labelledby="vk-latest-title">
          <div className="vk-sechead"><p className="vk-kicker">Đọc tiếp</p><h2 id="vk-latest-title">Trong thư viện</h2><Link className="text-link" href="/thu-vien">Tất cả tác phẩm <ArrowRight size={17} /></Link></div>
          <WorkList items={latest} />
        </section>
      </Reveal>

      <Reveal stagger>
        <section className="vk-explore" aria-labelledby="vk-explore-title">
          <div>
            <div className="vk-sechead"><p className="vk-kicker">Tra cứu</p><h2 id="vk-explore-title">Theo thể loại</h2></div>
            <div className="vk-genreindex">
              {genres.map((g) => (
                <Link key={g.slug} href={`/the-loai/${g.slug}`}>
                  <span>{g.name}</span>
                  <small>{works.filter((w) => w.genreSlug === g.slug).length} bài</small>
                </Link>
              ))}
            </div>
            <div className="vk-topics">
              {topics.slice(0, 7).map((t) => (
                <Link key={t} href={`/thu-vien?topic=${encodeURIComponent(t)}`}>{t}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="vk-sechead"><p className="vk-kicker">Con người</p><h2>Gặp người viết</h2></div>
            <div className="vk-authors">
              {authors.slice(0, 6).map((a) => (
                <Link key={a.id} href={`/tac-gia/${a.slug}`}>
                  <span>{a.name}<small>{a.period}</small></span>
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <section className="vk-mission" aria-labelledby="vk-mission-title">
        <div className="vk-sechead"><p className="vk-kicker">Sứ mệnh</p><h2 id="vk-mission-title">Văn học cho mọi học sinh</h2><Link className="text-link" href="/gioi-thieu">Vì sao Văn Khố <ArrowRight size={17} /></Link></div>
        <p className="vk-mission-text">Mỗi học sinh THPT đều xứng đáng chạm vào vẻ đẹp của tác phẩm — miễn phí, có hệ thống, từ lớp 10 đến lớp 12. Văn Khố tự biên soạn từng bài phân tích, rèn cách nghĩ thay vì dọn sẵn đáp án, và để Trợ lý AI đồng hành gợi mở khi em cần.</p>
      </section>

      <section className="vk-cta">
        <div>
          <p className="vk-kicker">Bắt đầu từ đây</p>
          <h2>Mở một trang sách, đọc chậm từng phần.</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link className="button" href="/thu-vien">Vào thư viện <ArrowRight size={18} /></Link>
          <Link className="text-link" href="/tro-ly-van-hoc">Hỏi Trợ lý AI <ArrowRight size={17} /></Link>
        </div>
      </section>
    </div>
  );
}
