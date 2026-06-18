import type { Metadata } from "next";
import BusinessIntroSection from "@/components/sections/BusinessIntroSection";
import BusinessServiceDetailSection from "@/components/sections/BusinessServiceDetailSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import ProcessStepsSection from "@/components/sections/ProcessStepsSection";
import SubHero from "@/components/ui/SubHero";

export const metadata: Metadata = {
  title: "사업분야 | construction-homepage",
  description:
    "공장/플랜트, 리모델링, 토목공사, 유지보수 등 사업분야와 진행 프로세스를 안내합니다.",
};

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
