import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: 실제 비전/미션/핵심가치 문구는 콘텐츠 확정 후 교체.
const ITEMS = [
  {
    icon: "🎯",
    title: "비전",
    description: "안전과 품질로 신뢰받는 시공 전문 기업이 되겠습니다.",
  },
  {
    icon: "🤝",
    title: "미션",
    description: "고객의 현장을 제 일처럼 책임지고 끝까지 완성합니다.",
  },
  {
    icon: "⭐",
    title: "핵심가치",
    description: "안전, 품질, 정직을 모든 시공의 기본 원칙으로 삼습니다.",
  },
];

export default function VisionMissionSection() {
  return (
    <Section tone="muted">
      <SectionHeading>비전·미션·핵심가치</SectionHeading>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {ITEMS.map((item) => (
          <Card key={item.title} className="text-center">
            <span aria-hidden="true" className="text-3xl">
              {item.icon}
            </span>
            <h3 className="mt-3 text-[20px] leading-[1.4] font-semibold text-neutral-900">
              {item.title}
            </h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
