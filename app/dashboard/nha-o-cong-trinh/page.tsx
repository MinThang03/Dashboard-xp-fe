'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, Users, CheckCircle2, AlertTriangle, Search, Plus, Download, Eye, Edit,
  Building2, MapPin, Ruler, Calendar, Clock, Warehouse
} from 'lucide-react';

// Mock data nhà ở, công trình
interface NhaOCongTrinh {
  MaCongTrinh: string;
  TenCongTrinh: string;
  LoaiCongTrinh: string;
  PhanLoai: string;
  DiaChi: string;
  MaThua: string;
  SoTo: string;
  DienTichSan: number;
  SoTang: number;
  NamXayDung: number;
  ChuSoHuu: string;
  CCCD: string;
  SoDienThoai: string;
  TinhTrangKienTruc: string;
  TinhTrangPhapLy: string;
  SoGiayPhepXD: string;
  NgayKiemTra: string;
  NguoiKiemTra: string;
  KetQuaKiemTra: string;
  GhiChu: string;
}

const mockCongTrinh: NhaOCongTrinh[] = [
  {
    MaCongTrinh: 'NO001',
    TenCongTrinh: 'Nhà ở hộ Nguyễn Văn An',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    PhanLoai: 'Cấp 3',
    DiaChi: '123 Đường ABC, Khu phố 1, phường XYZ',
    MaThua: '123',
    SoTo: '45',
    DienTichSan: 240,
    SoTang: 3,
    NamXayDung: 2018,
    ChuSoHuu: 'Nguyễn Văn An',
    CCCD: '001234567890',
    SoDienThoai: '0901234567',
    TinhTrangKienTruc: 'Tốt',
    TinhTrangPhapLy: 'Hợp pháp',
    SoGiayPhepXD: 'GP-2018-001234',
    NgayKiemTra: '2024-12-15',
    NguoiKiemTra: 'Trần Văn Bình',
    KetQuaKiemTra: 'Đạt',
    GhiChu: ''
  },
  {
    MaCongTrinh: 'CT001',
    TenCongTrinh: 'Trường Tiểu học ABC',
    LoaiCongTrinh: 'Công trình giáo dục',
    PhanLoai: 'Cấp 2',
    DiaChi: '456 Đường DEF, Khu phố 3, phường GHI',
    MaThua: '456',
    SoTo: '67',
    DienTichSan: 2500,
    SoTang: 3,
    NamXayDung: 2010,
    ChuSoHuu: 'UBND Phường GHI',
    CCCD: '',
    SoDienThoai: '0908765432',
    TinhTrangKienTruc: 'Tốt',
    TinhTrangPhapLy: 'Hợp pháp',
    SoGiayPhepXD: 'GP-2010-005678',
    NgayKiemTra: '2024-11-20',
    NguoiKiemTra: 'Lê Thị Cúc',
    KetQuaKiemTra: 'Đạt',
    GhiChu: 'Công trình công cộng'
  },
  {
    MaCongTrinh: 'NO002',
    TenCongTrinh: 'Nhà ở hộ Trần Thị Bình',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    PhanLoai: 'Cấp 4',
    DiaChi: '789 Đường KLM, Thôn 2, xã NOP',
    MaThua: '789',
    SoTo: '89',
    DienTichSan: 80,
    SoTang: 1,
    NamXayDung: 1995,
    ChuSoHuu: 'Trần Thị Bình',
    CCCD: '001234567891',
    SoDienThoai: '0902345678',
    TinhTrangKienTruc: 'Xuống cấp',
    TinhTrangPhapLy: 'Hợp pháp',
    SoGiayPhepXD: '',
    NgayKiemTra: '2025-01-05',
    NguoiKiemTra: 'Trần Văn Bình',
    KetQuaKiemTra: 'Cần sửa chữa',
    GhiChu: 'Mái ngói hư hỏng, tường nứt'
  },
  {
    MaCongTrinh: 'CT002',
    TenCongTrinh: 'Trạm Y tế phường XYZ',
    LoaiCongTrinh: 'Công trình y tế',
    PhanLoai: 'Cấp 3',
    DiaChi: '234 Đường QRS, Khu phố 2, phường XYZ',
    MaThua: '234',
    SoTo: '12',
    DienTichSan: 500,
    SoTang: 2,
    NamXayDung: 2015,
    ChuSoHuu: 'UBND Phường XYZ',
    CCCD: '',
    SoDienThoai: '0903456789',
    TinhTrangKienTruc: 'Tốt',
    TinhTrangPhapLy: 'Hợp pháp',
    SoGiayPhepXD: 'GP-2015-002345',
    NgayKiemTra: '2024-10-10',
    NguoiKiemTra: 'Nguyễn Thị Dung',
    KetQuaKiemTra: 'Đạt',
    GhiChu: ''
  },
  {
    MaCongTrinh: 'NO003',
    TenCongTrinh: 'Nhà ở hộ Phạm Văn Cường',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    PhanLoai: 'Cấp 3',
    DiaChi: '567 Đường TUV, Khu phố 4, phường WXY',
    MaThua: '567',
    SoTo: '34',
    DienTichSan: 350,
    SoTang: 4,
    NamXayDung: 2022,
    ChuSoHuu: 'Phạm Văn Cường',
    CCCD: '001234567892',
    SoDienThoai: '0904567890',
    TinhTrangKienTruc: 'Mới',
    TinhTrangPhapLy: 'Đang hoàn thiện hồ sơ',
    SoGiayPhepXD: 'GP-2022-003456',
    NgayKiemTra: '2025-01-10',
    NguoiKiemTra: 'Trần Văn Bình',
    KetQuaKiemTra: 'Đạt',
    GhiChu: 'Mới xây xong, đang làm hoàn công'
  },
  {
    MaCongTrinh: 'CT003',
    TenCongTrinh: 'Nhà văn hóa phường ABC',
    LoaiCongTrinh: 'Công trình văn hóa',
    PhanLoai: 'Cấp 3',
    DiaChi: '890 Đường ZAB, Khu phố 5, phường ABC',
    MaThua: '890',
    SoTo: '56',
    DienTichSan: 800,
    SoTang: 2,
    NamXayDung: 2012,
    ChuSoHuu: 'UBND Phường ABC',
    CCCD: '',
    SoDienThoai: '0905678901',
    TinhTrangKienTruc: 'Trung bình',
    TinhTrangPhapLy: 'Hợp pháp',
    SoGiayPhepXD: 'GP-2012-004567',
    NgayKiemTra: '2024-09-15',
    NguoiKiemTra: 'Lê Thị Cúc',
    KetQuaKiemTra: 'Cần bảo trì',
    GhiChu: 'Hệ thống điện cần kiểm tra lại'
  },
  {
    MaCongTrinh: 'NO004',
    TenCongTrinh: 'Nhà ở hộ Hoàng Thị Em',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    PhanLoai: 'Cấp 4',
    DiaChi: '345 Đường CDE, Thôn 3, xã FGH',
    MaThua: '345',
    SoTo: '78',
    DienTichSan: 60,
    SoTang: 1,
    NamXayDung: 2000,
    ChuSoHuu: 'Hoàng Thị Em',
    CCCD: '001234567893',
    SoDienThoai: '0906789012',
    TinhTrangKienTruc: 'Xuống cấp nghiêm trọng',
    TinhTrangPhapLy: 'Không có giấy phép',
    SoGiayPhepXD: '',
    NgayKiemTra: '2025-01-12',
    NguoiKiemTra: 'Nguyễn Thị Dung',
    KetQuaKiemTra: 'Không đạt',
    GhiChu: 'Nhà cấp 4 cũ, nguy hiểm, cần di dời'
  }
];

