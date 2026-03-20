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
  Map, MapPin, CheckCircle2, Clock, Search, Plus, Download, Eye, Edit,
  User, Calendar, AlertTriangle, FileCheck, Camera, Ruler
} from 'lucide-react';

// Mock data thẩm định thực địa
interface ThamDinhThucDia {
  MaThamDinh: string;
  MaHoSo: string;
  DiaChi: string;
  MaThua: string;
  SoTo: string;
  LoaiThamDinh: string;
  NgayThamDinh: string;
  CanBoThamDinh: string;
  DonViThamDinh: string;
  DienTichHoSo: number;
  DienTichThucTe: number;
  TrangThai: string;
  KetQuaThamDinh: string;
  MoTaSaiLech: string;
  HinhAnhChungCu: number;
  DeXuatXuLy: string;
  GhiChu: string;
}

const mockThamDinh: ThamDinhThucDia[] = [
  {
    MaThamDinh: 'TD001',
    MaHoSo: 'HS2025-001',
    DiaChi: 'Thửa 123, Tờ 45, Khu phố 1, Phường A',
    MaThua: '123',
    SoTo: '45',
    LoaiThamDinh: 'Cấp sổ đỏ mới',
    NgayThamDinh: '2025-01-15',
    CanBoThamDinh: 'Nguyễn Văn X',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 120,
    DienTichThucTe: 120,
    TrangThai: 'Hoàn thành',
    KetQuaThamDinh: 'Đúng hồ sơ',
    MoTaSaiLech: '',
    HinhAnhChungCu: 5,
    DeXuatXuLy: '',
    GhiChu: ''
  },
  {
    MaThamDinh: 'TD002',
    MaHoSo: 'HS2025-002',
    DiaChi: 'Thửa 456, Tờ 67, Khu phố 2, Phường B',
    MaThua: '456',
    SoTo: '67',
    LoaiThamDinh: 'Chuyển nhượng',
    NgayThamDinh: '2025-01-20',
    CanBoThamDinh: 'Trần Thị Y',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 200,
    DienTichThucTe: 185,
    TrangThai: 'Phát hiện sai lệch',
    KetQuaThamDinh: 'Sai diện tích',
    MoTaSaiLech: 'Diện tích thực tế nhỏ hơn 15m² so với hồ sơ. Có dấu hiệu lấn chiếm đất công',
    HinhAnhChungCu: 8,
    DeXuatXuLy: 'Yêu cầu đo đạc lại, hoàn thiện hồ sơ',
    GhiChu: 'Cần kiểm tra ranh giới với thửa kế cận'
  },
  {
    MaThamDinh: 'TD003',
    MaHoSo: 'HS2025-003',
    DiaChi: 'Thửa 789, Tờ 89, Thôn 1, Xã C',
    MaThua: '789',
    SoTo: '89',
    LoaiThamDinh: 'Tách thửa',
    NgayThamDinh: '2025-01-25',
    CanBoThamDinh: 'Lê Văn Z',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 500,
    DienTichThucTe: 0,
    TrangThai: 'Chờ thẩm định',
    KetQuaThamDinh: '',
    MoTaSaiLech: '',
    HinhAnhChungCu: 0,
    DeXuatXuLy: '',
    GhiChu: 'Dự kiến thẩm định 25/01/2025'
  },
  {
    MaThamDinh: 'TD004',
    MaHoSo: 'HS2025-004',
    DiaChi: 'Thửa 234, Tờ 12, Khu phố 3, Phường D',
    MaThua: '234',
    SoTo: '12',
    LoaiThamDinh: 'Cấp đổi sổ',
    NgayThamDinh: '2025-01-10',
    CanBoThamDinh: 'Phạm Văn A',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 80,
    DienTichThucTe: 80,
    TrangThai: 'Hoàn thành',
    KetQuaThamDinh: 'Đúng hồ sơ',
    MoTaSaiLech: '',
    HinhAnhChungCu: 4,
    DeXuatXuLy: '',
    GhiChu: ''
  },
  {
    MaThamDinh: 'TD005',
    MaHoSo: 'HS2025-005',
    DiaChi: 'Thửa 567, Tờ 34, Khu phố 4, Phường E',
    MaThua: '567',
    SoTo: '34',
    LoaiThamDinh: 'Cấp phép xây dựng',
    NgayThamDinh: '2025-01-18',
    CanBoThamDinh: 'Hoàng Thị B',
    DonViThamDinh: 'Phòng Xây dựng',
    DienTichHoSo: 150,
    DienTichThucTe: 0,
    TrangThai: 'Đang thẩm định',
    KetQuaThamDinh: '',
    MoTaSaiLech: '',
    HinhAnhChungCu: 3,
    DeXuatXuLy: '',
    GhiChu: 'Đang kiểm tra quy hoạch'
  },
  {
    MaThamDinh: 'TD006',
    MaHoSo: 'HS2025-006',
    DiaChi: 'Thửa 890, Tờ 56, Thôn 2, Xã F',
    MaThua: '890',
    SoTo: '56',
    LoaiThamDinh: 'Hợp thửa',
    NgayThamDinh: '2025-01-12',
    CanBoThamDinh: 'Nguyễn Thị C',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 350,
    DienTichThucTe: 365,
    TrangThai: 'Phát hiện sai lệch',
    KetQuaThamDinh: 'Sai ranh giới',
    MoTaSaiLech: 'Ranh giới phía Đông không khớp với hồ sơ gốc, chênh lệch 15m²',
    HinhAnhChungCu: 6,
    DeXuatXuLy: 'Đo đạc lại, điều chỉnh hồ sơ',
    GhiChu: ''
  }
];

