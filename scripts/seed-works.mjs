// 일회성 마이그레이션 스크립트: 기존 lib/mock-works.ts(현재는 삭제됨) 데이터를
// 실제 Supabase works/work_images 테이블로 옮긴다. 이미지는 이미 IMAGE_OPTIMIZATION_PLAN.md
// 기준으로 최적화되어 public/images/works/<slug>/NN.webp 에 존재하는 로컬 자산을 그대로
// 가리키며(별도 Storage 업로드는 하지 않음), 향후 고객이 관리자 화면에서 교체하면 그때부터
// Storage(work-images 버킷) URL로 자연스럽게 바뀐다.
//
// 실행: node --env-file=.env.local scripts/seed-works.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

function imgRange(slug, count) {
  return Array.from(
    { length: count },
    (_, i) => `/images/works/${slug}/${String(i + 1).padStart(2, "0")}.webp`,
  );
}

const WORKS = [
  {
    slug: "hoengseong-fire-restoration",
    categorySlug: "remodeling",
    title: "강원도 횡성군 화재 복구공사",
    summary: "화재로 피해를 입은 돈사를 복구한 리모델링 사례입니다.",
    content: [
      "화재 피해를 입은 돈사의 철거부터 단열 보강, 내부시설 재배치까지 종합 리모델링으로 복구한 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    location: "강원도 횡성군",
    imageCount: 4,
  },
  {
    slug: "hwaseong-farm-reconstruction",
    categorySlug: "new-construction",
    title: "경기도 화성시 일괄농장 재축공사",
    summary: "기존 농장을 새로 지은 일괄농장 재축공사 사례입니다.",
    content: [
      "초기 부지 조성부터 완공까지 체계적인 공정 관리로 진행한 일괄농장 재축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    location: "경기도 화성시",
    imageCount: 9,
  },
  {
    slug: "andong-sow-house-reconstruction",
    categorySlug: "new-construction",
    title: "경북 안동 2층 모돈사 재축공사",
    summary: "2층 모돈사를 재축한 신축공사 사례입니다.",
    content: [
      "돼지의 생리적 특성과 사양 단계를 고려한 맞춤 설계로 진행한 2층 모돈사 재축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    location: "경북 안동",
    imageCount: 6,
  },
  {
    slug: "andong-piglet-house-construction",
    categorySlug: "new-construction",
    title: "경북 안동 3층 자돈사 신축공사",
    summary: "3층 자돈사를 새로 지은 신축공사 사례입니다.",
    content: [
      "단열과 내구성을 극대화한 자재로 진행한 3층 자돈사 신축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    location: "경북 안동",
    imageCount: 6,
  },
  {
    slug: "andong-fattening-house-reconstruction",
    categorySlug: "new-construction",
    title: "경북 안동 비육사 재축공사",
    summary: "비육사를 재축한 신축공사 사례입니다.",
    content: [
      "체계적인 공정 관리로 공기를 단축해 진행한 비육사 재축공사 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    location: "경북 안동",
    imageCount: 7,
  },
  {
    slug: "nonghyup-sillim",
    categorySlug: null,
    title: "농협 신림",
    summary: "농협 신림 현장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 농협 신림 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "농협",
    location: "신림",
    imageCount: 3,
  },
  {
    slug: "nonghyup-uiseong",
    categorySlug: null,
    title: "농협 의성",
    summary: "농협 의성 현장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 농협 의성 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "농협",
    location: "의성",
    imageCount: 3,
  },
  {
    slug: "nonghyup-hapcheon",
    categorySlug: null,
    title: "농협 합천",
    summary: "농협 합천 현장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 농협 합천 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "농협",
    location: "합천",
    imageCount: 5,
  },
  {
    slug: "dondonfarm-gokseong",
    categorySlug: null,
    title: "돈돈팜 곡성",
    summary: "돈돈팜 곡성 농장의 시공 사례입니다.",
    content: [
      "돈사 전문 기술진이 직접 시공한 돈돈팜 곡성 농장 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "돈돈팜",
    location: "곡성",
    imageCount: 7,
  },
  {
    slug: "dondonfarm-hoengseong",
    categorySlug: null,
    title: "돈돈팜 횡성",
    summary: "돈돈팜 횡성 농장의 시공 사례입니다.",
    content: [
      "돈사 전문 기술진이 직접 시공한 돈돈팜 횡성 농장 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "돈돈팜",
    location: "횡성",
    imageCount: 4,
  },
  {
    slug: "ihwa-livestock",
    categorySlug: null,
    title: "이화축산",
    summary: "이화축산 농장의 시공 사례입니다.",
    content: [
      "돈사 전문 기술진이 직접 시공한 이화축산 농장 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "이화축산",
    location: null,
    imageCount: 21,
  },
  {
    slug: "ihwa-livestock-fattening-renovation",
    categorySlug: null,
    title: "이화축산 비육사재축",
    summary: "이화축산 비육사(재축) 시공 사례입니다.",
    content: [
      "이화축산 농장의 비육사를 재축한 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: "이화축산",
    location: null,
    imageCount: 57,
  },
  {
    slug: "jindo-hyodon",
    categorySlug: null,
    title: "진도 효돈",
    summary: "진도 효돈 지역 농장의 시공 사례입니다.",
    content: [
      "하도급 없는 직영 시공 시스템으로 진행한 진도 효돈 현장 사례입니다.",
      "정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.",
    ],
    client: null,
    location: "진도 효돈",
    imageCount: 7,
  },
];

async function main() {
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, slug");
  if (catError) throw catError;
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  const { count: existingWorks, error: countError } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true });
  if (countError) throw countError;
  if ((existingWorks ?? 0) > 0) {
    console.log(`works 테이블에 이미 ${existingWorks}건이 있어 시드를 건너뜁니다.`);
    return;
  }

  let workCount = 0;
  let imageCount = 0;

  for (const [index, item] of WORKS.entries()) {
    const categoryId = item.categorySlug
      ? categoryIdBySlug.get(item.categorySlug) ?? null
      : null;

    const { data: work, error: workError } = await supabase
      .from("works")
      .insert({
        category_id: categoryId,
        title: item.title,
        summary: item.summary,
        content: item.content.join("\n"),
        client_name: item.client,
        location: item.location,
        is_published: true,
        sort_order: index,
      })
      .select("id")
      .single();
    if (workError) throw workError;
    workCount++;

    const urls = imgRange(item.slug, item.imageCount);
    const rows = urls.map((url, i) => ({
      work_id: work.id,
      url,
      is_main: i === 0,
      sort_order: i,
    }));
    const { error: imageError } = await supabase.from("work_images").insert(rows);
    if (imageError) throw imageError;
    imageCount += rows.length;

    console.log(`등록: ${item.title} (${rows.length}장)`);
  }

  console.log(`완료: works ${workCount}건, work_images ${imageCount}건`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
