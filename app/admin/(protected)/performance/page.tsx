import Link from "next/link";
import DeletePartnerButton from "@/components/admin/DeletePartnerButton";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import SuccessBanner from "@/components/admin/SuccessBanner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { listAllPartners } from "@/lib/partners";
import { listAllProjects } from "@/lib/corporate-projects";

const SUCCESS_MESSAGES: Record<string, string> = {
  partner: "파트너 기업이 성공적으로 등록되었습니다.",
  project: "시공 사례가 성공적으로 등록되었습니다.",
};

type AdminPerformancePageProps = {
  searchParams: Promise<{ success?: string }>;
};

export default async function AdminPerformancePage({
  searchParams,
}: AdminPerformancePageProps) {
  const { success } = await searchParams;
  const [partners, projects] = await Promise.all([
    listAllPartners(),
    listAllProjects(),
  ]);

  const successMessage = success ? SUCCESS_MESSAGES[success] : null;

  return (
    <div className="flex flex-col gap-12">
      {successMessage && <SuccessBanner message={successMessage} />}

      {/* ── 기업 파트너 관리 ──────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-neutral-900">
            기업 파트너십 관리
          </h1>
          <Button href="/admin/performance/partners/new" size="sm">
            파트너 추가
          </Button>
        </div>

        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 font-medium">순서</th>
                <th className="px-4 py-3 font-medium">기업명</th>
                <th className="px-4 py-3 font-medium">협력기간</th>
                <th className="px-4 py-3 font-medium">로고</th>
                <th className="px-4 py-3 font-medium">공개</th>
                <th className="px-4 py-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 text-neutral-500">
                    {partner.sortOrder}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {partner.companyName}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {partner.startYear} ~ {partner.endYear ?? "현재"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        partner.logoUrl
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {partner.logoUrl ? "있음" : "없음"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                        partner.isPublished
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {partner.isPublished ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/performance/partners/${partner.id}`}
                        className="text-brand-700 font-medium hover:underline"
                      >
                        수정
                      </Link>
                      <DeletePartnerButton partnerId={partner.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {partners.length === 0 && (
            <p className="p-6 text-[14px] text-neutral-500">
              등록된 파트너 기업이 없습니다.
            </p>
          )}
        </Card>
      </div>

      {/* ── 전체 시공 실적 / 사례 관리 ───────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-neutral-900">
            전체 시공 실적 / 사례 관리
          </h2>
          <Button href="/admin/performance/projects/new" size="sm">
            사례 추가
          </Button>
        </div>

        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 font-medium">순서</th>
                <th className="px-4 py-3 font-medium">기업명 / 사례명</th>
                <th className="px-4 py-3 font-medium">간단 설명</th>
                <th className="px-4 py-3 font-medium">이미지</th>
                <th className="px-4 py-3 font-medium">공개</th>
                <th className="px-4 py-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 text-neutral-500">
                    {project.sortOrder}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {project.title}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-neutral-600">
                    {project.summary ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        project.imageUrl
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {project.imageUrl ? "있음" : "없음"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                        project.isPublished
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {project.isPublished ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/performance/projects/${project.id}`}
                        className="text-brand-700 font-medium hover:underline"
                      >
                        수정
                      </Link>
                      <DeleteProjectButton projectId={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <p className="p-6 text-[14px] text-neutral-500">
              등록된 시공 사례가 없습니다.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
