import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV_ITEMS = [
  { label: "대시보드", href: "/admin", enabled: true },
  { label: "콘텐츠관리", href: "/admin/content", enabled: true },
  { label: "이미지관리", href: "/admin/images", enabled: true },
  { label: "시공사례관리", href: "/admin/works", enabled: true },
  { label: "기업 파트너십 관리", href: "/admin/performance", enabled: true },
  { label: "문의관리", href: "/admin/inquiries", enabled: true },
];

export default function AdminSidebar() {
  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="text-brand-700 px-6 py-5 text-lg font-bold">관리자</div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) =>
          item.enabled ? (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-neutral-800 hover:bg-neutral-50"
            >
              {item.label}
            </Link>
          ) : (
            <span
              key={item.href}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium text-neutral-400"
            >
              {item.label}
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px]">
                준비중
              </span>
            </span>
          ),
        )}
      </nav>
      <div className="border-t border-neutral-200 p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
