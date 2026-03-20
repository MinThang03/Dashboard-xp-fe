-- ================================================================
-- DATABASE: Dashboard Xã/Phường (Sorted by modules for readability)
-- Đã convert từ MySQL sang PostgreSQL
-- Nguồn: DashboardXaPhuong.sql
-- ================================================================

-- ================================================================
-- 0. QUẢN TRỊ ĐỊNH DANH & PHÂN QUYỀN CỐT LÕI
-- ================================================================

CREATE TABLE VaiTro (
    MaVaiTro SERIAL PRIMARY KEY,
    TenVaiTro VARCHAR(50) UNIQUE NOT NULL,
    MaCode VARCHAR(20) UNIQUE NOT NULL,
    MoTa VARCHAR(255),
    ThuTuHienThi INT DEFAULT 0,
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO VaiTro (TenVaiTro, MaCode, ThuTuHienThi) VALUES
('Quản trị hệ thống', 'ADMIN', 1),
('Lãnh đạo', 'LANHDAO', 2),
('Cán bộ chuyên môn', 'CANBO', 3),
('Công dân', 'CONGDAN', 4);

CREATE TABLE CapDoQuyen (
    MaCapDo INT PRIMARY KEY,
    TenCapDo VARCHAR(50) UNIQUE NOT NULL,
    MoTa TEXT,
    TrangThai BOOLEAN DEFAULT true
);

INSERT INTO CapDoQuyen (MaCapDo, TenCapDo, MoTa) VALUES
(1, 'Siêu quản trị', 'Toàn quyền hệ thống'),
(2, 'Quản trị', 'Quản trị cơ bản'),
(3, 'Quản lý', 'Quản lý nghiệp vụ');

CREATE TABLE NguoiDung (
    MaNguoiDung SERIAL PRIMARY KEY,
    TenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    HoVaTen VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    SoDienThoai VARCHAR(20),
    AnhDaiDien VARCHAR(500),
    MaVaiTro INT NOT NULL,
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat TIMESTAMP DEFAULT NULL,
    NguoiTao INT,
    IsDeleted BOOLEAN DEFAULT false,
    FOREIGN KEY (MaVaiTro) REFERENCES VaiTro(MaVaiTro),
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung),
    CHECK (Email IS NULL OR Email LIKE '%@%.%'),
    CHECK (SoDienThoai IS NULL OR LENGTH(SoDienThoai) >= 10)
);

CREATE TABLE QuanTriVien (
    MaAdmin SERIAL PRIMARY KEY,
    MaNguoiDung INT UNIQUE NOT NULL,
    MaCapDo INT,
    NgayNhanViec TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    GhiChu TEXT,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung),
    FOREIGN KEY (MaCapDo) REFERENCES CapDoQuyen(MaCapDo)
);

CREATE TABLE CongDan (
    MaCongDan SERIAL PRIMARY KEY,
    MaNguoiDung INT UNIQUE,
    SoCCCD VARCHAR(20) UNIQUE NOT NULL,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh VARCHAR(10),
    DiaChiThuongTru VARCHAR(255),
    DiaChiTamTru VARCHAR(255),
    ToaDoNha VARCHAR(50),
    NgayDangKy TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung),
    CHECK (GioiTinh IS NULL OR GioiTinh IN ('Nam', 'Nữ', 'Khác'))
);

-- ================================================================
-- 1. DANH MỤC LĨNH VỰC / PHÒNG BAN / NHÂN SỰ
-- ================================================================

CREATE TABLE LinhVuc (
    MaLinhVuc SERIAL PRIMARY KEY,
    TenLinhVuc VARCHAR(100) UNIQUE NOT NULL,
    MoTa TEXT,
    MaCode VARCHAR(20) UNIQUE,
    ThuTuHienThi INT DEFAULT 0,
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO LinhVuc (TenLinhVuc, MaCode, ThuTuHienThi) VALUES
('Hành chính Tư pháp', 'TU_PHAP', 1),
('Y tế - Giáo dục', 'Y_TE_GD', 2),
('Kinh tế - Thương mại', 'KINH_TE', 3),
('Quốc phòng - An ninh', 'AN_NINH', 4),
('Xây dựng - Hạ tầng', 'XAY_DUNG', 5),
('Dân cư - Lao động', 'LAO_DONG', 6),
('Quản lý Tài chính', 'TAI_CHINH', 7),
('Địa chính', 'DIA_CHINH', 8),
('Quản lý Môi trường', 'MOI_TRUONG', 9),
('Văn hóa - Du lịch', 'VAN_HOA', 10);

CREATE TABLE PhongBan (
    MaPhongBan SERIAL PRIMARY KEY,
    TenPhongBan VARCHAR(100) UNIQUE NOT NULL,
    MoTa TEXT,
    MaLinhVuc INT,
    TruongPhong INT,
    NgayThanhLap TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TrangThai BOOLEAN DEFAULT true,
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc),
    FOREIGN KEY (TruongPhong) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE LanhDao (
    MaLanhDao SERIAL PRIMARY KEY,
    MaNguoiDung INT UNIQUE NOT NULL,
    MaPhongBan INT,
    ChucVu VARCHAR(50) NOT NULL,
    NhiemKy VARCHAR(50),
    NgayBatDau DATE DEFAULT CURRENT_DATE,
    NgayKetThuc DATE,
    DuocDuyetNganSach BOOLEAN DEFAULT false,
    DuocKyQuyetDinh BOOLEAN DEFAULT true,
    IsDeleted BOOLEAN DEFAULT false,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung),
    FOREIGN KEY (MaPhongBan) REFERENCES PhongBan(MaPhongBan)
);

CREATE TABLE CanBo (
    MaCanBo SERIAL PRIMARY KEY,
    MaNguoiDung INT UNIQUE NOT NULL,
    MaPhongBan INT,
    MaLinhVuc INT,
    ChucDanh VARCHAR(50),
    DiemKPI FLOAT DEFAULT 0 CHECK (DiemKPI BETWEEN 0 AND 100),
    NgayBatDau DATE DEFAULT CURRENT_DATE,
    IsDeleted BOOLEAN DEFAULT false,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung),
    FOREIGN KEY (MaPhongBan) REFERENCES PhongBan(MaPhongBan),
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc)
);

-- ================================================================
-- 2. NỀN TẢNG HỒ SƠ NGHIỆP VỤ (dùng chung mọi lĩnh vực)
-- ================================================================

CREATE TABLE TrangThaiHoSo (
    MaTrangThai VARCHAR(20) PRIMARY KEY,
    TenTrangThai VARCHAR(50) UNIQUE NOT NULL,
    MauSac VARCHAR(20),
    ThuTuHienThi INT DEFAULT 0,
    MoTa VARCHAR(255)
);

INSERT INTO TrangThaiHoSo (MaTrangThai, TenTrangThai, MauSac, ThuTuHienThi) VALUES
('MOI_TAO', 'Mới tạo', '#3498db', 1),
('DANG_XU_LY', 'Đang xử lý', '#f39c12', 2),
('CHO_DUYET', 'Chờ duyệt', '#9b59b6', 3),
('DA_DUYET', 'Đã duyệt', '#2ecc71', 4),
('DA_TU_CHOI', 'Đã từ chối', '#e74c3c', 5),
('HOAN_THANH', 'Hoàn thành', '#27ae60', 6),
('DA_HUY', 'Đã hủy', '#95a5a6', 7);

CREATE TABLE LoaiNghiepVu (
    MaLoaiNghiepVu SERIAL PRIMARY KEY,
    TenLoai VARCHAR(100) NOT NULL,
    MaLinhVuc INT NOT NULL,
    ThoiHanXuLy INT,
    MoTa TEXT,
    TrangThai BOOLEAN DEFAULT true,
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc)
);

CREATE TABLE HoSoNghiepVu (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    TenNghiepVu VARCHAR(200) NOT NULL,
    MaCongDan INT NOT NULL,
    MaLinhVuc INT NOT NULL,
    MaLoaiNghiepVu INT,
    LoaiHoSo VARCHAR(50),
    MaCanBoXuLy INT,
    MaLanhDaoDuyet INT,
    MaTrangThai VARCHAR(20) NOT NULL DEFAULT 'MOI_TAO',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    HanXuLy TIMESTAMP NOT NULL,
    NgayHoanThanh TIMESTAMP,
    LyDoTuChoi TEXT,
    GhiChuXuLy TEXT,
    MucDoUuTien INT DEFAULT 2 CHECK (MucDoUuTien BETWEEN 1 AND 5),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan),
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc),
    FOREIGN KEY (MaLoaiNghiepVu) REFERENCES LoaiNghiepVu(MaLoaiNghiepVu),
    FOREIGN KEY (MaCanBoXuLy) REFERENCES CanBo(MaCanBo),
    FOREIGN KEY (MaLanhDaoDuyet) REFERENCES LanhDao(MaLanhDao),
    FOREIGN KEY (MaTrangThai) REFERENCES TrangThaiHoSo(MaTrangThai),
    CHECK (NgayHoanThanh IS NULL OR NgayHoanThanh >= NgayTao),
    CHECK (HanXuLy >= NgayTao)
);

CREATE TABLE LichSuXuLyHoSo (
    MaLichSu SERIAL PRIMARY KEY,
    MaHoSo VARCHAR(20) NOT NULL,
    TrangThaiCu VARCHAR(20),
    TrangThaiMoi VARCHAR(20) NOT NULL,
    NguoiThucHien INT NOT NULL,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    GhiChu TEXT,
    IPTruyCap VARCHAR(50),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (NguoiThucHien) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE TaiLieuHoSo (
    MaTaiLieu SERIAL PRIMARY KEY,
    MaHoSo VARCHAR(20) NOT NULL,
    TenTaiLieu VARCHAR(200) NOT NULL,
    DuongDanFile VARCHAR(500) NOT NULL,
    LoaiFile VARCHAR(20),
    DungLuong BIGINT,
    NgayTai TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NguoiTai INT,
    TrangThai BOOLEAN DEFAULT true,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (NguoiTai) REFERENCES NguoiDung(MaNguoiDung),
    CHECK (DungLuong > 0)
);

CREATE TABLE YeuCauBoSungTaiLieu (
    MaYeuCau SERIAL PRIMARY KEY,
    MaHoSo VARCHAR(20) NOT NULL,
    NoiDungYeuCau TEXT NOT NULL,
    TrangThai VARCHAR(50) DEFAULT 'Chờ bổ sung',
    NgayYeuCau TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NguoiYeuCau INT NOT NULL,
    NgayHoanThanh TIMESTAMP,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (NguoiYeuCau) REFERENCES NguoiDung(MaNguoiDung),
    CHECK (TrangThai IN ('Chờ bổ sung', 'Đã bổ sung', 'Đã hủy'))
);

CREATE TABLE DanhGiaHoSo (
    MaDanhGia SERIAL PRIMARY KEY,
    MaHoSo VARCHAR(20),
    MaLanhDao INT,
    DiemDanhGia INT CHECK (DiemDanhGia BETWEEN 1 AND 5),
    NhanXet TEXT,
    NgayDanhGia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (MaLanhDao) REFERENCES LanhDao(MaLanhDao)
);

CREATE TABLE DanhGiaDichVu (
    MaDanhGia SERIAL PRIMARY KEY,
    MaHoSo VARCHAR(20),
    MaCongDan INT NOT NULL,
    DiemDichVu INT NOT NULL CHECK (DiemDichVu BETWEEN 1 AND 5),
    DiemThoiGian INT CHECK (DiemThoiGian BETWEEN 1 AND 5),
    DiemThaiDo INT CHECK (DiemThaiDo BETWEEN 1 AND 5),
    YKienKhac TEXT,
    NgayDanhGia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE PhanAnh (
    MaPhanAnh SERIAL PRIMARY KEY,
    MaCongDan INT NOT NULL,
    TieuDe VARCHAR(200) NOT NULL,
    NoiDung TEXT NOT NULL,
    ToaDo VARCHAR(50) NULL,
    MaLinhVuc INT,
    TrangThai VARCHAR(50) DEFAULT 'Mới',
    MucDoUuTien VARCHAR(20) NULL,
    DiaDiem VARCHAR(255) NULL,
    MaCanBoXuLy INT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NgayXuLy TIMESTAMP,
    KetQuaXuLy TEXT,
    DiemDanhGia INT CHECK (DiemDanhGia IS NULL OR DiemDanhGia BETWEEN 1 AND 5),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan),
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc),
    FOREIGN KEY (MaCanBoXuLy) REFERENCES CanBo(MaCanBo),
    CHECK (TrangThai IN ('Mới', 'Đang xử lý', 'Đã xử lý', 'Đã đóng')),
    CHECK (MucDoUuTien IS NULL OR MucDoUuTien IN ('Thường', 'Khẩn cấp'))
);

