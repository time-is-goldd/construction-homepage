import Link from "next/link";
import DeletePerformanceButton from "@/components/admin/DeletePerformanceButton";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { listPerformanceRecords } from "@/lib/performance";

export default async function AdminPerformancePage() {
  const records = await listPerformanceRecords();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">시공실적관리</h1>
        <Button href="/admin/performance/new" size="sm">
          새 시공실적
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">연도</th>
              <th className="px-4 py-3 font-medium">업체명</th>
              <th className="px-4 py-3 font-medium">공사명</th>
              <th className="px-4 py-3 font-medium">공사유형</th>
              <th className="px-4 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-neutral-100">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {record.year}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {record.clientName}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {record.projectName}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {record.workType}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/performance/${record.id}`}
                      className="text-brand-700 font-medium hover:underline"
                    >
                      수정
                    </Link>
                    <DeletePerformanceButton recordId={record.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <p className="p-6 text-[14px] text-neutral-500">
            등록된 시공실적이 없습니다.
          </p>
        )}
      </Card>
    </div>
  );
}
