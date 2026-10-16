import Link from 'next/link';
export default function NotFound(){return <div className="container empty-state page-space"><p className="eyebrow">KHÔNG TÌM THẤY TRANG</p><h1>Trang sách này chưa có.</h1><p>Tác phẩm có thể chưa được xuất bản hoặc đường dẫn chưa đúng.</p><Link className="button" href="/thu-vien">Trở về thư viện</Link></div>;}
