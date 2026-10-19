'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

export function IntroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  async function play() {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setStarted(true);
      setError(false);
    } catch {
      setError(true);
    }
  }

  return <div className="intro-film">
    <video ref={videoRef} controls={started} playsInline preload="none" poster="/images/van-kho-film-poster-v3.jpg" width="1280" height="720" aria-label="Phim giới thiệu Văn Khố, Nguyễn Văn Đạt và Nguyễn Đức Anh, thời lượng 30 giây" onPlay={() => setStarted(true)}>
      <source src="/videos/van-kho-introduction-v3.mp4" type="video/mp4" />
      Trình duyệt của bạn không hỗ trợ video. <a href="/videos/van-kho-introduction-v3.mp4">Tải phim giới thiệu</a>.
    </video>
    {!started && <button type="button" className="film-play" onClick={play} aria-label="Phát phim giới thiệu Văn Khố, 30 giây">
      <Image src="/images/van-kho-film-poster-v3.jpg" alt="" fill sizes="(max-width: 767px) calc(100vw - 40px), 1200px" quality={75} />
      <span className="film-play-label"><span className="film-play-icon"><Play size={24} strokeWidth={1.3} aria-hidden="true" /></span><span>Xem câu chuyện<small>Phim giới thiệu · 30 giây</small></span></span>
    </button>}
    {error && <p className="film-error" role="alert">Chưa phát được video. <a href="/videos/van-kho-introduction-v3.mp4">Mở video trực tiếp</a></p>}
  </div>;
}
