import type { Metadata } from "next";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import Section from "@/components/ui/Section";
import SubHero from "@/components/ui/SubHero";
import Pagination from "@/components/works/Pagination";
import WorkCard from "@/components/works/WorkCard";
import WorksFilterBar from "@/components/works/WorksFilterBar";
import { getCategories, listWorks } from "@/lib/works";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

const PAGE_SIZE = 9;

// 카테고리/페이지 쿼리는 같은 콘텐츠의 변형이므로 canonical은 항상 베이스
// 경로(/works)를 가리켜 중복 콘텐츠로 인식되지 않게 한다.
export const metadata: Metadata = buildPageMetadata({
  title: "시공사례",
  description: "돈사 신축, 리모델링 등 시공사례를 카테고리별로 확인하세요.",
  path: "/works",
});

type WorksPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const params = await searchParams;
  const [categories, works] = await Promise.all([
    getCategories(),
    listWorks({ publishedOnly: true }),
  ]);

  const activeCategory = categories.some(
    (category) => category.slug === params.category,
  )
    ? params.category
    : undefined;
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const filtered = activeCategory
    ? works.filter((work) => work.category?.slug === activeCategory)
    : works;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const buildPageHref = (page: number) => {
    const query = new URLSearchParams();
    if (activeCategory) query.set("category", activeCategory);
    if (page > 1) query.set("page", String(page));
    const queryString = query.toString();
    return queryString ? `/works?${queryString}` : "/works";
  };

  return (
    <>
      <SubHero
        title="시공사례"
        description="현장에서 검증된 시공 사례를 카테고리별로 확인해보세요."
        breadcrumbItems={[{ label: "홈", href: "/" }, { label: "시공사례" }]}
      />
      <Section tone="white">
        <WorksFilterBar categories={categories} activeCategory={activeCategory} />

        {pageItems.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {pageItems.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-[15px] text-neutral-600 md:text-base">
            해당 카테고리의 시공사례가 아직 없습니다.
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={buildPageHref}
        />
      </Section>
      <CtaBannerSection
        heading="찾는 시공 사례가 없으신가요? 직접 문의해보세요"
        buttonLabel="문의하기"
      />
    </>
  );
}
