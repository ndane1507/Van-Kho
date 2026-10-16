'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="container empty-state page-space"><h1>Chưa thể mở nội dung.</h1><p>Hãy thử tải lại trang để tiếp tục đọc.</p><button className="button" onClick={()=>reset()}>Thử lại</button></div>;}
