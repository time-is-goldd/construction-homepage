"use client";

import { useRef, useState, type TouchEvent } from "react";
import Lightbox from "@/components/ui/Lightbox";

type WorkGalleryProps = {
  title: string;
  count?: number;
};

const SWIPE_THRESHOLD_PX = 40;

export default function WorkGallery({ title, count = 4 }: WorkGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const slides = Array.from({ length: count }, (_, i) => i);

  const goTo = (index: number) => {
    setActiveIndex((index + count) % count);
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      event.preventDefault();
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <div>
      <Lightbox
        triggerLabel={`${title} 이미지 확대보기`}
        trigger={
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="flex aspect-video items-center justify-center rounded-xl bg-neutral-100"
          >
            <span className="text-sm text-neutral-400">
              {title} 이미지 {activeIndex + 1} (placeholder)
            </span>
          </div>
        }
      >
        <div className="flex aspect-video items-center justify-center rounded-lg bg-neutral-100">
          <span className="text-sm text-neutral-400">
            {title} 이미지 {activeIndex + 1} (확대, placeholder)
          </span>
        </div>
      </Lightbox>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {slides.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`이미지 ${i + 1}로 이동`}
            aria-current={i === activeIndex}
            className={`flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg border-2 bg-neutral-100 text-xs text-neutral-400 ${
              i === activeIndex ? "border-brand-700" : "border-transparent"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
