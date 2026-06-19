// next/og(ImageResponse)의 PNG 인코딩 단계가 이 Windows 환경의 sharp/vips
// 네이티브 바이너리 문제로 빌드 중 실패한다(app/(public)/opengraph-image.tsx에서
// 시도 후 colourspace 오류로 확인). 대신 실제 Chromium 렌더링(Playwright)으로
// 한 번 생성해 정적 파일(app/(public)/opengraph-image.png)로 고정한다 — 한글
// 폰트 렌더링도 브라우저 엔진을 그대로 쓰므로 더 안정적이다.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FONT_PATH = join(
  process.cwd(),
  "node_modules/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2",
);
const fontBase64 = readFileSync(FONT_PATH).toString("base64");

const html = `
<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: "Pretendard";
    src: url(data:font/woff2;base64,${fontBase64}) format("woff2");
    font-weight: 700;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 28px;
    background: radial-gradient(circle at 80% 20%, #16304D 0%, #0F1C30 60%);
    font-family: "Pretendard", sans-serif;
  }
  .mark {
    width: 96px; height: 96px; border-radius: 24px; background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; font-weight: 700; color: #0F1C30;
  }
  .title { font-size: 64px; font-weight: 700; color: #fff; }
  .tagline { font-size: 30px; font-weight: 700; color: #C7D2E0; }
</style></head>
<body>
  <div class="mark">DH</div>
  <div class="title">(주)대화시스템</div>
  <div class="tagline">축사시공, 리모델링 및 양돈기자재 제조 판매</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForTimeout(200);
const buffer = await page.screenshot({ type: "png" });
writeFileSync("app/(public)/opengraph-image.png", buffer);
await browser.close();
console.log(`app/(public)/opengraph-image.png 생성 완료 (${buffer.length} bytes)`);
