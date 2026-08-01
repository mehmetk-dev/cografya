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

async function touchDragOnMap(
  page: Page,
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const map = page.locator(".workspace-body > .map-stage .turkey-map");
  const bounds = await map.boundingBox();
  expect(bounds).not.toBeNull();
  const session = await page.context().newCDPSession(page);
  const touchPoint = (x: number, y: number) => ({
    x: bounds!.x + x,
    y: bounds!.y + y,
    id: 1,
    radiusX: 5,
    radiusY: 5,
    force: 1,
  });

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [touchPoint(start.x, start.y)],
  });
  for (let step = 1; step <= 8; step += 1) {
    const ratio = step / 8;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        touchPoint(
          start.x + (end.x - start.x) * ratio,
          start.y + (end.y - start.y) * ratio,
        ),
      ],
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.detach();
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
  await expect(
    page.getByRole("button", { name: "Daire dolgusunu kapat" }),
  ).toHaveAttribute("aria-pressed", "true");
  await dragOnMap(page, { x: 590, y: 220 }, { x: 670, y: 300 });

  const filledCircle = page.locator(
    ".workspace-body > .map-stage .drawing-shape--filled-circle",
  );
  await expect(filledCircle).toHaveCount(1);
  await expect(filledCircle).not.toHaveAttribute("fill", "none");
  await expect(filledCircle).toHaveAttribute("fill-opacity", "0.28");

  const filledBounds = await filledCircle.boundingBox();
  expect(filledBounds).not.toBeNull();
  await page.getByRole("button", { name: "Bölgesel silgi" }).click();
  await page.mouse.click(
    filledBounds!.x + filledBounds!.width / 2,
    filledBounds!.y + filledBounds!.height / 2,
  );
  await expect(filledCircle).toHaveCount(0);
});

test("düz çizgi ve dolgulu daire mobil dokunmayla çizilir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");
  await page.goto("/");

  const lineTool = page.getByRole("button", { name: "Düz çizgi" });
  await lineTool.scrollIntoViewIfNeeded();
  await lineTool.click();
  await touchDragOnMap(page, { x: 90, y: 120 }, { x: 275, y: 200 });
  await expect(
    page.locator(".workspace-body > .map-stage .drawing-shape--line"),
  ).toHaveCount(1);

  await page.getByRole("button", { name: "Daire" }).click();
  await page
    .getByRole("button", { name: "Daire dolgusunu aç" })
    .click();
  await touchDragOnMap(page, { x: 180, y: 125 }, { x: 250, y: 195 });
  await expect(
    page.locator(
      ".workspace-body > .map-stage .drawing-shape--filled-circle",
    ),
  ).toHaveCount(1);
});
