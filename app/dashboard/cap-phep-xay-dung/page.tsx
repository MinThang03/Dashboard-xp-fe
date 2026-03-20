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
  Hammer, FileCheck, Building2, AlertTriangle, Search, Plus, Download, Eye, Edit,
  Clock, CheckCircle2, XCircle, MapPin, Calendar, User, Ruler
} from 'lucide-react';

// Mock data cấp phép xây dựng
interface HoSoCapPhep {
  MaHoSo: string;
  LoaiCongTrinh: string;
  LoaiGiayPhep: string;
  ChuDauTu: string;
  CCCD: string;
  SoDienThoai: string;
  DiaChi: string;
  DiaChiCongTrinh: string;
  MaThua: string;
  SoTo: string;
  DienTichXayDung: number;
  DienTichSan: number;
  SoTang: number;
  ChieuCao: number;
  NgayNop: string;
  NgayHenTra: string;
  TrangThai: string;
  CanBoTiepNhan: string;
  CanBoThamDinh: string;
  SoGiayPhep: string;
  NgayCapPhep: string;
  ThoiHanPhep: string;
  GhiChu: string;
}

const mockCapPhepXD: HoSoCapPhep[] = [
  {
    MaHoSo: 'XD001',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    LoaiGiayPhep: 'Xây dựng mới',
    ChuDauTu: 'Nguyễn Văn An',
    CCCD: '001234567890',
    SoDienThoai: '0901234567',
    DiaChi: '123 Đường ABC, phường XYZ',
    DiaChiCongTrinh: 'Thửa 123, tờ 45, Khu phố 3, phường ABC',
    MaThua: '123',
    SoTo: '45',
    DienTichXayDung: 80,
    DienTichSan: 240,
    SoTang: 3,
    ChieuCao: 12.5,
    NgayNop: '2025-01-05',
    NgayHenTra: '2025-01-20',
    TrangThai: 'Đang thẩm định',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Trần Thị Dung',
    SoGiayPhep: '',
    NgayCapPhep: '',
    ThoiHanPhep: '',
    GhiChu: 'Hồ sơ đầy đủ, đang thẩm định bản vẽ'
  },
  {
    MaHoSo: 'XD002',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    LoaiGiayPhep: 'Sửa chữa, cải tạo',
    ChuDauTu: 'Trần Thị Bình',
    CCCD: '001234567891',
    SoDienThoai: '0902345678',
    DiaChi: '456 Đường DEF, phường GHI',
    DiaChiCongTrinh: 'Thửa 456, tờ 67, Khu phố 1, phường GHI',
    MaThua: '456',
    SoTo: '67',
    DienTichXayDung: 60,
    DienTichSan: 60,
    SoTang: 1,
    ChieuCao: 4.5,
    NgayNop: '2025-01-08',
    NgayHenTra: '2025-01-23',
    TrangThai: 'Chờ xử lý',
    CanBoTiepNhan: 'Phạm Thị Em',
    CanBoThamDinh: '',
    SoGiayPhep: '',
    NgayCapPhep: '',
    ThoiHanPhep: '',
    GhiChu: 'Thiếu bản vẽ kết cấu'
  },
  {
    MaHoSo: 'XD003',
    LoaiCongTrinh: 'Công trình thương mại',
    LoaiGiayPhep: 'Xây dựng mới',
    ChuDauTu: 'Công ty TNHH ABC',
    CCCD: '0108765432',
    SoDienThoai: '0903456789',
    DiaChi: '789 Đường KLM, quận NOP',
    DiaChiCongTrinh: 'Thửa 789, tờ 89, Khu phố 5, phường KLM',
    MaThua: '789',
    SoTo: '89',
    DienTichXayDung: 500,
    DienTichSan: 2500,
    SoTang: 5,
    ChieuCao: 22,
    NgayNop: '2024-12-15',
    NgayHenTra: '2025-01-15',
    TrangThai: 'Đã cấp phép',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Nguyễn Thị Giang',
    SoGiayPhep: 'GP-2025-001234',
    NgayCapPhep: '2025-01-10',
    ThoiHanPhep: '24 tháng',
    GhiChu: ''
  },
  {
    MaHoSo: 'XD004',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    LoaiGiayPhep: 'Xây dựng mới',
    ChuDauTu: 'Hoàng Văn Đức',
    CCCD: '001234567892',
    SoDienThoai: '0904567890',
    DiaChi: '234 Đường QRS, phường TUV',
    DiaChiCongTrinh: 'Thửa 234, tờ 12, Khu phố 2, phường TUV',
    MaThua: '234',
    SoTo: '12',
    DienTichXayDung: 100,
    DienTichSan: 400,
    SoTang: 4,
    ChieuCao: 16,
    NgayNop: '2024-12-20',
    NgayHenTra: '2025-01-05',
    TrangThai: 'Từ chối',
    CanBoTiepNhan: 'Phạm Thị Em',
    CanBoThamDinh: 'Trần Thị Dung',
    SoGiayPhep: '',
    NgayCapPhep: '',
    ThoiHanPhep: '',
    GhiChu: 'Vi phạm mật độ xây dựng theo quy hoạch'
  },
  {
    MaHoSo: 'XD005',
    LoaiCongTrinh: 'Nhà xưởng',
    LoaiGiayPhep: 'Xây dựng mới',
    ChuDauTu: 'Công ty CP XYZ',
    CCCD: '0109876543',
    SoDienThoai: '0905678901',
    DiaChi: 'Lô A1, KCN ABC',
    DiaChiCongTrinh: 'Lô A1, KCN ABC',
    MaThua: 'A1',
    SoTo: 'KCN',
    DienTichXayDung: 2000,
    DienTichSan: 2000,
    SoTang: 1,
    ChieuCao: 12,
    NgayNop: '2024-11-25',
    NgayHenTra: '2024-12-25',
    TrangThai: 'Đã cấp phép',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Nguyễn Thị Giang',
    SoGiayPhep: 'GP-2024-005678',
    NgayCapPhep: '2024-12-20',
    ThoiHanPhep: '18 tháng',
    GhiChu: ''
  },
  {
    MaHoSo: 'XD006',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    LoaiGiayPhep: 'Xây dựng mới',
    ChuDauTu: 'Lê Thị Hương',
    CCCD: '001234567893',
    SoDienThoai: '0906789012',
    DiaChi: '567 Đường WXY, phường ZAB',
    DiaChiCongTrinh: 'Thửa 567, tờ 34, Khu phố 4, phường ZAB',
    MaThua: '567',
    SoTo: '34',
    DienTichXayDung: 70,
    DienTichSan: 210,
    SoTang: 3,
    ChieuCao: 11.5,
    NgayNop: '2025-01-10',
    NgayHenTra: '2025-01-25',
    TrangThai: 'Chờ xử lý',
    CanBoTiepNhan: 'Phạm Thị Em',
    CanBoThamDinh: '',
    SoGiayPhep: '',
    NgayCapPhep: '',
    ThoiHanPhep: '',
    GhiChu: 'Mới tiếp nhận'
  },
  {
    MaHoSo: 'XD007',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    LoaiGiayPhep: 'Cơi nới, mở rộng',
    ChuDauTu: 'Phạm Văn Khánh',
    CCCD: '001234567894',
    SoDienThoai: '0907890123',
    DiaChi: '890 Đường CDE, phường FGH',
    DiaChiCongTrinh: 'Thửa 890, tờ 56, Khu phố 6, phường FGH',
    MaThua: '890',
    SoTo: '56',
    DienTichXayDung: 30,
    DienTichSan: 30,
    SoTang: 1,
    ChieuCao: 4,
    NgayNop: '2025-01-12',
    NgayHenTra: '2025-01-27',
    TrangThai: 'Đang thẩm định',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Trần Thị Dung',
    SoGiayPhep: '',
    NgayCapPhep: '',
    ThoiHanPhep: '',
    GhiChu: 'Đã kiểm tra thực địa'
  }
];

