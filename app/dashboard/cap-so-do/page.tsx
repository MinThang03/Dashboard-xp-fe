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
import { Progress } from '@/components/ui/progress';
import { 
  FileCheck, Clock, CheckCircle2, TrendingUp, Search, Plus, Download,
  Eye, Edit, AlertTriangle, Calendar, User, FileText, ClipboardList, 
  XCircle, RotateCw, Send
} from 'lucide-react';

// Mock data hồ sơ cấp sổ đỏ
interface HoSoCapSoDo {
  MaHoSo: string;
  ChuSoHuu: string;
  CCCD: string;
  SoDienThoai: string;
  DiaChiThuaDat: string;
  MaThua: string;
  SoTo: string;
  DienTich: number;
  LoaiDat: string;
  NgayNop: string;
  NgayHenTra: string;
  TrangThai: string;
  GiaiDoan: string;
  CanBoTiepNhan: string;
  CanBoThamDinh: string;
  SoSoDo: string;
  NgayCap: string;
  GhiChu: string;
  TienDo: number;
}

const mockCapSoDo: HoSoCapSoDo[] = [
  {
    MaHoSo: 'SD001',
    ChuSoHuu: 'Nguyễn Văn An',
    CCCD: '001234567890',
    SoDienThoai: '0901234567',
    DiaChiThuaDat: 'Thửa 123, Tờ 45, Khu phố 3',
    MaThua: '123',
    SoTo: '45',
    DienTich: 120.5,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-05',
    NgayHenTra: '2025-01-25',
    TrangThai: 'Đã cấp',
    GiaiDoan: 'Hoàn thành',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: 'Nguyễn Thị Lan',
    SoSoDo: 'AO 123456',
    NgayCap: '2025-01-20',
    GhiChu: '',
    TienDo: 100
  },
  {
    MaHoSo: 'SD002',
    ChuSoHuu: 'Trần Thị Bình',
    CCCD: '001234567891',
    SoDienThoai: '0902345678',
    DiaChiThuaDat: 'Thửa 456, Tờ 67, Khu phố 2',
    MaThua: '456',
    SoTo: '67',
    DienTich: 85.3,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-10',
    NgayHenTra: '2025-01-30',
    TrangThai: 'Đang xử lý',
    GiaiDoan: 'Thẩm định thực địa',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Phạm Thị Dung',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Đang đo đạc thực địa',
    TienDo: 60
  },
  {
    MaHoSo: 'SD003',
    ChuSoHuu: 'Lê Văn Cường',
    CCCD: '001234567892',
    SoDienThoai: '0903456789',
    DiaChiThuaDat: 'Thửa 789, Tờ 89, Thôn 1',
    MaThua: '789',
    SoTo: '89',
    DienTich: 200.0,
    LoaiDat: 'Đất nông nghiệp',
    NgayNop: '2025-01-12',
    NgayHenTra: '2025-02-02',
    TrangThai: 'Chờ thẩm định',
    GiaiDoan: 'Tiếp nhận hồ sơ',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: '',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Hồ sơ đầy đủ, chờ phân công',
    TienDo: 20
  },
  {
    MaHoSo: 'SD004',
    ChuSoHuu: 'Phạm Thị Dung',
    CCCD: '001234567893',
    SoDienThoai: '0904567890',
    DiaChiThuaDat: 'Thửa 234, Tờ 12, Khu phố 1',
    MaThua: '234',
    SoTo: '12',
    DienTich: 150.8,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-08',
    NgayHenTra: '2025-01-28',
    TrangThai: 'Bổ sung hồ sơ',
    GiaiDoan: 'Yêu cầu bổ sung',
    CanBoTiepNhan: 'Nguyễn Thị Lan',
    CanBoThamDinh: 'Lê Văn Cường',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Thiếu giấy tờ chứng minh nguồn gốc đất',
    TienDo: 40
  },
  {
    MaHoSo: 'SD005',
    ChuSoHuu: 'Hoàng Văn Em',
    CCCD: '001234567894',
    SoDienThoai: '0905678901',
    DiaChiThuaDat: 'Thửa 567, Tờ 34, Khu phố 4',
    MaThua: '567',
    SoTo: '34',
    DienTich: 95.2,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-06',
    NgayHenTra: '2025-01-26',
    TrangThai: 'Đang xử lý',
    GiaiDoan: 'Trình ký',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: 'Nguyễn Thị Lan',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Đang chờ lãnh đạo ký duyệt',
    TienDo: 80
  },
  {
    MaHoSo: 'SD006',
    ChuSoHuu: 'Nguyễn Thị Phương',
    CCCD: '001234567895',
    SoDienThoai: '0906789012',
    DiaChiThuaDat: 'Thửa 890, Tờ 56, Thôn 2',
    MaThua: '890',
    SoTo: '56',
    DienTich: 300.0,
    LoaiDat: 'Đất nông nghiệp',
    NgayNop: '2025-01-03',
    NgayHenTra: '2025-01-23',
    TrangThai: 'Đã cấp',
    GiaiDoan: 'Hoàn thành',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Phạm Thị Dung',
    SoSoDo: 'AO 123457',
    NgayCap: '2025-01-18',
    GhiChu: '',
    TienDo: 100
  },
  {
    MaHoSo: 'SD007',
    ChuSoHuu: 'Lê Văn Giang',
    CCCD: '001234567896',
    SoDienThoai: '0907890123',
    DiaChiThuaDat: 'Thửa 345, Tờ 78, Khu phố 5',
    MaThua: '345',
    SoTo: '78',
    DienTich: 180.5,
    LoaiDat: 'Đất hỗn hợp',
    NgayNop: '2025-01-15',
    NgayHenTra: '2025-02-05',
    TrangThai: 'Từ chối',
    GiaiDoan: 'Kết thúc',
    CanBoTiepNhan: 'Nguyễn Thị Lan',
    CanBoThamDinh: 'Trần Văn Bình',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Đất không đủ điều kiện cấp sổ (đang tranh chấp)',
    TienDo: 0
  },
  {
    MaHoSo: 'SD008',
    ChuSoHuu: 'Trần Văn Hải',
    CCCD: '001234567897',
    SoDienThoai: '0908901234',
    DiaChiThuaDat: 'Thửa 678, Tờ 90, Khu phố 3',
    MaThua: '678',
    SoTo: '90',
    DienTich: 110.0,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-18',
    NgayHenTra: '2025-02-08',
    TrangThai: 'Chờ thẩm định',
    GiaiDoan: 'Tiếp nhận hồ sơ',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: '',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Hồ sơ mới tiếp nhận',
    TienDo: 10
  }
];

