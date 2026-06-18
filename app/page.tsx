import type { Metadata } from "next";
import BusinessPreviewSection from "@/components/sections/BusinessPreviewSection";
import CompanyIntroSection from "@/components/sections/CompanyIntroSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import HeroSection from "@/components/sections/HeroSection";
import UspSection from "@/components/sections/UspSection";
import WorksHighlightSection from "@/components/sections/WorksHighlightSection";

export const metadata: Metadata = {
  title: "construction-homepage | 신뢰의 시공 전문 기업",
  description:
    "30년 노하우의 시공 전문 기업입니다. 사업분야, 시공사례, 회사소개를 확인하고 무료 견적을 문의하세요.",
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
