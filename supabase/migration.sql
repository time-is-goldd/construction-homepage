-- ============================================================================
-- construction-homepage 초기 스키마 마이그레이션
-- 출처: ARCHITECTURE.md §6 (Supabase 구조 - DB 스키마), §6-1 DDL, §6-2 RLS 정책
-- 대상 테이블: categories, works, work_images, site_images, inquiries
--
-- 실행 방법: Supabase 대시보드 > SQL Editor에 전체를 그대로 붙여넣고 Run.
-- 전체가 하나의 트랜잭션으로 실행되므로, 중간에 오류가 나면 전체가 롤백되어
-- 테이블이 일부만 생성되는 상태가 되지 않는다.
--
-- 재실행 안전성: CREATE TABLE/INDEX는 IF NOT EXISTS, POLICY는 DROP POLICY IF
-- EXISTS 후 재생성하므로, 이미 한 번 실행한 뒤 다시 실행해도 에러 없이 끝난다.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 0. 확장(extension) — gen_random_uuid() 사용을 위해 필요
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. CREATE TABLE
-- ----------------------------------------------------------------------------

-- 1-1. categories: 사업분야 카테고리(신축/리모델링/순환시설/환기)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 1-2. works: 시공사례
create table if not exists works (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  title text not null,
  summary text,
  content text,
  client_name text,
  is_client_hidden boolean not null default false,
  scale text,
  period text,
  location text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 1-3. work_images: 시공사례 갤러리 이미지
create table if not exists work_images (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references works(id) on delete cascade,
  url text not null,
  alt text,
  is_main boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 1-4. site_images: 메인비주얼/로고/사업자등록증
create table if not exists site_images (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('main_visual', 'logo', 'business_license')),
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 1-5. inquiries: 문의 (Phase 5에서 사용, 스키마는 이번에 함께 생성)
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  type text not null check (type in ('quote', 'partnership', 'as', 'etc')),
  title text,
  message text not null,
  attachment_url text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  admin_memo text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. INDEX
-- ----------------------------------------------------------------------------
create index if not exists works_category_idx on works(category_id);
create index if not exists works_published_idx on works(is_published);
create index if not exists work_images_work_idx on work_images(work_id);
create index if not exists inquiries_status_idx on inquiries(status);
create index if not exists inquiries_created_idx on inquiries(created_at desc);

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY 활성화
-- ----------------------------------------------------------------------------
alter table categories enable row level security;
alter table works enable row level security;
alter table work_images enable row level security;
alter table site_images enable row level security;
alter table inquiries enable row level security;

-- ----------------------------------------------------------------------------
-- 4. POLICY
-- 기존 동일 이름 정책이 있으면 먼저 제거하고 재생성한다(재실행 안전성).
-- ----------------------------------------------------------------------------

-- 4-1. categories: 전체 공개 read, 쓰기는 관리자만
drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select
  using (true);

drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4-2. works: 게시된 것만 공개 read, 관리자는 전체 read/write
drop policy if exists "public read published works" on works;
create policy "public read published works" on works for select
  using (is_published = true);

drop policy if exists "admin full access works" on works;
create policy "admin full access works" on works for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4-3. work_images: 공개 read, 관리자 write
drop policy if exists "public read work_images" on work_images;
create policy "public read work_images" on work_images for select
  using (true);

drop policy if exists "admin write work_images" on work_images;
create policy "admin write work_images" on work_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4-4. site_images: 공개 read(메인비주얼/로고 노출), 관리자 write
drop policy if exists "public read site_images" on site_images;
create policy "public read site_images" on site_images for select
  using (true);

drop policy if exists "admin write site_images" on site_images;
create policy "admin write site_images" on site_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4-5. inquiries: insert 정책 없음(service role만 우회 가능) → 클라이언트 직접 insert 불가
drop policy if exists "admin read inquiries" on inquiries;
create policy "admin read inquiries" on inquiries for select
  using (auth.role() = 'authenticated');

drop policy if exists "admin update inquiries" on inquiries;
create policy "admin update inquiries" on inquiries for update
  using (auth.role() = 'authenticated');

commit;
