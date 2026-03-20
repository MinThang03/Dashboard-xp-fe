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
  Activity, TrendingUp, Clock, CheckCircle2, Search, Plus, Download, Eye, Edit,
  DollarSign, Calendar, Building2, Target, AlertTriangle, Percent
} from 'lucide-react';

// Mock data giải ngân
interface GiaiNgan {
  MaDuAn: string;
  TenDuAn: string;
  LoaiDuAn: string;
  DonViThucHien: string;
  TongKeHoach: number;
  DaGiaiNgan: number;
  TienDo: number;
  NgayBatDau: string;
  NgayKetThuc: string;
  TrangThai: string;
  SoDotGiaiNgan: number;
  NgayCapNhat: string;
  GhiChu: string;
}

const mockGiaiNgan: GiaiNgan[] = [
  {
    MaDuAn: 'DA001',
    TenDuAn: 'Nâng cấp đường giao thông nội bộ khu phố 2',
    LoaiDuAn: 'Giao thông',
    DonViThucHien: 'Công ty CP Xây dựng ABC',
    TongKeHoach: 1200000000,
    DaGiaiNgan: 950000000,
    TienDo: 79,
    NgayBatDau: '2024-06-01',
    NgayKetThuc: '2025-06-01',
    TrangThai: 'Đang thực hiện',
    SoDotGiaiNgan: 3,
    NgayCapNhat: '2025-01-15',
    GhiChu: ''
  },
  {
    MaDuAn: 'DA002',
    TenDuAn: 'Xây dựng trường tiểu học số 2',
    LoaiDuAn: 'Giáo dục',
    DonViThucHien: 'Công ty TNHH XYZ',
    TongKeHoach: 800000000,
    DaGiaiNgan: 600000000,
    TienDo: 75,
    NgayBatDau: '2024-09-01',
    NgayKetThuc: '2025-09-01',
    TrangThai: 'Đang thực hiện',
    SoDotGiaiNgan: 2,
    NgayCapNhat: '2025-01-10',
    GhiChu: 'Tiến độ thi công đạt 70%'
  },
  {
    MaDuAn: 'DA003',
    TenDuAn: 'Hệ thống cấp nước sạch thôn 3',
    LoaiDuAn: 'Hạ tầng',
    DonViThucHien: 'Công ty CP Nước DEF',
    TongKeHoach: 500000000,
    DaGiaiNgan: 250000000,
    TienDo: 50,
    NgayBatDau: '2024-10-01',
    NgayKetThuc: '2025-04-01',
    TrangThai: 'Đang thực hiện',
    SoDotGiaiNgan: 1,
    NgayCapNhat: '2025-01-08',
    GhiChu: ''
  },
  {
    MaDuAn: 'DA004',
    TenDuAn: 'Sửa chữa nhà văn hóa xã',
    LoaiDuAn: 'Văn hóa',
    DonViThucHien: 'Doanh nghiệp GHI',
    TongKeHoach: 350000000,
    DaGiaiNgan: 350000000,
    TienDo: 100,
    NgayBatDau: '2024-03-01',
    NgayKetThuc: '2024-12-31',
    TrangThai: 'Hoàn thành',
    SoDotGiaiNgan: 4,
    NgayCapNhat: '2024-12-25',
    GhiChu: 'Đã nghiệm thu, quyết toán hoàn thành'
  },
  {
    MaDuAn: 'DA005',
    TenDuAn: 'Lắp đặt đèn chiếu sáng đường',
    LoaiDuAn: 'Điện',
    DonViThucHien: 'Công ty Điện lực',
    TongKeHoach: 200000000,
    DaGiaiNgan: 80000000,
    TienDo: 40,
    NgayBatDau: '2024-11-01',
    NgayKetThuc: '2025-03-01',
    TrangThai: 'Chậm tiến độ',
    SoDotGiaiNgan: 1,
    NgayCapNhat: '2025-01-12',
    GhiChu: 'Chậm do vướng mắc GPMB'
  },
  {
    MaDuAn: 'DA006',
    TenDuAn: 'Mua sắm thiết bị y tế trạm y tế',
    LoaiDuAn: 'Y tế',
    DonViThucHien: 'Công ty TBYT JKL',
    TongKeHoach: 300000000,
    DaGiaiNgan: 0,
    TienDo: 0,
    NgayBatDau: '2025-01-15',
    NgayKetThuc: '2025-06-15',
    TrangThai: 'Chờ giải ngân',
    SoDotGiaiNgan: 0,
    NgayCapNhat: '2025-01-14',
    GhiChu: 'Đang chờ hoàn thiện hồ sơ đấu thầu'
  },
  {
    MaDuAn: 'DA007',
    TenDuAn: 'Xây dựng công trình vệ sinh công cộng',
    LoaiDuAn: 'Hạ tầng',
    DonViThucHien: 'HTX Xây dựng MNO',
    TongKeHoach: 150000000,
    DaGiaiNgan: 120000000,
    TienDo: 80,
    NgayBatDau: '2024-08-01',
    NgayKetThuc: '2025-02-01',
    TrangThai: 'Đang thực hiện',
    SoDotGiaiNgan: 2,
    NgayCapNhat: '2025-01-05',
    GhiChu: ''
  }
];

