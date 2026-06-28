import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { BUSINESS_REGISTRATION_NUMBER } from "@/lib/constants";
import { CONTENT_KEY_DEFS } from "@/lib/content-keys";
import { getSiteContent } from "@/lib/site-contents";

const KEY = "home.company_intro";
const FALLBACK = CONTENT_KEY_DEFS.find((d) => d.key === KEY)?.fallback ?? "";

export default async function CompanyIntroSection() {
  const raw = await getSiteContent(KEY);
  const text = raw || FALLBACK;
  const paragraphs = text.split(/\n\n+/);

  return (
    <Section tone="white">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        <div className="md:w-1/2">
          <SectionHeading>회사소개</SectionHeading>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-4" : "mt-3"} text-[15px] leading-[1.6] text-neutral-600 md:text-base`}
            >
              {para}
            </p>
          ))}
          <Button href="/about" variant="secondary" size="md" className="mt-6">
            회사소개 더보기
          </Button>
        </div>

        <div className="md:w-1/2">
          <a
            href="/documents/business-registration.pdf"
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <Card tone="emphasized" className="relative">
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-lg bg-neutral-100">
                <span className="text-4xl">📄</span>
                <span className="text-[15px] font-medium text-neutral-700">
                  사업자등록증 보기 (PDF)
                </span>
                <span className="text-sm text-neutral-500">
                  사업자등록번호 {BUSINESS_REGISTRATION_NUMBER}
                </span>
              </div>
            </Card>
          </a>
        </div>
      </div>
    </Section>
  );
}
