import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import {
  ADDRESS,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/constants";

const INFO_ITEMS = [
  { icon: "📞", label: "전화", value: PHONE_DISPLAY, href: PHONE_TEL },
  { icon: "✉️", label: "이메일", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: "📍", label: "주소", value: ADDRESS, href: undefined },
];

export default function ContactInfoSection() {
  return (
    <Section tone="white">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {INFO_ITEMS.map((item) => (
          <Card key={item.label} className="flex flex-col gap-2">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-[15px] font-semibold text-neutral-900 md:text-base">
              {item.label}
            </p>
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-brand-700 text-[15px] text-neutral-600 md:text-base"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-[15px] text-neutral-600 md:text-base">
                {item.value}
              </p>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
