import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import FloatingButton from "@/components/common/FloatingButton";
import Header from "@/components/common/Header";
import { COMPANY_NAME, COMPANY_TAGLINE } from "@/lib/constants";
import { pretendard } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: COMPANY_NAME,
  description: COMPANY_TAGLINE,
};

export default function PublicLayout({
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
