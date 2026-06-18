# 아키텍처 설계서 (Architecture)

> 기준 문서: `PRD.md`, `WIREFRAME.md`, `TECH_STACK.md`(Next.js + Tailwind CSS + Supabase + Resend + Vercel), `DEVELOPMENT_PLAN.md`
> 본 문서는 실제 코드 작성에 바로 적용 가능한 수준(폴더/파일명, 테이블 DDL, RLS 정책 SQL, API 시그니처)으로 작성한다.

---

## 0. 전체 요청 흐름 개요

```
[공개 페이지 요청]                         [관리자 요청]
사용자 → Next.js Server Component          관리자 브라우저 → /admin/login
        → Supabase(anon key, RLS: is_published=true만 조회)   → Supabase Auth(signInWithPassword)
        → HTML 응답(SSG/ISR)                                    → 세션 쿠키 저장(@supabase/ssr)
                                                                  → middleware.ts가 매 요청마다 세션 검증
[문의 제출]                                                      → Server Component/Action에서
사용자 → ContactForm(Client)                                       authenticated 권한으로 CRUD 수행
        → POST /api/contact (Route Handler)
        → reCAPTCHA 검증 → inquiries 테이블 INSERT(service role)
        → Resend로 회사 메일 발송
        → 응답 반환

[이미지 업로드]
관리자 브라우저 → Supabase Storage SDK로 직접 업로드(인증된 세션)
              → 업로드 성공 시 반환된 URL을 Server Action으로 전달
              → Server Action이 works/site_images 테이블에 URL 기록 + revalidatePath
```

---

## 1. 폴더 구조

```
construction-homepage/
├── app/
│   ├── layout.tsx                    # 전역 레이아웃 (Header/Footer/FloatingButton 포함)
│   ├── page.tsx                      # 메인 /
│   ├── globals.css
│   ├── sitemap.ts                    # /sitemap.xml
│   ├── robots.ts                     # /robots.txt
│   ├── about/
│   │   ├── page.tsx                  # /about 인사말·비전
│   │   └── company/
│   │       └── page.tsx              # /about/company 회사개요
│   ├── business/
│   │   └── page.tsx                  # /business
│   ├── works/
│   │   ├── page.tsx                  # /works 목록 (searchParams: category, page)
│   │   └── [id]/
│   │       └── page.tsx              # /works/:id 상세 (generateMetadata 동적)
│   ├── capability/
│   │   └── page.tsx                  # /capability (선택)
│   ├── contact/
│   │   └── page.tsx                  # /contact
│   ├── api/
│   │   └── contact/
│   │       └── route.ts              # POST 문의 제출 (유일한 공개 Route Handler)
│   └── admin/
│       ├── layout.tsx                # Admin Shell: 세션 확인 + 사이드바/상단바
│       ├── login/
│       │   └── page.tsx
│       ├── page.tsx                  # /admin 대시보드
│       ├── images/
│       │   ├── page.tsx
│       │   └── actions.ts            # Server Actions
│       ├── works/
│       │   ├── page.tsx              # 목록 (searchParams: q, category, page)
│       │   ├── new/page.tsx
│       │   ├── [id]/page.tsx         # 수정
│       │   └── actions.ts
│       └── inquiries/
│           ├── page.tsx              # 목록 (searchParams: status, type, page)
│           └── actions.ts
│
├── components/
│   ├── common/        # Header, Footer, FloatingButton, Breadcrumb
│   ├── ui/             # Button, Card, Badge, Modal, Lightbox, Tabs, Pagination, Input, Textarea, Select, Checkbox, Table, Toast
│   ├── sections/        # HeroSection, UspSection, BusinessPreviewSection, WorksHighlightSection, CompanyIntroSection, CtaBanner
│   ├── works/           # WorkCard, WorkGrid, WorkFilter, WorkGallery, WorkInfoTable
│   ├── contact/         # ContactForm, ContactInfoCard, MapEmbed
│   └── admin/           # AdminSidebar, AdminTopbar, StatCard, ImageUploader, SortableImageList, WorkForm, WorksTable, InquiriesTable, InquiryDetailPanel, StatusBadge
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                 # createServerClient (Server Component/Action용, 쿠키 기반)
│   │   ├── client.ts                 # createBrowserClient (Client Component용)
│   │   └── admin.ts                  # service role client (Route Handler 전용, 서버 only)
│   ├── resend/
│   │   └── sendContactMail.ts
│   ├── validation/
│   │   ├── contactSchema.ts          # zod
│   │   ├── workSchema.ts
│   │   └── loginSchema.ts
│   ├── utils/
│   │   ├── image.ts                  # 클라이언트 업로드 전 포맷/용량 검증
│   │   └── format.ts                 # 날짜·전화번호 포맷터
│   └── constants.ts                  # 회사정보, 문의유형 옵션 등 정적 상수
│
├── types/
│   ├── work.ts        # Work, WorkImage
│   ├── inquiry.ts      # Inquiry, InquiryStatus, InquiryType
│   └── category.ts
│
├── middleware.ts                     # /admin/* 보호 (login 제외)
├── next.config.ts                    # images.remotePatterns에 Supabase Storage 도메인 등록
├── tailwind.config.ts
├── .env.local.example
└── package.json
```

