"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// GA4 측정 ID가 설정되지 않았거나 광고 차단기 등으로 gtag.js가 로드되지 않은
// 경우에도 호출부(ContactForm 등)가 안전하게 동작하도록 옵셔널 체이닝으로 감싼다.
export function trackEvent(name: string, params?: Record<string, unknown>) {
  window.gtag?.("event", name, params);
}
