import WorkForm from "@/components/admin/WorkForm";
import Card from "@/components/ui/Card";
import { getCategoriesWithUnclassified } from "@/lib/works";

export default async function NewWorkPage() {
  const categories = await getCategoriesWithUnclassified();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">새 시공사례 등록</h1>
      <Card>
        <WorkForm mode="create" categories={categories} />
      </Card>
      <p className="text-[13px] text-neutral-500">
        먼저 기본 정보를 등록하면, 이어지는 화면에서 갤러리 이미지를 업로드할 수 있습니다.
      </p>
    </div>
  );
}
