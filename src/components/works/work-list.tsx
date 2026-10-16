import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { authorFor, entryFor, media } from '@/lib/content';
import { PlaceholderArt } from '@/components/media/placeholder-art';
import type { Work } from '@/lib/validation';

export function WorkList({ items, showGrade = true }: { items: Work[]; showGrade?: boolean }) {
  return (
    <div className="vk-list">
      {items.map((w, i) => {
        const e = entryFor(w)!;
        const image = media.find((asset) => asset.id === w.mediaId);
        return (
          <Link className="vk-row" key={w.id} href={`/tac-pham/${w.slug}`}>
            <span className="vk-row-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="vk-row-body">
              <span className="vk-row-meta">
                <span>{w.genre}</span>
                <span>{authorFor(w).name}</span>
                {showGrade && <span>Lớp {e.grade}</span>}
                <span>Học kỳ {e.semester === 1 ? 'I' : 'II'}</span>
              </span>
              <span className="vk-row-title">{w.title}</span>
              <span className="vk-row-desc">{w.description}</span>
            </span>
            <span className="vk-row-thumb" aria-hidden="true">
              {image ? (
                <Image src={image.path} alt="" width={320} height={240} sizes="(max-width: 767px) 112px, 160px" quality={65} />
              ) : (
                <PlaceholderArt title={w.title} genre={w.genre} />
              )}
            </span>
            <ArrowUpRight className="vk-row-arrow" size={22} strokeWidth={1.4} aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
