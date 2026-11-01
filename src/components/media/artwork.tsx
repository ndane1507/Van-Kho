import {getImageProps} from 'next/image';
import type {ReactNode} from 'react';
import type {MobileArtwork} from '@/lib/artwork';
import {ArtworkImage} from './artwork-image';
type ArtworkAsset = {path: string; alt: string; title: string};
const river = {path: '/images/trang-giang.webp', alt: 'Tranh minh họa sông rộng lúc chiều muộn, thuyền nhỏ và bờ xa.', title: 'Sông chiều'};
export function Artwork({asset = river, priority = false, className = '', motif, mobile}: {asset?: ArtworkAsset; priority?: boolean; className?: string; motif?: ReactNode; mobile?: MobileArtwork}) {
  const {props} = getImageProps({src: asset.path, alt: asset.alt, width: 1400, height: 933, quality: 65, sizes: '(max-width: 390px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(60vw - 36px), 744px', loading: priority ? 'eager' : 'lazy', fetchPriority: priority ? 'high' : undefined});
  return <ArtworkImage image={props} className={className} mobile={mobile} fallback={motif ?? <div className="image-fallback">{asset.title}<br/><small>Minh họa chưa tải được.</small></div>}/>;
}
