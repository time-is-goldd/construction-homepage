import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { COMPANY_NAME } from "@/lib/constants";
import { CONTENT_KEY_DEFS } from "@/lib/content-keys";
import { listSiteImages } from "@/lib/site-images";
import { getMultipleSiteContents } from "@/lib/site-contents";
import HeroSlider, { type HeroSlide } from "./HeroSlider";

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback-hero-aerial-01",
    src: "/images/hero/hero-aerial-01.png",
    alt: "대화시스템이 시공한 돈사 전경 항공 촬영",
  },
];

const KEYS = ["home.hero_title", "home.hero_subtitle"] as const;

function fallback(key: string) {
  return CONTENT_KEY_DEFS.find((d) => d.key === key)?.fallback ?? "";
}

export default async function HeroSection() {
  const [mainVisuals, contents] = await Promise.all([
    listSiteImages("main_visual"),
    getMultipleSiteContents([...KEYS]),
  ]);

  const slides: HeroSlide[] =
    mainVisuals.length > 0
      ? mainVisuals.map((image) => ({
          id: image.id,
          src: image.url,
          alt: image.alt ?? "대화시스템 메인비주얼",
        }))
      : FALLBACK_SLIDES;

  const heroTitle = contents["home.hero_title"] || fallback("home.hero_title");
  const heroSubtitle =
    contents["home.hero_subtitle"] || fallback("home.hero_subtitle");

  return (
    <section className="bg-brand-900 relative isolate overflow-hidden">
      <HeroSlider slides={slides} />
      <Container className="relative z-10 flex min-h-[480px] flex-col items-center justify-center gap-5 py-16 text-center text-white md:min-h-[600px] md:gap-6 md:py-24">
        {/* 로고마크: 흰색 컨테이너로 어두운 배경에서 선명하게 */}
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white/95 shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:h-24 md:w-24">
          <Image
            src="/images/logo/logo-mark.png"
            alt={`${COMPANY_NAME} 로고`}
            width={72}
            height={72}
            priority
            className="h-[50px] w-[50px] md:h-16 md:w-16"
          />
        </div>

        {/* 회사명 — Hero 최대 텍스트 */}
        <p className="text-[36px] leading-[1.2] font-bold tracking-[-0.02em] md:text-[52px]">
          {COMPANY_NAME}
        </p>

        {/* 메인 슬로건 */}
        <h1 className="text-[22px] leading-[1.4] font-semibold tracking-[-0.01em] md:text-[32px]">
          {heroTitle}
        </h1>

        {/* 서브 문구 */}
        <p className="max-w-xl text-base leading-[1.7] text-white/85 md:text-lg">
          {heroSubtitle}
        </p>

        {/* CTA 버튼 */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            무료 견적 문의
          </Button>
          <Button
            href="/works"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            시공사례 보기
          </Button>
        </div>
      </Container>
    </section>
  );
}
