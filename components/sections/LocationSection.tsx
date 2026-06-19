import KakaoMap from "@/components/sections/KakaoMap";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { ADDRESS } from "@/lib/constants";

export default function LocationSection() {
  return (
    <Section tone="muted">
      <SectionHeading>오시는 길</SectionHeading>

      <KakaoMap />

      <div className="mt-6 flex flex-col gap-3 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
        <p className="font-medium text-neutral-900">{ADDRESS}</p>
      </div>
    </Section>
  );
}
