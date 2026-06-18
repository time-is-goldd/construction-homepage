import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: 실제 보유 장비/설비 목록은 콘텐츠 확정 후 교체.
const EQUIPMENT_ITEMS = [
  { name: "크레인", spec: "25톤급 / 2대" },
  { name: "굴착기", spec: "0.6㎥급 / 4대" },
  { name: "지게차", spec: "3톤급 / 6대" },
  { name: "콘크리트 펌프카", spec: "32m급 / 2대" },
];

export default function EquipmentSection() {
  return (
    <Section tone="white">
      <SectionHeading>보유 장비/설비</SectionHeading>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {EQUIPMENT_ITEMS.map((item) => (
          <Card key={item.name}>
            <div className="flex aspect-square items-center justify-center rounded-lg bg-neutral-100">
              <span className="text-sm text-neutral-400">
                {item.name} (placeholder)
              </span>
            </div>
            <h3 className="mt-3 text-[18px] leading-[1.4] font-semibold text-neutral-900">
              {item.name}
            </h3>
            <p className="mt-1 text-[15px] text-neutral-600 md:text-base">
              {item.spec}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
