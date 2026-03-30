/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const FE_BASE = 'http://localhost:3000';
const BE_BASE = 'http://localhost:3006/api';

const results = [];

function nowCode(prefix) {
  return `${prefix}${Date.now().toString().slice(-8)}`;
}

function normalizeText(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

function compareValue(expected, actual) {
  if (typeof expected === 'number') {
    return Number(actual) === expected;
  }

  const e = normalizeText(expected);
  const a = normalizeText(actual);

  if (/^\d{4}-\d{2}-\d{2}$/.test(e)) {
    return a.startsWith(e);
  }

  return e === a;
}

function record(moduleName, phase, field, expected, actual, pass, note = '') {
  results.push({
    module: moduleName,
    phase,
    field,
    expected,
    actual,
    status: pass ? 'PASS' : 'FAIL',
    note,
  });
}

async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${BE_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function waitForRecord(fetchFn, matcher, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const list = await fetchFn();
    const found = list.find(matcher);
    if (found) return found;
    await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

function labelRegex(label) {
  return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*?$`, 'i');
}

async function getDialog(page) {
  const dialog = page.locator('[role="dialog"]').filter({ has: page.locator('button') }).last();
  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  return dialog;
}

async function fillInputByLabel(dialog, label, value) {
  const group = dialog.locator('label', { hasText: labelRegex(label) }).first().locator('xpath=ancestor::div[1]');
  const input = group.locator('input').first();
  await input.fill(String(value));
}

async function fillTextareaByLabel(dialog, label, value) {
  const group = dialog.locator('label', { hasText: labelRegex(label) }).first().locator('xpath=ancestor::div[1]');
  const textarea = group.locator('textarea').first();
  await textarea.fill(String(value));
}

async function selectByLabel(page, dialog, label, optionText) {
  const group = dialog.locator('label', { hasText: labelRegex(label) }).first().locator('xpath=ancestor::div[1]');
  const trigger = group.locator('button').first();
  await trigger.click();
  await page.locator('[role="option"]', { hasText: new RegExp(optionText, 'i') }).first().click();
}

async function clickDialogButton(dialog, buttonText) {
  const btn = dialog.getByRole('button', { name: new RegExp(`^${buttonText}$`) }).first();
  await btn.click();
}

async function loginIfNeeded(page) {
  await page.goto(`${FE_BASE}/`, { waitUntil: 'domcontentloaded' });
  const quickAdmin = page.getByRole('button', { name: /Quản trị viên\s*Dùng nhanh/i });
  if ((await quickAdmin.count()) > 0) {
    await quickAdmin.click();
    await page.getByRole('button', { name: /^Đăng nhập$/ }).first().click();
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  }
}

async function openRoute(page, route) {
  await page.goto(`${FE_BASE}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
}

async function rowByText(page, text) {
  const row = page.locator('tbody tr', { hasText: text }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  return row;
}

async function runThu(page) {
  const moduleName = 'Theo dõi Thu ngân sách';
  const uniqueSource = nowCode('UI-THU-');
  await openRoute(page, '/dashboard/thu-ngan-sach');

  await page.getByRole('button', { name: /^Thêm khoản thu$/ }).first().click();
  const addDialog = await getDialog(page);

  await selectByLabel(page, addDialog, 'Loại thu', 'Phí hành chính');
  await fillInputByLabel(addDialog, 'Ngày thu', '2026-03-30');
  await fillInputByLabel(addDialog, 'Nguồn thu', uniqueSource);
  await fillInputByLabel(addDialog, 'Số tiền (VNĐ)', '123456');
  await fillInputByLabel(addDialog, 'Kế hoạch (VNĐ)', '200000');
  await fillInputByLabel(addDialog, 'Người nộp', 'Nguoi nop UI Thu');
  await fillInputByLabel(addDialog, 'Địa chỉ', 'Dia chi UI Thu');
  await selectByLabel(page, addDialog, 'Phương thức', 'Chuyển khoản');
  await fillInputByLabel(addDialog, 'Người thu', 'Can bo thu UI');
  await fillTextareaByLabel(addDialog, 'Mô tả', 'Mo ta UI Thu');
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI Thu ADD');
  await clickDialogButton(addDialog, 'Thêm khoản thu');

  await page.waitForTimeout(2000);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/ngan-sach?limit=5000&loaiBanGhi=THU_NGAN_SACH');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => x.NguonThu === uniqueSource,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', uniqueSource, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    return;
  }

  const createChecks = [
    ['LoaiThu', 'Phí hành chính', rec.LoaiThu],
    ['NgayThu', '2026-03-30', rec.NgayThu],
    ['NguonThu', uniqueSource, rec.NguonThu],
    ['SoTien', 123456, rec.SoTien],
    ['SoTienKeHoach', 200000, rec.SoTienKeHoach],
    ['NguoiNop', 'Nguoi nop UI Thu', rec.NguoiNop],
    ['DiaChi', 'Dia chi UI Thu', rec.DiaChi],
    ['PhuongThuc', 'Chuyển khoản', rec.PhuongThuc],
    ['NguoiThu', 'Can bo thu UI', rec.NguoiThu],
    ['MoTa', 'Mo ta UI Thu', rec.MoTa],
    ['GhiChu', 'Ghi chu UI Thu ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, uniqueSource);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await fillInputByLabel(editDialog, 'Số tiền (VNĐ)', '223344');
  await selectByLabel(page, editDialog, 'Trạng thái', 'Đã xác nhận');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI Thu EDIT');
  await clickDialogButton(editDialog, 'Cập nhật');
  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec2 = await apiCall(`/ngan-sach/${rec.MaNganSach}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['SoTien', 223344, d2.SoTien],
    ['TrangThai', 'Đã xác nhận', d2.TrangThai],
    ['GhiChu', 'Ghi chu UI Thu EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/ngan-sach/${rec.MaNganSach}`, { method: 'DELETE' });
}

async function runChi(page) {
  const moduleName = 'Theo dõi Chi ngân sách';
  const uniqueHangMuc = nowCode('UI-CHI-HM-');
  const uniqueChungTu = nowCode('CT-');
  await openRoute(page, '/dashboard/chi-ngan-sach');

  await page.getByRole('button', { name: /^Thêm khoản chi$/ }).first().click();
  const addDialog = await getDialog(page);
  await selectByLabel(page, addDialog, 'Loại chi', 'Chi thường xuyên');
  await fillInputByLabel(addDialog, 'Ngày chi', '2026-03-30');
  await fillInputByLabel(addDialog, 'Hạng mục chi', uniqueHangMuc);
  await fillInputByLabel(addDialog, 'Số tiền (VNĐ)', '111111');
  await fillInputByLabel(addDialog, 'Dự toán (VNĐ)', '150000');
  await fillInputByLabel(addDialog, 'Người/Đơn vị nhận', 'Don vi nhan UI Chi');
  await fillInputByLabel(addDialog, 'Đơn vị', 'DV UI Chi');
  await selectByLabel(page, addDialog, 'Phương thức', 'Chuyển khoản');
  await fillInputByLabel(addDialog, 'Số chứng từ', uniqueChungTu);
  await fillTextareaByLabel(addDialog, 'Mô tả', 'Mo ta UI Chi');
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI Chi ADD');
  await clickDialogButton(addDialog, 'Thêm khoản chi');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/ngan-sach?limit=5000&loaiBanGhi=CHI_NGAN_SACH');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => x.SoChungTu === uniqueChungTu,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', uniqueChungTu, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    return;
  }

  const createChecks = [
    ['LoaiChi', 'Chi thường xuyên', rec.LoaiChi],
    ['NgayChi', '2026-03-30', rec.NgayChi],
    ['HangMucChi', uniqueHangMuc, rec.HangMucChi],
    ['SoTien', 111111, rec.SoTien],
    ['DuToan', 150000, rec.DuToan],
    ['NguoiNhan', 'Don vi nhan UI Chi', rec.NguoiNhan],
    ['DonViNhan', 'DV UI Chi', rec.DonViNhan],
    ['PhuongThuc', 'Chuyển khoản', rec.PhuongThuc],
    ['SoChungTu', uniqueChungTu, rec.SoChungTu],
    ['MoTa', 'Mo ta UI Chi', rec.MoTa],
    ['GhiChu', 'Ghi chu UI Chi ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, uniqueHangMuc);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await fillInputByLabel(editDialog, 'Số tiền (VNĐ)', '166666');
  await selectByLabel(page, editDialog, 'Trạng thái', 'Đã chi');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI Chi EDIT');
  await clickDialogButton(editDialog, 'Cập nhật');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rec2 = await apiCall(`/ngan-sach/${rec.MaNganSach}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['SoTien', 166666, d2.SoTien],
    ['TrangThai', 'Đã chi', d2.TrangThai],
    ['GhiChu', 'Ghi chu UI Chi EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/ngan-sach/${rec.MaNganSach}`, { method: 'DELETE' });
}

async function runGiaiNgan(page) {
  const moduleName = 'Giám sát tiến độ giải ngân';
  const uniqueDuAn = nowCode('UI-DA-');
  await openRoute(page, '/dashboard/giai-ngan');

  await page.getByRole('button', { name: /^Thêm dự án$/ }).first().click();
  const addDialog = await getDialog(page);
  await fillInputByLabel(addDialog, 'Tên dự án', uniqueDuAn);
  await selectByLabel(page, addDialog, 'Loại dự án', 'Hạ tầng');
  await fillInputByLabel(addDialog, 'Đơn vị thực hiện', 'Ban QLDA UI');
  await fillInputByLabel(addDialog, 'Tổng kế hoạch (VNĐ)', '900000');
  await fillInputByLabel(addDialog, 'Đã giải ngân (VNĐ)', '300000');
  await fillInputByLabel(addDialog, 'Ngày bắt đầu', '2026-01-01');
  await fillInputByLabel(addDialog, 'Ngày kết thúc', '2026-12-31');
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI GiaiNgan ADD');
  await clickDialogButton(addDialog, 'Thêm dự án');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/ngan-sach?limit=5000&loaiBanGhi=GIAI_NGAN');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => x.TenDuAn === uniqueDuAn,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', uniqueDuAn, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    return;
  }

  const createChecks = [
    ['TenDuAn', uniqueDuAn, rec.TenDuAn],
    ['LoaiDuAn', 'Hạ tầng', rec.LoaiDuAn],
    ['DonViThucHien', 'Ban QLDA UI', rec.DonViThucHien],
    ['TongKeHoach', 900000, rec.TongKeHoach],
    ['DaGiaiNgan', 300000, rec.DaGiaiNgan],
    ['NgayBatDau', '2026-01-01', rec.NgayBatDau],
    ['NgayKetThuc', '2026-12-31', rec.NgayKetThuc],
    ['GhiChu', 'Ghi chu UI GiaiNgan ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, uniqueDuAn);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await fillInputByLabel(editDialog, 'Đã giải ngân (VNĐ)', '450000');
  await fillInputByLabel(editDialog, 'Tiến độ (%)', '50');
  await selectByLabel(page, editDialog, 'Trạng thái', 'Đang thực hiện');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI GiaiNgan EDIT');
  await clickDialogButton(editDialog, 'Cập nhật');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rec2 = await apiCall(`/ngan-sach/${rec.MaNganSach}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['DaGiaiNgan', 450000, d2.DaGiaiNgan],
    ['TienDo', 50, d2.TienDo],
    ['TrangThai', 'Đang thực hiện', d2.TrangThai],
    ['GhiChu', 'Ghi chu UI GiaiNgan EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/ngan-sach/${rec.MaNganSach}`, { method: 'DELETE' });
}

async function runBaoCaoTaiChinh(page) {
  const moduleName = 'Báo cáo tài chính';
  const uniqueBaoCao = nowCode('UI-BC-');
  await openRoute(page, '/dashboard/bao-cao-tai-chinh');

  await page.getByRole('button', { name: /^Tạo báo cáo$/ }).first().click();
  const addDialog = await getDialog(page);
  await fillInputByLabel(addDialog, 'Tên báo cáo', uniqueBaoCao);
  await selectByLabel(page, addDialog, 'Loại báo cáo', 'Báo cáo tháng');
  await fillInputByLabel(addDialog, 'Kỳ báo cáo', '03/2026');
  await fillInputByLabel(addDialog, 'Ngày lập', '2026-03-30');
  await fillInputByLabel(addDialog, 'Người lập', 'Ke toan UI');
  await fillInputByLabel(addDialog, 'Tổng thu (VNĐ)', '800000');
  await fillInputByLabel(addDialog, 'Tổng chi (VNĐ)', '500000');
  await fillInputByLabel(addDialog, 'Tồn quỹ (VNĐ)', '300000');
  await selectByLabel(page, addDialog, 'Trạng thái', 'Chờ duyệt');
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI BaoCao ADD');
  await clickDialogButton(addDialog, 'Lưu báo cáo');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/ngan-sach?limit=5000&loaiBanGhi=BAO_CAO_TAI_CHINH');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => x.TenBaoCao === uniqueBaoCao,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', uniqueBaoCao, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    return;
  }

  const createChecks = [
    ['TenBaoCao', uniqueBaoCao, rec.TenBaoCao],
    ['LoaiBaoCao', 'Báo cáo tháng', rec.LoaiBaoCao],
    ['KyBaoCao', '03/2026', rec.KyBaoCao],
    ['NgayLap', '2026-03-30', rec.NgayLap],
    ['NguoiLap', 'Ke toan UI', rec.NguoiLap],
    ['TongThu', 800000, rec.TongThu],
    ['TongChi', 500000, rec.TongChi],
    ['TonQuy', 300000, rec.TonQuy],
    ['TrangThai', 'Chờ duyệt', rec.TrangThai],
    ['GhiChu', 'Ghi chu UI BaoCao ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, uniqueBaoCao);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await fillInputByLabel(editDialog, 'Tổng chi (VNĐ)', '520000');
  await selectByLabel(page, editDialog, 'Trạng thái', 'Đã duyệt');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI BaoCao EDIT');
  await clickDialogButton(editDialog, 'Lưu thay đổi');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rec2 = await apiCall(`/ngan-sach/${rec.MaNganSach}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['TongChi', 520000, d2.TongChi],
    ['TrangThai', 'Đã duyệt', d2.TrangThai],
    ['GhiChu', 'Ghi chu UI BaoCao EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/ngan-sach/${rec.MaNganSach}`, { method: 'DELETE' });
}

async function createFkThua(maThua) {
  await apiCall('/thua-dat', {
    method: 'POST',
    body: {
      LoaiBanGhi: 'DIA_CHINH',
      MaThua: maThua,
      SoThua: '99',
      DienTich: 150,
      TrangThai: 'Đang sử dụng',
    },
  });
}

async function runBienDongDat(page) {
  const moduleName = 'Theo dõi biến động đất đai';
  const fkMaThua = nowCode('TDBD').slice(0, 12);
  const uniqueLyDo = nowCode('LYDO-');

  await createFkThua(fkMaThua);
  await openRoute(page, '/dashboard/bien-dong-dat');

  await page.getByRole('button', { name: /^Thêm biến động$/ }).first().click();
  const addDialog = await getDialog(page);
  await selectByLabel(page, addDialog, 'Loại biến động', 'Chuyển mục đích sử dụng');
  await fillInputByLabel(addDialog, 'Mã thửa', fkMaThua);
  await fillInputByLabel(addDialog, 'Số tờ', '12');
  await fillInputByLabel(addDialog, 'Diện tích cũ (m²)', '100');
  await fillInputByLabel(addDialog, 'Diện tích mới (m²)', '120');
  await selectByLabel(page, addDialog, 'Loại đất cũ', 'Đất ở');
  await selectByLabel(page, addDialog, 'Loại đất mới', 'Đất thương mại');
  await fillInputByLabel(addDialog, 'Chủ sở hữu cũ', 'Chu cu UI');
  await fillInputByLabel(addDialog, 'CCCD cũ', '111111111111');
  await fillInputByLabel(addDialog, 'Chủ sở hữu mới', 'Chu moi UI');
  await fillInputByLabel(addDialog, 'CCCD mới', '222222222222');
  await fillInputByLabel(addDialog, 'Cán bộ xử lý', 'Can bo XL UI');
  await fillTextareaByLabel(addDialog, 'Lý do biến động', uniqueLyDo);
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI BienDong ADD');
  await clickDialogButton(addDialog, 'Lưu biến động');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/bien-dong-dat?limit=5000&loaiBanGhi=BIEN_DONG_DAT');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => x.MaThua === fkMaThua && x.LyDo === uniqueLyDo,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', `${fkMaThua}/${uniqueLyDo}`, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    await apiCall(`/thua-dat/${fkMaThua}`, { method: 'DELETE' });
    return;
  }

  const createChecks = [
    ['LoaiBienDong', 'Chuyển mục đích sử dụng', rec.LoaiBienDong],
    ['MaThua', fkMaThua, rec.MaThua],
    ['SoTo', '12', rec.SoTo],
    ['DienTichCu', 100, rec.DienTichCu],
    ['DienTichMoi', 120, rec.DienTichMoi],
    ['LoaiDatCu', 'Đất ở', rec.LoaiDatCu],
    ['LoaiDatMoi', 'Đất thương mại', rec.LoaiDatMoi],
    ['ChuSoHuuCu', 'Chu cu UI', rec.ChuSoHuuCu],
    ['ChuSoHuuMoi', 'Chu moi UI', rec.ChuSoHuuMoi],
    ['CanBoXuLy', 'Can bo XL UI', rec.CanBoXuLy],
    ['LyDo', uniqueLyDo, rec.LyDo],
    ['GhiChu', 'Ghi chu UI BienDong ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, fkMaThua);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await selectByLabel(page, editDialog, 'Trạng thái', 'Đã duyệt');
  await fillInputByLabel(editDialog, 'Cán bộ xử lý', 'Can bo XL UI EDIT');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI BienDong EDIT');
  await clickDialogButton(editDialog, 'Cập nhật');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rec2 = await apiCall(`/bien-dong-dat/${rec.MaBienDong}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['TrangThai', 'Đã duyệt', d2.TrangThai],
    ['CanBoXuLy', 'Can bo XL UI EDIT', d2.CanBoXuLy],
    ['GhiChu', 'Ghi chu UI BienDong EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/bien-dong-dat/${rec.MaBienDong}`, { method: 'DELETE' });
  await apiCall(`/thua-dat/${fkMaThua}`, { method: 'DELETE' });
}

async function runCapSoDo(page) {
  const moduleName = 'Quản lý cấp sổ đỏ';
  const maThua = nowCode('TDCSD').slice(0, 14);

  await openRoute(page, '/dashboard/cap-so-do');
  await page.getByRole('button', { name: /^Tiếp nhận hồ sơ$/ }).first().click();
  const addDialog = await getDialog(page);

  await fillInputByLabel(addDialog, 'Chủ sở hữu', 'Chu so huu UI CSD');
  await fillInputByLabel(addDialog, 'CCCD', '123456789012');
  await fillInputByLabel(addDialog, 'Số điện thoại', '0900123456');
  await selectByLabel(page, addDialog, 'Loại đất', 'Đất ở');
  await fillInputByLabel(addDialog, 'Mã thửa', maThua);
  await fillInputByLabel(addDialog, 'Số tờ', '18');
  await fillInputByLabel(addDialog, 'Diện tích (m²)', '135');
  await fillInputByLabel(addDialog, 'Ngày hẹn trả', '2026-04-30');
  await fillInputByLabel(addDialog, 'Địa chỉ thửa đất', 'Dia chi UI CSD');
  await fillInputByLabel(addDialog, 'Cán bộ tiếp nhận', 'CB TiepNhan UI');
  await selectByLabel(page, addDialog, 'Trạng thái', 'Chờ thẩm định');
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI CapSoDo ADD');
  await clickDialogButton(addDialog, 'Tiếp nhận');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/thua-dat?limit=5000&loaiBanGhi=CAP_SO_DO');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => x.MaThua === maThua,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', maThua, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    return;
  }

  const createChecks = [
    ['MaThua', maThua, rec.MaThua],
    ['ChuSoHuu', 'Chu so huu UI CSD', rec.ChuSoHuu],
    ['CCCD', '123456789012', rec.CCCD],
    ['SoDienThoai', '0900123456', rec.SoDienThoai],
    ['LoaiDat', 'Đất ở', rec.LoaiDat],
    ['SoTo', '18', rec.SoTo],
    ['DienTich', 135, rec.DienTich],
    ['NgayHenTra', '2026-04-30', rec.NgayHenTra],
    ['DiaChiThuaDat', 'Dia chi UI CSD', rec.DiaChiThuaDat],
    ['CanBoTiepNhan', 'CB TiepNhan UI', rec.CanBoTiepNhan],
    ['TrangThai', 'Chờ thẩm định', rec.TrangThai],
    ['GhiChu', 'Ghi chu UI CapSoDo ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, maThua);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await fillInputByLabel(editDialog, 'Tiến độ (%)', '65');
  await fillInputByLabel(editDialog, 'Cán bộ thẩm định', 'CB ThamDinh UI');
  await selectByLabel(page, editDialog, 'Trạng thái', 'Đang xử lý');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI CapSoDo EDIT');
  await clickDialogButton(editDialog, 'Cập nhật');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rec2 = await apiCall(`/thua-dat/${maThua}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['TienDo', 65, d2.TienDo],
    ['CanBoThamDinh', 'CB ThamDinh UI', d2.CanBoThamDinh],
    ['TrangThai', 'Đang xử lý', d2.TrangThai],
    ['GhiChu', 'Ghi chu UI CapSoDo EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/thua-dat/${maThua}`, { method: 'DELETE' });
}

async function runThamDinh(page) {
  const moduleName = 'Hồ sơ thẩm định thực địa';
  const maThua = nowCode('TDTH').slice(0, 12);
  const maHoSo = nowCode('HS-TD-');

  await createFkThua(maThua);
  await openRoute(page, '/dashboard/tham-dinh-thuc-dia');

  await page.getByRole('button', { name: /^(Tạo hồ sơ|Tạo hồ sơ thẩm định)$/ }).first().click();
  const addDialog = await getDialog(page);
  await fillInputByLabel(addDialog, 'Mã hồ sơ gốc', maHoSo);
  await selectByLabel(page, addDialog, 'Loại thẩm định', 'Cấp sổ đỏ mới');
  await fillInputByLabel(addDialog, 'Địa chỉ', 'Dia chi UI TD');
  await fillInputByLabel(addDialog, 'Mã thửa', maThua);
  await fillInputByLabel(addDialog, 'Số tờ', '7');
  await fillInputByLabel(addDialog, 'Diện tích theo hồ sơ (m²)', '88');
  await fillInputByLabel(addDialog, 'Ngày thẩm định dự kiến', '2026-03-31');
  await fillInputByLabel(addDialog, 'Cán bộ thẩm định', 'CB TD UI');
  await fillInputByLabel(addDialog, 'Đơn vị thẩm định', 'Phong TNMT UI');
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI ThamDinh ADD');
  await clickDialogButton(addDialog, 'Tạo hồ sơ');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/bien-dong-dat?limit=5000&loaiBanGhi=THAM_DINH_THUC_DIA');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => normalizeText(x.MaHoSo) === maHoSo || normalizeText(x.MaThua) === maThua,
    30000,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', maHoSo, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    await apiCall(`/thua-dat/${maThua}`, { method: 'DELETE' });
    return;
  }

  const createChecks = [
    ['MaHoSo', maHoSo, rec.MaHoSo],
    ['LoaiThamDinh', 'Cấp sổ đỏ mới', rec.LoaiThamDinh],
    ['DiaChiThuaDat', 'Dia chi UI TD', rec.DiaChiThuaDat],
    ['MaThua', maThua, rec.MaThua],
    ['SoTo', '7', rec.SoTo],
    ['DienTichHoSo', 88, rec.DienTichHoSo],
    ['NgayThamDinh', '2026-03-31', rec.NgayThamDinh],
    ['CanBoThamDinh', 'CB TD UI', rec.CanBoThamDinh],
    ['DonViThamDinh', 'Phong TNMT UI', rec.DonViThamDinh],
    ['GhiChu', 'Ghi chu UI ThamDinh ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, maHoSo);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await selectByLabel(page, editDialog, 'Trạng thái', 'Hoàn thành');
  await selectByLabel(page, editDialog, 'Kết quả thẩm định', 'Đúng hồ sơ');
  await fillInputByLabel(editDialog, 'Diện tích thực tế (m²)', '89');
  await fillInputByLabel(editDialog, 'Số hình ảnh chứng cứ', '3');
  await fillTextareaByLabel(editDialog, 'Mô tả sai lệch (nếu có)', 'Sai lech nho UI');
  await fillTextareaByLabel(editDialog, 'Đề xuất xử lý', 'De xuat UI');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI ThamDinh EDIT');
  await clickDialogButton(editDialog, 'Cập nhật');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rec2 = await apiCall(`/bien-dong-dat/${rec.MaBienDong}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['TrangThai', 'Hoàn thành', d2.TrangThai],
    ['KetQuaThamDinh', 'Đúng hồ sơ', d2.KetQuaThamDinh],
    ['DienTichThucTe', 89, d2.DienTichThucTe],
    ['HinhAnhChungCu', 3, d2.HinhAnhChungCu],
    ['MoTaSaiLech', 'Sai lech nho UI', d2.MoTaSaiLech],
    ['DeXuatXuLy', 'De xuat UI', d2.DeXuatXuLy],
    ['GhiChu', 'Ghi chu UI ThamDinh EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/bien-dong-dat/${rec.MaBienDong}`, { method: 'DELETE' });
  await apiCall(`/thua-dat/${maThua}`, { method: 'DELETE' });
}

async function runTranhChap(page) {
  const moduleName = 'Quản lý tranh chấp đất đai';
  const maThua = nowCode('TDTC').slice(0, 12);
  const noiDung = nowCode('Noi dung TC ');

  await createFkThua(maThua);
  await openRoute(page, '/dashboard/tranh-chap');

  await page.getByRole('button', { name: /^(Tiếp nhận vụ việc|Thêm vụ việc)$/ }).first().click();
  const addDialog = await getDialog(page);
  await selectByLabel(page, addDialog, 'Loại tranh chấp', 'Tranh chấp ranh giới');
  await selectByLabel(page, addDialog, 'Mức độ', 'Trung bình');
  await fillInputByLabel(addDialog, 'Mã thửa liên quan', maThua);
  await fillInputByLabel(addDialog, 'Số tờ', '5');
  await fillInputByLabel(addDialog, 'Địa chỉ thửa đất', 'Dia chi UI TC');
  await fillInputByLabel(addDialog, 'Diện tích tranh chấp (m²)', '25');
  await fillInputByLabel(addDialog, 'Ngày khiếu nại', '2026-03-28');

  const complainant = addDialog.locator('h4', { hasText: 'Bên khiếu nại' }).locator('xpath=ancestor::div[1]');
  await complainant.locator('input').nth(0).fill('Nguoi khieu nai UI');
  await complainant.locator('input').nth(1).fill('333333333333');
  await complainant.locator('input').nth(2).fill('0900333333');

  const defendant = addDialog.locator('h4', { hasText: 'Bên bị khiếu nại' }).locator('xpath=ancestor::div[1]');
  await defendant.locator('input').nth(0).fill('Nguoi bi khieu nai UI');
  await defendant.locator('input').nth(1).fill('444444444444');

  await fillTextareaByLabel(addDialog, 'Nội dung tranh chấp', noiDung);
  await fillTextareaByLabel(addDialog, 'Ghi chú', 'Ghi chu UI TranhChap ADD');
  await clickDialogButton(addDialog, 'Tiếp nhận');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const rec = await waitForRecord(
    async () => {
      const r = await apiCall('/bien-dong-dat?limit=5000&loaiBanGhi=TRANH_CHAP_DAT');
      return Array.isArray(r.data?.data) ? r.data.data : [];
    },
    (x) => x.MaThua === maThua && x.NoiDung === noiDung,
  );

  if (!rec) {
    record(moduleName, 'CREATE', 'record', `${maThua}/${noiDung}`, null, false, 'Không tìm thấy bản ghi sau lưu + F5');
    await apiCall(`/thua-dat/${maThua}`, { method: 'DELETE' });
    return;
  }

  const createChecks = [
    ['LoaiTranhChap', 'Tranh chấp ranh giới', rec.LoaiTranhChap],
    ['MucDo', 'Trung bình', rec.MucDo],
    ['MaThua', maThua, rec.MaThua],
    ['SoTo', '5', rec.SoTo],
    ['DiaChiThuaDat', 'Dia chi UI TC', rec.DiaChiThuaDat],
    ['DienTichTranhChap', 25, rec.DienTichTranhChap],
    ['NgayKhieuNai', '2026-03-28', rec.NgayKhieuNai],
    ['BenKhieuNai', 'Nguoi khieu nai UI', rec.BenKhieuNai],
    ['CCCDKhieuNai', '333333333333', rec.CCCDKhieuNai],
    ['SDTKhieuNai', '0900333333', rec.SDTKhieuNai],
    ['BenBiKhieuNai', 'Nguoi bi khieu nai UI', rec.BenBiKhieuNai],
    ['CCCDBiKhieuNai', '444444444444', rec.CCCDBiKhieuNai],
    ['NoiDung', noiDung, rec.NoiDung],
    ['GhiChu', 'Ghi chu UI TranhChap ADD', rec.GhiChu],
  ];
  createChecks.forEach(([f, e, a]) => record(moduleName, 'CREATE', f, e, a, compareValue(e, a)));

  const row = await rowByText(page, maThua);
  await row.locator('button').nth(1).click();
  const editDialog = await getDialog(page);
  await selectByLabel(page, editDialog, 'Trạng thái', 'Đang giải quyết');
  await fillInputByLabel(editDialog, 'Cán bộ thụ lý', 'Can bo thu ly UI');
  await fillInputByLabel(editDialog, 'Ngày giải quyết', '2026-04-05');
  await fillTextareaByLabel(editDialog, 'Phương án giải quyết', 'Hoa giai UI');
  await fillTextareaByLabel(editDialog, 'Kết quả giải quyết', 'Dang xu ly UI');
  await fillTextareaByLabel(editDialog, 'Ghi chú', 'Ghi chu UI TranhChap EDIT');
  await clickDialogButton(editDialog, 'Cập nhật');

  await page.waitForTimeout(1200);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const rec2 = await apiCall(`/bien-dong-dat/${rec.MaBienDong}`);
  const d2 = rec2.data?.data || {};
  const updateChecks = [
    ['TrangThai', 'Đang giải quyết', d2.TrangThai],
    ['CanBoThuLy', 'Can bo thu ly UI', d2.CanBoThuLy],
    ['NgayGiaiQuyet', '2026-04-05', d2.NgayGiaiQuyet],
    ['PhuongAnGiaiQuyet', 'Hoa giai UI', d2.PhuongAnGiaiQuyet],
    ['KetQuaGiaiQuyet', 'Dang xu ly UI', d2.KetQuaGiaiQuyet],
    ['GhiChu', 'Ghi chu UI TranhChap EDIT', d2.GhiChu],
  ];
  updateChecks.forEach(([f, e, a]) => record(moduleName, 'UPDATE', f, e, a, compareValue(e, a)));

  await apiCall(`/bien-dong-dat/${rec.MaBienDong}`, { method: 'DELETE' });
  await apiCall(`/thua-dat/${maThua}`, { method: 'DELETE' });
}

async function runReportChecks(page) {
  const reportModules = [
    { name: 'Thống kê hồ sơ tồn đọng', route: '/dashboard/ho-so-ton-dong' },
    { name: 'Báo cáo đất đai', route: '/dashboard/bao-cao-dat-dai' },
  ];

  for (const m of reportModules) {
    await openRoute(page, m.route);
    await page.reload({ waitUntil: 'domcontentloaded' });

    const be1 = await apiCall('/thua-dat?limit=5000&loaiBanGhi=CAP_SO_DO');
    record(m.name, 'RELOAD', 'Backend API thua-dat', 'success=true', be1.data?.success, be1.data?.success === true);

    if (m.name === 'Thống kê hồ sơ tồn đọng') {
      const be2 = await apiCall('/bien-dong-dat?limit=5000&loaiBanGhi=THAM_DINH_THUC_DIA');
      const be3 = await apiCall('/bien-dong-dat?limit=5000&loaiBanGhi=TRANH_CHAP_DAT');
      record(m.name, 'RELOAD', 'Backend API tham-dinh', 'success=true', be2.data?.success, be2.data?.success === true);
      record(m.name, 'RELOAD', 'Backend API tranh-chap', 'success=true', be3.data?.success, be3.data?.success === true);
    }

    if (m.name === 'Báo cáo đất đai') {
      const be2 = await apiCall('/bien-dong-dat?limit=5000&loaiBanGhi=BIEN_DONG_DAT');
      record(m.name, 'RELOAD', 'Backend API bien-dong-dat', 'success=true', be2.data?.success, be2.data?.success === true);
    }

    const hasHeading = await page.locator('h1, h2, h3').first().isVisible().catch(() => false);
    record(m.name, 'RELOAD', 'UI render after F5', true, hasHeading, hasHeading === true);
  }
}

function buildMarkdownReport(items) {
  const byModule = new Map();
  for (const item of items) {
    const key = item.module;
    if (!byModule.has(key)) byModule.set(key, []);
    byModule.get(key).push(item);
  }

  const lines = [];
  lines.push('# Bien ban kiem thu UI Finance/Land (nhap-sua-luu-F5-doi chieu DB)');
  lines.push('');
  lines.push(`- Thoi gian: ${new Date().toISOString()}`);
  lines.push(`- Tong so checkpoint: ${items.length}`);
  lines.push(`- PASS: ${items.filter((x) => x.status === 'PASS').length}`);
  lines.push(`- FAIL: ${items.filter((x) => x.status === 'FAIL').length}`);
  lines.push('');

  for (const [moduleName, arr] of byModule.entries()) {
    lines.push(`## ${moduleName}`);
    lines.push('');
    lines.push('| Phase | Field | Expected | Actual | Status | Note |');
    lines.push('|---|---|---|---|---|---|');
    for (const r of arr) {
      lines.push(`| ${r.phase} | ${r.field} | ${String(r.expected ?? '')} | ${String(r.actual ?? '')} | ${r.status} | ${r.note || ''} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await loginIfNeeded(page);

    const suites = [
      runThu,
      runChi,
      runGiaiNgan,
      runBaoCaoTaiChinh,
      runBienDongDat,
      runCapSoDo,
      runThamDinh,
      runTranhChap,
      runReportChecks,
    ];

    for (const suite of suites) {
      try {
        await suite(page);
      } catch (err) {
        const name = suite.name || 'unknown-suite';
        record(name, 'SUITE', 'execution', 'no error', String(err?.message || err), false, 'Loi runtime trong suite');
      }
    }
  } finally {
    await browser.close();
  }

  const outDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(outDir, `ui-finance-land-report-${stamp}.json`);
  const mdPath = path.join(outDir, `ui-finance-land-report-${stamp}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf8');
  fs.writeFileSync(mdPath, buildMarkdownReport(results), 'utf8');

  const pass = results.filter((x) => x.status === 'PASS').length;
  const fail = results.filter((x) => x.status === 'FAIL').length;

  console.log(`REPORT_JSON=${jsonPath}`);
  console.log(`REPORT_MD=${mdPath}`);
  console.log(`TOTAL=${results.length}; PASS=${pass}; FAIL=${fail}`);

  if (fail > 0) process.exitCode = 2;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
