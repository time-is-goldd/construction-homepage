import Link from "next/link";
import { togglePublish } from "@/app/admin/(protected)/works/actions";
import DeleteWorkButton from "@/components/admin/DeleteWorkButton";
import SuccessBanner from "@/components/admin/SuccessBanner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { listWorks } from "@/lib/works";

type AdminWorksPageProps = {
  searchParams: Promise<{ success?: string }>;
};

export default async function AdminWorksPage({
  searchParams,
}: AdminWorksPageProps) {
  const { success } = await searchParams;
  const works = await listWorks();

  return (
    <div className="flex flex-col gap-6">
      {success === "work" && (
        <SuccessBanner message="시공사례가 성공적으로 등록되었습니다." />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">시공사례관리</h1>
        <Button href="/admin/works/new" size="sm">
          새 시공사례
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-medium">제목</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">이미지</th>
              <th className="px-4 py-3 font-medium">공개여부</th>
              <th className="px-4 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id} className="border-b border-neutral-100">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {work.title}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {work.category?.name ?? "공사유형 확인중"}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {work.images?.length ?? 0}장
                </td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      await togglePublish(work.id, !work.isPublished);
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                        work.isPublished
                          ? "bg-status-done/10 text-status-done"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {work.isPublished ? "공개" : "비공개"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/works/${work.id}`}
                      className="text-brand-700 font-medium hover:underline"
                    >
                      수정
                    </Link>
                    <DeleteWorkButton workId={work.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {works.length === 0 && (
          <p className="p-6 text-[14px] text-neutral-500">
            등록된 시공사례가 없습니다.
          </p>
        )}
      </Card>
    </div>
  );
}
