import { notFound } from "next/navigation";
import PerformanceForm from "@/components/admin/PerformanceForm";
import Card from "@/components/ui/Card";
import { getPerformanceRecordById } from "@/lib/performance";

type EditPerformancePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPerformancePage({
  params,
}: EditPerformancePageProps) {
  const { id } = await params;
  const record = await getPerformanceRecordById(id);

  if (!record) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">시공실적 수정</h1>
      <Card>
        <PerformanceForm mode="edit" record={record} />
      </Card>
    </div>
  );
}
