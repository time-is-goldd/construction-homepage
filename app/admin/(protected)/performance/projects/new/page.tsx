import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">시공 사례 추가</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
