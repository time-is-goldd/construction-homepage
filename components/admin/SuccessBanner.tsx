"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SuccessBannerProps = {
  message: string;
};

export default function SuccessBanner({ message }: SuccessBannerProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // URL에서 ?success= 파라미터 즉시 제거 (새로고침 시 재표시 방지)
    router.replace(window.location.pathname, { scroll: false });
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-800">
      <span className="flex items-center gap-2">
        <svg
          className="h-4 w-4 shrink-0 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
        {message}
      </span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 shrink-0 text-green-500 hover:text-green-700"
        aria-label="닫기"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
