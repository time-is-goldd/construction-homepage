import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
  description: string;
  /** 사이트 루트 기준 경로 (예: "/about"). canonical/OG url에 사용된다. */
  path: string;
  /** 시공사례 상세 등 대표 이미지를 OG/Twitter에 별도로 지정해야 할 때만 사용. */
  images?: string[];
};

// 기본 OG 이미지(public/images/og/default-og-image.png). 페이지마다 openGraph
// 객체를 직접 지정하면 부모 레이아웃의 openGraph가 통째로 교체되는 Next 메타데이터
// 병합 규칙 때문에, 매번 명시적으로 images를 채워 누락을 방지한다.
const DEFAULT_OG_IMAGE = "/images/og/default-og-image.png";

// 페이지별 title/description은 그대로 두고 canonical/OG/Twitter 보일러플레이트만
// 공통화한다. title.template(app/(public)/layout.tsx)이 회사명을 자동으로
// 붙이므로 여기서는 페이지 고유 title만 넘긴다.
export function buildPageMetadata({
  title,
  description,
  path,
  images,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: images ?? [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images ?? [DEFAULT_OG_IMAGE],
    },
  };
}
