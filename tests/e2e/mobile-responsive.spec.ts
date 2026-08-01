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

async function openReadySet(page: Page, name: RegExp) {
  const button = page
    .locator(".ready-library__list")
    .getByRole("button", { name });
  if (!(await button.isVisible())) {
    await page.getByRole("button", { name: /Hazır setler/ }).click();
  }
  await button.click();
}

async function visibleMarkerLabelCount(page: Page) {
  return page
    .locator(
      ".workspace-body > .map-stage .marker-layer .map-marker__label",
    )
    .evaluateAll(
      (labels) =>
        labels.filter(
          (label) => Number.parseFloat(getComputedStyle(label).opacity) > 0.05,
        ).length,
    );
}

test("ana çalışma ekranı mobil genişliğe sığar", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".workspace-body > .map-stage > .map-canvas"),
  ).toBeVisible();

  await expectNoHorizontalScroll(page);
});

test("kısa masaüstünde hazır setler görünür ve kenar çubuğu boşluk bırakmaz", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1365, height: 613 });
  await page.goto("/");

  const sidebar = page.locator(".map-sidebar");
  const readySetsHeading = page.getByRole("button", {
    name: /Hazır setler/,
  });
  await expect(readySetsHeading).toBeVisible();
  await expect(readySetsHeading).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("button", { name: /Haritalarım/ }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.locator(".ready-library__list").getByRole("button", {
      name: /Dağlar/,
    }),
  ).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, 80));
  await expect(readySetsHeading).toBeVisible();
  await expect
    .poll(async () =>
      sidebar.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          top: Math.round(bounds.top),
          bottom: Math.round(bounds.bottom),
        };
      }),
    )
    .toEqual({ top: 0, bottom: 613 });
});

test("hazır set ekranı mobil genişliğe sığar", async ({ page }) => {
  await page.goto("/");
  await openReadySet(page, /Dağlar/);
  await expect(
    page.getByLabel("Harita adı"),
  ).toHaveValue("Türkiye'nin Dağları");

  await expectNoHorizontalScroll(page);
});

test("plato ve millî park setleri mobilde açılır", async ({ page }) => {
  await page.goto("/");

  for (const readySet of [
    {
      button: /Platolar/,
      heading: "Türkiye'nin Platoları",
      count: "15 işaret",
    },
    {
      button: /Millî Parklar/,
      heading: "Türkiye'nin Millî Parkları",
      count: "50 işaret",
    },
  ]) {
    await openReadySet(page, readySet.button);
    await expect(
      page.getByRole("heading", { name: readySet.heading, exact: true }),
    ).toBeVisible();
    await expect(
      page.locator(".ready-set-hero__stats").getByText(readySet.count),
    ).toBeVisible();
    await expectNoHorizontalScroll(page);

    if (readySet.heading === "Türkiye'nin Platoları") {
      expect(await visibleMarkerLabelCount(page)).toBeGreaterThan(0);
    } else {
      expect(await visibleMarkerLabelCount(page)).toBe(0);
      await page
        .locator(
          ".workspace-body > .map-stage .marker-layer .map-marker .map-marker__pin",
        )
        .first()
        .hover({ force: true });
      await expect.poll(() => visibleMarkerLabelCount(page)).toBe(1);
    }
  }
});

test("millî parklar haritası PNG olarak indirilir", async ({ page }) => {
  await page.setViewportSize({ width: 1365, height: 820 });
  await page.goto("/");
  await openReadySet(page, /Millî Parklar/);
  await expect(
    page.getByRole("heading", {
      name: "Türkiye'nin Millî Parkları",
      exact: true,
    }),
  ).toBeVisible();

  const downloadPromise = page.waitForEvent("download", { timeout: 20_000 });
  await page.getByRole("button", { name: "Görsel al" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe(
    "turkiye-nin-mill-parklari-notlar.png",
  );
  await expect(
    page.getByText("Harita ve bütün notlar PNG olarak indirildi"),
  ).toBeVisible();
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