---

## 2. 컴포넌트 구조

### 2-1. 구성 원칙
- **기본은 Server Component.** 데이터를 다루는 페이지/섹션은 별도 명시 없이 서버에서 Supabase를 직접 호출해 렌더링한다(클라이언트로 JS 전송량 최소화 = SEO·성능에 직결).
- **상호작용이 필요한 leaf 컴포넌트만 `'use client'`** 로 분리한다. 상태(토글, 슬라이더 인덱스, 폼 입력)가 있는 가장 작은 단위까지 client 경계를 내려보낸다.

### 2-2. Server / Client 분리표

| 컴포넌트 | 유형 | 이유 |
|---|---|---|
| `app/**/page.tsx` (대부분) | Server | Supabase 데이터 직접 조회 후 정적/ISR 렌더링 |
| `HeroSection`, `UspSection`, `BusinessPreviewSection`, `WorksHighlightSection`, `CompanyIntroSection` | Server | 정적 텍스트 + DB 조회 결과 표시, 상호작용 없음 |
| `Header` | Client | 모바일 메뉴 열림/닫힘, 스크롤에 따른 sticky 클래스 토글 |
| `FloatingButton` | Client | 스크롤 위치에 따른 노출 여부 토글 |
| `WorkFilter` (카테고리 탭) | Client | 클릭 시 URL searchParams 변경 → 상위 Server Component 재요청 |
| `WorkGallery` (이미지 슬라이더) | Client | 현재 인덱스 상태, 스와이프 제스처 |
| `Lightbox`, `Modal`, `Tabs` | Client | 열림/닫힘 상태 |
| `ContactForm` | Client | react-hook-form 입력 상태, 제출 로딩 상태 |
| `AdminSidebar` | Server(현재 경로는 `usePathname` 필요 시 Client) | 메뉴 활성 표시 필요 시 Client 전환 |
| `ImageUploader`, `SortableImageList` | Client | 파일 선택/드래그앤드롭/순서변경 상태 |
| `WorkForm` (등록/수정 폼) | Client | react-hook-form 입력 상태 |
| `InquiriesTable`, `InquiryDetailPanel` | Server(목록) + Client(상태변경 select 부분만) | 목록은 서버에서 조회, 상태 변경 액션만 client island로 분리 |

### 2-3. 페이지 합성 패턴 (예: 메인 페이지)
```tsx
// app/page.tsx (Server Component)
export default async function HomePage() {
  const supabase = createServerClient();
  const { data: highlightWorks } = await supabase
    .from('works')
    .select('id, title, category:categories(name), work_images(url, is_main)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);
  const { data: mainVisuals } = await supabase
    .from('site_images')
    .select('url, alt')
    .eq('type', 'main_visual')
    .order('sort_order');

  return (
    <>
      <HeroSection images={mainVisuals ?? []} />   {/* Server, 내부 슬라이드는 CSS/Client island */}
      <UspSection />
      <BusinessPreviewSection />
      <WorksHighlightSection works={highlightWorks ?? []} />
      <CompanyIntroSection />
      <CtaBanner />
    </>
  );
}
```
- 페이지(Server)는 데이터를 조회해 props로 섹션에 넘기고, 섹션 내부의 상호작용 요소(슬라이더 등)만 별도 Client 하위 컴포넌트로 분리한다.

