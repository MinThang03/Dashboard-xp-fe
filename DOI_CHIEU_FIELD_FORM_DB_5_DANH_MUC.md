# Doi chieu field form va cot DB - 5 danh muc Hanh chinh Tu phap

## 1) Chung thuc, Xac nhan

| Field form FE | Cot DB hien co | Trang thai |
|---|---|---|
| MaHoSo | ChungThuc.SoChungThuc | Da co |
| TenNghiepVu | ChungThuc.TenNghiepVu | Bo sung moi |
| TenCongDan | ChungThuc.NguoiYeuCau | Da co |
| LoaiHoSo | ChungThuc.LoaiGiayTo | Da co |
| TenCanBoXuLy | ChungThuc.TenCanBoXuLy | Bo sung moi |
| TrangThai | ChungThuc.TrangThai | Da co |
| MaTrangThai | ChungThuc.MaTrangThai | Bo sung moi |
| HanXuLy | ChungThuc.HanXuLy | Bo sung moi |
| MucDoUuTien | ChungThuc.MucDoUuTien | Bo sung moi |
| GhiChuXuLy | ChungThuc.GhiChu | Da co |

## 2) Quan ly Ho khau - Cu tru

### HoKhau
| Field form FE | Cot DB hien co | Trang thai |
|---|---|---|
| soHoKhau | HoKhau.SoHoKhau | Da co |
| chuHo | HoKhau.ChuHo | Da co |
| cccd | HoKhau.CCCDChuHo | Bo sung moi |
| ngaySinh | HoKhau.NgaySinhChuHo | Bo sung moi |
| gioiTinh | HoKhau.GioiTinhChuHo | Bo sung moi |
| soDienThoai | HoKhau.SoDienThoaiChuHo | Bo sung moi |
| diaChi | HoKhau.DiaChiThuongTru | Da co |
| soThanhVien | HoKhau.SoThanhVien | Da co |
| loai | HoKhau.LoaiHoKhau | Da co |
| ngayDangKy | HoKhau.NgayDangKy | Da co |
| ghiChu | HoKhau.GhiChu | Da co |

### ThanhVienHoKhau
| Field form FE | Cot DB hien co | Trang thai |
|---|---|---|
| hoTen | ThanhVienHoKhau.HoTen | Da co |
| cccd | ThanhVienHoKhau.CCCD | Da co |
| ngaySinh | ThanhVienHoKhau.NgaySinh | Da co |
| gioiTinh | ThanhVienHoKhau.GioiTinh | Da co |
| quanHe | ThanhVienHoKhau.QuanHeChuHo | Da co |
| soDienThoai | ThanhVienHoKhau.SoDienThoai | Bo sung moi |

## 3) Quan ly Van ban

| Field form FE | Cot DB hien co | Trang thai |
|---|---|---|
| SoKyHieu | VanBan.SoKyHieu | Da co |
| TrichYeu | VanBan.TrichYeu | Da co |
| LoaiVanBan | VanBan.LoaiVanBan | Da co |
| LoaiVB | VanBan.LoaiVB | Da co |
| CoQuanBanHanh | VanBan.CoQuanBanHanh | Da co |
| NgayBanHanh | VanBan.NgayBanHanh | Da co |
| NgayDen | VanBan.NgayDen | Da co |
| MaLinhVuc | VanBan.MaLinhVuc | Da co |
| NguoiXuLy | VanBan.NguoiXuLy | Da co |
| TrangThai | VanBan.TrangThai | Da co |
| FileDinhKem | VanBan.FileDinhKem | Da co |
| GhiChu | VanBan.GhiChu | Da co |

## 4) Ho so Thu tuc Hanh chinh

| Field form FE | Cot DB hien co | Trang thai |
|---|---|---|
| MaHoSo | HoSoTTHC.MaHoSo | Da co |
| TenThuTuc | HoSoTTHC.TenThuTuc | Bo sung moi |
| TenCongDan | HoSoTTHC.NguoiNop | Da co |
| CCCD | HoSoTTHC.CCCD | Bo sung moi |
| SoDienThoai | HoSoTTHC.SoDienThoai | Da co |
| Email | HoSoTTHC.Email | Da co |
| DiaChiLienHe | HoSoTTHC.DiaChiLienHe | Bo sung moi |
| LoaiThuTuc | HoSoTTHC.MaLoaiThuTuc (mapping theo LoaiThuTuc) | Da co |
| LinhVuc | HoSoTTHC.LinhVuc | Bo sung moi |
| MaTrangThai | HoSoTTHC.TrangThai (mapping code -> text) | Da co |
| HanXuLy | HoSoTTHC.NgayHenTra | Da co |
| CanBoXuLy | HoSoTTHC.CanBoXuLy | Da co (co FK NguoiDung) |
| PhiLePhi | HoSoTTHC.PhiLePhi | Bo sung mapping entity |
| GhiChu | HoSoTTHC.GhiChu | Da co |

## 5) Bao cao Hanh chinh

| Field form FE | Cot DB hien co | Trang thai |
|---|---|---|
| TenBaoCao | BaoCao.TieuDe | Da co |
| LoaiBaoCao | BaoCao.LoaiBaoCao | Da co |
| KyBaoCao | BaoCao.ThangNam | Da co |
| NgayLap | BaoCao.NgayLap | Da co |
| NguoiLap (text) | BaoCao.NguoiLapText | Bo sung moi |
| SoLieuThongKe | BaoCao.SoLieuThongKe | Bo sung moi |
| GhiChu | BaoCao.GhiChu | Da co |

## Migration da tao
- Dashboard-xp-be/migrations/1738600200000-AddMissingAdminJusticeFormColumns.ts

## Frontend da noi lai de luu day du field
- Chung thuc: app/dashboard/chung-thuc/page.tsx
- Ho khau - Cu tru: app/dashboard/ho-khau/page.tsx
- Van ban: app/dashboard/van-ban/page.tsx
- Ho so TTHC: app/dashboard/ho-so-tthc/page.tsx
- Bao cao Hanh chinh: app/dashboard/bao-cao-hc/page.tsx
