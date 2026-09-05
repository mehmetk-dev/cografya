import { test, expect } from '@playwright/test';

test('account data reaches SQLite, reloads on another device, and retries after an outage', async ({ browser, request }) => {
  const email = `sync-${Date.now()}-${test.info().project.name}@example.com`;
  const response = await request.post('/api/auth/signup', { data: { email, password: 'test-password-123' } });
  expect(response.ok()).toBeTruthy();
  const account = await response.json();
  const session = { access_token: account.session.access_token, user: account.user };
  const first = await browser.newContext();
  const second = await browser.newContext();
  const authenticate = async (context: typeof first) => context.addInitScript(session => {
    localStorage.removeItem('cografya_guest_mode_enabled');
    localStorage.setItem('cografya_sqlite_session', JSON.stringify(session));
  }, session);
  await authenticate(first);
  await authenticate(second);
  const page = await first.newPage();
  const other = await second.newPage();
  const getAtlas = async () => {
    const res = await request.get(`/api/atlas/data?user_id=${account.user.id}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
    return (await res.json()).row;
  };
  try {
    await page.goto('/#sorular');
    await expect(page.getByRole('heading', { name: 'Soru atölyesi.' })).toBeVisible();
    await expect.poll(async () => (await getAtlas())?.revision).toBeGreaterThan(0);
    await page.locator('.mobile-option-card').nth(3).click();
    await page.getByRole('button', { name: 'D Şıkkı ile Cevapla' }).click();
    await page.getByRole('button', { name: 'Soruyu kaydet', exact: true }).click();
    await expect.poll(async () => (await getAtlas())?.data.questionProgress?.answers['coğrafya-1']?.selectedOption).toBe('D');
    await expect.poll(async () => (await getAtlas())?.data.questionProgress?.bookmarkedIds).toContain('coğrafya-1');
    await other.goto('/#sorular');
    await other.getByRole('button', { name: /Çözülen/ }).click();
    await expect(other.getByRole('status')).toContainText('Doğru cevap');
    await expect(other.getByRole('button', { name: 'Soruyu kayıttan çıkar', exact: true })).toBeVisible();

    await page.route('**/api/atlas/**', route => route.abort());
    await page.getByRole('button', { name: 'Sıradaki Soru', exact: true }).click();
    await page.locator('.mobile-option-card').first().click();
    await page.getByRole('button', { name: 'A Şıkkı ile Cevapla' }).click();
    await page.getByRole('link', { name: 'Atlasım ana menü' }).click();
    await expect(page.getByText('Sunucu kaydı bekliyor')).toBeVisible();
    const before = await getAtlas();
    expect(before.data.questionProgress.answers['coğrafya-2']).toBeUndefined();
    await page.unroute('**/api/atlas/**');
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expect.poll(async () => (await getAtlas())?.data.questionProgress?.answers['coğrafya-2']?.selectedOption).toBe('A');
    await expect(page.getByText('SQLite’a kaydedildi')).toBeVisible();
  } finally {
    await first.close();
    await second.close();
  }
});
