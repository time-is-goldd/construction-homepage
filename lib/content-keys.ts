import { BUSINESS_CATEGORIES, COMPANY_NAME } from "@/lib/constants";

export type ContentKeyDef = {
  key: string;
  title: string;
  section: string;
  fallback: string;
  rows: number;
};

// 모든 편집 가능 콘텐츠 키의 단일 출처.
// 관리자 /admin/content 페이지와 각 공개 섹션 컴포넌트가 동일한 key를 참조한다.
// DB에 값이 없으면 fallback이 그대로 표시되므로 기존 사이트가 깨지지 않는다.
export const CONTENT_KEY_DEFS: ContentKeyDef[] = [
  // ── 메인페이지 ──────────────────────────────────────────────────────────
  {
    key: "home.hero_title",
    title: "메인 슬로건 (H1)",
    section: "메인페이지",
    fallback: "대한민국 양돈 농가의 든든한 파트너",
    rows: 2,
  },
  {
    key: "home.hero_subtitle",
    title: "히어로 서브문구",
    section: "메인페이지",
    fallback:
      "노후 돈사 리모델링부터 대규모 신축 프로젝트까지,\n불필요한 비용은 줄이고 농장의 가치는 높여드립니다.",
    rows: 3,
  },
  {
    key: "home.company_intro",
    title: "홈 회사소개 문구 (단락 구분: 빈 줄)",
    section: "메인페이지",
    fallback: `${COMPANY_NAME}은 하도급 없는 직영 시공 시스템으로 돈사 신축부터 리모델링, 액비탱크/순환시설, 내부시설까지 책임지는 축사 시공 전문 기업입니다.\n\n돈사 전문 기술진이 직접 시공하며, 시공 이후에도 1:1 맞춤 소통과 사후 관리로 농가와의 신뢰를 이어갑니다.`,
    rows: 5,
  },
  // ── 회사소개 ─────────────────────────────────────────────────────────────
  {
    key: "about.ceo_greeting",
    title: "대표 인사말 (단락 구분: 빈 줄)",
    section: "회사소개",
    fallback: `안녕하십니까. ${COMPANY_NAME}을 찾아주신 모든 분들께 깊은 감사의 말씀을 드립니다.\n\n저희는 직영 시공 시스템으로 단 한 곳의 현장도 소홀히 하지 않는다는 원칙으로 시공을 이어왔습니다.\n\n이러한 철저함과 신속함이 지금까지 저희를 신뢰해 주신 농가 고객들과의 약속이라고 믿습니다.\n\n앞으로도 변하지 않는 기본기와 끊임없는 개선으로 더 나은 시공 결과를 약속드리겠습니다.\n\n감사합니다.\n\n${COMPANY_NAME} 직원일동`,
    rows: 12,
  },
  // ── 사업분야 ─────────────────────────────────────────────────────────────
  {
    key: "business.new_construction",
    title: `사업분야 — ${BUSINESS_CATEGORIES[0].title} 설명`,
    section: "사업분야",
    fallback: BUSINESS_CATEGORIES[0].description,
    rows: 6,
  },
  {
    key: "business.remodeling",
    title: `사업분야 — ${BUSINESS_CATEGORIES[1].title} 설명`,
    section: "사업분야",
    fallback: BUSINESS_CATEGORIES[1].description,
    rows: 6,
  },
  {
    key: "business.circulation",
    title: `사업분야 — ${BUSINESS_CATEGORIES[2].title} 설명`,
    section: "사업분야",
    fallback: BUSINESS_CATEGORIES[2].description,
    rows: 6,
  },
  {
    key: "business.internal_facility",
    title: `사업분야 — ${BUSINESS_CATEGORIES[3].title} 설명`,
    section: "사업분야",
    fallback: BUSINESS_CATEGORIES[3].description,
    rows: 6,
  },
];

// 섹션별로 그룹화된 목록 (admin/content 페이지용)
export function groupContentKeysBySection(
  defs: ContentKeyDef[],
): { section: string; items: ContentKeyDef[] }[] {
  const map = new Map<string, ContentKeyDef[]>();
  for (const def of defs) {
    if (!map.has(def.section)) map.set(def.section, []);
    map.get(def.section)!.push(def);
  }
  return Array.from(map.entries()).map(([section, items]) => ({
    section,
    items,
  }));
}
