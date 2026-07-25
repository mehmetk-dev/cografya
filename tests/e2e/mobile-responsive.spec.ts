import { expect, test, type Page } from "@playwright/test";

const responsiveSurfaces = [
  ".map-list",
  ".ready-library__list",
  ".workspace",
  ".map-canvas",
  ".province-panel",
];

async function expectNoHorizontalScroll(page: Page, selectors = responsiveSurfaces) {
  const measurements = await page.evaluate((targets) => {
    const elements = targets.flatMap((selector) =>
      [...document.querySelectorAll<HTMLElement>(selector)].map((element) => ({
        selector,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      })),
    );

    return {
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      elements,
    };
  }, selectors);

  expect(measurements.documentWidth).toBeLessThanOrEqual(
    measurements.viewportWidth,
  );
  for (const element of measurements.elements) {
    expect(
      element.scrollWidth,
      `${element.selector} yatay kaydırma oluşturmamalı`,
    ).toBeLessThanOrEqual(element.clientWidth + 1);
  }
}

test("ana çalışma ekranı mobil genişliğe sığar", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".workspace-body > .map-stage > .map-canvas"),
  ).toBeVisible();

  await expectNoHorizontalScroll(page);
});

test("hazır set ekranı mobil genişliğe sığar", async ({ page }) => {
  await page.goto("/");
  await page
    .locator(".ready-library__list")
    .getByRole("button", { name: /Dağlar/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Türkiye'nin Dağları", exact: true }),
  ).toBeVisible();

  await expectNoHorizontalScroll(page);
});

test("quiz ve istatistik pencereleri mobil genişliğe sığar", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Test modu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectNoHorizontalScroll(page, [
    ".modal-backdrop",
    ".quiz-modal",
    ".quiz-map",
    ".quiz-map .map-canvas",
  ]);
  await page.getByRole("button", { name: "Testi kapat" }).click();

  await page.getByRole("button", { name: "İlerleme" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectNoHorizontalScroll(page, [".modal-backdrop", ".stats-modal"]);
});
