import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import WorkCard from "@/components/works/WorkCard";
import { listWorks } from "@/lib/works";

export default async function WorksHighlightSection() {
  const works = await listWorks({ publishedOnly: true });
  const HIGHLIGHT_ITEMS = works.slice(0, 6);

  return (
    <Section tone="muted">
      <div className="flex items-end justify-between">
        <SectionHeading>시공사례</SectionHeading>
        <Button href="/works" variant="ghost" size="sm">
          전체보기 →
        </Button>
      </div>

      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3">
        {HIGHLIGHT_ITEMS.map((work) => (
          <div
            key={work.id}
            className="w-[85%] flex-shrink-0 snap-start md:w-auto"
          >
            <WorkCard work={work} />
          </div>
        ))}
      </div>
    </Section>
  );
}
