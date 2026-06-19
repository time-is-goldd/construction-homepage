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

// TODO: 전화번호는 customer-assets에 실제 자료가 제공되지 않아 placeholder를
// 유지 중. 고객에게 확인 후 교체 필요. Header/Footer/FloatingButton/CTA 배너/
// 문의 페이지/구조화 데이터(LocalBusiness.telephone)에서 공통 사용.
export const PHONE_DISPLAY = "02-1234-5678";
export const PHONE_TEL = "tel:0212345678";
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
      "돼지의 생리적 특성과 사양 단계를 고려한 맞춤형 도면 설계 및 건축 시공을 진행합니다. 단열과 내구성을 극대화한 자재 선정으로 외부 환경 변화에 강하며, 초기 부지 조성부터 완공까지 체계적인 공정 관리를 통해 공기(工期)를 단축하고 자산 가치를 높입니다.",
  },
  {
    slug: "remodeling",
    title: "돈사 리모델링 공사",
    icon: "🏠",
    shortDescription:
      "노후 시설과 화재 돈사를 경제적인 비용으로 새롭게 재탄생시킵니다.",
    description:
      "기존 노후 시설 혹은 화재 돈사의 철거부터 단열 보강, 내부시설 재배치 및 기자재 교체까지 종합 리모델링 솔루션을 제공합니다. 돈사 내 고질적인 문제(샛바람, 단열 불량 등)를 해결하고 공간 효율성을 높여 신축 대비 경제적인 비용으로 돈사를 재탄생시킵니다.",
  },
  {
    slug: "circulation",
    title: "순환시설 공사",
    icon: "♻️",
    shortDescription:
      "악취 민원과 분뇨 처리를 해결하는 고품질 액비 저장조·순환 시스템을 시공합니다.",
    description:
      "악취 민원 해결과 원활한 분뇨 처리를 위한 고품질 액비 저장조 및 순환 시스템을 시공합니다. 완전 밀폐형 구조와 부식에 강한 자재를 사용하여 누수를 철저히 방지하며, 효율적인 슬러리 순환 설비를 통해 돈사 내 가스 발생을 줄이고 쾌적한 사육 환경을 유지합니다.",
  },
  {
    slug: "ventilation",
    title: "환기공사",
    icon: "🌬️",
    shortDescription:
      "정밀 음압 설계로 사계절 사각지대 없는 환기 시스템을 구축합니다.",
    description:
      "돈사 구조와 사육 두수에 맞춘 정밀 음압 설계를 바탕으로 입·배기 휀(Fan)과 컨트롤러를 연동 설치합니다. 여름철 고온 스트레스를 방지하기 위한 쿨링패드 시스템을 포함하여, 사계절 내내 사각지대 없이 원활한 공기 흐름을 유지할 수 있도록 시공합니다.",
  },
];
