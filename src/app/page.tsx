import Link from 'next/link';
import Image from 'next/image';
import Form from 'next/form';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { IntroFilm } from '@/components/media/intro-film';
import { Reveal } from '@/components/motion/reveal';
import { authorFor, authors, genres, media, works, entryFor } from '@/lib/content';

const gradeLine = ['Khởi đầu những khám phá', 'Đi sâu vào thế giới nghệ thuật', 'Đọc văn, hiểu người, hiểu mình'];

export default function Home() {
  const selections = ['trang-giang', 'chu-nguoi-tu-tu', 'mua-xuan-chin']
    .map(slug => works.find(work => work.slug === slug))
    .filter((work): work is (typeof works)[number] => Boolean(work));
  const writers = ['nguyen-tuan', 'huy-can', 'nam-cao', 'han-mac-tu']
    .map(slug => authors.find(author => author.slug === slug))
    .filter((author): author is (typeof authors)[number] => Boolean(author));

  return (
    <div className="home-editorial">
      <section className="container opening" aria-labelledby="opening-title">
        <div className="opening-copy">
          <p className="opening-label">Không gian dành cho người yêu văn</p>
          <h1 id="opening-title">Lật một trang.<br /><em>Mở một thế giới.</em></h1>
          <p className="opening-description">Đọc tác phẩm, gặp người viết và tìm thấy cảm nhận của riêng mình.</p>
          <div className="opening-actions">
            <Link href="/thu-vien" className="button">Khám phá thư viện <ArrowUpRight size={19} aria-hidden="true" /></Link>
            <a href="#cau-chuyen" className="text-link">Câu chuyện Văn Khố <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="opening-art">
          <Image src="/images/van-kho-reading-room.webp" alt="Sách mở bên cửa sổ gỗ nhìn ra dòng sông và núi xa, minh họa AI cho không gian Văn Khố." fill sizes="(max-width: 767px) calc(100vw - 40px), 45vw" preload quality={75} />
        </figure>
      </section>

      <div className="container">
        <section className="discovery-bar" aria-label="Tìm nhanh trong thư viện">
          <p><strong>{works.length}</strong> tác phẩm <span>/</span> <strong>{authors.length}</strong> tác giả <span>/</span> Lớp 10, 11, 12</p>
          <Form className="discovery-search" action="/tim-kiem" role="search" aria-label="Tìm trong thư viện">
            <Search size={19} strokeWidth={1.5} aria-hidden="true" />
            <label htmlFor="home-q" className="sr-only">Tìm tác phẩm hoặc tác giả</label>
            <input id="home-q" name="q" placeholder="Hôm nay, bạn muốn đọc gì?" autoComplete="off" />
            <button aria-label="Tìm kiếm" type="submit"><ArrowRight size={20} aria-hidden="true" /></button>
          </Form>
        </section>

        <Reveal>
          <section className="film-section" id="cau-chuyen" aria-labelledby="film-title">
            <div className="section-heading">
              <span className="section-note">Câu chuyện Văn Khố</span>
              <h2 id="film-title">Bắt đầu từ một tình yêu.</h2>
              <p>Một thư viện nhỏ, với mong muốn đưa văn học đến gần bạn hơn.</p>
            </div>
            <IntroFilm />
            <div className="film-credit"><span>Ý tưởng &amp; thực hiện</span><p>Nguyễn Văn Đạt <span>&amp;</span> Nguyễn Đức Anh</p></div>
          </section>
        </Reveal>

        <Reveal>
          <section className="reading-selection" aria-labelledby="selection-title">
            <div className="section-heading"><span className="section-note">Những trang đáng đọc</span><h2 id="selection-title">Mỗi tác phẩm,<br /><em>một miền cảm xúc.</em></h2></div>
            <div className="selection-grid">
              {selections.map((work, index) => {
                const art = media.find(asset => asset.id === work.mediaId);
                return <Link className={`selection-piece selection-piece-${index}`} key={work.id} href={`/tac-pham/${work.slug}`}>
                  <div className="selection-art">{art && <Image src={art.path} alt={art.alt} fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 55vw, 650px" quality={75} />}</div>
                  <div className="selection-copy"><p>{authorFor(work).name}<span>{work.genre} · Lớp {entryFor(work)!.grade}</span></p><h3>{work.title}<ArrowUpRight size={23} strokeWidth={1.4} aria-hidden="true" /></h3>{index === 0 && <p className="selection-description">{work.description}</p>}</div>
                </Link>;
              })}
            </div>
            <Link className="text-link selection-all" href="/thu-vien">Xem toàn bộ tác phẩm <ArrowRight size={18} aria-hidden="true" /></Link>
          </section>
        </Reveal>

        <Reveal>
          <section className="learning-paths" aria-labelledby="paths-title">
            <div className="section-heading"><h2 id="paths-title">Theo từng năm học.</h2><p>Chọn lớp của bạn, đi từ bài đang học đến những điều muốn hiểu thêm.</p></div>
            <nav aria-label="Vào nhanh theo lớp" className="path-list">
              {[10, 11, 12].map((grade, index) => <Link href={`/lop-${grade}`} key={grade} className="path-item"><span className="path-grade">{grade}</span><span className="path-copy"><strong>Văn học lớp {grade}</strong><span>{gradeLine[index]}</span></span><span className="path-count">{works.filter(work => entryFor(work)!.grade === grade).length} tác phẩm</span><ArrowUpRight size={24} strokeWidth={1.3} aria-hidden="true" /></Link>)}
            </nav>
          </section>
        </Reveal>

        <Reveal>
          <section className="literary-index" aria-label="Khám phá thể loại và tác giả">
            <div className="index-genres"><h2>Đi theo<br /><em>mạch cảm hứng.</em></h2><div className="genre-links">{genres.map(genre => <Link href={`/the-loai/${genre.slug}`} key={genre.slug}>{genre.name}<span>{works.filter(work => work.genreSlug === genre.slug).length}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>)}</div></div>
            <div className="index-writers"><h2>Gặp người viết.</h2><div className="writer-links">{writers.map(author => <Link href={`/tac-gia/${author.slug}`} key={author.id}><span>{author.name}<small>{author.period}</small></span><ArrowUpRight size={22} strokeWidth={1.3} aria-hidden="true" /></Link>)}</div><Link className="text-link" href="/tac-gia">Danh mục tác giả <ArrowRight size={17} aria-hidden="true" /></Link></div>
          </section>
        </Reveal>

        <Reveal>
          <section className="reading-invitation" aria-labelledby="invitation-title">
            <span className="section-note">Đọc sâu. Hiểu kỹ. Cảm nhận riêng.</span>
            <h2 id="invitation-title">Văn chương không xa.<br /><em>Chỉ cần bạn mở một trang.</em></h2>
            <p>Khi gặp một câu thơ khó, một hình tượng lạ, hãy cùng Trợ lý Văn học tìm lối đọc.</p>
            <Link className="button" href="/tro-ly-van-hoc">Trò chuyện cùng AI <ArrowUpRight size={19} aria-hidden="true" /></Link>
            <Link className="text-link" href="/gioi-thieu">Tìm hiểu về Văn Khố <ArrowRight size={17} aria-hidden="true" /></Link>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
