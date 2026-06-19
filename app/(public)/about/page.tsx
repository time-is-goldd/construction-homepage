import type { Metadata } from "next";
import AboutTabs from "@/components/sections/AboutTabs";
import CeoGreetingSection from "@/components/sections/CeoGreetingSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import HistoryTimelineSection from "@/components/sections/HistoryTimelineSection";
import VisionMissionSection from "@/components/sections/VisionMissionSection";
import Container from "@/components/ui/Container";
import SubHero from "@/components/ui/SubHero";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "회사소개",
  description: "대표 인사말과 비전·미션·핵심가치, 회사연혁을 소개합니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <SubHero
        title="회사소개"
        breadcrumbItems={[{ label: "홈", href: "/" }, { label: "회사소개" }]}
      />
      <Container className="pt-6 md:pt-8">
        <AboutTabs active="greeting" />
      </Container>
      <CeoGreetingSection />
      <VisionMissionSection />
      <HistoryTimelineSection />
      <CtaBannerSection />
    </>
  );
}
