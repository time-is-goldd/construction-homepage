import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { COMPANY_NAME } from "@/lib/constants";

// customer-assets/문구.txt > "2. 홈화면 하단 (주)대화시스템만의 강점" 그대로 적용.
const STRENGTH_ITEMS = [
  {
    icon: "💰",
    title: "거품 없는 직영 시공 시스템",
    description:
      "하도급 없이 전 공정을 본사에서 직접 관리하고 시공하는 직영 시스템을 운영합니다. 불필요한 중간 마진과 가격 거품을 확실하게 걷어내어 농가에 가장 투명하고 합리적인 견적을 제시합니다.",
  },
  {
    icon: "🛠️",
    title: "돈사 전문 기술진의 정밀 시공",
    description:
      "돈사 건축 및 내부 시설에 오랜 노하우를 가진 현장 전문가들이 직접 시공하여 오차 없는 구조를 완성합니다. 철저하고 체계적인 공정 관리를 통해 공사 기간(공기)을 효율적으로 단축합니다.",
  },
  {
    icon: "💬",
    title: "소통 중심의 1:1 맞춤 시공 및 사후 관리",
    description:
      "농가와의 지속적인 소통을 통한 요구사항을 최우선으로 반영합니다. 시공 후 발생할 수 있는 작은 문제까지 책임지고 해결하는 철저한 사후 관리로 끝까지 신뢰를 이어갑니다.",
  },
];

export default function UspSection() {
  return (
    <Section tone="muted">
      <SectionHeading>{COMPANY_NAME}만의 강점</SectionHeading>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {STRENGTH_ITEMS.map((item) => (
          <Card key={item.title} className="flex flex-col gap-3">
            <span aria-hidden="true" className="text-3xl">
              {item.icon}
            </span>
            <h3 className="text-[17px] font-semibold text-neutral-900 md:text-lg">
              {item.title}
            </h3>
            <p className="text-[15px] leading-[1.6] text-neutral-600 md:text-base">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
