import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cografya_guest_mode_enabled', 'true'));
});

test('answer feedback remains visible, bookmarks persist and wrong answers can be retried', async ({ page }) => {
  await page.goto('/#sorular');
  await expect(page.getByRole('heading', { name: 'Soru atölyesi.' })).toBeVisible();
  const stem = await page.locator('.mobile-sheet-stem').innerText();
  await page.locator('.mobile-option-card').first().click();
  await page.getByRole('button', { name: 'Kararsızım', exact: true }).click();
  await page.getByRole('button', { name: 'A Şıkkı ile Cevapla' }).click();
  expect(await page.locator('.mobile-sheet-stem').innerText()).toBe(stem);
  await expect(page.getByRole('status')).toContainText('doğru yanıt D');
  await expect(page.getByLabel('Açıklamalı çözüm')).toBeVisible();
  await page.getByRole('button', { name: 'Daha sonra tekrar etmek için kaydet' }).click();
  await page.reload();
  await page.getByRole('button', { name: /Yanlışlar/ }).click();
  await expect(page.locator('.mobile-sheet-stem')).toContainText('Uluslararası doğal gaz');
  await page.getByRole('button', { name: 'Tekrar çöz', exact: true }).click();
  await page.locator('.mobile-option-card').nth(3).click();
  await page.getByRole('button', { name: 'D Şıkkı ile Cevapla' }).click();
  await expect(page.getByRole('status')).toContainText('Doğru cevap');
  await expect(page.getByRole('button', { name: 'Soruyu kayıttan çıkar', exact: true })).toBeVisible();
  await page.screenshot({ path: `test-results/workshop-${test.info().project.name}.png`, fullPage: true });
});

test('study pages share navigation and fit the viewport', async ({ page }) => {
  for (const hash of ['#tarih-zinciri', '#ataturk-ve-inkilap', '#konu-notlari', '#sorular']) {
    await page.goto('/' + hash);
    await expect(page.getByRole('navigation', { name: 'Çalışma sayfaları' })).toBeVisible();
    await expect(page.locator('.study-navigation [aria-current="page"]')).toHaveCount(1);
    const overflow = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('main, header, section')]
      .filter(e => e.getBoundingClientRect().width > innerWidth + 2 && getComputedStyle(e).position !== 'fixed')
      .map(e => ({ class: e.className, width: e.getBoundingClientRect().width })));
    expect(overflow).toEqual([]);
    await page.screenshot({ path: `test-results/${hash.slice(1)}-${test.info().project.name}.png`, fullPage: false });
  }
  await page.getByRole('link', { name: 'Atlasım ana menü' }).click();
  await expect(page.locator('.app-shell')).toBeVisible();
});

test('filter dialog is keyboard accessible and reset affects only the selected subject', async ({ page }) => {
  await page.goto('/#sorular');
  await page.evaluate(() => localStorage.setItem('kpss-soru-havuzu-user-store-v1', JSON.stringify({
    answers: {
      'coğrafya-1': { selectedOption: 'D', isCorrect: true, answeredAt: new Date().toISOString() },
      'tarih-1': { selectedOption: 'A', isCorrect: false, answeredAt: new Date().toISOString() },
    }, bookmarkedIds: ['coğrafya-1'],
  })));
  await page.reload();
  await page.getByRole('button', { name: 'Soru listesi ve filtreler', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Soru listesi ve filtreler', exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Bu Dersteki Tüm İlerlememi Sıfırla' }).click();
  const store = await page.evaluate(() => JSON.parse(localStorage.getItem('kpss-soru-havuzu-user-store-v1')!));
  expect(store.answers['coğrafya-1']).toBeUndefined();
  expect(store.answers['tarih-1']).toBeDefined();
  expect(store.bookmarkedIds).toContain('coğrafya-1');
});
