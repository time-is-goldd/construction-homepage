import Script from "next/script";

// GA4 연동 준비. NEXT_PUBLIC_GA_MEASUREMENT_ID가 설정되기 전까지는 아무 것도
// 렌더링하지 않는다(고객이 측정 ID를 발급해 .env에 채우면 즉시 활성화됨).
// 이벤트 전송은 lib/analytics/gtag.ts의 trackEvent()를 사용한다.
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
