"use client";

import { deleteProject } from "@/app/admin/(protected)/performance/projects/actions";

export default function DeleteProjectButton({
  projectId,
}: {
  projectId: string;
}) {
  return (
    <form action={() => deleteProject(projectId)}>
      <button
        type="submit"
        className="text-status-error font-medium hover:underline"
        onClick={(event) => {
          if (!confirm("이 시공 사례를 삭제할까요?")) {
            event.preventDefault();
          }
        }}
      >
        삭제
      </button>
    </form>
  );
}
