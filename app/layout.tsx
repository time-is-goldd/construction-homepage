import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/common/Footer";
import FloatingButton from "@/components/common/FloatingButton";
import Header from "@/components/common/Header";
import "./globals.css";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "construction-homepage",
  description: "제조·건설업 기업 홈페이지 프로젝트 (개발 진행 중)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingButton />
      </body>
    </html>
  );
}
