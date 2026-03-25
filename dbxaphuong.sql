-- dashboard_xp."BaoCaoKinhTe" definition

-- Drop table

-- DROP TABLE dashboard_xp."BaoCaoKinhTe";

CREATE TABLE dashboard_xp."BaoCaoKinhTe" (
	"MaBaoCao" serial4 NOT NULL,
	"TieuDe" varchar(200) NOT NULL,
	"NoiDung" text NULL,
	"ThoiGian" date NULL,
	CONSTRAINT "BaoCaoKinhTe_pkey" PRIMARY KEY ("MaBaoCao")
);

-- Permissions

ALTER TABLE dashboard_xp."BaoCaoKinhTe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BaoCaoKinhTe" TO postgres;


-- dashboard_xp."BaoCaoXayDung" definition

-- Drop table

-- DROP TABLE dashboard_xp."BaoCaoXayDung";

CREATE TABLE dashboard_xp."BaoCaoXayDung" (
	"MaBaoCao" serial4 NOT NULL,
	"TieuDe" varchar(200) NOT NULL,
	"NoiDung" text NULL,
	"ThoiGian" date NULL,
	CONSTRAINT "BaoCaoXayDung_pkey" PRIMARY KEY ("MaBaoCao")
);

-- Permissions

ALTER TABLE dashboard_xp."BaoCaoXayDung" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BaoCaoXayDung" TO postgres;


-- dashboard_xp."BienDongDanCu" definition

-- Drop table

-- DROP TABLE dashboard_xp."BienDongDanCu";

CREATE TABLE dashboard_xp."BienDongDanCu" (
	"MaBienDong" serial4 NOT NULL,
	"LoaiBienDong" varchar(50) NOT NULL,
	"SoLuong" int4 DEFAULT 0 NULL,
	"ThoiGian" date DEFAULT CURRENT_DATE NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "BienDongDanCu_pkey" PRIMARY KEY ("MaBienDong")
);

-- Permissions

ALTER TABLE dashboard_xp."BienDongDanCu" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BienDongDanCu" TO postgres;


-- dashboard_xp."CanBoKinhTe" definition

-- Drop table

-- DROP TABLE dashboard_xp."CanBoKinhTe";

