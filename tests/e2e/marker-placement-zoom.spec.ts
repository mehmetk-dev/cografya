import { expect, test } from "@playwright/test";

test("yakınlaştırılmış haritada konum seçimi sürükleme yerine işaret bırakır", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");

  await page.getByLabel("Not eklenecek il").selectOption("6");
  await page.locator("details.marker-editor > summary").click();
  await page.getByRole("textbox", { name: "İşaret adı" }).fill("Test konumu");

  await page.getByRole("button", { name: "Yakınlaştır" }).click();
  await page.getByRole("button", { name: "Yakınlaştır" }).click();
  await page.getByRole("button", { name: "Haritada konum seç" }).click();

  const map = page.locator(".workspace-body > .map-stage .turkey-map");
  const targetProvince = map.locator(
    ".province--placement-target [data-province-code='6']",
  );

  await expect(map).not.toHaveClass(/turkey-map--pannable/);
  await expect(targetProvince).toHaveCSS("cursor", "crosshair");

  await targetProvince.click();
  await expect(
    page.getByText("Test konumu, Ankara haritasına yerleştirildi"),
  ).toBeVisible();
  await expect(map.locator(".marker-layer .map-marker")).toHaveCount(1);
  await expect(map).toHaveClass(/turkey-map--pannable/);
});

test("yakınlaştırılmış mobil haritada hedef ile dokunarak işaret bırakılır", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");
  await page.goto("/");

  await page.getByLabel("Not eklenecek il").selectOption("6");
  await page.locator("details.marker-editor > summary").click();
  await page
    .getByRole("textbox", { name: "İşaret adı" })
    .fill("Mobil test konumu");
  await page.getByRole("button", { name: "Yakınlaştır" }).click();
  await page.getByRole("button", { name: "Yakınlaştır" }).click();
  await page.getByRole("button", { name: "Haritada konum seç" }).click();

  const map = page.locator(".workspace-body > .map-stage .turkey-map");
  const targetProvince = map.locator(
    ".province--placement-target [data-province-code='6']",
  );
  await targetProvince.scrollIntoViewIfNeeded();
  const bounds = await targetProvince.boundingBox();
  expect(bounds).not.toBeNull();

  await page.touchscreen.tap(
    (bounds?.x ?? 0) + (bounds?.width ?? 0) / 2,
    (bounds?.y ?? 0) + (bounds?.height ?? 0) / 2,
  );
  await expect(
    page.getByText("Mobil test konumu, Ankara haritasına yerleştirildi"),
  ).toBeVisible();
});
