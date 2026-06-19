-- ============================================================================
-- construction-homepage 초기 시공사례 시드 데이터
-- 출처: IMAGE_MAPPING.md (customer-assets/시공사례 정리 결과, 13건/139장) +
-- IMAGE_OPTIMIZATION_PLAN.md(긴 변 1600px, WebP q80 변환 완료) 적용 후 경로.
--
-- 선행 조건: supabase/migration.sql + supabase/seed.sql(categories) 실행 완료.
-- 이미지 URL은 Storage가 아니라 public/images/works/<slug>/NN.webp 로컬 자산을
-- 그대로 가리킨다 — 향후 관리자가 /admin/works에서 교체하면 그 시점부터
-- work-images Storage 버킷 URL로 자연스럽게 바뀐다.
--
-- 재실행 안전성: works 테이블에 이미 행이 있으면 전체를 건너뛴다(중복 삽입 방지).
-- ============================================================================

do $$
begin
  if exists (select 1 from works limit 1) then
    raise notice 'works 테이블에 이미 데이터가 있어 시드를 건너뜁니다.';
    return;
  end if;

  -- 1. 강원도 횡성군 화재 복구공사
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values ((select id from categories where slug = 'remodeling'), '강원도 횡성군 화재 복구공사', '화재로 피해를 입은 돈사를 복구한 리모델링 사례입니다.', '화재 피해를 입은 돈사의 철거부터 단열 보강, 내부시설 재배치까지 종합 리모델링으로 복구한 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', null, '강원도 횡성군', true, 0)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/hoengseong-fire-restoration/01.webp', true, 0),
    ('/images/works/hoengseong-fire-restoration/02.webp', false, 1),
    ('/images/works/hoengseong-fire-restoration/03.webp', false, 2),
    ('/images/works/hoengseong-fire-restoration/04.webp', false, 3)
  ) as v(url, is_main, sort_order);

  -- 2. 경기도 화성시 일괄농장 재축공사
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values ((select id from categories where slug = 'new-construction'), '경기도 화성시 일괄농장 재축공사', '기존 농장을 새로 지은 일괄농장 재축공사 사례입니다.', '초기 부지 조성부터 완공까지 체계적인 공정 관리로 진행한 일괄농장 재축공사 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', null, '경기도 화성시', true, 1)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/hwaseong-farm-reconstruction/01.webp', true, 0),
    ('/images/works/hwaseong-farm-reconstruction/02.webp', false, 1),
    ('/images/works/hwaseong-farm-reconstruction/03.webp', false, 2),
    ('/images/works/hwaseong-farm-reconstruction/04.webp', false, 3),
    ('/images/works/hwaseong-farm-reconstruction/05.webp', false, 4),
    ('/images/works/hwaseong-farm-reconstruction/06.webp', false, 5),
    ('/images/works/hwaseong-farm-reconstruction/07.webp', false, 6),
    ('/images/works/hwaseong-farm-reconstruction/08.webp', false, 7),
    ('/images/works/hwaseong-farm-reconstruction/09.webp', false, 8)
  ) as v(url, is_main, sort_order);

  -- 3. 경북 안동 2층 모돈사 재축공사
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values ((select id from categories where slug = 'new-construction'), '경북 안동 2층 모돈사 재축공사', '2층 모돈사를 재축한 신축공사 사례입니다.', '돼지의 생리적 특성과 사양 단계를 고려한 맞춤 설계로 진행한 2층 모돈사 재축공사 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', null, '경북 안동', true, 2)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/andong-sow-house-reconstruction/01.webp', true, 0),
    ('/images/works/andong-sow-house-reconstruction/02.webp', false, 1),
    ('/images/works/andong-sow-house-reconstruction/03.webp', false, 2),
    ('/images/works/andong-sow-house-reconstruction/04.webp', false, 3),
    ('/images/works/andong-sow-house-reconstruction/05.webp', false, 4),
    ('/images/works/andong-sow-house-reconstruction/06.webp', false, 5)
  ) as v(url, is_main, sort_order);

  -- 4. 경북 안동 3층 자돈사 신축공사
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values ((select id from categories where slug = 'new-construction'), '경북 안동 3층 자돈사 신축공사', '3층 자돈사를 새로 지은 신축공사 사례입니다.', '단열과 내구성을 극대화한 자재로 진행한 3층 자돈사 신축공사 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', null, '경북 안동', true, 3)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/andong-piglet-house-construction/01.webp', true, 0),
    ('/images/works/andong-piglet-house-construction/02.webp', false, 1),
    ('/images/works/andong-piglet-house-construction/03.webp', false, 2),
    ('/images/works/andong-piglet-house-construction/04.webp', false, 3),
    ('/images/works/andong-piglet-house-construction/05.webp', false, 4),
    ('/images/works/andong-piglet-house-construction/06.webp', false, 5)
  ) as v(url, is_main, sort_order);

  -- 5. 경북 안동 비육사 재축공사
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values ((select id from categories where slug = 'new-construction'), '경북 안동 비육사 재축공사', '비육사를 재축한 신축공사 사례입니다.', '체계적인 공정 관리로 공기를 단축해 진행한 비육사 재축공사 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', null, '경북 안동', true, 4)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/andong-fattening-house-reconstruction/01.webp', true, 0),
    ('/images/works/andong-fattening-house-reconstruction/02.webp', false, 1),
    ('/images/works/andong-fattening-house-reconstruction/03.webp', false, 2),
    ('/images/works/andong-fattening-house-reconstruction/04.webp', false, 3),
    ('/images/works/andong-fattening-house-reconstruction/05.webp', false, 4),
    ('/images/works/andong-fattening-house-reconstruction/06.webp', false, 5),
    ('/images/works/andong-fattening-house-reconstruction/07.webp', false, 6)
  ) as v(url, is_main, sort_order);

  -- 6. 농협 신림
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '농협 신림', '농협 신림 현장의 시공 사례입니다.', '하도급 없는 직영 시공 시스템으로 진행한 농협 신림 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', '농협', '신림', true, 5)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/nonghyup-sillim/01.webp', true, 0),
    ('/images/works/nonghyup-sillim/02.webp', false, 1),
    ('/images/works/nonghyup-sillim/03.webp', false, 2)
  ) as v(url, is_main, sort_order);

  -- 7. 농협 의성
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '농협 의성', '농협 의성 현장의 시공 사례입니다.', '하도급 없는 직영 시공 시스템으로 진행한 농협 의성 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', '농협', '의성', true, 6)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/nonghyup-uiseong/01.webp', true, 0),
    ('/images/works/nonghyup-uiseong/02.webp', false, 1),
    ('/images/works/nonghyup-uiseong/03.webp', false, 2)
  ) as v(url, is_main, sort_order);

  -- 8. 농협 합천
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '농협 합천', '농협 합천 현장의 시공 사례입니다.', '하도급 없는 직영 시공 시스템으로 진행한 농협 합천 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', '농협', '합천', true, 7)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/nonghyup-hapcheon/01.webp', true, 0),
    ('/images/works/nonghyup-hapcheon/02.webp', false, 1),
    ('/images/works/nonghyup-hapcheon/03.webp', false, 2),
    ('/images/works/nonghyup-hapcheon/04.webp', false, 3),
    ('/images/works/nonghyup-hapcheon/05.webp', false, 4)
  ) as v(url, is_main, sort_order);

  -- 9. 돈돈팜 곡성
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '돈돈팜 곡성', '돈돈팜 곡성 농장의 시공 사례입니다.', '돈사 전문 기술진이 직접 시공한 돈돈팜 곡성 농장 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', '돈돈팜', '곡성', true, 8)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/dondonfarm-gokseong/01.webp', true, 0),
    ('/images/works/dondonfarm-gokseong/02.webp', false, 1),
    ('/images/works/dondonfarm-gokseong/03.webp', false, 2),
    ('/images/works/dondonfarm-gokseong/04.webp', false, 3),
    ('/images/works/dondonfarm-gokseong/05.webp', false, 4),
    ('/images/works/dondonfarm-gokseong/06.webp', false, 5),
    ('/images/works/dondonfarm-gokseong/07.webp', false, 6)
  ) as v(url, is_main, sort_order);

  -- 10. 돈돈팜 횡성
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '돈돈팜 횡성', '돈돈팜 횡성 농장의 시공 사례입니다.', '돈사 전문 기술진이 직접 시공한 돈돈팜 횡성 농장 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', '돈돈팜', '횡성', true, 9)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/dondonfarm-hoengseong/01.webp', true, 0),
    ('/images/works/dondonfarm-hoengseong/02.webp', false, 1),
    ('/images/works/dondonfarm-hoengseong/03.webp', false, 2),
    ('/images/works/dondonfarm-hoengseong/04.webp', false, 3)
  ) as v(url, is_main, sort_order);

  -- 11. 이화축산
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '이화축산', '이화축산 농장의 시공 사례입니다.', '돈사 전문 기술진이 직접 시공한 이화축산 농장 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', '이화축산', null, true, 10)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/ihwa-livestock/01.webp', true, 0),
    ('/images/works/ihwa-livestock/02.webp', false, 1),
    ('/images/works/ihwa-livestock/03.webp', false, 2),
    ('/images/works/ihwa-livestock/04.webp', false, 3),
    ('/images/works/ihwa-livestock/05.webp', false, 4),
    ('/images/works/ihwa-livestock/06.webp', false, 5),
    ('/images/works/ihwa-livestock/07.webp', false, 6),
    ('/images/works/ihwa-livestock/08.webp', false, 7),
    ('/images/works/ihwa-livestock/09.webp', false, 8),
    ('/images/works/ihwa-livestock/10.webp', false, 9),
    ('/images/works/ihwa-livestock/11.webp', false, 10),
    ('/images/works/ihwa-livestock/12.webp', false, 11),
    ('/images/works/ihwa-livestock/13.webp', false, 12),
    ('/images/works/ihwa-livestock/14.webp', false, 13),
    ('/images/works/ihwa-livestock/15.webp', false, 14),
    ('/images/works/ihwa-livestock/16.webp', false, 15),
    ('/images/works/ihwa-livestock/17.webp', false, 16),
    ('/images/works/ihwa-livestock/18.webp', false, 17),
    ('/images/works/ihwa-livestock/19.webp', false, 18),
    ('/images/works/ihwa-livestock/20.webp', false, 19),
    ('/images/works/ihwa-livestock/21.webp', false, 20)
  ) as v(url, is_main, sort_order);

  -- 12. 이화축산 비육사재축
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '이화축산 비육사재축', '이화축산 비육사(재축) 시공 사례입니다.', '이화축산 농장의 비육사를 재축한 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', '이화축산', null, true, 11)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/ihwa-livestock-fattening-renovation/01.webp', true, 0),
    ('/images/works/ihwa-livestock-fattening-renovation/02.webp', false, 1),
    ('/images/works/ihwa-livestock-fattening-renovation/03.webp', false, 2),
    ('/images/works/ihwa-livestock-fattening-renovation/04.webp', false, 3),
    ('/images/works/ihwa-livestock-fattening-renovation/05.webp', false, 4),
    ('/images/works/ihwa-livestock-fattening-renovation/06.webp', false, 5),
    ('/images/works/ihwa-livestock-fattening-renovation/07.webp', false, 6),
    ('/images/works/ihwa-livestock-fattening-renovation/08.webp', false, 7),
    ('/images/works/ihwa-livestock-fattening-renovation/09.webp', false, 8),
    ('/images/works/ihwa-livestock-fattening-renovation/10.webp', false, 9),
    ('/images/works/ihwa-livestock-fattening-renovation/11.webp', false, 10),
    ('/images/works/ihwa-livestock-fattening-renovation/12.webp', false, 11),
    ('/images/works/ihwa-livestock-fattening-renovation/13.webp', false, 12),
    ('/images/works/ihwa-livestock-fattening-renovation/14.webp', false, 13),
    ('/images/works/ihwa-livestock-fattening-renovation/15.webp', false, 14),
    ('/images/works/ihwa-livestock-fattening-renovation/16.webp', false, 15),
    ('/images/works/ihwa-livestock-fattening-renovation/17.webp', false, 16),
    ('/images/works/ihwa-livestock-fattening-renovation/18.webp', false, 17),
    ('/images/works/ihwa-livestock-fattening-renovation/19.webp', false, 18),
    ('/images/works/ihwa-livestock-fattening-renovation/20.webp', false, 19),
    ('/images/works/ihwa-livestock-fattening-renovation/21.webp', false, 20),
    ('/images/works/ihwa-livestock-fattening-renovation/22.webp', false, 21),
    ('/images/works/ihwa-livestock-fattening-renovation/23.webp', false, 22),
    ('/images/works/ihwa-livestock-fattening-renovation/24.webp', false, 23),
    ('/images/works/ihwa-livestock-fattening-renovation/25.webp', false, 24),
    ('/images/works/ihwa-livestock-fattening-renovation/26.webp', false, 25),
    ('/images/works/ihwa-livestock-fattening-renovation/27.webp', false, 26),
    ('/images/works/ihwa-livestock-fattening-renovation/28.webp', false, 27),
    ('/images/works/ihwa-livestock-fattening-renovation/29.webp', false, 28),
    ('/images/works/ihwa-livestock-fattening-renovation/30.webp', false, 29),
    ('/images/works/ihwa-livestock-fattening-renovation/31.webp', false, 30),
    ('/images/works/ihwa-livestock-fattening-renovation/32.webp', false, 31),
    ('/images/works/ihwa-livestock-fattening-renovation/33.webp', false, 32),
    ('/images/works/ihwa-livestock-fattening-renovation/34.webp', false, 33),
    ('/images/works/ihwa-livestock-fattening-renovation/35.webp', false, 34),
    ('/images/works/ihwa-livestock-fattening-renovation/36.webp', false, 35),
    ('/images/works/ihwa-livestock-fattening-renovation/37.webp', false, 36),
    ('/images/works/ihwa-livestock-fattening-renovation/38.webp', false, 37),
    ('/images/works/ihwa-livestock-fattening-renovation/39.webp', false, 38),
    ('/images/works/ihwa-livestock-fattening-renovation/40.webp', false, 39),
    ('/images/works/ihwa-livestock-fattening-renovation/41.webp', false, 40),
    ('/images/works/ihwa-livestock-fattening-renovation/42.webp', false, 41),
    ('/images/works/ihwa-livestock-fattening-renovation/43.webp', false, 42),
    ('/images/works/ihwa-livestock-fattening-renovation/44.webp', false, 43),
    ('/images/works/ihwa-livestock-fattening-renovation/45.webp', false, 44),
    ('/images/works/ihwa-livestock-fattening-renovation/46.webp', false, 45),
    ('/images/works/ihwa-livestock-fattening-renovation/47.webp', false, 46),
    ('/images/works/ihwa-livestock-fattening-renovation/48.webp', false, 47),
    ('/images/works/ihwa-livestock-fattening-renovation/49.webp', false, 48),
    ('/images/works/ihwa-livestock-fattening-renovation/50.webp', false, 49),
    ('/images/works/ihwa-livestock-fattening-renovation/51.webp', false, 50),
    ('/images/works/ihwa-livestock-fattening-renovation/52.webp', false, 51),
    ('/images/works/ihwa-livestock-fattening-renovation/53.webp', false, 52),
    ('/images/works/ihwa-livestock-fattening-renovation/54.webp', false, 53),
    ('/images/works/ihwa-livestock-fattening-renovation/55.webp', false, 54),
    ('/images/works/ihwa-livestock-fattening-renovation/56.webp', false, 55),
    ('/images/works/ihwa-livestock-fattening-renovation/57.webp', false, 56)
  ) as v(url, is_main, sort_order);

  -- 13. 진도 효돈
  with new_work as (
    insert into works (category_id, title, summary, content, client_name, location, is_published, sort_order)
    values (null, '진도 효돈', '진도 효돈 지역 농장의 시공 사례입니다.', '하도급 없는 직영 시공 시스템으로 진행한 진도 효돈 현장 사례입니다.
정확한 규모·공사기간 등 세부 정보는 확인 중이며, 자세한 내용은 문의 시 안내드립니다.', null, '진도 효돈', true, 12)
    returning id
  )
  insert into work_images (work_id, url, is_main, sort_order)
  select new_work.id, v.url, v.is_main, v.sort_order
  from new_work, (values
    ('/images/works/jindo-hyodon/01.webp', true, 0),
    ('/images/works/jindo-hyodon/02.webp', false, 1),
    ('/images/works/jindo-hyodon/03.webp', false, 2),
    ('/images/works/jindo-hyodon/04.webp', false, 3),
    ('/images/works/jindo-hyodon/05.webp', false, 4),
    ('/images/works/jindo-hyodon/06.webp', false, 5),
    ('/images/works/jindo-hyodon/07.webp', false, 6)
  ) as v(url, is_main, sort_order);

end $$;
