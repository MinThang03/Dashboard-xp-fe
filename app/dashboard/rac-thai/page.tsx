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
  Trash2, Truck, TrendingUp, CheckCircle2, Search, Plus, Download, Eye, Edit,
  MapPin, Calendar, Recycle, Package, Scale, AlertTriangle, Clock
} from 'lucide-react';

// Mock data quản lý rác thải
interface DiemThuGom {
  MaDiem: string;
  TenDiem: string;
  DiaChi: string;
  KhuVuc: string;
  LoaiRac: string;
  KhoiLuongNgay: number;
  TanSuatThu: string;
  GioThu: string;
  DonViThuGom: string;
  TrangThaiHomNay: string;
  TyLePhanLoai: number;
  NgayCapNhat: string;
  GhiChu: string;
}

const mockDiemThuGom: DiemThuGom[] = [
  {
    MaDiem: 'RT001',
    TenDiem: 'Điểm thu gom Khu phố 1',
    DiaChi: 'Ngã tư đường Trần Phú - Lê Lợi',
    KhuVuc: 'Khu phố 1',
    LoaiRac: 'Hữu cơ',
    KhoiLuongNgay: 150,
    TanSuatThu: 'Hàng ngày',
    GioThu: '6:00 - 8:00',
    DonViThuGom: 'Công ty TNHH MTV MT ABC',
    TrangThaiHomNay: 'Đã thu',
    TyLePhanLoai: 75,
    NgayCapNhat: '2026-01-30',
    GhiChu: ''
  },
  {
    MaDiem: 'RT002',
    TenDiem: 'Điểm thu gom Khu phố 2',
    DiaChi: 'Cuối đường Nguyễn Huệ',
    KhuVuc: 'Khu phố 2',
    LoaiRac: 'Tái chế',
    KhoiLuongNgay: 85,
    TanSuatThu: 'Hàng ngày',
    GioThu: '6:00 - 8:00',
    DonViThuGom: 'Công ty TNHH MTV MT ABC',
    TrangThaiHomNay: 'Đã thu',
    TyLePhanLoai: 82,
    NgayCapNhat: '2026-01-30',
    GhiChu: ''
  },
  {
    MaDiem: 'RT003',
    TenDiem: 'Chợ trung tâm',
    DiaChi: 'Khu vực chợ chính',
    KhuVuc: 'Khu phố 3',
    LoaiRac: 'Hỗn hợp',
    KhoiLuongNgay: 320,
    TanSuatThu: '2 lần/ngày',
    GioThu: '5:00 - 7:00, 17:00 - 19:00',
    DonViThuGom: 'Công ty CP Môi trường XYZ',
    TrangThaiHomNay: 'Chờ thu chiều',
    TyLePhanLoai: 45,
    NgayCapNhat: '2026-01-30',
    GhiChu: 'Cần tăng cường phân loại'
  },
  {
    MaDiem: 'RT004',
    TenDiem: 'Khu dân cư mới',
    DiaChi: 'Đường số 5, KDC mới',
    KhuVuc: 'Khu phố 4',
    LoaiRac: 'Hữu cơ',
    KhoiLuongNgay: 200,
    TanSuatThu: 'Hàng ngày',
    GioThu: '7:00 - 9:00',
    DonViThuGom: 'Công ty TNHH MTV MT ABC',
    TrangThaiHomNay: 'Chờ thu',
    TyLePhanLoai: 68,
    NgayCapNhat: '2026-01-30',
    GhiChu: ''
  },
  {
    MaDiem: 'RT005',
    TenDiem: 'Trường học A',
    DiaChi: 'Số 123 đường Lý Thường Kiệt',
    KhuVuc: 'Khu phố 2',
    LoaiRac: 'Tái chế',
    KhoiLuongNgay: 50,
    TanSuatThu: 'Cách ngày',
    GioThu: '15:00 - 17:00',
    DonViThuGom: 'Công ty CP Môi trường XYZ',
    TrangThaiHomNay: 'Đã thu',
    TyLePhanLoai: 90,
    NgayCapNhat: '2026-01-30',
    GhiChu: 'Trường thực hiện tốt chương trình phân loại'
  },
  {
    MaDiem: 'RT006',
    TenDiem: 'Khu công nghiệp nhỏ',
    DiaChi: 'Lô B, KCN địa phương',
    KhuVuc: 'Khu phố 5',
    LoaiRac: 'Công nghiệp',
    KhoiLuongNgay: 500,
    TanSuatThu: 'Hàng ngày',
    GioThu: '18:00 - 20:00',
    DonViThuGom: 'Công ty xử lý chất thải DEF',
    TrangThaiHomNay: 'Đã thu',
    TyLePhanLoai: 55,
    NgayCapNhat: '2026-01-30',
    GhiChu: 'Cần giám sát chất thải nguy hại'
  }
];

