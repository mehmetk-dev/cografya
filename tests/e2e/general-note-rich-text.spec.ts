import { expect, test } from "@playwright/test";

test("genel notta kalın, renkli ve madde işaretli yazı kaydedilir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");

  const editor = page.getByRole("textbox", { name: "Genel harita notu" });
  await editor.fill("Önemli bilgi");

  await editor.press("Control+A");
  await page.getByRole("button", { name: "Kalın" }).click();
  await editor.press("Control+A");
  await page
    .getByRole("button", { name: "Madde işaretli liste" })
    .click();
  await editor.press("Control+A");
  await page.getByLabel("Yazı rengi").fill("#c0392b");

  await page.getByRole("button", { name: "Genel notu kaydet" }).click();
  await expect(page.getByText("Genel harita notu kaydedildi")).toBeVisible();

  const savedHtml = await editor.evaluate((element) => element.innerHTML);
  expect(savedHtml).toMatch(/<(b|strong)>/i);
  expect(savedHtml).toContain("<ul>");
  expect(savedHtml).toMatch(/color:\s*(rgb\(192, 57, 43\)|#c0392b)/i);

  await page.reload();
  const reopenedEditor = page.getByRole("textbox", {
    name: "Genel harita notu",
  });
  await expect(reopenedEditor).toContainText("Önemli bilgi");
  const reopenedHtml = await reopenedEditor.evaluate(
    (element) => element.innerHTML,
  );
  expect(reopenedHtml).toMatch(/<(b|strong)>/i);
  expect(reopenedHtml).toContain("<ul>");
  expect(reopenedHtml).toMatch(
    /color:\s*(rgb\(192, 57, 43\)|#c0392b)/i,
  );
});
