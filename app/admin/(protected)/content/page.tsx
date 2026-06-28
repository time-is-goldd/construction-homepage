import Card from "@/components/ui/Card";
import SiteContentForm from "@/components/admin/SiteContentForm";
import {
  CONTENT_KEY_DEFS,
  groupContentKeysBySection,
} from "@/lib/content-keys";
import { listAllSiteContents } from "@/lib/site-contents";

export default async function AdminContentPage() {
  const saved = await listAllSiteContents();
  // key → SiteContent 맵으로 변환해 O(1) 조회
  const savedMap = Object.fromEntries(saved.map((c) => [c.key, c]));

  const sections = groupContentKeysBySection(CONTENT_KEY_DEFS);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">콘텐츠관리</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          DB에 저장된 값이 우선 표시되고, 비어있으면 기본값이 자동으로 표시됩니다.
          시공사례·시공실적 본문은 각 관리 페이지에서 직접 수정하세요.
        </p>
      </div>

      {sections.map(({ section, items }) => (
        <div key={section} className="flex flex-col gap-4">
          <h2 className="border-b border-neutral-200 pb-2 text-[16px] font-semibold text-neutral-800">
            {section}
          </h2>

          {items.map((def) => {
            const saved = savedMap[def.key];
            const currentValue = saved?.content ?? def.fallback;

            return (
              <Card key={def.key} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-medium text-neutral-900">
                      {def.title}
                    </p>
                    <p className="mt-0.5 text-[11px] font-mono text-neutral-400">
                      {def.key}
                    </p>
                  </div>
                  {!saved && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                      기본값 사용중
                    </span>
                  )}
                </div>
                <SiteContentForm
                  contentKey={def.key}
                  currentValue={currentValue}
                  rows={def.rows}
                  updatedAt={saved?.updatedAt}
                />
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
}
