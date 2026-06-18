# 개발 계획서 (Development Plan)

> 참고 문서: `PRD.md`(요구사항), `WIREFRAME.md`(페이지별 설계), `TECH_STACK.md`(기술 스택: Next.js + Tailwind CSS + Supabase + Resend + Vercel)
> 본 문서는 Claude Code가 Phase 순서대로 코드를 작성/검증할 수 있도록 구성되어 있다. **각 Phase는 이전 Phase의 완료 조건을 충족한 뒤 시작한다.**

## 전체 진행 순서

| Phase | 이름 | 핵심 산출물 |
|---|---|---|
| 0 | 프로젝트 초기설정 | 실행 가능한 빈 Next.js + Supabase 연결 |
| 1 | 공통 UI | Header/Footer/플로팅버튼, 레이아웃 |
| 2 | 공개 페이지 | 9개 공개 페이지 정적 마크업 |
| 3 | 관리자 인증 | `/admin/login`, 보호 미들웨어, 대시보드 틀 |
| 4 | 이미지 관리 | Storage 연동, 이미지 업로드/시공사례 CRUD |
| 5 | 문의 기능 | 문의폼 제출 → DB저장 + 메일발송, 문의관리 |
| 6 | SEO | 메타데이터, sitemap, 구조화데이터, GA4 |
| 7 | 배포 | Vercel 프로덕션 배포, 도메인 연결, 최종 QA |

---

## Phase 0 — 프로젝트 초기설정

### 목표
Claude Code 및 이후 모든 Phase가 일관된 구조 위에서 작업할 수 있도록 프로젝트 뼈대와 외부 서비스 연결을 완료한다.

### 구현 범위
- Next.js 프로젝트 생성 (TypeScript, App Router, Tailwind CSS 포함 옵션으로 초기화)
- 폴더 구조 설계
  ```
  app/                 # 라우트 (페이지별 디렉토리, WIREFRAME.md URL 구조 그대로 매핑)
  app/admin/            # 관리자 라우트 그룹
  components/common/    # Header, Footer, FloatingButton 등
  components/ui/        # 버튼, 카드, 입력 등 재사용 컴포넌트
  lib/supabase/         # Supabase client (server/client 분리)
  lib/resend/           # 메일 발송 유틸
  types/                # 공통 타입 정의 (Work, Inquiry, Category 등)
  ```
