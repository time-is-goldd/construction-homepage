import Link from "next/link";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: 실제 사업분야 항목/설명 확정 전 placeholder. WIREFRAME.md의 /works 카테고리 예시와 동일하게 맞춤.
const BUSINESS_ITEMS = [
  {
    icon: "🏭",
    title: "공장/플랜트 시공",
    description: "생산설비 신축부터 증축까지 한번에 진행합니다.",
  },
  {
    icon: "🏢",
    title: "리모델링",
    description: "노후 시설을 안전 기준에 맞춰 새롭게 개선합니다.",
  },
  {
    icon: "🚧",
    title: "토목공사",
    description: "부지 조성부터 기반 공사까지 체계적으로 수행합니다.",
  },
  {
    icon: "🔧",
    title: "유지보수",
    description: "준공 이후에도 정기 점검과 보수를 책임집니다.",
  },
];

export default function BusinessPreviewSection() {
  return (
    <Section tone="white">
      <SectionHeading>사업분야</SectionHeading>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {BUSINESS_ITEMS.map((item) => (
          <Link key={item.title} href="/business" className="block">
            <Card hoverable className="h-full">
              <span aria-hidden="true" className="text-3xl">
                {item.icon}
              </span>
              <h3 className="mt-3 text-[20px] leading-[1.4] font-semibold text-neutral-900 md:text-[20px]">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
                {item.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
