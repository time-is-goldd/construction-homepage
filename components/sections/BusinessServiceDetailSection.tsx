import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";

// TODO: 실제 사업분야 설명 및 이미지는 콘텐츠 확정 후 교체. 카테고리 slug는 /works 카테고리 필터와 맞춤.
const SERVICES = [
  {
    slug: "factory-plant",
    title: "공장/플랜트 시공",
    description:
      "생산설비 신축부터 증축까지, 가동 일정에 맞춘 공정 관리로 한번에 진행합니다.",
  },
  {
    slug: "remodeling",
    title: "리모델링",
    description:
      "노후 시설을 현행 안전 기준에 맞춰 구조 보강부터 마감까지 새롭게 개선합니다.",
  },
  {
    slug: "civil",
    title: "토목공사",
    description:
      "부지 조성부터 기반 공사까지, 설계 단계의 검토를 거쳐 체계적으로 수행합니다.",
  },
  {
    slug: "maintenance",
    title: "유지보수",
    description:
      "준공 이후에도 정기 점검과 보수를 책임지고 진행해 시설의 수명을 관리합니다.",
  },
];

export default function BusinessServiceDetailSection() {
  return (
    <Section tone="muted">
      <div className="flex flex-col gap-16">
        {SERVICES.map((service, i) => (
          <div
            key={service.slug}
            className={`flex flex-col gap-6 md:items-center md:gap-12 ${
              i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-neutral-100 md:w-1/2">
              <span className="text-sm text-neutral-400">
                {service.title} 이미지 (placeholder)
              </span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-[20px] leading-[1.4] font-semibold text-neutral-900 md:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
                {service.description}
              </p>
              <Button
                href={`/works?category=${service.slug}`}
                variant="ghost"
                size="sm"
                className="mt-4"
              >
                관련 시공사례 보기 →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
