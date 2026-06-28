import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTENT_KEY_DEFS } from "@/lib/content-keys";
import { getSiteContent } from "@/lib/site-contents";

// about.ceo_greeting은 단락을 \n\n으로 구분해 저장한다.
// DB에 없으면 content-keys.ts의 fallback(실명 포함 기본 문구)이 그대로 사용된다.
const KEY = "about.ceo_greeting";
const FALLBACK = CONTENT_KEY_DEFS.find((d) => d.key === KEY)?.fallback ?? "";

export default async function CeoGreetingSection() {
  const raw = await getSiteContent(KEY);
  const text = raw || FALLBACK;
  const paragraphs = text.split(/\n\n+/);

  return (
    <Section tone="white">
      <SectionHeading>대표 인사말</SectionHeading>
      <div className="mx-auto mt-10 max-w-[720px]">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className={`${i === 0 ? "" : "mt-7"} text-[18px] leading-[1.9] text-neutral-700 md:text-[20px]`}
          >
            {para}
          </p>
        ))}
      </div>
    </Section>
  );
}
