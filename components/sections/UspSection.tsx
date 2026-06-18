import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

// TODO: 실제 시공실적/장비/인증/업력 수치 확정 전 placeholder.
const USP_ITEMS = [
  { icon: "🏗️", value: "320건", label: "시공실적" },
  { icon: "🚜", value: "45대", label: "보유장비" },
  { icon: "🏆", value: "12개", label: "보유인증" },
  { icon: "📅", value: "28년", label: "업력" },
];

export default function UspSection() {
  return (
    <Section tone="muted">
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {USP_ITEMS.map((item) => (
          <Card
            key={item.label}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span aria-hidden="true" className="text-3xl">
              {item.icon}
            </span>
            <span className="text-brand-700 text-4xl font-bold md:text-5xl">
              {item.value}
            </span>
            <span className="text-[15px] text-neutral-600 md:text-base">
              {item.label}
            </span>
          </Card>
        ))}
      </div>
    </Section>
  );
}
