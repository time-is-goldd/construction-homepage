// customer-assets/시공사례 실제 자료 기반 시공사례 데이터.
// 사진은 모두 실사이며, 발주처/위치는 고객이 제공한 폴더명을 그대로 사용했다.
// 정확한 규모/공사기간/날짜는 제공된 자료에 없어 null로 두고 상세 페이지에서
// "확인 중"으로 표시한다 (추정값을 임의로 채우지 않음).
//
// 공사 유형이 폴더명에 명시된 5건(리모델링 1건 + 신축 4건)은 해당 카테고리로 분류했고,
// "농장" 폴더 하위 8건(이화축산은 본채/비육사재축 2건으로 분리)은 공사 유형이 확인되지 않아
// "unclassified"로 두었다 — IMAGE_MAPPING.md 누락자료 5번 항목 참고.

import { BUSINESS_CATEGORIES } from "./constants";

export type WorkCategory = {
  slug: string;
  label: string;
};

export const WORK_CATEGORIES: WorkCategory[] = [
  ...BUSINESS_CATEGORIES.map((category) => ({
    slug: category.slug,
    label: category.title,
  })),
  { slug: "unclassified", label: "공사유형 확인중" },
];

export type WorkItem = {
  id: string;
  categorySlug: string;
  title: string;
  summary: string;
  content: string[];
  client: string | null;
  scale: string | null;
  period: string | null;
  location: string | null;
  date: string | null;
  images: string[];
};

function img(slug: string, filename: string): string {
  return `/images/works/${slug}/${filename}`;
}

function imgRange(slug: string, count: number, ext = "jpg"): string[] {
  return Array.from({ length: count }, (_, i) =>
    img(slug, `${String(i + 1).padStart(2, "0")}.${ext}`),
  );
}

const ihwaFatteningImages = [
  ...imgRange("ihwa-livestock-fattening-renovation", 6, "png"),
  ...Array.from({ length: 50 }, (_, i) =>
    img(
      "ihwa-livestock-fattening-renovation",
      `${String(i + 7).padStart(2, "0")}.jpg`,
    ),
  ),
  img("ihwa-livestock-fattening-renovation", "57.png"),
];

