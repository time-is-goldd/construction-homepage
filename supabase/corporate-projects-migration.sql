-- ============================================================================
-- corporate_projects 테이블 마이그레이션
-- 관리자 /admin/performance 하단 "전체 시공 실적 / 사례" 섹션 전용.
-- 이미지 1장 + 기업명(title) + 간단 설명(summary)을 관리.
--
-- 실행 방법: Supabase > SQL Editor 에 붙여넣고 Run.
-- ============================================================================

begin;

create table if not exists corporate_projects (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  image_url   text,
  summary     text,
  sort_order  int         not null default 0,
  is_published boolean    not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists corporate_projects_sort_idx
  on corporate_projects(sort_order asc);

alter table corporate_projects enable row level security;

drop policy if exists "public read corporate_projects" on corporate_projects;
create policy "public read corporate_projects" on corporate_projects for select
  using (is_published = true);

drop policy if exists "admin full access corporate_projects" on corporate_projects;
create policy "admin full access corporate_projects" on corporate_projects for all
  using  (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

commit;
