import type { Metadata } from "next";
import BusinessPreviewSection from "@/components/sections/BusinessPreviewSection";
import CompanyIntroSection from "@/components/sections/CompanyIntroSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import HeroSection from "@/components/sections/HeroSection";
import UspSection from "@/components/sections/UspSection";
import WorksHighlightSection from "@/components/sections/WorksHighlightSection";
import { COMPANY_NAME } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

// layout.tsx의 title.template은 "같은 라우트 세그먼트"의 title에는 적용되지
// 않는다(app/(public)/layout.tsx와 app/(public)/page.tsx는 동일 세그먼트).
// 따라서 홈 페이지만 회사명을 직접 포함해야 다른 하위 페이지와 동일하게
// "제목 | 회사명" 형태가 된다.
export const metadata: Metadata = buildPageMetadata({
  title: `대한민국 양돈 농가의 든든한 파트너 | ${COMPANY_NAME}`,
  description:
    "노후 돈사 리모델링부터 대규모 신축 프로젝트까지, 사업분야·시공사례·회사소개를 확인하고 무료 견적을 문의하세요.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <UspSection />
      <BusinessPreviewSection />
      <WorksHighlightSection />
      <CompanyIntroSection />
      <CtaBannerSection />
    </>
  );
}
