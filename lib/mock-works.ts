// TODO: Phase 4 Supabase `works` 테이블 연동 전 mock 데이터. DB 연동 금지 범위이므로 정적 배열만 사용.
// 필드 구성은 DEVELOPMENT_PLAN.md의 works 스키마(title/category/summary/content/client/scale/period/location)를
// 참고해 추후 실 데이터 연동 시 동일한 모양으로 교체할 수 있도록 맞췄다.

export type WorkCategory = {
  slug: string;
  label: string;
};

export const WORK_CATEGORIES: WorkCategory[] = [
  { slug: "factory-plant", label: "공장/플랜트" },
  { slug: "remodeling", label: "리모델링" },
  { slug: "civil", label: "토목" },
  { slug: "maintenance", label: "유지보수" },
];

export type WorkItem = {
  id: string;
  categorySlug: string;
  title: string;
  summary: string;
  content: string[];
  client: string | null;
  scale: string;
  period: string;
  location: string;
  date: string;
};

export const WORKS: WorkItem[] = [
  {
    id: "1",
    categorySlug: "factory-plant",
    title: "○○공장 신축공사",
    summary: "생산동 신축부터 설비 반입까지 일괄 진행한 프로젝트입니다.",
    content: [
      "생산설비 가동 일정에 맞춰 토목·골조·마감 공정을 순차적으로 진행한 신축 공장 프로젝트입니다.",
      "공정 전반에 걸쳐 안전관리 기준을 적용했으며, 설비 반입 시점을 고려해 동선과 하중 계획을 사전에 검토했습니다.",
      "준공 이후에도 정기 점검을 통해 시설 상태를 관리하고 있습니다.",
    ],
    client: "(주)○○산업",
    scale: "연면적 3,200㎡",
    period: "2024.10 ~ 2025.03 (5개월)",
    location: "경기도 ○○시",
    date: "2025.03",
  },
  {
    id: "2",
    categorySlug: "remodeling",
    title: "○○물류센터 리모델링",
    summary: "노후 구조물을 안전 기준에 맞춰 전면 개선했습니다.",
    content: [
      "노후화된 물류센터의 구조 보강과 마감 개선을 함께 진행한 리모델링 프로젝트입니다.",
      "현행 소방·안전 기준에 맞춰 설비를 교체하고, 운영 중단 기간을 최소화하기 위해 구역별 순차 공사로 진행했습니다.",
    ],
    client: "비공개",
    scale: "연면적 5,400㎡",
    period: "2024.09 ~ 2025.01 (4개월)",
    location: "인천광역시 ○○구",
    date: "2025.01",
  },
  {
    id: "3",
    categorySlug: "civil",
    title: "○○산업단지 토목공사",
    summary: "부지 조성부터 기반 공사까지 체계적으로 수행했습니다.",
    content: [
      "산업단지 신규 부지의 조성 공사로, 부지 평탄화부터 배수·기반 공사까지 전 과정을 수행했습니다.",
      "설계 단계의 지반 조사 결과를 토대로 공정 계획을 수립해 일정 지연 없이 준공했습니다.",
    ],
    client: "○○개발(주)",
    scale: "부지면적 12,000㎡",
    period: "2024.06 ~ 2024.11 (5개월)",
    location: "충청남도 ○○군",
    date: "2024.11",
  },
  {
    id: "4",
    categorySlug: "maintenance",
    title: "○○공장 정기 유지보수",
    summary: "준공 이후 정기 점검과 보수를 책임지고 진행했습니다.",
    content: [
      "기존 준공 시설을 대상으로 한 정기 유지보수 계약으로, 설비 점검과 경미한 보수를 정기적으로 수행했습니다.",
      "이상 발생 시 신속 대응 체계를 운영해 가동 중단 시간을 최소화했습니다.",
    ],
    client: "비공개",
    scale: "연면적 2,100㎡",
    period: "2024.09 (정기 점검)",
    location: "경기도 ○○시",
    date: "2024.09",
  },
  {
    id: "5",
    categorySlug: "factory-plant",
    title: "○○플랜트 증축공사",
    summary: "기존 라인을 유지하며 생산 설비를 증축했습니다.",
    content: [
      "기존 생산 라인의 가동을 유지한 상태에서 신규 라인을 증축하는 공사를 진행했습니다.",
      "기존 설비와의 간섭을 피하기 위해 사전 시뮬레이션을 거쳐 공정을 계획했습니다.",
    ],
    client: "(주)○○플랜트",
    scale: "증축면적 1,800㎡",
    period: "2024.03 ~ 2024.07 (4개월)",
    location: "충청북도 ○○시",
    date: "2024.07",
  },
  {
    id: "6",
    categorySlug: "remodeling",
    title: "○○사옥 리모델링",
    summary: "사옥 내외부를 현대적 기준으로 개선한 사례입니다.",
    content: [
      "준공 후 20년이 지난 사옥의 외벽 및 내부 마감을 전면 개선한 리모델링 프로젝트입니다.",
      "업무 공간 사용성을 높이기 위해 평면 일부를 재구성했습니다.",
    ],
    client: "비공개",
    scale: "연면적 4,000㎡",
    period: "2024.01 ~ 2024.05 (4개월)",
    location: "서울특별시 ○○구",
    date: "2024.05",
  },
  {
    id: "7",
    categorySlug: "civil",
    title: "○○물류단지 부지조성",
    summary: "신규 물류단지 부지를 조성한 프로젝트입니다.",
    content: [
      "신규 물류단지 개발을 위한 부지 조성 공사로, 진입로 개설과 배수 체계 구축을 함께 진행했습니다.",
    ],
    client: "○○로지스틱스",
    scale: "부지면적 9,500㎡",
    period: "2023.11 ~ 2024.03 (4개월)",
    location: "경기도 ○○시",
    date: "2024.03",
  },
  {
    id: "8",
    categorySlug: "maintenance",
    title: "○○플랜트 설비 보수",
    summary: "노후 설비를 점검하고 보수한 사례입니다.",
    content: [
      "장기 가동된 플랜트 설비의 노후 부위를 점검하고, 가동 중단 없이 단계적으로 보수했습니다.",
    ],
    client: "비공개",
    scale: "설비 3개 라인",
    period: "2024.01 (보수 작업)",
    location: "충청남도 ○○시",
    date: "2024.01",
  },
  {
    id: "9",
    categorySlug: "factory-plant",
    title: "○○제2공장 신축공사",
    summary: "기존 공장 인접 부지에 제2공장을 신축했습니다.",
    content: [
      "기존 제1공장과의 연계 운영을 고려해 인접 부지에 제2공장을 신축한 프로젝트입니다.",
      "기존 시설 운영에 지장이 없도록 동선을 분리해 공사를 진행했습니다.",
    ],
    client: "(주)○○산업",
    scale: "연면적 2,800㎡",
    period: "2023.06 ~ 2023.11 (5개월)",
    location: "경기도 ○○시",
    date: "2023.11",
  },
  {
    id: "10",
    categorySlug: "remodeling",
    title: "○○공장 내부 리모델링",
    summary: "생산 효율 개선을 위해 내부 레이아웃을 재구성했습니다.",
    content: [
      "생산 흐름 개선을 목표로 공장 내부 레이아웃을 재구성한 리모델링 프로젝트입니다.",
    ],
    client: "비공개",
    scale: "연면적 1,500㎡",
    period: "2023.07 ~ 2023.09 (2개월)",
    location: "경상남도 ○○시",
    date: "2023.09",
  },
  {
    id: "11",
    categorySlug: "civil",
    title: "○○산업도로 토목공사",
    summary: "산업단지 진입도로를 신설한 토목공사입니다.",
    content: [
      "산업단지 진입 편의를 위한 도로 신설 공사로, 배수 및 포장 공사를 함께 수행했습니다.",
    ],
    client: "○○군청",
    scale: "도로길이 1.2km",
    period: "2023.03 ~ 2023.07 (4개월)",
    location: "전라북도 ○○군",
    date: "2023.07",
  },
  {
    id: "12",
    categorySlug: "maintenance",
    title: "○○물류센터 유지보수",
    summary: "물류센터 설비를 정기 점검하고 보수했습니다.",
    content: [
      "물류센터의 하역 설비와 보관 시설을 대상으로 정기 점검 및 보수를 진행했습니다.",
    ],
    client: "비공개",
    scale: "연면적 6,000㎡",
    period: "2023.05 (정기 점검)",
    location: "인천광역시 ○○구",
    date: "2023.05",
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
