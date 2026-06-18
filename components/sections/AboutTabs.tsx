import Link from "next/link";

const TABS = [
  { key: "greeting", label: "인사말", href: "/about" },
  { key: "company", label: "회사개요", href: "/about/company" },
] as const;

type AboutTabsProps = {
  active: (typeof TABS)[number]["key"];
};

export default function AboutTabs({ active }: AboutTabsProps) {
  return (
    <nav
      aria-label="회사소개 하위 메뉴"
      className="border-b border-neutral-200"
    >
      <ul className="flex gap-6">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-block border-b-2 px-1 py-3 text-[15px] font-medium md:text-base ${
                  isActive
                    ? "border-brand-700 text-brand-700"
                    : "hover:text-brand-700 border-transparent text-neutral-600"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
