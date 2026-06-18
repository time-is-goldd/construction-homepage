# construction-homepage

제조·건설업 기업 홈페이지 프로젝트.

## 문서

프로젝트 기획/설계 문서는 모두 저장소 루트에 있다. 작업 전 반드시 참고할 것.

- [`PRD.md`](./PRD.md) — 요구사항 정의
- [`WIREFRAME.md`](./WIREFRAME.md) — 페이지별 와이어프레임
- [`TECH_STACK.md`](./TECH_STACK.md) — 기술 스택 선정 및 비용
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — 폴더/컴포넌트/인증/API/DB/Storage 구조
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — 컬러/타이포/버튼/카드/여백/반응형/애니메이션 규칙
- [`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md) — Phase 단위 개발 계획 (현재 진행 기준 문서)

## 기술 스택

Next.js(App Router) · TypeScript · Tailwind CSS · Supabase(`@supabase/ssr`) · Resend · Vercel

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값 채워넣기
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier로 전체 포맷 |
| `npm run format:check` | Prettier 포맷 검사(쓰기 없음) |
| `npm run typecheck` | TypeScript 타입 검사(`tsc --noEmit`) |

## 환경변수

`.env.example` 참고. Supabase 프로젝트 URL/키, Resend API 키, 문의 수신 메일주소가 필요하다.

## 폴더 구조

상세 구조와 설계 근거는 [`ARCHITECTURE.md`](./ARCHITECTURE.md) 참고.

```
app/            # 라우트 (Phase별로 채워짐)
components/     # common / ui / sections / works / contact / admin
lib/            # supabase, resend, validation, utils, constants
types/          # work, inquiry, category 등 공통 타입
```

## 개발 진행 방식

이 프로젝트는 `DEVELOPMENT_PLAN.md`의 Phase 0~7 순서로 진행한다. 한 번에 하나의 Phase만 진행하며, 각 Phase는 완료 조건을 검증한 뒤 다음 Phase로 넘어간다.
