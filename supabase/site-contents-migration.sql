-- ============================================================================
-- site_contents 테이블 마이그레이션 (Phase 4.5 간단 텍스트 관리)
-- 대상: key-value 형태의 편집 가능한 사이트 텍스트
-- 실행: Supabase 대시보드 > SQL Editor에 전체를 붙여넣고 Run
-- ============================================================================

begin;

-- 1. 테이블 생성
create table if not exists site_contents (
  key        text primary key,
  title      text not null,          -- 관리자 화면에 표시할 항목 이름
  content    text not null default '',
  updated_at timestamptz not null default now()
);

-- 2. RLS 활성화
alter table site_contents enable row level security;

-- 3. 정책 (재실행 안전)
drop policy if exists "public read site_contents" on site_contents;
create policy "public read site_contents" on site_contents for select
  using (true);

drop policy if exists "admin write site_contents" on site_contents;
create policy "admin write site_contents" on site_contents for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4. updated_at 자동 갱신 트리거
create or replace function update_site_contents_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_contents_updated_at on site_contents;
create trigger site_contents_updated_at
  before update on site_contents
  for each row execute procedure update_site_contents_updated_at();

commit;
