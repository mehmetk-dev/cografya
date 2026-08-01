import { expect, test } from "@playwright/test";

test("metin aracıyla haritaya 0.5x boyutunda yazı eklenir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");

  await page.getByRole("button", { name: "Metin" }).click();
  const shrinkButton = page.getByRole("button", {
    name: "Yazıyı küçült",
  });
  await expect(shrinkButton).toBeEnabled();
  await shrinkButton.click();
  await expect(
    page.getByRole("status", { name: "Seçili yazı boyutu" }),
  ).toHaveText("0.5×");

  page.once("dialog", (dialog) => dialog.accept("Minik yazı"));
  const map = page.locator(".workspace-body > .map-stage .turkey-map");
  await map.click({ position: { x: 420, y: 240 } });

  const drawing = page.locator(
    ".workspace-body > .map-stage .drawing-layer .drawing-text",
    { hasText: "Minik yazı" },
  );
  await expect(drawing).toBeVisible();
  await expect(drawing).toHaveCSS("font-size", "9.5px");
});