const trangThaiOptions = ['Chờ thẩm định', 'Đang xử lý', 'Bổ sung hồ sơ', 'Đã cấp', 'Từ chối'];
const giaiDoanOptions = ['Tiếp nhận hồ sơ', 'Thẩm định thực địa', 'Xét duyệt', 'Trình ký', 'In sổ', 'Hoàn thành', 'Yêu cầu bổ sung', 'Kết thúc'];
const loaiDatOptions = ['Đất ở', 'Đất nông nghiệp', 'Đất thương mại', 'Đất hỗn hợp'];

export default function CapSoDoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoCapSoDo | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockCapSoDo.filter((item) => {
    const matchesSearch =
      item.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuSoHuu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.CCCD.includes(searchQuery) ||
      item.DiaChiThuaDat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.TrangThai === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockCapSoDo.length,
    choThamDinh: mockCapSoDo.filter(r => r.TrangThai === 'Chờ thẩm định').length,
    dangXuLy: mockCapSoDo.filter(r => r.TrangThai === 'Đang xử lý').length,
    boSungHS: mockCapSoDo.filter(r => r.TrangThai === 'Bổ sung hồ sơ').length,
    daCap: mockCapSoDo.filter(r => r.TrangThai === 'Đã cấp').length,
    tuChoi: mockCapSoDo.filter(r => r.TrangThai === 'Từ chối').length,
    tyLeHoanThanh: ((mockCapSoDo.filter(r => r.TrangThai === 'Đã cấp').length / mockCapSoDo.length) * 100).toFixed(1)
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã cấp': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-blue-500 hover:bg-blue-600"><RotateCw className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ thẩm định': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Bổ sung hồ sơ': return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertTriangle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Từ chối': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getTienDoColor = (tienDo: number) => {
    if (tienDo === 100) return 'bg-green-500';
    if (tienDo >= 60) return 'bg-blue-500';
    if (tienDo >= 30) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-status-danger to-primary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileCheck className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Cấp Sổ đỏ</h1>
              <p className="text-rose-100">Theo dõi tiến độ cấp giấy chứng nhận quyền sử dụng đất</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-rose-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Tiếp nhận hồ sơ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tiếp nhận hồ sơ cấp sổ đỏ mới</DialogTitle>
                <DialogDescription>Nhập thông tin hồ sơ đề nghị cấp giấy chứng nhận</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Chủ sở hữu *</Label>
                  <Input placeholder="Nhập họ tên chủ sở hữu" />
                </div>
                <div className="space-y-2">
                  <Label>CCCD *</Label>
                  <Input placeholder="Nhập số CCCD" />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="Nhập số điện thoại" />
                </div>
                <div className="space-y-2">
                  <Label>Loại đất *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại đất" /></SelectTrigger>
                    <SelectContent>
                      {loaiDatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa *</Label>
                  <Input placeholder="Nhập mã thửa" />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ *</Label>
                  <Input placeholder="Nhập số tờ" />
                </div>
                <div className="space-y-2">
                  <Label>Diện tích (m²) *</Label>
                  <Input type="number" placeholder="Nhập diện tích" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày hẹn trả</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ thửa đất *</Label>
                  <Input placeholder="Nhập địa chỉ chi tiết" />
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ tiếp nhận</Label>
                  <Input placeholder="Tên cán bộ" />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select defaultValue="Chờ thẩm định">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
                <Button onClick={() => setIsAddOpen(false)}>Tiếp nhận</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ thẩm định</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.choThamDinh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <RotateCw className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.dangXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bổ sung HS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.boSungHS}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daCap}</span>
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

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ HT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold">{stats.tyLeHoanThanh}%</span>
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
                placeholder="Tìm theo mã, chủ sở hữu, CCCD, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
          <CardTitle>Danh sách hồ sơ cấp sổ đỏ</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead>Thửa/Tờ</TableHead>
                <TableHead className="text-right">DT (m²)</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Hẹn trả</TableHead>
                <TableHead>Giai đoạn</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaHoSo}>
                  <TableCell className="font-medium text-primary">{item.MaHoSo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.ChuSoHuu}</div>
                        <div className="text-xs text-muted-foreground">{item.SoDienThoai}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Thửa: {item.MaThua}</div>
                      <div className="text-muted-foreground">Tờ: {item.SoTo}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{item.DienTich}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayNop}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {item.NgayHenTra}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.GiaiDoan}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.TienDo} className={`w-16 h-2 [&>div]:${getTienDoColor(item.TienDo)}`} />
                      <span className="text-xs text-muted-foreground">{item.TienDo}%</span>
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
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết hồ sơ cấp sổ đỏ</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Chủ sở hữu</p>
                              <p className="font-medium">{item.ChuSoHuu}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">CCCD</p>
                              <p className="font-medium">{item.CCCD}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số điện thoại</p>
                              <p className="font-medium">{item.SoDienThoai}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại đất</p>
                              <p className="font-medium">{item.LoaiDat}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ thửa đất</p>
                              <p className="font-medium">{item.DiaChiThuaDat}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diện tích</p>
                              <p className="font-medium">{item.DienTich} m²</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày nộp</p>
                              <p className="font-medium">{item.NgayNop}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày hẹn trả</p>
                              <p className="font-medium">{item.NgayHenTra}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cán bộ tiếp nhận</p>
                              <p className="font-medium">{item.CanBoTiepNhan}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cán bộ thẩm định</p>
                              <p className="font-medium">{item.CanBoThamDinh || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Giai đoạn</p>
                              <Badge variant="outline">{item.GiaiDoan}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tiến độ</p>
                              <div className="flex items-center gap-2">
                                <Progress value={item.TienDo} className="flex-1" />
                                <span className="font-medium">{item.TienDo}%</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số sổ đỏ</p>
                              <p className="font-medium">{item.SoSoDo || 'Chưa cấp'}</p>
                            </div>
                            {item.NgayCap && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Ngày cấp</p>
                                <p className="font-medium">{item.NgayCap}</p>
                              </div>
                            )}
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
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật hồ sơ</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin chủ sở hữu</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Chủ sở hữu</Label>
                                  <Input defaultValue={item.ChuSoHuu} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD</Label>
                                  <Input defaultValue={item.CCCD} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số điện thoại</Label>
                                  <Input defaultValue={item.SoDienThoai} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin thửa đất</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ thửa đất</Label>
                                  <Input defaultValue={item.DiaChiThuaDat} />
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
                                  <Label>Diện tích (m²)</Label>
                                  <Input type="number" defaultValue={item.DienTich} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại đất</Label>
                                  <Input defaultValue={item.LoaiDat} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Xử lý hồ sơ</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngày nộp</Label>
                                  <Input type="date" defaultValue={item.NgayNop} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày hẹn trả</Label>
                                  <Input type="date" defaultValue={item.NgayHenTra} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Cán bộ tiếp nhận</Label>
                                  <Input defaultValue={item.CanBoTiepNhan} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Cán bộ thẩm định</Label>
                                  <Input defaultValue={item.CanBoThamDinh} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Giai đoạn xử lý</Label>
                                  <Select defaultValue={item.GiaiDoan}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {giaiDoanOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
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
                                  <Label>Tiến độ (%)</Label>
                                  <Input type="number" min="0" max="100" defaultValue={item.TienDo} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin cấp sổ</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Số sổ đỏ</Label>
                                  <Input defaultValue={item.SoSoDo} placeholder="Nhập khi đã cấp" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày cấp</Label>
                                  <Input type="date" defaultValue={item.NgayCap} />
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

      {/* Cảnh báo hồ sơ cần bổ sung */}
      {stats.boSungHS > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Hồ sơ cần bổ sung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Có <strong>{stats.boSungHS}</strong> hồ sơ đang chờ công dân bổ sung giấy tờ. Cần thông báo và hướng dẫn.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
