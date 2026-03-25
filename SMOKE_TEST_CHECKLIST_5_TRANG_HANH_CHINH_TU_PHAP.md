# Smoke Test Checklist - 5 trang Hanh chinh Tu phap

## Pham vi
- Trang 1: Ho tich (`/dashboard/ho-tich`)
- Trang 2: Van ban (`/dashboard/van-ban`)
- Trang 3: Ho khau (`/dashboard/ho-khau`)
- Trang 4: Chung thuc (`/dashboard/chung-thuc`)
- Trang 5: Ho so TTHC (`/dashboard/ho-so-tthc`)

## Moi truong test
- Thoi gian: 2026-03-24
- Backend URL: `http://localhost:3006/api`
- Kieu test: Smoke test nhanh qua API that (khong mock)
- Script test: `Dashboard-xp-be/smoke-test-admin-justice.ps1`
- Ket qua raw: `Dashboard-xp-be/smoke-test-admin-justice-result.json`

## Cap nhat sau khi sua cau hinh TypeORM
- Da bo sung entity con thieu trong:
  - `Dashboard-xp-be/src/config/database.config.ts`
  - `Dashboard-xp-be/data-source.ts`
- Entity duoc dang ky them:
  - `ChungThuc`
  - `HoKhau`
  - `ThanhVienHoKhau`
  - `HoSoTTHC`
  - `LoaiThuTuc`

## Checklist PASS/FAIL

| STT | Module | Luong test | Ket qua | Bang chung |
|---|---|---|---|---|
| 1 | Ho tich | Add -> Edit -> Delete | PASS | Tao duoc `id=29`, update thanh cong, delete thanh cong |
| 2 | Van ban | Add -> Edit -> Delete | PASS | Tao duoc `MaVanBan=15`, update thanh cong, delete thanh cong |
| 3 | Chung thuc | Add -> Edit -> Delete | PASS | Tao duoc `MaChungThuc=8`, update thanh cong, delete thanh cong |
| 4 | Ho khau | Add -> Edit -> Delete (+ thanh vien add/delete) | PASS | Tao duoc `MaHoKhau=HKSMOKE260324...`, tao/xoa thanh vien thanh cong, update va delete thanh cong |
| 5 | Ho so TTHC | Add -> Edit -> Delete | PASS | Tao duoc `MaHoSo=HSSMOKE2603...`, update TrangThai thanh cong, delete thanh cong |

## Ket luan nghiem thu
- PASS: 5/5 module
- FAIL: 0/5 module
- Danh gia: Dat nghiem thu smoke test nhanh cho luong CRUD add/edit/delete cua 5 trang hanh chinh tu phap.

## Ghi chu
- Dot chay truoc da gap loi 500 do thieu TypeORM metadata o 3 module.
- Sau khi bo sung entity va retest, cac loi metadata da duoc xu ly.

## De xuat buoc tiep theo
1. Chuyen script smoke test vao CI de chay tu dong truoc khi merge.
2. Them payload test co dau/khong dau tieng Viet de phong loi rang buoc check constraint.
