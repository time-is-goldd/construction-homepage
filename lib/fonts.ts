import localFont from "next/font/local";

// (public)/layout.tsx, admin/layout.tsx 양쪽 root layout이 공유하는 폰트 설정.
export const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});
