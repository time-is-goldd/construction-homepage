"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { PHONE_TEL } from "@/lib/constants";

export default function FloatingButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-4 bottom-6 z-40 flex flex-col items-end gap-3 transition-all duration-200 ease-out motion-reduce:transition-none md:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <Button href={PHONE_TEL} variant="secondary" size="sm">
        <span aria-hidden="true">📞</span> 전화문의
      </Button>
      <Button href="/contact" variant="cta" size="sm">
        <span aria-hidden="true">💬</span> 빠른문의
      </Button>
      <button
        type="button"
        aria-label="맨 위로"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] font-medium text-neutral-800 shadow-[0_1px_3px_rgba(15,28,48,0.08)] hover:bg-neutral-50 md:text-sm"
      >
        <span aria-hidden="true">↑</span> 맨 위로
      </button>
    </div>
  );
}
