import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/constants";

export default function CtaBannerSection() {
  return (
    <section className="bg-brand-700">
      <Container className="flex flex-col items-center gap-6 py-16 text-center text-white md:py-20">
        <h2 className="text-2xl leading-[1.35] font-bold tracking-[-0.01em] md:text-[32px]">
          지금 바로 무료 견적을 받아보세요
        </h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={PHONE_TEL}
            className="text-base font-medium text-white/90 hover:text-white md:text-lg"
          >
            📞 {PHONE_DISPLAY}
          </a>
          <Button href="/contact" variant="cta" size="lg">
            온라인 문의하기
          </Button>
        </div>
      </Container>
    </section>
  );
}
