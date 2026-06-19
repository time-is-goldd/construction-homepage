import type { Metadata } from "next";
import CertificationSection from "@/components/sections/CertificationSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import EquipmentSection from "@/components/sections/EquipmentSection";
import SubHero from "@/components/ui/SubHero";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `보유역량 | ${COMPANY_NAME}`,
  description: "보유 장비/설비와 인증서/자격증을 소개합니다.",
};

export default function CapabilityPage() {
  return (
    <>
      <SubHero
        title="보유역량"
        breadcrumbItems={[{ label: "홈", href: "/" }, { label: "보유역량" }]}
      />
      <EquipmentSection />
      <CertificationSection />
      <CtaBannerSection />
    </>
  );
}
