// Tải chân dung tác giả từ Wikimedia Commons và nén về WebP.
// Chạy: node scripts/download-author-portraits.mjs
// Chỉ dùng file đã xác minh giấy phép (xem src/content/author-portraits.json).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT_DIR = 'public/images/authors';
// Nguồn tải: Wikimedia trực tiếp cho 12 file đầu (đã xong). 8 file còn lại
// tải qua proxy wsrv.nl (chỉ để tải về, không hotlink) vì upload.wikimedia.org
// giới hạn tốc độ IP này (429). Ảnh vẫn là file Commons đã xác minh giấy phép.
const viaWeserv = (path) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(`upload.wikimedia.org/${path}`)}&w=800&output=jpg`;
const MANIFEST = [
  { id: 'ho-me-ro', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Bust_Homer_BM_1825.jpg' },
  { id: 'shakespeare', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Shakespeare.jpg' },
  { id: 'victor-hugo', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Victor_Hugo_Nadar.jpg' },
  { id: 'pushkin', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Orest_Kiprensky_-_%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%BF%D0%BE%D1%8D%D1%82%D0%B0_%D0%90.%D0%A1.%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD%D0%B0_-_Google_Art_Project.jpg' },
  { id: 'gogol', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/N.Gogol_by_F.Moller_%281840%2C_Tretyakov_gallery%29.jpg' },
  { id: 'chekhov', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Osip_Braz_-_Anton_Chekhov%2C_1898.jpg' },
  { id: 'robert-frost', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Robert_Frost%2C_1913.JPG' },
  { id: 'hemingway', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Ernest_Hemingway_1923_passport_photo.jpg' },
  { id: 'martin-luther-king', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Martin_Luther_King_-_March_on_Washington.jpg' },
  { id: 'do-phu', url: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Du_Fu.jpg' },
  { id: 'phong-tu-khai', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/%E8%B1%90%E5%AD%90%E6%84%B7.jpg' },
  { id: 'ngo-thi-nham', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Ng%C3%B4_Th%C3%AC_Nh%E1%BA%ADm.jpg' },
  { id: 'nguyen-cong-tru', url: viaWeserv('wikipedia/commons/6/6c/Portrait_of_Nguyễn_Công_Trứ_(1778_-1858).jpg') },
  { id: 'nguyen-dinh-chieu', url: viaWeserv('wikipedia/commons/d/d7/Chân_dung_Nguyễn_Đình_Chiểu.jpg') },
  { id: 'vu-trong-phung', url: viaWeserv('wikipedia/commons/5/5d/Portrait_of_Vũ_Trọng_Phụng.jpg') },
  { id: 'ngo-tat-to', url: viaWeserv('wikipedia/commons/8/86/Portrait_of_writer_Ngô_Tất_Tố.jpg') },
  { id: 'dao-duy-anh', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Portrait_of_%C4%90%C3%A0o_Duy_Anh.jpg' },
  { id: 'hoai-thanh', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Portrait_of_writer_Ho%C3%A0i_Thanh.jpg' },
  { id: 'svetlana-alexievich', url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Swetlana_Alexijewitsch_2013.jpg' },
  { id: 'thanh-thao', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Poet_Thanh_Thao.JPG' },
  // Đợt 3: ảnh tư liệu fair-use từ Wikipedia tiếng Việt (độ phân giải thấp,
  // chỉ dùng minh họa tiểu sử phi thương mại, có ghi nguồn) và ảnh di tích
  // CC/PD cho tác giả cổ không còn chân dung xác thực. Xem author-portraits.json.
  { id: 'nguyen-huy-tuong', url: 'https://upload.wikimedia.org/wikipedia/vi/1/15/Nguy%E1%BB%85n_Huy_T%C6%B0%E1%BB%9Fng.jpg', width: 500 },
  { id: 'nguyen-dinh-thi', url: 'https://upload.wikimedia.org/wikipedia/vi/a/ae/Nguyen_Dinh_Thi.jpg', width: 500 },
  { id: 'to-huu', url: 'https://upload.wikimedia.org/wikipedia/vi/1/18/To_Huu.jpg', width: 500 },
  { id: 'nguyen-huy-thiep', url: 'https://upload.wikimedia.org/wikipedia/vi/1/15/Nh%C3%A0_v%C4%83n_Nguy%E1%BB%85n_Huy_Thi%E1%BB%87p.jpg', width: 500 },
  { id: 'hoang-phu-ngoc-tuong', url: 'https://upload.wikimedia.org/wikipedia/vi/0/06/Ho%C3%A0ng_Ph%E1%BB%A7_Ng%E1%BB%8Dc_T%C6%B0%E1%BB%9Dng.jpg', width: 500 },
  { id: 'long-chuong', url: 'https://upload.wikimedia.org/wikipedia/vi/d/da/L%E1%BB%99ng_Ch%C6%B0%C6%A1ng.jpg', width: 500 },
  { id: 'nguyen-du-truyen-ky', url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/%E5%82%B3%E5%A5%87%E6%BC%AB%E9%8C%84%E6%9B%B8%E5%BD%B1.jpg' },
  { id: 'than-nhan-trung', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/BiaTienSi1442.jpg' },
  { id: 'doan-thi-diem', url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Nh%C3%A0_l%C6%B0u_ni%E1%BB%87m_H%E1%BB%93ng_H%C3%A0_n%E1%BB%AF_s%C4%A9_%C4%90o%C3%A0n_Th%E1%BB%8B_%C4%90i%E1%BB%83m.jpg' },
  { id: 'dang-dung', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Temple_at_Dang_Dung%2C_Tay_Ho_in_2014.jpg' },
  // Đợt 4: ảnh báo chí trong nước (fair-use, độ phân giải thấp, có ghi nguồn)
  // cho tác giả hiện đại + tranh PD cho 2 hồ sơ tập thể.
  { id: 'le-dat', url: 'https://baotangvanhoc.vn/wp-content/uploads/2022/01/Nha-tho-Le-Dat.jpg', width: 500 },
  { id: 'ma-van-khang', url: 'https://images2.thanhnien.vn/zoom/1200_630/Uploaded/2014/Pictures20135/Thanh/2/MaiVanKhang-tn.jpg', width: 500 },
  { id: 'tran-tuan', url: 'https://hnm.1cdn.vn/thumbs/600x315/2025/04/11/a-tuan.jpg', width: 500 },
  { id: 'chu-van-son', url: 'https://i1-giaitri.vnecdn.net/2019/04/18/thay-chu-van-son-jpg-155557413-6854-7240-1555574282.png?w=1020&h=0&q=100&dpr=1&fit=crop&s=xu25Axs4NiYwmrha2Owo3g', width: 500 },
  { id: 'dan-gian', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/%C4%90%C3%A1m_c%C6%B0%E1%BB%9Bi_chu%E1%BB%99t.JPG' },
  { id: 'hai-cu-nhat-ban', url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Basho_by_Buson.jpg' },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, id) {
  const siteUA = 'VanKho/1.0 (giao duc; lien he qua footer)';
  const browserUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
  let useBrowserUA = /vnecdn\.net|1cdn\.vn|thanhnien\.vn/.test(url); // báo chí: dùng UA trình duyệt ngay
  // Báo chí chống hotlink bằng Referer: giả đúng trang bài viết.
  const refererFor = (url) => {
    const host = new URL(url).hostname;
    if (host.includes('vnecdn.net')) return 'https://vnexpress.net/';
    if (host.includes('thanhnien.vn')) return 'https://thanhnien.vn/';
    if (host.includes('1cdn.vn')) return 'https://hanoimoi.vn/';
    return 'http://localhost:3000/';
  };
  const referer = refererFor(url);
  let delay = 30000;
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': useBrowserUA ? browserUA : siteUA, Referer: referer },
    });
    if (res.ok) return res;
    if ((res.status === 429 || res.status >= 500) && attempt < 6) {
      console.log(`Thử lại ${id} sau ${delay / 1000}s (HTTP ${res.status}, lần ${attempt})`);
      await sleep(delay);
      delay *= 2;
      continue;
    }
    if ((res.status === 403 || res.status === 401) && !useBrowserUA && attempt < 6) {
      useBrowserUA = true;
      console.log(`Thử lại ${id} với UA trình duyệt (HTTP ${res.status})`);
      await sleep(2000);
      continue;
    }
    throw new Error(`HTTP ${res.status} khi tải ${id}`);
  }
  throw new Error(`Hết lượt thử: ${id}`);
}

for (const item of MANIFEST) {
  const out = path.join(OUT_DIR, `${item.id}.webp`);
  if (fs.existsSync(out)) {
    console.log(`SKIP (đã có): ${item.id}`);
    continue;
  }
  const res = await fetchWithRetry(item.url, item.id);
  if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${item.id}`);
  const type = res.headers.get('content-type') ?? '';
  if (!type.startsWith('image/')) throw new Error(`Content-Type lạ (${type}) cho ${item.id}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2_000) throw new Error(`File quá nhỏ (${buf.length}B), có thể lỗi: ${item.id}`);
  const meta = await sharp(buf).metadata();
  if (!meta.width || !meta.height) throw new Error(`Không đọc được ảnh: ${item.id}`);
  const maxSide = item.width ?? 800;
  await sharp(buf)
    .rotate()
    .resize({ width: maxSide, height: maxSide, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(out);
  const size = fs.statSync(out).size;
  console.log(`OK: ${item.id} ${meta.width}x${meta.height} -> ${size}B`);
  await sleep(10000);
}
console.log('Xong.');
