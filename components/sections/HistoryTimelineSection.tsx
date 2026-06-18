import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline from "@/components/ui/Timeline";

// TODO: 실제 연혁 확정 전 placeholder. UspSection의 "업력 28년"(1998년 설립 기준)과 일치시킴.
const HISTORY_ITEMS = [
  { year: "1998", event: "회사 설립" },
  { year: "2005", event: "ISO 9001 품질인증 취득" },
  { year: "2012", event: "사옥 이전 및 설비 증축" },
  { year: "2018", event: "누적 시공실적 200건 달성" },
  { year: "2024", event: "누적 시공실적 320건 달성" },
];

export default function HistoryTimelineSection() {
  return (
    <Section tone="white">
      <SectionHeading>회사연혁</SectionHeading>
      <Timeline
        items={HISTORY_ITEMS.map((item) => ({
          marker: (
            <span className="bg-accent-600 h-3 w-3 rounded-full ring-4 ring-white" />
          ),
          title: item.year,
          description: item.event,
        }))}
      />
    </Section>
  );
}
