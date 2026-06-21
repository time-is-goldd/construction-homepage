-- ============================================================================
-- 시공실적(performance_records) 테이블 마이그레이션
-- 출처: 고객 검수 피드백(2026-06) "7. 시공실적 페이지 신규 추가"
--
-- 목적: /performance(공개) + /admin/performance(관리자 CRUD)에서 쓰는
-- 텍스트 중심 시공실적 목록(연도/업체명/공사명/공사유형). 사진 없음.
--
-- 실행 방법: Supabase 대시보드 > SQL Editor에 전체를 그대로 붙여넣고 Run.
-- 재실행 안전성: CREATE TABLE은 IF NOT EXISTS, POLICY는 DROP POLICY IF EXISTS
-- 후 재생성하므로, 이미 한 번 실행한 뒤 다시 실행해도 에러 없이 끝난다.
-- ============================================================================

begin;

create table if not exists performance_records (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  client_name text not null,
  project_name text not null,
  work_type text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists performance_records_year_idx
  on performance_records(year desc);

alter table performance_records enable row level security;

-- 공개 read(누구나 시공실적 목록을 볼 수 있음), 쓰기는 관리자만.
drop policy if exists "public read performance_records" on performance_records;
create policy "public read performance_records" on performance_records for select
  using (true);

drop policy if exists "admin full access performance_records" on performance_records;
create policy "admin full access performance_records" on performance_records for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

commit;
