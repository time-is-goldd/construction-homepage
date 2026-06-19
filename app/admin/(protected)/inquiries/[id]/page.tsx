import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryMemoForm from "@/components/admin/InquiryMemoForm";
import InquiryStatusSelect from "@/components/admin/InquiryStatusSelect";
import Card from "@/components/ui/Card";
import { getInquiryById } from "@/lib/inquiries";
import { createSignedAttachmentUrl } from "@/lib/storage/upload-attachment";
import { INQUIRY_TYPE_OPTIONS } from "@/lib/validation/contactSchema";

type InquiryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params;
  const inquiry = await getInquiryById(id);
  if (!inquiry) notFound();

  const attachmentUrl = inquiry.attachmentUrl
    ? await createSignedAttachmentUrl(inquiry.attachmentUrl)
    : null;
  const typeLabel =
    INQUIRY_TYPE_OPTIONS.find((option) => option.value === inquiry.type)?.label ??
    inquiry.type;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">문의 상세</h1>
        <Link href="/admin/inquiries" className="text-brand-700 text-[14px] hover:underline">
          ← 목록으로
        </Link>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-neutral-900">
            {inquiry.title || "(제목 없음)"}
          </h2>
          <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          <InfoRow label="이름" value={inquiry.name} />
          <InfoRow label="연락처" value={inquiry.phone} />
          <InfoRow label="이메일" value={inquiry.email} />
          <InfoRow label="유형" value={typeLabel} />
          <InfoRow
            label="접수일"
            value={new Date(inquiry.createdAt).toLocaleString("ko-KR")}
          />
          <InfoRow
            label="첨부파일"
            value={
              attachmentUrl ? (
                <a
                  href={attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-700 hover:underline"
                >
                  다운로드 (10분간 유효)
                </a>
              ) : (
                "없음"
              )
            }
          />
        </dl>

        <div className="mt-6 border-t border-neutral-200 pt-4">
          <p className="text-[14px] font-medium text-neutral-800">문의 내용</p>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.6] text-neutral-700">
            {inquiry.message}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-[16px] font-semibold text-neutral-900">내부 메모</h2>
        <InquiryMemoForm inquiryId={inquiry.id} initialMemo={inquiry.adminMemo ?? ""} />
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[13px] text-neutral-500">{label}</dt>
      <dd className="text-[15px] text-neutral-900">{value}</dd>
    </div>
  );
}
