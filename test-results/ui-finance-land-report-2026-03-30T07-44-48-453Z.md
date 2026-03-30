# Bien ban kiem thu UI Finance/Land (nhap-sua-luu-F5-doi chieu DB)

- Thoi gian: 2026-03-30T07:44:48.455Z
- Tong so checkpoint: 93
- PASS: 91
- FAIL: 2

## Theo dõi Thu ngân sách

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | LoaiThu | Phí hành chính | Phí hành chính | PASS |  |
| CREATE | NgayThu | 2026-03-30 | 2026-03-30 | PASS |  |
| CREATE | NguonThu | UI-THU-56575803 | UI-THU-56575803 | PASS |  |
| CREATE | SoTien | 123456 | 123456.00 | PASS |  |
| CREATE | SoTienKeHoach | 200000 | 200000.00 | PASS |  |
| CREATE | NguoiNop | Nguoi nop UI Thu | Nguoi nop UI Thu | PASS |  |
| CREATE | DiaChi | Dia chi UI Thu | Dia chi UI Thu | PASS |  |
| CREATE | PhuongThuc | Chuyển khoản | Chuyển khoản | PASS |  |
| CREATE | NguoiThu | Can bo thu UI | Can bo thu UI | PASS |  |
| CREATE | MoTa | Mo ta UI Thu | Mo ta UI Thu | PASS |  |
| CREATE | GhiChu | Ghi chu UI Thu ADD | Ghi chu UI Thu ADD | PASS |  |
| UPDATE | SoTien | 223344 | 223344.00 | PASS |  |
| UPDATE | TrangThai | Đã xác nhận | Đã xác nhận | PASS |  |
| UPDATE | GhiChu | Ghi chu UI Thu EDIT | Ghi chu UI Thu EDIT | PASS |  |

## Theo dõi Chi ngân sách

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | LoaiChi | Chi thường xuyên | Chi thường xuyên | PASS |  |
| CREATE | NgayChi | 2026-03-30 | 2026-03-30 | PASS |  |
| CREATE | HangMucChi | UI-CHI-HM-56582945 | UI-CHI-HM-56582945 | PASS |  |
| CREATE | SoTien | 111111 | 111111.00 | PASS |  |
| CREATE | DuToan | 150000 | 150000.00 | PASS |  |
| CREATE | NguoiNhan | Don vi nhan UI Chi | Don vi nhan UI Chi | PASS |  |
| CREATE | DonViNhan | DV UI Chi | DV UI Chi | PASS |  |
| CREATE | PhuongThuc | Chuyển khoản | Chuyển khoản | PASS |  |
| CREATE | SoChungTu | CT-56582945 | CT-56582945 | PASS |  |
| CREATE | MoTa | Mo ta UI Chi | Mo ta UI Chi | PASS |  |
| CREATE | GhiChu | Ghi chu UI Chi ADD | Ghi chu UI Chi ADD | PASS |  |
| UPDATE | SoTien | 166666 | 166666.00 | PASS |  |
| UPDATE | TrangThai | Đã chi | Đã chi | PASS |  |
| UPDATE | GhiChu | Ghi chu UI Chi EDIT | Ghi chu UI Chi EDIT | PASS |  |

## Giám sát tiến độ giải ngân

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | TenDuAn | UI-DA-56590339 | UI-DA-56590339 | PASS |  |
| CREATE | LoaiDuAn | Hạ tầng | Hạ tầng | PASS |  |
| CREATE | DonViThucHien | Ban QLDA UI | Ban QLDA UI | PASS |  |
| CREATE | TongKeHoach | 900000 | 900000.00 | PASS |  |
| CREATE | DaGiaiNgan | 300000 | 300000 | PASS |  |
| CREATE | NgayBatDau | 2026-01-01 | 2026-01-01 | PASS |  |
| CREATE | NgayKetThuc | 2026-12-31 | 2026-12-31 | PASS |  |
| CREATE | GhiChu | Ghi chu UI GiaiNgan ADD | Ghi chu UI GiaiNgan ADD | PASS |  |
| UPDATE | DaGiaiNgan | 450000 | 450000 | PASS |  |
| UPDATE | TienDo | 50 | 50 | PASS |  |
| UPDATE | TrangThai | Đang thực hiện | Đang thực hiện | PASS |  |
| UPDATE | GhiChu | Ghi chu UI GiaiNgan EDIT | Ghi chu UI GiaiNgan EDIT | PASS |  |

