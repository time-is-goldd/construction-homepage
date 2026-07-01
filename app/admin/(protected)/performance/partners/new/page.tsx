import PartnerForm from "@/components/admin/PartnerForm";

export default function NewPartnerPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">파트너 기업 추가</h1>
      <PartnerForm mode="create" />
    </div>
  );
}