const loaiRacOptions = ['Hữu cơ', 'Tái chế', 'Hỗn hợp', 'Công nghiệp', 'Nguy hại'];
const trangThaiOptions = ['Đã thu', 'Chờ thu', 'Chờ thu chiều', 'Tạm dừng'];
const tanSuatOptions = ['Hàng ngày', '2 lần/ngày', 'Cách ngày', 'Hàng tuần'];

export default function RacThaiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<DiemThuGom | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockDiemThuGom.filter((item) => {
    const matchesSearch =
      item.MaDiem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenDiem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.KhuVuc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiRac === filterLoai;
    const matchesStatus = filterStatus === 'all' || item.TrangThaiHomNay === filterStatus;
    return matchesSearch && matchesLoai && matchesStatus;
  });

  const stats = {
    tongDiem: mockDiemThuGom.length,
    daThu: mockDiemThuGom.filter(r => r.TrangThaiHomNay === 'Đã thu').length,
    choThu: mockDiemThuGom.filter(r => r.TrangThaiHomNay.includes('Chờ')).length,
    tongKhoiLuong: mockDiemThuGom.reduce((acc, item) => acc + item.KhoiLuongNgay, 0),
    tyLePhanLoaiTB: Math.round(mockDiemThuGom.reduce((acc, item) => acc + item.TyLePhanLoai, 0) / mockDiemThuGom.length)
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã thu': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ thu': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ thu chiều': return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Tạm dừng': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getLoaiRacBadge = (loai: string) => {
    const colors: Record<string, string> = {
      'Hữu cơ': 'bg-green-100 text-green-800',
      'Tái chế': 'bg-blue-100 text-blue-800',
      'Hỗn hợp': 'bg-gray-100 text-gray-800',
      'Công nghiệp': 'bg-orange-100 text-orange-800',
      'Nguy hại': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[loai] || 'bg-gray-100 text-gray-800'}>{loai}</Badge>;
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-status-warning via-accent to-status-warning rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Trash2 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Rác thải</h1>
              <p className="text-amber-100">Thu gom, vận chuyển và xử lý rác thải trên địa bàn</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-amber-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm điểm thu gom
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm điểm thu gom mới</DialogTitle>
                <DialogDescription>Nhập thông tin điểm thu gom rác thải</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Tên điểm thu gom *</Label>
                  <Input placeholder="Nhập tên điểm" />
                </div>
                <div className="space-y-2">
                  <Label>Khu vực *</Label>
                  <Input placeholder="Nhập khu vực" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ *</Label>
                  <Input placeholder="Nhập địa chỉ chi tiết" />
                </div>
                <div className="space-y-2">
                  <Label>Loại rác chính</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại rác" /></SelectTrigger>
                    <SelectContent>
                      {loaiRacOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tần suất thu gom</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn tần suất" /></SelectTrigger>
                    <SelectContent>
                      {tanSuatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Giờ thu gom</Label>
                  <Input placeholder="VD: 6:00 - 8:00" />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị thu gom</Label>
                  <Input placeholder="Tên công ty thu gom" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>Thêm điểm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng điểm thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.tongDiem}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã thu hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daThu}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.choThu}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng KL (kg/ngày)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.tongKhoiLuong.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ phân loại TB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-teal-500" />
              <span className="text-2xl font-bold">{stats.tyLePhanLoaiTB}%</span>
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
                placeholder="Tìm theo mã, tên điểm, khu vực..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại rác" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiRacOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
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
          <CardTitle>Danh sách điểm thu gom rác thải</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} điểm thu gom</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Điểm thu gom</TableHead>
                <TableHead>Khu vực</TableHead>
                <TableHead>Loại rác</TableHead>
                <TableHead className="text-right">KL (kg)</TableHead>
                <TableHead>Giờ thu</TableHead>
                <TableHead className="text-right">% Phân loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaDiem}>
                  <TableCell className="font-medium text-primary">{item.MaDiem}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.TenDiem}</div>
                      <div className="text-xs text-muted-foreground">{item.DiaChi}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.KhuVuc}</TableCell>
                  <TableCell>{getLoaiRacBadge(item.LoaiRac)}</TableCell>
                  <TableCell className="text-right font-semibold">{item.KhoiLuongNgay}</TableCell>
                  <TableCell className="text-sm">{item.GioThu}</TableCell>
                  <TableCell className="text-right">
                    <span className={item.TyLePhanLoai >= 70 ? 'text-green-600 font-semibold' : item.TyLePhanLoai >= 50 ? 'text-amber-600' : 'text-red-600'}>
                      {item.TyLePhanLoai}%
                    </span>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThaiHomNay)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Dialog open={isViewOpen && selectedItem?.MaDiem === item.MaDiem} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedItem(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chi tiết điểm thu gom</DialogTitle>
                            <DialogDescription>Mã: {item.MaDiem}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tên điểm</p>
                              <p className="font-medium">{item.TenDiem}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Khu vực</p>
                              <p className="font-medium">{item.KhuVuc}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại rác</p>
                              {getLoaiRacBadge(item.LoaiRac)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Khối lượng/ngày</p>
                              <p className="font-medium">{item.KhoiLuongNgay} kg</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tần suất</p>
                              <p className="font-medium">{item.TanSuatThu}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Giờ thu gom</p>
                              <p className="font-medium">{item.GioThu}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Đơn vị thu gom</p>
                              <p className="font-medium">{item.DonViThuGom}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tỷ lệ phân loại</p>
                              <p className="font-medium">{item.TyLePhanLoai}%</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThaiHomNay)}
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

                      <Dialog open={isEditOpen && selectedItem?.MaDiem === item.MaDiem} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedItem(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật điểm thu gom</DialogTitle>
                            <DialogDescription>Mã: {item.MaDiem}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin điểm thu gom</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Tên điểm</Label>
                                  <Input defaultValue={item.TenDiem} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Khu vực</Label>
                                  <Input defaultValue={item.KhuVuc} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại rác</Label>
                                  <Select defaultValue={item.LoaiRac}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {loaiRacOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ</Label>
                                  <Input defaultValue={item.DiaChi} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Lịch thu gom</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Tần suất</Label>
                                  <Input defaultValue={item.TanSuatThu} placeholder="VD: Hằng ngày" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Giờ thu gom</Label>
                                  <Input defaultValue={item.GioThu} placeholder="VD: 6:00" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Đơn vị thu gom</Label>
                                  <Input defaultValue={item.DonViThuGom} />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Khối lượng/ngày (kg)</Label>
                                <Input type="number" defaultValue={item.KhoiLuongNgay} />
                              </div>
                              <div className="space-y-2">
                                <Label>Tỷ lệ phân loại (%)</Label>
                                <Input type="number" min="0" max="100" defaultValue={item.TyLePhanLoai} />
                              </div>
                              <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select defaultValue={item.TrangThaiHomNay}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Ghi chú</Label>
                              <Textarea defaultValue={item.GhiChu} rows={2} />
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
