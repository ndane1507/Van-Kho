import type { Metadata } from 'next';
import { Newsreader, Be_Vietnam_Pro } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Themes } from '@/components/layout/theme';
import { siteUrl } from '@/lib/seo';
import './globals.css';
const serif=Newsreader({subsets:['latin','vietnamese'],variable:'--font-serif',display:'swap'});
const sans=Be_Vietnam_Pro({subsets:['latin','vietnamese'],weight:['400','500','600'],variable:'--font-sans',display:'swap'});
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Văn Khố | Thư viện Văn học THPT',template:'%s | Văn Khố'},description:'Khám phá tác giả, đọc và phân tích tác phẩm văn học lớp 10, 11, 12.',openGraph:{images:[{url:'/images/trang-giang.webp',width:1400,height:933,alt:'Sông chiều, minh họa AI cho Văn Khố'}]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning><body className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning><script dangerouslySetInnerHTML={{__html:"document.documentElement.classList.add('js')"}} /><Themes><a href="#main-content" className="skip-link">Đến nội dung chính</a><Header/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></Themes></body></html>;}
