import { expect, test, type Page } from "@playwright/test";

async function dragOnMap(
  page: Page,
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const map = page.locator(".workspace-body > .map-stage .turkey-map");
  const bounds = await map.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + start.x, bounds!.y + start.y);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + end.x, bounds!.y + end.y, {
    steps: 6,
  });
  await page.mouse.up();
}

test("düz çizgi çekilir ve dairenin iç dolgusu açılır", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");

  await page.getByRole("button", { name: "Düz çizgi" }).click();
  await dragOnMap(page, { x: 310, y: 210 }, { x: 520, y: 300 });
  const line = page.locator(
    ".workspace-body > .map-stage .drawing-shape--line",
  );
  await expect(line).toHaveCount(1);
  expect(Number(await line.getAttribute("x2"))).toBeGreaterThan(
    Number(await line.getAttribute("x1")),
  );

  await page.getByRole("button", { name: "Daire" }).click();
  const fillButton = page.getByRole("button", {
    name: "Daire dolgusunu aç",
  });
  await fillButton.click();
  await expect(fillButton).toHaveAttribute("aria-pressed", "true");
  await dragOnMap(page, { x: 590, y: 220 }, { x: 670, y: 300 });

  const filledCircle = page.locator(
    ".workspace-body > .map-stage .drawing-shape--filled-circle",
  );
  await expect(filledCircle).toHaveCount(1);
  await expect(filledCircle).not.toHaveAttribute("fill", "none");
  await expect(filledCircle).toHaveAttribute("fill-opacity", "0.28");
});
