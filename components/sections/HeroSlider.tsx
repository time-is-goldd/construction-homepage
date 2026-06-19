"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroSlide = {
  id: string;
  src: string;
  alt: string;
};

type HeroSliderProps = {
  slides: HeroSlide[];
};

const AUTOPLAY_MS = 5000;

export default function HeroSlider({ slides: SLIDES }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (SLIDES.length <= 1) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (paused || reduceMotion) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [paused, SLIDES.length]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="absolute inset-0"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="bg-brand-900/55 absolute inset-0" />
      </div>

      {SLIDES.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${i + 1}번째 슬라이드로 이동`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-150 ease-out ${
                i === index ? "bg-accent-500" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