const loaiDuAnOptions = ['Giao thông', 'Giáo dục', 'Y tế', 'Hạ tầng', 'Văn hóa', 'Điện', 'Môi trường', 'Khác'];
const trangThaiOptions = ['Chờ giải ngân', 'Đang thực hiện', 'Chậm tiến độ', 'Hoàn thành', 'Tạm dừng'];

export default function GiaiNganPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [selectedDA, setSelectedDA] = useState<GiaiNgan | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockGiaiNgan.filter((item) => {
    const matchesSearch =
      item.MaDuAn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenDuAn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DonViThucHien.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiDuAn === filterLoai;
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThai === filterTrangThai;
    return matchesSearch && matchesLoai && matchesTrangThai;
  });

  const tongKeHoach = mockGiaiNgan.reduce((sum, d) => sum + d.TongKeHoach, 0);
  const tongGiaiNgan = mockGiaiNgan.reduce((sum, d) => sum + d.DaGiaiNgan, 0);
  const tyLeGiaiNgan = tongKeHoach > 0 ? Math.round((tongGiaiNgan / tongKeHoach) * 100) : 0;

  const stats = {
    tongKeHoach,
    tongGiaiNgan,
    tyLeGiaiNgan,
    soDuAn: mockGiaiNgan.length,
    dangThucHien: mockGiaiNgan.filter(d => d.TrangThai === 'Đang thực hiện').length,
    chamTienDo: mockGiaiNgan.filter(d => d.TrangThai === 'Chậm tiến độ').length
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Hoàn thành': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang thực hiện': return <Badge className="bg-blue-500 hover:bg-blue-600"><Activity className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ giải ngân': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chậm tiến độ': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Tạm dừng': return <Badge variant="secondary">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)} tỷ`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Giám sát Tiến độ Giải ngân</h1>
              <p className="text-cyan-100">Theo dõi tiến độ giải ngân các dự án và khoản mục chi</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-blue-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm dự án
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm dự án giải ngân</DialogTitle>
                <DialogDescription>Nhập thông tin dự án mới</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Tên dự án *</Label>
                  <Input placeholder="Nhập tên dự án" />
                </div>
                <div className="space-y-2">
                  <Label>Loại dự án *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiDuAnOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị thực hiện</Label>
                  <Input placeholder="Nhập đơn vị" />
                </div>
                <div className="space-y-2">
                  <Label>Tổng kế hoạch (VNĐ) *</Label>
                  <Input type="number" placeholder="Nhập số tiền" />
                </div>
                <div className="space-y-2">
                  <Label>Đã giải ngân (VNĐ)</Label>
                  <Input type="number" placeholder="Nhập số tiền" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày bắt đầu *</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc *</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>Thêm dự án</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng kế hoạch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="text-xl font-bold">{formatShortCurrency(stats.tongKeHoach)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã giải ngân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-xl font-bold">{formatShortCurrency(stats.tongGiaiNgan)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ giải ngân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.tyLeGiaiNgan}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Số dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-cyan-500" />
              <span className="text-2xl font-bold">{stats.soDuAn}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang thực hiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              <span className="text-2xl font-bold">{stats.dangThucHien}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chậm tiến độ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.chamTienDo}</span>
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
                placeholder="Tìm theo mã, tên dự án, đơn vị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại dự án" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiDuAnOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách dự án giải ngân</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} dự án</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên dự án</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Kế hoạch</TableHead>
                <TableHead>Đã giải ngân</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaDuAn}>
                  <TableCell className="font-medium text-blue-600">{item.MaDuAn}</TableCell>
                  <TableCell>
                    <div className="max-w-[180px] truncate text-sm" title={item.TenDuAn}>
                      {item.TenDuAn}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.LoaiDuAn}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatShortCurrency(item.TongKeHoach)}</TableCell>
                  <TableCell className="font-medium text-green-600">{formatShortCurrency(item.DaGiaiNgan)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.TienDo} className="w-16 h-2" />
                      <span className="text-sm font-medium">{item.TienDo}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedDA?.MaDuAn === item.MaDuAn} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedDA(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedDA(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết dự án giải ngân</DialogTitle>
                            <DialogDescription>Mã: {item.MaDuAn}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã dự án</p>
                              <p className="font-medium">{item.MaDuAn}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Tên dự án</p>
                              <p className="font-medium">{item.TenDuAn}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại dự án</p>
                              <Badge variant="outline">{item.LoaiDuAn}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tiến độ (%)</p>
                              <p className="font-medium">{item.TienDo}%</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Đơn vị thực hiện</p>
                              <p className="font-medium">{item.DonViThucHien}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin tài chính</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Tổng kế hoạch</p>
                                  <p className="font-bold text-lg">{formatCurrency(item.TongKeHoach)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Đã giải ngân</p>
                                  <p className="font-bold text-lg text-green-600">{formatCurrency(item.DaGiaiNgan)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Còn lại</p>
                                  <p className="font-bold text-lg text-amber-600">{formatCurrency(item.TongKeHoach - item.DaGiaiNgan)}</p>
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="text-sm text-muted-foreground mb-2">Tiến độ giải ngân</p>
                                <div className="flex items-center gap-3">
                                  <Progress value={item.TienDo} className="flex-1 h-3" />
                                  <span className="font-bold text-lg">{item.TienDo}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thời gian thực hiện</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                                  <p className="font-medium">{item.NgayBatDau}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                                  <p className="font-medium">{item.NgayKetThuc}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số đợt giải ngân</p>
                                  <p className="font-medium">{item.SoDotGiaiNgan} đợt</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cập nhật cuối</p>
                              <p className="font-medium">{item.NgayCapNhat}</p>
                            </div>
                            {item.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium">{item.GhiChu}</p>
                              </div>
                            )}
                            {!item.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium">Không có ghi chú</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Dialog */}
                      <Dialog open={isEditOpen && selectedDA?.MaDuAn === item.MaDuAn} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedDA(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedDA(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật tiến độ giải ngân</DialogTitle>
                            <DialogDescription>Mã: {item.MaDuAn}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin dự án</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Tên dự án</Label>
                                  <Input defaultValue={item.TenDuAn} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại dự án</Label>
                                  <Input defaultValue={item.LoaiDuAn} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Đơn vị thực hiện</Label>
                                  <Input defaultValue={item.DonViThucHien} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin tài chính</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Tổng kế hoạch (VNĐ)</Label>
                                  <Input type="number" defaultValue={item.TongKeHoach} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Đã giải ngân (VNĐ)</Label>
                                  <Input type="number" defaultValue={item.DaGiaiNgan} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Tiến độ (%)</Label>
                                  <Input type="number" min="0" max="100" defaultValue={item.TienDo} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thời gian & Trạng thái</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngày bắt đầu</Label>
                                  <Input type="date" defaultValue={item.NgayBatDau} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày kết thúc</Label>
                                  <Input type="date" defaultValue={item.NgayKetThuc} />
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
                                  <Label>Số đợt giải ngân</Label>
                                  <Input type="number" defaultValue={item.SoDotGiaiNgan} />
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
