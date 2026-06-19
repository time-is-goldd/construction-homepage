// 전 페이지 SEO 메타데이터(canonical/OG/sitemap/robots/JSON-LD)가 공유하는 사이트
// 기준 정보. 실제 도메인은 Phase 7 배포 시 확정되므로 환경변수로 주입받고,
// 미설정 시에는 개발/프리뷰에서도 깨지지 않도록 placeholder로 대체한다.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://daehwasystem.example.com"
).replace(/\/$/, "");

export const SITE_NAME = "(주)대화시스템";
