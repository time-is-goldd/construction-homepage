-- ============================================================================
-- 기업 파트너십(partners) 테이블 마이그레이션
-- 출처: 고객 피드백 "기업 파트너십" 리브랜딩
--
-- /performance 페이지 상단 "기업 파트너십 성과" 섹션을 하드코딩에서
-- DB 기반으로 전환. 관리자 /admin/performance 에서 CRUD.
--
-- 실행 방법: Supabase 대시보드 > SQL Editor에 전체 붙여넣고 Run.
-- 재실행 안전성: IF NOT EXISTS / DROP ... IF EXISTS 사용.
-- ============================================================================

begin;

create table if not exists partners (
  id          uuid        primary key default gen_random_uuid(),
  company_name text       not null,
  label        text,                        -- 표시 이름 (예: "돈돈팜 주식회사")
  start_year   int        not null,
  end_year     int,                         -- null = 현재 진행 중
  description  text,
  achievements jsonb      not null default '[]'::jsonb,
  logo_url     text,
  sort_order   int        not null default 0,
  is_published boolean    not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists partners_sort_order_idx on partners(sort_order asc);

alter table partners enable row level security;

drop policy if exists "public read partners"        on partners;
create policy "public read partners" on partners for select
  using (is_published = true);

drop policy if exists "admin full access partners"  on partners;
create policy "admin full access partners" on partners for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 기존 하드코딩 파트너 3개 → 초기 적재 (테이블에 행이 없을 때만)
insert into partners
  (company_name, label, start_year, end_year, achievements, logo_url, sort_order, is_published)
select
  v.company_name, v.label, v.start_year::int, v.end_year::int,
  v.achievements::jsonb, v.logo_url, v.sort_order::int, true
from (values
  ('돈돈팜',        '돈돈팜 주식회사', '2007', null,
   '["전국 7개 농장 돈사 신축 및 리모델링 공사","지속적인 시설물 유지보수 및 기자재 공급 파트너"]',
   '/images/performance/dondonfarm-logo.webp', '1'),
  ('농협종돈사업소', '농협종돈사업소',  '2004', null,
   '["전국 5개 농장 지속적 시설물 보수 및 증축·재축","주기적인 돈사 보수 및 기자재 공급·시공"]',
   '/images/performance/nh-breeding-logo.webp', '2'),
  ('선진한마을',     '선진한마을',      '2025', null,
   '["자사 및 계열 농가 돈사 신축·증축 공사 수행","기업형 양돈 농가 동물복지 개선 공사 참여"]',
   '/images/performance/sunjin-logo.webp', '3')
) as v(company_name, label, start_year, end_year, achievements, logo_url, sort_order)
where not exists (select 1 from partners limit 1);

commit;
