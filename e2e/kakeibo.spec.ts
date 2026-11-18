import { test, expect } from '@playwright/test';

test('収入と支出の登録・保存・削除ができる', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('種類').selectOption('income');
  await page.getByLabel('内容').fill('給与');
  await page.getByLabel('金額（円）').fill('300000');
  await page.getByRole('button', { name: '登録する' }).click();
  await page.getByLabel('種類').selectOption('expense');
  await page.getByLabel('内容').fill('食費');
  await page.getByLabel('金額（円）').fill('1000');
  await page.getByRole('button', { name: '登録する' }).click();
  await expect(page.locator('#balance')).toHaveText('299,000円');
  await page.reload();
  await expect(page.locator('#balance')).toHaveText('299,000円');
  await page.screenshot({ path: 'kakeibo-result.png', fullPage: true });
  await page.getByRole('button', { name: '食費を削除' }).click();
  await expect(page.locator('#balance')).toHaveText('300,000円');
});
