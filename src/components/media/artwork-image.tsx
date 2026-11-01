'use client';
import {useCallback, useState, type ImgHTMLAttributes, type ReactNode} from 'react';
import type {MobileArtwork} from '@/lib/artwork';
export function ArtworkImage({image, mobile, fallback, className}: {image: ImgHTMLAttributes<HTMLImageElement>; mobile?: MobileArtwork; fallback: ReactNode; className: string}) {
  const [failed, setFailed] = useState(false);
  const imageRef = useCallback((element: HTMLImageElement | null) => {
    if (element?.complete && element.naturalWidth === 0) setFailed(true);
  }, []);
  return <div className={`artwork ${className}`}>{failed ? fallback : <picture>{mobile && <><source media="(max-width: 767px)" type="image/avif" srcSet={mobile.avif} sizes="(max-width: 390px) calc(100vw - 36px), calc(100vw - 44px)"/><source media="(max-width: 767px)" type="image/webp" srcSet={mobile.webp} sizes="(max-width: 390px) calc(100vw - 36px), calc(100vw - 44px)"/></>}<img {...image} ref={imageRef} alt={image.alt} onError={() => setFailed(true)}/></picture>}</div>;
}
