import { expect, test, type Page } from "@playwright/test";

async function touchDragAcrossProvinces(
  page: Page,
  startCode: number,
  endCode: number,
) {
  const start = await page
    .locator(
      `.workspace-body > .map-stage [data-province-code="${startCode}"]`,
    )
    .boundingBox();
  const end = await page
    .locator(
      `.workspace-body > .map-stage [data-province-code="${endCode}"]`,
    )
    .boundingBox();
  if (!start || !end) throw new Error("İl yolu ekranda bulunamadı");

  const from = {
    x: start.x + start.width / 2,
    y: start.y + start.height / 2,
  };
  const to = {
    x: end.x + end.width / 2,
    y: end.y + end.height / 2,
  };
  const session = await page.context().newCDPSession(page);
  const touchPoint = (x: number, y: number) => ({
    x,
    y,
    id: 1,
    radiusX: 5,
    radiusY: 5,
    force: 1,
  });

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [touchPoint(from.x, from.y)],
  });
  for (let step = 1; step <= 10; step += 1) {
    const ratio = step / 10;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        touchPoint(
          from.x + (to.x - from.x) * ratio,
          from.y + (to.y - from.y) * ratio,
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

test("kullanıcı Karadeniz illerini topluca boyayıp kaldırabilir", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Bölge boyama" }).click();
  const panel = page.getByRole("region", { name: "Bölge boyama paneli" });
  await expect(panel).toBeVisible();

  await panel.getByRole("button", { name: "Karadeniz bölgesini uygula" }).click();
  await expect(panel.getByText("18 il boyalı")).toBeVisible();

  await panel.getByRole("button", { name: "Silgi" }).click();
  await panel.getByRole("button", { name: "Karadeniz bölgesini kaldır" }).click();
  await expect(panel.getByText("0 il boyalı")).toBeVisible();
});

test("kullanıcı gerçek dokunma hareketiyle komşu illeri boyayıp silebilir", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Bölge boyama" }).click();
  const panel = page.getByRole("region", { name: "Bölge boyama paneli" });
  await panel
    .getByRole("button", { name: "Haritada boyamaya başla" })
    .click();

  await touchDragAcrossProvinces(page, 34, 41);
  const filledProvinces = page.locator(
    ".workspace-body > .map-stage .province--region-filled",
  );
  await expect(filledProvinces).toHaveCount(2);

  await panel.getByRole("button", { name: "Bölge ayarlarını aç" }).click();
  await panel.getByRole("button", { name: "Silgi" }).click();
  await panel
    .getByRole("button", { name: "Haritada silmeye başla" })
    .click();
  await touchDragAcrossProvinces(page, 34, 41);
  await expect(filledProvinces).toHaveCount(0);
});
