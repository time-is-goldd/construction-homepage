import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function pageBtnClass(active: boolean) {
  return `flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-[13px] font-medium md:text-sm ${
    active ? "bg-brand-700 text-white" : "text-neutral-600 hover:bg-neutral-50"
  }`;
}

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="페이지네이션" className="mt-10 flex justify-center">
      <div className="hidden items-center gap-2 md:flex">
        {hasPrev && (
          <Link
            href={buildHref(currentPage - 1)}
            aria-label="이전 페이지"
            className={pageBtnClass(false)}
          >
            ‹
          </Link>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={buildHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={pageBtnClass(page === currentPage)}
          >
            {page}
          </Link>
        ))}
        {hasNext && (
          <Link
            href={buildHref(currentPage + 1)}
            aria-label="다음 페이지"
            className={pageBtnClass(false)}
          >
            ›
          </Link>
        )}
      </div>

      <div className="w-full md:hidden">
        {hasNext ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="flex w-full items-center justify-center rounded-lg border border-neutral-200 py-3 text-[15px] font-medium text-neutral-800 hover:bg-neutral-50"
          >
            더보기
          </Link>
        ) : (
          hasPrev && (
            <Link
              href={buildHref(1)}
              className="flex w-full items-center justify-center rounded-lg border border-neutral-200 py-3 text-[15px] font-medium text-neutral-800 hover:bg-neutral-50"
            >
              처음으로
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
