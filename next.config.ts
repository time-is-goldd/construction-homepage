import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp는 네이티브 바이너리(.node)를 포함해 번들링 대상에서 제외해야 한다
  // (webpack이 sharp의 .node 파일을 직접 처리하지 못해 외부 require로 남겨야 함).
  serverExternalPackages: ["sharp"],
  // Vercel 배포 시 /admin/works에서만 500(ERR_DLOPEN_FAILED: libvips-cpp.so를
  // 찾을 수 없음)이 발생한 원인. sharp의 네이티브 .node 파일은 빌드에서는 정상
  // 설치되지만, sharp가 런타임에 dlopen으로 불러오는 별도 패키지인
  // @img/sharp-libvips-linux-x64의 .so 파일은 Next의 서버리스 함수 출력
  // 트레이싱(output file tracing)이 정적 분석만으로는 감지하지 못해 함수
  // 번들에서 누락된다. outputFileTracingIncludes로 강제 포함시킨다.
  outputFileTracingIncludes: {
    "/**/*": [
      "./node_modules/@img/sharp-libvips-linux-x64/**/*",
      "./node_modules/@img/sharp-linux-x64/**/*",
    ],
  },
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
