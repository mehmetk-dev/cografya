import { expect, test } from "@playwright/test";

test("kısa masaüstünde ile özel not paneli görünür ve not kaydedilir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 1365, height: 613 });
  await page.goto("/");

  await page.getByLabel("Not eklenecek il").selectOption("6");

  const provinceHeading = page.getByRole("heading", {
    name: "Ankara",
    exact: true,
  });
  await expect(provinceHeading).toBeInViewport();

  const privateNote = page.getByPlaceholder(
    "Bu ille ilgili hatırlamak istediğin açıklamaları yaz...",
  );
  await privateNote.fill("Ankara'ya özel çalışma notum");
  await page.getByRole("button", { name: "İli kaydet" }).click();
  await expect(page.getByText("Ankara notları kaydedildi")).toBeVisible();

  await page.reload();
  await page.getByLabel("İl ara ve seç").selectOption("6");
  await expect(privateNote).toHaveValue("Ankara'ya özel çalışma notum");
});
