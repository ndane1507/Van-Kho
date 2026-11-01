'use client';
import {useEffect, useState} from 'react';

export function Toc({sections}: {sections: {id: string; title: string}[]}) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (scrollY === 0) {
        setActive(sections[0]?.id ?? '');
        return;
      }
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
      const mobile = document.querySelector('.toc-mobile');
      const mobileHeight = mobile && getComputedStyle(mobile).display !== 'none' ? mobile.getBoundingClientRect().height : 0;
      const line = Math.max(headerBottom + mobileHeight + 32, innerHeight * .25);
      let current = sections[0]?.id ?? '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        const box = element?.parentElement?.classList.contains('reading-chunk') ? element.parentElement : element;
        if (box && box.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    // Images, fonts and disclosure changes can move a heading without scrolling.
    const observer = new ResizeObserver(schedule);
    const article = document.querySelector('.article-body');
    if (article) observer.observe(article);
    const hero = document.querySelector('.work-hero');
    if (hero) observer.observe(hero);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, [sections]);
  const links = <nav aria-label="Mục lục bài phân tích">{sections.map((section, index) =>
    <a key={section.id} href={`#${section.id}`} className={active === section.id ? 'active' : ''}
      aria-current={active === section.id ? 'location' : undefined}
      onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')}>
      <span>{String(index + 1).padStart(2, '0')}</span>{section.title}
    </a>
  )}</nav>;
  return <aside className="toc"><div className="toc-desktop"><p className="toc-title">Trong bài này</p>{links}</div><details className="toc-mobile"><summary>Mục lục bài phân tích</summary>{links}</details></aside>;
}
