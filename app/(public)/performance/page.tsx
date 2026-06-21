import type { Metadata } from "next";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import Section from "@/components/ui/Section";
import SubHero from "@/components/ui/SubHero";
import { listPerformanceRecords } from "@/lib/performance";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "시공실적",
  description: "연도별 시공실적(업체명/공사명/공사유형)을 확인하세요.",
  path: "/performance",
});

export default async function PerformancePage() {
  const records = await listPerformanceRecords();

  const groupedByYear = records.reduce<Map<number, typeof records>>(
    (groups, record) => {
      const group = groups.get(record.year) ?? [];
      group.push(record);
      groups.set(record.year, group);
      return groups;
    },
    new Map(),
  );
  const years = [...groupedByYear.keys()].sort((a, b) => b - a);

  return (
    <>
      <SubHero
        title="시공실적"
        description="연도별 시공실적을 확인하세요."
        breadcrumbItems={[{ label: "홈", href: "/" }, { label: "시공실적" }]}
      />
      <Section tone="white">
        {years.length === 0 ? (
          <p className="text-[15px] text-neutral-600 md:text-base">
            등록된 시공실적이 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {years.map((year) => (
              <div key={year}>
                <h2 className="text-[22px] leading-[1.4] font-bold text-neutral-900 md:text-2xl">
                  {year}년
                </h2>
                <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200">
                  <table className="w-full min-w-[560px] text-left text-[15px] md:text-base">
                    <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">업체명</th>
                        <th className="px-4 py-3 font-medium">공사명</th>
                        <th className="px-4 py-3 font-medium">공사유형</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedByYear.get(year)!.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-neutral-100 last:border-0"
                        >
                          <td className="px-4 py-3 text-neutral-900">
                            {record.clientName}
                          </td>
                          <td className="px-4 py-3 text-neutral-700">
                            {record.projectName}
                          </td>
                          <td className="px-4 py-3 text-neutral-700">
                            {record.workType}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <CtaBannerSection
        heading="시공실적이 궁금한 현장이 있으신가요?"
        buttonLabel="지금 문의하기"
      />
    </>
  );
}
