import manifest from '../../public/images/mobile/manifest.json';

export type MobileArtwork = {avif: string; webp: string};
const variants: Record<string, MobileArtwork> = manifest;
export function mobileArtworkFor(imagePath: string): MobileArtwork | undefined {
  return variants[imagePath];
}
