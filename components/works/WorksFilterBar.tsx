import Link from "next/link";
import { WORK_CATEGORIES } from "@/lib/mock-works";

type WorksFilterBarProps = {
  activeCategory?: string;
};

function buildHref(category: string | undefined) {
  return category ? `/works?category=${category}` : "/works";
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
}: WorksFilterBarProps) {
  return (
    <nav aria-label="카테고리 필터" className="flex gap-2 overflow-x-auto pb-1">
      <Link href={buildHref(undefined)} className={tabClass(!activeCategory)}>
        전체
      </Link>
      {WORK_CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={buildHref(category.slug)}
          className={tabClass(activeCategory === category.slug)}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
