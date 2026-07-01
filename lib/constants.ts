// 회사 정보, 카테고리 라벨 등 전역 정적 상수를 정의하는 위치.

// 실제 자료(customer-assets/문구.txt, 로고 이미지) 기준 확정 값.
export const COMPANY_NAME = "(주)대화시스템";
export const COMPANY_NAME_EN = "DAEHWASYSTEM";
export const COMPANY_NAME_LEGAL = "주식회사 대화시스템";
export const COMPANY_TAGLINE = "축사시공, 리모델링 및 양돈기자재 제조 판매";

// customer-assets/(주)대화시스템 사업자등록증.pdf 기준 확정 값(SEO 구조화 데이터,
// 회사개요 페이지 등 NAP(Name-Address-Phone) 정보에 사용).
export const REPRESENTATIVE_NAME = "박병배";
export const BUSINESS_REGISTRATION_NUMBER = "450-87-01374";
export const CORPORATE_REGISTRATION_NUMBER = "174811-0101595";
export const FOUNDED_DATE = "2019-10-14";
export const EMAIL = "dhsystem2019@naver.com";
export const ADDRESS = "경상북도 경산시 와촌면 불굴사길 87-8";
export const ADDRESS_REGION = "경상북도";
export const ADDRESS_LOCALITY = "경산시";
// 시공사례가 경북뿐 아니라 강원·전남 등 전국에 분포해 LocalBusiness의
// areaServed는 전국으로 설정한다(lib/seo/structured-data.ts).
export const SERVICE_AREA = "대한민국 전국";

// 고객 검수 피드백 반영(실제 전화번호로 확정). Header/Footer/FloatingButton/
// CTA 배너/문의 페이지/구조화 데이터(Organization·LocalBusiness.telephone)에서
// 공통 사용.
export const PHONE_DISPLAY = "053-854-4508";
export const PHONE_TEL = "tel:0538544508";
export const BUSINESS_HOURS = "평일 09:00 - 18:00 (주말·공휴일 휴무)";
// 구조화 데이터의 openingHoursSpecification에 쓰는 ISO 8601 요일/시간 표기.
export const BUSINESS_HOURS_ISO = "Mo-Fr 09:00-18:00";

// customer-assets/문구.txt > "3. 사업분야" 그대로 적용.
// 사업분야 소개(홈/사업분야 페이지)와 시공사례 카테고리(Supabase categories 테이블,
// supabase/seed.sql)가 동일한 slug를 공유하므로 이 배열을 단일 출처로 둔다.
export type BusinessCategory = {
  slug: string;
  title: string;
  icon: string;
  shortDescription: string;
  description: string;
};

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    slug: "new-construction",
    title: "돈사 신축 공사",
    icon: "🏗️",
    shortDescription:
      "돼지의 생리적 특성을 고려한 맞춤 설계와 체계적인 공정 관리로 시공합니다.",
    description:
      "돼지의 생리적 특성과 사양 단계를 고려한 맞춤형 도면 설계 및 건축 시공을 진행합니다.\n\n단열과 내구성을 극대화한 자재 선정으로 외부 환경 변화에 강하며, 초기 부지 조성부터 완공까지 체계적인 공정 관리를 통해 공사기간을 단축하고 자산 가치를 높입니다.",
  },
  {
    slug: "remodeling",
    title: "돈사 리모델링 공사",
    icon: "🏠",
    shortDescription:
      "노후 시설과 화재 돈사를 경제적인 비용으로 새롭게 재탄생시킵니다.",
    description:
      "기존 노후 시설 혹은 화재 돈사의 철거부터 단열 보강, 내부시설 재배치 및 기자재 교체까지 종합 리모델링 솔루션을 제공합니다.\n\n돈사 내 고질적인 문제(샛바람, 단열 불량 등)를 해결하고 공간 효율성을 높여 신축 대비 경제적인 비용으로 돈사를 재탄생시킵니다.",
  },
  {
    slug: "circulation",
    title: "액비탱크/순환시설",
    icon: "♻️",
    shortDescription:
      "악취 민원과 분뇨 처리를 해결하는 고품질 액비 저장조·순환 시스템을 시공합니다.",
    description:
      "악취 민원 해결과 원활한 분뇨 처리를 위한 고품질 액비 저장조 및 순환 시스템을 시공합니다.\n\n완전 밀폐형 구조와 부식에 강한 자재를 사용하여 누수를 철저히 방지하며, 효율적인 슬러리 순환 설비를 통해 돈사 내 가스 발생을 줄이고 쾌적한 사육 환경을 유지합니다.",
  },
  {
    slug: "internal-facility",
    title: "내부시설",
    icon: "🛠️",
    shortDescription:
      "모돈·자돈·비육돈 생육 단계에 맞춘 위생적이고 과학적인 내부 시설을 시공합니다.",
    description:
      "농가의 사육 환경 개선과 생산성 극대화를 위해 견고하고 위생적인 내부 시설을 시공합니다.\n\n고품질 기자재를 사용하여 돈사 내부 위생 관리를 용이하게 하며, 모돈·자돈·비육돈 등 각 생육 단계에 맞춘 과학적인 공간 설계로 각 농장에 맞는 최적의 사육 환경을 제공합니다.",
  },
];
