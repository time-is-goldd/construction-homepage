-- ============================================================================
-- construction-homepage Storage 버킷 + 정책
-- 출처: ARCHITECTURE.md §7 (Storage 구조), §7-1 버킷 구성, §7-2 Storage 정책(SQL)
--
-- 선행 조건: supabase/migration.sql 을 먼저 실행해 테이블/RLS가 준비되어 있어야 한다
-- (이 파일 자체는 테이블에 의존하지 않지만, Phase4 작업 순서상 마이그레이션 다음에 둔다).
--
-- 실행 방법: Supabase 대시보드 > SQL Editor에 전체를 그대로 붙여넣고 Run.
-- 재실행 안전성: 버킷은 INSERT ... ON CONFLICT DO NOTHING, 정책은 DROP POLICY IF
-- EXISTS 후 재생성하므로 다시 실행해도 에러 없이 끝난다.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. 버킷 생성
-- ----------------------------------------------------------------------------
-- site-images / work-images: 공개 콘텐츠 → public bucket (URL로 바로 접근 가능)
--   업로드 포맷 제한(jpg/png/webp) + 5MB 용량 제한을 버킷 레벨에서도 강제한다
--   (DEVELOPMENT_PLAN.md Phase4 완료조건: "5MB 초과 또는 비허용 포맷 업로드 시 에러").
-- inquiry-attachments: 개인정보 포함 가능 → private bucket, service role로만 업로드.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-images', 'site-images', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp']),
  ('work-images', 'work-images', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp']),
  ('inquiry-attachments', 'inquiry-attachments', false, null, null)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Storage 정책 (storage.objects)
-- storage.objects는 Supabase 기본 설정상 이미 RLS가 활성화되어 있다.
-- ----------------------------------------------------------------------------

-- 2-1. site-images: 공개 read, 관리자만 쓰기
drop policy if exists "public read site-images" on storage.objects;
create policy "public read site-images" on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "admin write site-images" on storage.objects;
create policy "admin write site-images" on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

drop policy if exists "admin update site-images" on storage.objects;
create policy "admin update site-images" on storage.objects for update
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

drop policy if exists "admin delete site-images" on storage.objects;
create policy "admin delete site-images" on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

-- 2-2. work-images: 동일 패턴
drop policy if exists "public read work-images" on storage.objects;
create policy "public read work-images" on storage.objects for select
  using (bucket_id = 'work-images');

drop policy if exists "admin write work-images" on storage.objects;
create policy "admin write work-images" on storage.objects for insert
  with check (bucket_id = 'work-images' and auth.role() = 'authenticated');

drop policy if exists "admin update work-images" on storage.objects;
create policy "admin update work-images" on storage.objects for update
  using (bucket_id = 'work-images' and auth.role() = 'authenticated');

drop policy if exists "admin delete work-images" on storage.objects;
create policy "admin delete work-images" on storage.objects for delete
  using (bucket_id = 'work-images' and auth.role() = 'authenticated');

-- 2-3. inquiry-attachments: insert 정책 없음(service role만 우회 가능),
--      조회는 관리자만(Signed URL 발급 전제, ARCHITECTURE.md §7-1)
drop policy if exists "admin read inquiry-attachments" on storage.objects;
create policy "admin read inquiry-attachments" on storage.objects for select
  using (bucket_id = 'inquiry-attachments' and auth.role() = 'authenticated');

commit;