CREATE TABLE PhanAnh_Tep (
    MaTep SERIAL PRIMARY KEY,
    MaPhanAnh INT NOT NULL,
    TenFile VARCHAR(255) NOT NULL,
    DuongDanFile VARCHAR(500) NOT NULL,
    LoaiFile VARCHAR(20) DEFAULT 'IMAGE',
    DungLuong BIGINT NULL,
    NgayTai TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaPhanAnh) REFERENCES PhanAnh(MaPhanAnh) ON DELETE CASCADE
);

CREATE INDEX IX_PhanAnh_Tep_MaPhanAnh ON PhanAnh_Tep(MaPhanAnh);

CREATE TABLE KhoTriThuc (
    MaTriThuc SERIAL PRIMARY KEY,
    TieuDe VARCHAR(200) NOT NULL,
    NoiDung TEXT NOT NULL,
    MaLinhVuc INT,
    LoaiTriThuc VARCHAR(50),
    NguonTaiLieu VARCHAR(255),
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat TIMESTAMP DEFAULT NULL,
    NguoiCapNhat INT,
    TrangThai BOOLEAN DEFAULT true,
    DoChinhXac FLOAT CHECK (DoChinhXac IS NULL OR (DoChinhXac BETWEEN 0 AND 1)),
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc),
    FOREIGN KEY (NguoiCapNhat) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE LichSuTraCuuAI (
    MaTraCuu SERIAL PRIMARY KEY,
    MaNguoiDung INT NOT NULL,
    CauHoi TEXT NOT NULL,
    KetQua TEXT,
    MaLinhVuc INT,
    ThoiGian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DoHaiLong INT CHECK (DoHaiLong IS NULL OR DoHaiLong BETWEEN 1 AND 5),
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung),
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc)
);

CREATE TABLE PhanTichPhanAnh (
    MaPhanTich SERIAL PRIMARY KEY,
    MaPhanAnh INT NOT NULL,
    KetQuaPhanTich TEXT,
    MucDoUuTien VARCHAR(20),
    DeXuatXuLy TEXT,
    ThoiGianPhanTich TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaPhanAnh) REFERENCES PhanAnh(MaPhanAnh),
    CHECK (MucDoUuTien IS NULL OR MucDoUuTien IN ('Cao', 'Trung bình', 'Thấp'))
);

-- View bản đồ phản ánh
CREATE OR REPLACE VIEW vw_PhanAnh_BanDo AS
SELECT
    pa.MaPhanAnh,
    pa.TieuDe,
    pa.NoiDung,
    pa.ToaDo,
    pa.MucDoUuTien,
    pa.TrangThai,
    pa.NgayTao,
    lv.TenLinhVuc,
    cd.HoTen AS TenNguoiPhanAnh,
    cd.SoCCCD
FROM PhanAnh pa
LEFT JOIN LinhVuc lv ON pa.MaLinhVuc = lv.MaLinhVuc
LEFT JOIN CongDan cd ON pa.MaCongDan = cd.MaCongDan
WHERE pa.ToaDo IS NOT NULL AND pa.ToaDo != '';

-- ================================================================
-- MODULE 1. HÀNH CHÍNH TƯ PHÁP
-- ================================================================

CREATE TABLE HoTich (
    id SERIAL PRIMARY KEY,
    so_ho_tich VARCHAR(30) UNIQUE NOT NULL,
    ten_chu_ho VARCHAR(150) NOT NULL,
    ngay_sinh_chu_ho DATE,
    gioi_tinh_chu_ho VARCHAR(10),
    dia_chi_ho_tich VARCHAR(255) NOT NULL,
    so_thanh_vien_ho_tich INT DEFAULT 0,
    ngay_lap_ho_tich DATE DEFAULT CURRENT_DATE,
    ghi_chu TEXT,
    trang_thai BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_so_ho_tich ON HoTich(so_ho_tich);
CREATE INDEX idx_ten_chu_ho ON HoTich(ten_chu_ho);

CREATE TABLE ThanhVienHoTich (
    id SERIAL PRIMARY KEY,
    id_ho_tich INT NOT NULL,
    so_cccd VARCHAR(20) UNIQUE,
    ho_ten VARCHAR(150) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10),
    quan_he_voi_chu_ho VARCHAR(50),
    trang_thai BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ho_tich) REFERENCES HoTich(id) ON DELETE CASCADE
);

CREATE INDEX idx_id_ho_tich ON ThanhVienHoTich(id_ho_tich);
CREATE INDEX idx_so_cccd ON ThanhVienHoTich(so_cccd);

CREATE TABLE VanBan (
    MaVanBan SERIAL PRIMARY KEY,
    SoKyHieu VARCHAR(50) NOT NULL,
    TrichYeu VARCHAR(500) NOT NULL,
    LoaiVanBan VARCHAR(50) NOT NULL,
    LoaiVB VARCHAR(100),
    CoQuanBanHanh VARCHAR(200),
    NgayBanHanh DATE,
    NgayDen DATE,
    MaLinhVuc INT,
    NguoiXuLy INT,
    TrangThai VARCHAR(50) DEFAULT 'Mới',
    FileDinhKem VARCHAR(500),
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc),
    FOREIGN KEY (NguoiXuLy) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE LoaiQuyetDinh (
    MaLoaiQD SERIAL PRIMARY KEY,
    TenLoaiQD VARCHAR(100) NOT NULL
);

CREATE TABLE QuyetDinh (
    MaQD SERIAL PRIMARY KEY,
    SoQD VARCHAR(50) NOT NULL,
    NgayBanHanh DATE NOT NULL,
    NoiDung TEXT,
    MaLoaiQD INT,
    MaHoSo VARCHAR(20),
    DuongDanFile VARCHAR(500),
    NguoiKy INT,
    FOREIGN KEY (MaLoaiQD) REFERENCES LoaiQuyetDinh(MaLoaiQD),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (NguoiKy) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE ChiTiet_TuPhap (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    LoaiGiayTo VARCHAR(100) NOT NULL,
    HoTenDoiTuong VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    SoGiayTo VARCHAR(50),
    NoiDungTrichYeu TEXT,
    LoaiThucHien VARCHAR(50),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

-- ================================================================
-- MODULE 2. Y TẾ - GIÁO DỤC
-- ================================================================

CREATE TABLE TramYTe (
    MaTram SERIAL PRIMARY KEY,
    TenTram VARCHAR(150) NOT NULL,
    DiaChi VARCHAR(255),
    SoDienThoai VARCHAR(20),
    SoNhanVien INT DEFAULT 0,
    SoLuotKhamThang INT DEFAULT 0,
    TrangThai BOOLEAN DEFAULT true,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO TramYTe (TenTram, DiaChi, SoDienThoai, SoNhanVien, SoLuotKhamThang, GhiChu) VALUES
('Trạm Y tế Phường 1', 'Phường 1', '0900000000', 0, 0, 'Seed mặc định');

CREATE TABLE DichBenh (
    MaDich SERIAL PRIMARY KEY,
    TenDich VARCHAR(100) NOT NULL,
    KhuVuc VARCHAR(150),
    SoCaNhiem INT DEFAULT 0,
    SoCaKhoi INT DEFAULT 0,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    MucDo VARCHAR(20),
    TrangThai VARCHAR(50) DEFAULT 'Đang theo dõi',
    GhiChu TEXT,
    NgayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TiemChung (
    MaTiemChung SERIAL PRIMARY KEY,
    TenDot VARCHAR(150) NOT NULL,
    LoaiVacxin VARCHAR(100),
    NgayBatDau DATE,
    NgayKetThuc DATE,
    SoLuongDaTiem INT DEFAULT 0,
    SoLuongKeHoach INT,
    MaTram INT,
    TrangThai VARCHAR(50) DEFAULT 'Đang triển khai',
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaTram) REFERENCES TramYTe(MaTram)
);

CREATE TABLE TiemChung_DoiTuong (
    MaTC_DoiTuong SERIAL PRIMARY KEY,
    MaTiemChung INT NOT NULL,
    MaCongDan INT NOT NULL,
    LoaiVacxin VARCHAR(100),
    NgayTiem DATE NOT NULL,
    MuiThu INT DEFAULT 1,
    TrangThai VARCHAR(50) DEFAULT 'Đã tiêm',
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaTiemChung) REFERENCES TiemChung(MaTiemChung),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE PhieuKham (
    MaPhieuKham SERIAL PRIMARY KEY,
    MaTram INT NOT NULL,
    MaCongDan INT,
    HoTenBenhNhan VARCHAR(100),
    NgayKham DATE NOT NULL,
    TrieuChung TEXT,
    BacSiXuLy INT,
    GioKham TIME,
    KetQuaKham TEXT,
    TrangThai VARCHAR(50) DEFAULT 'Đã khám',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaTram) REFERENCES TramYTe(MaTram),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan),
    FOREIGN KEY (BacSiXuLy) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE NhanVienYTe (
    MaNhanVien SERIAL PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    GioiTinh VARCHAR(10),
    ChucDanh VARCHAR(100),
    ChuyenMon VARCHAR(100),
    SoDienThoai VARCHAR(20),
    TrangThaiLamViec VARCHAR(50) DEFAULT 'Đang làm việc',
    MaTram INT NOT NULL,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    GhiChu TEXT,
    FOREIGN KEY (MaTram) REFERENCES TramYTe(MaTram)
);

CREATE TABLE LuotKham (
    MaLuotKham SERIAL PRIMARY KEY,
    MaTram INT NOT NULL,
    NgayKham DATE NOT NULL,
    LoaiKham VARCHAR(100),
    SoLuongBenhNhan INT DEFAULT 0,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaTram) REFERENCES TramYTe(MaTram)
);

CREATE TABLE ThietBiYTe (
    MaThietBi SERIAL PRIMARY KEY,
    TenThietBi VARCHAR(150) NOT NULL,
    LoaiThietBi VARCHAR(100),
    NgayMua DATE,
    TinhTrang VARCHAR(50),
    MaTram INT NOT NULL,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaTram) REFERENCES TramYTe(MaTram)
);

