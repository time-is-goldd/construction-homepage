import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import ProjectImageUpload from "@/components/admin/ProjectImageUpload";
import Card from "@/components/ui/Card";
import { getProjectById } from "@/lib/corporate-projects";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">시공 사례 수정</h1>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
          기본 정보
        </h2>
        <ProjectForm mode="edit" record={project} />
      </Card>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
          대표 이미지
        </h2>
        <ProjectImageUpload
          projectId={project.id}
          currentImageUrl={project.imageUrl}
        />
      </Card>
    </div>
  );
}
