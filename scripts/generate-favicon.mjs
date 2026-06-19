// 사업자 로고(logo-mark.png)를 기준으로 app/favicon.ico, app/icon.png, app/apple-icon.png를 생성한다.
// ICO는 PNG 압축 데이터를 그대로 담는 최신(Vista+) 포맷으로 직접 컨테이너를 구성한다(추가 의존성 불필요).
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SOURCE = "public/images/logo/logo-mark.png";
const ICO_SIZES = [16, 32, 48];

async function buildIco() {
  const pngBuffers = await Promise.all(
    ICO_SIZES.map((size) => sharp(SOURCE).resize(size, size).png().toBuffer()),
  );

  const headerSize = 6 + 16 * pngBuffers.length;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngBuffers.length, 4);

  let offset = headerSize;
  const entries = [];
  pngBuffers.forEach((buf, i) => {
    const size = ICO_SIZES[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // offset
    offset += buf.length;
    entries.push(entry);
  });

  const ico = Buffer.concat([header, ...entries, ...pngBuffers]);
  await writeFile("app/favicon.ico", ico);
  console.log(`app/favicon.ico 생성 완료 (${ico.length} bytes, sizes: ${ICO_SIZES.join(",")})`);
}

async function buildPngIcons() {
  await sharp(SOURCE).resize(256, 256).png().toFile("app/icon.png");
  console.log("app/icon.png 생성 완료 (256x256)");
  await sharp(SOURCE).resize(180, 180).png().toFile("app/apple-icon.png");
  console.log("app/apple-icon.png 생성 완료 (180x180)");
}

await buildIco();
await buildPngIcons();
