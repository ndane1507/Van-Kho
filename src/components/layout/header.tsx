'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LibraryBig, Menu, X } from 'lucide-react';
import { ThemeSwitch } from './theme';

const primary = [
  { href: '/thu-vien', label: 'Thư viện' },
  { href: '/tac-gia', label: 'Tác giả' },
  { href: '/tro-ly-van-hoc', label: 'Trợ lý AI' },
  { href: '/gioi-thieu', label: 'Về Văn Khố' },
];
const grades = [10, 11, 12];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="site-header">
      <div className="masthead-strip" aria-hidden="true">
        <div className="container masthead-strip-inner">
          <span>Thư viện văn học trung học phổ thông</span>
          <span>Kết nối tri thức · Lớp 10 – 12</span>
        </div>
      </div>
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Văn Khố — trang chủ">
          <span className="brand-mark" aria-hidden="true"><LibraryBig size={22} strokeWidth={1.6} /></span>
          <span className="brand-text">Văn <em>Khố</em><span className="brand-sub">ĐỌC SÂU · HIỂU KỸ</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {primary.slice(0, 1).map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined}>{l.label}</Link>
          ))}
          <span className="nav-grades" role="group" aria-label="Chọn lớp">
            {grades.map((g) => (
              <Link key={g} href={`/lop-${g}`} aria-current={pathname === `/lop-${g}` ? 'page' : undefined}>Lớp {g}</Link>
            ))}
          </span>
          {primary.slice(1).map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined}>{l.label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeSwitch />
          <button
            className="menu-button"
            aria-expanded={open}
            aria-label={open ? 'Đóng điều hướng' : 'Mở điều hướng'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-panel" aria-label="Điều hướng trên điện thoại" onClick={() => setOpen(false)}>
          <Link href="/thu-vien">Thư viện</Link>
          {grades.map((g) => (
            <Link key={g} href={`/lop-${g}`}>Văn học lớp {g}</Link>
          ))}
          <Link href="/tac-gia">Tác giả</Link>
          <Link href="/tro-ly-van-hoc">Trợ lý Văn học (AI)</Link>
          <Link href="/gioi-thieu">Về Văn Khố</Link>
        </nav>
      )}
    </header>
  );
}
