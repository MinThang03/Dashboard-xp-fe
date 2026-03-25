# Báo cáo đối chiếu Database vs Frontend (10 danh mục Cán bộ)

Ngày kiểm tra: 2026-03-24  
Nguồn đối chiếu:
- SQL schema: `Dashboard-xp-fe/dbxaphuong.sql`
- Cấu trúc chức năng cán bộ: `Dashboard-xp-fe/lib/officer-modules.ts`
- Màn hình frontend: `Dashboard-xp-fe/app/dashboard/**/page.tsx`

## 1) Kết luận nhanh

- Đã có đủ route cho toàn bộ **58/58 chức năng con** của **10 danh mục cán bộ** (kiểm tra theo danh sách path trong `officer-modules.ts`).
- Tuy nhiên, nhiều màn hình hiện mới dừng ở mức hiển thị/CRUD cơ bản, chưa bao phủ đầy đủ các cột và quan hệ trong DB.
- Nếu triển khai backend API bám sát DB ngay, sẽ thiếu dữ liệu đầu vào ở nhiều module (đặc biệt nhóm TTHC, Địa chính, Y tế, Tài chính).

## 2) Các thiếu hụt nghiêm trọng cần ưu tiên (ảnh hưởng trực tiếp thiết kế API)

1. **Thiếu dữ liệu định danh công dân + phí dịch vụ** ở nhóm hành chính
- Bảng liên quan: `ChungThuc`, `HoSoTTHC`
- Cột thiếu điển hình: `CCCD`, `PhiDichVu`, `NgayHoanThanh`, `KetQua`
- Rủi ro: API thu phí/xác thực hồ sơ không nhận đủ dữ liệu.

2. **Thiếu toàn bộ dữ liệu chi tiết hồ sơ theo lĩnh vực trong TTHC**
- Bảng liên quan: `ChiTiet_TuPhap`, `ChiTiet_DiaChinh`, `ChiTiet_KinhTe`, `ChiTiet_MoiTruong`, `ChiTiet_XayDung`, `ChiTiet_VanHoa`, `ChiTiet_AnNinh`, `ChiTiet_GiaoDuc`, `ChiTiet_YTe`
- Rủi ro: backend có schema chi tiết nhưng frontend không có form để fill.

3. **Thiếu nhật ký luồng xử lý hồ sơ**
- Bảng liên quan: `LichSuXuLyHoSo`
- Cột thiếu điển hình: `TrangThaiCu`, `TrangThaiMoi`, `GhiChu`, `IPTruyCap`
- Rủi ro: API audit trail không có dữ liệu nguồn.

4. **Thiếu biểu mẫu thẩm định/tranh chấp/rủi ro quy hoạch ở Địa chính**
- Bảng liên quan: `BienBanThamDinhDatDai`, `HoSoTranhChapDatDai`, `RuiRoQuyHoach`, `RuiRoQuyHoach_AI`
- Rủi ro: API nghiệp vụ đất đai chuyên sâu không dùng được.

5. **Thiếu dữ liệu khám chữa bệnh và theo dõi tiêm chủng mức cá thể**
- Bảng liên quan: `PhieuKham`, `TiemChung_DoiTuong`
- Cột thiếu điển hình: `TrieuChung`, `ChanDoan`, `DonThuoc`, `ChiPhi`, `LieuThu`, `PhanUng`
- Rủi ro: không thể làm hồ sơ y tế đầy đủ.

6. **Thiếu file đính kèm ở nhiều nhóm nghiệp vụ**
- Bảng có cột đính kèm: `VanBan`, `HoSoTranhChapDatDai`, `BienBanThamDinhDatDai`, nhiều bảng báo cáo
- Rủi ro: backend có endpoint lưu tài liệu nhưng FE chưa có upload/đính kèm tương ứng.

## 3) Chi tiết theo 10 danh mục

## 3.1 Hành chính - Tư pháp

Chức năng con đã có route: 7/7
- `/dashboard/ho-tich`
- `/dashboard/chung-thuc`
- `/dashboard/ho-khau`
- `/dashboard/van-ban`
- `/dashboard/ho-so-tthc`
- `/dashboard/mot-cua`
- `/dashboard/bao-cao-hc`

