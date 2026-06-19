import Link from "next/link";
import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";
import Card from "@/components/ui/Card";
import { countInquiriesByStatus, listInquiries } from "@/lib/inquiries";
import { listWorks } from "@/lib/works";
import { INQUIRY_TYPE_OPTIONS } from "@/lib/validation/contactSchema";

export default async function AdminDashboardPage() {
  const [works, inquiryCounts, recentInquiries] = await Promise.all([
    listWorks(),
    countInquiriesByStatus(),
    listInquiries(),
  ]);
  const publishedCount = works.filter((work) => work.isPublished).length;

  const stats = [
    { label: "신규 문의", value: String(inquiryCounts.new) },
    { label: "처리중 문의", value: String(inquiryCounts.in_progress) },
    { label: "완료 문의", value: String(inquiryCounts.done) },
    {
      label: "등록된 시공사례",
      value: `${works.length}건 (공개 ${publishedCount}건)`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">대시보드</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-[13px] text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-neutral-900">
            최근 문의
          </h2>
          <Link
            href="/admin/inquiries"
            className="text-brand-700 text-[14px] hover:underline"
          >
            전체보기 →
          </Link>
        </div>

        {recentInquiries.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {recentInquiries.slice(0, 5).map((inquiry) => (
              <li key={inquiry.id}>
                <Link
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-3 py-2.5 hover:bg-neutral-50"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-medium text-neutral-900">
                      {inquiry.name} ·{" "}
                      {INQUIRY_TYPE_OPTIONS.find((o) => o.value === inquiry.type)
                        ?.label ?? inquiry.type}
                    </span>
                    <span className="text-[13px] text-neutral-500">
                      {inquiry.title || inquiry.message.slice(0, 40)}
                    </span>
                  </span>
                  <InquiryStatusBadge status={inquiry.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[15px] text-neutral-600">
            아직 접수된 문의가 없습니다.
          </p>
        )}
      </Card>
    </div>
  );
}
