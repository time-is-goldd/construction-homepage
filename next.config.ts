import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp는 네이티브 바이너리(.node)를 포함해 번들링 대상에서 제외해야 한다
  // (webpack이 sharp의 .node 파일을 직접 처리하지 못해 외부 require로 남겨야 함).
  serverExternalPackages: ["sharp"],
  // 빌드 워커가 여러 프로세스에서 동시에 sharp 네이티브 바이너리를 처음
  // dlopen할 때 Windows에서 간헐적으로 ERR_DLOPEN_FAILED가 발생한다(병렬
  // 로딩 경쟁 상태로 추정). 빌드 워커를 1개로 고정해 race를 제거한다.
  experimental: {
    cpus: 1,
  },
  images: {
    // Supabase Storage(work-images/site-images 버킷)에 업로드된 이미지를
    // next/image가 요청 시점에 리사이즈/포맷 변환할 수 있도록 허용한다.
    // ARCHITECTURE.md §7-3.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wnlxxgpacjgsigidqkmm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
