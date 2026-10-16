import fs from 'node:fs';
import sharp from 'sharp';
const paths=JSON.parse(fs.readFileSync('scripts/generated-paths.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('src/content/expansion-manifest.json','utf8'));
const media=JSON.parse(fs.readFileSync('src/content/expanded/media.json','utf8'));
for(const item of paths){const title=manifest.find(x=>x.slug===item.slug).title;await sharp(item.path).resize(1400,933,{fit:'cover'}).webp({quality:82}).toFile(`public/images/${item.slug}.webp`);media.push({id:item.slug,path:`/images/${item.slug}.webp`,title:`Minh họa ${title}`,alt:`Tranh minh họa riêng cho tác phẩm ${title}.`,author:'OpenAI ImageGen',license:'Ảnh AI tạo riêng cho dự án.',attribution:'Minh họa tạo bằng AI cho Văn Khố, 09/10/2026.',generatedByAI:true});}
fs.writeFileSync('src/content/expanded/media.json',JSON.stringify(media,null,2));
console.log('Đã lưu',media.length,'tranh mới trong dự án');
