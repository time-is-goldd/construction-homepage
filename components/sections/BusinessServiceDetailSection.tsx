import Image from "next/image";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { CONTENT_KEY_DEFS } from "@/lib/content-keys";
import { getCategoryImageMap } from "@/lib/site-images";
import { getMultipleSiteContents } from "@/lib/site-contents";

// slug → content key 매핑 (lib/content-keys.ts 정의와 일치해야 한다)
const SLUG_TO_KEY: Record<string, string> = {
  "new-construction": "business.new_construction",
  remodeling: "business.remodeling",
  circulation: "business.circulation",
  "internal-facility": "business.internal_facility",
};

// 사업분야별 대표 이미지. 관리자(/admin/images > 사업분야 이미지)에서 업로드한
// 이미지가 있으면 그것을 우선 사용하고, 없으면 분야가 명확히 확인된 시공사례
// 사진으로 대체한다("액비탱크/순환시설"/"내부시설"은 아직 시공사례 사진이 없음).
const FALLBACK_IMAGE: Record<string, string> = {
  "new-construction": "/images/works/hwaseong-farm-reconstruction/01.webp",
  remodeling: "/images/works/hoengseong-fire-restoration/01.webp",
  circulation: "/images/business/liquid-manure-system.webp",
  "internal-facility": "/images/business/internal-facility.webp",
};

export default async function BusinessServiceDetailSection() {
  const contentKeys = Object.values(SLUG_TO_KEY);
  const [categoryImages, contents] = await Promise.all([
    getCategoryImageMap(),
    getMultipleSiteContents(contentKeys),
  ]);

  return (
    <Section tone="muted">
      <div className="flex flex-col gap-16">
        {BUSINESS_CATEGORIES.map((category, i) => {
          const image =
            categoryImages[category.slug]?.url ?? FALLBACK_IMAGE[category.slug];
          const contentKey = SLUG_TO_KEY[category.slug];
          const fallbackDesc =
            CONTENT_KEY_DEFS.find((d) => d.key === contentKey)?.fallback ??
            category.description;
          const description = contents[contentKey] || fallbackDesc;

          return (
            <div
              key={category.slug}
              className={`flex flex-col gap-6 md:items-center md:gap-12 ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 md:w-1/2">
                {image ? (
                  <Image
                    src={image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm text-neutral-400">
                      {category.title} 이미지 (확보 예정)
                    </span>
                  </div>
                )}
              </div>
              <div className="md:w-1/2">
                <h3 className="text-[20px] leading-[1.4] font-semibold text-neutral-900 md:text-2xl">
                  {category.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-neutral-600 md:text-base">
                  {description}
                </p>
                <Button
                  href={`/works?category=${category.slug}`}
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                >
                  관련 시공사례 보기 →
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
