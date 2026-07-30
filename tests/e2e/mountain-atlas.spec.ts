import { expect, test } from "@playwright/test";

test("Dağlar seti bütün adları özel atlas görünümünde gösterir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");

  await page.goto("/");
  await page
    .locator(".ready-library__list")
    .getByRole("button", { name: /Dağlar/ })
    .click();

  const atlas = page.locator(
    ".workspace-body > .map-stage.map-stage--mountain-atlas",
  );
  await expect(atlas).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Türkiye'nin Dağları",
      exact: true,
    }),
  ).toBeVisible();
  await expect(atlas.locator(".mountain-atlas-marker")).toHaveCount(68);
  await expect(atlas.locator(".mountain-atlas-label")).toHaveCount(68);
  await expect(atlas.locator(".map-marker__cluster-count")).toHaveCount(0);
  await expect(atlas.locator(".mountain-atlas-legend__item")).toHaveCount(3);
  await expect(
    page.locator(".ready-topic-picker").getByRole("button", {
      name: /^Tümü/,
    }),
  ).toHaveClass(/is-active/);

  const layout = await atlas.locator(".turkey-map").evaluate((svg) => {
    const svgBounds = svg.getBoundingClientRect();
    const labels = [
      ...svg.querySelectorAll<SVGGraphicsElement>(".mountain-atlas-label"),
    ].map((label) => {
      const bounds = label.getBoundingClientRect();
      return {
        owner:
          label.closest<SVGGElement>(".mountain-atlas-marker")?.dataset
            .presetId ?? "",
        text: label.textContent?.trim() ?? "",
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
      };
    });
    const symbols = [
      ...svg.querySelectorAll<SVGGraphicsElement>(".mountain-atlas-symbol"),
    ].map((symbol) => {
      const bounds = symbol.getBoundingClientRect();
      return {
        owner:
          symbol.closest<SVGGElement>(".mountain-atlas-marker")?.dataset
            .presetId ?? "",
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
      };
    });

    const overlapArea = (
      first: Pick<
        (typeof labels)[number],
        "left" | "right" | "top" | "bottom"
      >,
      second: Pick<
        (typeof labels)[number],
        "left" | "right" | "top" | "bottom"
      >,
    ) => {
      const width =
        Math.min(first.right, second.right) -
        Math.max(first.left, second.left);
      const height =
        Math.min(first.bottom, second.bottom) -
        Math.max(first.top, second.top);
      return Math.max(0, width) * Math.max(0, height);
    };

    const rectGap = (
      first: Pick<
        (typeof labels)[number],
        "left" | "right" | "top" | "bottom"
      >,
      second: Pick<
        (typeof labels)[number],
        "left" | "right" | "top" | "bottom"
      >,
    ) => {
      const horizontal = Math.max(
        0,
        first.left - second.right,
        second.left - first.right,
      );
      const vertical = Math.max(
        0,
        first.top - second.bottom,
        second.top - first.bottom,
      );
      return Math.hypot(horizontal, vertical);
    };

    const significantOverlaps: Array<{
      first: string;
      second: string;
      area: number;
    }> = [];
    labels.forEach((first, firstIndex) => {
      labels.slice(firstIndex + 1).forEach((second) => {
        const area = overlapArea(first, second);
        if (area > 6) {
          significantOverlaps.push({
            first: first.text,
            second: second.text,
            area,
          });
        }
      });
    });

    const symbolOverlaps: string[] = [];
    symbols.forEach((first, firstIndex) => {
      symbols.slice(firstIndex + 1).forEach((second) => {
        if (overlapArea(first, second) > 20) {
          symbolOverlaps.push(`${first.owner} / ${second.owner}`);
        }
      });
    });

    const labelSymbolOverlaps: string[] = [];
    labels.forEach((label) => {
      symbols.forEach((symbol) => {
        if (
          label.owner !== symbol.owner &&
          overlapArea(label, symbol) > 30
        ) {
          labelSymbolOverlaps.push(`${label.text} / ${symbol.owner}`);
        }
      });
    });

    const detachedLabels = labels.flatMap((label) => {
      const ownSymbol = symbols.find((symbol) => symbol.owner === label.owner);
      if (!ownSymbol) return [`${label.text}: kendi simgesi bulunamadı`];

      const ownGap = rectGap(label, ownSymbol);
      const nearestOther = symbols
        .filter((symbol) => symbol.owner !== label.owner)
        .map((symbol) => ({
          owner: symbol.owner,
          gap: rectGap(label, symbol),
        }))
        .sort((first, second) => first.gap - second.gap)[0];
      const looksAttachedToAnother =
        nearestOther && nearestOther.gap + 4 < ownGap;

      return ownGap > 24 || looksAttachedToAnother
        ? [
            `${label.text}: kendi=${ownGap.toFixed(1)}px, en yakın=${nearestOther?.owner ?? "yok"}:${nearestOther?.gap.toFixed(1) ?? "-"}px`,
          ]
        : [];
    });

    const outsideProvince = [
      ...svg.querySelectorAll<SVGGElement>(".mountain-atlas-marker"),
    ].flatMap((marker) => {
      const province = svg.querySelector<SVGGeometryElement>(
        `.province path[data-province-code="${marker.dataset.provinceCode}"]`,
      );
      const matrix = marker.transform.baseVal.consolidate()?.matrix;
      if (
        province &&
        matrix &&
        province.isPointInFill(new DOMPoint(matrix.e, matrix.f))
      ) {
        return [];
      }
      return [marker.dataset.presetId ?? "bilinmeyen-dağ"];
    });

    return {
      svgWidth: svgBounds.width,
      outside: labels
        .filter(
          (label) =>
            label.left < svgBounds.left - 1 ||
            label.right > svgBounds.right + 1 ||
            label.top < svgBounds.top - 1 ||
            label.bottom > svgBounds.bottom + 1,
        )
        .map((label) => label.text),
      hidden: labels
        .filter((label) => label.right <= label.left || label.bottom <= label.top)
        .map((label) => label.text),
      significantOverlaps,
      symbolOverlaps,
      labelSymbolOverlaps,
      detachedLabels,
      outsideProvince,
    };
  });

  expect(layout.svgWidth).toBeGreaterThan(1000);
  expect(layout.outside).toEqual([]);
  expect(layout.hidden).toEqual([]);
  expect(layout.significantOverlaps).toEqual([]);
  expect(layout.symbolOverlaps).toEqual([]);
  expect(layout.labelSymbolOverlaps).toEqual([]);
  expect(layout.detachedLabels).toEqual([]);
  expect(layout.outsideProvince).toEqual([]);
});

