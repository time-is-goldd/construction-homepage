import type { Metadata } from "next";
import AboutTabs from "@/components/sections/AboutTabs";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import Container from "@/components/ui/Container";
import SubHero from "@/components/ui/SubHero";
import {
  ADDRESS,
  BUSINESS_REGISTRATION_NUMBER,
  COMPANY_NAME,
  COMPANY_NAME_LEGAL,
  EMAIL,
  FOUNDED_DATE,
  PHONE_DISPLAY,
  REPRESENTATIVE_NAME,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "회사개요",
  description: `${COMPANY_NAME} 법인 정보, 대표자, 사업자등록번호, 주소 등 회사개요를 안내합니다.`,
  path: "/about/company",
});

const COMPANY_FACTS = [
  { label: "법인명", value: COMPANY_NAME_LEGAL },
  { label: "대표자", value: REPRESENTATIVE_NAME },
  { label: "설립일", value: FOUNDED_DATE },
  { label: "사업자등록번호", value: BUSINESS_REGISTRATION_NUMBER },
  { label: "주소", value: ADDRESS },
  { label: "전화", value: PHONE_DISPLAY },
  { label: "이메일", value: EMAIL },
  {
    label: "사업분야",
    value: "돈사 신축, 리모델링, 순환시설, 내부시설 등 돈사 시설 일괄공사",
  },
];

export default function AboutCompanyPage() {
  return (
    <>
      <SubHero
        title="회사개요"
        breadcrumbItems={[
          { label: "홈", href: "/" },
          { label: "회사소개", href: "/about" },
          { label: "회사개요" },
        ]}
      />
      <Container className="pt-6 md:pt-8">
        <AboutTabs active="company" />
      </Container>
      <Container className="py-10 md:py-14">
        <dl className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
          {COMPANY_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1 px-5 py-4 md:flex-row md:items-center md:gap-0"
            >
              <dt className="text-[14px] font-medium text-neutral-500 md:w-[160px] md:flex-shrink-0 md:text-[15px]">
                {fact.label}
              </dt>
              <dd className="text-[15px] text-neutral-900 md:text-base">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
      <CtaBannerSection />
    </>
  );
}
