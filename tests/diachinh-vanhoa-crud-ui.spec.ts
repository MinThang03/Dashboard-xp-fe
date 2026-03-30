import { expect, test, type Page } from '@playwright/test';

function unique(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.waitForURL('**/dashboard', { timeout: 30000 });
}

async function rowByText(page: Page, text: string) {
  return page.locator('tbody tr').filter({ hasText: text }).first();
}

async function openEditFromRow(page: Page, rowText: string) {
  const row = await rowByText(page, rowText);
  await expect(row).toBeVisible();
  await row.locator('button').nth(1).click();
}

async function deleteFromRow(page: Page, rowText: string) {
  const row = await rowByText(page, rowText);
  await expect(row).toBeVisible();
  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });
  await row.locator('button').last().click();
}

test.describe.serial('Dia chinh + Van hoa CRUD UI smoke', () => {
  test('di-tich add/edit/delete + refresh', async ({ page }) => {
    const createdName = unique('UI_SMOKE_DT');
    const updatedName = `${createdName}_UPD`;

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/di-tich');
    await expect(page.getByRole('heading', { name: 'Quản lý Di tích' })).toBeVisible();

    await page.getByRole('button', { name: 'Thêm di tích', exact: true }).first().click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Thêm Di tích mới' });
    await addDialog.locator('input[placeholder="Nhập tên di tích"]').fill(createdName);
    await addDialog.locator('input[placeholder="Vd: Kiến trúc tín ngưỡng"]').fill('Smoke UI');
    await addDialog.locator('input[placeholder="Thôn, xã"]').fill('KP Smoke');
    await addDialog.getByRole('button', { name: 'Thêm di tích', exact: true }).click();

    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdName);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Chỉnh sửa Di tích' });
    await editDialog.locator('input').first().fill(updatedName);
    await editDialog.getByRole('button', { name: 'Lưu thay đổi' }).click();

    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedName);
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
  });

  test('ho-so-di-tich add/edit/delete + refresh', async ({ page }) => {
    const createdName = unique('UI_SMOKE_HSDT');
    const updatedName = `${createdName}_UPD`;

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/ho-so-di-tich');
    await expect(page.getByRole('heading', { name: 'Hồ sơ Di tích' })).toBeVisible();

    await page.getByRole('button', { name: 'Thêm hồ sơ', exact: true }).first().click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Thêm Hồ sơ mới' });
    await addDialog.locator('input[placeholder="Nhập tên di tích"]').fill(createdName);
    await addDialog.locator('input[placeholder="Vd: Hồ sơ xếp hạng"]').fill('Smoke UI');
    await addDialog.locator('input[placeholder="UBND xã, Ban quản lý..."]').fill('Tester');
    await addDialog.getByRole('button', { name: 'Thêm hồ sơ', exact: true }).click();

    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdName);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Chỉnh sửa Hồ sơ' });
    await editDialog.locator('input').first().fill(updatedName);
    await editDialog.getByRole('button', { name: 'Lưu thay đổi' }).click();

    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedName);
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
  });

  test('le-hoi add/edit/delete + refresh', async ({ page }) => {
    const createdName = unique('UI_SMOKE_LH');
    const updatedName = `${createdName}_UPD`;

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/le-hoi');
    await expect(page.getByRole('heading', { name: 'Lễ hội - Sự kiện' })).toBeVisible();

    await page.getByRole('button', { name: 'Thêm lễ hội', exact: true }).first().click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Thêm Lễ hội mới' });
    await addDialog.locator('input[placeholder="Nhập tên lễ hội"]').fill(createdName);
    await addDialog.locator('input[placeholder="Vd: Truyền thống, Văn hóa..."]').fill('Smoke UI');
    await addDialog.locator('input[placeholder="Địa điểm tổ chức"]').fill('KP Smoke');
    await addDialog.getByRole('button', { name: 'Thêm lễ hội', exact: true }).click();

    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdName);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Chỉnh sửa Lễ hội' });
    await editDialog.locator('input').first().fill(updatedName);
    await editDialog.getByRole('button', { name: 'Lưu thay đổi' }).click();

    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedName);
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
  });

  test('lang-nghe add/edit/delete + refresh', async ({ page }) => {
    const createdName = unique('UI_SMOKE_LN');
    const updatedName = `${createdName}_UPD`;

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/lang-nghe');
    await expect(page.getByRole('heading', { name: 'Quản lý Làng nghề truyền thống' })).toBeVisible();

    await page.getByRole('button', { name: 'Thêm làng nghề', exact: true }).first().click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Thêm làng nghề mới' });
    await addDialog.locator('input[placeholder="VD: LN-006"]').fill(unique('LN'));
    await addDialog.locator('input').nth(1).fill(createdName);
    await addDialog.locator('input[placeholder="VD: Gốm sứ, Mộc mỹ nghệ..."]').fill('Smoke UI');
    await addDialog.getByRole('button', { name: 'Thêm mới', exact: true }).click();

    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdName);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Cập nhật làng nghề' });
    await editDialog.locator('input').first().fill(updatedName);
    await editDialog.getByRole('button', { name: 'Lưu thay đổi' }).click();

    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedName);
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
  });

  test('kinh-doanh-du-lich add/edit/delete + refresh', async ({ page }) => {
    const createdName = unique('UI_SMOKE_DL');
    const updatedName = `${createdName}_UPD`;

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/kinh-doanh-du-lich');
    await expect(page.getByRole('heading', { name: 'Kinh doanh Du lịch' })).toBeVisible();

    await page.getByRole('button', { name: 'Thêm cơ sở', exact: true }).first().click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Thêm cơ sở du lịch mới' });
    await addDialog.locator('input[placeholder="VD: DL-008"]').fill(unique('DL'));
    await addDialog.locator('input').nth(1).fill(createdName);
    await addDialog.locator('input').nth(2).fill('Tester');
    await addDialog.locator('input').nth(3).fill('0900000000');
    await addDialog.getByRole('button', { name: 'Thêm mới', exact: true }).click();

    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdName)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdName);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Cập nhật cơ sở du lịch' });
    await editDialog.locator('input').first().fill(updatedName);
    await editDialog.getByRole('button', { name: 'Lưu thay đổi' }).click();

    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedName);
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedName)).toHaveCount(0, { timeout: 15000 });
  });

  test('rui-ro-quy-hoach add/edit/delete + refresh', async ({ page }) => {
    const createdArea = unique('UI_SMOKE_RRQH');
    const updatedArea = `${createdArea}_UPD`;

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/rui-ro-quy-hoach');
    await expect(page.getByRole('heading', { name: 'Đánh giá Rủi ro Quy hoạch (AI)' })).toBeVisible();

    await page.getByRole('button', { name: 'Phân tích mới' }).click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Yêu cầu phân tích rủi ro mới' });
    await addDialog.locator('input[placeholder="Nhập tên khu vực"]').fill(createdArea);
    await addDialog.locator('input[placeholder="Nhập địa chỉ chi tiết"]').fill('KP Smoke');
    await addDialog.locator('input[placeholder="VD: 100-150"]').fill('101-109');
    await addDialog.getByRole('button', { name: 'Chạy phân tích AI' }).click();

    await expect(await rowByText(page, createdArea)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdArea)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdArea);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Cập nhật phân tích rủi ro' });
    await editDialog.locator('input').first().fill(updatedArea);
    await editDialog.getByRole('button', { name: 'Cập nhật' }).click();

    await expect(await rowByText(page, updatedArea)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedArea)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedArea);
    await expect(await rowByText(page, updatedArea)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedArea)).toHaveCount(0, { timeout: 15000 });
  });
});
