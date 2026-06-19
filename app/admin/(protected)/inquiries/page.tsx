import Link from "next/link";
import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";
import Card from "@/components/ui/Card";
import { listInquiries } from "@/lib/inquiries";
import { INQUIRY_TYPE_OPTIONS } from "@/lib/validation/contactSchema";
import type { InquiryStatus, InquiryType } from "@/types/inquiry";

const STATUS_TABS: { value: InquiryStatus | undefined; label: string }[] = [
  { value: undefined, label: "전체" },
  { value: "new", label: "신규" },
  { value: "in_progress", label: "처리중" },
  { value: "done", label: "완료" },
];

type AdminInquiriesPageProps = {
  searchParams: Promise<{ status?: string; type?: string }>;
};

function isInquiryStatus(value: string | undefined): value is InquiryStatus {
  return value === "new" || value === "in_progress" || value === "done";
}

function isInquiryType(value: string | undefined): value is InquiryType {
  return INQUIRY_TYPE_OPTIONS.some((option) => option.value === value);
}

export default async function AdminInquiriesPage({
  searchParams,
}: AdminInquiriesPageProps) {
  const params = await searchParams;
  const status = isInquiryStatus(params.status) ? params.status : undefined;
  const type = isInquiryType(params.type) ? params.type : undefined;

  const inquiries = await listInquiries({ status, type });

  const buildHref = (nextStatus: InquiryStatus | undefined) => {
    const query = new URLSearchParams();
    if (nextStatus) query.set("status", nextStatus);
    if (type) query.set("type", type);
    const queryString = query.toString();
    return queryString ? `/admin/inquiries?${queryString}` : "/admin/inquiries";
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">문의관리</h1>

      <nav className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={buildHref(tab.value)}
            className={`rounded-full px-4 py-2 text-[14px] font-medium ${
              status === tab.value
                ? "bg-brand-700 text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:text-brand-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-[14px]">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">접수일</th>
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">유형</th>
              <th className="px-4 py-3 font-medium">제목</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-neutral-100">
                <td className="px-4 py-3 text-neutral-500">
                  {new Date(inquiry.createdAt).toLocaleString("ko-KR")}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="hover:underline"
                  >
                    {inquiry.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {INQUIRY_TYPE_OPTIONS.find((o) => o.value === inquiry.type)?.label ??
                    inquiry.type}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {inquiry.title || inquiry.message.slice(0, 30)}
                </td>
                <td className="px-4 py-3">
                  <InquiryStatusBadge status={inquiry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inquiries.length === 0 && (
          <p className="p-6 text-[14px] text-neutral-500">문의 내역이 없습니다.</p>
        )}
      </Card>
    </div>
  );
}
