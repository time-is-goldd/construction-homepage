import Image from "next/image";
import type { Metadata } from "next";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SubHero from "@/components/ui/SubHero";
import { CONTENT_KEY_DEFS } from "@/lib/content-keys";
import { listPublishedProjects } from "@/lib/corporate-projects";
import { listPublishedPartners } from "@/lib/partners";
import { getSiteContent } from "@/lib/site-contents";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "기업 파트너십",
  description:
    "대화시스템과 장기 파트너십을 유지하고 있는 기업과 전체 시공 실적을 확인하세요.",
  path: "/performance",
});

const INTRO_KEY = "performance.partnership_intro";
const INTRO_FALLBACK =
  CONTENT_KEY_DEFS.find((d) => d.key === INTRO_KEY)?.fallback ?? "";

// DB 마이그레이션 전 표시될 하드코딩 파트너 (세션 1 복원)
type DisplayPartner = {
  id: string;
  companyName: string;
  label: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  achievements: string[];
  logoUrl: string | null;
};

const FALLBACK_PARTNERS: DisplayPartner[] = [
  {
    id: "fallback-1",
    companyName: "돈돈팜",
    label: "돈돈팜 주식회사",
    startYear: 2007,
    endYear: null,
    description: null,
    achievements: [
      "전국 7개 농장 돈사 신축 및 리모델링 공사",
      "지속적인 시설물 유지보수 및 기자재 공급 파트너",
    ],
    logoUrl: "/images/performance/dondonfarm-logo.webp",
  },
  {
    id: "fallback-2",
    companyName: "농협종돈사업소",
    label: "농협종돈사업소",
    startYear: 2004,
    endYear: null,
    description: null,
    achievements: [
      "전국 5개 농장 지속적 시설물 보수 및 증축·재축",
      "주기적인 돈사 보수 및 기자재 공급·시공",
    ],
    logoUrl: "/images/performance/nh-breeding-logo.webp",
  },
  {
    id: "fallback-3",
    companyName: "선진한마을",
    label: "선진한마을",
    startYear: 2025,
    endYear: null,
    description: null,
    achievements: [
      "자사 및 계열 농가 돈사 신축·증축 공사 수행",
      "기업형 양돈 농가 동물복지 개선 공사 참여",
    ],
    logoUrl: "/images/performance/sunjin-logo.webp",
  },
];

function formatPeriod(startYear: number, endYear: number | null): string {
  return `${startYear} ~ ${endYear ?? "현재"}`;
}

export default async function PerformancePage() {
  const [introText, dbPartners, projects] = await Promise.all([
    getSiteContent(INTRO_KEY),
    listPublishedPartners(),
    listPublishedProjects(),
  ]);

  const intro = introText || INTRO_FALLBACK;

  // DB에 파트너가 없으면 하드코딩 fallback 사용 (마이그레이션 전 대비)
  const partners: DisplayPartner[] =
    dbPartners.length > 0 ? dbPartners : FALLBACK_PARTNERS;

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

      {/* ── 기업 파트너십 성과 ─────────────────────────────────────── */}
      <Section tone="white">
        <SectionHeading>기업 파트너십 성과</SectionHeading>
        <p className="mt-4 text-[15px] leading-[1.8] text-neutral-600 md:text-base">
          {intro}
        </p>

        <div className="mt-12 flex flex-col divide-y divide-neutral-200">
          {partners.map((partner) => (
            <div key={partner.id} className="py-10 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">

                {/* ── 좌: 로고 + 기업명 ── */}
                <div className="flex flex-col items-center gap-3 md:w-[30%] md:flex-shrink-0">
                  {partner.logoUrl ? (
                    <div className="flex h-28 w-full max-w-[260px] items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 px-6 md:max-w-none">
                      <Image
                        src={partner.logoUrl}
                        alt={`${partner.companyName} 로고`}
                        width={180}
                        height={90}
                        className="max-h-16 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-28 w-full max-w-[260px] items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 md:max-w-none">
                      <span className="text-[13px] text-neutral-400">
                        로고 없음
                      </span>
                    </div>
                  )}
                  <p className="text-[15px] font-semibold text-neutral-700">
                    {partner.label ?? partner.companyName}
                  </p>
                </div>

                {/* ── 우: 제목 + 설명 + 실적 ── */}
                <div className="md:w-[70%]">
                  <h3 className="text-[18px] font-bold leading-[1.4] text-neutral-900 md:text-[20px]">
                    {partner.companyName} 주요 협력 실적 (
                    {formatPeriod(partner.startYear, partner.endYear)})
                  </h3>
                  {partner.description && (
                    <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600">
                      {partner.description}
                    </p>
                  )}
                  {partner.achievements.length > 0 && (
                    <ul className="mt-5 flex flex-col gap-3">
                      {partner.achievements.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-[15px] leading-[1.65] text-neutral-600"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 전체 시공 실적 / 사례 ─────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading>전체 시공 실적 / 사례</SectionHeading>
        {projects.length === 0 ? (
          <p className="mt-6 text-[15px] text-neutral-600 md:text-base">
            등록된 시공 사례가 없습니다.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(15,28,48,0.08)]"
              >
                {/* 이미지 */}
                {project.imageUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-neutral-100">
                    <span className="text-[13px] text-neutral-400">
                      이미지 없음
                    </span>
                  </div>
                )}
                {/* 텍스트 */}
                <div className="p-5">
                  <p className="text-[16px] font-semibold text-neutral-900">
                    {project.title}
                  </p>
                  {project.summary && (
                    <p className="mt-2 text-[14px] leading-[1.6] text-neutral-600">
                      {project.summary}
                    </p>
                  )}
                </div>
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