- ESLint + Prettier 설정 (코드 스타일 통일)
- `.env.local.example` 작성: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_RECEIVER_EMAIL`
- Supabase 프로젝트 생성, DB 스키마 1차 정의 및 마이그레이션
  - `works` (id, title, category_id, summary, content, client, scale, period, location, is_client_hidden, is_published, sort_order, created_at)
  - `work_images` (id, work_id, url, sort_order, is_main)
  - `categories` (id, name, slug)
  - `inquiries` (id, name, phone, email, type, title, message, attachment_url, status, created_at)
  - `site_images` (id, type[main_visual|logo], url, sort_order, created_at) — 메인비주얼/로고 관리용
- Supabase Auth: 관리자 계정 1개 수동 생성(이메일/비밀번호)
- Git 저장소 초기화, `.gitignore`(`.env*.local` 포함) 설정

### 완료 조건
- `npm run dev` 실행 시 로컬에서 기본 페이지(placeholder)가 정상 렌더링됨
- 서버 컴포넌트에서 Supabase client로 간단한 쿼리(예: `categories` 목록 조회)가 에러 없이 동작함
- 환경변수 누락 시 빌드/실행이 명확한 에러로 실패함(silent fail 없음)
- DB 테이블 5종이 Supabase 콘솔에서 확인됨

### 테스트 방법
- `npm run dev` → `localhost:3000` 접속해 렌더링 확인
- 임시 서버 컴포넌트에서 `supabase.from('categories').select('*')` 호출 후 콘솔에 결과 출력 확인
- `.env.local` 값을 일부 삭제한 뒤 재실행하여 의도된 에러 발생 확인
- Supabase 콘솔 Table Editor에서 5개 테이블 스키마 직접 확인

---

## Phase 1 — 공통 UI

### 목표
`WIREFRAME.md`의 "공통 컴포넌트" 정의(Header, Footer, 플로팅 버튼)를 구현하여 모든 페이지에서 재사용 가능한 레이아웃을 완성한다.

### 구현 범위
- `app/layout.tsx`: 전역 레이아웃에 Header/Footer/FloatingButton 배치, 폰트/메타 기본값 설정
- `components/common/Header.tsx`
  - 로고(좌), GNB 메뉴(회사소개 드롭다운/사업분야/시공사례/보유역량/고객문의), 전화번호 클릭콜 + 문의버튼(우)
  - 스크롤 시 sticky 고정 로직
  - 모바일: 햄버거 메뉴 → 슬라이드 패널, 하단 고정 "문의하기" 버튼
- `components/common/Footer.tsx`: 사업자정보, 정책 링크, Copyright (값은 1차로 하드코딩, Phase 4 이후 필요 시 상수 파일로 분리)
- `components/common/FloatingButton.tsx`: 우측 하단 "전화문의"/"빠른문의" + "맨 위로" 버튼, 스크롤 300px 이상 시 노출
- Tailwind 설정: 색상/폰트 토큰을 `tailwind.config.ts`에 정의(브랜드 컬러, 본문 폰트)
- 반응형 브레이크포인트 정의: `sm(360~480)`, `md(768)`, `lg(1280+)` 기준으로 Header/Footer 레이아웃 분기

### 완료 조건
- 임시 페이지 2~3개에서 Header/Footer/FloatingButton이 동일하게 노출됨
- 모바일(360px)에서 햄버거 메뉴 정상 동작(열기/닫기/링크 이동)
- 스크롤 시 Header sticky, FloatingButton 노출/숨김 정상 동작
- 데스크톱/태블릿/모바일 3개 뷰포트에서 레이아웃 깨짐 없음

### 테스트 방법
- 브라우저 개발자도구 디바이스 툴바로 360px/768px/1280px 각각 확인
- 모바일 뷰에서 햄버거 메뉴 열기 → 메뉴 클릭 → 라우트 이동 확인
- 페이지를 300px 이상 스크롤하여 FloatingButton 노출 여부 확인, "맨 위로" 클릭 시 최상단 이동 확인
- `tel:` 링크 클릭 시 의도된 형식(`tel:0212345678` 등)인지 href 확인

---

## Phase 2 — 공개 페이지

### 목표
`WIREFRAME.md`에 정의된 9개 공개 페이지를 섹션 순서·포함 요소 그대로 마크업하여, 콘텐츠 중심의 정적/준정적 페이지를 완성한다. (문의폼 제출 로직과 실제 업로드 이미지 연동은 이후 Phase에서 처리, 이번 Phase는 더미 데이터/플레이스홀더 이미지로 진행)

### 구현 범위
- `/` 메인: Hero(슬라이더 placeholder), USP 카드, 사업분야 미리보기, 시공사례 하이라이트(더미 3~6건), 회사소개 요약, CTA 배너
- `/about` 인사말/비전: 서브히어로, 탭 내비게이션, 대표인사말, 비전/미션/핵심가치, 연혁 타임라인(선택)
- `/about/company` 회사개요: 회사개요 표, 사업자등록증 이미지(placeholder, 라이트박스 모달), 위치 요약 카드
- `/business` 사업분야: 서비스 항목 반복 블록, 프로세스 다이어그램
- `/works` 시공사례 목록: Supabase `works` 테이블에서 **실데이터 조회**(더미 데이터 미리 insert), 카테고리 필터, 카드 그리드, 페이지네이션
- `/works/[id]` 시공사례 상세: 동적 라우트, 갤러리 슬라이더, 프로젝트 정보 표, 이전/다음 네비게이션
- `/capability` 보유역량(선택 페이지, PRD상 optional이므로 회사개요에 통합할지 별도 페이지로 둘지 1차 결정 후 진행)
- `/contact` 고객문의: 연락처 카드, 문의폼 UI(제출 로직은 Phase 5), 지도 임베드
- 모든 페이지 모바일 반응형 1차 검증(Header/Footer는 Phase1 재사용)

### 완료 조건
- 9개 URL 모두 접속 가능하고 각 페이지의 와이어프레임 섹션이 누락 없이 순서대로 렌더링됨
- `/works`, `/works/[id]`는 Supabase 데이터와 연동되어 등록된 더미 게시물이 실제로 표시됨
- 모바일 뷰에서 모든 섹션이 레이아웃 깨짐 없이 스택/그리드 전환됨
- 이미지 영역은 비어있지 않고 placeholder 이미지로라도 채워져 레이아웃 검증 가능함

### 테스트 방법
- 각 페이지를 직접 접속해 `WIREFRAME.md` 체크리스트(섹션 순서/포함 요소)와 1:1 대조
- `/works`에서 카테고리 필터 클릭 시 목록이 정상 필터링되는지 확인
- `/works/[id]`에 존재하지 않는 id로 접속 시 404 처리 확인
- Chrome Lighthouse(Mobile) 실행하여 레이아웃 시프트(CLS) 이상 유무 확인

---

## Phase 3 — 관리자 인증

### 목표
Supabase Auth 기반 관리자 로그인과 `/admin/*` 보호 로직을 구축하여, 인증된 관리자만 관리 기능에 접근하도록 한다.

### 구현 범위
- `app/admin/login/page.tsx`: ID/PW 입력 폼, 로그인 실패 시 에러 메시지, 연속 실패 시 잠금 안내(클라이언트 카운트 또는 서버측 rate limit)
- Supabase Auth `signInWithPassword` 연동
- `middleware.ts`: `/admin` 하위 경로 접근 시 세션 검증 → 미인증 시 `/admin/login`으로 리다이렉트
- 세션 만료 처리(예: 활동 없을 시 일정 시간 후 자동 로그아웃)
- `app/admin/layout.tsx`: 사이드바(대시보드/이미지관리/시공사례관리/문의관리/로그아웃) + 상단바(관리자명, 로그아웃) — Admin Shell
- `app/admin/page.tsx` 대시보드: 요약 통계 카드(신규문의 수 등), 최근 문의 리스트 위젯 — 이번 Phase에서는 더미/실데이터 혼용 가능(문의 데이터 실연동은 Phase5)
- 로그아웃 기능(Supabase `signOut` + 리다이렉트)

### 완료 조건
- 올바른 계정으로 로그인 시 `/admin` 대시보드로 이동
- 잘못된 계정/비밀번호 입력 시 에러 메시지 노출, 일정 횟수 초과 시 잠금 안내
- 로그인하지 않은 상태로 `/admin`, `/admin/images` 등 직접 URL 접근 시 `/admin/login`으로 강제 리다이렉트
- 로그아웃 클릭 시 세션 종료 및 로그인 페이지로 이동, 이후 뒤로가기로 관리자 페이지 재접근 불가

### 테스트 방법
- 정상 계정/오답 계정 각각으로 로그인 시도하여 결과 확인
- 비로그인 상태에서 `/admin` 주소를 브라우저에 직접 입력해 리다이렉트 확인
- 로그인 후 세션 쿠키/토큰을 임의로 삭제하고 새로고침하여 재인증 요구되는지 확인
- 동일 계정으로 5회 이상 연속 실패 입력 후 잠금 메시지 노출 확인

---

## Phase 4 — 이미지 관리

### 목표
Supabase Storage를 이용해 메인비주얼/로고/시공사례 이미지를 관리자가 직접 업로드·교체·삭제할 수 있게 하고, 공개 페이지에 실시간 반영되도록 한다.

### 구현 범위
- Supabase Storage 버킷 생성: `site-images`(메인비주얼/로고), `work-images`(시공사례 갤러리), `business-license`(사업자등록증)
- 업로드 시 포맷(jpg/png/webp) 및 용량(5MB) 검증, 서버 단에서 WebP 변환/리사이즈 처리(예: `sharp` 라이브러리)
- `app/admin/images/page.tsx`: 탭(메인비주얼/로고), 드래그앤드롭 업로드 영역, 현재 이미지 리스트(대표지정/삭제/순서변경 드래그)
- `app/admin/works/page.tsx`(목록) + `app/admin/works/[id]/page.tsx` 또는 모달(등록/수정 폼)
  - 제목/카테고리/대표이미지/갤러리 다중 업로드(순서조정)/작업설명(에디터)/프로젝트정보/공개여부 토글
- `site_images`, `work_images` 테이블 CRUD API(Route Handler 또는 Server Action)
- 공개 페이지(`/`, `/works`, `/works/[id]`)에서 더미 데이터 대신 **실제 업로드된 이미지/게시물**을 조회하도록 Phase2 코드 연결 전환
- `/about/company`의 사업자등록증 이미지도 관리자 업로드 가능하도록 동일 패턴 적용(선택)

### 완료 조건
- 관리자가 이미지를 업로드하면 즉시 Storage에 저장되고 URL이 DB에 기록됨
- 메인 페이지 Hero 슬라이더가 관리자가 등록한 이미지 순서대로 노출됨
- 시공사례 등록/수정/삭제가 `/works`, `/works/[id]`에 실시간 반영됨(비공개 처리 시 목록에서 제외)
- 5MB 초과 또는 비허용 포맷 업로드 시 에러 메시지로 거부됨

### 테스트 방법
- 실제 이미지 파일을 업로드한 뒤 메인 페이지를 새로고침해 반영 여부 확인
- 시공사례 신규 등록 → `/works` 목록에 즉시 노출되는지 확인 → 비공개 토글 후 목록에서 사라지는지 확인
- 6MB 더미 파일, `.gif` 등 비허용 포맷 업로드 시도 후 에러 처리 확인
- 갤러리 이미지 순서를 드래그로 변경한 뒤 상세 페이지에서 순서가 반영되는지 확인

---

## Phase 5 — 문의 기능

### 목표
`/contact` 문의폼 제출 시 DB 저장과 회사 메일 발송이 모두 안정적으로 이루어지고, 관리자가 문의 내역을 관리할 수 있도록 한다.

### 구현 범위
- `/contact` 문의폼 클라이언트 유효성 검사(필수값, 이메일/전화번호 형식), 개인정보 동의 체크 전 제출 버튼 비활성화
- 스팸 방지: honeypot 히든 필드 또는 reCAPTCHA v3 적용
- `app/api/contact/route.ts`(Route Handler)
  1. 서버 측 재검증
  2. `inquiries` 테이블에 저장(우선 처리 — 메일 발송 실패와 무관하게 보장)
  3. Resend로 회사 메일 발송(제목: `[홈페이지 문의] {유형}/{이름}`)
  4. (선택) 사용자에게 접수 확인 메일 발송
  5. 발송 실패 시에도 DB 저장은 유지되고, 실패 로그를 남김
- 제출 성공/실패 UI 처리(인라인 메시지, 로딩 상태, 중복 제출 방지)
- `app/admin/inquiries/page.tsx`: 필터바(상태/날짜/유형), 목록 테이블, 상세 패널(상태 변경: 신규/처리중/완료, 내부 메모)
- 첨부파일 업로드 시 Storage 저장 후 URL을 `inquiries.attachment_url`에 기록

### 완료 조건
- 문의 제출 시 `inquiries` 테이블에 정상 저장되고, 등록된 회사 메일 주소로 메일이 실제 수신됨
- Resend API 키를 의도적으로 무효화해도 DB 저장은 정상적으로 이루어짐(이중 안전장치 검증)
- honeypot/reCAPTCHA로 봇 제출이 차단됨
- 관리자 `/admin/inquiries`에서 문의 목록 조회, 상태 변경, 첨부파일 다운로드가 정상 동작함

### 테스트 방법
- 실제 값으로 문의폼을 제출하고 회사 메일함에서 수신 확인
- `.env`의 `RESEND_API_KEY`를 임시로 잘못된 값으로 바꾼 뒤 제출 → DB에는 저장되는지, 에러가 적절히 로깅되는지 확인
- honeypot 필드를 강제로 채운 요청(예: curl/Postman)을 보내 차단되는지 확인
- 필수값을 비운 채 제출 시도하여 클라이언트/서버 양쪽에서 모두 거부되는지 확인
- 관리자 페이지에서 상태를 "신규 → 처리중 → 완료"로 변경 후 새로고침해도 유지되는지 확인

---

## Phase 6 — SEO

### 목표
`PRD.md` 5장 SEO 요구사항을 충족하여 검색엔진 노출과 Core Web Vitals 기준을 만족시킨다.

### 구현 범위
- 각 페이지 `generateMetadata`로 고유 `title`/`description` 설정(시공사례 상세는 게시물 데이터 기반 동적 생성)
- `app/sitemap.ts`, `app/robots.ts`로 `sitemap.xml`/`robots.txt` 자동 생성, `/admin` 경로는 색인 차단(`Disallow: /admin`)
- 구조화 데이터(JSON-LD): 전 페이지 `Organization`/`LocalBusiness`, 시공사례 상세에 `BreadcrumbList` 적용
- OG 태그(`og:title`, `og:description`, `og:image`) 전 페이지 적용, 시공사례 상세는 대표이미지로 동적 설정
- 이미지 `alt` 텍스트: 관리자 업로드 폼에 alt 입력 필드 추가(Phase4 폼 보완) 및 공개 페이지 `<Image alt>` 반영
- `next/image` lazy loading 적용 확인, Core Web Vitals(LCP/CLS) 점검 및 개선
- Google Analytics(GA4) 스크립트 연동, 문의폼 제출 이벤트 트래킹 추가
- canonical 태그 전 페이지 적용

### 완료 조건
- 모든 공개 페이지가 서로 다른 title/description을 가짐(중복 없음)
- `/sitemap.xml`, `/robots.txt` 접속 시 정상 응답, `/admin` 경로 미포함/차단 확인
- Google Rich Results Test에서 구조화 데이터 오류 없음
- Lighthouse SEO 점수 90점 이상, 모바일 LCP 2.5초 이하 목표
- GA4에서 문의폼 제출 이벤트가 실시간으로 수집됨

### 테스트 방법
- 브라우저에서 `/sitemap.xml`, `/robots.txt` 직접 접속해 내용 확인
- Google Rich Results Test, Lighthouse(Mobile) 실행 후 점수/오류 확인
- 페이지 소스보기로 각 페이지의 title/meta description이 다른지 확인
- GA4 실시간 보고서에서 문의폼 제출 후 이벤트 발생 여부 확인

---

## Phase 7 — 배포

### 목표
실제 도메인으로 서비스를 정식 오픈하고, 운영 안정성을 위한 유료 플랜 전환 및 최종 QA를 완료한다.

### 구현 범위
- Vercel 프로젝트 연결(Git 저장소 연동), Production 환경변수 설정(Supabase/Resend 키 등)
- `TECH_STACK.md` 권장안에 따라 Vercel Pro, Supabase Pro로 전환(상업적 이용 약관 충족 및 자동 일시정지 방지)
- 커스텀 도메인 연결 및 DNS 설정(A/CNAME, Resend 발신 도메인용 SPF/DKIM 레코드 추가)
- HTTPS 적용 확인(Vercel 기본 제공)
- Google Search Console / 네이버 서치어드바이저에 사이트 등록 및 sitemap 제출
- 최종 QA 체크리스트 수행: 전체 페이지 네비게이션, 폼 제출, 관리자 기능, 모바일 실기기 점검
- 운영 매뉴얼(간단 가이드: 관리자 로그인 방법, 이미지 교체 방법, 문의 확인 방법) 정리(선택)

### 완료 조건
- 실제 도메인으로 접속 시 전 페이지 정상 동작, HTTPS 적용 확인
- 프로덕션 환경에서 문의폼 제출 → 실제 메일 수신까지 정상 동작
- Search Console/서치어드바이저에 sitemap 제출 완료 및 색인 요청 처리
- 관리자 기능(로그인/이미지관리/시공사례관리/문의관리) 프로덕션에서 모두 정상 동작

### 테스트 방법
- 실 도메인으로 데스크톱/모바일 양쪽에서 전체 페이지 순회 테스트
- 프로덕션 환경에서 테스트 문의를 실제로 제출하고 메일 수신 확인
- 모바일 실기기(iOS Safari, Android Chrome)에서 핵심 플로우(메뉴 이동, 문의 제출, 시공사례 열람) 점검
- Search Console에서 sitemap 제출 상태 및 색인 오류 여부 확인
