import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { ADDRESS } from "@/lib/constants";

export default function LocationSection() {
  return (
    <Section tone="muted">
      <SectionHeading>오시는 길</SectionHeading>

      {/* TODO: 실 운영 시 Kakao/Google Map 임베드로 교체. 현재는 placeholder. */}
      <div className="mt-6 flex aspect-[16/9] items-center justify-center rounded-xl bg-neutral-100 md:aspect-[21/9]">
        <span className="text-sm text-neutral-400">
          지도 영역 (placeholder)
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
        <p className="font-medium text-neutral-900">{ADDRESS}</p>
        <p>대중교통: 지하철역 및 버스정류장 정보 입력 예정.</p>
        <p>주차: 방문객 주차 가능 여부 및 안내 입력 예정.</p>
      </div>
    </Section>
  );
}
