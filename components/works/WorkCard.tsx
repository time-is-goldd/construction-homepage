import Image from "next/image";
import Link from "next/link";
import { getWorkCategoryLabel, type WorkItem } from "@/lib/mock-works";

type WorkCardProps = {
  work: WorkItem;
};

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <Link href={`/works/${work.id}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(15,28,48,0.08)] transition-shadow duration-200 ease-out hover:shadow-[0_6px_16px_rgba(15,28,48,0.12)]">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={work.images[0]}
            alt={work.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
          <span className="bg-accent-600 absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-white">
            {getWorkCategoryLabel(work.categorySlug)}
          </span>
          <div className="bg-brand-900/55 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
            <span className="text-sm font-semibold text-white">자세히보기</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-[20px] leading-[1.4] font-semibold text-neutral-900">
            {work.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[15px] leading-[1.6] text-neutral-600">
            {work.summary}
          </p>
          {work.location && (
            <p className="mt-2 text-[13px] text-neutral-400">
              📍 {work.location}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
