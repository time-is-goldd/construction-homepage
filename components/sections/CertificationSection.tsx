import Card from "@/components/ui/Card";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

// TODO: 실제 인증서/자격증 목록 및 이미지는 콘텐츠 확정 후 교체.
const CERTIFICATIONS = [
  { name: "건설업 등록증", issuer: "국토교통부", date: "1998.03" },
  {
    name: "ISO 9001 품질경영시스템",
    issuer: "한국품질인증원",
    date: "2005.06",
  },
  {
    name: "ISO 45001 안전보건경영시스템",
    issuer: "한국품질인증원",
    date: "2019.11",
  },
];

export default function CertificationSection() {
  return (
    <Section tone="muted">
      <SectionHeading>인증서/자격증</SectionHeading>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert) => (
          <Lightbox
            key={cert.name}
            triggerLabel={`${cert.name} 확대보기`}
            caption={`${cert.issuer} · ${cert.date}`}
            trigger={
              <Card hoverable>
                <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-neutral-100">
                  <span className="text-sm text-neutral-400">
                    인증서 (placeholder)
                  </span>
                </div>
                <h3 className="mt-3 text-[18px] leading-[1.4] font-semibold text-neutral-900">
                  {cert.name}
                </h3>
                <p className="mt-1 text-[15px] text-neutral-600 md:text-base">
                  {cert.issuer} · {cert.date}
                </p>
              </Card>
            }
          >
            <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-neutral-100">
              <span className="text-sm text-neutral-400">
                {cert.name} (확대, placeholder)
              </span>
            </div>
          </Lightbox>
        ))}
      </div>
    </Section>
  );
}