export const WORKS: WorkItem[] = [
  {
    id: "hoengseong-fire-restoration",
    categorySlug: "remodeling",
    title: "강원도 횡성군 화재 복구공사",
    summary: "화재로 피해를 입은 돈사를 복구한 리모델링 사례입니다.",
    content: [
      "화재 피해를 입은 돈사의 철거부터 단열 보강, 내부시설 재배치까지 종합 리모델링으로 복구한 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    scale: null,
    period: null,
    location: "강원도 횡성군",
    date: null,
    images: [
      img("hoengseong-fire-restoration", "01.png"),
      img("hoengseong-fire-restoration", "02.jpg"),
      img("hoengseong-fire-restoration", "03.jpg"),
      img("hoengseong-fire-restoration", "04.jpg"),
    ],
  },
  {
    id: "hwaseong-farm-reconstruction",
    categorySlug: "new-construction",
    title: "경기도 화성시 일괄농장 재축공사",
    summary: "기존 농장을 새로 지은 일괄농장 재축공사 사례입니다.",
    content: [
      "초기 부지 조성부터 완공까지 체계적인 공정 관리로 진행한 일괄농장 재축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    scale: null,
    period: null,
    location: "경기도 화성시",
    date: null,
    images: imgRange("hwaseong-farm-reconstruction", 9, "png"),
  },
  {
    id: "andong-sow-house-reconstruction",
    categorySlug: "new-construction",
    title: "경북 안동 2층 모돈사 재축공사",
    summary: "2층 모돈사를 재축한 신축공사 사례입니다.",
    content: [
      "돼지의 생리적 특성과 사양 단계를 고려한 맞춤 설계로 진행한 2층 모돈사 재축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    scale: null,
    period: null,
    location: "경북 안동",
    date: null,
    images: imgRange("andong-sow-house-reconstruction", 6, "png"),
  },
  {
    id: "andong-piglet-house-construction",
    categorySlug: "new-construction",
    title: "경북 안동 3층 자돈사 신축공사",
    summary: "3층 자돈사를 새로 지은 신축공사 사례입니다.",
    content: [
      "단열과 내구성을 극대화한 자재로 진행한 3층 자돈사 신축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    scale: null,
    period: null,
    location: "경북 안동",
    date: null,
    images: [
      ...imgRange("andong-piglet-house-construction", 5, "png"),
      img("andong-piglet-house-construction", "06.jpg"),
    ],
  },
  {
    id: "andong-fattening-house-reconstruction",
    categorySlug: "new-construction",
    title: "경북 안동 비육사 재축공사",
    summary: "비육사를 재축한 신축공사 사례입니다.",
    content: [
      "체계적인 공정 관리로 공기를 단축해 진행한 비육사 재축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    scale: null,
    period: null,
    location: "경북 안동",
    date: null,
    images: [
      img("andong-fattening-house-reconstruction", "01.png"),
      img("andong-fattening-house-reconstruction", "02.jpg"),
      img("andong-fattening-house-reconstruction", "03.png"),
      img("andong-fattening-house-reconstruction", "04.png"),
      img("andong-fattening-house-reconstruction", "05.jpg"),
      img("andong-fattening-house-reconstruction", "06.png"),
      img("andong-fattening-house-reconstruction", "07.png"),
    ],
  },
  {
    id: "nonghyup-sillim",
    categorySlug: "unclassified",
    title: "농협 신림",
    summary: "농협 신림 현장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 농협 신림 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "농협",
    scale: null,
    period: null,
    location: "신림",
    date: null,
    images: imgRange("nonghyup-sillim", 3, "jpg"),
  },
  {
    id: "nonghyup-uiseong",
    categorySlug: "unclassified",
    title: "농협 의성",
    summary: "농협 의성 현장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 농협 의성 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "농협",
    scale: null,
    period: null,
    location: "의성",
    date: null,
    images: imgRange("nonghyup-uiseong", 3, "jpg"),
  },
  {
    id: "nonghyup-hapcheon",
    categorySlug: "unclassified",
    title: "농협 합천",
    summary: "농협 합천 현장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 농협 합천 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "농협",
    scale: null,
    period: null,
    location: "합천",
    date: null,
    images: imgRange("nonghyup-hapcheon", 5, "jpg"),
  },
  {
    id: "dondonfarm-gokseong",
    categorySlug: "unclassified",
    title: "돈돈팜 곡성",
    summary: "돈돈팜 곡성 농장의 시공 사례입니다.",
    content: [
      "돈사 전문 기술진이 직접 시공한 돈돈팜 곡성 농장 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "돈돈팜",
    scale: null,
    period: null,
    location: "곡성",
    date: null,
    images: imgRange("dondonfarm-gokseong", 7, "jpg"),
  },
  {
    id: "dondonfarm-hoengseong",
    categorySlug: "unclassified",
    title: "돈돈팜 횡성",
    summary: "돈돈팜 횡성 농장의 시공 사례입니다.",
    content: [
      "돈사 전문 기술진이 직접 시공한 돈돈팜 횡성 농장 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "돈돈팜",
    scale: null,
    period: null,
    location: "횡성",
    date: null,
    images: imgRange("dondonfarm-hoengseong", 4, "jpg"),
  },
  {
    id: "ihwa-livestock",
    categorySlug: "unclassified",
    title: "이화축산",
    summary: "이화축산 농장의 시공 사례입니다.",
    content: [
      "돈사 전문 기술진이 직접 시공한 이화축산 농장 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "이화축산",
    scale: null,
    period: null,
    location: null,
    date: null,
    images: imgRange("ihwa-livestock", 21, "jpg"),
  },
  {
    id: "ihwa-livestock-fattening-renovation",
    categorySlug: "unclassified",
    title: "이화축산 비육사재축",
    summary: "이화축산 비육사(재축) 시공 사례입니다.",
    content: [
      "이화축산 농장의 비육사를 재축한 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "이화축산",
    scale: null,
    period: null,
    location: null,
    date: null,
    images: ihwaFatteningImages,
  },
  {
    id: "jindo-hyodon",
    categorySlug: "unclassified",
    title: "진도 효돈",
    summary: "진도 효돈 지역 농장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 진도 효돈 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    scale: null,
    period: null,
    location: "진도 효돈",
    date: null,
    images: imgRange("jindo-hyodon", 7, "jpg"),
  },
];

export function getWorkCategoryLabel(slug: string): string {
  return (
    WORK_CATEGORIES.find((category) => category.slug === slug)?.label ?? slug
  );
}

export function getWorkById(id: string): WorkItem | undefined {
  return WORKS.find((work) => work.id === id);
}
