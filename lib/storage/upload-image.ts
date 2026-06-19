import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase/admin";

// ARCHITECTURE.md §7-1 버킷 경로 규칙: {folder}/{uuid}-{filename}. 업로드한 파일은
// 전부 WebP로 통일 변환하므로 확장자는 항상 .webp로 고정한다.
export type ImageBucket = "work-images" | "site-images";

type UploadOptions = {
  bucket: ImageBucket;
  folder: string;
  file: File;
  /** 변환 후 긴 변 최대 길이(px). 업스케일은 하지 않는다. */
  longEdge: number;
  quality?: number;
};

export async function uploadOptimizedImage({
  bucket,
  folder,
  file,
  longEdge,
  quality = 80,
}: UploadOptions): Promise<{ url: string; path: string }> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  const outputBuffer = await sharp(inputBuffer)
    .rotate()
    .resize(longEdge, longEdge, { fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  const path = `${folder}/${randomUUID()}.webp`;
  const admin = createAdminClient();

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(path, outputBuffer, {
      contentType: "image/webp",
      cacheControl: "31536000",
    });
  if (uploadError) throw uploadError;

  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

// work_images.url / site_images.url 컬럼에는 Storage public URL 문자열만 저장되어
// 있어, 삭제 시 버킷/경로를 역으로 파싱해야 한다. 시드 데이터처럼 Storage가 아닌
// /images/... 로컬 경로를 가리키는 행도 있을 수 있으므로 그 경우는 null을 반환한다.
export function parseStorageUrl(
  url: string,
): { bucket: ImageBucket; path: string } | null {
  const marker = "/storage/v1/object/public/";
  const index = url.indexOf(marker);
  if (index === -1) return null;

  const rest = url.slice(index + marker.length);
  const [bucket, ...pathParts] = rest.split("/");
  if (bucket !== "work-images" && bucket !== "site-images") return null;

  return { bucket, path: pathParts.join("/") };
}

export async function deleteStorageImageByUrl(url: string): Promise<void> {
  const parsed = parseStorageUrl(url);
  if (!parsed) return;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(parsed.bucket).remove([parsed.path]);
  if (error) throw error;
}
