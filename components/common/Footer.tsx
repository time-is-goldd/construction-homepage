import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  ADDRESS,
  BUSINESS_REGISTRATION_NUMBER,
  COMPANY_NAME,
  EMAIL,
  PHONE_DISPLAY,
  REPRESENTATIVE_NAME,
} from "@/lib/constants";

// TODO: 전화번호만 customer-assets에 실제 자료가 제공되지 않아 placeholder
// 유지 중(나머지는 사업자등록증 기준 실제 값). 고객에게 확인 후 교체 필요.
const COMPANY_INFO = {
  name: COMPANY_NAME,
  ceo: REPRESENTATIVE_NAME,
  registrationNumber: BUSINESS_REGISTRATION_NUMBER,
  address: ADDRESS,
  phone: PHONE_DISPLAY,
  email: EMAIL,
};

const POLICY_LINKS = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-neutral-200">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:justify-between md:py-16">
        <div className="space-y-2 text-[13px] leading-relaxed md:text-sm">
          <p className="text-base font-semibold text-white">
            {COMPANY_INFO.name}
          </p>
          <p>대표자 {COMPANY_INFO.ceo}</p>
          <p>사업자등록번호 {COMPANY_INFO.registrationNumber}</p>
          <p>{COMPANY_INFO.address}</p>
          <p>
            <a href={`tel:${COMPANY_INFO.phone.replace(/-/g, "")}`}>
              {COMPANY_INFO.phone}
            </a>{" "}
            · <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
          </p>
        </div>

        <nav className="flex gap-6 text-[13px] md:text-sm">
          {POLICY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-4 text-[13px] text-neutral-400 md:text-sm">
          © {year} {COMPANY_INFO.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
