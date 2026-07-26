import { expect, test } from "@playwright/test";

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
