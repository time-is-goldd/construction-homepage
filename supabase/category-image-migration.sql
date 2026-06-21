-- ============================================================================
-- 사업분야(category) 대표 이미지 관리자 편집 기능을 위한 마이그레이션
-- 출처: 고객 검수 피드백(2026-06) "9. 고객이 직접 수정 가능한 범위 확인"
--
-- 배경: 사업분야 소개(/business) 페이지의 대표 이미지가 지금까지 코드에
-- 하드코딩되어 있어 관리자 페이지에서 수정할 수 없었다. site_images 테이블에
-- "business_category" 타입과 어느 사업분야(슬러그)에 연결된 이미지인지 저장할
-- category_slug 컬럼을 추가해, /admin/images에서 사업분야별 대표 이미지를
-- 업로드/교체할 수 있게 한다.
--
-- 실행 방법: Supabase 대시보드 > SQL Editor에 전체를 그대로 붙여넣고 Run.
-- 재실행 안전성: 컬럼 추가는 IF NOT EXISTS, CHECK 제약은 먼저 DROP 후 재생성한다.
-- ============================================================================

begin;

alter table site_images add column if not exists category_slug text;

alter table site_images drop constraint if exists site_images_type_check;
alter table site_images add constraint site_images_type_check
  check (type in ('main_visual', 'logo', 'business_license', 'business_category'));

commit;