---

## 3. 상태 관리

이 규모(약 10페이지, 단일/소수 관리자)에서는 **Redux/Zustand 등 전역 상태관리 라이브러리를 도입하지 않는다.** 아래 5개 범주로 상태를 분리해 각 범주에 맞는 최소한의 도구만 사용한다.

| 범주 | 처리 방식 | 적용 예 |
|---|---|---|
| 서버 상태(데이터) | Server Component에서 Supabase 직접 조회. 클라이언트 캐시 불필요(요청 시 항상 최신, ISR로 캐시 제어) | 시공사례 목록/상세, 대시보드 통계, 문의 목록 |
| 폼 상태 | `react-hook-form` + `zod` 스키마 검증 | ContactForm, WorkForm, LoginForm |
| UI 로컬 상태 | 컴포넌트 내부 `useState`/`useReducer` | 모바일 메뉴, 라이트박스 인덱스, 캐러셀, 토스트 |
| 목록 필터/페이지네이션 | URL `searchParams`를 단일 진실 소스로 사용(클라이언트 상태 중복 없음) | `/works?category=plant`, `/admin/inquiries?status=new&page=2` |
| 인증 상태 | 서버: 미들웨어/Server Component가 쿠키 세션 검증. 클라이언트: 로그인/로그아웃 시점에만 Supabase SDK 직접 호출 | 로그인 폼, 로그아웃 버튼 |

**근거**: 데이터 변경(시공사례 등록, 문의 상태 변경)은 Server Action → `revalidatePath`로 즉시 서버 렌더링에 반영되므로, 클라이언트 측에 별도 캐시(SWR/React Query)나 전역 스토어를 둘 필요가 없다. 필터는 URL 상태로 관리해 새로고침·뒤로가기·링크 공유가 자연스럽게 동작한다.

---

## 4. 인증 구조

### 4-1. 기술 요소
- `@supabase/ssr` 패키지로 쿠키 기반 세션 관리(Server/Client 양쪽 헬퍼 제공)
- **공개 회원가입 비활성화** — 관리자 계정은 Supabase 콘솔 또는 1회성 seed 스크립트로 수동 생성. 즉, **`authenticated` 역할 = 관리자**로 간주할 수 있는 구조(별도 role 컬럼/커스텀 클레임 불필요).

### 4-2. 로그인 플로우
```
[/admin/login (Client Component)]
  → supabase.auth.signInWithPassword({ email, password })
  → 성공 시 @supabase/ssr가 세션을 쿠키에 자동 저장
  → router.push('/admin')
  → 실패 시 인라인 에러 메시지 + 클라이언트 측 실패 횟수 카운트(5회 초과 시 60초간 버튼 비활성화)
```

### 4-3. 라우트 보호 (`middleware.ts`)
```ts
export const config = { matcher: ['/admin/:path*'] };

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return response; // 세션 갱신 쿠키 반영
}
```
- `admin/layout.tsx`에서도 동일하게 `supabase.auth.getUser()`로 2차 검증(미들웨어 우회 방지, defense in depth).

### 4-4. RLS(Row Level Security) 기본 정책
- **공개 테이블 read**: `is_published = true` 등 조건을 만족하는 행만 `anon`/`authenticated` 모두 조회 가능
- **쓰기(insert/update/delete)**: `authenticated`만 가능
- **`inquiries` 테이블은 클라이언트에서 직접 접근 금지** — INSERT는 `/api/contact`에서 **service role key**로만 수행(RLS 우회), SELECT/UPDATE는 `authenticated`만 가능. 이렇게 해야 봇이 Supabase anon key를 탈취해도 문의 테이블에 임의로 쓰기 어렵고, reCAPTCHA 검증을 서버에서 강제할 수 있음.

### 4-5. 세션 만료/갱신
- `@supabase/ssr`이 refresh token을 이용해 자동 갱신(미들웨어가 매 요청마다 처리)
- 장시간 미활동 시 refresh token 만료 → 자동으로 `/admin/login`으로 리다이렉트(미들웨어가 `user`를 못 찾으므로 자연히 처리됨, 별도 idle-timer 불필요)

