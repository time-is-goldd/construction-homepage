import Image from "next/image";
import Link from "next/link";
import DeleteSiteImageButton from "@/components/admin/DeleteSiteImageButton";
import SiteImageUploadForm from "@/components/admin/SiteImageUploadForm";
import Card from "@/components/ui/Card";
import { listSiteImages } from "@/lib/site-images";
import type { SiteImageType } from "@/types/site-image";

const TABS: { type: SiteImageType; label: string }[] = [
  { type: "main_visual", label: "메인비주얼" },
  { type: "logo", label: "로고" },
];

type AdminImagesPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function AdminImagesPage({
  searchParams,
}: AdminImagesPageProps) {
  const params = await searchParams;
  const activeType: SiteImageType = TABS.some((tab) => tab.type === params.type)
    ? (params.type as SiteImageType)
    : "main_visual";

  const images = await listSiteImages(activeType);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">이미지관리</h1>

      <nav className="flex gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.type}
            href={`/admin/images?type=${tab.type}`}
            className={`rounded-full px-4 py-2 text-[14px] font-medium ${
              activeType === tab.type
                ? "bg-brand-700 text-white"
                : "border border-neutral-200 bg-white text-neutral-600 hover:text-brand-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <Card>
        {activeType === "main_visual" && (
          <p className="mb-4 text-[13px] text-neutral-500">
            메인 페이지 Hero 슬라이더에 등록한 순서대로 노출됩니다.
          </p>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
              >
                <Image
                  src={image.url}
                  alt={image.alt ?? ""}
                  fill
                  sizes="200px"
                  className="object-contain"
                />
                <div className="absolute top-1.5 right-1.5">
                  <DeleteSiteImageButton imageId={image.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-neutral-500">
            등록된 이미지가 없습니다.
          </p>
        )}

        <div className="mt-4">
          <SiteImageUploadForm type={activeType} />
        </div>
      </Card>
    </div>
  );
}
