import { notFound } from "next/navigation";
import PartnerForm from "@/components/admin/PartnerForm";
import PartnerLogoUpload from "@/components/admin/PartnerLogoUpload";
import Card from "@/components/ui/Card";
import { getPartnerById } from "@/lib/partners";

type EditPartnerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPartnerPage({
  params,
}: EditPartnerPageProps) {
  const { id } = await params;
  const partner = await getPartnerById(id);

  if (!partner) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">파트너 기업 수정</h1>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
          기본 정보
        </h2>
        <PartnerForm mode="edit" record={partner} />
      </Card>

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-neutral-900">
          로고 이미지
        </h2>
        <PartnerLogoUpload
          partnerId={partner.id}
          currentLogoUrl={partner.logoUrl}
        />
      </Card>
    </div>
  );
}
