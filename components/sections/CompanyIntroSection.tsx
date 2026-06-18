import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: 실제 회사소개 문구/사업자등록증 이미지는 콘텐츠 확정 후 교체.
export default function CompanyIntroSection() {
  return (
    <Section tone="white">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        <div className="md:w-1/2">
          <SectionHeading>회사소개</SectionHeading>
          <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            저희는 지난 28년간 공장·플랜트·리모델링·토목 분야에서 일관된 품질의
            시공을 제공해 온 전문 시공 기업입니다.
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            안전과 공정 관리를 최우선으로 두고, 발주부터 준공 이후 유지보수까지
            책임감 있게 함께합니다.
          </p>
          <Button href="/about" variant="secondary" size="md" className="mt-6">
            회사소개 더보기
          </Button>
        </div>

        <div className="md:w-1/2">
          <Lightbox
            triggerLabel="사업자등록증 확대보기"
            caption="사업자등록번호 123-45-67890"
            trigger={
              <Card tone="emphasized" className="relative">
                <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-neutral-100">
                  <span className="text-sm text-neutral-400">
                    사업자등록증 (placeholder)
                  </span>
                </div>
                <span className="text-brand-700 absolute top-3 right-3 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-medium shadow-[0_1px_3px_rgba(15,28,48,0.08)]">
                  🔍 확대
                </span>
              </Card>
            }
          >
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-neutral-100">
              <span className="text-sm text-neutral-400">
                사업자등록증 (placeholder, 확대보기)
              </span>
            </div>
          </Lightbox>
        </div>
      </div>
    </Section>
  );
}
