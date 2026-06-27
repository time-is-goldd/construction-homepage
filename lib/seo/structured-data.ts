import {
  ADDRESS,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  BUSINESS_CATEGORIES,
  BUSINESS_REGISTRATION_NUMBER,
  COMPANY_NAME,
  COMPANY_NAME_LEGAL,
  COMPANY_TAGLINE,
  EMAIL,
  FOUNDED_DATE,
  PHONE_DISPLAY,
  REPRESENTATIVE_NAME,
  SERVICE_AREA,
} from "@/lib/constants";
import { SITE_URL } from "@/lib/seo/site";

const LOGO_URL = `${SITE_URL}/images/logo/logo-full.png`;

// schema.org Organization — 법인으로서의 정체성(법인명/대표자/사업자등록번호/
// 설립일)을 명시한다. ARCHITECTURE.md, customer-assets 사업자등록증 기준.
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_NAME,
    legalName: COMPANY_NAME_LEGAL,
    alternateName: "대화시스템",
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description: COMPANY_TAGLINE,
    foundingDate: FOUNDED_DATE,
    founder: {
      "@type": "Person",
      name: REPRESENTATIVE_NAME,
    },
    taxID: BUSINESS_REGISTRATION_NUMBER,
    email: EMAIL,
    telephone: PHONE_DISPLAY,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS,
      addressLocality: ADDRESS_LOCALITY,
      addressRegion: ADDRESS_REGION,
      addressCountry: "KR",
    },
  };
}

// schema.org LocalBusiness(세분류 GeneralContractor) — 지역 기반 SEO(Local SEO)용.
// 건설업 특성에 맞는 GeneralContractor를 사용하되 LocalBusiness 속성을 모두
// 포함해 검색엔진이 NAP(이름·주소·전화) 정보를 지역팩(Local Pack)에 노출할 수
// 있게 한다.
export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#localbusiness`,
    name: COMPANY_NAME,
    image: LOGO_URL,
    url: SITE_URL,
    telephone: PHONE_DISPLAY,
    email: EMAIL,
    priceRange: "프로젝트별 견적 (무료 상담)",
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS,
      addressLocality: ADDRESS_LOCALITY,
      addressRegion: ADDRESS_REGION,
      addressCountry: "KR",
    },
    areaServed: SERVICE_AREA,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "사업분야",
      itemListElement: BUSINESS_CATEGORIES.map((category) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: category.title,
          provider: { "@id": `${SITE_URL}/#localbusiness` },
        },
      })),
    },
  };
}

type BreadcrumbItem = {
  name: string;
  url: string;
};

// 시공사례 상세 등 깊은 경로의 BreadcrumbList. Breadcrumb.tsx(화면 표시용)와
// 별개로 검색결과 탐색경로 노출을 위해 JSON-LD로 동일 정보를 제공한다.
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
