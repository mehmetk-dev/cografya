import { expect, test } from "@playwright/test";

test("kısa masaüstünde ile özel not paneli görünür ve not kaydedilir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1365, height: 613 });
  await page.goto("/");

  await page.getByLabel("Not eklenecek il").selectOption("6");

  const provinceHeading = page.getByRole("heading", {
    name: "Ankara",
    exact: true,
  });
  await expect(provinceHeading).toBeInViewport();

  const privateNote = page.getByPlaceholder(
    "Bu ille ilgili hatırlamak istediğin açıklamaları yaz...",
  );
  await privateNote.fill("Ankara'ya özel çalışma notum");
  await page.getByRole("button", { name: "İli kaydet" }).click();
  await expect(page.getByText("Ankara notları kaydedildi")).toBeVisible();

  await page.reload();
  await page.getByLabel("İl ara ve seç").selectOption("6");
  await expect(privateNote).toHaveValue("Ankara'ya özel çalışma notum");
});

test("mobilde ile özel not seçimi ekrana sığar", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");
  await page.goto("/");

  const cityPicker = page.getByLabel("Not eklenecek il");
  await cityPicker.scrollIntoViewIfNeeded();
  await expect(cityPicker).toBeInViewport();
  await cityPicker.selectOption("34");

  await expect(
    page.getByRole("heading", { name: "İstanbul", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
