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
        text: label.textContent?.trim() ?? "",
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
      };
    });

    return {
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
    };
  });

  expect(layout.outside).toEqual([]);
  expect(layout.hidden).toEqual([]);
});
