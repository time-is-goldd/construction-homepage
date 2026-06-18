import Link from "next/link";
import { WORK_CATEGORIES } from "@/lib/mock-works";

type WorksFilterBarProps = {
  activeCategory?: string;
  sort: "latest" | "oldest";
};

function buildHref(category: string | undefined, sort: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort !== "latest") params.set("sort", sort);
  const query = params.toString();
  return query ? `/works?${query}` : "/works";
}

function tabClass(active: boolean) {
  return `flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap md:text-sm ${
    active
      ? "bg-brand-700 text-white"
      : "border border-neutral-200 bg-white text-neutral-600 hover:text-brand-700"
  }`;
}

export default function WorksFilterBar({
  activeCategory,
  sort,
}: WorksFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <nav
        aria-label="카테고리 필터"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        <Link
          href={buildHref(undefined, sort)}
          className={tabClass(!activeCategory)}
        >
          전체
        </Link>
        {WORK_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={buildHref(category.slug, sort)}
            className={tabClass(activeCategory === category.slug)}
          >
            {category.label}
          </Link>
        ))}
      </nav>

      <form action="/works" method="GET" className="flex items-center gap-2">
        {activeCategory && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <label
          htmlFor="sort"
          className="text-[13px] text-neutral-600 md:text-sm"
        >
          정렬
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort}
          className="h-9 rounded-lg border border-neutral-200 px-2 text-[13px] text-neutral-800 md:text-sm"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
        <button
          type="submit"
          className="h-9 rounded-lg border border-neutral-200 px-3 text-[13px] font-medium text-neutral-800 hover:bg-neutral-50 md:text-sm"
        >
          적용
        </button>
      </form>
    </div>
  );
}
