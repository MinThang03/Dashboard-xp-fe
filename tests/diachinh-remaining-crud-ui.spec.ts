import { expect, test, type Page } from '@playwright/test';

function unique(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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

test.describe.serial('Remaining Dia chinh CRUD UI smoke', () => {
  test('dia-chinh add/edit/delete + refresh', async ({ page }) => {
    const createdMaThua = unique('TD');
    const createdLoaiDat = unique('LD');
    const updatedLoaiDat = `${createdLoaiDat}_UPD`;

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/dia-chinh');
    await expect(page.getByText('Quản lý địa chính')).toBeVisible();

    await page.getByRole('button', { name: 'Thêm hồ sơ' }).click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Thêm hồ sơ địa chính' });
    await addDialog.locator('input').nth(0).fill(createdMaThua);
    await addDialog.locator('input').nth(3).fill('150');
    await addDialog.locator('input').nth(4).fill(createdLoaiDat);
    await addDialog.locator('input').nth(16).fill('Đang sử dụng');
    await addDialog.getByRole('button', { name: 'Lưu' }).click();

    await expect(await rowByText(page, createdMaThua)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdMaThua)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdMaThua);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Cập nhật hồ sơ địa chính' });
    await editDialog.locator('input').nth(4).fill(updatedLoaiDat);
    await editDialog.getByRole('button', { name: 'Cập nhật' }).click();

    await expect(await rowByText(page, updatedLoaiDat)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedLoaiDat)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedLoaiDat);
    await expect(await rowByText(page, updatedLoaiDat)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedLoaiDat)).toHaveCount(0, { timeout: 15000 });
  });

  test('bien-dong-dat add/edit/delete + refresh', async ({ page }) => {
    const createdOwnerOld = unique('BO');
    const updatedOwnerOld = `${createdOwnerOld}UP`;
    let existingMaThua = 'TDTH56952018';

    const listResponse = await page.request.get('http://localhost:3006/api/bien-dong-dat?page=1&limit=1&loaiBanGhi=BIEN_DONG_DAT');
    if (listResponse.ok()) {
      const listBody = await listResponse.json();
      const maThua = listBody?.data?.[0]?.MaThua;
      if (maThua) {
        existingMaThua = String(maThua);
      }
    }

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/bien-dong-dat');
    await expect(page.getByRole('heading', { name: 'Quản lý Biến động Đất đai' })).toBeVisible();

    await page.getByRole('button', { name: 'Thêm biến động' }).first().click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Ghi nhận biến động đất đai mới' });
    await addDialog.locator('button[role="combobox"]').first().click();
    await page.getByRole('option', { name: 'Tách thửa', exact: true }).click();
    await addDialog.locator('input[placeholder="Nhập mã thửa"]').fill(existingMaThua);
    await addDialog.locator('input[placeholder="Nhập số tờ"]').fill('99');
    await addDialog.locator('input[placeholder="Nhập tên chủ sở hữu cũ"]').fill(createdOwnerOld);
    await addDialog.locator('input[placeholder="Nhập tên chủ sở hữu mới"]').fill('Owner B');
    await addDialog.getByRole('button', { name: 'Lưu biến động' }).click();

    await expect(await rowByText(page, createdOwnerOld)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdOwnerOld)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdOwnerOld);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Cập nhật biến động' });
    await editDialog.locator('input').nth(4).fill(updatedOwnerOld);
    await editDialog.getByRole('button', { name: 'Cập nhật' }).click();

    await expect(await rowByText(page, updatedOwnerOld)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedOwnerOld)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedOwnerOld);
    await expect(await rowByText(page, updatedOwnerOld)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedOwnerOld)).toHaveCount(0, { timeout: 15000 });
  });

  test('cap-so-do add/edit/delete + refresh', async ({ page }) => {
    const createdOwner = unique('OWN');
    const updatedOwner = `${createdOwner}_UPD`;
    const createdMaThua = unique('TH');

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/cap-so-do');
    await expect(page.getByRole('heading', { name: 'Quản lý Cấp Sổ đỏ' })).toBeVisible();

    await page.getByRole('button', { name: 'Tiếp nhận hồ sơ' }).first().click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Tiếp nhận hồ sơ cấp sổ đỏ mới' });
    await addDialog.locator('input[placeholder="Nhập họ tên chủ sở hữu"]').fill(createdOwner);
    await addDialog.locator('input[placeholder="Nhập số CCCD"]').fill('012345678901');
    await addDialog.locator('input[placeholder="Nhập mã thửa"]').fill(createdMaThua);
    await addDialog.locator('input[placeholder="Nhập số tờ"]').fill('88');
    await addDialog.locator('input[placeholder="Nhập diện tích"]').fill('120');
    await addDialog.locator('button[role="combobox"]').first().click();
    await page.getByRole('option', { name: 'Đất ở', exact: true }).click();
    await addDialog.getByRole('button', { name: 'Tiếp nhận' }).click();

    await expect(await rowByText(page, createdOwner)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdOwner)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdOwner);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Cập nhật hồ sơ' });
    await editDialog.locator('input').first().fill(updatedOwner);
    await editDialog.getByRole('button', { name: 'Cập nhật' }).click();

    await expect(await rowByText(page, updatedOwner)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedOwner)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedOwner);
    await expect(await rowByText(page, updatedOwner)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedOwner)).toHaveCount(0, { timeout: 15000 });
  });

  test('tranh-chap add/edit/delete + refresh', async ({ page }) => {
    const createdComplainant = unique('KN');
    const updatedLoaiTranhChap = unique('LC');
    let existingMaThua = 'TDTH56952018';

    const listResponse = await page.request.get('http://localhost:3006/api/bien-dong-dat?page=1&limit=1&loaiBanGhi=TRANH_CHAP_DAT');
    if (listResponse.ok()) {
      const listBody = await listResponse.json();
      const maThua = listBody?.data?.[0]?.MaThua;
      if (maThua) {
        existingMaThua = String(maThua);
      }
    }

    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/dashboard/tranh-chap');
    await expect(page.getByRole('heading', { name: 'Quản lý Tranh chấp Đất đai' })).toBeVisible();

    await page.getByRole('button', { name: 'Thêm vụ việc' }).click();
    const addDialog = page.getByRole('dialog').filter({ hasText: 'Tiếp nhận vụ tranh chấp mới' });
    await addDialog.locator('button[role="combobox"]').first().click();
    await page.getByRole('option', { name: 'Tranh chấp ranh giới', exact: true }).click();
    await addDialog.locator('input[placeholder="Nhập mã thửa"]').fill(existingMaThua);
    await addDialog.locator('input[placeholder="Nhập số tờ"]').fill('77');
    await addDialog.locator('input[placeholder="Nhập họ tên"]').first().fill(createdComplainant);
    await addDialog.locator('input[placeholder="Nhập họ tên"]').nth(1).fill('Ben B');
    await addDialog.locator('textarea[placeholder="Mô tả chi tiết nội dung tranh chấp"]').fill('Noi dung smoke test');
    await addDialog.getByRole('button', { name: 'Tiếp nhận' }).click();

    await expect(await rowByText(page, createdComplainant)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, createdComplainant)).toBeVisible({ timeout: 15000 });

    await openEditFromRow(page, createdComplainant);
    const editDialog = page.getByRole('dialog').filter({ hasText: 'Cập nhật vụ tranh chấp' });
    await editDialog.locator('input').first().fill(updatedLoaiTranhChap);
    await editDialog.getByRole('button', { name: 'Cập nhật' }).click();

    await expect(await rowByText(page, updatedLoaiTranhChap)).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedLoaiTranhChap)).toBeVisible({ timeout: 15000 });

    await deleteFromRow(page, updatedLoaiTranhChap);
    await expect(await rowByText(page, updatedLoaiTranhChap)).toHaveCount(0, { timeout: 15000 });
    await page.reload();
    await expect(await rowByText(page, updatedLoaiTranhChap)).toHaveCount(0, { timeout: 15000 });
  });
});