test("Dağlar atlası mobilde yakınlaştırılıp dokunarak sürüklenir", async ({
  context,
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");

  await page.goto("/");
  await page.getByRole("button", { name: /Hazır setler/ }).click();
  await page
    .locator(".ready-library__list")
    .getByRole("button", { name: /Dağlar/ })
    .click();

  const atlas = page.locator(
    ".workspace-body > .map-stage.map-stage--mountain-atlas",
  );
  const svg = atlas.locator(".turkey-map--mountain-atlas");
  await expect(atlas.locator(".mountain-atlas-marker")).toHaveCount(68);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);

  const zoomIn = page.getByRole("button", { name: "Yakınlaştır" });
  for (let step = 0; step < 8; step += 1) {
    await zoomIn.click();
  }

  const zoomed = await svg.evaluate((element) => ({
    minimumLabelHeight: Math.min(
      ...[
        ...element.querySelectorAll<SVGGraphicsElement>(
          ".mountain-atlas-label",
        ),
      ].map((label) => label.getBoundingClientRect().height),
    ),
    viewBox: element.getAttribute("viewBox"),
  }));
  expect(zoomed.minimumLabelHeight).toBeGreaterThanOrEqual(9.5);

  const bounds = await svg.boundingBox();
  expect(bounds).not.toBeNull();
  const centerX = bounds!.x + bounds!.width / 2;
  const centerY = bounds!.y + bounds!.height / 2;
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      {
        x: centerX,
        y: centerY,
        radiusX: 2,
        radiusY: 2,
        force: 1,
        id: 1,
      },
    ],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      {
        x: centerX - 80,
        y: centerY + 30,
        radiusX: 2,
        radiusY: 2,
        force: 1,
        id: 1,
      },
    ],
  });
  await page.waitForTimeout(80);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });

  await expect
    .poll(() => svg.getAttribute("viewBox"))
    .not.toBe(zoomed.viewBox);
});
