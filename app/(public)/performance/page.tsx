import Image from "next/image";
import type { Metadata } from "next";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SubHero from "@/components/ui/SubHero";
import { listPerformanceRecords } from "@/lib/performance";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "기업 파트너십",
  description:
    "대화시스템과 장기 파트너십을 유지하고 있는 기업과 전체 시공 실적을 확인하세요.",
  path: "/performance",
});

const PARTNERS = [
  {
    name: "돈돈팜",
    logo: "/images/logo/dondonfarm-logo.png",
    period: "2007 ~ 현재",
    achievements: [
      "전국 7개 농장 돈사 신축 및 리모델링 공사",
      "지속적인 시설물 유지보수 및 기자재 공급 파트너",
    ],
  },
  {
    name: "농협종돈사업소",
    logo: "/images/logo/nonghyup-jondon-logo.png",
    period: "2004 ~ 현재",
    achievements: [
      "전국 5개 농장 지속적 시설물 보수 및 증축 및 재축",
      "주기적인 돈사 보수 및 기자재 공급·시공",
    ],
  },
  {
    name: "선진한마을",
    logo: "/images/logo/seonjin-village-logo.png",
    period: "2025 ~ 현재",
    achievements: [
      "자사 및 계열 농가 돈사 신축·증축 공사 수행",
      "기업형 양돈 농가 동물복지개선 공사 참여",
    ],
  },
];

export default async function PerformancePage() {
  const records = await listPerformanceRecords();

  return (
    <>
      <SubHero
        title="기업 파트너십"
        description="검증된 기술력으로 대형 기업들과 지속적인 파트너십을 이어갑니다."
        breadcrumbItems={[
          { label: "홈", href: "/" },
          { label: "기업 파트너십" },
        ]}
      />

      {/* 기업 파트너십 성과 */}
      <Section tone="white">
        <SectionHeading>기업 파트너십 성과</SectionHeading>
        <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
          단발성 공사가 아닌, 대형 기업들과의 지속적인 파트너십으로 검증된 돈사
          시공사입니다.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,28,48,0.08)]"
            >
              <div className="flex h-20 items-center justify-center rounded-lg bg-neutral-50 px-4">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} 로고`}
                  width={160}
                  height={80}
                  className="h-14 w-auto object-contain"
                />
              </div>
              <h3 className="mt-5 text-[18px] font-semibold text-neutral-900">
                {partner.name}
              </h3>
              <p className="text-brand-700 mt-1 text-[14px] font-medium">
                {partner.period}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {partner.achievements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-[14px] leading-[1.6] text-neutral-600"
                  >
                    <span className="mt-[2px] shrink-0 text-neutral-400">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 전체 시공 실적 */}
      <Section tone="muted">
        <SectionHeading>전체 시공 실적</SectionHeading>
        {records.length === 0 ? (
          <p className="mt-6 text-[15px] text-neutral-600 md:text-base">
            등록된 시공실적이 없습니다.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,28,48,0.08)]"
              >
                <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600">
                  {record.year}년
                </span>
                <p className="mt-3 text-[16px] font-semibold text-neutral-900">
                  {record.clientName}
                </p>
                <p className="mt-1 text-[14px] leading-[1.6] text-neutral-600">
                  {record.projectName}
                </p>
                {record.workType && (
                  <p className="mt-2 text-[13px] text-neutral-400">
                    {record.workType}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      <CtaBannerSection
        heading="장기 파트너십이 궁금하신가요?"
        buttonLabel="지금 문의하기"
      />
    </>
  );
}
