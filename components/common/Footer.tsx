import Link from "next/link";
import Container from "@/components/ui/Container";

// TODO: 실제 사업자 정보 확정 전 placeholder. Phase 4 이후 상수 분리 고려.
const COMPANY_INFO = {
  name: "주식회사 회사명",
  ceo: "대표자명",
  registrationNumber: "123-45-67890",
  address: "주소 입력 예정 (시/도 시/군/구 도로명)",
  phone: "02-1234-5678",
  email: "contact@example.com",
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
