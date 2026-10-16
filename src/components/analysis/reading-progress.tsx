'use client';
import { useEffect, useRef } from 'react';

/** Thin reading-progress bar pinned to the viewport top. Pure scroll
 *  feedback (transform only, no layout shift); hidden when printing. */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let queued = false;
    let raf = 0;
    const update = () => {
      queued = false;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, root.scrollTop / max) : 0})`;
    };
    const schedule = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="reading-progress" aria-hidden="true">
      <div ref={ref} />
    </div>
  );
}
