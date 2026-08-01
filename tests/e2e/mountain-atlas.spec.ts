import { expect, test } from "@playwright/test";

async function openMountainWorkspace(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page
    .locator(".ready-library__list")
    .getByRole("button", { name: /Dağlar/ })
    .click();
}

test("Dağlar seti normal haritada elle dağ simgesi yerleştirir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await openMountainWorkspace(page);

  const map = page.locator(".workspace-body > .map-stage");
  await expect(map).toBeVisible();
  await expect(map).not.toHaveClass(/map-stage--mountain-atlas/);
  await expect(map.locator(".mountain-atlas-marker")).toHaveCount(0);
  await expect(map.locator(".marker-layer .map-marker")).toHaveCount(0);
  await expect(page.getByLabel("Harita adı")).toHaveValue(
    "Türkiye'nin Dağları",
  );

  await page.getByLabel("İl ara ve seç").selectOption("4");
  await page.getByLabel("İşaret adı").fill("Ağrı Dağı");
  await page.getByRole("button", { name: "Volkanik Dağ" }).click();
  await page.getByRole("button", { name: /Haritada konum seç/ }).click();
  await map.locator('path[data-province-code="4"]').click({ force: true });

  await expect(
    map.getByRole("button", {
      name: /Ağrı Dağı, Ağrı, Volkanik Dağ/,
    }),
  ).toBeVisible();
  await expect(page.getByText("Ağrı Dağı, Ağrı haritasına yerleştirildi")).toBeVisible();
});

test("Dağlar çalışma alanı mobilde normal harita olarak açılır", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");

  await openMountainWorkspace(page);

  const map = page.locator(".workspace-body > .map-stage");
  await expect(map).not.toHaveClass(/map-stage--mountain-atlas/);
  await expect(map.locator(".mountain-atlas-marker")).toHaveCount(0);
  await expect(page.getByLabel("Harita adı")).toHaveValue(
    "Türkiye'nin Dağları",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
