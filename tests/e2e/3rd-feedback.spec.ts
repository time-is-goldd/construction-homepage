import { test, expect, type Page } from "@playwright/test";

async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("메인화면", () => {
  test("로고/회사명 제거, 슬로건만 표시", async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto("/");
    await expect(page).not.toHaveURL(/\/404|\/500/);
    // 회사명 텍스트가 hero 내에 없어야 함
    const hero = page.locator("section").first();
    await expect(hero.locator("text=(주)대화시스템").first()).not.toBeVisible();
    // 슬로건은 있어야 함
    await expect(page.locator("h1")).toContainText("대한민국 양돈 농가의 든든한 파트너");
    expect(errors).toHaveLength(0);
  });

  test("서브문구 줄바꿈 렌더링", async ({ page }) => {
    await page.goto("/");
    const subtitle = page.locator("p.whitespace-pre-line");
    await expect(subtitle).toBeVisible();
  });

  test("이미지 로딩 (hero)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const images = page.locator("img");
    for (const img of await images.all()) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe("사업분야 페이지", () => {
  test("페이지 로드 및 소개문 확인", async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto("/business");
    await expect(page).not.toHaveURL(/\/404|\/500/);
    await expect(page.locator("text=농장 규모와 일정에 맞춘 최적의 시공 방식을 제안합니다.")).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("신규 사업분야 이미지 로딩", async ({ page }) => {
    await page.goto("/business");
    await page.waitForLoadState("networkidle");
    const images = page.locator("img");
    for (const img of await images.all()) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe("기업 파트너십 페이지 (/performance)", () => {
  test("페이지 제목 및 구조 확인", async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto("/performance");
    await expect(page).not.toHaveURL(/\/404|\/500/);
    await expect(page.locator("h1, [class*='SubHero'] h1").first()).toContainText("기업 파트너십");
    await expect(page.locator("h2").first()).toContainText("기업 파트너십 성과");
    expect(errors).toHaveLength(0);
  });

  test("파트너 카드 3개 표시", async ({ page }) => {
    await page.goto("/performance");
    await expect(page.locator("text=돈돈팜")).toBeVisible();
    await expect(page.locator("text=농협종돈사업소")).toBeVisible();
    await expect(page.locator("text=선진한마을")).toBeVisible();
  });

  test("파트너 기간 표시", async ({ page }) => {
    await page.goto("/performance");
    await expect(page.locator("text=2007 ~ 현재")).toBeVisible();
    await expect(page.locator("text=2004 ~ 현재")).toBeVisible();
    await expect(page.locator("text=2025 ~ 현재")).toBeVisible();
  });

  test("전체 시공 실적 섹션 표시", async ({ page }) => {
    await page.goto("/performance");
    await expect(page.locator("h2").nth(1)).toContainText("전체 시공 실적");
  });

  test("파트너 로고 이미지 로딩", async ({ page }) => {
    await page.goto("/performance");
    await page.waitForLoadState("networkidle");
    const logoImages = page.locator("img[alt*='로고']");
    for (const img of await logoImages.all()) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe("Header 네비게이션", () => {
  test("기업 파트너십 메뉴 존재 (데스크톱/모바일 공통)", async ({ page }) => {
    await page.goto("/");
    // 데스크톱 nav 또는 모바일 nav 패널 어딘가에 링크가 존재해야 함
    const link = page.locator("a[href='/performance']").first();
    await expect(link).toHaveText("기업 파트너십");
  });

  test("기업 파트너십 링크 클릭", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      // 모바일: 햄버거 메뉴 열기
      await page.locator("button[aria-label='메뉴 열기']").click();
      await page.waitForSelector("#mobile-nav-panel a[href='/performance']", { state: "visible" });
      await page.locator("#mobile-nav-panel a[href='/performance']").click();
    } else {
      await page.locator("nav a[href='/performance']").first().click();
    }
    await expect(page).toHaveURL("/performance");
  });
});

test.describe("관리자 페이지", () => {
  test("관리자 로그인 페이지 접근", async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    const response = await page.goto("/admin");
    expect(response?.status()).not.toBe(500);
    expect(errors.filter(e => !e.includes("Supabase"))).toHaveLength(0);
  });
});

test.describe("404/500 검사", () => {
  test("/performance 200 응답", async ({ page }) => {
    const response = await page.goto("/performance");
    expect(response?.status()).toBe(200);
  });

  test("/ 200 응답", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("/business 200 응답", async ({ page }) => {
    const response = await page.goto("/business");
    expect(response?.status()).toBe(200);
  });

  test("/about 200 응답", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
  });
});
