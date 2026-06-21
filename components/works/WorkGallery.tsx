"use client";

import Image from "next/image";
import { useRef, useState, type TouchEvent } from "react";

type WorkGalleryProps = {
  title: string;
  images: string[];
};

const SWIPE_THRESHOLD_PX = 40;

export default function WorkGallery({ title, images }: WorkGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

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

  const activeImage = images[activeIndex];

  return (
    <div>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100"
      >
        <Image
          src={activeImage}
          alt={`${title} 이미지 ${activeIndex + 1}`}
          fill
          sizes="(min-width: 768px) 800px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`이미지 ${i + 1}로 이동`}
            aria-current={i === activeIndex}
            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
              i === activeIndex ? "border-brand-700" : "border-transparent"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
