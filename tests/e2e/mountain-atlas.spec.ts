import { expect, test } from "@playwright/test";

async function openMountainWorkspace(page: import("@playwright/test").Page) {
  await page.goto("/");
  const button = page
    .locator(".ready-library__list")
    .getByRole("button", { name: /Dağlar/ });
  if ((page.viewportSize()?.width ?? 0) <= 640) {
    await page.getByRole("button", { name: /Hazır setler/ }).click();
  }
  await expect(button).toBeVisible();
  await button.click();
}

test("Dağlar setinde şekil doğrudan yerleştirilir, taşınır, büyütülür ve döndürülür", async ({
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

  await expect(
    page.getByRole("button", { name: "Kıvrım dağ şekli" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Kırık dağ şekli" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Volkanik dağ şekli" }).click();

  const svg = map.locator(".turkey-map");
  const svgBounds = await svg.boundingBox();
  expect(svgBounds).not.toBeNull();
  await svg.click({
    position: {
      x: svgBounds!.width * 0.58,
      y: svgBounds!.height * 0.52,
    },
  });

  const symbol = map.locator(
    ".drawing-mountain-symbol--mountain-volcanic",
  );
  await expect(symbol).toHaveCount(1);

  await page.getByRole("button", { name: "Seç ve taşı" }).click();
  const beforeMove = await symbol.boundingBox();
  expect(beforeMove).not.toBeNull();
  await page.mouse.move(
    beforeMove!.x + beforeMove!.width / 2,
    beforeMove!.y + beforeMove!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    beforeMove!.x + beforeMove!.width / 2 + 70,
    beforeMove!.y + beforeMove!.height / 2 + 25,
    { steps: 5 },
  );
  await page.mouse.up();
  await expect
    .poll(async () => (await symbol.boundingBox())?.x ?? 0)
    .toBeGreaterThan(beforeMove!.x + 40);

  await symbol.click({ force: true });
  const resizeHandle = map.locator(
    ".drawing-transform-controls .map-label-resize-handle",
  );
  await expect(resizeHandle).toBeVisible();
  const beforeResize = await symbol.boundingBox();
  const resizeBounds = await resizeHandle.boundingBox();
  expect(beforeResize).not.toBeNull();
  expect(resizeBounds).not.toBeNull();
  await page.mouse.move(
    resizeBounds!.x + resizeBounds!.width / 2,
    resizeBounds!.y + resizeBounds!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    resizeBounds!.x + resizeBounds!.width / 2 + 36,
    resizeBounds!.y + resizeBounds!.height / 2 + 24,
    { steps: 5 },
  );
  await page.mouse.up();
  await expect
    .poll(async () => (await symbol.boundingBox())?.width ?? 0)
    .toBeGreaterThan(beforeResize!.width * 1.15);

  const rotateHandle = map.locator(
    ".drawing-transform-controls .map-label-rotate-handle",
  );
  const rotateBounds = await rotateHandle.boundingBox();
  expect(rotateBounds).not.toBeNull();
  await page.mouse.move(
    rotateBounds!.x + rotateBounds!.width / 2,
    rotateBounds!.y + rotateBounds!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    rotateBounds!.x + rotateBounds!.width / 2 + 42,
    rotateBounds!.y + rotateBounds!.height / 2 + 24,
    { steps: 5 },
  );
  await page.mouse.up();
  await expect(symbol).toHaveAttribute("data-rotation", /^(?!0$).+/);
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

test("eski özel dağ atlasını normale çevirirken elle eklenen işareti korur", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/");
  await expect(page.locator(".workspace-body > .map-stage")).toBeVisible();
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("cografya-atlasim");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const now = "2026-08-01T12:00:00.000Z";

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        ["studyMaps", "mapMarkers"],
        "readwrite",
      );
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.objectStore("studyMaps").clear();
      transaction.objectStore("mapMarkers").clear();
      transaction.objectStore("studyMaps").add({
        id: "legacy-mountains",
        sourceSetId: "mountains",
        presentation: "mountain-atlas",
        name: "Türkiye'nin Dağları",
        description: "Eski özel atlas",
        themeColor: "#a85d42",
        showLabels: true,
        createdAt: now,
        updatedAt: now,
      });
      transaction.objectStore("mapMarkers").add({
        id: "generated-marker",
        mapId: "legacy-mountains",
        provinceCode: 4,
        provinceName: "Ağrı",
        x: 0,
        y: 0,
        label: "Otomatik Ağrı Dağı",
        description: "Hazır atlas kaydı",
        kind: "mountain",
        subtype: "mountain-volcanic",
        color: "#c8563f",
        anchoredToProvince: true,
        presetItemId: "agri",
        createdAt: now,
      });
      transaction.objectStore("mapMarkers").add({
        id: "manual-marker",
        mapId: "legacy-mountains",
        provinceCode: 4,
        provinceName: "Ağrı",
        x: 0,
        y: 0,
        label: "Benim eklediğim dağ",
        description: "Elle eklenen kayıt",
        kind: "mountain",
        subtype: "mountain-fold",
        color: "#9c6548",
        anchoredToProvince: true,
        createdAt: now,
      });
    });
    database.close();
    localStorage.setItem(
      "cografya-atlasim-active-map",
      "legacy-mountains",
    );
  });

  await page.reload();

  const map = page.locator(".workspace-body > .map-stage");
  await expect(map).not.toHaveClass(/map-stage--mountain-atlas/);
  await expect(
    map.getByRole("button", { name: /Benim eklediğim dağ/ }),
  ).toBeVisible();
  await expect(
    map.getByRole("button", { name: /Otomatik Ağrı Dağı/ }),
  ).toHaveCount(0);
});