---

## 5. API 구조

| 구분 | 위치 | 메서드/이름 | 인증 | 설명 |
|---|---|---|---|---|
| 공개 API | `app/api/contact/route.ts` | `POST` | 없음(reCAPTCHA로 대체) | 문의 저장 + 메일 발송 |
| Server Action | `app/admin/works/actions.ts` | `createWork(formData)` | authenticated | 시공사례 등록 |
| Server Action | 〃 | `updateWork(id, formData)` | authenticated | 시공사례 수정 |
| Server Action | 〃 | `deleteWork(id)` | authenticated | 시공사례 삭제 |
| Server Action | 〃 | `togglePublish(id, value)` | authenticated | 공개여부 토글 |
| Server Action | 〃 | `reorderWorkImages(workId, orderedIds)` | authenticated | 갤러리 순서 저장 |
| Server Action | `app/admin/images/actions.ts` | `registerSiteImage(type, url, alt)` | authenticated | 업로드된 이미지 URL을 DB에 기록 |
| Server Action | 〃 | `deleteSiteImage(id)` | authenticated | 이미지 삭제(DB+Storage) |
| Server Action | 〃 | `reorderSiteImages(orderedIds)` | authenticated | 메인비주얼 순서 저장 |
| Server Action | `app/admin/inquiries/actions.ts` | `updateInquiryStatus(id, status)` | authenticated | 신규/처리중/완료 변경 |
| Server Action | 〃 | `addInquiryMemo(id, memo)` | authenticated | 내부 메모 저장 |
| Storage 직접 호출 | 클라이언트(`lib/supabase/client.ts`) | Storage `upload()` | authenticated | 이미지 파일을 Supabase Storage에 직접 업로드 후 URL을 위 Server Action에 전달 |

> 관리자 CRUD는 REST API가 아닌 **Next.js Server Actions**로 구현한다(내부 전용 호출이라 별도 엔드포인트 설계·인증 헤더 처리 비용을 줄임). 외부에 공개되는 유일한 HTTP API는 `/api/contact` 하나다.

### 5-1. `POST /api/contact` 상세
**요청 본문**
```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "type": "quote | partnership | as | etc",
  "title": "string?",
  "message": "string",
  "attachmentUrl": "string?",
  "recaptchaToken": "string",
  "honeypot": ""
}
```
**서버 처리 순서**
1. `honeypot` 필드 값이 비어있지 않으면 즉시 무시(스팸 봇으로 간주, 200 응답으로 위장)
2. `contactSchema`(zod)로 필드 유효성 재검증
3. Google reCAPTCHA `siteverify` API 호출로 `recaptchaToken` 검증
4. **`inquiries` 테이블에 INSERT (service role client)** — 메일 발송 성공 여부와 무관하게 먼저 저장
5. `lib/resend/sendContactMail.ts`로 회사 메일 발송 시도(실패해도 4번 결과는 유지, 실패 로그만 기록)
6. 클라이언트에 `{ ok: true }` 또는 검증 오류 시 `{ ok: false, error }` 응답

**응답**
```json
{ "ok": true }
```

---

## 6. Supabase 구조 (DB 스키마)

### 6-1. 테이블 DDL
```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table works (
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

create table work_images (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references works(id) on delete cascade,
  url text not null,
  alt text,
  is_main boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table site_images (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('main_visual','logo','business_license')),
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  type text not null check (type in ('quote','partnership','as','etc')),
  title text,
  message text not null,
  attachment_url text,
  status text not null default 'new' check (status in ('new','in_progress','done')),
  admin_memo text,
  created_at timestamptz not null default now()
);

create index works_category_idx on works(category_id);
create index works_published_idx on works(is_published);
create index work_images_work_idx on work_images(work_id);
create index inquiries_status_idx on inquiries(status);
create index inquiries_created_idx on inquiries(created_at desc);
```

