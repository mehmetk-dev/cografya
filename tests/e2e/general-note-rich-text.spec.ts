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

test("genel nota eklenen güvensiz işaretleme temizlenir", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");

  const editor = page.getByRole("textbox", { name: "Genel harita notu" });
  await editor.evaluate((element) => {
    element.innerHTML =
      '<img src="x" onerror="alert(1)"><script>alert(2)</script><b onclick="alert(3)">Güvenli bilgi</b>';
    element.dispatchEvent(new InputEvent("input", { bubbles: true }));
  });
  await page.getByRole("button", { name: "Genel notu kaydet" }).click();

  const html = await editor.evaluate((element) => element.innerHTML);
  expect(html).toContain("<b>Güvenli bilgi</b>");
  expect(html).not.toMatch(/script|img|onerror|onclick/i);

  await page.reload();
  const reopenedHtml = await page
    .getByRole("textbox", { name: "Genel harita notu" })
    .evaluate((element) => element.innerHTML);
  expect(reopenedHtml).toContain("<b>Güvenli bilgi</b>");
  expect(reopenedHtml).not.toMatch(/script|img|onerror|onclick/i);
});

test("genel not biçimlendirme araçları mobil genişliğe sığar", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390");
  await page.goto("/");

  const editor = page.getByRole("textbox", { name: "Genel harita notu" });
  await editor.scrollIntoViewIfNeeded();
  await editor.fill("Mobil madde");
  await editor.press("Control+A");
  await page
    .getByRole("button", { name: "Numaralı liste" })
    .click();
  await page.getByRole("button", { name: "Genel notu kaydet" }).click();

  expect(await editor.evaluate((element) => element.innerHTML)).toContain(
    "<ol>",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
