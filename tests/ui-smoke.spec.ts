import { test, expect } from 'playwright/test';

test('ui smoke load thu-ngan-sach', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard/thu-ngan-sach');
  await expect(page.getByText('Theo dõi Thu ngân sách')).toBeVisible();
});