Thiếu thông tin chính:
- `HoTich`: thiếu trường nhân khẩu trọng yếu như `ngay_sinh_chu_ho`, `gioi_tinh_chu_ho`; dữ liệu thành viên hộ tịch chưa bao phủ đầy đủ quan hệ.
- `ChungThuc`: thiếu `CCCD`, `PhiDichVu`, `NgayHoanThanh`.
- `VanBan`: thiếu hoặc chưa rõ `TrichYeu`, `LoaiVanBan`/`LoaiVB`, `CoQuanBanHanh`, `NgayBanHanh`, `NgayDen`, `FileDinhKem`.
- `HoSoTTHC`: thiếu `Email`, `KetQua`; thiếu phần nhập liệu cho 9 bảng `ChiTiet_*`.
- `LichSuXuLyHoSo` (một cửa): chưa thấy màn theo dõi chuyển trạng thái chi tiết (`TrangThaiCu`, `TrangThaiMoi`, `GhiChu`, `IPTruyCap`).
- `BaoCao`: thiếu hoặc chưa rõ `LoaiBaoCao`, `ThangNam`, `FileDinhKem`.

## 3.2 Y tế - Giáo dục

Chức năng con đã có route: 7/7
- `/dashboard/tram-y-te`
- `/dashboard/dich-benh`
- `/dashboard/tiem-chung`
- `/dashboard/kham-benh`
- `/dashboard/giao-duc`
- `/dashboard/si-so-hoc-sinh`
- `/dashboard/co-so-giao-duc`

Thiếu thông tin chính:
- `TramYTe` + `NhanVienYTe` + `ThietBiYTe` + `BaoTriThietBi`: thiếu quản lý danh sách nhân viên/chuyên môn/trang thiết bị/bảo trì.
- `DichBenh`: thiếu theo dõi đầy đủ `SoCaNhiem`, `SoCaKhoi`, vùng ảnh hưởng (`KhuVuc`).
- `TiemChung` + `TiemChung_DoiTuong`: thiếu dữ liệu mũi tiêm theo cá thể (`LieuThu`, `PhanUng`, liên kết công dân).
- `PhieuKham`: thiếu `TrieuChung`, `ChanDoan`, `DonThuoc`, `ChiPhi`.
- `LopHoc`, `DiemDanhLop`, `GiaoDucTongHop`: thiếu form/luồng để nhập dữ liệu chuyên sâu lớp học và điểm danh.

## 3.3 Kinh tế - Thương mại

Chức năng con đã có route: 5/5
- `/dashboard/ho-kinh-doanh`
- `/dashboard/cho-kinh-doanh`
- `/dashboard/thu-phi`
- `/dashboard/ho-tro-doanh-nghiep`
- `/dashboard/thong-ke-kinh-te`

Thiếu thông tin chính:
- `HoKinhDoanh`: thiếu một số trường đăng ký/giấy phép chi tiết (tùy màn hiện tại).
- `ChoDiemKinhDoanh`: thiếu theo dõi quầy/sạp theo thời gian.
- `ThuPhi`: thiếu luồng đối soát đầy đủ khoản thu (kỳ thu, trạng thái thanh toán, liên kết đối tượng).
- `NoThue`: chưa thấy coverage rõ ở màn chức năng kinh tế hiện tại.

## 3.4 Quốc phòng - An ninh

Chức năng con đã có route: 5/5
- `/dashboard/tam-tru-vang`
- `/dashboard/vi-pham`
- `/dashboard/an-ninh-trat-tu`
- `/dashboard/phan-anh`
- `/dashboard/diem-nong-antt`

Thiếu thông tin chính:
- `TamTruTamVang`: thiếu một số thông tin kiểm soát thời hạn và xác nhận xử lý theo cán bộ.
- `ViPhamHanhChinh`: thiếu hoặc chưa chuẩn hóa thông tin mức phạt/biên bản/quyết định xử lý chi tiết.
- `TinhHinhANTT`: thiếu bộ chỉ số ANTT tổng hợp theo kỳ.
- `PhanAnhNguoiDan`: thiếu liên kết đầy đủ đến kết quả phản hồi và tài liệu minh chứng.

