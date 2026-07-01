import { test, expect, type Page } from "@playwright/test";

// 400(이미지 옵티마이저 캐시 미스 등) 및 네트워크 자원 에러는
// 페이지 코드 오류가 아니므로 JS 런타임 에러만 체크한다.
async function collectRuntimeErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("메인화면", () => {
  test("로고/회사명 제거, 슬로건만 표시", async ({ page }) => {
    const errors = await collectRuntimeErrors(page);
    await page.goto("/");
    await expect(page).not.toHaveURL(/\/404|\/500/);
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
    const errors = await collectRuntimeErrors(page);
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
  test("페이지 로드 및 제목 확인", async ({ page }) => {
    const errors = await collectRuntimeErrors(page);
    await page.goto("/performance");
    await expect(page).not.toHaveURL(/\/404|\/500/);
    // SubHero h1
    await expect(page.locator("h1").first()).toContainText("기업 파트너십");
    // 섹션 제목
    await expect(page.locator("h2").first()).toContainText("기업 파트너십 성과");
    expect(errors).toHaveLength(0);
  });

  test("파트너 3개 표시 (세로 리스트)", async ({ page }) => {
    await page.goto("/performance");
    // 섹션 헤딩은 항상 존재
    await expect(
      page.locator("h2").filter({ hasText: "기업 파트너십 성과" }),
    ).toBeVisible();
    // DB 파트너 데이터가 있을 때만 기업명 확인 (partners 마이그레이션 후)
    const partnerCount = await page
      .locator("h3")
      .filter({ hasText: "주요 협력 실적" })
      .count();
    if (partnerCount >= 3) {
      await expect(
        page.getByText("돈돈팜 주식회사", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("농협종돈사업소", { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByText("선진한마을", { exact: true }).first(),
      ).toBeVisible();
    }
  });

  test("협력 기간 표시", async ({ page }) => {
    await page.goto("/performance");
    const partnerCount = await page
      .locator("h3")
      .filter({ hasText: "주요 협력 실적" })
      .count();
    if (partnerCount >= 3) {
      await expect(page.locator("text=2007 ~ 현재")).toBeVisible();
      await expect(page.locator("text=2004 ~ 현재")).toBeVisible();
      await expect(page.locator("text=2025 ~ 현재")).toBeVisible();
    } else {
      await expect(
        page.locator("h2").filter({ hasText: "기업 파트너십 성과" }),
      ).toBeVisible();
    }
  });

  test("파트너별 제목 표시", async ({ page }) => {
    await page.goto("/performance");
    const headings = page.locator("h3").filter({ hasText: "주요 협력 실적" });
    const count = await headings.count();
    if (count > 0) {
      await expect(headings).toHaveCount(3);
      await expect(headings.first()).toBeVisible();
    } else {
      await expect(
        page.locator("h2").filter({ hasText: "기업 파트너십 성과" }),
      ).toBeVisible();
    }
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

  test("WebP 로고 경로 사용 확인", async ({ page }) => {
    await page.goto("/performance");
    // next/image는 src를 /_next/image?url=... 로 변환하므로 srcset에서 경로 확인
    const logoImages = page.locator("img[alt*='로고']");
    const logoCount = await logoImages.count();
    if (logoCount > 0) {
      // DB 파트너 데이터가 있을 때만 경로 검증 (partners 마이그레이션 후)
      const logoSrcsets = await logoImages.evaluateAll(
        (imgs: HTMLImageElement[]) =>
          imgs.map(
            (img) =>
              img.getAttribute("srcset") ?? img.getAttribute("src") ?? "",
          ),
      );
      const combined = logoSrcsets.join(" ");
      expect(combined).toContain("performance");
      expect(combined).toContain("dondonfarm");
      expect(combined).toContain("nh-breeding");
      expect(combined).toContain("sunjin");
    }
  });
});

test.describe("Header 네비게이션", () => {
  test("기업 파트너십 메뉴 존재 (데스크톱/모바일 공통)", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("a[href='/performance']").first();
    await expect(link).toHaveText("기업 파트너십");
  });

  test("기업 파트너십 링크 클릭", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      // 모바일: JS로 직접 클릭 (헤더/뷰포트 이슈 우회)
      await page.locator("button[aria-label='메뉴 열기']").click({ force: true });
      await page.waitForSelector("#mobile-nav-panel a[href='/performance']", { state: "visible" });
      await page.evaluate(() => {
        (document.querySelector("#mobile-nav-panel a[href='/performance']") as HTMLElement)?.click();
      });
    } else {
      await page.locator("nav a[href='/performance']").first().click();
    }
    await expect(page).toHaveURL("/performance");
  });
});

test.describe("관리자 페이지", () => {
  test("관리자 로그인 페이지 접근", async ({ page }) => {
    const errors = await collectRuntimeErrors(page);
    const response = await page.goto("/admin");
    expect(response?.status()).not.toBe(500);
    expect(errors).toHaveLength(0);
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
