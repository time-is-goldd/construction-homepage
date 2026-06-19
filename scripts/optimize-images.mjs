import { readdir, stat, unlink } from "node:fs/promises";
import { extname, join, basename } from "node:path";
import sharp from "sharp";

// IMAGE_OPTIMIZATION_PLAN.md §1~2 기준: 시공사례 사진의 긴 변을 1600px로 캡(업스케일 금지),
// WebP q80로 통일 변환한다. 원본은 이 스크립트 실행 전에 별도로 백업해 둔 뒤 실행한다.
const TARGET_DIR = join(process.cwd(), "public/images/works");
const LONG_EDGE = 1600;
const QUALITY = 80;

async function processFolder(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);

  let beforeBytes = 0;
  let afterBytes = 0;
  const changed = [];

  for (const filename of files) {
    const ext = extname(filename).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

    const inputPath = join(dir, filename);
    const before = (await stat(inputPath)).size;

    const outputName = `${basename(filename, extname(filename))}.webp`;
    const outputPath = join(dir, outputName);

    const buffer = await sharp(inputPath)
      .rotate()
      .resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    await sharp(buffer).toFile(outputPath);
    const after = (await stat(outputPath)).size;

    if (ext !== ".webp") {
      await unlink(inputPath);
    }

    beforeBytes += before;
    afterBytes += after;
    changed.push({ dir, from: filename, to: outputName, before, after });
  }

  return { beforeBytes, afterBytes, changed };
}

async function main() {
  const slugDirs = (await readdir(TARGET_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => join(TARGET_DIR, e.name));

  let totalBefore = 0;
  let totalAfter = 0;
  let totalFiles = 0;
  const allChanged = [];

  for (const dir of slugDirs) {
    const { beforeBytes, afterBytes, changed } = await processFolder(dir);
    totalBefore += beforeBytes;
    totalAfter += afterBytes;
    totalFiles += changed.length;
    allChanged.push(...changed);
  }

  console.log(JSON.stringify({ totalBefore, totalAfter, totalFiles, allChanged }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
