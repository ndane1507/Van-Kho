import { chromium } from '@playwright/test';
import sharp from 'sharp';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
await page.setContent(`
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; padding: 0; width: 800px; height: 800px; background: #26211c; display: flex; align-items: center; justify-content: center; font-family: serif; }
  .box { width: 700px; height: 700px; border: 4px solid #c9a875; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #f4ede2; }
  h1 { font-size: 40px; margin: 0; letter-spacing: 2px; }
</style>
</head>
<body>
  <div class="box">
    <h1>VĂN KHỐ</h1>
  </div>
</body>
</html>
`);
const pngBuf = await page.screenshot({ type: 'png' });
const webpBuf = await sharp(pngBuf).webp({ quality: 82 }).toBuffer();
console.log('Success! WebP rendered, size:', webpBuf.length);
await browser.close();
