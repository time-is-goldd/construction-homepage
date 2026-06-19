// 일회성 마이그레이션 스크립트: 기존 로컬 메인비주얼/로고 자산을 site_images
// 테이블에 등록해, 관리자 이미지관리 화면(/admin/images)에서 바로 보이고
// 교체할 수 있게 한다. 실행: node --env-file=.env.local scripts/seed-site-images.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const SEED_ROWS = [
  { type: "main_visual", url: "/images/hero/hero-aerial-01.png", sort_order: 0 },
  { type: "logo", url: "/images/logo/logo-full.png", sort_order: 0 },
];

async function main() {
  for (const row of SEED_ROWS) {
    const { count } = await supabase
      .from("site_images")
      .select("*", { count: "exact", head: true })
      .eq("type", row.type);
    if ((count ?? 0) > 0) {
      console.log(`${row.type}: 이미 ${count}건 있어 건너뜁니다.`);
      continue;
    }
    const { error } = await supabase.from("site_images").insert(row);
    if (error) throw error;
    console.log(`등록: ${row.type} -> ${row.url}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
