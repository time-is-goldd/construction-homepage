import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import WorkCard from "@/components/works/WorkCard";
import WorkGallery from "@/components/works/WorkGallery";
import { WORKS, getWorkById, getWorkCategoryLabel } from "@/lib/mock-works";

type WorkDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return WORKS.map((work) => ({ id: work.id }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const work = getWorkById(id);
  if (!work) return {};

  return {
    title: `${work.title} | construction-homepage`,
    description: work.summary,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { id } = await params;
  const work = getWorkById(id);
  if (!work) notFound();

  const categoryLabel = getWorkCategoryLabel(work.categorySlug);
  const index = WORKS.findIndex((item) => item.id === work.id);
  const prevWork = index > 0 ? WORKS[index - 1] : undefined;
  const nextWork = index < WORKS.length - 1 ? WORKS[index + 1] : undefined;
  const relatedWorks = WORKS.filter(
    (item) => item.categorySlug === work.categorySlug && item.id !== work.id,
  ).slice(0, 3);

  return (
    <>
      <section className="bg-brand-900">
        <Container className="flex flex-col gap-3 py-12 text-white md:py-16">
          <Breadcrumb
            items={[
              { label: "홈", href: "/" },
              { label: "시공사례", href: "/works" },
              {
                label: categoryLabel,
                href: `/works?category=${work.categorySlug}`,
              },
              { label: work.title },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] leading-[1.3] font-bold tracking-[-0.02em] md:text-[40px]">
              {work.title}
            </h1>
            <span className="bg-accent-600 rounded-full px-3 py-1 text-xs font-medium text-white">
              {categoryLabel}
            </span>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <WorkGallery title={work.title} />
      </Section>

      <Section tone="muted">
        <h2 className="text-[20px] leading-[1.4] font-semibold text-neutral-900 md:text-2xl">
          프로젝트 정보
        </h2>
        <dl className="mt-6 grid grid-cols-1 gap-x-8 md:grid-cols-2">
          <InfoRow label="발주처" value={work.client ?? "비공개"} />
          <InfoRow label="규모" value={work.scale} />
          <InfoRow label="공사기간" value={work.period} />
          <InfoRow label="위치" value={work.location} />
          <InfoRow label="카테고리" value={categoryLabel} />
        </dl>
      </Section>

      <Section tone="white">
        <h2 className="text-[20px] leading-[1.4] font-semibold text-neutral-900 md:text-2xl">
          작업 설명
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {work.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.6] text-neutral-600 md:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          {prevWork ? (
            <Link
              href={`/works/${prevWork.id}`}
              className="hover:text-brand-700 text-[15px] font-medium text-neutral-600 md:text-base"
            >
              ← 이전 사례: {prevWork.title}
            </Link>
          ) : (
            <span />
          )}
          {nextWork ? (
            <Link
              href={`/works/${nextWork.id}`}
              className="hover:text-brand-700 text-[15px] font-medium text-neutral-600 md:text-base"
            >
              다음 사례: {nextWork.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {relatedWorks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-[20px] leading-[1.4] font-semibold text-neutral-900 md:text-2xl">
              관련 사례
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {relatedWorks.map((item) => (
                <WorkCard key={item.id} work={item} />
              ))}
            </div>
          </div>
        )}
      </Section>

      <CtaBannerSection
        heading="이런 시공이 필요하신가요?"
        buttonLabel="지금 문의하기"
      />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-neutral-200 py-3 md:flex-row md:gap-0">
      <dt className="text-[15px] font-medium text-neutral-600 md:w-[120px] md:flex-shrink-0 md:text-base">
        {label}
      </dt>
      <dd className="text-[15px] text-neutral-900 md:text-base">{value}</dd>
    </div>
  );
}
