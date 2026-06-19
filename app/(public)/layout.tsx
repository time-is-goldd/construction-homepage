import type { Metadata } from "next";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import Footer from "@/components/common/Footer";
import FloatingButton from "@/components/common/FloatingButton";
import Header from "@/components/common/Header";
import JsonLd from "@/components/seo/JsonLd";
import { COMPANY_NAME, COMPANY_TAGLINE } from "@/lib/constants";
import { pretendard } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
} from "@/lib/seo/structured-data";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: COMPANY_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: COMPANY_TAGLINE,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: COMPANY_NAME,
    description: COMPANY_TAGLINE,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY_NAME,
    description: COMPANY_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={buildOrganizationJsonLd()} />
        <JsonLd data={buildLocalBusinessJsonLd()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingButton />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
