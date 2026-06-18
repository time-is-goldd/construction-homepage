"use client";

import { useEffect, useState } from "react";

// TODO: 실제 메인 비주얼 이미지는 Phase 4 관리자 업로드 연동 후 교체.
const SLIDES = [
  { id: 1, label: "메인 비주얼 1 (관리자 업로드 예정)" },
  { id: 2, label: "메인 비주얼 2 (관리자 업로드 예정)" },
  { id: 3, label: "메인 비주얼 3 (관리자 업로드 예정)" },
];

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (paused || reduceMotion) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [paused]);

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
            className={`from-brand-900 to-brand-500 absolute inset-0 flex items-center justify-center bg-gradient-to-br transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-sm font-medium text-white/40">
              {slide.label}
            </span>
          </div>
        ))}
        <div className="bg-brand-900/55 absolute inset-0" />
      </div>

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
    </div>
  );
}
