import PerformanceForm from "@/components/admin/PerformanceForm";
import Card from "@/components/ui/Card";

export default function NewPerformancePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">새 시공실적 등록</h1>
      <Card>
        <PerformanceForm mode="create" />
      </Card>
    </div>
  );
}
