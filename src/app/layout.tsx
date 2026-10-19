import type { Metadata } from 'next';
import { Newsreader, Be_Vietnam_Pro } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Themes } from '@/components/layout/theme';
import { shareImage, siteUrl } from '@/lib/seo';
import './globals.css';
import './editorial.css';
const serif=Newsreader({subsets:['latin','vietnamese'],variable:'--font-serif',display:'swap'});
const sans=Be_Vietnam_Pro({subsets:['latin','vietnamese'],weight:['400','500','600'],variable:'--font-sans',display:'swap'});
const description='Kho tàng văn học trong tầm tay. Khám phá tác phẩm, tác giả và bài phân tích lớp 10–12 cùng Văn Khố, được xây dựng bởi Nguyễn Văn Đạt & Nguyễn Đức Anh.';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Văn Khố | Kho tàng văn học trong tầm tay',template:'%s | Văn Khố'},description,alternates:{canonical:'/'},openGraph:{title:'Văn Khố | Kho tàng văn học trong tầm tay',description,url:'/',locale:'vi_VN',type:'website',siteName:'Văn Khố',images:[shareImage]},twitter:{card:'summary_large_image',title:'Văn Khố | Kho tàng văn học trong tầm tay',description,images:[shareImage]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning><body className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning><script dangerouslySetInnerHTML={{__html:"document.documentElement.classList.add('js')"}} /><Themes><a href="#main-content" className="skip-link">Đến nội dung chính</a><Header/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></Themes></body></html>;}
