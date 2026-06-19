-- ============================================================================
-- construction-homepage 초기 시드 데이터
-- 출처: lib/constants.ts BUSINESS_CATEGORIES (customer-assets/문구.txt "3. 사업분야" 기준,
-- 홈/사업분야 페이지와 시공사례 카테고리 필터가 공유하는 단일 출처)
--
-- 선행 조건: supabase/migration.sql 실행 완료(categories 테이블 존재) 후 실행.
--
-- 실행 방법: Supabase 대시보드 > SQL Editor에 전체를 그대로 붙여넣고 Run.
-- 재실행 안전성: slug가 충돌하면 name/sort_order만 갱신하므로 다시 실행해도
-- 중복 행이 생기지 않는다.
-- ============================================================================

begin;

insert into categories (name, slug, sort_order)
values
  ('돈사 신축 공사', 'new-construction', 0),
  ('돈사 리모델링 공사', 'remodeling', 1),
  ('순환시설 공사', 'circulation', 2),
  ('환기공사', 'ventilation', 3)
on conflict (slug) do update
  set name = excluded.name,
      sort_order = excluded.sort_order;

commit;