### 6-2. RLS 정책
```sql
alter table categories enable row level security;
alter table works enable row level security;
alter table work_images enable row level security;
alter table site_images enable row level security;
alter table inquiries enable row level security;

-- categories: 전체 공개 read, 쓰기는 관리자만
create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- works: 게시된 것만 공개 read, 관리자는 전체 read/write
create policy "public read published works" on works for select
  using (is_published = true);
create policy "admin full access works" on works for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- work_images: 공개 read, 관리자 write
create policy "public read work_images" on work_images for select using (true);
create policy "admin write work_images" on work_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- site_images: 공개 read(메인비주얼/로고 노출), 관리자 write
create policy "public read site_images" on site_images for select using (true);
create policy "admin write site_images" on site_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- inquiries: insert 정책 없음(service role만 우회 가능) → 클라이언트 직접 insert 불가
create policy "admin read inquiries" on inquiries for select
  using (auth.role() = 'authenticated');
create policy "admin update inquiries" on inquiries for update
  using (auth.role() = 'authenticated');
```

---

## 7. Storage 구조

### 7-1. 버킷 구성

| 버킷명 | Public | 용도 | 경로 규칙 |
|---|---|---|---|
| `site-images` | true | 메인비주얼, 로고, 사업자등록증 | `{type}/{uuid}-{filename}` |
| `work-images` | true | 시공사례 갤러리 이미지 | `{work_id}/{uuid}-{filename}` |
| `inquiry-attachments` | **false** | 문의폼 첨부파일(개인정보 포함 가능) | `{inquiry_id}/{uuid}-{filename}` |

- `site-images`, `work-images`는 공개 노출 콘텐츠이므로 public bucket으로 설정해 CDN URL을 그대로 `<Image src>`에 사용한다.
- `inquiry-attachments`는 비공개로 설정하고, 업로드는 `/api/contact`에서 **service role key로만** 수행(클라이언트가 직접 업로드하지 않음). 관리자가 열람할 때는 Signed URL을 발급해 일정 시간만 접근 가능하게 한다.

### 7-2. Storage 정책(SQL)
```sql
-- site-images: 공개 read, 관리자만 쓰기
create policy "public read site-images" on storage.objects for select
  using (bucket_id = 'site-images');
create policy "admin write site-images" on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');
create policy "admin update site-images" on storage.objects for update
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');
create policy "admin delete site-images" on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

-- work-images: 동일 패턴
create policy "public read work-images" on storage.objects for select
  using (bucket_id = 'work-images');
create policy "admin write work-images" on storage.objects for insert
  with check (bucket_id = 'work-images' and auth.role() = 'authenticated');
create policy "admin update work-images" on storage.objects for update
  using (bucket_id = 'work-images' and auth.role() = 'authenticated');
create policy "admin delete work-images" on storage.objects for delete
  using (bucket_id = 'work-images' and auth.role() = 'authenticated');

-- inquiry-attachments: insert 정책 없음(service role만 가능), 조회는 관리자만(Signed URL 발급 전제)
create policy "admin read inquiry-attachments" on storage.objects for select
  using (bucket_id = 'inquiry-attachments' and auth.role() = 'authenticated');
```

### 7-3. 업로드 처리 흐름
1. **관리자 이미지 업로드(메인비주얼/시공사례)**: 관리자 브라우저에서 `lib/utils/image.ts`로 포맷(jpg/png/webp)·용량(5MB) 1차 검증 → `lib/supabase/client.ts`(인증된 세션)로 `site-images`/`work-images` 버킷에 직접 업로드 → 반환된 public URL을 Server Action(`registerSiteImage`/시공사례 등록 폼 제출)으로 전달해 DB에 기록 → `revalidatePath`로 공개 페이지 즉시 갱신
2. **문의 첨부파일**: 사용자가 `/contact`에서 첨부 시, 파일은 클라이언트가 아니라 `/api/contact` 요청에 포함되어 **서버에서** `inquiry-attachments`(service role)로 업로드 후 URL을 `inquiries.attachment_url`에 저장(비공개 버킷이므로 사용자 단말이 직접 쓰기 권한을 가질 필요가 없음)
3. **이미지 렌더링 최적화**: `next.config.ts`의 `images.remotePatterns`에 Supabase Storage 도메인을 등록해 `next/image`가 Supabase에 저장된 원본을 요청 시점에 리사이즈/WebP 변환하도록 한다(별도 이미지 처리 서버 불필요).