const loaiCongTrinhOptions = ['Nhà ở riêng lẻ', 'Công trình giáo dục', 'Công trình y tế', 'Công trình văn hóa', 'Công trình thể thao', 'Công trình hành chính', 'Khác'];
const phanLoaiOptions = ['Cấp 1', 'Cấp 2', 'Cấp 3', 'Cấp 4', 'Đặc biệt'];
const tinhTrangKTOptions = ['Mới', 'Tốt', 'Trung bình', 'Xuống cấp', 'Xuống cấp nghiêm trọng'];
const tinhTrangPLOptions = ['Hợp pháp', 'Đang hoàn thiện hồ sơ', 'Không có giấy phép', 'Đang tranh chấp'];
const ketQuaKTOptions = ['Đạt', 'Cần bảo trì', 'Cần sửa chữa', 'Không đạt'];

export default function NhaOCongTrinhPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterTinhTrang, setFilterTinhTrang] = useState<string>('all');
  const [selectedCT, setSelectedCT] = useState<NhaOCongTrinh | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockCongTrinh.filter((item) => {
    const matchesSearch =
      item.MaCongTrinh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenCongTrinh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuSoHuu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiCongTrinh === filterLoai;
    const matchesTinhTrang = filterTinhTrang === 'all' || item.TinhTrangKienTruc === filterTinhTrang;
    return matchesSearch && matchesLoai && matchesTinhTrang;
  });

  const stats = {
    total: mockCongTrinh.length,
    nhaO: mockCongTrinh.filter(r => r.LoaiCongTrinh === 'Nhà ở riêng lẻ').length,
    congTrinh: mockCongTrinh.filter(r => r.LoaiCongTrinh !== 'Nhà ở riêng lẻ').length,
    dat: mockCongTrinh.filter(r => r.KetQuaKiemTra === 'Đạt').length,
    khongDat: mockCongTrinh.filter(r => r.KetQuaKiemTra === 'Không đạt' || r.KetQuaKiemTra === 'Cần sửa chữa').length,
    tongDienTich: mockCongTrinh.reduce((sum, r) => sum + r.DienTichSan, 0)
  };

  const getTinhTrangKTBadge = (tinhTrang: string) => {
    switch (tinhTrang) {
      case 'Mới': return <Badge className="bg-green-600 hover:bg-green-700">{tinhTrang}</Badge>;
      case 'Tốt': return <Badge className="bg-green-500 hover:bg-green-600">{tinhTrang}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600">{tinhTrang}</Badge>;
      case 'Xuống cấp': return <Badge className="bg-orange-500 hover:bg-orange-600">{tinhTrang}</Badge>;
      case 'Xuống cấp nghiêm trọng': return <Badge variant="destructive">{tinhTrang}</Badge>;
      default: return <Badge variant="secondary">{tinhTrang}</Badge>;
    }
  };

  const getKetQuaBadge = (ketQua: string) => {
    switch (ketQua) {
      case 'Đạt': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{ketQua}</Badge>;
      case 'Cần bảo trì': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{ketQua}</Badge>;
      case 'Cần sửa chữa': return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertTriangle className="h-3 w-3 mr-1" />{ketQua}</Badge>;
      case 'Không đạt': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{ketQua}</Badge>;
      default: return <Badge variant="secondary">{ketQua}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Nhà ở & Công trình</h1>
              <p className="text-indigo-100">Quản lý nhà ở, công trình công cộng trên địa bàn</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-indigo-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm công trình
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm nhà ở / công trình mới</DialogTitle>
                <DialogDescription>Nhập thông tin công trình cần quản lý</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại công trình *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiCongTrinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phân loại *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn cấp" /></SelectTrigger>
                    <SelectContent>
                      {phanLoaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Tên công trình *</Label>
                  <Input placeholder="Nhập tên công trình" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ *</Label>
                  <Input placeholder="Nhập địa chỉ" />
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa</Label>
                  <Input placeholder="Nhập mã thửa" />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ</Label>
                  <Input placeholder="Nhập số tờ" />
                </div>
                <div className="space-y-2">
                  <Label>Diện tích sàn (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích" />
                </div>
                <div className="space-y-2">
                  <Label>Số tầng</Label>
                  <Input type="number" placeholder="Nhập số tầng" />
                </div>
                <div className="space-y-2">
                  <Label>Năm xây dựng</Label>
                  <Input type="number" placeholder="Nhập năm" />
                </div>
                <div className="space-y-2">
                  <Label>Số GPXD</Label>
                  <Input placeholder="Nhập số giấy phép" />
                </div>
                <div className="col-span-2 border-t pt-4 mt-2">
                  <h4 className="font-semibold mb-3">Chủ sở hữu</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Họ tên / Tên đơn vị *</Label>
                      <Input placeholder="Nhập tên" />
                    </div>
                    <div className="space-y-2">
                      <Label>CCCD/MST</Label>
                      <Input placeholder="Nhập số" />
                    </div>
                    <div className="space-y-2">
                      <Label>Điện thoại</Label>
                      <Input placeholder="Nhập SĐT" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tình trạng kiến trúc</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn tình trạng" /></SelectTrigger>
                    <SelectContent>
                      {tinhTrangKTOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tình trạng pháp lý</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn tình trạng" /></SelectTrigger>
                    <SelectContent>
                      {tinhTrangPLOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày kiểm tra</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Người kiểm tra</Label>
                  <Input placeholder="Nhập người kiểm tra" />
                </div>
                <div className="space-y-2">
                  <Label>Kết quả kiểm tra</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn kết quả" /></SelectTrigger>
                    <SelectContent>
                      {ketQuaKTOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>Thêm mới</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng công trình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nhà ở</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.nhaO}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Công trình CC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.congTrinh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">KT đạt chuẩn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.dat}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cần kiểm tra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.khongDat}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng DT (m²)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-teal-500" />
              <span className="text-2xl font-bold">{stats.tongDienTich.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, tên, chủ sở hữu, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại công trình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiCongTrinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTinhTrang} onValueChange={setFilterTinhTrang}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tình trạng</SelectItem>
                {tinhTrangKTOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhà ở, công trình</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} công trình</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã CT</TableHead>
                <TableHead>Tên công trình</TableHead>
                <TableHead>Loại / Cấp</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>DT / Tầng</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead>Kết quả KT</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaCongTrinh}>
                  <TableCell className="font-medium text-primary">{item.MaCongTrinh}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate" title={item.TenCongTrinh}>
                      {item.TenCongTrinh}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <Badge variant="outline">{item.LoaiCongTrinh}</Badge>
                      <div className="text-muted-foreground text-xs mt-1">{item.PhanLoai}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.DiaChi}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.DiaChi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{item.DienTichSan}m² / {item.SoTang} tầng</div>
                      <div className="text-muted-foreground text-xs">XD: {item.NamXayDung}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTinhTrangKTBadge(item.TinhTrangKienTruc)}</TableCell>
                  <TableCell>{getKetQuaBadge(item.KetQuaKiemTra)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedCT?.MaCongTrinh === item.MaCongTrinh} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedCT(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCT(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết công trình</DialogTitle>
                            <DialogDescription>{item.TenCongTrinh}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã công trình</p>
                              <p className="font-medium">{item.MaCongTrinh}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại / Phân loại</p>
                              <div>
                                <Badge variant="outline">{item.LoaiCongTrinh}</Badge>
                                <span className="ml-2">{item.PhanLoai}</span>
                              </div>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Năm xây dựng</p>
                              <p className="font-medium">{item.NamXayDung}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diện tích sàn</p>
                              <p className="font-medium">{item.DienTichSan} m²</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số tầng</p>
                              <p className="font-medium">{item.SoTang}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Chủ sở hữu</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.ChuSoHuu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD</p>
                                  <p className="font-medium">{item.CCCD || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                                  <p className="font-medium">{item.SoDienThoai}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Tình trạng</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Kiến trúc</p>
                                  {getTinhTrangKTBadge(item.TinhTrangKienTruc)}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Pháp lý</p>
                                  <p className="font-medium">{item.TinhTrangPhapLy}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số GPXD</p>
                                  <p className="font-medium">{item.SoGiayPhepXD || 'Không có'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Kiểm tra gần nhất</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày kiểm tra</p>
                                  <p className="font-medium">{item.NgayKiemTra}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Người kiểm tra</p>
                                  <p className="font-medium">{item.NguoiKiemTra}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Kết quả</p>
                                  {getKetQuaBadge(item.KetQuaKiemTra)}
                                </div>
                              </div>
                            </div>
                            {item.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium">{item.GhiChu}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Dialog */}
                      <Dialog open={isEditOpen && selectedCT?.MaCongTrinh === item.MaCongTrinh} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedCT(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCT(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật công trình</DialogTitle>
                            <DialogDescription>{item.TenCongTrinh}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin công trình</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Tên công trình</Label>
                                  <Input defaultValue={item.TenCongTrinh} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại công trình</Label>
                                  <Input defaultValue={item.LoaiCongTrinh} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Phân loại</Label>
                                  <Input defaultValue={item.PhanLoai} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ</Label>
                                  <Input defaultValue={item.DiaChi} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mã thửa</Label>
                                  <Input defaultValue={item.MaThua} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số tờ</Label>
                                  <Input defaultValue={item.SoTo} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Năm xây dựng</Label>
                                  <Input type="number" defaultValue={item.NamXayDung} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Diện tích sàn (m²)</Label>
                                  <Input type="number" defaultValue={item.DienTichSan} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số tầng</Label>
                                  <Input type="number" defaultValue={item.SoTang} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Chủ sở hữu</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Họ tên</Label>
                                  <Input defaultValue={item.ChuSoHuu} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD</Label>
                                  <Input defaultValue={item.CCCD} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Điện thoại</Label>
                                  <Input defaultValue={item.SoDienThoai} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Tình trạng</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Tình trạng kiến trúc</Label>
                                  <Select defaultValue={item.TinhTrangKienTruc}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {tinhTrangKTOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Tình trạng pháp lý</Label>
                                  <Select defaultValue={item.TinhTrangPhapLy}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {tinhTrangPLOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Số GPXD</Label>
                                  <Input defaultValue={item.SoGiayPhepXD} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Kiểm tra</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngày kiểm tra</Label>
                                  <Input type="date" defaultValue={item.NgayKiemTra} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Người kiểm tra</Label>
                                  <Input defaultValue={item.NguoiKiemTra} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Kết quả kiểm tra</Label>
                                  <Select defaultValue={item.KetQuaKiemTra}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {ketQuaKTOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Ghi chú</Label>
                              <Textarea defaultValue={item.GhiChu} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                            <Button onClick={() => setIsEditOpen(false)}>Cập nhật</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