## 3.5 Xây dựng - Hạ tầng

Chức năng con đã có route: 5/5
- `/dashboard/cap-phep-xay-dung`
- `/dashboard/trat-tu-xay-dung`
- `/dashboard/ha-tang`
- `/dashboard/xay-dung-trai-phep`
- `/dashboard/nha-o-cong-trinh`

Thiếu thông tin chính:
- `HoSoCapPhepXayDung`: thiếu metadata hồ sơ/tiến độ chi tiết theo bước.
- `TheoDoiTratTuXayDung`: thiếu nhật ký kiểm tra theo thời điểm.
- `HaTangDoThi`: thiếu lịch bảo trì/sửa chữa và trạng thái vận hành.
- `XayDungTraiPhep`: thiếu luồng xử lý vi phạm đầy đủ (mốc xử lý/quyết định/biện pháp).

## 3.6 Lao động - TBXH

Chức năng con đã có route: 4/4
- `/dashboard/ho-ngheo`
- `/dashboard/bao-tro-xa-hoi`
- `/dashboard/nguoi-co-cong`
- `/dashboard/viec-lam`

Thiếu thông tin chính:
- `HoNgheo`: thiếu theo dõi lịch sử rà soát và chuyển nhóm hộ qua các kỳ.
- `DoiTuongBaoTro`: thiếu tracking quá trình nhận trợ cấp theo tháng/kỳ.
- `NguoiCoCong`: thiếu hồ sơ minh chứng/chế độ chi trả chi tiết.
- `NguoiTimViec`: thiếu quy trình giới thiệu việc làm và kết quả sau giới thiệu.

## 3.7 Quản lý tài chính

Chức năng con đã có route: 7/7
- `/dashboard/thu-ngan-sach`
- `/dashboard/chi-ngan-sach`
- `/dashboard/so-sanh-du-toan`
- `/dashboard/canh-bao-du-toan`
- `/dashboard/giai-ngan`
- `/dashboard/xu-huong-tai-chinh`
- `/dashboard/bao-cao-tai-chinh`

Thiếu thông tin chính:
- `NganSach`, `DuToanNganSach`, `PhieuThu`, `PhieuChi`, `GiaiNgan`: thiếu luồng nhập liệu xuyên suốt từ dự toán -> thực thu/chi -> giải ngân -> quyết toán.
- `PhanTichTaiChinh_AI`: thiếu màn hình/field cho dữ liệu phân tích AI theo schema.
- Cảnh báo/đối soát tài chính còn thiên về hiển thị, chưa thấy coverage đủ các trường DB nghiệp vụ.

## 3.8 Địa chính

Chức năng con đã có route: 8/8
- `/dashboard/tra-cuu-dat`
- `/dashboard/bien-dong-dat`
- `/dashboard/cap-so-do`
- `/dashboard/tham-dinh-thuc-dia`
- `/dashboard/tranh-chap`
- `/dashboard/rui-ro-quy-hoach`
- `/dashboard/ho-so-ton-dong`
- `/dashboard/bao-cao-dat-dai`

Thiếu thông tin chính (mức ưu tiên cao nhất):
- `ThuaDat`: thiếu truy vấn sâu theo `DienTich`, `MaLoaiDat`, `ChuSoHuu`, `ToaDo`.
- `BienDongDat` + `LichSuBienDongDatDai`: thiếu hiển thị đầy đủ trước/sau biến động và tài liệu chứng minh.
- `HoSoCapGCN`: thiếu `SoGCN`, `NgayCap`, liên kết biên bản thẩm định.
- `BienBanThamDinhDatDai`: thiếu nhập `KetLuan`, `TaiLieuDinhKem`, `NgayThamDinh`.
- `HoSoTranhChapDatDai`: thiếu `BenA`, `BenB`, `DienTichTranh`, `KetQuaGiaiQuyet`, `SoQuyetDinh`, tài liệu liên quan.
- `RuiRoQuyHoach`, `RuiRoQuyHoach_AI`: thiếu form và luồng xử lý rủi ro quy hoạch.

