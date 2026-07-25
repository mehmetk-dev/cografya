import { expect, test } from "@playwright/test";

test("bilgi kartı turu mobilde çalışır ve ilerlemeyi cihazda saklar", async ({
  page,
}) => {
  await page.goto("/#konu-notlari");
  await expect(
    page.getByRole("heading", { name: "Ders notların" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Kartlarla çalış" }).click();
  await expect(
    page.getByRole("heading", { name: "KPSS Bilgi Kartları" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Cevabı göster" }).click();
  await expect(page.getByText("CEVAP", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Tekrar et/ }).click();

  const savedProgress = await page.evaluate(() =>
    JSON.parse(
      localStorage.getItem("cografya-atlasim-flashcard-progress-v1") ?? "{}",
    ),
  );
  expect(Object.values(savedProgress)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ repeatCount: 1, lastRating: "again" }),
    ]),
  );

  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});
