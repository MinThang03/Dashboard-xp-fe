# Bien ban kiem thu UI Finance/Land (nhap-sua-luu-F5-doi chieu DB)

- Thoi gian: 2026-03-30T07:41:23.784Z
- Tong so checkpoint: 15
- PASS: 7
- FAIL: 8

## runThu

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Thêm khoản thu$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## runChi

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Thêm khoản chi$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## runGiaiNgan

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Thêm dự án$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## runBaoCaoTaiChinh

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Tạo báo cáo$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## runBienDongDat

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Thêm biến động$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## runCapSoDo

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Tiếp nhận hồ sơ$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## runThamDinh

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Tạo hồ sơ$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## runTranhChap

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /^Tiếp nhận vụ việc$/ }).first()[22m
 | FAIL | Loi runtime trong suite |

## Thống kê hồ sơ tồn đọng

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| RELOAD | Backend API thua-dat | success=true | true | PASS |  |
| RELOAD | Backend API tham-dinh | success=true | true | PASS |  |
| RELOAD | Backend API tranh-chap | success=true | true | PASS |  |
| RELOAD | UI render after F5 | true | true | PASS |  |

## Báo cáo đất đai

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| RELOAD | Backend API thua-dat | success=true | true | PASS |  |
| RELOAD | Backend API bien-dong-dat | success=true | true | PASS |  |
| RELOAD | UI render after F5 | true | true | PASS |  |