## Báo cáo tài chính

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | TenBaoCao | UI-BC-56597200 | UI-BC-56597200 | PASS |  |
| CREATE | LoaiBaoCao | Báo cáo tháng | Báo cáo tháng | PASS |  |
| CREATE | KyBaoCao | 03/2026 | 03/2026 | PASS |  |
| CREATE | NgayLap | 2026-03-30 | 2026-03-30 | PASS |  |
| CREATE | NguoiLap | Ke toan UI | Ke toan UI | PASS |  |
| CREATE | TongThu | 800000 | 800000.00 | PASS |  |
| CREATE | TongChi | 500000 | 500000.00 | PASS |  |
| CREATE | TonQuy | 300000 | 300000.00 | PASS |  |
| CREATE | TrangThai | Chờ duyệt | Chờ duyệt | PASS |  |
| CREATE | GhiChu | Ghi chu UI BaoCao ADD | Ghi chu UI BaoCao ADD | PASS |  |
| UPDATE | TongChi | 520000 | 520000.00 | PASS |  |
| UPDATE | TrangThai | Đã duyệt | Đã duyệt | PASS |  |
| UPDATE | GhiChu | Ghi chu UI BaoCao EDIT | Ghi chu UI BaoCao EDIT | PASS |  |

## Theo dõi biến động đất đai

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | LoaiBienDong | Chuyển mục đích sử dụng | Chuyển mục đích sử dụng | PASS |  |
| CREATE | MaThua | TDBD56603855 | TDBD56603855 | PASS |  |
| CREATE | SoTo | 12 | 12 | PASS |  |
| CREATE | DienTichCu | 100 | 100.00 | PASS |  |
| CREATE | DienTichMoi | 120 | 120.00 | PASS |  |
| CREATE | LoaiDatCu | Đất ở | Đất ở | PASS |  |
| CREATE | LoaiDatMoi | Đất thương mại | Đất thương mại | PASS |  |
| CREATE | ChuSoHuuCu | Chu cu UI | Chu cu UI | PASS |  |
| CREATE | ChuSoHuuMoi | Chu moi UI | Chu moi UI | PASS |  |
| CREATE | CanBoXuLy | Can bo XL UI | Can bo XL UI | PASS |  |
| CREATE | LyDo | LYDO-56603855 | LYDO-56603855 | PASS |  |
| CREATE | GhiChu | Ghi chu UI BienDong ADD | Ghi chu UI BienDong ADD | PASS |  |
| UPDATE | TrangThai | Đã duyệt | Đã duyệt | PASS |  |
| UPDATE | CanBoXuLy | Can bo XL UI EDIT | Can bo XL UI EDIT | PASS |  |
| UPDATE | GhiChu | Ghi chu UI BienDong EDIT | Ghi chu UI BienDong EDIT | PASS |  |

## Quản lý cấp sổ đỏ

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | MaThua | TDCSD56611896 | TDCSD56611896 | PASS |  |
| CREATE | ChuSoHuu | Chu so huu UI CSD | Chu so huu UI CSD | PASS |  |
| CREATE | CCCD | 123456789012 | 123456789012 | PASS |  |
| CREATE | SoDienThoai | 0900123456 | 0900123456 | PASS |  |
| CREATE | LoaiDat | Đất ở | Đất ở | PASS |  |
| CREATE | SoTo | 18 | 18 | PASS |  |
| CREATE | DienTich | 135 | 135.00 | PASS |  |
| CREATE | NgayHenTra | 2026-04-30 | 2026-04-30 | PASS |  |
| CREATE | DiaChiThuaDat | Dia chi UI CSD | Dia chi UI CSD | PASS |  |
| CREATE | CanBoTiepNhan | CB TiepNhan UI | CB TiepNhan UI | PASS |  |
| CREATE | TrangThai | Chờ thẩm định | Chờ thẩm định | PASS |  |
| CREATE | GhiChu | Ghi chu UI CapSoDo ADD | Ghi chu UI CapSoDo ADD | PASS |  |
| UPDATE | TienDo | 65 | 65 | PASS |  |
| UPDATE | CanBoThamDinh | CB ThamDinh UI | CB ThamDinh UI | PASS |  |
| UPDATE | TrangThai | Đang xử lý | Đang xử lý | PASS |  |
| UPDATE | GhiChu | Ghi chu UI CapSoDo EDIT | Ghi chu UI CapSoDo EDIT | PASS |  |

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
