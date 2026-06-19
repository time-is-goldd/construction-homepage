import type { Metadata } from "next";
import CertificationSection from "@/components/sections/CertificationSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import EquipmentSection from "@/components/sections/EquipmentSection";
import SubHero from "@/components/ui/SubHero";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "보유역량",
  description: "보유 장비/설비와 인증서/자격증을 소개합니다.",
  path: "/capability",
});

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