CREATE TABLE BaoTriThietBi (
    MaBaoTri SERIAL PRIMARY KEY,
    MaThietBi INT NOT NULL,
    NgayBaoTri DATE NOT NULL,
    NoiDung TEXT,
    TrangThai VARCHAR(50),
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaThietBi) REFERENCES ThietBiYTe(MaThietBi)
);

CREATE TABLE CoSoGiaoDuc (
    MaCoSo SERIAL PRIMARY KEY,
    MaTruong VARCHAR(20) UNIQUE,
    TenTruong VARCHAR(200) NOT NULL,
    LoaiTruong VARCHAR(50),
    DiaChi VARCHAR(255),
    SoLop INT DEFAULT 0,
    SiSoHocSinh INT DEFAULT 0,
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LopHoc (
    MaLop SERIAL PRIMARY KEY,
    MaCoSo INT NOT NULL,
    MaLopHoc VARCHAR(20),
    TenLop VARCHAR(100) NOT NULL,
    SiSo INT DEFAULT 0,
    NamHoc VARCHAR(20),
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCoSo) REFERENCES CoSoGiaoDuc(MaCoSo)
);

CREATE TABLE DiemDanhLop (
    MaDiemDanh SERIAL PRIMARY KEY,
    MaLop INT NOT NULL,
    Ngay DATE NOT NULL,
    CoMat INT DEFAULT 0,
    Vang INT DEFAULT 0,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaLop) REFERENCES LopHoc(MaLop),
    UNIQUE (MaLop, Ngay)
);

CREATE TABLE GiaoDucTongHop (
    MaTongHop SERIAL PRIMARY KEY,
    TenTruong VARCHAR(200),
    CapHoc VARCHAR(50),
    DiaChi VARCHAR(300),
    TenLop VARCHAR(50),
    Khoi VARCHAR(50),
    GiaoVien VARCHAR(150),
    ChuyenMon VARCHAR(100),
    TongSoHocSinh INT,
    BienDongHocSinh VARCHAR(50),
    LyDoBienDong VARCHAR(200),
    PhongHoc VARCHAR(50),
    TrangThietBi VARCHAR(200),
    TinhTrangCoSoVatChat VARCHAR(50),
    TinhTrangSucKhoe VARCHAR(100),
    HoatDongYTe VARCHAR(200),
    NgayCapNhat DATE
);

