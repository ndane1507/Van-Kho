'use client';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  id?: string;
  style?: CSSProperties;
};

/** Subtle scroll reveal. Content stays visible without JS (gated by `html.js`)
 *  and with reduced motion (forced visible + no transition). */
export function Reveal({ children, className = '', stagger = false, id, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px 20% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} id={id} style={style} className={`reveal${stagger ? ' reveal-stagger' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