CREATE TABLE dashboard_xp."CanBoKinhTe" (
	"MaCanBo" serial4 NOT NULL,
	"HoTen" varchar(150) NOT NULL,
	"ChucVu" varchar(50) NULL,
	"SoDienThoai" varchar(15) NULL,
	CONSTRAINT "CanBoKinhTe_pkey" PRIMARY KEY ("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."CanBoKinhTe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CanBoKinhTe" TO postgres;


-- dashboard_xp."CanBoQuocPhong" definition

-- Drop table

-- DROP TABLE dashboard_xp."CanBoQuocPhong";

CREATE TABLE dashboard_xp."CanBoQuocPhong" (
	"MaCanBo" serial4 NOT NULL,
	"HoTen" varchar(150) NOT NULL,
	"CapBac" varchar(50) NULL,
	"ChucVu" varchar(50) NULL,
	"DonVi" varchar(150) NULL,
	"SoDienThoai" varchar(20) NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "CanBoQuocPhong_pkey" PRIMARY KEY ("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."CanBoQuocPhong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CanBoQuocPhong" TO postgres;


-- dashboard_xp."CanBoTBXH" definition

-- Drop table

-- DROP TABLE dashboard_xp."CanBoTBXH";

CREATE TABLE dashboard_xp."CanBoTBXH" (
	"MaCanBo" serial4 NOT NULL,
	"HoTen" varchar(150) NOT NULL,
	"ChucVu" varchar(50) NULL,
	"SoDienThoai" varchar(20) NULL,
	CONSTRAINT "CanBoTBXH_pkey" PRIMARY KEY ("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."CanBoTBXH" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CanBoTBXH" TO postgres;


-- dashboard_xp."CanBoXayDung" definition

-- Drop table

-- DROP TABLE dashboard_xp."CanBoXayDung";

CREATE TABLE dashboard_xp."CanBoXayDung" (
	"MaCanBo" serial4 NOT NULL,
	"HoTen" varchar(150) NOT NULL,
	"ChucVu" varchar(50) NULL,
	"SoDienThoai" varchar(15) NULL,
	CONSTRAINT "CanBoXayDung_pkey" PRIMARY KEY ("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."CanBoXayDung" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CanBoXayDung" TO postgres;


-- dashboard_xp."CanhBaoRuiRoKinhTe" definition

-- Drop table

-- DROP TABLE dashboard_xp."CanhBaoRuiRoKinhTe";

CREATE TABLE dashboard_xp."CanhBaoRuiRoKinhTe" (
	"MaCanhBao" serial4 NOT NULL,
	"NoiDung" text NOT NULL,
	"MucDo" varchar(20) NULL,
	"ThoiGian" date NULL,
	CONSTRAINT "CanhBaoRuiRoKinhTe_pkey" PRIMARY KEY ("MaCanhBao")
);

-- Permissions

ALTER TABLE dashboard_xp."CanhBaoRuiRoKinhTe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CanhBaoRuiRoKinhTe" TO postgres;


-- dashboard_xp."CapDoQuyen" definition

-- Drop table

-- DROP TABLE dashboard_xp."CapDoQuyen";

CREATE TABLE dashboard_xp."CapDoQuyen" (
	"MaCapDo" int4 NOT NULL,
	"TenCapDo" varchar(50) NOT NULL,
	"MoTa" text NULL,
	"TrangThai" bool DEFAULT true NULL,
	CONSTRAINT "CapDoQuyen_TenCapDo_key" UNIQUE ("TenCapDo"),
	CONSTRAINT "CapDoQuyen_pkey" PRIMARY KEY ("MaCapDo")
);

-- Permissions

ALTER TABLE dashboard_xp."CapDoQuyen" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CapDoQuyen" TO postgres;


-- dashboard_xp."ChoDiemKinhDoanh" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChoDiemKinhDoanh";

CREATE TABLE dashboard_xp."ChoDiemKinhDoanh" (
	"MaCho" serial4 NOT NULL,
	"TenCho" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"LoaiHinh" varchar(50) NULL,
	"SoLo" int4 DEFAULT 0 NULL,
	"TongDienTich" numeric(18, 2) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hoạt động'::character varying NULL,
	"NguoiQuanLy" varchar(150) NULL,
	"SoDienThoai" varchar(20) NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "ChoDiemKinhDoanh_pkey" PRIMARY KEY ("MaCho")
);

-- Permissions

ALTER TABLE dashboard_xp."ChoDiemKinhDoanh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChoDiemKinhDoanh" TO postgres;


-- dashboard_xp."CoSoGiaoDuc" definition

-- Drop table

-- DROP TABLE dashboard_xp."CoSoGiaoDuc";

CREATE TABLE dashboard_xp."CoSoGiaoDuc" (
	"MaCoSo" serial4 NOT NULL,
	"TenCoSo" varchar(200) NOT NULL,
	"LoaiHinh" varchar(50) NULL,
	"DiaChi" varchar(255) NULL,
	"SoDienThoai" varchar(20) NULL,
	"SoHocSinh" int4 DEFAULT 0 NULL,
	"SoGiaoVien" int4 DEFAULT 0 NULL,
	"TrangThai" bool DEFAULT true NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "CoSoGiaoDuc_pkey" PRIMARY KEY ("MaCoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."CoSoGiaoDuc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CoSoGiaoDuc" TO postgres;


-- dashboard_xp."CoSoKinhDoanhDuLich" definition

-- Drop table

-- DROP TABLE dashboard_xp."CoSoKinhDoanhDuLich";

CREATE TABLE dashboard_xp."CoSoKinhDoanhDuLich" (
	"MaCoSo" serial4 NOT NULL,
	"TenCoSo" varchar(200) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"LoaiHinh" varchar(50) NULL,
	"ChuCoSo" varchar(150) NULL,
	"SoDienThoai" varchar(20) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hoạt động'::character varying NULL,
	"NgayCapPhep" date NULL,
	CONSTRAINT "CoSoKinhDoanhDuLich_pkey" PRIMARY KEY ("MaCoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."CoSoKinhDoanhDuLich" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CoSoKinhDoanhDuLich" TO postgres;


-- dashboard_xp."CoSoSanXuat_MoiTruong" definition

-- Drop table

-- DROP TABLE dashboard_xp."CoSoSanXuat_MoiTruong";

CREATE TABLE dashboard_xp."CoSoSanXuat_MoiTruong" (
	"MaCoSo" serial4 NOT NULL,
	"TenCoSo" varchar(200) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"LoaiHinh" varchar(100) NULL,
	"ChuCoSo" varchar(150) NULL,
	"SoDienThoai" varchar(20) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hoạt động'::character varying NULL,
	"NgayCapPhep" date NULL,
	"GhiChu" text NULL,
	CONSTRAINT "CoSoSanXuat_MoiTruong_pkey" PRIMARY KEY ("MaCoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."CoSoSanXuat_MoiTruong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CoSoSanXuat_MoiTruong" TO postgres;


-- dashboard_xp."DiTich" definition

-- Drop table

-- DROP TABLE dashboard_xp."DiTich";

CREATE TABLE dashboard_xp."DiTich" (
	"MaDiTich" serial4 NOT NULL,
	"TenDiTich" varchar(200) NOT NULL,
	"LoaiDiTich" varchar(50) NULL,
	"DiaChi" varchar(255) NULL,
	"ToaDo" varchar(50) NULL,
	"CapXepHang" varchar(50) NULL,
	"TinhTrang" varchar(50) DEFAULT 'Tốt'::character varying NULL,
	"MoTa" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "DiTich_pkey" PRIMARY KEY ("MaDiTich")
);

-- Permissions

ALTER TABLE dashboard_xp."DiTich" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DiTich" TO postgres;


-- dashboard_xp."DichBenh" definition

-- Drop table

-- DROP TABLE dashboard_xp."DichBenh";

CREATE TABLE dashboard_xp."DichBenh" (
	"MaDich" serial4 NOT NULL,
	"TenDich" varchar(100) NOT NULL,
	"KhuVuc" varchar(150) NULL,
	"SoCaNhiem" int4 DEFAULT 0 NULL,
	"SoCaKhoi" int4 DEFAULT 0 NULL,
	"NgayBatDau" date NULL,
	"NgayKetThuc" date NULL,
	"MucDo" varchar(20) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang theo dõi'::character varying NULL,
	"GhiChu" text NULL,
	"NgayCapNhat" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "DichBenh_pkey" PRIMARY KEY ("MaDich")
);

-- Permissions

ALTER TABLE dashboard_xp."DichBenh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DichBenh" TO postgres;


-- dashboard_xp."DiemNongAnNinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."DiemNongAnNinh";

CREATE TABLE dashboard_xp."DiemNongAnNinh" (
	"MaDiem" serial4 NOT NULL,
	"TenDiem" varchar(150) NOT NULL,
	"DiaDiem" varchar(255) NULL,
	"ToaDo" varchar(50) NULL,
	"LoaiRuiRo" varchar(100) NULL,
	"MucDoNghiemTrong" varchar(20) NULL,
	"TinhTrang" varchar(50) DEFAULT 'Đang theo dõi'::character varying NULL,
	"NgayPhatHien" date DEFAULT CURRENT_DATE NULL,
	"BienPhapXuLy" text NULL,
	"GhiChu" text NULL,
	CONSTRAINT "DiemNongAnNinh_pkey" PRIMARY KEY ("MaDiem")
);

-- Permissions

ALTER TABLE dashboard_xp."DiemNongAnNinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DiemNongAnNinh" TO postgres;


-- dashboard_xp."DiemNongMoiTruong" definition

-- Drop table

-- DROP TABLE dashboard_xp."DiemNongMoiTruong";

CREATE TABLE dashboard_xp."DiemNongMoiTruong" (
	"MaDiem" serial4 NOT NULL,
	"TenDiem" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"ToaDo" varchar(50) NULL,
	"LoaiONhiem" varchar(50) NULL,
	"MucDoNghiemTrong" varchar(20) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang theo dõi'::character varying NULL,
	"BienPhapXuLy" text NULL,
	"NgayPhatHien" date DEFAULT CURRENT_DATE NULL,
	CONSTRAINT "DiemNongMoiTruong_pkey" PRIMARY KEY ("MaDiem")
);

-- Permissions

ALTER TABLE dashboard_xp."DiemNongMoiTruong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DiemNongMoiTruong" TO postgres;


-- dashboard_xp."DiemThuGomRac" definition

-- Drop table

-- DROP TABLE dashboard_xp."DiemThuGomRac";

CREATE TABLE dashboard_xp."DiemThuGomRac" (
	"MaDiem" serial4 NOT NULL,
	"TenDiem" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"ToaDo" varchar(50) NULL,
	"LoaiDiem" varchar(50) NULL,
	"TrangThai" varchar(50) DEFAULT 'Hoạt động'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "DiemThuGomRac_pkey" PRIMARY KEY ("MaDiem")
);

-- Permissions

ALTER TABLE dashboard_xp."DiemThuGomRac" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DiemThuGomRac" TO postgres;


-- dashboard_xp."DonViHanhChinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."DonViHanhChinh";

CREATE TABLE dashboard_xp."DonViHanhChinh" (
	"MaDVHC" varchar(20) NOT NULL,
	"TenDVHC" varchar(150) NOT NULL,
	"Cap" int4 NOT NULL,
	CONSTRAINT "DonViHanhChinh_pkey" PRIMARY KEY ("MaDVHC")
);

-- Permissions

ALTER TABLE dashboard_xp."DonViHanhChinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DonViHanhChinh" TO postgres;


-- dashboard_xp."DonViThuGomRac" definition

-- Drop table

-- DROP TABLE dashboard_xp."DonViThuGomRac";

CREATE TABLE dashboard_xp."DonViThuGomRac" (
	"MaDonVi" serial4 NOT NULL,
	"TenDonVi" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"SoDienThoai" varchar(20) NULL,
	"NguoiDaiDien" varchar(150) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hoạt động'::character varying NULL,
	CONSTRAINT "DonViThuGomRac_pkey" PRIMARY KEY ("MaDonVi")
);

-- Permissions

ALTER TABLE dashboard_xp."DonViThuGomRac" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DonViThuGomRac" TO postgres;


-- dashboard_xp."GiaoDucTongHop" definition

-- Drop table

-- DROP TABLE dashboard_xp."GiaoDucTongHop";

CREATE TABLE dashboard_xp."GiaoDucTongHop" (
	"MaTongHop" serial4 NOT NULL,
	"TenTruong" varchar(200) NULL,
	"CapHoc" varchar(50) NULL,
	"DiaChi" varchar(255) NULL,
	"TenLop" varchar(50) NULL,
	"Khoi" varchar(20) NULL,
	"GiaoVien" varchar(150) NULL,
	"ChuyenMon" varchar(100) NULL,
	"TongSoHocSinh" int4 DEFAULT 0 NULL,
	"BienDongHocSinh" varchar(50) NULL,
	"LyDoBienDong" text NULL,
	"PhongHoc" varchar(50) NULL,
	"TrangThietBi" text NULL,
	"TinhTrangCoSoVatChat" varchar(100) NULL,
	"TinhTrangSucKhoe" varchar(100) NULL,
	"HoatDongYTe" text NULL,
	"NgayCapNhat" date NULL,
	CONSTRAINT "GiaoDucTongHop_pkey" PRIMARY KEY ("MaTongHop")
);

-- Permissions

ALTER TABLE dashboard_xp."GiaoDucTongHop" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."GiaoDucTongHop" TO postgres;


-- dashboard_xp."HaTangDoThi" definition

-- Drop table

-- DROP TABLE dashboard_xp."HaTangDoThi";

CREATE TABLE dashboard_xp."HaTangDoThi" (
	"MaHaTang" serial4 NOT NULL,
	"TenHaTang" varchar(150) NOT NULL,
	"LoaiHaTang" varchar(50) NULL,
	"TinhTrang" varchar(50) DEFAULT 'Bình thường'::character varying NULL,
	"NgayCapNhat" date NULL,
	CONSTRAINT "HaTangDoThi_pkey" PRIMARY KEY ("MaHaTang")
);

-- Permissions

ALTER TABLE dashboard_xp."HaTangDoThi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HaTangDoThi" TO postgres;


-- dashboard_xp."HoKhau" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoKhau";

CREATE TABLE dashboard_xp."HoKhau" (
	"MaHoKhau" varchar(20) NOT NULL,
	"SoHoKhau" varchar(50) NOT NULL,
	"ChuHo" varchar(150) NOT NULL,
	"DiaChiThuongTru" varchar(255) NOT NULL,
	"NgayDangKy" date DEFAULT CURRENT_DATE NULL,
	"LoaiHoKhau" varchar(50) DEFAULT 'Thường trú'::character varying NULL,
	"SoThanhVien" int4 DEFAULT 1 NULL,
	"TrangThai" varchar(50) DEFAULT 'Hoạt động'::character varying NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "HoKhau_pkey" PRIMARY KEY ("MaHoKhau")
);

-- Permissions

ALTER TABLE dashboard_xp."HoKhau" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoKhau" TO postgres;


-- dashboard_xp."HoKinhDoanh" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoKinhDoanh";

CREATE TABLE dashboard_xp."HoKinhDoanh" (
	"MaHoKD" serial4 NOT NULL,
	"TenHoKD" varchar(150) NOT NULL,
	"ChuHo" varchar(150) NULL,
	"DiaChi" varchar(255) NULL,
	"SoDienThoai" varchar(20) NULL,
	"LoaiHinhKD" varchar(100) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hoạt động'::character varying NULL,
	"NgayDangKy" date NULL,
	CONSTRAINT "HoKinhDoanh_pkey" PRIMARY KEY ("MaHoKD")
);

-- Permissions

ALTER TABLE dashboard_xp."HoKinhDoanh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoKinhDoanh" TO postgres;


-- dashboard_xp."HoTich" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoTich";

CREATE TABLE dashboard_xp."HoTich" (
	id serial4 NOT NULL,
	so_ho_tich varchar(30) NOT NULL,
	ten_chu_ho varchar(150) NOT NULL,
	ngay_sinh_chu_ho date NULL,
	gioi_tinh_chu_ho varchar(10) NULL,
	dia_chi_ho_tich varchar(255) NOT NULL,
	so_thanh_vien_ho_tich int4 DEFAULT 0 NULL,
	ngay_lap_ho_tich date DEFAULT CURRENT_DATE NULL,
	ghi_chu text NULL,
	trang_thai bool DEFAULT true NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "HoTich_pkey" PRIMARY KEY (id),
	CONSTRAINT "HoTich_so_ho_tich_key" UNIQUE (so_ho_tich)
);
CREATE INDEX idx_so_ho_tich ON dashboard_xp."HoTich" USING btree (so_ho_tich);

-- Permissions

ALTER TABLE dashboard_xp."HoTich" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoTich" TO postgres;


-- dashboard_xp."KhuDanCu" definition

-- Drop table

-- DROP TABLE dashboard_xp."KhuDanCu";

CREATE TABLE dashboard_xp."KhuDanCu" (
	"MaKhuDanCu" serial4 NOT NULL,
	"TenKhuDanCu" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"SoHoDan" int4 DEFAULT 0 NULL,
	"SoDanSo" int4 DEFAULT 0 NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "KhuDanCu_pkey" PRIMARY KEY ("MaKhuDanCu")
);

-- Permissions

ALTER TABLE dashboard_xp."KhuDanCu" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."KhuDanCu" TO postgres;


-- dashboard_xp."LangNghe" definition

-- Drop table

-- DROP TABLE dashboard_xp."LangNghe";

CREATE TABLE dashboard_xp."LangNghe" (
	"MaLangNghe" serial4 NOT NULL,
	"TenLangNghe" varchar(200) NOT NULL,
	"LoaiNghe" varchar(100) NULL,
	"DiaChi" varchar(255) NULL,
	"SoHoNghe" int4 DEFAULT 0 NULL,
	"SanPhamChinh" varchar(200) NULL,
	"TrangThai" bool DEFAULT true NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "LangNghe_pkey" PRIMARY KEY ("MaLangNghe")
);

-- Permissions

ALTER TABLE dashboard_xp."LangNghe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LangNghe" TO postgres;


-- dashboard_xp."LeHoi" definition

-- Drop table

-- DROP TABLE dashboard_xp."LeHoi";

CREATE TABLE dashboard_xp."LeHoi" (
	"MaLeHoi" serial4 NOT NULL,
	"TenLeHoi" varchar(200) NOT NULL,
	"ThoiGianToChuc" date NULL,
	"DiaDiem" varchar(255) NULL,
	"SoLuongKhach" int4 DEFAULT 0 NULL,
	"MoTa" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã tổ chức'::character varying NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "LeHoi_pkey" PRIMARY KEY ("MaLeHoi")
);

-- Permissions

ALTER TABLE dashboard_xp."LeHoi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LeHoi" TO postgres;


-- dashboard_xp."LinhVuc" definition

-- Drop table

-- DROP TABLE dashboard_xp."LinhVuc";

CREATE TABLE dashboard_xp."LinhVuc" (
	"MaLinhVuc" serial4 NOT NULL,
	"TenLinhVuc" varchar(100) NOT NULL,
	"MoTa" text NULL,
	"MaCode" varchar(20) NULL,
	"ThuTuHienThi" int4 DEFAULT 0 NULL,
	"TrangThai" bool DEFAULT true NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "LinhVuc_MaCode_key" UNIQUE ("MaCode"),
	CONSTRAINT "LinhVuc_TenLinhVuc_key" UNIQUE ("TenLinhVuc"),
	CONSTRAINT "LinhVuc_pkey" PRIMARY KEY ("MaLinhVuc")
);

-- Permissions

ALTER TABLE dashboard_xp."LinhVuc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LinhVuc" TO postgres;


-- dashboard_xp."LoaiCongTrinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoaiCongTrinh";

CREATE TABLE dashboard_xp."LoaiCongTrinh" (
	"MaLoaiCT" serial4 NOT NULL,
	"TenLoaiCT" varchar(100) NOT NULL,
	CONSTRAINT "LoaiCongTrinh_pkey" PRIMARY KEY ("MaLoaiCT")
);

-- Permissions

ALTER TABLE dashboard_xp."LoaiCongTrinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoaiCongTrinh" TO postgres;


-- dashboard_xp."LoaiDat" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoaiDat";

CREATE TABLE dashboard_xp."LoaiDat" (
	"MaLoaiDat" varchar(20) NOT NULL,
	"TenLoai" varchar(100) NOT NULL,
	"MoTa" text NULL,
	"MauHienThi" varchar(20) NULL,
	CONSTRAINT "LoaiDat_pkey" PRIMARY KEY ("MaLoaiDat")
);

-- Permissions

ALTER TABLE dashboard_xp."LoaiDat" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoaiDat" TO postgres;


-- dashboard_xp."LoaiGiayPhep" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoaiGiayPhep";

CREATE TABLE dashboard_xp."LoaiGiayPhep" (
	"MaLoaiGP" serial4 NOT NULL,
	"TenLoaiGP" varchar(100) NOT NULL,
	CONSTRAINT "LoaiGiayPhep_pkey" PRIMARY KEY ("MaLoaiGP")
);

-- Permissions

ALTER TABLE dashboard_xp."LoaiGiayPhep" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoaiGiayPhep" TO postgres;


-- dashboard_xp."LoaiQuyHoach" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoaiQuyHoach";

CREATE TABLE dashboard_xp."LoaiQuyHoach" (
	"MaLoaiQH" serial4 NOT NULL,
	"TenLoaiQH" varchar(100) NOT NULL,
	CONSTRAINT "LoaiQuyHoach_pkey" PRIMARY KEY ("MaLoaiQH")
);

-- Permissions

ALTER TABLE dashboard_xp."LoaiQuyHoach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoaiQuyHoach" TO postgres;


-- dashboard_xp."LoaiQuyetDinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoaiQuyetDinh";

CREATE TABLE dashboard_xp."LoaiQuyetDinh" (
	"MaLoaiQD" serial4 NOT NULL,
	"TenLoaiQD" varchar(100) NOT NULL,
	CONSTRAINT "LoaiQuyetDinh_pkey" PRIMARY KEY ("MaLoaiQD")
);

-- Permissions

ALTER TABLE dashboard_xp."LoaiQuyetDinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoaiQuyetDinh" TO postgres;


-- dashboard_xp."LoaiThuTuc" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoaiThuTuc";

CREATE TABLE dashboard_xp."LoaiThuTuc" (
	"MaLoaiThuTuc" serial4 NOT NULL,
	"TenThuTuc" varchar(200) NOT NULL,
	"LinhVuc" varchar(100) NULL,
	"ThoiGianXuLy" int4 DEFAULT 3 NULL,
	"PhiDichVu" numeric(18) DEFAULT 0 NULL,
	"MoTa" text NULL,
	CONSTRAINT "LoaiThuTuc_pkey" PRIMARY KEY ("MaLoaiThuTuc")
);

-- Permissions

ALTER TABLE dashboard_xp."LoaiThuTuc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoaiThuTuc" TO postgres;


-- dashboard_xp."LopDaoTaoNghe" definition

-- Drop table

-- DROP TABLE dashboard_xp."LopDaoTaoNghe";

CREATE TABLE dashboard_xp."LopDaoTaoNghe" (
	"MaLop" serial4 NOT NULL,
	"TenNghe" varchar(150) NOT NULL,
	"SoHocVien" int4 DEFAULT 0 NULL,
	"ThoiGian" varchar(100) NULL,
	CONSTRAINT "LopDaoTaoNghe_pkey" PRIMARY KEY ("MaLop")
);

-- Permissions

ALTER TABLE dashboard_xp."LopDaoTaoNghe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LopDaoTaoNghe" TO postgres;


-- dashboard_xp."NguonLaoDong" definition

-- Drop table

-- DROP TABLE dashboard_xp."NguonLaoDong";

CREATE TABLE dashboard_xp."NguonLaoDong" (
	"MaNLD" serial4 NOT NULL,
	"TongSoLaoDong" int4 DEFAULT 0 NULL,
	"LDCoViecLam" int4 DEFAULT 0 NULL,
	"LDThatNghiep" int4 DEFAULT 0 NULL,
	"ThangNam" varchar(7) NOT NULL,
	CONSTRAINT "NguonLaoDong_pkey" PRIMARY KEY ("MaNLD")
);

-- Permissions

ALTER TABLE dashboard_xp."NguonLaoDong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NguonLaoDong" TO postgres;


-- dashboard_xp."PhanTichTaiChinh_AI" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhanTichTaiChinh_AI";

CREATE TABLE dashboard_xp."PhanTichTaiChinh_AI" (
	"MaPhanTich" serial4 NOT NULL,
	"ThangNam" varchar(7) NOT NULL,
	"TongThu" numeric(18) DEFAULT 0 NULL,
	"TongChi" numeric(18) DEFAULT 0 NULL,
	"ConLai" numeric(18) DEFAULT 0 NULL,
	"NhanXetAI" text NULL,
	"CanhBao" text NULL,
	"NgayPhanTich" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "PhanTichTaiChinh_AI_pkey" PRIMARY KEY ("MaPhanTich")
);

-- Permissions

ALTER TABLE dashboard_xp."PhanTichTaiChinh_AI" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhanTichTaiChinh_AI" TO postgres;


-- dashboard_xp."PhoiHopLucLuong" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhoiHopLucLuong";

CREATE TABLE dashboard_xp."PhoiHopLucLuong" (
	"MaPhoiHop" serial4 NOT NULL,
	"DonViPhoiHop" varchar(150) NOT NULL,
	"NoiDungPhoiHop" text NULL,
	"ThoiGian" date DEFAULT CURRENT_DATE NULL,
	"KetQua" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "PhoiHopLucLuong_pkey" PRIMARY KEY ("MaPhoiHop")
);

-- Permissions

ALTER TABLE dashboard_xp."PhoiHopLucLuong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhoiHopLucLuong" TO postgres;


-- dashboard_xp."RacThai" definition

-- Drop table

-- DROP TABLE dashboard_xp."RacThai";

CREATE TABLE dashboard_xp."RacThai" (
	"MaDiem" serial4 NOT NULL,
	"TenDiem" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"ToaDo" varchar(50) NULL,
	"LoaiRac" varchar(50) NULL,
	"KhoiLuongThang" numeric(18, 2) DEFAULT 0 NULL,
	"TinhTrang" varchar(50) DEFAULT 'Bình thường'::character varying NULL,
	"NgayCapNhat" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"GhiChu" text NULL,
	CONSTRAINT "RacThai_pkey" PRIMARY KEY ("MaDiem")
);

-- Permissions

ALTER TABLE dashboard_xp."RacThai" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."RacThai" TO postgres;


-- dashboard_xp."ThuPhiVeSinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThuPhiVeSinh";

CREATE TABLE dashboard_xp."ThuPhiVeSinh" (
	"MaPhieu" varchar(20) NOT NULL,
	"HoTen" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"ThangNam" varchar(7) NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"NgayThu" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Chưa thu'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ThuPhiVeSinh_SoTien_check" CHECK (("SoTien" > (0)::numeric)),
	CONSTRAINT "ThuPhiVeSinh_pkey" PRIMARY KEY ("MaPhieu")
);

-- Permissions

ALTER TABLE dashboard_xp."ThuPhiVeSinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThuPhiVeSinh" TO postgres;


-- dashboard_xp."TramQuanTracMT" definition

-- Drop table

-- DROP TABLE dashboard_xp."TramQuanTracMT";

CREATE TABLE dashboard_xp."TramQuanTracMT" (
	"MaTram" serial4 NOT NULL,
	"TenTram" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"ToaDo" varchar(50) NULL,
	"LoaiTram" varchar(50) NULL,
	"TrangThai" varchar(50) DEFAULT 'Hoạt động'::character varying NULL,
	"NgayLapDat" date NULL,
	"GhiChu" text NULL,
	CONSTRAINT "TramQuanTracMT_pkey" PRIMARY KEY ("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."TramQuanTracMT" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TramQuanTracMT" TO postgres;


-- dashboard_xp."TramYTe" definition

-- Drop table

-- DROP TABLE dashboard_xp."TramYTe";

CREATE TABLE dashboard_xp."TramYTe" (
	"MaTram" serial4 NOT NULL,
	"TenTram" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"SoDienThoai" varchar(20) NULL,
	"SoNhanVien" int4 DEFAULT 0 NULL,
	"SoLuotKhamThang" int4 DEFAULT 0 NULL,
	"TrangThai" bool DEFAULT true NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "TramYTe_pkey" PRIMARY KEY ("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."TramYTe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TramYTe" TO postgres;


-- dashboard_xp."TrangThaiHoSo" definition

-- Drop table

-- DROP TABLE dashboard_xp."TrangThaiHoSo";

CREATE TABLE dashboard_xp."TrangThaiHoSo" (
	"MaTrangThai" varchar(20) NOT NULL,
	"TenTrangThai" varchar(50) NOT NULL,
	"MauSac" varchar(20) NULL,
	"ThuTuHienThi" int4 DEFAULT 0 NULL,
	"MoTa" varchar(255) NULL,
	CONSTRAINT "TrangThaiHoSo_TenTrangThai_key" UNIQUE ("TenTrangThai"),
	CONSTRAINT "TrangThaiHoSo_pkey" PRIMARY KEY ("MaTrangThai")
);

-- Permissions

ALTER TABLE dashboard_xp."TrangThaiHoSo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TrangThaiHoSo" TO postgres;


-- dashboard_xp."VaiTro" definition

-- Drop table

-- DROP TABLE dashboard_xp."VaiTro";

CREATE TABLE dashboard_xp."VaiTro" (
	"MaVaiTro" serial4 NOT NULL,
	"TenVaiTro" varchar(50) NOT NULL,
	"MaCode" varchar(20) NOT NULL,
	"MoTa" varchar(255) NULL,
	"ThuTuHienThi" int4 DEFAULT 0 NULL,
	"TrangThai" bool DEFAULT true NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "VaiTro_MaCode_key" UNIQUE ("MaCode"),
	CONSTRAINT "VaiTro_TenVaiTro_key" UNIQUE ("TenVaiTro"),
	CONSTRAINT "VaiTro_pkey" PRIMARY KEY ("MaVaiTro")
);

-- Permissions

ALTER TABLE dashboard_xp."VaiTro" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."VaiTro" TO postgres;


-- dashboard_xp."ViecLam" definition

-- Drop table

-- DROP TABLE dashboard_xp."ViecLam";

CREATE TABLE dashboard_xp."ViecLam" (
	"MaViecLam" serial4 NOT NULL,
	"TenCongViec" varchar(200) NOT NULL,
	"NhaTuyenDung" varchar(200) NULL,
	"DiaDiem" varchar(255) NULL,
	"SoLuongCanTuyen" int4 DEFAULT 1 NULL,
	"MucLuong" numeric(18) NULL,
	"YeuCau" text NULL,
	"NgayDangTin" date DEFAULT CURRENT_DATE NULL,
	"NgayHetHan" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang tuyển'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ViecLam_pkey" PRIMARY KEY ("MaViecLam")
);

-- Permissions

ALTER TABLE dashboard_xp."ViecLam" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ViecLam" TO postgres;


-- dashboard_xp."BaiThuyetMinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."BaiThuyetMinh";

CREATE TABLE dashboard_xp."BaiThuyetMinh" (
	"MaBai" serial4 NOT NULL,
	"MaDiTich" int4 NOT NULL,
	"TieuDe" varchar(200) NOT NULL,
	"NoiDung" text NULL,
	"NgonNgu" varchar(20) DEFAULT 'vi'::character varying NULL,
	"FileAmThanh" varchar(500) NULL,
	"TrangThai" bool DEFAULT true NULL,
	CONSTRAINT "BaiThuyetMinh_pkey" PRIMARY KEY ("MaBai"),
	CONSTRAINT "BaiThuyetMinh_MaDiTich_fkey" FOREIGN KEY ("MaDiTich") REFERENCES dashboard_xp."DiTich"("MaDiTich")
);

-- Permissions

ALTER TABLE dashboard_xp."BaiThuyetMinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BaiThuyetMinh" TO postgres;


-- dashboard_xp."BaoHongHaTang" definition

-- Drop table

-- DROP TABLE dashboard_xp."BaoHongHaTang";

CREATE TABLE dashboard_xp."BaoHongHaTang" (
	"MaBaoHong" serial4 NOT NULL,
	"MaHaTang" int4 NOT NULL,
	"MoTa" text NULL,
	"NgayPhatHien" date DEFAULT CURRENT_DATE NULL,
	"TrangThai" varchar(50) DEFAULT 'Chờ sửa chữa'::character varying NULL,
	"ChiPhiDuKien" numeric(18) NULL,
	CONSTRAINT "BaoHongHaTang_pkey" PRIMARY KEY ("MaBaoHong"),
	CONSTRAINT "BaoHongHaTang_MaHaTang_fkey" FOREIGN KEY ("MaHaTang") REFERENCES dashboard_xp."HaTangDoThi"("MaHaTang")
);

-- Permissions

ALTER TABLE dashboard_xp."BaoHongHaTang" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BaoHongHaTang" TO postgres;


-- dashboard_xp."BienDongHoKinhDoanh" definition

-- Drop table

-- DROP TABLE dashboard_xp."BienDongHoKinhDoanh";

CREATE TABLE dashboard_xp."BienDongHoKinhDoanh" (
	"MaBienDong" serial4 NOT NULL,
	"MaHoKD" int4 NOT NULL,
	"LoaiBienDong" varchar(50) NULL,
	"NgayBienDong" date DEFAULT CURRENT_DATE NULL,
	"GhiChu" text NULL,
	CONSTRAINT "BienDongHoKinhDoanh_pkey" PRIMARY KEY ("MaBienDong"),
	CONSTRAINT "BienDongHoKinhDoanh_MaHoKD_fkey" FOREIGN KEY ("MaHoKD") REFERENCES dashboard_xp."HoKinhDoanh"("MaHoKD")
);

-- Permissions

ALTER TABLE dashboard_xp."BienDongHoKinhDoanh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BienDongHoKinhDoanh" TO postgres;


-- dashboard_xp."CauHinhCanhBaoNganSach" definition

-- Drop table

-- DROP TABLE dashboard_xp."CauHinhCanhBaoNganSach";

CREATE TABLE dashboard_xp."CauHinhCanhBaoNganSach" (
	"MaCauHinh" serial4 NOT NULL,
	"MaLinhVuc" int4 NULL,
	"NguyenMocCanhBao" float8 DEFAULT 0.8 NULL,
	"TrangThai" bool DEFAULT true NULL,
	CONSTRAINT "CauHinhCanhBaoNganSach_NguyenMocCanhBao_check" CHECK ((("NguyenMocCanhBao" >= (0)::double precision) AND ("NguyenMocCanhBao" <= (1)::double precision))),
	CONSTRAINT "CauHinhCanhBaoNganSach_pkey" PRIMARY KEY ("MaCauHinh"),
	CONSTRAINT "CauHinhCanhBaoNganSach_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc")
);

-- Permissions

ALTER TABLE dashboard_xp."CauHinhCanhBaoNganSach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CauHinhCanhBaoNganSach" TO postgres;


-- dashboard_xp."ChiSoAQI_TheoNgay" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiSoAQI_TheoNgay";

CREATE TABLE dashboard_xp."ChiSoAQI_TheoNgay" (
	"MaChiSo" serial4 NOT NULL,
	"MaTram" int4 NOT NULL,
	"Ngay" date DEFAULT CURRENT_DATE NULL,
	"ChiSoAQI" int4 NULL,
	"MucDo" varchar(50) NULL,
	"PM25" numeric(18, 2) NULL,
	"PM10" numeric(18, 2) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiSoAQI_TheoNgay_pkey" PRIMARY KEY ("MaChiSo"),
	CONSTRAINT "ChiSoAQI_TheoNgay_MaTram_fkey" FOREIGN KEY ("MaTram") REFERENCES dashboard_xp."TramQuanTracMT"("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiSoAQI_TheoNgay" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiSoAQI_TheoNgay" TO postgres;


-- dashboard_xp."Fact_HoSo_TheoNgay" definition

-- Drop table

-- DROP TABLE dashboard_xp."Fact_HoSo_TheoNgay";

CREATE TABLE dashboard_xp."Fact_HoSo_TheoNgay" (
	"Ngay" date NOT NULL,
	"MaLinhVuc" int4 NOT NULL,
	"TongHoSo" int4 DEFAULT 0 NULL,
	"HoSoDungHan" int4 DEFAULT 0 NULL,
	"HoSoTreHan" int4 DEFAULT 0 NULL,
	"HoSoHoanThanh" int4 DEFAULT 0 NULL,
	"TongDoanhThu" numeric(18) DEFAULT 0 NULL,
	CONSTRAINT "Fact_HoSo_TheoNgay_check" CHECK ((("HoSoDungHan" + "HoSoTreHan") <= "TongHoSo")),
	CONSTRAINT "Fact_HoSo_TheoNgay_pkey" PRIMARY KEY ("Ngay", "MaLinhVuc"),
	CONSTRAINT "Fact_HoSo_TheoNgay_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc")
);

-- Permissions

ALTER TABLE dashboard_xp."Fact_HoSo_TheoNgay" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."Fact_HoSo_TheoNgay" TO postgres;


-- dashboard_xp."HoSoCapPhepXayDung" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoSoCapPhepXayDung";

CREATE TABLE dashboard_xp."HoSoCapPhepXayDung" (
	"MaHoSo" serial4 NOT NULL,
	"TenCongTrinh" varchar(200) NOT NULL,
	"DiaDiem" varchar(255) NULL,
	"ChuDauTu" varchar(150) NULL,
	"DienTich" numeric(18, 2) NULL,
	"NgayNopHoSo" date DEFAULT CURRENT_DATE NULL,
	"TrangThai" varchar(50) DEFAULT 'Chờ duyệt'::character varying NULL,
	"MaCanBo" int4 NULL,
	CONSTRAINT "HoSoCapPhepXayDung_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "HoSoCapPhepXayDung_MaCanBo_fkey" FOREIGN KEY ("MaCanBo") REFERENCES dashboard_xp."CanBoXayDung"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."HoSoCapPhepXayDung" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoSoCapPhepXayDung" TO postgres;


-- dashboard_xp."LoSapCho" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoSapCho";

CREATE TABLE dashboard_xp."LoSapCho" (
	"MaLo" serial4 NOT NULL,
	"MaCho" int4 NOT NULL,
	"SoLo" varchar(20) NOT NULL,
	"DienTich" numeric(18, 2) NULL,
	"TrangThai" varchar(50) DEFAULT 'Còn trống'::character varying NULL,
	CONSTRAINT "LoSapCho_pkey" PRIMARY KEY ("MaLo"),
	CONSTRAINT "LoSapCho_MaCho_fkey" FOREIGN KEY ("MaCho") REFERENCES dashboard_xp."ChoDiemKinhDoanh"("MaCho")
);

-- Permissions

ALTER TABLE dashboard_xp."LoSapCho" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoSapCho" TO postgres;


-- dashboard_xp."LoaiNghiepVu" definition

-- Drop table

-- DROP TABLE dashboard_xp."LoaiNghiepVu";

CREATE TABLE dashboard_xp."LoaiNghiepVu" (
	"MaLoaiNghiepVu" serial4 NOT NULL,
	"TenLoai" varchar(100) NOT NULL,
	"MaLinhVuc" int4 NOT NULL,
	"ThoiHanXuLy" int4 NULL,
	"MoTa" text NULL,
	"TrangThai" bool DEFAULT true NULL,
	CONSTRAINT "LoaiNghiepVu_pkey" PRIMARY KEY ("MaLoaiNghiepVu"),
	CONSTRAINT "LoaiNghiepVu_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc")
);

-- Permissions

ALTER TABLE dashboard_xp."LoaiNghiepVu" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LoaiNghiepVu" TO postgres;


-- dashboard_xp."LopHoc" definition

-- Drop table

-- DROP TABLE dashboard_xp."LopHoc";

CREATE TABLE dashboard_xp."LopHoc" (
	"MaLop" serial4 NOT NULL,
	"TenLop" varchar(50) NOT NULL,
	"Khoi" varchar(20) NULL,
	"MaCoSo" int4 NOT NULL,
	"GiaoVienChuNhiem" varchar(150) NULL,
	"SoHocSinh" int4 DEFAULT 0 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "LopHoc_pkey" PRIMARY KEY ("MaLop"),
	CONSTRAINT "LopHoc_MaCoSo_fkey" FOREIGN KEY ("MaCoSo") REFERENCES dashboard_xp."CoSoGiaoDuc"("MaCoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."LopHoc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LopHoc" TO postgres;


-- dashboard_xp."LuotKham" definition

-- Drop table

-- DROP TABLE dashboard_xp."LuotKham";

CREATE TABLE dashboard_xp."LuotKham" (
	"MaLuotKham" serial4 NOT NULL,
	"MaTram" int4 NOT NULL,
	"NgayKham" date DEFAULT CURRENT_DATE NULL,
	"LoaiKham" varchar(50) NULL,
	"SoLuongBenhNhan" int4 DEFAULT 0 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "LuotKham_pkey" PRIMARY KEY ("MaLuotKham"),
	CONSTRAINT "LuotKham_MaTram_fkey" FOREIGN KEY ("MaTram") REFERENCES dashboard_xp."TramYTe"("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."LuotKham" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LuotKham" TO postgres;


-- dashboard_xp."MucLucNganSach" definition

-- Drop table

-- DROP TABLE dashboard_xp."MucLucNganSach";

CREATE TABLE dashboard_xp."MucLucNganSach" (
	"MaMucLuc" varchar(20) NOT NULL,
	"TenMucLuc" varchar(200) NOT NULL,
	"MaMucLucCha" varchar(20) NULL,
	"Cap" int4 DEFAULT 1 NULL,
	"ThuTu" int4 DEFAULT 0 NULL,
	"TrangThai" bool DEFAULT true NULL,
	CONSTRAINT "MucLucNganSach_pkey" PRIMARY KEY ("MaMucLuc"),
	CONSTRAINT "MucLucNganSach_MaMucLucCha_fkey" FOREIGN KEY ("MaMucLucCha") REFERENCES dashboard_xp."MucLucNganSach"("MaMucLuc")
);

-- Permissions

ALTER TABLE dashboard_xp."MucLucNganSach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."MucLucNganSach" TO postgres;


-- dashboard_xp."NganSach" definition

-- Drop table

-- DROP TABLE dashboard_xp."NganSach";

CREATE TABLE dashboard_xp."NganSach" (
	"MaNganSach" serial4 NOT NULL,
	"Nam" int4 NOT NULL,
	"MaLinhVuc" int4 NULL,
	"TongDuToan" numeric(18) DEFAULT 0 NULL,
	"DaGiaiNgan" numeric(18) DEFAULT 0 NULL,
	"ConLai" numeric(18) DEFAULT 0 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang thực hiện'::character varying NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "NganSach_pkey" PRIMARY KEY ("MaNganSach"),
	CONSTRAINT "NganSach_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc")
);

-- Permissions

ALTER TABLE dashboard_xp."NganSach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NganSach" TO postgres;


-- dashboard_xp."NguoiDung" definition

-- Drop table

-- DROP TABLE dashboard_xp."NguoiDung";

CREATE TABLE dashboard_xp."NguoiDung" (
	"MaNguoiDung" serial4 NOT NULL,
	"TenDangNhap" varchar(50) NOT NULL,
	"MatKhau" varchar(255) NOT NULL,
	"HoVaTen" varchar(100) NOT NULL,
	"Email" varchar(100) NULL,
	"SoDienThoai" varchar(20) NULL,
	"AnhDaiDien" varchar(500) NULL,
	"MaVaiTro" int4 NOT NULL,
	"TrangThai" bool DEFAULT true NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"NgayCapNhat" timestamp NULL,
	"NguoiTao" int4 NULL,
	"IsDeleted" bool DEFAULT false NULL,
	"EmailVerificationOtp" varchar(6) NULL,
	"OtpExpiresAt" timestamp NULL,
	"EmailVerifiedAt" timestamp NULL,
	CONSTRAINT "NguoiDung_Email_check" CHECK ((("Email" IS NULL) OR (("Email")::text ~~ '%@%.%'::text))),
	CONSTRAINT "NguoiDung_SoDienThoai_check" CHECK ((("SoDienThoai" IS NULL) OR (length(("SoDienThoai")::text) >= 10))),
	CONSTRAINT "NguoiDung_TenDangNhap_key" UNIQUE ("TenDangNhap"),
	CONSTRAINT "NguoiDung_pkey" PRIMARY KEY ("MaNguoiDung"),
	CONSTRAINT "NguoiDung_MaVaiTro_fkey" FOREIGN KEY ("MaVaiTro") REFERENCES dashboard_xp."VaiTro"("MaVaiTro"),
	CONSTRAINT "NguoiDung_NguoiTao_fkey" FOREIGN KEY ("NguoiTao") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."NguoiDung" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NguoiDung" TO postgres;


-- dashboard_xp."NhanVienYTe" definition

-- Drop table

-- DROP TABLE dashboard_xp."NhanVienYTe";

CREATE TABLE dashboard_xp."NhanVienYTe" (
	"MaNhanVien" serial4 NOT NULL,
	"HoTen" varchar(150) NOT NULL,
	"NgaySinh" date NULL,
	"GioiTinh" varchar(10) NULL,
	"ChucDanh" varchar(50) NULL,
	"ChuyenMon" varchar(100) NULL,
	"SoDienThoai" varchar(20) NULL,
	"TrangThaiLamViec" varchar(50) DEFAULT 'Đang làm việc'::character varying NULL,
	"MaTram" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "NhanVienYTe_pkey" PRIMARY KEY ("MaNhanVien"),
	CONSTRAINT "NhanVienYTe_MaTram_fkey" FOREIGN KEY ("MaTram") REFERENCES dashboard_xp."TramYTe"("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."NhanVienYTe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NhanVienYTe" TO postgres;


-- dashboard_xp."NoThue" definition

-- Drop table

-- DROP TABLE dashboard_xp."NoThue";

CREATE TABLE dashboard_xp."NoThue" (
	"MaNo" serial4 NOT NULL,
	"MaHoKD" int4 NOT NULL,
	"SoTienNo" numeric(18) NOT NULL,
	"TrangThai" varchar(50) DEFAULT 'Chưa thanh toán'::character varying NULL,
	CONSTRAINT "NoThue_pkey" PRIMARY KEY ("MaNo"),
	CONSTRAINT "NoThue_MaHoKD_fkey" FOREIGN KEY ("MaHoKD") REFERENCES dashboard_xp."HoKinhDoanh"("MaHoKD")
);

-- Permissions

ALTER TABLE dashboard_xp."NoThue" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NoThue" TO postgres;


-- dashboard_xp."NoiDungSoHoaDiTich" definition

-- Drop table

-- DROP TABLE dashboard_xp."NoiDungSoHoaDiTich";

CREATE TABLE dashboard_xp."NoiDungSoHoaDiTich" (
	"MaNoiDung" serial4 NOT NULL,
	"MaDiTich" int4 NOT NULL,
	"TenNoiDung" varchar(200) NOT NULL,
	"LoaiNoiDung" varchar(50) NULL,
	"DuongDanFile" varchar(500) NULL,
	"MoTa" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"NguoiTao" int4 NULL,
	CONSTRAINT "NoiDungSoHoaDiTich_pkey" PRIMARY KEY ("MaNoiDung"),
	CONSTRAINT "NoiDungSoHoaDiTich_MaDiTich_fkey" FOREIGN KEY ("MaDiTich") REFERENCES dashboard_xp."DiTich"("MaDiTich"),
	CONSTRAINT "NoiDungSoHoaDiTich_NguoiTao_fkey" FOREIGN KEY ("NguoiTao") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."NoiDungSoHoaDiTich" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NoiDungSoHoaDiTich" TO postgres;


-- dashboard_xp."PhanAnhNguoiDan" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhanAnhNguoiDan";

CREATE TABLE dashboard_xp."PhanAnhNguoiDan" (
	"MaPhanAnh" serial4 NOT NULL,
	"HoTenNguoiGui" varchar(150) NOT NULL,
	"SoDienThoai" varchar(20) NULL,
	"DiaChi" varchar(255) NULL,
	"NoiDungPhanAnh" text NOT NULL,
	"HinhThucGui" varchar(50) NULL,
	"PhanLoai" varchar(100) NULL,
	"TrangThaiXuLy" varchar(50) DEFAULT 'Chờ xử lý'::character varying NULL,
	"NgayGui" date DEFAULT CURRENT_DATE NULL,
	"NgayPhanHoi" date NULL,
	"KetQuaXuLy" text NULL,
	"MaCanBo" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "PhanAnhNguoiDan_pkey" PRIMARY KEY ("MaPhanAnh"),
	CONSTRAINT "PhanAnhNguoiDan_MaCanBo_fkey" FOREIGN KEY ("MaCanBo") REFERENCES dashboard_xp."CanBoQuocPhong"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."PhanAnhNguoiDan" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhanAnhNguoiDan" TO postgres;


-- dashboard_xp."PhieuThu" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhieuThu";

CREATE TABLE dashboard_xp."PhieuThu" (
	"MaPhieuThu" varchar(20) NOT NULL,
	"TenKhoanThu" varchar(200) NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"NgayThu" date DEFAULT CURRENT_DATE NULL,
	"NguoiNop" varchar(100) NULL,
	"LoaiThu" varchar(50) NULL,
	"MaLinhVuc" int4 NULL,
	"GhiChu" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã thu'::character varying NULL,
	CONSTRAINT "PhieuThu_SoTien_check" CHECK (("SoTien" > (0)::numeric)),
	CONSTRAINT "PhieuThu_pkey" PRIMARY KEY ("MaPhieuThu"),
	CONSTRAINT "PhieuThu_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc")
);

-- Permissions

ALTER TABLE dashboard_xp."PhieuThu" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhieuThu" TO postgres;


-- dashboard_xp."PhieuThuGomRac" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhieuThuGomRac";

CREATE TABLE dashboard_xp."PhieuThuGomRac" (
	"MaPhieu" serial4 NOT NULL,
	"MaDiem" int4 NOT NULL,
	"MaDonVi" int4 NOT NULL,
	"NgayThuGom" date DEFAULT CURRENT_DATE NULL,
	"KhoiLuong" numeric(18, 2) NULL,
	"LoaiRac" varchar(50) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "PhieuThuGomRac_pkey" PRIMARY KEY ("MaPhieu"),
	CONSTRAINT "PhieuThuGomRac_MaDiem_fkey" FOREIGN KEY ("MaDiem") REFERENCES dashboard_xp."DiemThuGomRac"("MaDiem"),
	CONSTRAINT "PhieuThuGomRac_MaDonVi_fkey" FOREIGN KEY ("MaDonVi") REFERENCES dashboard_xp."DonViThuGomRac"("MaDonVi")
);

-- Permissions

ALTER TABLE dashboard_xp."PhieuThuGomRac" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhieuThuGomRac" TO postgres;


-- dashboard_xp."PhongBan" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhongBan";

CREATE TABLE dashboard_xp."PhongBan" (
	"MaPhongBan" serial4 NOT NULL,
	"TenPhongBan" varchar(100) NOT NULL,
	"MoTa" text NULL,
	"MaLinhVuc" int4 NULL,
	"TruongPhong" int4 NULL,
	"NgayThanhLap" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"TrangThai" bool DEFAULT true NULL,
	CONSTRAINT "PhongBan_TenPhongBan_key" UNIQUE ("TenPhongBan"),
	CONSTRAINT "PhongBan_pkey" PRIMARY KEY ("MaPhongBan"),
	CONSTRAINT "PhongBan_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "PhongBan_TruongPhong_fkey" FOREIGN KEY ("TruongPhong") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."PhongBan" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhongBan" TO postgres;


-- dashboard_xp."QuanHuyen" definition

-- Drop table

-- DROP TABLE dashboard_xp."QuanHuyen";

CREATE TABLE dashboard_xp."QuanHuyen" (
	"MaQuanHuyen" serial4 NOT NULL,
	"TenQuanHuyen" varchar(150) NOT NULL,
	"MaDVHC" varchar(20) NULL,
	CONSTRAINT "QuanHuyen_pkey" PRIMARY KEY ("MaQuanHuyen"),
	CONSTRAINT "QuanHuyen_MaDVHC_fkey" FOREIGN KEY ("MaDVHC") REFERENCES dashboard_xp."DonViHanhChinh"("MaDVHC")
);

-- Permissions

ALTER TABLE dashboard_xp."QuanHuyen" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."QuanHuyen" TO postgres;


-- dashboard_xp."QuanTriVien" definition

-- Drop table

-- DROP TABLE dashboard_xp."QuanTriVien";

CREATE TABLE dashboard_xp."QuanTriVien" (
	"MaAdmin" serial4 NOT NULL,
	"MaNguoiDung" int4 NOT NULL,
	"MaCapDo" int4 NULL,
	"NgayNhanViec" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"GhiChu" text NULL,
	CONSTRAINT "QuanTriVien_MaNguoiDung_key" UNIQUE ("MaNguoiDung"),
	CONSTRAINT "QuanTriVien_pkey" PRIMARY KEY ("MaAdmin"),
	CONSTRAINT "QuanTriVien_MaCapDo_fkey" FOREIGN KEY ("MaCapDo") REFERENCES dashboard_xp."CapDoQuyen"("MaCapDo"),
	CONSTRAINT "QuanTriVien_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."QuanTriVien" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."QuanTriVien" TO postgres;


-- dashboard_xp."QuyHoach" definition

-- Drop table

-- DROP TABLE dashboard_xp."QuyHoach";

CREATE TABLE dashboard_xp."QuyHoach" (
	"MaQuyHoach" serial4 NOT NULL,
	"TenQuyHoach" varchar(200) NOT NULL,
	"MaLoaiQH" int4 NULL,
	"DiaChi" varchar(255) NULL,
	"DienTich" numeric(18, 2) NULL,
	"ThoiGianThucHien" varchar(100) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang thực hiện'::character varying NULL,
	"FileBanDo" varchar(500) NULL,
	"MoTa" text NULL,
	"NgayPheDuyet" date NULL,
	CONSTRAINT "QuyHoach_pkey" PRIMARY KEY ("MaQuyHoach"),
	CONSTRAINT "QuyHoach_MaLoaiQH_fkey" FOREIGN KEY ("MaLoaiQH") REFERENCES dashboard_xp."LoaiQuyHoach"("MaLoaiQH")
);

-- Permissions

ALTER TABLE dashboard_xp."QuyHoach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."QuyHoach" TO postgres;


-- dashboard_xp."QuyetDinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."QuyetDinh";

CREATE TABLE dashboard_xp."QuyetDinh" (
	"MaQD" serial4 NOT NULL,
	"SoQuyetDinh" varchar(50) NOT NULL,
	"TieuDe" varchar(200) NOT NULL,
	"MaLoaiQD" int4 NULL,
	"NgayBanHanh" date DEFAULT CURRENT_DATE NULL,
	"NguoiKy" int4 NULL,
	"NoiDung" text NULL,
	"FileDinhKem" varchar(500) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã ban hành'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "QuyetDinh_SoQuyetDinh_key" UNIQUE ("SoQuyetDinh"),
	CONSTRAINT "QuyetDinh_pkey" PRIMARY KEY ("MaQD"),
	CONSTRAINT "QuyetDinh_MaLoaiQD_fkey" FOREIGN KEY ("MaLoaiQD") REFERENCES dashboard_xp."LoaiQuyetDinh"("MaLoaiQD"),
	CONSTRAINT "QuyetDinh_NguoiKy_fkey" FOREIGN KEY ("NguoiKy") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."QuyetDinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."QuyetDinh" TO postgres;


-- dashboard_xp."RuiRoQuyHoach" definition

-- Drop table

-- DROP TABLE dashboard_xp."RuiRoQuyHoach";

CREATE TABLE dashboard_xp."RuiRoQuyHoach" (
	"MaRuiRo" serial4 NOT NULL,
	"MaQuyHoach" int4 NOT NULL,
	"MoTaRuiRo" text NOT NULL,
	"MucDoNghiemTrong" varchar(20) NULL,
	"NgayPhatHien" date DEFAULT CURRENT_DATE NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang xử lý'::character varying NULL,
	"BienPhapXuLy" text NULL,
	"NguoiPhatHien" int4 NULL,
	"NgayXuLyXong" date NULL,
	"GhiChu" text NULL,
	CONSTRAINT "RuiRoQuyHoach_pkey" PRIMARY KEY ("MaRuiRo"),
	CONSTRAINT "RuiRoQuyHoach_MaQuyHoach_fkey" FOREIGN KEY ("MaQuyHoach") REFERENCES dashboard_xp."QuyHoach"("MaQuyHoach"),
	CONSTRAINT "RuiRoQuyHoach_NguoiPhatHien_fkey" FOREIGN KEY ("NguoiPhatHien") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."RuiRoQuyHoach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."RuiRoQuyHoach" TO postgres;


-- dashboard_xp."RuiRoQuyHoach_AI" definition

-- Drop table

-- DROP TABLE dashboard_xp."RuiRoQuyHoach_AI";

CREATE TABLE dashboard_xp."RuiRoQuyHoach_AI" (
	"MaRuiRo" serial4 NOT NULL,
	"MaQuyHoach" int4 NOT NULL,
	"PhanTichAI" text NULL,
	"DiemRuiRo" float8 DEFAULT 0 NULL,
	"NgayPhanTich" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"DeXuat" text NULL,
	CONSTRAINT "RuiRoQuyHoach_AI_DiemRuiRo_check" CHECK ((("DiemRuiRo" >= (0)::double precision) AND ("DiemRuiRo" <= (100)::double precision))),
	CONSTRAINT "RuiRoQuyHoach_AI_pkey" PRIMARY KEY ("MaRuiRo"),
	CONSTRAINT "RuiRoQuyHoach_AI_MaQuyHoach_fkey" FOREIGN KEY ("MaQuyHoach") REFERENCES dashboard_xp."QuyHoach"("MaQuyHoach")
);

-- Permissions

ALTER TABLE dashboard_xp."RuiRoQuyHoach_AI" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."RuiRoQuyHoach_AI" TO postgres;


-- dashboard_xp."SanPhamOCOP" definition

-- Drop table

-- DROP TABLE dashboard_xp."SanPhamOCOP";

CREATE TABLE dashboard_xp."SanPhamOCOP" (
	"MaSanPham" serial4 NOT NULL,
	"TenSanPham" varchar(200) NOT NULL,
	"MaLangNghe" int4 NULL,
	"MoTa" text NULL,
	"XepHang" varchar(20) NULL,
	"GiaBan" numeric(18) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang bán'::character varying NULL,
	"HinhAnh" varchar(500) NULL,
	"NgayXepHang" date NULL,
	"GhiChu" text NULL,
	CONSTRAINT "SanPhamOCOP_pkey" PRIMARY KEY ("MaSanPham"),
	CONSTRAINT "SanPhamOCOP_MaLangNghe_fkey" FOREIGN KEY ("MaLangNghe") REFERENCES dashboard_xp."LangNghe"("MaLangNghe")
);

-- Permissions

ALTER TABLE dashboard_xp."SanPhamOCOP" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."SanPhamOCOP" TO postgres;


-- dashboard_xp."TaiSanCong" definition

-- Drop table

-- DROP TABLE dashboard_xp."TaiSanCong";

CREATE TABLE dashboard_xp."TaiSanCong" (
	"MaTaiSan" serial4 NOT NULL,
	"TenTaiSan" varchar(200) NOT NULL,
	"LoaiTaiSan" varchar(50) NULL,
	"NgayMua" date NULL,
	"GiaTri" numeric(18) NULL,
	"TinhTrang" varchar(50) DEFAULT 'Đang sử dụng'::character varying NULL,
	"ViTri" varchar(255) NULL,
	"NguoiQuanLy" int4 NULL,
	"NgayBaoTri" date NULL,
	"LanBaoTriKeTiep" date NULL,
	"MaLinhVuc" int4 NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "TaiSanCong_pkey" PRIMARY KEY ("MaTaiSan"),
	CONSTRAINT "TaiSanCong_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "TaiSanCong_NguoiQuanLy_fkey" FOREIGN KEY ("NguoiQuanLy") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."TaiSanCong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TaiSanCong" TO postgres;


-- dashboard_xp."TamTruTamVang" definition

-- Drop table

-- DROP TABLE dashboard_xp."TamTruTamVang";

CREATE TABLE dashboard_xp."TamTruTamVang" (
	"MaHoSo" serial4 NOT NULL,
	"HoTenNguoiKhaiBao" varchar(150) NOT NULL,
	"CCCD" varchar(20) NULL,
	"DiaChiThuongTru" varchar(255) NULL,
	"DiaChiTamTru" varchar(255) NULL,
	"LoaiDangKy" varchar(20) NULL,
	"TuNgay" date NULL,
	"DenNgay" date NULL,
	"TinhTrangHoSo" varchar(50) DEFAULT 'Chờ duyệt'::character varying NULL,
	"NgayKhaiBao" date DEFAULT CURRENT_DATE NULL,
	"MaCanBo" int4 NULL,
	CONSTRAINT "TamTruTamVang_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "TamTruTamVang_MaCanBo_fkey" FOREIGN KEY ("MaCanBo") REFERENCES dashboard_xp."CanBoQuocPhong"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."TamTruTamVang" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TamTruTamVang" TO postgres;


-- dashboard_xp."ThanhVienHoKhau" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThanhVienHoKhau";

CREATE TABLE dashboard_xp."ThanhVienHoKhau" (
	"MaThanhVien" serial4 NOT NULL,
	"MaHoKhau" varchar(20) NOT NULL,
	"HoTen" varchar(150) NOT NULL,
	"NgaySinh" date NULL,
	"GioiTinh" varchar(10) NULL,
	"CCCD" varchar(20) NULL,
	"QuanHeChuHo" varchar(50) NULL,
	"NgheNghiep" varchar(100) NULL,
	"NoiLamViec" varchar(200) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ThanhVienHoKhau_pkey" PRIMARY KEY ("MaThanhVien"),
	CONSTRAINT "ThanhVienHoKhau_MaHoKhau_fkey" FOREIGN KEY ("MaHoKhau") REFERENCES dashboard_xp."HoKhau"("MaHoKhau") ON DELETE CASCADE
);

-- Permissions

ALTER TABLE dashboard_xp."ThanhVienHoKhau" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThanhVienHoKhau" TO postgres;


-- dashboard_xp."ThanhVienHoTich" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThanhVienHoTich";

CREATE TABLE dashboard_xp."ThanhVienHoTich" (
	id serial4 NOT NULL,
	id_ho_tich int4 NOT NULL,
	so_cccd varchar(20) NULL,
	ho_ten varchar(150) NOT NULL,
	ngay_sinh date NULL,
	gioi_tinh varchar(10) NULL,
	quan_he_voi_chu_ho varchar(50) NULL,
	trang_thai bool DEFAULT true NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "ThanhVienHoTich_pkey" PRIMARY KEY (id),
	CONSTRAINT "ThanhVienHoTich_so_cccd_key" UNIQUE (so_cccd),
	CONSTRAINT "ThanhVienHoTich_id_ho_tich_fkey" FOREIGN KEY (id_ho_tich) REFERENCES dashboard_xp."HoTich"(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE dashboard_xp."ThanhVienHoTich" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThanhVienHoTich" TO postgres;


-- dashboard_xp."TheoDoiTratTuXayDung" definition

-- Drop table

-- DROP TABLE dashboard_xp."TheoDoiTratTuXayDung";

CREATE TABLE dashboard_xp."TheoDoiTratTuXayDung" (
	"MaTheoDoi" serial4 NOT NULL,
	"MaHoSo" int4 NOT NULL,
	"NgayKiemTra" date DEFAULT CURRENT_DATE NULL,
	"TinhTrang" varchar(50) NULL,
	"NhanXet" text NULL,
	"HinhAnh" varchar(500) NULL,
	CONSTRAINT "TheoDoiTratTuXayDung_pkey" PRIMARY KEY ("MaTheoDoi"),
	CONSTRAINT "TheoDoiTratTuXayDung_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoCapPhepXayDung"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."TheoDoiTratTuXayDung" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TheoDoiTratTuXayDung" TO postgres;


-- dashboard_xp."ThietBiYTe" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThietBiYTe";

CREATE TABLE dashboard_xp."ThietBiYTe" (
	"MaThietBi" serial4 NOT NULL,
	"TenThietBi" varchar(150) NOT NULL,
	"LoaiThietBi" varchar(50) NULL,
	"NgayMua" date NULL,
	"TinhTrang" varchar(50) DEFAULT 'Tốt'::character varying NULL,
	"MaTram" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ThietBiYTe_pkey" PRIMARY KEY ("MaThietBi"),
	CONSTRAINT "ThietBiYTe_MaTram_fkey" FOREIGN KEY ("MaTram") REFERENCES dashboard_xp."TramYTe"("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."ThietBiYTe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThietBiYTe" TO postgres;


-- dashboard_xp."ThuPhi" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThuPhi";

CREATE TABLE dashboard_xp."ThuPhi" (
	"MaThuPhi" serial4 NOT NULL,
	"TenKhoanThu" varchar(200) NOT NULL,
	"DoiTuongNop" varchar(150) NULL,
	"SoTien" numeric(18) NOT NULL,
	"NgayThu" date DEFAULT CURRENT_DATE NULL,
	"LoaiPhi" varchar(50) NULL,
	"MaLinhVuc" int4 NULL,
	"NguoiThu" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã thu'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ThuPhi_pkey" PRIMARY KEY ("MaThuPhi"),
	CONSTRAINT "ThuPhi_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "ThuPhi_NguoiThu_fkey" FOREIGN KEY ("NguoiThu") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."ThuPhi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThuPhi" TO postgres;


-- dashboard_xp."ThuaDat" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThuaDat";

CREATE TABLE dashboard_xp."ThuaDat" (
	"MaThua" varchar(20) NOT NULL,
	"SoThua" varchar(20) NOT NULL,
	"SoToBanDo" varchar(20) NULL,
	"DienTich" numeric(18, 2) NOT NULL,
	"MaLoaiDat" varchar(20) NULL,
	"ChuSoHuu" varchar(150) NULL,
	"ToaDo" varchar(100) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang sử dụng'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ThuaDat_DienTich_check" CHECK (("DienTich" > (0)::numeric)),
	CONSTRAINT "ThuaDat_pkey" PRIMARY KEY ("MaThua"),
	CONSTRAINT "ThuaDat_MaLoaiDat_fkey" FOREIGN KEY ("MaLoaiDat") REFERENCES dashboard_xp."LoaiDat"("MaLoaiDat")
);

-- Permissions

ALTER TABLE dashboard_xp."ThuaDat" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThuaDat" TO postgres;


-- dashboard_xp."ThueLePhi" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThueLePhi";

CREATE TABLE dashboard_xp."ThueLePhi" (
	"MaThue" serial4 NOT NULL,
	"MaHoKD" int4 NOT NULL,
	"TenKhoanThu" varchar(150) NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"KyThanhToan" varchar(20) NULL,
	"TrangThai" varchar(50) DEFAULT 'Chưa thanh toán'::character varying NULL,
	CONSTRAINT "ThueLePhi_pkey" PRIMARY KEY ("MaThue"),
	CONSTRAINT "ThueLePhi_MaHoKD_fkey" FOREIGN KEY ("MaHoKD") REFERENCES dashboard_xp."HoKinhDoanh"("MaHoKD")
);

-- Permissions

ALTER TABLE dashboard_xp."ThueLePhi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThueLePhi" TO postgres;


-- dashboard_xp."TiemChung" definition

-- Drop table

-- DROP TABLE dashboard_xp."TiemChung";

CREATE TABLE dashboard_xp."TiemChung" (
	"MaTiemChung" serial4 NOT NULL,
	"TenDot" varchar(150) NOT NULL,
	"LoaiVacxin" varchar(100) NULL,
	"NgayBatDau" date NULL,
	"NgayKetThuc" date NULL,
	"SoLuongDaTiem" int4 DEFAULT 0 NULL,
	"SoLuongKeHoach" int4 NULL,
	"MaTram" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang triển khai'::character varying NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "TiemChung_pkey" PRIMARY KEY ("MaTiemChung"),
	CONSTRAINT "TiemChung_MaTram_fkey" FOREIGN KEY ("MaTram") REFERENCES dashboard_xp."TramYTe"("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."TiemChung" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TiemChung" TO postgres;


-- dashboard_xp."TinhHinhANTT" definition

-- Drop table

-- DROP TABLE dashboard_xp."TinhHinhANTT";

CREATE TABLE dashboard_xp."TinhHinhANTT" (
	"MaANTT" serial4 NOT NULL,
	"MaKhuDanCu" int4 NOT NULL,
	"MoTa" text NULL,
	"MucDoNguyCo" varchar(20) NULL,
	"ThoiGianBaoCao" date DEFAULT CURRENT_DATE NULL,
	"SoSuKien" int4 DEFAULT 0 NULL,
	"SoNguoiBiHai" int4 DEFAULT 0 NULL,
	CONSTRAINT "TinhHinhANTT_pkey" PRIMARY KEY ("MaANTT"),
	CONSTRAINT "TinhHinhANTT_MaKhuDanCu_fkey" FOREIGN KEY ("MaKhuDanCu") REFERENCES dashboard_xp."KhuDanCu"("MaKhuDanCu")
);

-- Permissions

ALTER TABLE dashboard_xp."TinhHinhANTT" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TinhHinhANTT" TO postgres;


-- dashboard_xp."VanBan" definition

-- Drop table

-- DROP TABLE dashboard_xp."VanBan";

CREATE TABLE dashboard_xp."VanBan" (
	"MaVanBan" serial4 NOT NULL,
	"SoKyHieu" varchar(50) NOT NULL,
	"TrichYeu" varchar(500) NOT NULL,
	"LoaiVanBan" varchar(50) NOT NULL,
	"LoaiVB" varchar(100) NULL,
	"CoQuanBanHanh" varchar(200) NULL,
	"NgayBanHanh" date NULL,
	"NgayDen" date NULL,
	"MaLinhVuc" int4 NULL,
	"NguoiXuLy" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Mới'::character varying NULL,
	"FileDinhKem" varchar(500) NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "VanBan_pkey" PRIMARY KEY ("MaVanBan"),
	CONSTRAINT "VanBan_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "VanBan_NguoiXuLy_fkey" FOREIGN KEY ("NguoiXuLy") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."VanBan" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."VanBan" TO postgres;


-- dashboard_xp."ViPham" definition

-- Drop table

-- DROP TABLE dashboard_xp."ViPham";

CREATE TABLE dashboard_xp."ViPham" (
	"MaViPham" serial4 NOT NULL,
	"TenViPham" varchar(200) NOT NULL,
	"LoaiViPham" varchar(50) NULL,
	"DiaDiem" varchar(255) NULL,
	"NgayViPham" date DEFAULT CURRENT_DATE NULL,
	"NguoiViPham" varchar(150) NULL,
	"MucPhat" numeric(18) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã xử lý'::character varying NULL,
	"GhiChu" text NULL,
	"NguoiLap" int4 NULL,
	CONSTRAINT "ViPham_pkey" PRIMARY KEY ("MaViPham"),
	CONSTRAINT "ViPham_NguoiLap_fkey" FOREIGN KEY ("NguoiLap") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."ViPham" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ViPham" TO postgres;


-- dashboard_xp."ViPhamHanhChinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."ViPhamHanhChinh";

CREATE TABLE dashboard_xp."ViPhamHanhChinh" (
	"MaViPham" serial4 NOT NULL,
	"HoTenNguoiViPham" varchar(150) NOT NULL,
	"HanhViViPham" text NOT NULL,
	"HinhThucXuLy" varchar(100) NULL,
	"TrangThaiXuLy" varchar(50) DEFAULT 'Chờ xử lý'::character varying NULL,
	"NgayViPham" date DEFAULT CURRENT_DATE NULL,
	"MucPhat" numeric(18) DEFAULT 0 NULL,
	"MaCanBo" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ViPhamHanhChinh_pkey" PRIMARY KEY ("MaViPham"),
	CONSTRAINT "ViPhamHanhChinh_MaCanBo_fkey" FOREIGN KEY ("MaCanBo") REFERENCES dashboard_xp."CanBoQuocPhong"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."ViPhamHanhChinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ViPhamHanhChinh" TO postgres;


-- dashboard_xp."XaPhuong" definition

-- Drop table

-- DROP TABLE dashboard_xp."XaPhuong";

CREATE TABLE dashboard_xp."XaPhuong" (
	"MaXaPhuong" serial4 NOT NULL,
	"TenXaPhuong" varchar(150) NOT NULL,
	"MaQuanHuyen" int4 NULL,
	"DanSo" int4 DEFAULT 0 NULL,
	"DienTich" numeric(18, 2) NULL,
	"MaDVHC" varchar(20) NULL,
	CONSTRAINT "XaPhuong_pkey" PRIMARY KEY ("MaXaPhuong"),
	CONSTRAINT "XaPhuong_MaDVHC_fkey" FOREIGN KEY ("MaDVHC") REFERENCES dashboard_xp."DonViHanhChinh"("MaDVHC"),
	CONSTRAINT "XaPhuong_MaQuanHuyen_fkey" FOREIGN KEY ("MaQuanHuyen") REFERENCES dashboard_xp."QuanHuyen"("MaQuanHuyen")
);

-- Permissions

ALTER TABLE dashboard_xp."XaPhuong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."XaPhuong" TO postgres;


-- dashboard_xp."XayDungTraiPhep" definition

-- Drop table

-- DROP TABLE dashboard_xp."XayDungTraiPhep";

CREATE TABLE dashboard_xp."XayDungTraiPhep" (
	"MaViPham" serial4 NOT NULL,
	"DiaDiem" varchar(255) NOT NULL,
	"ChuSoHuu" varchar(150) NULL,
	"DienTich" numeric(18, 2) NULL,
	"NgayPhatHien" date DEFAULT CURRENT_DATE NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã phát hiện'::character varying NULL,
	"MaCanBo" int4 NULL,
	CONSTRAINT "XayDungTraiPhep_pkey" PRIMARY KEY ("MaViPham"),
	CONSTRAINT "XayDungTraiPhep_MaCanBo_fkey" FOREIGN KEY ("MaCanBo") REFERENCES dashboard_xp."CanBoXayDung"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."XayDungTraiPhep" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."XayDungTraiPhep" TO postgres;


-- dashboard_xp.user_sessions definition

-- Drop table

-- DROP TABLE dashboard_xp.user_sessions;

CREATE TABLE dashboard_xp.user_sessions (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id int4 NOT NULL,
	refresh_token_hash text NOT NULL,
	user_agent varchar(500) NULL,
	ip_address varchar(45) NULL,
	expires_at timestamp NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
	CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung") ON DELETE CASCADE
);
CREATE INDEX "IDX_user_sessions_user_id" ON dashboard_xp.user_sessions USING btree (user_id);

-- Permissions

ALTER TABLE dashboard_xp.user_sessions OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp.user_sessions TO postgres;


-- dashboard_xp."BaoCao" definition

-- Drop table

-- DROP TABLE dashboard_xp."BaoCao";

CREATE TABLE dashboard_xp."BaoCao" (
	"MaBaoCao" serial4 NOT NULL,
	"TieuDe" varchar(200) NOT NULL,
	"LoaiBaoCao" varchar(100) NULL,
	"MaLinhVuc" int4 NULL,
	"NoiDung" text NULL,
	"NgayLap" date DEFAULT CURRENT_DATE NULL,
	"NguoiLap" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã hoàn thành'::character varying NULL,
	"FileDinhKem" varchar(500) NULL,
	"GhiChu" text NULL,
	"ThangNam" varchar(7) NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "BaoCao_pkey" PRIMARY KEY ("MaBaoCao"),
	CONSTRAINT "BaoCao_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "BaoCao_NguoiLap_fkey" FOREIGN KEY ("NguoiLap") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."BaoCao" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BaoCao" TO postgres;


-- dashboard_xp."BaoCaoONhiem" definition

-- Drop table

-- DROP TABLE dashboard_xp."BaoCaoONhiem";

CREATE TABLE dashboard_xp."BaoCaoONhiem" (
	"MaBaoCao" serial4 NOT NULL,
	"LoaiONhiem" varchar(50) NOT NULL,
	"KhuVuc" varchar(150) NULL,
	"MucDo" varchar(20) NULL,
	"NgayBaoCao" date DEFAULT CURRENT_DATE NULL,
	"NoiDung" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Chờ xử lý'::character varying NULL,
	"NguoiBaoCao" int4 NULL,
	CONSTRAINT "BaoCaoONhiem_pkey" PRIMARY KEY ("MaBaoCao"),
	CONSTRAINT "BaoCaoONhiem_NguoiBaoCao_fkey" FOREIGN KEY ("NguoiBaoCao") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."BaoCaoONhiem" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BaoCaoONhiem" TO postgres;


-- dashboard_xp."BaoTriThietBi" definition

-- Drop table

-- DROP TABLE dashboard_xp."BaoTriThietBi";

CREATE TABLE dashboard_xp."BaoTriThietBi" (
	"MaBaoTri" serial4 NOT NULL,
	"MaThietBi" int4 NOT NULL,
	"NgayBaoTri" date DEFAULT CURRENT_DATE NULL,
	"NoiDung" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Hoàn thành'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "BaoTriThietBi_pkey" PRIMARY KEY ("MaBaoTri"),
	CONSTRAINT "BaoTriThietBi_MaThietBi_fkey" FOREIGN KEY ("MaThietBi") REFERENCES dashboard_xp."ThietBiYTe"("MaThietBi")
);

-- Permissions

ALTER TABLE dashboard_xp."BaoTriThietBi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BaoTriThietBi" TO postgres;


-- dashboard_xp."BienDongDat" definition

-- Drop table

-- DROP TABLE dashboard_xp."BienDongDat";

CREATE TABLE dashboard_xp."BienDongDat" (
	"MaBienDong" serial4 NOT NULL,
	"MaThua" varchar(20) NOT NULL,
	"LoaiBienDong" varchar(50) NOT NULL,
	"NgayBienDong" date DEFAULT CURRENT_DATE NULL,
	"DienTichCu" numeric(18, 2) NULL,
	"DienTichMoi" numeric(18, 2) NULL,
	"MaLoaiDatCu" varchar(20) NULL,
	"MaLoaiDatMoi" varchar(20) NULL,
	"LyDo" text NULL,
	"NguoiThucHien" int4 NULL,
	CONSTRAINT "BienDongDat_pkey" PRIMARY KEY ("MaBienDong"),
	CONSTRAINT "BienDongDat_MaLoaiDatCu_fkey" FOREIGN KEY ("MaLoaiDatCu") REFERENCES dashboard_xp."LoaiDat"("MaLoaiDat"),
	CONSTRAINT "BienDongDat_MaLoaiDatMoi_fkey" FOREIGN KEY ("MaLoaiDatMoi") REFERENCES dashboard_xp."LoaiDat"("MaLoaiDat"),
	CONSTRAINT "BienDongDat_MaThua_fkey" FOREIGN KEY ("MaThua") REFERENCES dashboard_xp."ThuaDat"("MaThua"),
	CONSTRAINT "BienDongDat_NguoiThucHien_fkey" FOREIGN KEY ("NguoiThucHien") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."BienDongDat" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BienDongDat" TO postgres;


-- dashboard_xp."CanBo" definition

-- Drop table

-- DROP TABLE dashboard_xp."CanBo";

CREATE TABLE dashboard_xp."CanBo" (
	"MaCanBo" serial4 NOT NULL,
	"MaNguoiDung" int4 NOT NULL,
	"MaPhongBan" int4 NULL,
	"MaLinhVuc" int4 NULL,
	"ChucDanh" varchar(50) NULL,
	"DiemKPI" float8 DEFAULT 0 NULL,
	"NgayBatDau" date DEFAULT CURRENT_DATE NULL,
	"IsDeleted" bool DEFAULT false NULL,
	CONSTRAINT "CanBo_DiemKPI_check" CHECK ((("DiemKPI" >= (0)::double precision) AND ("DiemKPI" <= (100)::double precision))),
	CONSTRAINT "CanBo_MaNguoiDung_key" UNIQUE ("MaNguoiDung"),
	CONSTRAINT "CanBo_pkey" PRIMARY KEY ("MaCanBo"),
	CONSTRAINT "CanBo_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "CanBo_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung"),
	CONSTRAINT "CanBo_MaPhongBan_fkey" FOREIGN KEY ("MaPhongBan") REFERENCES dashboard_xp."PhongBan"("MaPhongBan")
);

-- Permissions

ALTER TABLE dashboard_xp."CanBo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CanBo" TO postgres;


-- dashboard_xp."ChungThuc" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChungThuc";

CREATE TABLE dashboard_xp."ChungThuc" (
	"MaChungThuc" serial4 NOT NULL,
	"SoChungThuc" varchar(50) NOT NULL,
	"LoaiGiayTo" varchar(100) NOT NULL,
	"NguoiYeuCau" varchar(150) NOT NULL,
	"CCCD" varchar(20) NULL,
	"NgayYeuCau" date DEFAULT CURRENT_DATE NULL,
	"NgayHoanThanh" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang xử lý'::character varying NULL,
	"NguoiXuLy" int4 NULL,
	"PhiDichVu" numeric(18) DEFAULT 0 NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "ChungThuc_pkey" PRIMARY KEY ("MaChungThuc"),
	CONSTRAINT "ChungThuc_NguoiXuLy_fkey" FOREIGN KEY ("NguoiXuLy") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."ChungThuc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChungThuc" TO postgres;


-- dashboard_xp."CongDan" definition

-- Drop table

-- DROP TABLE dashboard_xp."CongDan";

CREATE TABLE dashboard_xp."CongDan" (
	"MaCongDan" serial4 NOT NULL,
	"MaNguoiDung" int4 NULL,
	"SoCCCD" varchar(20) NOT NULL,
	"HoTen" varchar(100) NOT NULL,
	"NgaySinh" date NULL,
	"GioiTinh" varchar(10) NULL,
	"DiaChiThuongTru" varchar(255) NULL,
	"DiaChiTamTru" varchar(255) NULL,
	"ToaDoNha" varchar(50) NULL,
	"NgayDangKy" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "CongDan_GioiTinh_check" CHECK ((("GioiTinh" IS NULL) OR (("GioiTinh")::text = ANY ((ARRAY['Nam'::character varying, 'Nữ'::character varying, 'Khác'::character varying])::text[])))),
	CONSTRAINT "CongDan_MaNguoiDung_key" UNIQUE ("MaNguoiDung"),
	CONSTRAINT "CongDan_SoCCCD_key" UNIQUE ("SoCCCD"),
	CONSTRAINT "CongDan_pkey" PRIMARY KEY ("MaCongDan"),
	CONSTRAINT "CongDan_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."CongDan" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CongDan" TO postgres;


-- dashboard_xp."CongTrinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."CongTrinh";

CREATE TABLE dashboard_xp."CongTrinh" (
	"MaCongTrinh" serial4 NOT NULL,
	"TenCongTrinh" varchar(200) NOT NULL,
	"DiaDiem" varchar(255) NULL,
	"MaLoaiCT" int4 NULL,
	"ChuDauTu" varchar(150) NULL,
	"DienTich" numeric(18, 2) NULL,
	"TongMucDauTu" numeric(18) NULL,
	"NgayKhoiCong" date NULL,
	"NgayHoanThanh" date NULL,
	"TinhTrang" varchar(50) DEFAULT 'Đang thi công'::character varying NULL,
	"GhiChu" text NULL,
	"MaXaPhuong" int4 NULL,
	CONSTRAINT "CongTrinh_pkey" PRIMARY KEY ("MaCongTrinh"),
	CONSTRAINT "CongTrinh_MaLoaiCT_fkey" FOREIGN KEY ("MaLoaiCT") REFERENCES dashboard_xp."LoaiCongTrinh"("MaLoaiCT"),
	CONSTRAINT "CongTrinh_MaXaPhuong_fkey" FOREIGN KEY ("MaXaPhuong") REFERENCES dashboard_xp."XaPhuong"("MaXaPhuong")
);

-- Permissions

ALTER TABLE dashboard_xp."CongTrinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CongTrinh" TO postgres;


-- dashboard_xp."DangKyThiCong" definition

-- Drop table

-- DROP TABLE dashboard_xp."DangKyThiCong";

CREATE TABLE dashboard_xp."DangKyThiCong" (
	"MaDKTC" serial4 NOT NULL,
	"MaCongTrinh" int4 NOT NULL,
	"NgayDangKy" date DEFAULT CURRENT_DATE NULL,
	"DonViThiCong" varchar(200) NULL,
	"GiamSatThiCong" varchar(200) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã đăng ký'::character varying NULL,
	CONSTRAINT "DangKyThiCong_pkey" PRIMARY KEY ("MaDKTC"),
	CONSTRAINT "DangKyThiCong_MaCongTrinh_fkey" FOREIGN KEY ("MaCongTrinh") REFERENCES dashboard_xp."CongTrinh"("MaCongTrinh")
);

-- Permissions

ALTER TABLE dashboard_xp."DangKyThiCong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DangKyThiCong" TO postgres;


-- dashboard_xp."DiemDanhLop" definition

-- Drop table

-- DROP TABLE dashboard_xp."DiemDanhLop";

CREATE TABLE dashboard_xp."DiemDanhLop" (
	"MaDiemDanh" serial4 NOT NULL,
	"MaLop" int4 NOT NULL,
	"Ngay" date DEFAULT CURRENT_DATE NULL,
	"SoHocSinhCoMat" int4 DEFAULT 0 NULL,
	"SoHocSinhVangMat" int4 DEFAULT 0 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "DiemDanhLop_MaLop_Ngay_key" UNIQUE ("MaLop", "Ngay"),
	CONSTRAINT "DiemDanhLop_pkey" PRIMARY KEY ("MaDiemDanh"),
	CONSTRAINT "DiemDanhLop_MaLop_fkey" FOREIGN KEY ("MaLop") REFERENCES dashboard_xp."LopHoc"("MaLop")
);

-- Permissions

ALTER TABLE dashboard_xp."DiemDanhLop" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DiemDanhLop" TO postgres;


-- dashboard_xp."DoiTuongBaoTro" definition

-- Drop table

-- DROP TABLE dashboard_xp."DoiTuongBaoTro";

CREATE TABLE dashboard_xp."DoiTuongBaoTro" (
	"MaDoiTuong" serial4 NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"LoaiDoiTuong" varchar(100) NOT NULL,
	"MucTroCapThang" numeric(18) NULL,
	"TuNgay" date NULL,
	"DenNgay" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hỗ trợ'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "DoiTuongBaoTro_MaCongDan_key" UNIQUE ("MaCongDan"),
	CONSTRAINT "DoiTuongBaoTro_pkey" PRIMARY KEY ("MaDoiTuong"),
	CONSTRAINT "DoiTuongBaoTro_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan")
);

-- Permissions

ALTER TABLE dashboard_xp."DoiTuongBaoTro" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DoiTuongBaoTro" TO postgres;


-- dashboard_xp."GhiChuNganSach" definition

-- Drop table

-- DROP TABLE dashboard_xp."GhiChuNganSach";

CREATE TABLE dashboard_xp."GhiChuNganSach" (
	"MaGhiChu" serial4 NOT NULL,
	"MaNganSach" int4 NOT NULL,
	"NoiDungGhiChu" text NOT NULL,
	"NgayGhiChu" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"NguoiGhiChu" int4 NULL,
	CONSTRAINT "GhiChuNganSach_pkey" PRIMARY KEY ("MaGhiChu"),
	CONSTRAINT "GhiChuNganSach_MaNganSach_fkey" FOREIGN KEY ("MaNganSach") REFERENCES dashboard_xp."NganSach"("MaNganSach"),
	CONSTRAINT "GhiChuNganSach_NguoiGhiChu_fkey" FOREIGN KEY ("NguoiGhiChu") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."GhiChuNganSach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."GhiChuNganSach" TO postgres;


-- dashboard_xp."HoGiaDinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoGiaDinh";

CREATE TABLE dashboard_xp."HoGiaDinh" (
	"MaHGD" serial4 NOT NULL,
	"SoHoKhau" varchar(20) NOT NULL,
	"ChuHo" varchar(150) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"SoThanhVien" int4 DEFAULT 0 NULL,
	"MaXaPhuong" int4 NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "HoGiaDinh_SoHoKhau_key" UNIQUE ("SoHoKhau"),
	CONSTRAINT "HoGiaDinh_pkey" PRIMARY KEY ("MaHGD"),
	CONSTRAINT "HoGiaDinh_MaXaPhuong_fkey" FOREIGN KEY ("MaXaPhuong") REFERENCES dashboard_xp."XaPhuong"("MaXaPhuong")
);

-- Permissions

ALTER TABLE dashboard_xp."HoGiaDinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoGiaDinh" TO postgres;


-- dashboard_xp."HoKDTrongCho" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoKDTrongCho";

CREATE TABLE dashboard_xp."HoKDTrongCho" (
	"Ma" serial4 NOT NULL,
	"MaHoKD" int4 NOT NULL,
	"MaLo" int4 NOT NULL,
	"NgayBatDau" date DEFAULT CURRENT_DATE NULL,
	CONSTRAINT "HoKDTrongCho_pkey" PRIMARY KEY ("Ma"),
	CONSTRAINT "HoKDTrongCho_MaHoKD_fkey" FOREIGN KEY ("MaHoKD") REFERENCES dashboard_xp."HoKinhDoanh"("MaHoKD"),
	CONSTRAINT "HoKDTrongCho_MaLo_fkey" FOREIGN KEY ("MaLo") REFERENCES dashboard_xp."LoSapCho"("MaLo")
);

-- Permissions

ALTER TABLE dashboard_xp."HoKDTrongCho" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoKDTrongCho" TO postgres;


-- dashboard_xp."HoNgheo" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoNgheo";

CREATE TABLE dashboard_xp."HoNgheo" (
	"MaHoNgheo" serial4 NOT NULL,
	"MaHGD" int4 NOT NULL,
	"CapDoNgheo" varchar(50) NULL,
	"ThuNhapBinhQuan" numeric(18) NULL,
	"LyDo" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hỗ trợ'::character varying NULL,
	"NamXetDuyet" int4 NULL,
	"NgayCapNhat" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "HoNgheo_CapDoNgheo_check" CHECK ((("CapDoNgheo" IS NULL) OR (("CapDoNgheo")::text = ANY ((ARRAY['Hộ nghèo'::character varying, 'Cận nghèo'::character varying])::text[])))),
	CONSTRAINT "HoNgheo_MaHGD_key" UNIQUE ("MaHGD"),
	CONSTRAINT "HoNgheo_pkey" PRIMARY KEY ("MaHoNgheo"),
	CONSTRAINT "HoNgheo_MaHGD_fkey" FOREIGN KEY ("MaHGD") REFERENCES dashboard_xp."HoGiaDinh"("MaHGD")
);

-- Permissions

ALTER TABLE dashboard_xp."HoNgheo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoNgheo" TO postgres;


-- dashboard_xp."HoSoCapGCN" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoSoCapGCN";

CREATE TABLE dashboard_xp."HoSoCapGCN" (
	"MaHoSo" varchar(20) NOT NULL,
	"MaThua" varchar(20) NOT NULL,
	"NguoiDeNghi" varchar(150) NOT NULL,
	"NgayNop" date DEFAULT CURRENT_DATE NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang xử lý'::character varying NULL,
	"SoGCN" varchar(50) NULL,
	"NgayCap" date NULL,
	"NguoiXuLy" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "HoSoCapGCN_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "HoSoCapGCN_MaThua_fkey" FOREIGN KEY ("MaThua") REFERENCES dashboard_xp."ThuaDat"("MaThua"),
	CONSTRAINT "HoSoCapGCN_NguoiXuLy_fkey" FOREIGN KEY ("NguoiXuLy") REFERENCES dashboard_xp."CanBo"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."HoSoCapGCN" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoSoCapGCN" TO postgres;


-- dashboard_xp."HoSoDiTich" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoSoDiTich";

CREATE TABLE dashboard_xp."HoSoDiTich" (
	"MaHoSo" serial4 NOT NULL,
	"MaDiTich" int4 NOT NULL,
	"LoaiHoSo" varchar(100) NULL,
	"NoiDung" text NULL,
	"NgayLap" date DEFAULT CURRENT_DATE NULL,
	"NguoiLap" int4 NULL,
	CONSTRAINT "HoSoDiTich_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "HoSoDiTich_MaDiTich_fkey" FOREIGN KEY ("MaDiTich") REFERENCES dashboard_xp."DiTich"("MaDiTich"),
	CONSTRAINT "HoSoDiTich_NguoiLap_fkey" FOREIGN KEY ("NguoiLap") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."HoSoDiTich" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoSoDiTich" TO postgres;


-- dashboard_xp."HoSoTTHC" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoSoTTHC";

CREATE TABLE dashboard_xp."HoSoTTHC" (
	"MaHoSo" varchar(20) NOT NULL,
	"SoHoSo" varchar(50) NOT NULL,
	"MaLoaiThuTuc" int4 NOT NULL,
	"NguoiNop" varchar(150) NOT NULL,
	"SoDienThoai" varchar(20) NULL,
	"Email" varchar(100) NULL,
	"NgayNop" date DEFAULT CURRENT_DATE NULL,
	"NgayHenTra" date NULL,
	"NgayHoanThanh" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã tiếp nhận'::character varying NULL,
	"CanBoXuLy" int4 NULL,
	"KetQua" text NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "HoSoTTHC_TrangThai_check" CHECK ((("TrangThai")::text = ANY ((ARRAY['Đã tiếp nhận'::character varying, 'Đang xử lý'::character varying, 'Chờ bổ sung'::character varying, 'Hoàn thành'::character varying, 'Từ chối'::character varying])::text[]))),
	CONSTRAINT "HoSoTTHC_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "HoSoTTHC_CanBoXuLy_fkey" FOREIGN KEY ("CanBoXuLy") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung"),
	CONSTRAINT "HoSoTTHC_MaLoaiThuTuc_fkey" FOREIGN KEY ("MaLoaiThuTuc") REFERENCES dashboard_xp."LoaiThuTuc"("MaLoaiThuTuc")
);

-- Permissions

ALTER TABLE dashboard_xp."HoSoTTHC" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoSoTTHC" TO postgres;


-- dashboard_xp."HuongChinhSachHoNgheo" definition

-- Drop table

-- DROP TABLE dashboard_xp."HuongChinhSachHoNgheo";

CREATE TABLE dashboard_xp."HuongChinhSachHoNgheo" (
	"MaHuong" serial4 NOT NULL,
	"MaHoNgheo" int4 NOT NULL,
	"TenChinhSach" varchar(200) NOT NULL,
	"GiaTriHoTro" numeric(18) NULL,
	"NgayNhan" date NULL,
	"GhiChu" text NULL,
	CONSTRAINT "HuongChinhSachHoNgheo_pkey" PRIMARY KEY ("MaHuong"),
	CONSTRAINT "HuongChinhSachHoNgheo_MaHoNgheo_fkey" FOREIGN KEY ("MaHoNgheo") REFERENCES dashboard_xp."HoNgheo"("MaHoNgheo")
);

-- Permissions

ALTER TABLE dashboard_xp."HuongChinhSachHoNgheo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HuongChinhSachHoNgheo" TO postgres;


-- dashboard_xp."KPI_CanBo_Thang" definition

-- Drop table

-- DROP TABLE dashboard_xp."KPI_CanBo_Thang";

CREATE TABLE dashboard_xp."KPI_CanBo_Thang" (
	"ThangNam" varchar(7) NOT NULL,
	"MaCanBo" int4 NOT NULL,
	"TongHoSoXuLy" int4 DEFAULT 0 NULL,
	"HoSoDungHan" int4 DEFAULT 0 NULL,
	"HoSoTreHan" int4 DEFAULT 0 NULL,
	"TyLeDungHan" float8 DEFAULT 0 NULL,
	"DiemDanhGia" float8 DEFAULT 0 NULL,
	"SoPhanAnh" int4 DEFAULT 0 NULL,
	"SoPhanAnhDaXuLy" int4 DEFAULT 0 NULL,
	CONSTRAINT "KPI_CanBo_Thang_DiemDanhGia_check" CHECK ((("DiemDanhGia" >= (0)::double precision) AND ("DiemDanhGia" <= (100)::double precision))),
	CONSTRAINT "KPI_CanBo_Thang_ThangNam_check" CHECK ((("ThangNam")::text ~~ '____-__'::text)),
	CONSTRAINT "KPI_CanBo_Thang_TyLeDungHan_check" CHECK ((("TyLeDungHan" >= (0)::double precision) AND ("TyLeDungHan" <= (1)::double precision))),
	CONSTRAINT "KPI_CanBo_Thang_pkey" PRIMARY KEY ("ThangNam", "MaCanBo"),
	CONSTRAINT "KPI_CanBo_Thang_MaCanBo_fkey" FOREIGN KEY ("MaCanBo") REFERENCES dashboard_xp."CanBo"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."KPI_CanBo_Thang" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."KPI_CanBo_Thang" TO postgres;


-- dashboard_xp."KeHoachLeHoi" definition

-- Drop table

-- DROP TABLE dashboard_xp."KeHoachLeHoi";

CREATE TABLE dashboard_xp."KeHoachLeHoi" (
	"MaKeHoach" serial4 NOT NULL,
	"MaLeHoi" int4 NOT NULL,
	"NoiDung" text NOT NULL,
	"DuKinhPhi" numeric(18) NULL,
	"NguoiPhuTrach" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã lập'::character varying NULL,
	"NgayLap" date DEFAULT CURRENT_DATE NULL,
	"GhiChu" text NULL,
	CONSTRAINT "KeHoachLeHoi_pkey" PRIMARY KEY ("MaKeHoach"),
	CONSTRAINT "KeHoachLeHoi_MaLeHoi_fkey" FOREIGN KEY ("MaLeHoi") REFERENCES dashboard_xp."LeHoi"("MaLeHoi"),
	CONSTRAINT "KeHoachLeHoi_NguoiPhuTrach_fkey" FOREIGN KEY ("NguoiPhuTrach") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."KeHoachLeHoi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."KeHoachLeHoi" TO postgres;


-- dashboard_xp."KetQuaKiemTraMoiTruong" definition

-- Drop table

-- DROP TABLE dashboard_xp."KetQuaKiemTraMoiTruong";

CREATE TABLE dashboard_xp."KetQuaKiemTraMoiTruong" (
	"MaKetQua" serial4 NOT NULL,
	"MaCoSo" int4 NOT NULL,
	"NgayKiemTra" date DEFAULT CURRENT_DATE NULL,
	"NoiDungKiemTra" text NULL,
	"KetLuan" text NULL,
	"BienPhapXuLy" text NULL,
	"NguoiKiemTra" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã kiểm tra'::character varying NULL,
	CONSTRAINT "KetQuaKiemTraMoiTruong_pkey" PRIMARY KEY ("MaKetQua"),
	CONSTRAINT "KetQuaKiemTraMoiTruong_MaCoSo_fkey" FOREIGN KEY ("MaCoSo") REFERENCES dashboard_xp."CoSoSanXuat_MoiTruong"("MaCoSo"),
	CONSTRAINT "KetQuaKiemTraMoiTruong_NguoiKiemTra_fkey" FOREIGN KEY ("NguoiKiemTra") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."KetQuaKiemTraMoiTruong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."KetQuaKiemTraMoiTruong" TO postgres;


-- dashboard_xp."KhaoSatNhuCauHocNghe" definition

-- Drop table

-- DROP TABLE dashboard_xp."KhaoSatNhuCauHocNghe";

CREATE TABLE dashboard_xp."KhaoSatNhuCauHocNghe" (
	"MaKhaoSat" serial4 NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"NgheNghiepMongMuon" varchar(100) NULL,
	"ThoiGianMongMuon" varchar(50) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "KhaoSatNhuCauHocNghe_pkey" PRIMARY KEY ("MaKhaoSat"),
	CONSTRAINT "KhaoSatNhuCauHocNghe_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan")
);

-- Permissions

ALTER TABLE dashboard_xp."KhaoSatNhuCauHocNghe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."KhaoSatNhuCauHocNghe" TO postgres;


-- dashboard_xp."KhoTriThuc" definition

-- Drop table

-- DROP TABLE dashboard_xp."KhoTriThuc";

CREATE TABLE dashboard_xp."KhoTriThuc" (
	"MaTriThuc" serial4 NOT NULL,
	"TieuDe" varchar(200) NOT NULL,
	"NoiDung" text NOT NULL,
	"MaLinhVuc" int4 NULL,
	"LoaiTaiLieu" varchar(50) NULL,
	"TuKhoa" text NULL,
	"LuotXem" int4 DEFAULT 0 NULL,
	"TrangThai" bool DEFAULT true NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"NguoiTao" int4 NULL,
	"NgayCapNhat" timestamp NULL,
	"NguoiCapNhat" int4 NULL,
	CONSTRAINT "KhoTriThuc_pkey" PRIMARY KEY ("MaTriThuc"),
	CONSTRAINT "KhoTriThuc_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "KhoTriThuc_NguoiCapNhat_fkey" FOREIGN KEY ("NguoiCapNhat") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung"),
	CONSTRAINT "KhoTriThuc_NguoiTao_fkey" FOREIGN KEY ("NguoiTao") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."KhoTriThuc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."KhoTriThuc" TO postgres;


-- dashboard_xp."LanhDao" definition

-- Drop table

-- DROP TABLE dashboard_xp."LanhDao";

CREATE TABLE dashboard_xp."LanhDao" (
	"MaLanhDao" serial4 NOT NULL,
	"MaNguoiDung" int4 NOT NULL,
	"MaPhongBan" int4 NULL,
	"ChucVu" varchar(50) NOT NULL,
	"NhiemKy" varchar(50) NULL,
	"NgayBatDau" date DEFAULT CURRENT_DATE NULL,
	"NgayKetThuc" date NULL,
	"DuocDuyetNganSach" bool DEFAULT false NULL,
	"DuocKyQuyetDinh" bool DEFAULT true NULL,
	"IsDeleted" bool DEFAULT false NULL,
	CONSTRAINT "LanhDao_MaNguoiDung_key" UNIQUE ("MaNguoiDung"),
	CONSTRAINT "LanhDao_pkey" PRIMARY KEY ("MaLanhDao"),
	CONSTRAINT "LanhDao_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung"),
	CONSTRAINT "LanhDao_MaPhongBan_fkey" FOREIGN KEY ("MaPhongBan") REFERENCES dashboard_xp."PhongBan"("MaPhongBan")
);

-- Permissions

ALTER TABLE dashboard_xp."LanhDao" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LanhDao" TO postgres;


-- dashboard_xp."LichSuBienDongDatDai" definition

-- Drop table

-- DROP TABLE dashboard_xp."LichSuBienDongDatDai";

CREATE TABLE dashboard_xp."LichSuBienDongDatDai" (
	"MaBienDong" serial4 NOT NULL,
	"MaThua" varchar(20) NOT NULL,
	"LoaiBienDong" varchar(50) NOT NULL,
	"NgayBienDong" date DEFAULT CURRENT_DATE NULL,
	"DienTichCu" numeric(18, 2) NULL,
	"DienTichMoi" numeric(18, 2) NULL,
	"ChuSoHuuCu" varchar(150) NULL,
	"ChuSoHuuMoi" varchar(150) NULL,
	"LyDo" text NULL,
	"NguoiThucHien" int4 NULL,
	"TaiLieuDinhKem" varchar(500) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "LichSuBienDongDatDai_pkey" PRIMARY KEY ("MaBienDong"),
	CONSTRAINT "LichSuBienDongDatDai_MaThua_fkey" FOREIGN KEY ("MaThua") REFERENCES dashboard_xp."ThuaDat"("MaThua"),
	CONSTRAINT "LichSuBienDongDatDai_NguoiThucHien_fkey" FOREIGN KEY ("NguoiThucHien") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."LichSuBienDongDatDai" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LichSuBienDongDatDai" TO postgres;


-- dashboard_xp."LichSuTraCuuAI" definition

-- Drop table

-- DROP TABLE dashboard_xp."LichSuTraCuuAI";

CREATE TABLE dashboard_xp."LichSuTraCuuAI" (
	"MaTraCuu" serial4 NOT NULL,
	"MaNguoiDung" int4 NOT NULL,
	"CauHoi" text NOT NULL,
	"CauTraLoi" text NOT NULL,
	"MaLinhVuc" int4 NULL,
	"ThoiGian" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"DanhGia" int4 NULL,
	CONSTRAINT "LichSuTraCuuAI_DanhGia_check" CHECK ((("DanhGia" IS NULL) OR (("DanhGia" >= 1) AND ("DanhGia" <= 5)))),
	CONSTRAINT "LichSuTraCuuAI_pkey" PRIMARY KEY ("MaTraCuu"),
	CONSTRAINT "LichSuTraCuuAI_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "LichSuTraCuuAI_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."LichSuTraCuuAI" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LichSuTraCuuAI" TO postgres;


-- dashboard_xp."NguoiCoCong" definition

-- Drop table

-- DROP TABLE dashboard_xp."NguoiCoCong";

CREATE TABLE dashboard_xp."NguoiCoCong" (
	"MaNCC" serial4 NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"LoaiCongHien" varchar(100) NOT NULL,
	"ChungNhan" varchar(100) NULL,
	"NgayPhongTang" date NULL,
	"MucHuong" numeric(18) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang hưởng'::character varying NULL,
	"GhiChu" text NULL,
	"NgayDangKy" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "NguoiCoCong_LoaiCongHien_check" CHECK ((("LoaiCongHien")::text = ANY ((ARRAY['Liệt sĩ'::character varying, 'Thương binh'::character varying, 'Bệnh binh'::character varying, 'Người có công khác'::character varying])::text[]))),
	CONSTRAINT "NguoiCoCong_MaCongDan_key" UNIQUE ("MaCongDan"),
	CONSTRAINT "NguoiCoCong_pkey" PRIMARY KEY ("MaNCC"),
	CONSTRAINT "NguoiCoCong_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan")
);

-- Permissions

ALTER TABLE dashboard_xp."NguoiCoCong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NguoiCoCong" TO postgres;


-- dashboard_xp."NguoiTimViec" definition

-- Drop table

-- DROP TABLE dashboard_xp."NguoiTimViec";

CREATE TABLE dashboard_xp."NguoiTimViec" (
	"MaNTV" serial4 NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"TrinhDo" varchar(100) NULL,
	"KinhNghiem" text NULL,
	"KyNang" text NULL,
	"NgheNghiepMongMuon" varchar(100) NULL,
	"MucLuongMongMuon" numeric(18) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang tìm việc'::character varying NULL,
	"NgayDangKy" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "NguoiTimViec_pkey" PRIMARY KEY ("MaNTV"),
	CONSTRAINT "NguoiTimViec_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan")
);

-- Permissions

ALTER TABLE dashboard_xp."NguoiTimViec" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."NguoiTimViec" TO postgres;


-- dashboard_xp."PhanAnh" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhanAnh";

CREATE TABLE dashboard_xp."PhanAnh" (
	"MaPhanAnh" serial4 NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"TieuDe" varchar(200) NOT NULL,
	"NoiDung" text NOT NULL,
	"ToaDo" varchar(50) NULL,
	"MaLinhVuc" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Mới'::character varying NULL,
	"MucDoUuTien" varchar(20) NULL,
	"DiaDiem" varchar(255) NULL,
	"MaCanBoXuLy" int4 NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"NgayXuLy" timestamp NULL,
	"KetQuaXuLy" text NULL,
	"DiemDanhGia" int4 NULL,
	CONSTRAINT "PhanAnh_DiemDanhGia_check" CHECK ((("DiemDanhGia" IS NULL) OR (("DiemDanhGia" >= 1) AND ("DiemDanhGia" <= 5)))),
	CONSTRAINT "PhanAnh_MucDoUuTien_check" CHECK ((("MucDoUuTien" IS NULL) OR (("MucDoUuTien")::text = ANY ((ARRAY['Thường'::character varying, 'Khẩn cấp'::character varying])::text[])))),
	CONSTRAINT "PhanAnh_TrangThai_check" CHECK ((("TrangThai")::text = ANY ((ARRAY['Mới'::character varying, 'Đang xử lý'::character varying, 'Đã xử lý'::character varying, 'Đã đóng'::character varying])::text[]))),
	CONSTRAINT "PhanAnh_pkey" PRIMARY KEY ("MaPhanAnh"),
	CONSTRAINT "PhanAnh_MaCanBoXuLy_fkey" FOREIGN KEY ("MaCanBoXuLy") REFERENCES dashboard_xp."CanBo"("MaCanBo"),
	CONSTRAINT "PhanAnh_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan"),
	CONSTRAINT "PhanAnh_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc")
);
CREATE INDEX "idx_phanAnh_diaDiem" ON dashboard_xp."PhanAnh" USING btree ("DiaDiem");
CREATE INDEX "idx_phanAnh_ngayTao" ON dashboard_xp."PhanAnh" USING btree ("NgayTao");
CREATE INDEX "idx_phanAnh_trangThai" ON dashboard_xp."PhanAnh" USING btree ("TrangThai");

-- Permissions

ALTER TABLE dashboard_xp."PhanAnh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhanAnh" TO postgres;


-- dashboard_xp."PhanAnh_Tep" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhanAnh_Tep";

CREATE TABLE dashboard_xp."PhanAnh_Tep" (
	"MaTep" serial4 NOT NULL,
	"MaPhanAnh" int4 NOT NULL,
	"TenFile" varchar(255) NOT NULL,
	"DuongDanFile" varchar(500) NOT NULL,
	"LoaiFile" varchar(20) DEFAULT 'IMAGE'::character varying NULL,
	"DungLuong" int8 NULL,
	"NgayTai" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "PhanAnh_Tep_pkey" PRIMARY KEY ("MaTep"),
	CONSTRAINT "PhanAnh_Tep_MaPhanAnh_fkey" FOREIGN KEY ("MaPhanAnh") REFERENCES dashboard_xp."PhanAnh"("MaPhanAnh") ON DELETE CASCADE
);
CREATE INDEX "IX_PhanAnh_Tep_MaPhanAnh" ON dashboard_xp."PhanAnh_Tep" USING btree ("MaPhanAnh");

-- Permissions

ALTER TABLE dashboard_xp."PhanAnh_Tep" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhanAnh_Tep" TO postgres;


-- dashboard_xp."PhanTichPhanAnh" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhanTichPhanAnh";

CREATE TABLE dashboard_xp."PhanTichPhanAnh" (
	"MaPhanTich" serial4 NOT NULL,
	"MaPhanAnh" int4 NOT NULL,
	"NoiDungPhanTich" text NULL,
	"MucDoUuTien" varchar(20) NULL,
	"NgayPhanTich" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã phân tích'::character varying NULL,
	CONSTRAINT "PhanTichPhanAnh_MucDoUuTien_check" CHECK ((("MucDoUuTien" IS NULL) OR (("MucDoUuTien")::text = ANY ((ARRAY['Cao'::character varying, 'Trung bình'::character varying, 'Thấp'::character varying])::text[])))),
	CONSTRAINT "PhanTichPhanAnh_pkey" PRIMARY KEY ("MaPhanTich"),
	CONSTRAINT "PhanTichPhanAnh_MaPhanAnh_fkey" FOREIGN KEY ("MaPhanAnh") REFERENCES dashboard_xp."PhanAnh"("MaPhanAnh")
);

-- Permissions

ALTER TABLE dashboard_xp."PhanTichPhanAnh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhanTichPhanAnh" TO postgres;


-- dashboard_xp."PhieuChi" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhieuChi";

CREATE TABLE dashboard_xp."PhieuChi" (
	"MaPhieuChi" varchar(20) NOT NULL,
	"TenKhoanChi" varchar(200) NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"NgayChi" date DEFAULT CURRENT_DATE NULL,
	"NguoiNhan" varchar(100) NULL,
	"LoaiChi" varchar(50) NULL,
	"MaNganSach" int4 NULL,
	"MaLinhVuc" int4 NULL,
	"GhiChu" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã chi'::character varying NULL,
	"NguoiDuyet" int4 NULL,
	CONSTRAINT "PhieuChi_SoTien_check" CHECK (("SoTien" > (0)::numeric)),
	CONSTRAINT "PhieuChi_pkey" PRIMARY KEY ("MaPhieuChi"),
	CONSTRAINT "PhieuChi_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "PhieuChi_MaNganSach_fkey" FOREIGN KEY ("MaNganSach") REFERENCES dashboard_xp."NganSach"("MaNganSach"),
	CONSTRAINT "PhieuChi_NguoiDuyet_fkey" FOREIGN KEY ("NguoiDuyet") REFERENCES dashboard_xp."LanhDao"("MaLanhDao")
);

-- Permissions

ALTER TABLE dashboard_xp."PhieuChi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhieuChi" TO postgres;


-- dashboard_xp."PhieuKham" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhieuKham";

CREATE TABLE dashboard_xp."PhieuKham" (
	"MaPhieuKham" serial4 NOT NULL,
	"MaCongDan" int4 NULL,
	"HoTenBenhNhan" varchar(150) NOT NULL,
	"NgayKham" date DEFAULT CURRENT_DATE NULL,
	"TrieuChung" text NULL,
	"ChanDoan" text NULL,
	"DonThuoc" text NULL,
	"ChiPhi" numeric(18) DEFAULT 0 NULL,
	"MaTram" int4 NULL,
	"BacSiXuLy" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã khám'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "PhieuKham_pkey" PRIMARY KEY ("MaPhieuKham"),
	CONSTRAINT "PhieuKham_BacSiXuLy_fkey" FOREIGN KEY ("BacSiXuLy") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung"),
	CONSTRAINT "PhieuKham_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan"),
	CONSTRAINT "PhieuKham_MaTram_fkey" FOREIGN KEY ("MaTram") REFERENCES dashboard_xp."TramYTe"("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."PhieuKham" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhieuKham" TO postgres;


-- dashboard_xp."QuaTangThamHoi" definition

-- Drop table

-- DROP TABLE dashboard_xp."QuaTangThamHoi";

CREATE TABLE dashboard_xp."QuaTangThamHoi" (
	"MaQuaTang" serial4 NOT NULL,
	"MaNCC" int4 NOT NULL,
	"DipTang" varchar(100) NOT NULL,
	"GiaTriQuaTang" numeric(18) NULL,
	"NgayTang" date DEFAULT CURRENT_DATE NULL,
	CONSTRAINT "QuaTangThamHoi_pkey" PRIMARY KEY ("MaQuaTang"),
	CONSTRAINT "QuaTangThamHoi_MaNCC_fkey" FOREIGN KEY ("MaNCC") REFERENCES dashboard_xp."NguoiCoCong"("MaNCC")
);

-- Permissions

ALTER TABLE dashboard_xp."QuaTangThamHoi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."QuaTangThamHoi" TO postgres;


-- dashboard_xp."RaSoatHoNgheo" definition

-- Drop table

-- DROP TABLE dashboard_xp."RaSoatHoNgheo";

CREATE TABLE dashboard_xp."RaSoatHoNgheo" (
	"MaRaSoat" serial4 NOT NULL,
	"MaHoNgheo" int4 NOT NULL,
	"NamRaSoat" int4 NOT NULL,
	"KetQuaRaSoat" varchar(50) NULL,
	"NgayRaSoat" date DEFAULT CURRENT_DATE NULL,
	"CanBoThucHien" int4 NULL,
	"NhanXet" text NULL,
	CONSTRAINT "RaSoatHoNgheo_pkey" PRIMARY KEY ("MaRaSoat"),
	CONSTRAINT "RaSoatHoNgheo_CanBoThucHien_fkey" FOREIGN KEY ("CanBoThucHien") REFERENCES dashboard_xp."CanBoTBXH"("MaCanBo"),
	CONSTRAINT "RaSoatHoNgheo_MaHoNgheo_fkey" FOREIGN KEY ("MaHoNgheo") REFERENCES dashboard_xp."HoNgheo"("MaHoNgheo")
);

-- Permissions

ALTER TABLE dashboard_xp."RaSoatHoNgheo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."RaSoatHoNgheo" TO postgres;


-- dashboard_xp."ThanhVienHo" definition

-- Drop table

-- DROP TABLE dashboard_xp."ThanhVienHo";

CREATE TABLE dashboard_xp."ThanhVienHo" (
	"MaTVH" serial4 NOT NULL,
	"MaHGD" int4 NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"QuanHe" varchar(50) NULL,
	"NgheNghiep" varchar(100) NULL,
	"ThuNhap" numeric(18) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ThanhVienHo_MaHGD_MaCongDan_key" UNIQUE ("MaHGD", "MaCongDan"),
	CONSTRAINT "ThanhVienHo_pkey" PRIMARY KEY ("MaTVH"),
	CONSTRAINT "ThanhVienHo_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan"),
	CONSTRAINT "ThanhVienHo_MaHGD_fkey" FOREIGN KEY ("MaHGD") REFERENCES dashboard_xp."HoGiaDinh"("MaHGD")
);

-- Permissions

ALTER TABLE dashboard_xp."ThanhVienHo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ThanhVienHo" TO postgres;


-- dashboard_xp."TheoDoiSauDaoTao" definition

-- Drop table

-- DROP TABLE dashboard_xp."TheoDoiSauDaoTao";

CREATE TABLE dashboard_xp."TheoDoiSauDaoTao" (
	"MaTheoDoi" serial4 NOT NULL,
	"MaLop" int4 NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"TinhTrangViecLam" varchar(100) NULL,
	"NgayCapNhat" date DEFAULT CURRENT_DATE NULL,
	CONSTRAINT "TheoDoiSauDaoTao_pkey" PRIMARY KEY ("MaTheoDoi"),
	CONSTRAINT "TheoDoiSauDaoTao_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan"),
	CONSTRAINT "TheoDoiSauDaoTao_MaLop_fkey" FOREIGN KEY ("MaLop") REFERENCES dashboard_xp."LopDaoTaoNghe"("MaLop")
);

-- Permissions

ALTER TABLE dashboard_xp."TheoDoiSauDaoTao" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TheoDoiSauDaoTao" TO postgres;


-- dashboard_xp."TiemChung_DoiTuong" definition

-- Drop table

-- DROP TABLE dashboard_xp."TiemChung_DoiTuong";

CREATE TABLE dashboard_xp."TiemChung_DoiTuong" (
	"MaTC_DoiTuong" serial4 NOT NULL,
	"MaTiemChung" int4 NOT NULL,
	"MaCongDan" int4 NULL,
	"HoTen" varchar(150) NOT NULL,
	"NgaySinh" date NULL,
	"NgayTiem" date DEFAULT CURRENT_DATE NULL,
	"LieuThu" int4 DEFAULT 1 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã tiêm'::character varying NULL,
	"PhanUng" text NULL,
	"GhiChu" text NULL,
	CONSTRAINT "TiemChung_DoiTuong_pkey" PRIMARY KEY ("MaTC_DoiTuong"),
	CONSTRAINT "TiemChung_DoiTuong_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan"),
	CONSTRAINT "TiemChung_DoiTuong_MaTiemChung_fkey" FOREIGN KEY ("MaTiemChung") REFERENCES dashboard_xp."TiemChung"("MaTiemChung")
);

-- Permissions

ALTER TABLE dashboard_xp."TiemChung_DoiTuong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TiemChung_DoiTuong" TO postgres;


-- dashboard_xp."ToChuc" definition

-- Drop table

-- DROP TABLE dashboard_xp."ToChuc";

CREATE TABLE dashboard_xp."ToChuc" (
	"MaTC" serial4 NOT NULL,
	"TenToChuc" varchar(200) NOT NULL,
	"DiaChi" varchar(255) NULL,
	"SoDienThoai" varchar(20) NULL,
	"NguoiDaiDien" int4 NULL,
	"LoaiToChuc" varchar(50) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ToChuc_pkey" PRIMARY KEY ("MaTC"),
	CONSTRAINT "ToChuc_NguoiDaiDien_fkey" FOREIGN KEY ("NguoiDaiDien") REFERENCES dashboard_xp."CongDan"("MaCongDan")
);

-- Permissions

ALTER TABLE dashboard_xp."ToChuc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ToChuc" TO postgres;


-- dashboard_xp."TroCapXaHoi" definition

-- Drop table

-- DROP TABLE dashboard_xp."TroCapXaHoi";

CREATE TABLE dashboard_xp."TroCapXaHoi" (
	"MaTroCap" serial4 NOT NULL,
	"MaDoiTuong" int4 NOT NULL,
	"ThangNam" varchar(7) NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"NgayTraCap" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã chi trả'::character varying NULL,
	CONSTRAINT "TroCapXaHoi_pkey" PRIMARY KEY ("MaTroCap"),
	CONSTRAINT "TroCapXaHoi_MaDoiTuong_fkey" FOREIGN KEY ("MaDoiTuong") REFERENCES dashboard_xp."DoiTuongBaoTro"("MaDoiTuong")
);

-- Permissions

ALTER TABLE dashboard_xp."TroCapXaHoi" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TroCapXaHoi" TO postgres;


-- dashboard_xp."TuyenDuong" definition

-- Drop table

-- DROP TABLE dashboard_xp."TuyenDuong";

CREATE TABLE dashboard_xp."TuyenDuong" (
	"MaTuyenDuong" serial4 NOT NULL,
	"TenTuyenDuong" varchar(150) NOT NULL,
	"ChieuDai" numeric(18, 2) NULL,
	"TinhTrang" varchar(50) DEFAULT 'Bình thường'::character varying NULL,
	"MaXaPhuong" int4 NULL,
	CONSTRAINT "TuyenDuong_pkey" PRIMARY KEY ("MaTuyenDuong"),
	CONSTRAINT "TuyenDuong_MaXaPhuong_fkey" FOREIGN KEY ("MaXaPhuong") REFERENCES dashboard_xp."XaPhuong"("MaXaPhuong")
);

-- Permissions

ALTER TABLE dashboard_xp."TuyenDuong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TuyenDuong" TO postgres;


-- dashboard_xp."BienBanThamDinhDatDai" definition

-- Drop table

-- DROP TABLE dashboard_xp."BienBanThamDinhDatDai";

CREATE TABLE dashboard_xp."BienBanThamDinhDatDai" (
	"MaBienBan" serial4 NOT NULL,
	"MaHoSo" varchar(20) NOT NULL,
	"NgayThamDinh" date DEFAULT CURRENT_DATE NULL,
	"KetLuan" text NULL,
	"NguoiThamDinh" int4 NULL,
	"TaiLieuDinhKem" varchar(500) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "BienBanThamDinhDatDai_pkey" PRIMARY KEY ("MaBienBan"),
	CONSTRAINT "BienBanThamDinhDatDai_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoCapGCN"("MaHoSo"),
	CONSTRAINT "BienBanThamDinhDatDai_NguoiThamDinh_fkey" FOREIGN KEY ("NguoiThamDinh") REFERENCES dashboard_xp."CanBo"("MaCanBo")
);

-- Permissions

ALTER TABLE dashboard_xp."BienBanThamDinhDatDai" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."BienBanThamDinhDatDai" TO postgres;


-- dashboard_xp."CheDoUuDai" definition

-- Drop table

-- DROP TABLE dashboard_xp."CheDoUuDai";

CREATE TABLE dashboard_xp."CheDoUuDai" (
	"MaCheDo" serial4 NOT NULL,
	"MaNCC" int4 NOT NULL,
	"TenCheDo" varchar(200) NOT NULL,
	"MucHuong" numeric(18) NULL,
	"ThangNam" varchar(7) NOT NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã chi trả'::character varying NULL,
	CONSTRAINT "CheDoUuDai_pkey" PRIMARY KEY ("MaCheDo"),
	CONSTRAINT "CheDoUuDai_MaNCC_fkey" FOREIGN KEY ("MaNCC") REFERENCES dashboard_xp."NguoiCoCong"("MaNCC")
);

-- Permissions

ALTER TABLE dashboard_xp."CheDoUuDai" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."CheDoUuDai" TO postgres;


-- dashboard_xp."DuToanNganSach" definition

-- Drop table

-- DROP TABLE dashboard_xp."DuToanNganSach";

CREATE TABLE dashboard_xp."DuToanNganSach" (
	"MaDuToan" serial4 NOT NULL,
	"TenDuToan" varchar(200) NOT NULL,
	"Nam" int4 NOT NULL,
	"MaLinhVuc" int4 NULL,
	"SoTienDuToan" numeric(18) NOT NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã duyệt'::character varying NULL,
	"NgayLap" date DEFAULT CURRENT_DATE NULL,
	"NguoiLap" int4 NULL,
	"NgayDuyet" date NULL,
	"NguoiDuyet" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "DuToanNganSach_pkey" PRIMARY KEY ("MaDuToan"),
	CONSTRAINT "DuToanNganSach_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "DuToanNganSach_NguoiDuyet_fkey" FOREIGN KEY ("NguoiDuyet") REFERENCES dashboard_xp."LanhDao"("MaLanhDao"),
	CONSTRAINT "DuToanNganSach_NguoiLap_fkey" FOREIGN KEY ("NguoiLap") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."DuToanNganSach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DuToanNganSach" TO postgres;


-- dashboard_xp."GiaiNgan" definition

-- Drop table

-- DROP TABLE dashboard_xp."GiaiNgan";

CREATE TABLE dashboard_xp."GiaiNgan" (
	"MaGiaiNgan" serial4 NOT NULL,
	"MaDuToan" int4 NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"NgayGiaiNgan" date DEFAULT CURRENT_DATE NULL,
	"NoiDung" text NULL,
	"NguoiDuyet" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã giải ngân'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "GiaiNgan_SoTien_check" CHECK (("SoTien" > (0)::numeric)),
	CONSTRAINT "GiaiNgan_pkey" PRIMARY KEY ("MaGiaiNgan"),
	CONSTRAINT "GiaiNgan_MaDuToan_fkey" FOREIGN KEY ("MaDuToan") REFERENCES dashboard_xp."DuToanNganSach"("MaDuToan"),
	CONSTRAINT "GiaiNgan_NguoiDuyet_fkey" FOREIGN KEY ("NguoiDuyet") REFERENCES dashboard_xp."LanhDao"("MaLanhDao")
);

-- Permissions

ALTER TABLE dashboard_xp."GiaiNgan" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."GiaiNgan" TO postgres;


-- dashboard_xp."GioiThieuViecLam" definition

-- Drop table

-- DROP TABLE dashboard_xp."GioiThieuViecLam";

CREATE TABLE dashboard_xp."GioiThieuViecLam" (
	"MaGioiThieu" serial4 NOT NULL,
	"MaNTV" int4 NOT NULL,
	"MaViecLam" int4 NOT NULL,
	"NgayGioiThieu" date DEFAULT CURRENT_DATE NULL,
	"KetQua" varchar(50) NULL,
	CONSTRAINT "GioiThieuViecLam_pkey" PRIMARY KEY ("MaGioiThieu"),
	CONSTRAINT "GioiThieuViecLam_MaNTV_fkey" FOREIGN KEY ("MaNTV") REFERENCES dashboard_xp."NguoiTimViec"("MaNTV"),
	CONSTRAINT "GioiThieuViecLam_MaViecLam_fkey" FOREIGN KEY ("MaViecLam") REFERENCES dashboard_xp."ViecLam"("MaViecLam")
);

-- Permissions

ALTER TABLE dashboard_xp."GioiThieuViecLam" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."GioiThieuViecLam" TO postgres;


-- dashboard_xp."HoSoNghiepVu" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoSoNghiepVu";

CREATE TABLE dashboard_xp."HoSoNghiepVu" (
	"MaHoSo" varchar(20) NOT NULL,
	"TenNghiepVu" varchar(200) NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"MaLinhVuc" int4 NOT NULL,
	"MaLoaiNghiepVu" int4 NULL,
	"LoaiHoSo" varchar(50) NULL,
	"MaCanBoXuLy" int4 NULL,
	"MaLanhDaoDuyet" int4 NULL,
	"MaTrangThai" varchar(20) DEFAULT 'MOI_TAO'::character varying NOT NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"HanXuLy" timestamp NOT NULL,
	"NgayHoanThanh" timestamp NULL,
	"LyDoTuChoi" text NULL,
	"GhiChuXuLy" text NULL,
	"MucDoUuTien" int4 DEFAULT 2 NULL,
	CONSTRAINT "HoSoNghiepVu_MucDoUuTien_check" CHECK ((("MucDoUuTien" >= 1) AND ("MucDoUuTien" <= 5))),
	CONSTRAINT "HoSoNghiepVu_check" CHECK ((("NgayHoanThanh" IS NULL) OR ("NgayHoanThanh" >= "NgayTao"))),
	CONSTRAINT "HoSoNghiepVu_check1" CHECK (("HanXuLy" >= "NgayTao")),
	CONSTRAINT "HoSoNghiepVu_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "HoSoNghiepVu_MaCanBoXuLy_fkey" FOREIGN KEY ("MaCanBoXuLy") REFERENCES dashboard_xp."CanBo"("MaCanBo"),
	CONSTRAINT "HoSoNghiepVu_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan"),
	CONSTRAINT "HoSoNghiepVu_MaLanhDaoDuyet_fkey" FOREIGN KEY ("MaLanhDaoDuyet") REFERENCES dashboard_xp."LanhDao"("MaLanhDao"),
	CONSTRAINT "HoSoNghiepVu_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "HoSoNghiepVu_MaLoaiNghiepVu_fkey" FOREIGN KEY ("MaLoaiNghiepVu") REFERENCES dashboard_xp."LoaiNghiepVu"("MaLoaiNghiepVu"),
	CONSTRAINT "HoSoNghiepVu_MaTrangThai_fkey" FOREIGN KEY ("MaTrangThai") REFERENCES dashboard_xp."TrangThaiHoSo"("MaTrangThai")
);
CREATE INDEX "idx_hoSo_loaiHoSo" ON dashboard_xp."HoSoNghiepVu" USING btree ("LoaiHoSo");
CREATE INDEX "idx_hoSo_maTrangThai" ON dashboard_xp."HoSoNghiepVu" USING btree ("MaTrangThai");
CREATE INDEX "idx_hoSo_ngayTao" ON dashboard_xp."HoSoNghiepVu" USING btree ("NgayTao");

-- Permissions

ALTER TABLE dashboard_xp."HoSoNghiepVu" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoSoNghiepVu" TO postgres;


-- dashboard_xp."HoSoTranhChapDatDai" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoSoTranhChapDatDai";

CREATE TABLE dashboard_xp."HoSoTranhChapDatDai" (
	"MaHoSo" varchar(20) NOT NULL,
	"TenVuViec" varchar(200) NOT NULL,
	"BenA" varchar(150) NOT NULL,
	"BenB" varchar(150) NOT NULL,
	"DiaDiem" varchar(255) NULL,
	"DienTichTranh" numeric(18, 2) NULL,
	"NgayNopDon" date DEFAULT CURRENT_DATE NULL,
	"TrangThai" varchar(50) DEFAULT 'Đang giải quyết'::character varying NULL,
	"KetQuaGiaiQuyet" text NULL,
	"NgayKetThuc" date NULL,
	"CanBoXuLy" int4 NULL,
	"NguoiKyQuyetDinh" int4 NULL,
	"SoQuyetDinh" varchar(50) NULL,
	"NgayKyQuyetDinh" date NULL,
	"TaiLieuLienQuan" varchar(500) NULL,
	"GhiChu" text NULL,
	"NgayTao" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "HoSoTranhChapDatDai_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "HoSoTranhChapDatDai_CanBoXuLy_fkey" FOREIGN KEY ("CanBoXuLy") REFERENCES dashboard_xp."CanBo"("MaCanBo"),
	CONSTRAINT "HoSoTranhChapDatDai_NguoiKyQuyetDinh_fkey" FOREIGN KEY ("NguoiKyQuyetDinh") REFERENCES dashboard_xp."LanhDao"("MaLanhDao")
);

-- Permissions

ALTER TABLE dashboard_xp."HoSoTranhChapDatDai" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoSoTranhChapDatDai" TO postgres;


-- dashboard_xp."HoTroThatNghiep" definition

-- Drop table

-- DROP TABLE dashboard_xp."HoTroThatNghiep";

CREATE TABLE dashboard_xp."HoTroThatNghiep" (
	"MaHoTro" serial4 NOT NULL,
	"MaNTV" int4 NOT NULL,
	"LoaiHoTro" varchar(100) NOT NULL,
	"SoTien" numeric(18) NULL,
	"NgayNhan" date NULL,
	CONSTRAINT "HoTroThatNghiep_pkey" PRIMARY KEY ("MaHoTro"),
	CONSTRAINT "HoTroThatNghiep_MaNTV_fkey" FOREIGN KEY ("MaNTV") REFERENCES dashboard_xp."NguoiTimViec"("MaNTV")
);

-- Permissions

ALTER TABLE dashboard_xp."HoTroThatNghiep" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."HoTroThatNghiep" TO postgres;


-- dashboard_xp."LichSuXuLyHoSo" definition

-- Drop table

-- DROP TABLE dashboard_xp."LichSuXuLyHoSo";

CREATE TABLE dashboard_xp."LichSuXuLyHoSo" (
	"MaLichSu" serial4 NOT NULL,
	"MaHoSo" varchar(20) NOT NULL,
	"TrangThaiCu" varchar(20) NULL,
	"TrangThaiMoi" varchar(20) NOT NULL,
	"NguoiThucHien" int4 NOT NULL,
	"ThoiGian" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"GhiChu" text NULL,
	"IPTruyCap" varchar(50) NULL,
	CONSTRAINT "LichSuXuLyHoSo_pkey" PRIMARY KEY ("MaLichSu"),
	CONSTRAINT "LichSuXuLyHoSo_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "LichSuXuLyHoSo_NguoiThucHien_fkey" FOREIGN KEY ("NguoiThucHien") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."LichSuXuLyHoSo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."LichSuXuLyHoSo" TO postgres;


-- dashboard_xp."PhieuNganSach" definition

-- Drop table

-- DROP TABLE dashboard_xp."PhieuNganSach";

CREATE TABLE dashboard_xp."PhieuNganSach" (
	"MaPhieu" varchar(20) NOT NULL,
	"LoaiPhieu" varchar(20) NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"NgayLap" date DEFAULT CURRENT_DATE NULL,
	"NoiDung" text NOT NULL,
	"NguoiNhan" varchar(150) NULL,
	"NguoiLap" int4 NULL,
	"NguoiDuyet" int4 NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã duyệt'::character varying NULL,
	"MaDuToan" int4 NULL,
	"MaLinhVuc" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "PhieuNganSach_LoaiPhieu_check" CHECK ((("LoaiPhieu")::text = ANY ((ARRAY['Thu'::character varying, 'Chi'::character varying])::text[]))),
	CONSTRAINT "PhieuNganSach_SoTien_check" CHECK (("SoTien" > (0)::numeric)),
	CONSTRAINT "PhieuNganSach_pkey" PRIMARY KEY ("MaPhieu"),
	CONSTRAINT "PhieuNganSach_MaDuToan_fkey" FOREIGN KEY ("MaDuToan") REFERENCES dashboard_xp."DuToanNganSach"("MaDuToan"),
	CONSTRAINT "PhieuNganSach_MaLinhVuc_fkey" FOREIGN KEY ("MaLinhVuc") REFERENCES dashboard_xp."LinhVuc"("MaLinhVuc"),
	CONSTRAINT "PhieuNganSach_NguoiDuyet_fkey" FOREIGN KEY ("NguoiDuyet") REFERENCES dashboard_xp."LanhDao"("MaLanhDao"),
	CONSTRAINT "PhieuNganSach_NguoiLap_fkey" FOREIGN KEY ("NguoiLap") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."PhieuNganSach" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."PhieuNganSach" TO postgres;


-- dashboard_xp."TaiLieuHoSo" definition

-- Drop table

-- DROP TABLE dashboard_xp."TaiLieuHoSo";

CREATE TABLE dashboard_xp."TaiLieuHoSo" (
	"MaTaiLieu" serial4 NOT NULL,
	"MaHoSo" varchar(20) NOT NULL,
	"TenTaiLieu" varchar(200) NOT NULL,
	"DuongDanFile" varchar(500) NOT NULL,
	"LoaiFile" varchar(20) NULL,
	"DungLuong" int8 NULL,
	"NgayTai" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"NguoiTai" int4 NULL,
	"TrangThai" bool DEFAULT true NULL,
	CONSTRAINT "TaiLieuHoSo_DungLuong_check" CHECK (("DungLuong" > 0)),
	CONSTRAINT "TaiLieuHoSo_pkey" PRIMARY KEY ("MaTaiLieu"),
	CONSTRAINT "TaiLieuHoSo_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "TaiLieuHoSo_NguoiTai_fkey" FOREIGN KEY ("NguoiTai") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."TaiLieuHoSo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."TaiLieuHoSo" TO postgres;


-- dashboard_xp."YeuCauBoSungTaiLieu" definition

-- Drop table

-- DROP TABLE dashboard_xp."YeuCauBoSungTaiLieu";

CREATE TABLE dashboard_xp."YeuCauBoSungTaiLieu" (
	"MaYeuCau" serial4 NOT NULL,
	"MaHoSo" varchar(20) NOT NULL,
	"MaTaiLieuCanBoSung" varchar(200) NOT NULL,
	"NoiDungYeuCau" text NULL,
	"ThoiHanBoSung" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Chờ bổ sung'::character varying NULL,
	"NguoiYeuCau" int4 NULL,
	"NgayYeuCau" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "YeuCauBoSungTaiLieu_TrangThai_check" CHECK ((("TrangThai")::text = ANY ((ARRAY['Chờ bổ sung'::character varying, 'Đã bổ sung'::character varying, 'Đã hủy'::character varying])::text[]))),
	CONSTRAINT "YeuCauBoSungTaiLieu_pkey" PRIMARY KEY ("MaYeuCau"),
	CONSTRAINT "YeuCauBoSungTaiLieu_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "YeuCauBoSungTaiLieu_NguoiYeuCau_fkey" FOREIGN KEY ("NguoiYeuCau") REFERENCES dashboard_xp."NguoiDung"("MaNguoiDung")
);

-- Permissions

ALTER TABLE dashboard_xp."YeuCauBoSungTaiLieu" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."YeuCauBoSungTaiLieu" TO postgres;


-- dashboard_xp."ChiTiet_AnNinhQP" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_AnNinhQP";

CREATE TABLE dashboard_xp."ChiTiet_AnNinhQP" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiHoSo" varchar(100) NULL,
	"DiaDiem" varchar(255) NULL,
	"NgayDangKy" date NULL,
	"ThoiHan" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã duyệt'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_AnNinhQP_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_AnNinhQP_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_AnNinhQP" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_AnNinhQP" TO postgres;


-- dashboard_xp."ChiTiet_DiaChinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_DiaChinh";

CREATE TABLE dashboard_xp."ChiTiet_DiaChinh" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiDichVu" varchar(100) NULL,
	"MaThua" varchar(20) NULL,
	"DienTich" numeric(18, 2) NULL,
	"LoaiDat" varchar(50) NULL,
	"MucDichSuDung" text NULL,
	"ThoiHanSuDung" varchar(50) NULL,
	"PhiDichVu" numeric(18) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã thanh toán'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_DiaChinh_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_DiaChinh_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "ChiTiet_DiaChinh_MaThua_fkey" FOREIGN KEY ("MaThua") REFERENCES dashboard_xp."ThuaDat"("MaThua")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_DiaChinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_DiaChinh" TO postgres;


-- dashboard_xp."ChiTiet_KinhTe" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_KinhTe";

CREATE TABLE dashboard_xp."ChiTiet_KinhTe" (
	"MaHoSo" varchar(20) NOT NULL,
	"MaHoKD" int4 NULL,
	"LoaiGiayPhep" varchar(100) NULL,
	"NgayCapPhep" date NULL,
	"NgayHetHan" date NULL,
	"TrangThai" varchar(50) DEFAULT 'Còn hiệu lực'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_KinhTe_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_KinhTe_MaHoKD_fkey" FOREIGN KEY ("MaHoKD") REFERENCES dashboard_xp."HoKinhDoanh"("MaHoKD"),
	CONSTRAINT "ChiTiet_KinhTe_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_KinhTe" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_KinhTe" TO postgres;


-- dashboard_xp."ChiTiet_LaoDong" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_LaoDong";

CREATE TABLE dashboard_xp."ChiTiet_LaoDong" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiDichVu" varchar(100) NULL,
	"MaNTV" int4 NULL,
	"MaViecLam" int4 NULL,
	"MaDoiTuong" int4 NULL,
	"NgayHenPhongVan" date NULL,
	"KetQua" text NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_LaoDong_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_LaoDong_MaDoiTuong_fkey" FOREIGN KEY ("MaDoiTuong") REFERENCES dashboard_xp."DoiTuongBaoTro"("MaDoiTuong"),
	CONSTRAINT "ChiTiet_LaoDong_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "ChiTiet_LaoDong_MaNTV_fkey" FOREIGN KEY ("MaNTV") REFERENCES dashboard_xp."NguoiTimViec"("MaNTV"),
	CONSTRAINT "ChiTiet_LaoDong_MaViecLam_fkey" FOREIGN KEY ("MaViecLam") REFERENCES dashboard_xp."ViecLam"("MaViecLam")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_LaoDong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_LaoDong" TO postgres;


-- dashboard_xp."ChiTiet_MoiTruong" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_MoiTruong";

CREATE TABLE dashboard_xp."ChiTiet_MoiTruong" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiDichVu" varchar(100) NULL,
	"MaCoSo" int4 NULL,
	"MaDiem" int4 NULL,
	"NoiDungYeuCau" text NULL,
	"KetQua" text NULL,
	"PhiDichVu" numeric(18) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã xử lý'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_MoiTruong_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_MoiTruong_MaCoSo_fkey" FOREIGN KEY ("MaCoSo") REFERENCES dashboard_xp."CoSoSanXuat_MoiTruong"("MaCoSo"),
	CONSTRAINT "ChiTiet_MoiTruong_MaDiem_fkey" FOREIGN KEY ("MaDiem") REFERENCES dashboard_xp."DiemNongMoiTruong"("MaDiem"),
	CONSTRAINT "ChiTiet_MoiTruong_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_MoiTruong" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_MoiTruong" TO postgres;


-- dashboard_xp."ChiTiet_TaiChinh" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_TaiChinh";

CREATE TABLE dashboard_xp."ChiTiet_TaiChinh" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiGiaoDich" varchar(50) NULL,
	"SoTien" numeric(18) NOT NULL,
	"MaDuToan" int4 NULL,
	"MucDich" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã thanh toán'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_TaiChinh_SoTien_check" CHECK (("SoTien" > (0)::numeric)),
	CONSTRAINT "ChiTiet_TaiChinh_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_TaiChinh_MaDuToan_fkey" FOREIGN KEY ("MaDuToan") REFERENCES dashboard_xp."DuToanNganSach"("MaDuToan"),
	CONSTRAINT "ChiTiet_TaiChinh_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_TaiChinh" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_TaiChinh" TO postgres;


-- dashboard_xp."ChiTiet_TuPhap" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_TuPhap";

CREATE TABLE dashboard_xp."ChiTiet_TuPhap" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiGiayTo" varchar(100) NULL,
	"SoGiayKhai" varchar(50) NULL,
	"NgayNop" date NULL,
	"DiaDiemDangKy" varchar(200) NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_TuPhap_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_TuPhap_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_TuPhap" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_TuPhap" TO postgres;


-- dashboard_xp."ChiTiet_VanHoa" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_VanHoa";

CREATE TABLE dashboard_xp."ChiTiet_VanHoa" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiDichVu" varchar(100) NULL,
	"MaDiTich" int4 NULL,
	"MaLeHoi" int4 NULL,
	"MaCoSo" int4 NULL,
	"NoiDungDichVu" text NULL,
	"PhiDichVu" numeric(18) NULL,
	"TrangThai" varchar(50) DEFAULT 'Đã xử lý'::character varying NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_VanHoa_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_VanHoa_MaCoSo_fkey" FOREIGN KEY ("MaCoSo") REFERENCES dashboard_xp."CoSoKinhDoanhDuLich"("MaCoSo"),
	CONSTRAINT "ChiTiet_VanHoa_MaDiTich_fkey" FOREIGN KEY ("MaDiTich") REFERENCES dashboard_xp."DiTich"("MaDiTich"),
	CONSTRAINT "ChiTiet_VanHoa_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "ChiTiet_VanHoa_MaLeHoi_fkey" FOREIGN KEY ("MaLeHoi") REFERENCES dashboard_xp."LeHoi"("MaLeHoi")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_VanHoa" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_VanHoa" TO postgres;


-- dashboard_xp."ChiTiet_XayDung" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_XayDung";

CREATE TABLE dashboard_xp."ChiTiet_XayDung" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiCongTrinh" varchar(100) NULL,
	"DienTichXayDung" numeric(18, 2) NULL,
	"SoTang" int4 NULL,
	"ChieuCao" numeric(18, 2) NULL,
	"ThoiGianThiCong" int4 NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_XayDung_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_XayDung_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_XayDung" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_XayDung" TO postgres;


-- dashboard_xp."ChiTiet_YTeGiaoDuc" definition

-- Drop table

-- DROP TABLE dashboard_xp."ChiTiet_YTeGiaoDuc";

CREATE TABLE dashboard_xp."ChiTiet_YTeGiaoDuc" (
	"MaHoSo" varchar(20) NOT NULL,
	"LoaiDichVu" varchar(100) NULL,
	"MaTram" int4 NULL,
	"MaCoSo" int4 NULL,
	"NgayHenKham" date NULL,
	"KetQuaKham" text NULL,
	"GhiChu" text NULL,
	CONSTRAINT "ChiTiet_YTeGiaoDuc_pkey" PRIMARY KEY ("MaHoSo"),
	CONSTRAINT "ChiTiet_YTeGiaoDuc_MaCoSo_fkey" FOREIGN KEY ("MaCoSo") REFERENCES dashboard_xp."CoSoGiaoDuc"("MaCoSo"),
	CONSTRAINT "ChiTiet_YTeGiaoDuc_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "ChiTiet_YTeGiaoDuc_MaTram_fkey" FOREIGN KEY ("MaTram") REFERENCES dashboard_xp."TramYTe"("MaTram")
);

-- Permissions

ALTER TABLE dashboard_xp."ChiTiet_YTeGiaoDuc" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."ChiTiet_YTeGiaoDuc" TO postgres;


-- dashboard_xp."DanhGiaDichVu" definition

-- Drop table

-- DROP TABLE dashboard_xp."DanhGiaDichVu";

CREATE TABLE dashboard_xp."DanhGiaDichVu" (
	"MaDanhGia" serial4 NOT NULL,
	"MaHoSo" varchar(20) NOT NULL,
	"MaCongDan" int4 NOT NULL,
	"DiemDanhGia" int4 NULL,
	"NhanXet" text NULL,
	"NgayDanhGia" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	"PhanHoiTuHeThong" text NULL,
	CONSTRAINT "DanhGiaDichVu_DiemDanhGia_check" CHECK ((("DiemDanhGia" >= 1) AND ("DiemDanhGia" <= 5))),
	CONSTRAINT "DanhGiaDichVu_pkey" PRIMARY KEY ("MaDanhGia"),
	CONSTRAINT "DanhGiaDichVu_MaCongDan_fkey" FOREIGN KEY ("MaCongDan") REFERENCES dashboard_xp."CongDan"("MaCongDan"),
	CONSTRAINT "DanhGiaDichVu_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo")
);

-- Permissions

ALTER TABLE dashboard_xp."DanhGiaDichVu" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DanhGiaDichVu" TO postgres;


-- dashboard_xp."DanhGiaHoSo" definition

-- Drop table

-- DROP TABLE dashboard_xp."DanhGiaHoSo";

CREATE TABLE dashboard_xp."DanhGiaHoSo" (
	"MaDanhGia" serial4 NOT NULL,
	"MaHoSo" varchar(20) NOT NULL,
	"DiemDanhGia" int4 NULL,
	"NhanXet" text NULL,
	"MaLanhDao" int4 NULL,
	"NgayDanhGia" timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT "DanhGiaHoSo_DiemDanhGia_check" CHECK ((("DiemDanhGia" >= 1) AND ("DiemDanhGia" <= 5))),
	CONSTRAINT "DanhGiaHoSo_pkey" PRIMARY KEY ("MaDanhGia"),
	CONSTRAINT "DanhGiaHoSo_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "DanhGiaHoSo_MaLanhDao_fkey" FOREIGN KEY ("MaLanhDao") REFERENCES dashboard_xp."LanhDao"("MaLanhDao")
);

-- Permissions

ALTER TABLE dashboard_xp."DanhGiaHoSo" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DanhGiaHoSo" TO postgres;


-- dashboard_xp."DuToanChiTiet" definition

-- Drop table

-- DROP TABLE dashboard_xp."DuToanChiTiet";

CREATE TABLE dashboard_xp."DuToanChiTiet" (
	"MaChiTiet" serial4 NOT NULL,
	"MaDuToan" int4 NOT NULL,
	"MaMucLuc" varchar(20) NULL,
	"NoiDung" text NOT NULL,
	"SoTien" numeric(18) NOT NULL,
	"GhiChu" text NULL,
	CONSTRAINT "DuToanChiTiet_pkey" PRIMARY KEY ("MaChiTiet"),
	CONSTRAINT "DuToanChiTiet_MaDuToan_fkey" FOREIGN KEY ("MaDuToan") REFERENCES dashboard_xp."DuToanNganSach"("MaDuToan"),
	CONSTRAINT "DuToanChiTiet_MaMucLuc_fkey" FOREIGN KEY ("MaMucLuc") REFERENCES dashboard_xp."MucLucNganSach"("MaMucLuc")
);

-- Permissions

ALTER TABLE dashboard_xp."DuToanChiTiet" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."DuToanChiTiet" TO postgres;


-- dashboard_xp."GiayPhep" definition

-- Drop table

-- DROP TABLE dashboard_xp."GiayPhep";

CREATE TABLE dashboard_xp."GiayPhep" (
	"MaGiayPhep" serial4 NOT NULL,
	"SoGiayPhep" varchar(50) NOT NULL,
	"MaLoaiGP" int4 NULL,
	"NgayCap" date DEFAULT CURRENT_DATE NULL,
	"NgayHetHan" date NULL,
	"NguoiDuocCap" varchar(150) NULL,
	"NoiDung" text NULL,
	"TrangThai" varchar(50) DEFAULT 'Còn hiệu lực'::character varying NULL,
	"MaHoSo" varchar(20) NULL,
	CONSTRAINT "GiayPhep_SoGiayPhep_key" UNIQUE ("SoGiayPhep"),
	CONSTRAINT "GiayPhep_pkey" PRIMARY KEY ("MaGiayPhep"),
	CONSTRAINT "GiayPhep_MaHoSo_fkey" FOREIGN KEY ("MaHoSo") REFERENCES dashboard_xp."HoSoNghiepVu"("MaHoSo"),
	CONSTRAINT "GiayPhep_MaLoaiGP_fkey" FOREIGN KEY ("MaLoaiGP") REFERENCES dashboard_xp."LoaiGiayPhep"("MaLoaiGP")
);

-- Permissions

ALTER TABLE dashboard_xp."GiayPhep" OWNER TO postgres;
GRANT ALL ON TABLE dashboard_xp."GiayPhep" TO postgres;