CREATE TABLE ChiTiet_YTeGiaoDuc (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    PhanHe VARCHAR(20) NOT NULL CHECK (PhanHe IN ('Y tế', 'Giáo dục')),
    LoaiDichVu VARCHAR(100),
    KetQuaKham TEXT,
    TenTruong VARCHAR(150),
    LopHoc VARCHAR(50),
    HinhThucMienGiam VARCHAR(100),
    SoLuongBenhNhan INT,
    SoLuongHocSinh INT,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

INSERT INTO NhanVienYTe (HoTen, NgaySinh, GioiTinh, ChucDanh, ChuyenMon, SoDienThoai, TrangThaiLamViec, MaTram, GhiChu) VALUES
('Bác sĩ Trần Văn A', '1985-03-15', 'Nam', 'Bác sĩ', 'Nội khoa', '0901234567', 'Đang làm việc', 1, 'Bác sĩ tổng quát'),
('Bác sĩ Nguyễn Thị B', '1988-07-22', 'Nữ', 'Bác sĩ', 'Nhi khoa', '0912345678', 'Đang làm việc', 1, 'Chuyên nhi'),
('Y tá Võ Minh C', '1992-11-08', 'Nam', 'Y tá', 'Chăm sóc bệnh nhân', '0923456789', 'Đang làm việc', 1, ''),
('Y sĩ Lê Thị D', '1990-05-30', 'Nữ', 'Y sĩ', 'Tiêm chủng', '0934567890', 'Đang làm việc', 1, 'Quản lý lịch tiêm chủng');

INSERT INTO LuotKham (MaTram, NgayKham, LoaiKham, SoLuongBenhNhan, GhiChu) VALUES
(1, '2024-01-15', 'Khám tổng quát', 25, 'Khám sức khỏe định kỳ'),
(1, '2024-01-16', 'Khám nhi', 18, 'Khám trẻ em'),
(1, '2024-01-17', 'Khám ngoại', 12, 'Khám cấp cứu'),
(1, '2024-01-18', 'Khám phụ nữ', 20, 'Khám sản phụ khoa');

INSERT INTO ThietBiYTe (TenThietBi, LoaiThietBi, NgayMua, TinhTrang, MaTram, GhiChu) VALUES
('Máy đo huyết áp Omron', 'Thiết bị đo', '2023-06-01', 'Tốt', 1, 'Kỹ thuật số'),
('Máy kiểm tra tim ECG', 'Thiết bị chẩn đoán', '2023-01-15', 'Tốt', 1, '12 đầu dò'),
('Tủ lạnh bảo quản vaccine', 'Tủ bảo quản', '2022-11-20', 'Tốt', 1, '-20 độ C'),
('Máy siêu âm', 'Thiết bị chẩn đoán', '2023-03-10', 'Cần bảo trì', 1, '2D/4D');

INSERT INTO BaoTriThietBi (MaThietBi, NgayBaoTri, NoiDung, TrangThai, GhiChu) VALUES
(1, '2024-01-10', 'Vệ sinh, hiệu chuẩn', 'Hoàn thành', 'Bảo trì định kỳ'),
(2, '2024-01-12', 'Kiểm tra pin, hiệu chuẩn điện', 'Hoàn thành', ''),
(3, '2024-01-08', 'Kiểm tra nhiệt độ, thay dầu', 'Hoàn thành', 'Bảo trì hàng tháng'),
(4, '2024-01-15', 'Kiểm tra đầu dò, phần mềm', 'Hoàn thành', 'Bảo trì định kỳ');

INSERT INTO GiaoDucTongHop (TenTruong, CapHoc, DiaChi, TenLop, Khoi, GiaoVien, ChuyenMon, TongSoHocSinh, BienDongHocSinh, LyDoBienDong, PhongHoc, TrangThietBi, TinhTrangCoSoVatChat, TinhTrangSucKhoe, HoatDongYTe, NgayCapNhat) VALUES
('Trường Tiểu học Phường 1', 'Tiểu học', 'Phường 1', '1A', 'Khối 1', 'Nguyễn Thị Lan', 'Toán', 35, 'Tăng', 'Nhập học đầu năm', 'P101', 'Bàn ghế, máy chiếu', 'Tốt', 'Bình thường', 'Không', '2026-01-15'),
('Trường Tiểu học Phường 1', 'Tiểu học', 'Phường 1', '2B', 'Khối 2', 'Trần Văn Minh', 'Văn', 38, 'Giảm', 'Chuyển trường', 'P102', 'Máy chiếu', 'Xuống cấp', 'Bình thường', 'Sốt nhẹ – sơ cứu', '2026-01-20'),
('Trường Mầm non Phường 2', 'Mầm non', 'Phường 2', 'Lá', 'Lá', 'Lê Thị Hoa', 'Mầm non', 25, 'Không đổi', 'Ổn định sĩ số', 'MN01', 'Đồ chơi trẻ em', 'Tốt', 'Theo dõi', 'Trầy xước nhẹ – sơ cứu', '2026-01-22'),
('Trường Mầm non Phường 2', 'Mầm non', 'Phường 2', 'Chồi', 'Chồi', 'Lê Thị Hoa', 'Mầm non', 22, 'Tăng', 'Trẻ mới nhập học', 'MN02', 'Giường ngủ, quạt', 'Tốt', 'Bình thường', 'Khám sức khỏe định kỳ', '2026-01-25');

-- ================================================================
-- MODULE 3. KINH TẾ - THƯƠNG MẠI
-- ================================================================

CREATE TABLE ChoDiemKinhDoanh (
    MaCho SERIAL PRIMARY KEY,
    MaChuCho VARCHAR(20) UNIQUE,
    TenCho VARCHAR(150) NOT NULL,
    Loai VARCHAR(50),
    DiaChi VARCHAR(255),
    TongSoLoSap INT DEFAULT 0,
    SoQuay INT DEFAULT 0,
    SoHoKinhDoanh INT DEFAULT 0,
    DonViQuanLy VARCHAR(150),
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LoSapCho (
    MaLo SERIAL PRIMARY KEY,
    MaCho INT NOT NULL,
    SoLo VARCHAR(50),
    TrangThaiSuDung VARCHAR(50),
    FOREIGN KEY (MaCho) REFERENCES ChoDiemKinhDoanh(MaCho)
);

CREATE TABLE HoKinhDoanh (
    MaHoKD SERIAL PRIMARY KEY,
    TenHoKinhDoanh VARCHAR(200),
    ChuHo VARCHAR(100),
    CCCD VARCHAR(20),
    NganhNghe VARCHAR(100),
    DiaDiemKinhDoanh VARCHAR(255),
    TrangThaiHoatDong VARCHAR(50),
    NgayDangKy DATE
);

CREATE TABLE ThueLePhi (
    MaThue SERIAL PRIMARY KEY,
    MaHoKD INT NOT NULL,
    MucLePhiMonBai DECIMAL(18,2),
    ThueKhoanDuKien DECIMAL(18,2),
    TrangThaiNopThue VARCHAR(50),
    KyThue VARCHAR(50),
    FOREIGN KEY (MaHoKD) REFERENCES HoKinhDoanh(MaHoKD)
);

CREATE TABLE NoThue (
    MaNo SERIAL PRIMARY KEY,
    MaHoKD INT NOT NULL,
    SoTienNo DECIMAL(18,2),
    ThoiGianNo DATE,
    FOREIGN KEY (MaHoKD) REFERENCES HoKinhDoanh(MaHoKD)
);

CREATE TABLE BienDongHoKinhDoanh (
    MaBienDong SERIAL PRIMARY KEY,
    MaHoKD INT NOT NULL,
    LoaiBienDong VARCHAR(100),
    ThoiGian DATE,
    GhiChu VARCHAR(255),
    FOREIGN KEY (MaHoKD) REFERENCES HoKinhDoanh(MaHoKD)
);

CREATE TABLE HoKDTrongCho (
    Ma SERIAL PRIMARY KEY,
    MaHoKD INT NOT NULL,
    MaLo INT NOT NULL,
    FOREIGN KEY (MaHoKD) REFERENCES HoKinhDoanh(MaHoKD),
    FOREIGN KEY (MaLo) REFERENCES LoSapCho(MaLo)
);

CREATE TABLE CanBoKinhTe (
    MaCanBo SERIAL PRIMARY KEY,
    HoTen VARCHAR(100),
    ChucVu VARCHAR(50),
    DonVi VARCHAR(100),
    SoDienThoai VARCHAR(15)
);

CREATE TABLE CanhBaoRuiRoKinhTe (
    MaCanhBao SERIAL PRIMARY KEY,
    NoiDung VARCHAR(255),
    MucDo VARCHAR(50),
    ThoiGian DATE
);

CREATE TABLE BaoCaoKinhTe (
    MaBaoCao SERIAL PRIMARY KEY,
    LoaiBaoCao VARCHAR(100),
    NoiDung VARCHAR(500),
    ThoiGian DATE
);

CREATE TABLE ThuPhi (
    MaThuPhi SERIAL PRIMARY KEY,
    MaCho INT,
    LoaiPhi VARCHAR(100),
    SoTien DECIMAL(18,0) NOT NULL,
    ThangNam VARCHAR(7),
    NgayThu DATE DEFAULT CURRENT_DATE,
    NguoiThu INT,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCho) REFERENCES ChoDiemKinhDoanh(MaCho),
    FOREIGN KEY (NguoiThu) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE ToChuc (
    MaTC SERIAL PRIMARY KEY,
    TenTC VARCHAR(200) NOT NULL,
    MaSoThue VARCHAR(50),
    DiaChiTC VARCHAR(255),
    SoDienThoai VARCHAR(20),
    NguoiDaiDien INT,
    GhiChu TEXT,
    FOREIGN KEY (NguoiDaiDien) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE ChiTiet_KinhTe (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    TenHoKinhDoanh VARCHAR(150) NOT NULL,
    MaSoThue VARCHAR(50),
    LinhVucKinhDoanh VARCHAR(100),
    DoanhThuKhaiBao DECIMAL(18,0),
    TrangThaiNopThue BOOLEAN DEFAULT true,
    DiaChiKinhDoanh VARCHAR(255),
    SoDienThoaiLienHe VARCHAR(20),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

-- ================================================================
-- MODULE 4. QUỐC PHÒNG - AN NINH
-- ================================================================

CREATE TABLE CanBoQuocPhong (
    MaCanBo SERIAL PRIMARY KEY,
    HoTen VARCHAR(100),
    CapBac VARCHAR(50),
    ChucVu VARCHAR(50),
    DonVi VARCHAR(100),
    SoDienThoai VARCHAR(15),
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TamTruTamVang (
    MaHoSo SERIAL PRIMARY KEY,
    HoTenNguoiKhaiBao VARCHAR(100),
    CCCD VARCHAR(20),
    DiaChiThuongTru VARCHAR(255),
    DiaChiTamTru VARCHAR(255),
    LoaiDangKy VARCHAR(50),
    TuNgay DATE,
    DenNgay DATE,
    TinhTrangHoSo VARCHAR(50),
    NgayKhaiBao DATE,
    MaCanBo INT,
    FOREIGN KEY (MaCanBo) REFERENCES CanBoQuocPhong(MaCanBo)
);

CREATE TABLE KhuDanCu (
    MaKhuDanCu SERIAL PRIMARY KEY,
    TenKhuDanCu VARCHAR(100),
    DiaChi VARCHAR(255),
    SoHoDan INT,
    SoDanSo INT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TinhHinhANTT (
    MaANTT SERIAL PRIMARY KEY,
    MaKhuDanCu INT,
    MoTa VARCHAR(255),
    MucDoNguyCo VARCHAR(50),
    ThoiGianBaoCao DATE,
    SoSuKien INT DEFAULT 0,
    SoNguoiBiHai INT DEFAULT 0,
    FOREIGN KEY (MaKhuDanCu) REFERENCES KhuDanCu(MaKhuDanCu)
);

CREATE TABLE PhoiHopLucLuong (
    MaPhoiHop SERIAL PRIMARY KEY,
    DonViPhoiHop VARCHAR(100),
    NoiDungPhoiHop VARCHAR(255),
    ThoiGian DATE,
    KetQua TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ViPhamHanhChinh (
    MaViPham SERIAL PRIMARY KEY,
    HoTenNguoiViPham VARCHAR(100),
    HanhViViPham VARCHAR(255),
    HinhThucXuLy VARCHAR(100),
    TrangThaiXuLy VARCHAR(50),
    NgayViPham DATE,
    MucPhat DECIMAL(18,0),
    MaCanBo INT,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCanBo) REFERENCES CanBoQuocPhong(MaCanBo)
);

CREATE TABLE PhanAnhNguoiDan (
    MaPhanAnh SERIAL PRIMARY KEY,
    HoTenNguoiGui VARCHAR(100),
    SoDienThoai VARCHAR(15),
    DiaChi VARCHAR(255),
    NoiDungPhanAnh VARCHAR(500),
    HinhThucGui VARCHAR(50),
    PhanLoai VARCHAR(100),
    TrangThaiXuLy VARCHAR(50),
    NgayGui DATE,
    NgayPhanHoi DATE,
    MaCanBo INT,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCanBo) REFERENCES CanBoQuocPhong(MaCanBo)
);

CREATE TABLE ChiTiet_AnNinhQP (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    LoaiHoSo VARCHAR(100) NOT NULL,
    DiaChiLuuTru VARCHAR(200),
    HanhViViPham TEXT,
    MucPhatTien DECIMAL(18,0),
    TrangThaiNghiaVu VARCHAR(50),
    LoaiTamTru VARCHAR(50),
    ThoiHanTamTru DATE,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

INSERT INTO CanBoQuocPhong (HoTen, CapBac, ChucVu, DonVi, SoDienThoai) VALUES
('Thượng tá Trần Văn A', 'Thượng tá', 'Chỉ huy trưởng', 'Công an Xã', '0901111111'),
('Hạ sĩ Nguyễn Thị B', 'Hạ sĩ', 'Cán bộ dân cư', 'Công an Xã', '0902222222'),
('Trung úy Lê Minh C', 'Trung úy', 'Đội trưởng', 'Công an Xã', '0903333333');

INSERT INTO TamTruTamVang (HoTenNguoiKhaiBao, CCCD, DiaChiThuongTru, DiaChiTamTru, LoaiDangKy, TuNgay, DenNgay, TinhTrangHoSo, NgayKhaiBao, MaCanBo) VALUES
('Nguyễn Văn X', '001234567890', 'Hà Nội', 'Xã A, Phường 1', 'Tạm trú', '2026-01-01', '2026-03-01', 'Đã duyệt', '2025-12-20', 1),
('Trần Thị Y', '001234567891', 'Hồ Chí Minh', 'Xã A, Phường 2', 'Tạm vắng', '2026-01-15', '2026-02-15', 'Chờ duyệt', '2026-01-10', 2),
('Lê Minh Z', '001234567892', 'Cần Thơ', 'Xã A, Phường 1', 'Tạm trú', '2026-01-20', '2026-04-20', 'Đã duyệt', '2026-01-15', 1);

INSERT INTO KhuDanCu (TenKhuDanCu, DiaChi, SoHoDan, SoDanSo) VALUES
('Khu dân cư A1', 'Phường 1, Xã A', 45, 156),
('Khu dân cư B2', 'Phường 2, Xã A', 38, 134),
('Khu dân cư C3', 'Phường 3, Xã A', 52, 185);

INSERT INTO TinhHinhANTT (MaKhuDanCu, MoTa, MucDoNguyCo, ThoiGianBaoCao, SoSuKien, SoNguoiBiHai) VALUES
(1, 'Tình hình bình yên, không có sự cố', 'Thấp', '2026-01-25', 0, 0),
(2, 'Phát hiện một vụ trộm cắp nhỏ', 'Trung bình', '2026-01-25', 1, 1),
(3, 'An toàn, giao thông trật tự tốt', 'Thấp', '2026-01-25', 0, 0);

INSERT INTO PhoiHopLucLuong (DonViPhoiHop, NoiDungPhoiHop, ThoiGian, KetQua) VALUES
('Công an Huyện', 'Tuần tra, kiểm soát trật tự', '2026-01-20', 'Phát hiện 1 vi phạm giao thông'),
('Quân sự Huyện', 'Kiểm tra công tác quốc phòng', '2026-01-22', 'Bình thường'),
('Thanh tra Huyện', 'Kiểm tra hành chính', '2026-01-24', 'Không phát hiện vi phạm');

INSERT INTO ViPhamHanhChinh (HoTenNguoiViPham, HanhViViPham, HinhThucXuLy, TrangThaiXuLy, NgayViPham, MucPhat, MaCanBo) VALUES
('Phạm Văn D', 'Rửa xe trên đường công cộng', 'Phạt hành chính', 'Đã xử lý', '2026-01-15', 500000, 1),
('Hoàng Thị E', 'Đăng ký thay đổi chủ nhân không kịp thời', 'Cảnh cáo', 'Đang xử lý', '2026-01-18', 0, 2),
('Võ Minh F', 'Để chó không rọ mõm ở chỗ công cộng', 'Cảnh cáo', 'Đã xử lý', '2026-01-22', 300000, 1);

INSERT INTO PhanAnhNguoiDan (HoTenNguoiGui, SoDienThoai, DiaChi, NoiDungPhanAnh, HinhThucGui, PhanLoai, TrangThaiXuLy, NgayGui, NgayPhanHoi, MaCanBo) VALUES
('Lý Văn G', '0909090909', 'Phường 1', 'Đèn đường quốc lộ 1 bị hỏng', 'Web', 'Cơ sở hạ tầng', 'Đã xử lý', '2026-01-10', '2026-01-20', 1),
('Cao Thị H', '0908080808', 'Phường 2', 'Hàng xóm xây dựng không phép', 'App', 'Vi phạm xây dựng', 'Đang xử lý', '2026-01-15', NULL, 2),
('Đặng Minh I', '0907070707', 'Phường 1', 'Rác thải xả trộm ở ngõ tối', 'Trực tiếp', 'Môi trường', 'Đã xử lý', '2026-01-18', '2026-01-23', 1);

-- ================================================================
-- MODULE 5. XÂY DỰNG - HẠ TẦNG
-- ================================================================

CREATE TABLE CanBoXayDung (
    MaCanBo SERIAL PRIMARY KEY,
    HoTen VARCHAR(100),
    ChucVu VARCHAR(50),
    DonVi VARCHAR(100),
    SoDienThoai VARCHAR(15)
);

CREATE TABLE HoSoCapPhepXayDung (
    MaHoSo SERIAL PRIMARY KEY,
    ChuDauTu VARCHAR(100),
    DiaDiemXayDung VARCHAR(255),
    LoaiCongTrinh VARCHAR(100),
    MucDichSuDung VARCHAR(100),
    TrangThaiHoSo VARCHAR(50),
    NgayNopHoSo DATE,
    NgayCapPhep DATE,
    MaCanBo INT,
    FOREIGN KEY (MaCanBo) REFERENCES CanBoXayDung(MaCanBo)
);

CREATE TABLE TheoDoiTratTuXayDung (
    MaTheoDoi SERIAL PRIMARY KEY,
    MaHoSo INT,
    TienDoThiCong VARCHAR(100),
    XayDungDungPhep BOOLEAN,
    LapBienBanViPham BOOLEAN,
    TinhTrangKhacPhuc VARCHAR(100),
    ThoiGianKiemTra DATE,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoCapPhepXayDung(MaHoSo)
);

CREATE TABLE XayDungTraiPhep (
    MaViPham SERIAL PRIMARY KEY,
    DiaDiem VARCHAR(255),
    NguonPhatHien VARCHAR(100),
    MoTaViPham VARCHAR(255),
    TrangThaiXuLy VARCHAR(50),
    NgayPhatHien DATE,
    MaCanBo INT,
    FOREIGN KEY (MaCanBo) REFERENCES CanBoXayDung(MaCanBo)
);

CREATE TABLE HaTangDoThi (
    MaHaTang SERIAL PRIMARY KEY,
    LoaiHaTang VARCHAR(100),
    ViTri VARCHAR(255),
    TinhTrang VARCHAR(50),
    NgayCapNhat DATE
);

CREATE TABLE BaoHongHaTang (
    MaBaoHong SERIAL PRIMARY KEY,
    MaHaTang INT,
    NoiDungBaoHong VARCHAR(255),
    NguoiBaoHong VARCHAR(100),
    TrangThaiXuLy VARCHAR(50),
    NgayBaoHong DATE,
    FOREIGN KEY (MaHaTang) REFERENCES HaTangDoThi(MaHaTang)
);

CREATE TABLE BaoCaoXayDung (
    MaBaoCao SERIAL PRIMARY KEY,
    LoaiBaoCao VARCHAR(100),
    NoiDung VARCHAR(500),
    ThoiGian DATE
);

CREATE TABLE DonViHanhChinh (
    MaDVHC VARCHAR(20) PRIMARY KEY,
    TenDVHC VARCHAR(150) NOT NULL,
    Cap INT NOT NULL
);

CREATE TABLE QuanHuyen (
    MaQuanHuyen SERIAL PRIMARY KEY,
    TenQuanHuyen VARCHAR(150) NOT NULL,
    MaDVHC VARCHAR(20) NOT NULL,
    FOREIGN KEY (MaDVHC) REFERENCES DonViHanhChinh(MaDVHC)
);

CREATE TABLE XaPhuong (
    MaXaPhuong SERIAL PRIMARY KEY,
    TenXaPhuong VARCHAR(150) NOT NULL,
    MaQuanHuyen INT NOT NULL,
    MaDVHC VARCHAR(20) NOT NULL,
    FOREIGN KEY (MaQuanHuyen) REFERENCES QuanHuyen(MaQuanHuyen),
    FOREIGN KEY (MaDVHC) REFERENCES DonViHanhChinh(MaDVHC)
);

CREATE TABLE TuyenDuong (
    MaTuyenDuong SERIAL PRIMARY KEY,
    TenTuyenDuong VARCHAR(200) NOT NULL,
    ChieuDai DECIMAL(10,2),
    LoaiDuong VARCHAR(50),
    MaXaPhuong INT,
    FOREIGN KEY (MaXaPhuong) REFERENCES XaPhuong(MaXaPhuong)
);

CREATE TABLE LoaiCongTrinh (
    MaLoaiCT SERIAL PRIMARY KEY,
    TenLoaiCT VARCHAR(100) NOT NULL
);

CREATE TABLE CongTrinh (
    MaCongTrinh SERIAL PRIMARY KEY,
    TenCongTrinh VARCHAR(200) NOT NULL,
    DiaChiCT VARCHAR(255),
    MaXaPhuong INT,
    MaTuyenDuong INT,
    MaLoaiCT INT,
    ToaDo VARCHAR(50),
    TinhTrangSuDung VARCHAR(50),
    NgayHoanCong DATE,
    GhiChu TEXT,
    FOREIGN KEY (MaXaPhuong) REFERENCES XaPhuong(MaXaPhuong),
    FOREIGN KEY (MaTuyenDuong) REFERENCES TuyenDuong(MaTuyenDuong),
    FOREIGN KEY (MaLoaiCT) REFERENCES LoaiCongTrinh(MaLoaiCT)
);

CREATE TABLE LoaiGiayPhep (
    MaLoaiGP SERIAL PRIMARY KEY,
    TenLoaiGP VARCHAR(100) NOT NULL
);

CREATE TABLE GiayPhep (
    MaGiayPhep SERIAL PRIMARY KEY,
    SoGiayPhep VARCHAR(50) NOT NULL,
    NgayCap DATE,
    NgayHetHan DATE,
    MaCongTrinh INT NOT NULL,
    MaLoaiGP INT,
    MaHoSo VARCHAR(20),
    FOREIGN KEY (MaCongTrinh) REFERENCES CongTrinh(MaCongTrinh),
    FOREIGN KEY (MaLoaiGP) REFERENCES LoaiGiayPhep(MaLoaiGP),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

CREATE TABLE DangKyThiCong (
    MaDKTC SERIAL PRIMARY KEY,
    MaHoSo VARCHAR(20) NOT NULL,
    MaCongTrinh INT NOT NULL,
    NgayDK DATE NOT NULL,
    TrangThaiDK VARCHAR(50) DEFAULT 'Chờ duyệt',
    GhiChu TEXT,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (MaCongTrinh) REFERENCES CongTrinh(MaCongTrinh)
);

CREATE TABLE ChiTiet_XayDung (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    LoaiCongTrinh VARCHAR(100) NOT NULL,
    ViTriXayDung VARCHAR(200) NOT NULL,
    ToaDoXayDung VARCHAR(50),
    DienTichSan DECIMAL(10,2),
    SoTang INT CHECK (SoTang IS NULL OR SoTang >= 0),
    GiayPhepSo VARCHAR(50),
    TrangThaiXayDung VARCHAR(50),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

-- ================================================================
-- MODULE 6. DÂN CƯ - LAO ĐỘNG
-- ================================================================

CREATE TABLE BienDongDanCu (
    MaBienDong SERIAL PRIMARY KEY,
    KhuVuc VARCHAR(100),
    LoaiBienDong VARCHAR(50),
    SoLuong INT,
    ThoiDiem DATE,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HoGiaDinh (
    MaHGD SERIAL PRIMARY KEY,
    MaChuHo INT NOT NULL,
    DiaChiHGD VARCHAR(255) NOT NULL,
    MaXaPhuong INT,
    NgayDangKy TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    GhiChu TEXT,
    FOREIGN KEY (MaChuHo) REFERENCES CongDan(MaCongDan),
    FOREIGN KEY (MaXaPhuong) REFERENCES XaPhuong(MaXaPhuong)
);

CREATE TABLE ThanhVienHo (
    MaTVH SERIAL PRIMARY KEY,
    MaHGD INT NOT NULL,
    MaCongDan INT NOT NULL,
    QuanHeVoiChuHo VARCHAR(50),
    TuNgay DATE,
    DenNgay DATE,
    FOREIGN KEY (MaHGD) REFERENCES HoGiaDinh(MaHGD),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan),
    UNIQUE (MaHGD, MaCongDan)
);

CREATE TABLE HoNgheo (
    MaHo SERIAL PRIMARY KEY,
    MaCongDanChuHo INT,
    HoTenChuHo VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(255),
    LoaiHo VARCHAR(20) NOT NULL,
    NamApDung INT,
    NgayRasoat DATE,
    NgayThoatNgheo DATE,
    LyDoThoatNgheo TEXT,
    TrangThai VARCHAR(50) DEFAULT 'Đang hỗ trợ',
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCongDanChuHo) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE DoiTuongBaoTro (
    MaDoiTuong SERIAL PRIMARY KEY,
    MaCongDan INT,
    HoTen VARCHAR(100) NOT NULL,
    LoaiDoiTuong VARCHAR(100),
    MucTroCap DECIMAL(18,0),
    ThoiHanTroCap DATE,
    TrangThai VARCHAR(50) DEFAULT 'Đang hưởng',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE TroCapXaHoi (
    TroCapID SERIAL PRIMARY KEY,
    MaDoiTuong INT NOT NULL,
    SoTien DECIMAL(18,2),
    ChuKyChiTra VARCHAR(50),
    TrangThai VARCHAR(50),
    FOREIGN KEY (MaDoiTuong) REFERENCES DoiTuongBaoTro(MaDoiTuong)
);

CREATE TABLE NguoiCoCong (
    MaNCC SERIAL PRIMARY KEY,
    MaCongDan INT,
    HoTen VARCHAR(100) NOT NULL,
    LoaiDoiTuong VARCHAR(100),
    HoSoGoc VARCHAR(255),
    MucTroCap DECIMAL(18,0),
    ThoiHanTroCap DATE,
    TrangThai VARCHAR(50) DEFAULT 'Đang hưởng',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE CheDoUuDai (
    CheDoID SERIAL PRIMARY KEY,
    MaNCC INT NOT NULL,
    TenCheDo VARCHAR(150),
    SoTien DECIMAL(18,2),
    FOREIGN KEY (MaNCC) REFERENCES NguoiCoCong(MaNCC)
);

CREATE TABLE QuaTangThamHoi (
    ThamHoiID SERIAL PRIMARY KEY,
    MaNCC INT NOT NULL,
    HinhThuc VARCHAR(100),
    NgayThucHien DATE,
    FOREIGN KEY (MaNCC) REFERENCES NguoiCoCong(MaNCC)
);

CREATE TABLE CanBoTBXH (
    CanBoID SERIAL PRIMARY KEY,
    HoTen VARCHAR(150),
    ChucVu VARCHAR(100),
    DienThoai VARCHAR(20)
);

CREATE TABLE RaSoatHoNgheo (
    RaSoatID SERIAL PRIMARY KEY,
    MaHo INT NOT NULL,
    NgayRaSoat DATE,
    KetQua VARCHAR(100),
    CanBoID INT,
    FOREIGN KEY (MaHo) REFERENCES HoNgheo(MaHo),
    FOREIGN KEY (CanBoID) REFERENCES CanBoTBXH(CanBoID)
);

CREATE TABLE HuongChinhSachHoNgheo (
    HuongID SERIAL PRIMARY KEY,
    MaHo INT NOT NULL,
    TenChinhSach VARCHAR(150),
    SoTien DECIMAL(18,2),
    ThoiGianHuong VARCHAR(50),
    FOREIGN KEY (MaHo) REFERENCES HoNgheo(MaHo)
);

CREATE TABLE ViecLam (
    MaViecLam SERIAL PRIMARY KEY,
    MaTin VARCHAR(20) UNIQUE,
    TieuDe VARCHAR(200) NOT NULL,
    DonViTuyen VARCHAR(150),
    ViTri VARCHAR(100),
    SoLuong INT DEFAULT 1,
    MoTa TEXT,
    YeuCau TEXT,
    HanNop DATE,
    TrangThai VARCHAR(50) DEFAULT 'Đang tuyển',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NguoiTimViec (
    MaNTV SERIAL PRIMARY KEY,
    MaCongDan INT NOT NULL,
    NgheNghiep VARCHAR(100),
    TrinhDo VARCHAR(100),
    MaViecLam INT,
    TrangThai VARCHAR(50) DEFAULT 'Đang tìm việc',
    NgayDangKy TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan),
    FOREIGN KEY (MaViecLam) REFERENCES ViecLam(MaViecLam)
);

CREATE TABLE NguonLaoDong (
    LaoDongID SERIAL PRIMARY KEY,
    MaCongDan INT,
    TrinhDo VARCHAR(100),
    NgheNghiep VARCHAR(100),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE GioiThieuViecLam (
    GioiThieuID SERIAL PRIMARY KEY,
    LaoDongID INT,
    NoiGioiThieu VARCHAR(150),
    KetQua VARCHAR(50),
    FOREIGN KEY (LaoDongID) REFERENCES NguonLaoDong(LaoDongID)
);

CREATE TABLE HoTroThatNghiep (
    ThatNghiepID SERIAL PRIMARY KEY,
    LaoDongID INT,
    ThoiGianHuong INT,
    SoTien DECIMAL(18,2),
    FOREIGN KEY (LaoDongID) REFERENCES NguonLaoDong(LaoDongID)
);

CREATE TABLE KhaoSatNhuCauHocNghe (
    KhaoSatID SERIAL PRIMARY KEY,
    MaCongDan INT,
    NhuCauHoc VARCHAR(150),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE LopDaoTaoNghe (
    LopID SERIAL PRIMARY KEY,
    TenLop VARCHAR(150),
    ThoiGianHoc VARCHAR(50),
    DonViToChuc VARCHAR(150)
);

CREATE TABLE TheoDoiSauDaoTao (
    TheoDoiID SERIAL PRIMARY KEY,
    LopID INT,
    MaCongDan INT,
    TrangThaiViecLam VARCHAR(100),
    FOREIGN KEY (LopID) REFERENCES LopDaoTaoNghe(LopID),
    FOREIGN KEY (MaCongDan) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE ChiTiet_LaoDong (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    LoaiDoiTuong VARCHAR(50) NOT NULL,
    TinhTrangViecLam BOOLEAN,
    NoiLamViec VARCHAR(150),
    MucTroCap DECIMAL(18,0),
    LoaiTroCap VARCHAR(100),
    ThoiHanTroCap DATE,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

INSERT INTO BienDongDanCu (KhuVuc, LoaiBienDong, SoLuong, ThoiDiem, GhiChu) VALUES
('Phường 1', 'Tăng', 5, '2026-01-15', 'Nhân khẩu mới di cư vào'),
('Phường 2', 'Giảm', 2, '2026-01-18', 'Dân di cư ra ngoài'),
('Phường 3', 'Tăng', 3, '2026-01-20', 'Trẻ em sinh mới');

-- ================================================================
-- MODULE 7. QUẢN LÝ TÀI CHÍNH
-- ================================================================

CREATE TABLE DuToanNganSach (
    MaDuToan SERIAL PRIMARY KEY,
    ThangNam VARCHAR(7) NOT NULL,
    Loai VARCHAR(20) NOT NULL,
    Nhom VARCHAR(100),
    NoiDung VARCHAR(500) NOT NULL,
    SoTienDuToan DECIMAL(18,0) NOT NULL,
    SoTienThucTe DECIMAL(18,0) DEFAULT 0,
    TrangThai VARCHAR(50) DEFAULT 'Đang thực hiện',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE GiaiNgan (
    MaGiaiNgan SERIAL PRIMARY KEY,
    MaDuToan INT,
    SoTien DECIMAL(18,0) NOT NULL,
    NoiDungChi TEXT,
    NgayGiaiNgan DATE DEFAULT CURRENT_DATE,
    NguoiDuyet INT,
    TrangThai VARCHAR(50) DEFAULT 'Đã giải ngân',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaDuToan) REFERENCES DuToanNganSach(MaDuToan),
    FOREIGN KEY (NguoiDuyet) REFERENCES LanhDao(MaLanhDao)
);

CREATE TABLE MucLucNganSach (
    MaMucLuc SERIAL PRIMARY KEY,
    MaSo VARCHAR(20) NOT NULL,
    TenMucLuc VARCHAR(200) NOT NULL,
    Loai VARCHAR(50) NOT NULL,
    CapDo INT,
    MaCha INT,
    MoTa TEXT,
    FOREIGN KEY (MaCha) REFERENCES MucLucNganSach(MaMucLuc)
);

CREATE TABLE DuToanChiTiet (
    MaDuToan SERIAL PRIMARY KEY,
    NamTaiChinh INT NOT NULL,
    MaMucLuc INT NOT NULL,
    SoTienDuToan DECIMAL(18,0) NOT NULL,
    SoTienDaSuDung DECIMAL(18,0) DEFAULT 0,
    TrangThai VARCHAR(50) DEFAULT 'HieuLuc',
    FOREIGN KEY (MaMucLuc) REFERENCES MucLucNganSach(MaMucLuc),
    UNIQUE (NamTaiChinh, MaMucLuc)
);

CREATE TABLE PhieuNganSach (
    MaPhieu SERIAL PRIMARY KEY,
    SoPhieu VARCHAR(50) UNIQUE NOT NULL,
    NgayPhieu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LoaiPhieu VARCHAR(10) NOT NULL,
    MaMucLuc INT NOT NULL,
    SoTien DECIMAL(18,0) NOT NULL,
    NoiDungDienGiai TEXT,
    DoiTuongNopNhan VARCHAR(200),
    MaCanBoLap INT,
    MaLanhDaoDuyet INT,
    TrangThai VARCHAR(50) DEFAULT 'ChoDuyet',
    FOREIGN KEY (MaMucLuc) REFERENCES MucLucNganSach(MaMucLuc),
    FOREIGN KEY (MaCanBoLap) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE PhanTichTaiChinh_AI (
    MaPhanTich SERIAL PRIMARY KEY,
    ThoiGianPhanTich TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KyDuLieu VARCHAR(20),
    DuBaoThu DECIMAL(18,0),
    DuBaoChi DECIMAL(18,0),
    XuHuong VARCHAR(50),
    CanhBaoRuiRo TEXT,
    DoChinhXacDuBao FLOAT
);

CREATE TABLE CauHinhCanhBaoNganSach (
    MaCauHinh SERIAL PRIMARY KEY,
    MaMucLuc INT,
    NguongCanhBao DECIMAL(18,0),
    LoaiCanhBao VARCHAR(50),
    NguoiNhanCanhBao INT,
    FOREIGN KEY (MaMucLuc) REFERENCES MucLucNganSach(MaMucLuc)
);

CREATE TABLE TaiSanCong (
    MaTaiSan SERIAL PRIMARY KEY,
    MaTaiSanCode VARCHAR(30) UNIQUE NOT NULL,
    TenTaiSan VARCHAR(200) NOT NULL,
    LoaiTaiSan VARCHAR(100),
    NguyenGia DECIMAL(18,0) NOT NULL CHECK (NguyenGia >= 0),
    NamSuDung INT,
    TyLeKhauHao DECIMAL(5,2),
    NguoiQuanLy INT,
    ViTriLuuTru VARCHAR(255),
    TinhTrang VARCHAR(50) DEFAULT 'Đang sử dụng',
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (NguoiQuanLy) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE ChiTiet_TaiChinh (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    LoaiGiaoDich VARCHAR(50) NOT NULL CHECK (LoaiGiaoDich IN ('Thu', 'Chi')),
    NoiDungChi TEXT,
    SoTien DECIMAL(18,0) NOT NULL CHECK (SoTien >= 0),
    NguonVon VARCHAR(100),
    MaLanhDaoDuyetChi INT,
    MaDuToan INT,
    NgayThucHien DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (MaLanhDaoDuyetChi) REFERENCES LanhDao(MaLanhDao)
);

INSERT INTO MucLucNganSach (MaSo, TenMucLuc, Loai, CapDo) VALUES
('805', 'Chi bộ máy hành chính', 'Chi', 1),
('806', 'Chi sự nghiệp giáo dục', 'Chi', 1),
('807', 'Chi sự nghiệp y tế', 'Chi', 1),
('301', 'Thu từ lệ phí hành chính', 'Thu', 1);

INSERT INTO DuToanChiTiet (NamTaiChinh, MaMucLuc, SoTienDuToan, SoTienDaSuDung) VALUES
(2026, 1, 5000000000, 1250000000),
(2026, 2, 3500000000, 1050000000),
(2026, 3, 2800000000, 840000000),
(2026, 4, 1200000000, 600000000);

INSERT INTO PhieuNganSach (SoPhieu, LoaiPhieu, MaMucLuc, SoTien, NoiDungDienGiai, DoiTuongNopNhan, TrangThai) VALUES
('PHIEU-2026-001', 'Chi', 1, 250000000, 'Trả lương cán bộ tháng 1', 'Kho bạc Nhà nước', 'DaDuyet'),
('PHIEU-2026-002', 'Thu', 4, 150000000, 'Thu lệ phí cấp giấy chứng thực', 'Dân cư', 'DaDuyet'),
('PHIEU-2026-003', 'Chi', 2, 180000000, 'Mua sách, thiết bị giáo dục', 'Trường học', 'ChoDuyet');

INSERT INTO PhanTichTaiChinh_AI (KyDuLieu, DuBaoThu, DuBaoChi, XuHuong, CanhBaoRuiRo, DoChinhXacDuBao) VALUES
('Thang 1/2026', 2500000000, 5200000000, 'TangTruong', 'Nguy cơ hụt chi tháng 2 nếu không cân bằng thu', 0.92),
('Quy 1/2026', 7800000000, 16200000000, 'OnDinh', 'Chi theo kế hoạch, không có rủi ro', 0.88);

-- ================================================================
-- MODULE 8. ĐỊA CHÍNH
-- ================================================================

CREATE TABLE LoaiDat (
    MaLoaiDat SERIAL PRIMARY KEY,
    TenLoaiDat VARCHAR(100) NOT NULL,
    MaCode VARCHAR(20)
);

CREATE TABLE ThuaDat (
    MaThuaDat SERIAL PRIMARY KEY,
    SoThua INT NOT NULL,
    SoToBanDo INT NOT NULL,
    DienTich DECIMAL(12,2) NOT NULL,
    MaXaPhuong INT NOT NULL,
    MaLoaiDat INT,
    MaChuSuDung INT,
    SoGiayCN VARCHAR(50),
    ToaDo VARCHAR(100),
    GhiChu TEXT,
    FOREIGN KEY (MaXaPhuong) REFERENCES XaPhuong(MaXaPhuong),
    FOREIGN KEY (MaLoaiDat) REFERENCES LoaiDat(MaLoaiDat),
    FOREIGN KEY (MaChuSuDung) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE LoaiQuyHoach (
    MaLoaiQH SERIAL PRIMARY KEY,
    TenLoaiQH VARCHAR(100) NOT NULL
);

CREATE TABLE QuyHoach (
    MaQuyHoach SERIAL PRIMARY KEY,
    TenQuyHoach VARCHAR(200) NOT NULL,
    DienTich DECIMAL(12,2),
    MaLoaiQH INT,
    MaXaPhuong INT,
    ToaDoPolygon TEXT,
    GhiChu TEXT,
    FOREIGN KEY (MaLoaiQH) REFERENCES LoaiQuyHoach(MaLoaiQH),
    FOREIGN KEY (MaXaPhuong) REFERENCES XaPhuong(MaXaPhuong)
);

CREATE TABLE RuiRoQuyHoach (
    MaRuiRo SERIAL PRIMARY KEY,
    MaQuyHoach INT,
    KhuVuc VARCHAR(255) NOT NULL,
    LoaiRuiRo VARCHAR(100),
    MucDo VARCHAR(50),
    KhuyenNghiAI TEXT,
    XacSuat FLOAT,
    TrangThai VARCHAR(50) DEFAULT 'Đang theo dõi',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaQuyHoach) REFERENCES QuyHoach(MaQuyHoach)
);

CREATE TABLE HoSoTranhChapDatDai (
    MaTranhChap SERIAL PRIMARY KEY,
    MaHoSo VARCHAR(20) NULL,
    SoToBanDo INT,
    SoThuaDat INT,
    DiaDiem VARCHAR(255) NOT NULL,
    ToaDo VARCHAR(50) NULL,
    CacBenLienQuan TEXT,
    NoiDungTranhChap TEXT,
    NgayLapBienBan DATE,
    DuongDanBienBanHoaGiai VARCHAR(500),
    KetQuaHoaGiai VARCHAR(50) NOT NULL DEFAULT 'Chưa giải quyết'
        CHECK (KetQuaHoaGiai IN ('Chưa giải quyết', 'Thành', 'Không thành')),
    GhiChu TEXT,
    NguoiGhiNhan INT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo),
    FOREIGN KEY (NguoiGhiNhan) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE INDEX IX_HoSoTranhChapDatDai_MaHoSo ON HoSoTranhChapDatDai(MaHoSo);
CREATE INDEX IX_HoSoTranhChapDatDai_KetQuaHoaGiai ON HoSoTranhChapDatDai(KetQuaHoaGiai);

CREATE TABLE LichSuBienDongDatDai (
    MaBienDong SERIAL PRIMARY KEY,
    MaThuaDat INT NOT NULL,
    LoaiBienDong VARCHAR(100),
    ChuCu INT,
    ChuMoi INT,
    NgayBienDong DATE,
    SoHoSoLienQuan VARCHAR(50),
    NoiDungChiTiet TEXT,
    FOREIGN KEY (MaThuaDat) REFERENCES ThuaDat(MaThuaDat),
    FOREIGN KEY (ChuCu) REFERENCES CongDan(MaCongDan),
    FOREIGN KEY (ChuMoi) REFERENCES CongDan(MaCongDan)
);

CREATE TABLE HoSoCapGCN (
    MaHoSoGCN SERIAL PRIMARY KEY,
    MaHoSoHanhChinh VARCHAR(20),
    MaThuaDat INT,
    TrangThaiCap VARCHAR(50),
    NgayNhanHoSo DATE,
    NgayHenTra DATE,
    CanBoThuLy INT,
    KetQuaThamDinh TEXT,
    ViTriLuuTruHoSoGoc VARCHAR(255),
    FOREIGN KEY (MaThuaDat) REFERENCES ThuaDat(MaThuaDat)
);

CREATE TABLE BienBanThamDinhDatDai (
    MaBienBan SERIAL PRIMARY KEY,
    MaHoSoGCN INT,
    NgayThamDinh DATE,
    ThanhPhanThamGia TEXT,
    HienTrangSuDung TEXT,
    KetLuan VARCHAR(50),
    AnhHienTrang VARCHAR(500),
    ToaDoGocRanh VARCHAR(255),
    FOREIGN KEY (MaHoSoGCN) REFERENCES HoSoCapGCN(MaHoSoGCN)
);

CREATE TABLE RuiRoQuyHoach_AI (
    MaDanhGia SERIAL PRIMARY KEY,
    MaThuaDat INT,
    MaQuyHoach INT,
    MucDoRuiRo VARCHAR(20),
    PhanTichAI TEXT,
    KhuyenNghi TEXT,
    NgayDanhGia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaThuaDat) REFERENCES ThuaDat(MaThuaDat),
    FOREIGN KEY (MaQuyHoach) REFERENCES QuyHoach(MaQuyHoach)
);

CREATE TABLE ChiTiet_DiaChinh (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    SoToBanDo INT,
    SoThuaDat INT,
    DienTich DECIMAL(10,2) NOT NULL,
    LoaiDat VARCHAR(50) NOT NULL,
    NoiDungBienDong TEXT,
    ToaDoThuaDat VARCHAR(50),
    LoaiBienDong VARCHAR(50),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

INSERT INTO LichSuBienDongDatDai (MaThuaDat, LoaiBienDong, NgayBienDong, SoHoSoLienQuan, NoiDungChiTiet) VALUES
(1, 'Chuyển nhượng', '2023-06-15', 'HS-DA-2023-0156', 'Bán cho ông Nguyễn Văn B'),
(2, 'Tặng cho', '2023-08-20', 'HS-DA-2023-0178', 'Tặng cho con gái Trần Thị C'),
(3, 'Thế chấp', '2024-01-10', 'HS-DA-2024-0045', 'Thế chấp ngân hàng VP Bank');

INSERT INTO HoSoCapGCN (MaThuaDat, TrangThaiCap, NgayNhanHoSo, NgayHenTra) VALUES
(1, 'DaTra', '2023-12-01', '2024-01-15'),
(2, 'ThamDinh', '2024-01-05', '2024-02-05'),
(3, 'KyDuyet', '2024-01-10', '2024-02-10');

-- ================================================================
-- MODULE 9. QUẢN LÝ MÔI TRƯỜNG
-- ================================================================

CREATE TABLE TramQuanTracMT (
    MaTram SERIAL PRIMARY KEY,
    TenTram VARCHAR(150) NOT NULL,
    KhuVuc VARCHAR(150),
    ToaDo VARCHAR(50),
    LoaiQuanTrac VARCHAR(50),
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ChiSoAQI_TheoNgay (
    MaChiSo SERIAL PRIMARY KEY,
    MaTram INT NOT NULL,
    NgayDo DATE NOT NULL,
    ChiSoAQI INT,
    MucDo VARCHAR(50),
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaTram) REFERENCES TramQuanTracMT(MaTram)
);

CREATE TABLE DonViThuGomRac (
    MaDonVi SERIAL PRIMARY KEY,
    TenDonVi VARCHAR(150) NOT NULL,
    KhuVucPhuTrach VARCHAR(255),
    SoDienThoai VARCHAR(20),
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DiemThuGomRac (
    MaDiem SERIAL PRIMARY KEY,
    MaDiemThuGom VARCHAR(20) UNIQUE,
    MaDonVi INT NOT NULL,
    DiaDiem VARCHAR(255) NOT NULL,
    KhuVuc VARCHAR(150),
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaDonVi) REFERENCES DonViThuGomRac(MaDonVi)
);

CREATE TABLE PhieuThuGomRac (
    MaPhieu SERIAL PRIMARY KEY,
    MaDiem INT NOT NULL,
    NgayThuGom DATE NOT NULL,
    KhoiLuong DECIMAL(10,2),
    LoaiRac VARCHAR(100),
    TrangThai VARCHAR(50) DEFAULT 'Đã thu gom',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaDiem) REFERENCES DiemThuGomRac(MaDiem)
);

CREATE TABLE CoSoSanXuat_MoiTruong (
    MaCoSo SERIAL PRIMARY KEY,
    TenCoSo VARCHAR(200) NOT NULL,
    DiaChi VARCHAR(255),
    LoaiHinhSanXuat VARCHAR(100),
    MucDoNguyCo VARCHAR(50),
    TanSuatKiemTra INT,
    GiayPhepMoiTruong VARCHAR(50),
    TrangThaiHoatDong BOOLEAN DEFAULT true
);

CREATE TABLE KetQuaKiemTraMoiTruong (
    MaKiemTra SERIAL PRIMARY KEY,
    MaCoSo INT,
    NgayKiemTra DATE,
    DoanKiemTra VARCHAR(255),
    KetLuan TEXT,
    HanhViViPham TEXT,
    MucPhat DECIMAL(18,0),
    FileBienBan VARCHAR(500),
    FOREIGN KEY (MaCoSo) REFERENCES CoSoSanXuat_MoiTruong(MaCoSo)
);

CREATE TABLE ThuPhiVeSinh (
    MaThu SERIAL PRIMARY KEY,
    MaHoGiaDinh INT,
    KyThu VARCHAR(20),
    SoTienPhaiThu DECIMAL(18,0),
    SoTienDaThu DECIMAL(18,0),
    NgayNop DATE,
    TrangThai VARCHAR(50) DEFAULT 'ChuaNop',
    HinhThucNop VARCHAR(50)
);

CREATE TABLE DiemNongMoiTruong (
    MaDiemNong SERIAL PRIMARY KEY,
    ViTri VARCHAR(255),
    ToaDoGPS VARCHAR(50),
    LoaiONhiem VARCHAR(100),
    MucDoNghiemTrong INT,
    SoLuongPhanAnh INT,
    TrangThaiXuLy VARCHAR(50),
    AnhMinhHoa VARCHAR(500)
);

CREATE TABLE ChiTiet_MoiTruong (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    KhuVuc VARCHAR(150) NOT NULL,
    ChiSoAQI INT CHECK (ChiSoAQI IS NULL OR ChiSoAQI BETWEEN 0 AND 500),
    TinhTrangRacThai VARCHAR(100),
    DonViThuGom VARCHAR(100),
    LoaiViPham VARCHAR(100),
    MucDoViPham VARCHAR(20),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

INSERT INTO CoSoSanXuat_MoiTruong (TenCoSo, DiaChi, LoaiHinhSanXuat, MucDoNguyCo, TanSuatKiemTra) VALUES
('Nhà máy Dệt nhuộm Hoàng Gia', 'Thôn 2, Xã A', 'Dệt nhuộm', 'Cao', 4),
('Cơ sở Chế biến gỗ Minh Phát', 'Thôn 5, Xã B', 'Chế biến gỗ', 'Trung bình', 2),
('Nhà hàng Tây Hồ', 'Trung tâm xã, Xã A', 'Nhà hàng', 'Thấp', 1);

INSERT INTO KetQuaKiemTraMoiTruong (MaCoSo, NgayKiemTra, DoanKiemTra, KetLuan, HanhViViPham) VALUES
(1, '2024-01-15', 'Đoàn Kiểm tra Môi trường Huyện', 'Vi phạm xả thải', 'Xả thải vượt tiêu chuẩn 1.5 lần'),
(2, '2024-01-18', 'Đoàn Kiểm tra Môi trường Huyện', 'Đạt chuẩn', NULL),
(3, '2024-01-20', 'Đoàn Kiểm tra Môi trường Xã', 'Đạt chuẩn', NULL);

INSERT INTO ThuPhiVeSinh (MaHoGiaDinh, KyThu, SoTienPhaiThu, SoTienDaThu, TrangThai) VALUES
(1, 'Thang 01/2026', 100000, 100000, 'DaNop'),
(2, 'Thang 01/2026', 100000, 0, 'ChuaNop'),
(3, 'Thang 01/2026', 100000, 50000, 'NoDong');

INSERT INTO DiemNongMoiTruong (ViTri, ToaDoGPS, LoaiONhiem, MucDoNghiemTrong, SoLuongPhanAnh, TrangThaiXuLy) VALUES
('Gần kênh Tây - Thôn 3', '21.0285,105.7890', 'Rác thải tự phát', 4, 12, 'Đang xử lý'),
('Dọc đường ĐT 100 - Km 3', '21.0456,105.8120', 'Nước thải đen', 3, 8, 'Mới'),
('Gần trạm tôm - Thôn 7', '21.0178,105.7650', 'Rác thải nông nghiệp', 2, 5, 'Đã dọn dẹp');

-- ================================================================
-- MODULE 10. VĂN HÓA - DU LỊCH
-- ================================================================

CREATE TABLE BaoCao (
    MaBaoCao SERIAL PRIMARY KEY,
    MaBaoCaoSo VARCHAR(20) UNIQUE,
    LoaiBaoCao VARCHAR(50) NOT NULL,
    MaLinhVuc INT,
    ThangNam VARCHAR(7),
    TieuDe VARCHAR(300) NOT NULL,
    NoiDung TEXT,
    FileDinhKem VARCHAR(500),
    TrangThai VARCHAR(50) DEFAULT 'Đã nộp',
    NguoiTao INT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc),
    FOREIGN KEY (NguoiTao) REFERENCES NguoiDung(MaNguoiDung)
);

CREATE TABLE DiTich (
    MaDiTich SERIAL PRIMARY KEY,
    TenDiTich VARCHAR(200) NOT NULL,
    Loai VARCHAR(50),
    DiaChi VARCHAR(255),
    ToaDo VARCHAR(50),
    NamCongNhan DATE,
    TrangThai BOOLEAN DEFAULT true,
    GhiChu TEXT,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HoSoDiTich (
    MaHoSoDT SERIAL PRIMARY KEY,
    MaDiTich INT NOT NULL,
    SoHoSo VARCHAR(50),
    NoiDung TEXT,
    FileDinhKem VARCHAR(500),
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaDiTich) REFERENCES DiTich(MaDiTich)
);

CREATE TABLE LangNghe (
    MaLangNghe SERIAL PRIMARY KEY,
    TenLangNghe VARCHAR(200) NOT NULL,
    SanPhamChinh VARCHAR(255),
    DiaChi VARCHAR(255),
    SoHoThamGia INT DEFAULT 0,
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LeHoi (
    MaLeHoi SERIAL PRIMARY KEY,
    TenLeHoi VARCHAR(200) NOT NULL,
    ThoiGianToChuc DATE,
    DiaDiem VARCHAR(255),
    SoLuongKhach INT DEFAULT 0,
    MoTa TEXT,
    TrangThai VARCHAR(50) DEFAULT 'Đã tổ chức',
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CoSoKinhDoanhDuLich (
    MaCoSo SERIAL PRIMARY KEY,
    TenCoSo VARCHAR(200) NOT NULL,
    Loai VARCHAR(50),
    DiaChi VARCHAR(255),
    SoDienThoai VARCHAR(20),
    TrangThai BOOLEAN DEFAULT true,
    NgayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NoiDungSoHoaDiTich (
    MaNoiDung SERIAL PRIMARY KEY,
    MaDiTich INT NOT NULL,
    LoaiNoiDung VARCHAR(50),
    TieuDe VARCHAR(200),
    DuongDanFile VARCHAR(500),
    MoTaNgan TEXT,
    NgonNgu VARCHAR(20) DEFAULT 'VN',
    FOREIGN KEY (MaDiTich) REFERENCES DiTich(MaDiTich)
);

CREATE TABLE BaiThuyetMinh (
    MaBai SERIAL PRIMARY KEY,
    MaDiTich INT,
    ViTriDiemDung VARCHAR(100),
    NoiDungText TEXT,
    FileAudio VARCHAR(500),
    QrCodeData VARCHAR(500),
    FOREIGN KEY (MaDiTich) REFERENCES DiTich(MaDiTich)
);

CREATE TABLE SanPhamOCOP (
    MaSanPham SERIAL PRIMARY KEY,
    TenSanPham VARCHAR(200) NOT NULL,
    MaLangNghe INT,
    HangSao INT,
    NamCongNhan INT,
    MoTaSanpham TEXT,
    DonViSanXuat VARCHAR(200),
    HinhAnhBaoBi VARCHAR(500),
    LinkBanHang VARCHAR(500),
    FOREIGN KEY (MaLangNghe) REFERENCES LangNghe(MaLangNghe)
);

CREATE TABLE KeHoachLeHoi (
    MaKeHoach SERIAL PRIMARY KEY,
    MaLeHoi INT,
    NamToChuc INT,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    DuToanKinhPhi DECIMAL(18,0),
    DonViToChuc VARCHAR(200),
    PhuongAnAnNinh TEXT,
    TrangThai VARCHAR(50),
    FOREIGN KEY (MaLeHoi) REFERENCES LeHoi(MaLeHoi)
);

CREATE TABLE ChiTiet_VanHoa (
    MaHoSo VARCHAR(20) PRIMARY KEY,
    TenDiTich_LeHoi VARCHAR(150) NOT NULL,
    LoaiHinh VARCHAR(50) NOT NULL CHECK (LoaiHinh IN ('Di tích', 'Lễ hội', 'Điểm du lịch', 'Sự kiện')),
    DoanhThuDuLich DECIMAL(18,0),
    SoLuongKhach INT,
    ThoiGianToChuc DATE,
    DiaDiem VARCHAR(255),
    FOREIGN KEY (MaHoSo) REFERENCES HoSoNghiepVu(MaHoSo)
);

INSERT INTO NoiDungSoHoaDiTich (MaDiTich, LoaiNoiDung, TieuDe, MoTaNgan, NgonNgu) VALUES
(1, 'VR360', 'Tour ảo 360° - Đình làng', 'Trải nghiệm thực tế ảo toàn cảnh đình làng', 'VN'),
(1, 'Video', 'Video giới thiệu - Kiến trúc đình', 'Video 4K giới thiệu kiến trúc và lịch sử', 'VN'),
(1, 'AudioGuide', 'Audio hướng dẫn tiếng Việt', 'Giọng đọc chuyên nghiệp dẫn dắt du khách', 'VN');

INSERT INTO BaiThuyetMinh (MaDiTich, ViTriDiemDung, NoiDungText, QrCodeData) VALUES
(1, 'Cổng tam quan', 'Cổng tam quan được xây dựng vào thế kỷ 18, là cổng vào chính của đình.', 'QR_DITICH_01_CONG'),
(1, 'Gian chính', 'Gian chính là nơi thờ các vị thần bảo trợ của làng, được xây dựng theo kiến trúc truyền thống.', 'QR_DITICH_01_GIAN'),
(1, 'Sân trước', 'Sân trước rộng được dùng để tổ chức các lễ hội và tập thể dục', 'QR_DITICH_01_SAN');

INSERT INTO SanPhamOCOP (TenSanPham, HangSao, NamCongNhan, MoTaSanpham, DonViSanXuat) VALUES
('Khô gà cay Xứ Đoàn', 5, 2020, 'Sản phẩm khô gà nấu từ các gia vị truyền thống', 'Hợp tác xã Xứ Đoàn'),
('Mật ong rừng nguyên chất', 5, 2019, 'Mật ong lấy từ rừng nguyên sinh, không pha tạp', 'HTX Mật ong Miền Tây'),
('Nón lá Trúc Xanh', 4, 2021, 'Nón lá thủ công từ lá trúc, sản phẩm truyền thống', 'Làng nghề Nón lá Trúc Xanh');

INSERT INTO KeHoachLeHoi (MaLeHoi, NamToChuc, NgayBatDau, NgayKetThuc, DuToanKinhPhi, DonViToChuc, TrangThai) VALUES
(1, 2026, '2026-02-10', '2026-02-15', 500000000, 'UBND Xã', 'DaDuyet'),
(2, 2026, '2026-05-20', '2026-05-22', 300000000, 'UBND Xã', 'DuThao');

-- ================================================================
-- PHẦN THỐNG KÊ / KPI (dùng chung)
-- ================================================================

CREATE TABLE KPI_CanBo_Thang (
    ThangNam VARCHAR(7) NOT NULL CHECK (ThangNam LIKE '____-__'),
    MaCanBo INT NOT NULL,
    TongHoSoXuLy INT DEFAULT 0,
    HoSoDungHan INT DEFAULT 0,
    HoSoTreHan INT DEFAULT 0,
    TyLeDungHan FLOAT DEFAULT 0 CHECK (TyLeDungHan BETWEEN 0 AND 1),
    DiemDanhGia FLOAT DEFAULT 0 CHECK (DiemDanhGia >= 0 AND DiemDanhGia <= 100),
    SoPhanAnh INT DEFAULT 0,
    SoPhanAnhDaXuLy INT DEFAULT 0,
    PRIMARY KEY (ThangNam, MaCanBo),
    FOREIGN KEY (MaCanBo) REFERENCES CanBo(MaCanBo)
);

CREATE TABLE Fact_HoSo_TheoNgay (
    Ngay DATE NOT NULL,
    MaLinhVuc INT NOT NULL,
    TongHoSo INT DEFAULT 0,
    HoSoDungHan INT DEFAULT 0,
    HoSoTreHan INT DEFAULT 0,
    HoSoHoanThanh INT DEFAULT 0,
    TongDoanhThu DECIMAL(18,0) DEFAULT 0,
    PRIMARY KEY (Ngay, MaLinhVuc),
    FOREIGN KEY (MaLinhVuc) REFERENCES LinhVuc(MaLinhVuc),
    CHECK (HoSoDungHan + HoSoTreHan <= TongHoSo)
);

-- ================================================================
-- INDEX (một số index quan trọng)
-- ================================================================

CREATE INDEX idx_phanAnh_trangThai ON PhanAnh(TrangThai);
CREATE INDEX idx_phanAnh_diaDiem ON PhanAnh(DiaDiem);
CREATE INDEX idx_phanAnh_ngayTao ON PhanAnh(NgayTao);

CREATE INDEX idx_hoSo_maTrangThai ON HoSoNghiepVu(MaTrangThai);
CREATE INDEX idx_hoSo_ngayTao ON HoSoNghiepVu(NgayTao);
CREATE INDEX idx_hoSo_loaiHoSo ON HoSoNghiepVu(LoaiHoSo);
