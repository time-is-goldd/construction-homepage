import { notFound } from "next/navigation";
import WorkForm from "@/components/admin/WorkForm";
import WorkImageManager from "@/components/admin/WorkImageManager";
import Card from "@/components/ui/Card";
import { getCategories, getWorkById } from "@/lib/works";

type EditWorkPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const { id } = await params;
  const [work, categories] = await Promise.all([
    getWorkById(id),
    getCategories(),
  ]);

  if (!work) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">시공사례 수정</h1>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
          기본 정보
        </h2>
        <WorkForm mode="edit" categories={categories} work={work} />
      </Card>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
          갤러리 이미지
        </h2>
        <WorkImageManager workId={work.id} images={work.images ?? []} />
      </Card>
    </div>
  );
}
