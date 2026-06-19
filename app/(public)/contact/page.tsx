import type { Metadata } from "next";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import LocationSection from "@/components/sections/LocationSection";
import SubHero from "@/components/ui/SubHero";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `고객문의 | ${COMPANY_NAME}`,
  description: "궁금한 점을 남겨주시면 빠르게 연락드립니다.",
};

export default function ContactPage() {
  return (
    <>
      <SubHero
        title="고객문의"
        description="궁금한 점을 남겨주시면 빠르게 연락드립니다."
        breadcrumbItems={[{ label: "홈", href: "/" }, { label: "고객문의" }]}
      />
      <ContactInfoSection />
      <ContactFormSection />
      <LocationSection />
    </>
  );
}