## 3.9 Quản lý môi trường

Chức năng con đã có route: 4/4
- `/dashboard/chat-luong-moi-truong`
- `/dashboard/rac-thai`
- `/dashboard/bao-cao-o-nhiem`
- `/dashboard/thong-ke-moi-truong`

Thiếu thông tin chính:
- `ChiSoAQI_TheoNgay`: chưa thấy coverage đủ các chỉ số AQI thành phần theo ngày/điểm đo.
- `RacThai`: thiếu quy trình vận chuyển/xử lý chi tiết theo tuyến và thời điểm.
- `DiemNongMoiTruong`, `BaoCaoONhiem`: thiếu đính kèm minh chứng, theo dõi xử lý theo vòng đời vụ việc.

## 3.10 Văn hóa - Du lịch

Chức năng con đã có route: 6/6
- `/dashboard/di-tich`
- `/dashboard/ho-so-di-tich`
- `/dashboard/kinh-doanh-du-lich`
- `/dashboard/lang-nghe`
- `/dashboard/le-hoi`
- `/dashboard/bao-cao-van-hoa`

Thiếu thông tin chính:
- `DiTich`: thiếu một số trường hồ sơ bảo tồn và kế hoạch tu bổ dài hạn.
- `LeHoi`: thiếu kế hoạch tổ chức/chi phí/đánh giá sau sự kiện theo cấu trúc DB.
- `LangNghe`, `SanPhamOCOP`: thiếu dữ liệu chuỗi sản phẩm/sản lượng/chứng nhận.
- `CoSoKinhDoanhDuLich`: thiếu kiểm tra điều kiện kinh doanh và trạng thái cấp phép chi tiết.

## 4) Checklist trường nên bổ sung ngay cho FE trước khi chốt API

1. Nhóm định danh - hành chính:
- `CCCD`, `SoDienThoai`, `Email`, `DiaChi` chuẩn hóa ở tất cả form hồ sơ công dân.

2. Nhóm quy trình - SLA:
- `NgayTiepNhan`, `NgayHenTra`, `NgayHoanThanh`, `TrangThai`, `KetQua`, `LyDoTreHan`.

3. Nhóm tài chính:
- `PhiDichVu`, `SoTien`, `DaThanhToan`, `PhuongThucThanhToan`, `NgayThanhToan`.

4. Nhóm file/hồ sơ:
- `FileDinhKem`, `TaiLieuLienQuan`, `BienBan`, `SoQuyetDinh`.

5. Nhóm lịch sử xử lý:
- log chuyển trạng thái (trước/sau), thời điểm, người xử lý, ghi chú, IP/thiết bị (nếu dùng audit).

6. Nhóm dữ liệu chuyên sâu theo lĩnh vực:
- TTHC `ChiTiet_*`, Địa chính (thẩm định/tranh chấp/rủi ro), Y tế (khám/tiêm), Giáo dục (lớp/điểm danh), Tài chính (dự toán/giải ngân/AI).

## 5) Gợi ý triển khai để tránh thiếu dữ liệu khi làm backend API

1. Chốt danh sách DTO bắt buộc theo từng chức năng con từ schema DB (ưu tiên top CRITICAL/HIGH ở trên).
2. Bổ sung form FE theo nhóm trường chuẩn dùng chung (định danh, thời gian, trạng thái, tài chính, file đính kèm).
3. Với bảng quan hệ cha-con (`ChiTiet_*`, `ThanhVien*`, lịch sử xử lý): thiết kế UI dạng tab/accordion + sub-form lặp.
4. Chỉ publish endpoint backend chính thức sau khi FE có đủ input tối thiểu cho các cột bắt buộc nghiệp vụ.

---

Ghi chú kiểm tra:
- Báo cáo này tập trung vào khoảng cách dữ liệu giữa schema và giao diện nhập/xem/sửa hiện tại của frontend.
- Một số màn có dữ liệu mock hoặc chỉ hiển thị thống kê, nên được đánh dấu là thiếu coverage khi chưa thấy form lưu đầy đủ theo cột DB.