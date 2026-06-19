import type { Metadata } from "next";
import BusinessPreviewSection from "@/components/sections/BusinessPreviewSection";
import CompanyIntroSection from "@/components/sections/CompanyIntroSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import HeroSection from "@/components/sections/HeroSection";
import UspSection from "@/components/sections/UspSection";
import WorksHighlightSection from "@/components/sections/WorksHighlightSection";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${COMPANY_NAME} | 대한민국 양돈 농가의 든든한 파트너`,
  description:
    "노후 돈사 리모델링부터 대규모 신축 프로젝트까지, 사업분야·시공사례·회사소개를 확인하고 무료 견적을 문의하세요.",
};

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
