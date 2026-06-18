import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: 실 데이터는 Phase 4 Supabase works 테이블 연동 후 교체. 현재는 임시 데이터.
const WORKS_ITEMS = [
  {
    id: "1",
    category: "공장/플랜트",
    title: "○○공장 신축공사",
    description: "생산동 신축부터 설비 반입까지 일괄 진행한 프로젝트입니다.",
    date: "2025.03",
  },
  {
    id: "2",
    category: "리모델링",
    title: "○○물류센터 리모델링",
    description: "노후 구조물을 안전 기준에 맞춰 전면 개선했습니다.",
    date: "2025.01",
  },
  {
    id: "3",
    category: "토목",
    title: "○○산업단지 토목공사",
    description: "부지 조성부터 기반 공사까지 체계적으로 수행했습니다.",
    date: "2024.11",
  },
  {
    id: "4",
    category: "유지보수",
    title: "○○공장 정기 유지보수",
    description: "준공 이후 정기 점검과 보수를 책임지고 진행했습니다.",
    date: "2024.09",
  },
  {
    id: "5",
    category: "공장/플랜트",
    title: "○○플랜트 증축공사",
    description: "기존 라인을 유지하며 생산 설비를 증축했습니다.",
    date: "2024.07",
  },
  {
    id: "6",
    category: "리모델링",
    title: "○○사옥 리모델링",
    description: "사옥 내외부를 현대적 기준으로 개선한 사례입니다.",
    date: "2024.05",
  },
];

export default function WorksHighlightSection() {
  return (
    <Section tone="muted">
      <div className="flex items-end justify-between">
        <SectionHeading>시공사례</SectionHeading>
        <Button href="/works" variant="ghost" size="sm">
          전체보기 →
        </Button>
      </div>

      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3">
        {WORKS_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={`/works/${item.id}`}
            className="group block w-[85%] flex-shrink-0 snap-start md:w-auto"
          >
            <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(15,28,48,0.08)] transition-shadow duration-200 ease-out hover:shadow-[0_6px_16px_rgba(15,28,48,0.12)]">
              <div className="relative aspect-video overflow-hidden">
                <div className="from-brand-700 to-brand-500 absolute inset-0 flex items-center justify-center bg-gradient-to-br transition-transform duration-200 ease-out group-hover:scale-[1.03]">
                  <span className="text-xs text-white/50">
                    썸네일 placeholder
                  </span>
                </div>
                <span className="bg-accent-600 absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-white">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-[20px] leading-[1.4] font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[15px] leading-[1.6] text-neutral-600">
                  {item.description}
                </p>
                <p className="mt-2 text-[13px] text-neutral-400">{item.date}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </Section>
  );
}