const loaiThamDinhOptions = ['Cấp sổ đỏ mới', 'Cấp đổi sổ', 'Chuyển nhượng', 'Tách thửa', 'Hợp thửa', 'Cấp phép xây dựng', 'Khác'];
const trangThaiOptions = ['Chờ thẩm định', 'Đang thẩm định', 'Hoàn thành', 'Phát hiện sai lệch', 'Hủy'];
const ketQuaOptions = ['Đúng hồ sơ', 'Sai diện tích', 'Sai ranh giới', 'Sai mục đích SDĐ', 'Không đủ điều kiện'];

export default function ThamDinhThucDiaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [selectedTD, setSelectedTD] = useState<ThamDinhThucDia | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockThamDinh.filter((item) => {
    const matchesSearch =
      item.MaThamDinh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.CanBoThamDinh.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThai === filterTrangThai;
    const matchesLoai = filterLoai === 'all' || item.LoaiThamDinh === filterLoai;
    return matchesSearch && matchesTrangThai && matchesLoai;
  });

  const stats = {
    total: mockThamDinh.length,
    choThamDinh: mockThamDinh.filter(r => r.TrangThai === 'Chờ thẩm định').length,
    dangThamDinh: mockThamDinh.filter(r => r.TrangThai === 'Đang thẩm định').length,
    hoanThanh: mockThamDinh.filter(r => r.TrangThai === 'Hoàn thành').length,
    saiLech: mockThamDinh.filter(r => r.TrangThai === 'Phát hiện sai lệch').length,
    tongAnh: mockThamDinh.reduce((sum, r) => sum + r.HinhAnhChungCu, 0)
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Hoàn thành': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang thẩm định': return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ thẩm định': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Phát hiện sai lệch': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Hủy': return <Badge variant="secondary">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getKetQuaBadge = (ketQua: string) => {
    if (!ketQua) return <span className="text-muted-foreground">-</span>;
    if (ketQua === 'Đúng hồ sơ') return <Badge className="bg-green-500">{ketQua}</Badge>;
    return <Badge variant="destructive">{ketQua}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Map className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Cập nhật Hồ sơ Thẩm định Thực địa</h1>
              <p className="text-blue-100">Cập nhật thông tin thực tế khi thẩm định tại hiện trường</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-blue-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Tạo hồ sơ thẩm định
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo hồ sơ thẩm định thực địa mới</DialogTitle>
                <DialogDescription>Nhập thông tin hồ sơ cần thẩm định</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Mã hồ sơ gốc *</Label>
                  <Input placeholder="Nhập mã hồ sơ" />
                </div>
                <div className="space-y-2">
                  <Label>Loại thẩm định *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiThamDinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ *</Label>
                  <Input placeholder="Nhập địa chỉ thửa đất" />
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
                  <Label>Diện tích theo hồ sơ (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày thẩm định dự kiến</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ thẩm định *</Label>
                  <Input placeholder="Chọn cán bộ" />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị thẩm định</Label>
                  <Input placeholder="Nhập đơn vị" defaultValue="Phòng Địa chính" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>Tạo hồ sơ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-500" />
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

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang thẩm định</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <span className="text-2xl font-bold">{stats.dangThamDinh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.hoanThanh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sai lệch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.saiLech}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hình ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.tongAnh}</span>
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
                placeholder="Tìm theo mã, địa chỉ, cán bộ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại thẩm định" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiThamDinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
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
          <CardTitle>Danh sách hồ sơ thẩm định thực địa</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã TĐ</TableHead>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày TĐ</TableHead>
                <TableHead>Cán bộ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaThamDinh}>
                  <TableCell className="font-medium text-blue-600">{item.MaThamDinh}</TableCell>
                  <TableCell className="text-sm">{item.MaHoSo}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.DiaChi}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.DiaChi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.LoaiThamDinh}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayThamDinh}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      {item.CanBoThamDinh}
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>{getKetQuaBadge(item.KetQuaThamDinh)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedTD?.MaThamDinh === item.MaThamDinh} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedTD(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedTD(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết thẩm định thực địa</DialogTitle>
                            <DialogDescription>Mã: {item.MaThamDinh} - Hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại thẩm định</p>
                              <Badge variant="outline">{item.LoaiThamDinh}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày thẩm định</p>
                              <p className="font-medium">{item.NgayThamDinh}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Cán bộ thẩm định</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.CanBoThamDinh}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Đơn vị</p>
                                  <p className="font-medium">{item.DonViThamDinh}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Ruler className="h-4 w-4" /> Kết quả đo đạc
                              </h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">DT theo hồ sơ</p>
                                  <p className="font-medium">{item.DienTichHoSo} m²</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">DT thực tế</p>
                                  <p className="font-medium">{item.DienTichThucTe > 0 ? `${item.DienTichThucTe} m²` : 'Chưa đo'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Chênh lệch</p>
                                  <p className={`font-medium ${item.DienTichThucTe > 0 && item.DienTichHoSo !== item.DienTichThucTe ? 'text-red-600' : 'text-green-600'}`}>
                                    {item.DienTichThucTe > 0 ? `${item.DienTichThucTe - item.DienTichHoSo} m²` : '-'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {item.KetQuaThamDinh && (
                              <div className="col-span-2 border-t pt-4 mt-2">
                                <h4 className="font-semibold mb-3">Kết quả thẩm định</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Kết luận</p>
                                    {getKetQuaBadge(item.KetQuaThamDinh)}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Số hình ảnh</p>
                                    <div className="flex items-center gap-1">
                                      <Camera className="h-4 w-4" />
                                      <span className="font-medium">{item.HinhAnhChungCu} ảnh</span>
                                    </div>
                                  </div>
                                  {item.MoTaSaiLech && (
                                    <div className="space-y-1 col-span-2">
                                      <p className="text-sm text-muted-foreground">Mô tả sai lệch</p>
                                      <p className="font-medium text-red-600">{item.MoTaSaiLech}</p>
                                    </div>
                                  )}
                                  {item.DeXuatXuLy && (
                                    <div className="space-y-1 col-span-2">
                                      <p className="text-sm text-muted-foreground">Đề xuất xử lý</p>
                                      <p className="font-medium">{item.DeXuatXuLy}</p>
                                    </div>
                                  )}
                                </div>
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
                      <Dialog open={isEditOpen && selectedTD?.MaThamDinh === item.MaThamDinh} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedTD(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedTD(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật kết quả thẩm định</DialogTitle>
                            <DialogDescription>Mã: {item.MaThamDinh}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
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
                              <Label>Kết quả thẩm định</Label>
                              <Select defaultValue={item.KetQuaThamDinh}>
                                <SelectTrigger><SelectValue placeholder="Chọn kết quả" /></SelectTrigger>
                                <SelectContent>
                                  {ketQuaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Diện tích thực tế (m²)</Label>
                              <Input type="number" defaultValue={item.DienTichThucTe || ''} />
                            </div>
                            <div className="space-y-2">
                              <Label>Số hình ảnh chứng cứ</Label>
                              <Input type="number" defaultValue={item.HinhAnhChungCu} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Mô tả sai lệch (nếu có)</Label>
                              <Textarea defaultValue={item.MoTaSaiLech} placeholder="Mô tả chi tiết sai lệch phát hiện được" />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Đề xuất xử lý</Label>
                              <Textarea defaultValue={item.DeXuatXuLy} placeholder="Đề xuất phương án xử lý" />
                            </div>
                            <div className="space-y-2 col-span-2">
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
