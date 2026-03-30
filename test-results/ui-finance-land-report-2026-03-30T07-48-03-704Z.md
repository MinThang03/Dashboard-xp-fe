# Bien ban kiem thu UI Finance/Land (nhap-sua-luu-F5-doi chieu DB)

- Thoi gian: 2026-03-30T07:48:03.707Z
- Tong so checkpoint: 123
- PASS: 122
- FAIL: 1

## Theo dõi Thu ngân sách

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | LoaiThu | Phí hành chính | Phí hành chính | PASS |  |
| CREATE | NgayThu | 2026-03-30 | 2026-03-30 | PASS |  |
| CREATE | NguonThu | UI-THU-56794870 | UI-THU-56794870 | PASS |  |
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
| CREATE | HangMucChi | UI-CHI-HM-56801500 | UI-CHI-HM-56801500 | PASS |  |
| CREATE | SoTien | 111111 | 111111.00 | PASS |  |
| CREATE | DuToan | 150000 | 150000.00 | PASS |  |
| CREATE | NguoiNhan | Don vi nhan UI Chi | Don vi nhan UI Chi | PASS |  |
| CREATE | DonViNhan | DV UI Chi | DV UI Chi | PASS |  |
| CREATE | PhuongThuc | Chuyển khoản | Chuyển khoản | PASS |  |
| CREATE | SoChungTu | CT-56801500 | CT-56801500 | PASS |  |
| CREATE | MoTa | Mo ta UI Chi | Mo ta UI Chi | PASS |  |
| CREATE | GhiChu | Ghi chu UI Chi ADD | Ghi chu UI Chi ADD | PASS |  |
| UPDATE | SoTien | 166666 | 166666.00 | PASS |  |
| UPDATE | TrangThai | Đã chi | Đã chi | PASS |  |
| UPDATE | GhiChu | Ghi chu UI Chi EDIT | Ghi chu UI Chi EDIT | PASS |  |

## Giám sát tiến độ giải ngân

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | TenDuAn | UI-DA-56808658 | UI-DA-56808658 | PASS |  |
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
| CREATE | TenBaoCao | UI-BC-56814847 | UI-BC-56814847 | PASS |  |
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
| CREATE | MaThua | TDBD56821168 | TDBD56821168 | PASS |  |
| CREATE | SoTo | 12 | 12 | PASS |  |
| CREATE | DienTichCu | 100 | 100.00 | PASS |  |
| CREATE | DienTichMoi | 120 | 120.00 | PASS |  |
| CREATE | LoaiDatCu | Đất ở | Đất ở | PASS |  |
| CREATE | LoaiDatMoi | Đất thương mại | Đất thương mại | PASS |  |
| CREATE | ChuSoHuuCu | Chu cu UI | Chu cu UI | PASS |  |
| CREATE | ChuSoHuuMoi | Chu moi UI | Chu moi UI | PASS |  |
| CREATE | CanBoXuLy | Can bo XL UI | Can bo XL UI | PASS |  |
| CREATE | LyDo | LYDO-56821168 | LYDO-56821168 | PASS |  |
| CREATE | GhiChu | Ghi chu UI BienDong ADD | Ghi chu UI BienDong ADD | PASS |  |
| UPDATE | TrangThai | Đã duyệt | Đã duyệt | PASS |  |
| UPDATE | CanBoXuLy | Can bo XL UI EDIT | Can bo XL UI EDIT | PASS |  |
| UPDATE | GhiChu | Ghi chu UI BienDong EDIT | Ghi chu UI BienDong EDIT | PASS |  |

## Quản lý cấp sổ đỏ

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | MaThua | TDCSD56829240 | TDCSD56829240 | PASS |  |
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

## Hồ sơ thẩm định thực địa

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | MaHoSo | HS-TD-56836101 | HS-TD-56836101 | PASS |  |
| CREATE | LoaiThamDinh | Cấp sổ đỏ mới | Cấp sổ đỏ mới | PASS |  |
| CREATE | DiaChiThuaDat | Dia chi UI TD | Dia chi UI TD | PASS |  |
| CREATE | MaThua | TDTH56836101 | TDTH56836101 | PASS |  |
| CREATE | SoTo | 7 | 7 | PASS |  |
| CREATE | DienTichHoSo | 88 | 88.00 | PASS |  |
| CREATE | NgayThamDinh | 2026-03-31 | 2026-03-31 | PASS |  |
| CREATE | CanBoThamDinh | CB TD UI | CB TD UI | PASS |  |
| CREATE | DonViThamDinh | Phong TNMT UI | Phong TNMT UI | PASS |  |
| CREATE | GhiChu | Ghi chu UI ThamDinh ADD | Ghi chu UI ThamDinh ADD | PASS |  |
| UPDATE | TrangThai | Hoàn thành | Hoàn thành | PASS |  |
| UPDATE | KetQuaThamDinh | Đúng hồ sơ | Đúng hồ sơ | PASS |  |
| UPDATE | DienTichThucTe | 89 | 89.00 | PASS |  |
| UPDATE | HinhAnhChungCu | 3 | 3 | PASS |  |
| UPDATE | MoTaSaiLech | Sai lech nho UI | Sai lech nho UI | PASS |  |
| UPDATE | DeXuatXuLy | De xuat UI | De xuat UI | PASS |  |
| UPDATE | GhiChu | Ghi chu UI ThamDinh EDIT | Ghi chu UI ThamDinh EDIT | PASS |  |

## Quản lý tranh chấp đất đai

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| CREATE | LoaiTranhChap | Tranh chấp ranh giới | Tranh chấp ranh giới | PASS |  |
| CREATE | MucDo | Trung bình | Trung bình | PASS |  |
| CREATE | MaThua | TDTC56843778 | TDTC56843778 | PASS |  |
| CREATE | SoTo | 5 | 5 | PASS |  |
| CREATE | DiaChiThuaDat | Dia chi UI TC | Dia chi UI TC | PASS |  |
| CREATE | DienTichTranhChap | 25 | 25.00 | PASS |  |
| CREATE | NgayKhieuNai | 2026-03-28 | 2026-03-28 | PASS |  |
| CREATE | BenKhieuNai | Nguoi khieu nai UI | Nguoi khieu nai UI | PASS |  |
| CREATE | CCCDKhieuNai | 333333333333 | 333333333333 | PASS |  |
| CREATE | SDTKhieuNai | 0900333333 | 0900333333 | PASS |  |
| CREATE | BenBiKhieuNai | Nguoi bi khieu nai UI | Nguoi bi khieu nai UI | PASS |  |
| CREATE | CCCDBiKhieuNai | 444444444444 | 444444444444 | PASS |  |
| CREATE | NoiDung | Noi dung TC 56843778 | Noi dung TC 56843778 | PASS |  |
| CREATE | GhiChu | Ghi chu UI TranhChap ADD | Ghi chu UI TranhChap ADD | PASS |  |

## runTranhChap

| Phase | Field | Expected | Actual | Status | Note |
|---|---|---|---|---|---|
| SUITE | execution | no error | locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for locator('[role="dialog"]').filter({ has: locator('button') }).last().locator('label').filter({ hasText: /^Phương án giải quyết\s*\*?$/i }).first().locator('xpath=ancestor::div[1]').locator('input').first()[22m
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
