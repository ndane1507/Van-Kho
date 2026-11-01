import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Themes } from '@/components/layout/theme';
import { shareImage, siteUrl } from '@/lib/seo';
import './globals.css';
import './editorial.css';
const readingSerif=localFont({src:[{path:'./fonts/Newsreader-Regular.woff2',weight:'400'},{path:'./fonts/Newsreader-Medium.woff2',weight:'500'},{path:'./fonts/Newsreader-SemiBold.woff2',weight:'600'},{path:'./fonts/Newsreader-RegularItalic.woff2',weight:'400',style:'italic'},{path:'./fonts/Newsreader-MediumItalic.woff2',weight:'500',style:'italic'},{path:'./fonts/Newsreader-SemiBoldItalic.woff2',weight:'600',style:'italic'}],variable:'--font-serif',display:'optional',preload:false,adjustFontFallback:'Times New Roman'});
const readingSans=localFont({src:[{path:'./fonts/BeVietnamPro-Regular.woff2',weight:'400'},{path:'./fonts/BeVietnamPro-Medium.woff2',weight:'500'},{path:'./fonts/BeVietnamPro-SemiBold.woff2',weight:'600'}],variable:'--font-sans',display:'optional',preload:false,adjustFontFallback:'Arial'});
const description='Kho tàng văn học trong tầm tay. Khám phá tác phẩm, tác giả và bài phân tích lớp 10–12 cùng Văn Khố, được xây dựng bởi Nguyễn Văn Đạt & Nguyễn Đức Anh.';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Văn Khố | Kho tàng văn học trong tầm tay',template:'%s | Văn Khố'},description,alternates:{canonical:'/'},openGraph:{title:'Văn Khố | Kho tàng văn học trong tầm tay',description,url:'/',locale:'vi_VN',type:'website',siteName:'Văn Khố',images:[shareImage]},twitter:{card:'summary_large_image',title:'Văn Khố | Kho tàng văn học trong tầm tay',description,images:[shareImage]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning><body className={`${readingSerif.variable} ${readingSans.variable}`} suppressHydrationWarning><script dangerouslySetInnerHTML={{__html:"document.documentElement.classList.add('js')"}} /><Themes><a href="#main-content" className="skip-link">Đến nội dung chính</a><Header/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></Themes></body></html>;}
