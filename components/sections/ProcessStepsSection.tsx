import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline from "@/components/ui/Timeline";

const STEPS = ["수주", "설계/계획", "시공", "품질검사", "준공/AS"];

export default function ProcessStepsSection() {
  return (
    <Section tone="white">
      <SectionHeading>진행 프로세스</SectionHeading>
      <Timeline
        items={STEPS.map((step, i) => ({
          marker: (
            <span className="bg-brand-700 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ring-4 ring-white">
              {i + 1}
            </span>
          ),
          title: step,
        }))}
      />
    </Section>
  );
}
