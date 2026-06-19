import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import HeroSlider from "./HeroSlider";

export default function HeroSection() {
  return (
    <section className="bg-brand-900 relative isolate overflow-hidden">
      <HeroSlider />
      <Container className="relative z-10 flex min-h-[480px] flex-col items-center justify-center gap-6 py-16 text-center text-white md:min-h-[600px] md:items-start md:py-24 md:text-left">
        <h1 className="text-[28px] leading-[1.3] font-bold tracking-[-0.02em] md:text-[40px]">
          대한민국 양돈 농가의 든든한 파트너
        </h1>
        <p className="max-w-xl text-base leading-[1.7] text-white/85 md:text-lg">
          노후 돈사 리모델링부터 대규모 신축 프로젝트까지, 불필요한 비용은
          줄이고 농장의 가치는 높여드립니다.
        </p>
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
