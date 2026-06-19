import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { COMPANY_NAME } from "@/lib/constants";

// TODO: 사업자등록증 이미지는 customer-assets에 제공되지 않아 placeholder 유지 중.
export default function CompanyIntroSection() {
  return (
    <Section tone="white">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        <div className="md:w-1/2">
          <SectionHeading>회사소개</SectionHeading>
          <p className="mt-4 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            {COMPANY_NAME}은 하도급 없는 직영 시공 시스템으로 돈사 신축부터
            리모델링, 순환시설, 환기공사까지 책임지는 축사 시공 전문 기업입니다.
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
            돈사 전문 기술진이 직접 시공하며, 시공 이후에도 1:1 맞춤 소통과 사후
            관리로 농가와의 신뢰를 이어갑니다.
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