const loaiCongTrinhOptions = ['Nhà ở riêng lẻ', 'Công trình thương mại', 'Nhà xưởng', 'Công trình công cộng', 'Khác'];
const loaiGiayPhepOptions = ['Xây dựng mới', 'Sửa chữa, cải tạo', 'Cơi nới, mở rộng', 'Phá dỡ'];
const trangThaiOptions = ['Chờ xử lý', 'Đang thẩm định', 'Chờ phê duyệt', 'Đã cấp phép', 'Từ chối', 'Bổ sung hồ sơ'];

export default function CapPhepXayDungPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoCapPhep | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockCapPhepXD.filter((item) => {
    const matchesSearch =
      item.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuDauTu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.CCCD.includes(searchQuery) ||
      item.DiaChiCongTrinh.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.TrangThai === filterStatus;
    const matchesLoai = filterLoai === 'all' || item.LoaiCongTrinh === filterLoai;
    return matchesSearch && matchesStatus && matchesLoai;
  });

  const stats = {
    total: mockCapPhepXD.length,
    choXuLy: mockCapPhepXD.filter(r => r.TrangThai === 'Chờ xử lý').length,
    dangThamDinh: mockCapPhepXD.filter(r => r.TrangThai === 'Đang thẩm định').length,
    daCapPhep: mockCapPhepXD.filter(r => r.TrangThai === 'Đã cấp phép').length,
    tuChoi: mockCapPhepXD.filter(r => r.TrangThai === 'Từ chối').length,
    tongDienTich: mockCapPhepXD.reduce((sum, r) => sum + r.DienTichXayDung, 0)
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã cấp phép': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang thẩm định': return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ xử lý': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Từ chối': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Bổ sung hồ sơ': return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertTriangle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-status-warning via-accent to-status-warning rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Hammer className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Cấp phép Xây dựng</h1>
              <p className="text-orange-100">Tiếp nhận và xử lý hồ sơ cấp phép xây dựng</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-orange-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Tiếp nhận hồ sơ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tiếp nhận hồ sơ cấp phép xây dựng</DialogTitle>
                <DialogDescription>Nhập thông tin hồ sơ đề nghị cấp phép</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại công trình *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại công trình" /></SelectTrigger>
                    <SelectContent>
                      {loaiCongTrinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Loại giấy phép *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại giấy phép" /></SelectTrigger>
                    <SelectContent>
                      {loaiGiayPhepOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chủ đầu tư *</Label>
                  <Input placeholder="Nhập tên chủ đầu tư" />
                </div>
                <div className="space-y-2">
                  <Label>CCCD/MST *</Label>
                  <Input placeholder="Nhập số CCCD hoặc MST" />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="Nhập số điện thoại" />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ liên hệ</Label>
                  <Input placeholder="Nhập địa chỉ" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ công trình *</Label>
                  <Input placeholder="Nhập địa chỉ xây dựng" />
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
                  <Label>DT xây dựng (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích" />
                </div>
                <div className="space-y-2">
                  <Label>DT sàn (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích sàn" />
                </div>
                <div className="space-y-2">
                  <Label>Số tầng</Label>
                  <Input type="number" placeholder="Nhập số tầng" />
                </div>
                <div className="space-y-2">
                  <Label>Chiều cao (m)</Label>
                  <Input type="number" step="0.1" placeholder="Nhập chiều cao" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày nộp</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ tiếp nhận</Label>
                  <Input placeholder="Nhập tên cán bộ" />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái hồ sơ</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                    <SelectContent>
                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ thẩm định</Label>
                  <Input placeholder="Nhập tên cán bộ" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày hẹn trả</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Số giấy phép</Label>
                  <Input placeholder="GP-YYYY-XXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày cấp phép</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Thời hạn phép</Label>
                  <Input placeholder="VD: 24 tháng" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>Tiếp nhận</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.choXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang thẩm định</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.dangThamDinh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã cấp phép</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daCapPhep}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Từ chối</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.tuChoi}</span>
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
                placeholder="Tìm theo mã hồ sơ, chủ đầu tư, CCCD..."
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
                <SelectItem value="all">Tất cả loại CT</SelectItem>
                {loaiCongTrinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
          <CardTitle>Danh sách hồ sơ cấp phép xây dựng</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HS</TableHead>
                <TableHead>Loại CT</TableHead>
                <TableHead>Chủ đầu tư</TableHead>
                <TableHead>Địa chỉ CT</TableHead>
                <TableHead>DT/Tầng</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaHoSo}>
                  <TableCell className="font-medium text-primary">{item.MaHoSo}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <Badge variant="outline">{item.LoaiCongTrinh}</Badge>
                      <div className="text-muted-foreground text-xs mt-1">{item.LoaiGiayPhep}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      {item.ChuDauTu}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.DiaChiCongTrinh}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.DiaChiCongTrinh}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{item.DienTichXayDung}m² / {item.SoTang} tầng</div>
                      <div className="text-muted-foreground text-xs">Cao: {item.ChieuCao}m</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayNop}
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedHoSo?.MaHoSo === item.MaHoSo} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedHoSo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedHoSo(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết hồ sơ cấp phép</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại công trình</p>
                              <Badge variant="outline">{item.LoaiCongTrinh}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại giấy phép</p>
                              <p className="font-medium">{item.LoaiGiayPhep}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin chủ đầu tư</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên/Tên đơn vị</p>
                                  <p className="font-medium">{item.ChuDauTu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD/MST</p>
                                  <p className="font-medium">{item.CCCD}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                                  <p className="font-medium">{item.SoDienThoai}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                                  <p className="font-medium">{item.DiaChi}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin công trình</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Địa chỉ công trình</p>
                                  <p className="font-medium">{item.DiaChiCongTrinh}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                                  <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">DT xây dựng</p>
                                  <p className="font-medium">{item.DienTichXayDung} m²</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">DT sàn</p>
                                  <p className="font-medium">{item.DienTichSan} m²</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số tầng</p>
                                  <p className="font-medium">{item.SoTang}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Chiều cao</p>
                                  <p className="font-medium">{item.ChieuCao} m</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin xử lý</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày nộp / Hẹn trả</p>
                                  <p className="font-medium">{item.NgayNop} / {item.NgayHenTra}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                                  {getTrangThaiBadge(item.TrangThai)}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CB tiếp nhận</p>
                                  <p className="font-medium">{item.CanBoTiepNhan}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CB thẩm định</p>
                                  <p className="font-medium">{item.CanBoThamDinh || 'Chưa phân công'}</p>
                                </div>
                                {item.SoGiayPhep && (
                                  <>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Số giấy phép</p>
                                      <p className="font-medium text-primary">{item.SoGiayPhep}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Ngày cấp / Thời hạn</p>
                                      <p className="font-medium">{item.NgayCapPhep} / {item.ThoiHanPhep}</p>
                                    </div>
                                  </>
                                )}
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
                      <Dialog open={isEditOpen && selectedHoSo?.MaHoSo === item.MaHoSo} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedHoSo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedHoSo(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật hồ sơ</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin hồ sơ</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại công trình</Label>
                                  <Input defaultValue={item.LoaiCongTrinh} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại giấy phép</Label>
                                  <Input defaultValue={item.LoaiGiayPhep} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin chủ đầu tư</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Chủ đầu tư</Label>
                                  <Input defaultValue={item.ChuDauTu} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD/MST</Label>
                                  <Input defaultValue={item.CCCD} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số điện thoại</Label>
                                  <Input defaultValue={item.SoDienThoai} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ</Label>
                                  <Input defaultValue={item.DiaChi} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin công trình</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ công trình</Label>
                                  <Input defaultValue={item.DiaChiCongTrinh} />
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
                                  <Label>DT xây dựng (m²)</Label>
                                  <Input type="number" defaultValue={item.DienTichXayDung} />
                                </div>
                                <div className="space-y-2">
                                  <Label>DT sàn (m²)</Label>
                                  <Input type="number" defaultValue={item.DienTichSan} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số tầng</Label>
                                  <Input type="number" defaultValue={item.SoTang} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Chiều cao (m)</Label>
                                  <Input type="number" defaultValue={item.ChieuCao} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Xử lý hồ sơ</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Trạng thái</Label>
                                  <Select defaultValue={item.TrangThai}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>CB tiếp nhận</Label>
                                  <Input defaultValue={item.CanBoTiepNhan} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CB thẩm định</Label>
                                  <Input defaultValue={item.CanBoThamDinh} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày hẹn trả</Label>
                                  <Input type="date" defaultValue={item.NgayHenTra} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số giấy phép</Label>
                                  <Input defaultValue={item.SoGiayPhep} placeholder="GP-YYYY-XXXXXX" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày cấp phép</Label>
                                  <Input type="date" defaultValue={item.NgayCapPhep} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Thời hạn phép</Label>
                                  <Input defaultValue={item.ThoiHanPhep} placeholder="VD: 24 tháng" />
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
