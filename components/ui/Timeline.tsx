import type { ReactNode } from "react";

type TimelineItem = {
  marker: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

type TimelineProps = {
  items: TimelineItem[];
};

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative mt-12 flex flex-col gap-8 md:flex-row md:gap-4">
      <div className="absolute top-2 bottom-2 left-4 w-px bg-neutral-200 md:hidden" />
      <div className="absolute top-4 right-0 left-0 hidden h-px bg-neutral-200 md:block" />

      {items.map((item, i) => (
        <div
          key={i}
          className="relative flex gap-4 md:flex-1 md:flex-col md:items-center md:gap-3 md:text-center"
        >
          <span className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center">
            {item.marker}
          </span>
          <div>
            <p className="text-brand-700 font-bold">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
