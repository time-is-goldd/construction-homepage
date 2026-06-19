import type { Metadata } from "next";
import BusinessIntroSection from "@/components/sections/BusinessIntroSection";
import BusinessServiceDetailSection from "@/components/sections/BusinessServiceDetailSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import ProcessStepsSection from "@/components/sections/ProcessStepsSection";
import SubHero from "@/components/ui/SubHero";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "사업분야",
  description:
    "돈사 신축, 리모델링, 순환시설, 환기공사 등 사업분야와 진행 프로세스를 안내합니다.",
  path: "/business",
});

export default function BusinessPage() {
  return (
    <>
      <SubHero
        title="사업분야"
        breadcrumbItems={[{ label: "홈", href: "/" }, { label: "사업분야" }]}
      />
      <BusinessIntroSection />
      <BusinessServiceDetailSection />
      <ProcessStepsSection />
      <CtaBannerSection
        heading="내 프로젝트에 맞는 견적이 궁금하신가요?"
        buttonLabel="견적 문의하기"
      />
    </>
  );
}
