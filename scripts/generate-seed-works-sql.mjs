// scripts/seed-works.mjs와 동일한 데이터를 supabase/seed-works.sql(순수 SQL)로
// 내보낸다. 데이터는 이미 scripts/seed-works.mjs로 실제 Supabase에 1회 적용되어
// 있으며, 이 SQL은 재현/검토/DB 재구축용 기록이다.
import { writeFileSync } from "node:fs";

function imgRange(slug, count) {
  return Array.from(
    { length: count },
    (_, i) => `/images/works/${slug}/${String(i + 1).padStart(2, "0")}.webp`,
  );
}

const WORKS = [
  { slug: "hoengseong-fire-restoration", categorySlug: "remodeling", title: "강원도 횡성군 화재 복구공사", summary: "화재로 피해를 입은 돈사를 복구한 리모델링 사례입니다.", content: ["화재 피해를 입은 돈사의 철거부터 단열 보강, 내부시설 재배치까지 종합 리모델링으로 복구한 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: null, location: "강원도 횡성군", imageCount: 4 },
  { slug: "hwaseong-farm-reconstruction", categorySlug: "new-construction", title: "경기도 화성시 일괄농장 재축공사", summary: "기존 농장을 새로 지은 일괄농장 재축공사 사례입니다.", content: ["초기 부지 조성부터 완공까지 체계적인 공정 관리로 진행한 일괄농장 재축공사 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: null, location: "경기도 화성시", imageCount: 9 },
  { slug: "andong-sow-house-reconstruction", categorySlug: "new-construction", title: "경북 안동 2층 모돈사 재축공사", summary: "2층 모돈사를 재축한 신축공사 사례입니다.", content: ["돼지의 생리적 특성과 사양 단계를 고려한 맞춤 설계로 진행한 2층 모돈사 재축공사 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: null, location: "경북 안동", imageCount: 6 },
  { slug: "andong-piglet-house-construction", categorySlug: "new-construction", title: "경북 안동 3층 자돈사 신축공사", summary: "3층 자돈사를 새로 지은 신축공사 사례입니다.", content: ["단열과 내구성을 극대화한 자재로 진행한 3층 자돈사 신축공사 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: null, location: "경북 안동", imageCount: 6 },
  { slug: "andong-fattening-house-reconstruction", categorySlug: "new-construction", title: "경북 안동 비육사 재축공사", summary: "비육사를 재축한 신축공사 사례입니다.", content: ["체계적인 공정 관리로 공기를 단축해 진행한 비육사 재축공사 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: null, location: "경북 안동", imageCount: 7 },
  { slug: "nonghyup-sillim", categorySlug: null, title: "농협 신림", summary: "농협 신림 현장의 시공 사례입니다.", content: ["하도급 없는 직영 시공 시스템으로 진행한 농협 신림 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: "농협", location: "신림", imageCount: 3 },
  { slug: "nonghyup-uiseong", categorySlug: null, title: "농협 의성", summary: "농협 의성 현장의 시공 사례입니다.", content: ["하도급 없는 직영 시공 시스템으로 진행한 농협 의성 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: "농협", location: "의성", imageCount: 3 },
  { slug: "nonghyup-hapcheon", categorySlug: null, title: "농협 합천", summary: "농협 합천 현장의 시공 사례입니다.", content: ["하도급 없는 직영 시공 시스템으로 진행한 농협 합천 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: "농협", location: "합천", imageCount: 5 },
  { slug: "dondonfarm-gokseong", categorySlug: null, title: "돈돈팜 곡성", summary: "돈돈팜 곡성 농장의 시공 사례입니다.", content: ["돈사 전문 기술진이 직접 시공한 돈돈팜 곡성 농장 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: "돈돈팜", location: "곡성", imageCount: 7 },
  { slug: "dondonfarm-hoengseong", categorySlug: null, title: "돈돈팜 횡성", summary: "돈돈팜 횡성 농장의 시공 사례입니다.", content: ["돈사 전문 기술진이 직접 시공한 돈돈팜 횡성 농장 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: "돈돈팜", location: "횡성", imageCount: 4 },
  { slug: "ihwa-livestock", categorySlug: null, title: "이화축산", summary: "이화축산 농장의 시공 사례입니다.", content: ["돈사 전문 기술진이 직접 시공한 이화축산 농장 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: "이화축산", location: null, imageCount: 21 },
  { slug: "ihwa-livestock-fattening-renovation", categorySlug: null, title: "이화축산 비육사재축", summary: "이화축산 비육사(재축) 시공 사례입니다.", content: ["이화축산 농장의 비육사를 재축한 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: "이화축산", location: null, imageCount: 57 },
  { slug: "jindo-hyodon", categorySlug: null, title: "진도 효돈", summary: "진도 효돈 지역 농장의 시공 사례입니다.", content: ["하도급 없는 직영 시공 시스템으로 진행한 진도 효돈 현장 사례입니다.", "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다."], client: null, location: "진도 효돈", imageCount: 7 },
];

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function categoryIdExpr(categorySlug) {
  if (!categorySlug) return "null";
  return `(select id from categories where slug = ${sqlString(categorySlug)})`;
}

const lines = [];
lines.push("-- ============================================================================");
lines.push("-- construction-homepage 초기 시공사례 시드 데이터");
lines.push("-- 출처: IMAGE_MAPPING.md (customer-assets/시공사례 정리 결과, 13건/139장) +");
lines.push("-- IMAGE_OPTIMIZATION_PLAN.md(긴 변 1600px, WebP q80 변환 완료) 적용 후 경로.");
lines.push("--");
lines.push("-- 선행 조건: supabase/migration.sql + supabase/seed.sql(categories) 실행 완료.");
lines.push("-- 이미지 URL은 Storage가 아니라 public/images/works/<slug>/NN.webp 로컬 자산을");
lines.push("-- 그대로 가리킨다 — 향후 관리자가 /admin/works에서 교체하면 그 시점부터");
lines.push("-- work-images Storage 버킷 URL로 자연스럽게 바뀐다.");
lines.push("--");
lines.push("-- 재실행 안전성: works 테이블에 이미 행이 있으면 전체를 건너뛴다(중복 삽입 방지).");
lines.push("-- ============================================================================");
lines.push("");
lines.push("do $$");
lines.push("begin");
lines.push("  if exists (select 1 from works limit 1) then");
lines.push("    raise notice 'works 테이블에 이미 데이터가 있어 시드를 건너뜁니다.';");
lines.push("    return;");
lines.push("  end if;");
lines.push("");

WORKS.forEach((item, index) => {
  const urls = imgRange(item.slug, item.imageCount);
  // 실제 줄바꿈 문자를 그대로 SQL 문자열 리터럴에 포함시킨다(표준 SQL에서 단일
  // 인용 문자열은 여러 줄에 걸칠 수 있음) — work.content를 "\n" 기준으로 split
  // 해서 문단을 표시하는 app/(public)/works/[id]/page.tsx 동작과 일치시킨다.
  const contentText = item.content.join("\n");

  lines.push(`  -- ${index + 1}. ${item.title}`);
  lines.push("  with new_work as (");
  lines.push("    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)");
  lines.push(`    values (${categoryIdExpr(item.categorySlug)}, ${sqlString(item.title)}, ${sqlString(item.summary)}, ${sqlString(contentText)}, ${sqlString(item.client)}, ${sqlString(item.location)}, true, ${index})`);
  lines.push("    returning id");
  lines.push("  )");
  lines.push("  insert into work_images (work_id, url, is_main, sort_order)");
  lines.push("  select new_work.id, v.url, v.is_main, v.sort_order");
  lines.push("  from new_work, (values");
  urls.forEach((url, i) => {
    const isLast = i === urls.length - 1;
    lines.push(`    (${sqlString(url)}, ${i === 0 ? "true" : "false"}, ${i})${isLast ? "" : ","}`);
  });
  lines.push("  ) as v(url, is_main, sort_order);");
  lines.push("");
});

lines.push("end $$;");
lines.push("");

writeFileSync("supabase/seed-works.sql", lines.join("\n"));
console.log(`작성 완료: supabase/seed-works.sql (${WORKS.length}건, 이미지 ${WORKS.reduce((a, w) => a + w.imageCount, 0)}장)`);
