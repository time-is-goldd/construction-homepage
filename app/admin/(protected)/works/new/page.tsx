import WorkForm from "@/components/admin/WorkForm";
import { getCategories } from "@/lib/works";

export default async function NewWorkPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">새 시공사례 등록</h1>
      <WorkForm mode="create" categories={categories} />
    </div>
  );
}
