import type { Metadata } from "next";
import { COMPANY_NAME } from "@/lib/constants";
import { pretendard } from "@/lib/fonts";
import "../globals.css";

// /admin 전체의 root layout. 공개 사이트의 Header/Footer/FloatingButton은
// 적용하지 않는다 — 관리자 화면은 별도 Admin Shell((protected)/layout.tsx)을 사용한다.
export const metadata: Metadata = {
  title: `관리자 | ${COMPANY_NAME}`,
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="h-full bg-neutral-50">{children}</body>
    </html>
  );
}
