"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import { ADDRESS } from "@/lib/constants";

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: object) => unknown;
        Marker: new (options: object) => unknown;
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (
                result: Array<{ y: string; x: string }>,
                status: string,
              ) => void,
            ) => void;
          };
          Status: { OK: string };
        };
      };
    };
  }
}

// 카카오맵 JavaScript SDK를 사용해 실제 주소 위치에 지도를 표시한다.
// NEXT_PUBLIC_KAKAO_MAP_APP_KEY가 설정되기 전까지는 안내 메시지만 보여준다
// (Resend/GA4와 동일한 패턴 — 키 발급 전까지 빈 placeholder 대신 명확한 안내).
export default function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  const handleLoad = () => {
    window.kakao?.maps.load(() => {
      if (!containerRef.current) return;
      const geocoder = new window.kakao!.maps.services.Geocoder();
      geocoder.addressSearch(ADDRESS, (result, geoStatus) => {
        if (geoStatus !== window.kakao!.maps.services.Status.OK || !result[0]) {
          setStatus("error");
          return;
        }
        const coords = new window.kakao!.maps.LatLng(
          Number(result[0].y),
          Number(result[0].x),
        );
        const map = new window.kakao!.maps.Map(containerRef.current!, {
          center: coords,
          level: 4,
        });
        new window.kakao!.maps.Marker({ map, position: coords });
        setStatus("ready");
      });
    });
  };

  if (!appKey) {
    return (
      <div className="mt-6 flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-xl bg-neutral-100 md:aspect-[21/9]">
        <span className="text-sm text-neutral-500">
          지도를 표시하려면 카카오맵 JavaScript 키 설정이 필요합니다.
        </span>
        <span className="text-xs text-neutral-400">
          NEXT_PUBLIC_KAKAO_MAP_APP_KEY 환경변수를 설정해주세요.
        </span>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={handleLoad}
      />
      <div
        ref={containerRef}
        className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-100 md:aspect-[21/9]"
      />
      {status === "error" && (
        <p className="mt-2 text-sm text-neutral-400">
          주소로 위치를 찾지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}
    </>
  );
}
