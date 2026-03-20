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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, Wind, Droplet, TrendingUp, Search, Plus, Download, Eye, Edit,
  MapPin, Thermometer, Gauge, AlertTriangle, CheckCircle2, RefreshCw
} from 'lucide-react';

// Mock data quan trắc môi trường
interface DiemQuanTrac {
  MaDiem: string;
  TenDiem: string;
  LoaiQuanTrac: string;
  ViTri: string;
  KhuVuc: string;
  ChiSoChinh: string;
  GiaTriHienTai: number;
  DonVi: string;
  NguongAnToan: number;
  NguongCanhBao: number;
  MucDanhGia: string;
  ThoiGianCapNhat: string;
  TrangThaiThietBi: string;
  TanSuatDo: string;
  GhiChu: string;
}

const mockKhongKhi: DiemQuanTrac[] = [
  {
    MaDiem: 'KK001',
    TenDiem: 'Trạm Trung tâm hành chính',
    LoaiQuanTrac: 'Không khí',
    ViTri: 'Ngã tư trung tâm',
    KhuVuc: 'Khu vực 1',
    ChiSoChinh: 'AQI',
    GiaTriHienTai: 42,
    DonVi: '',
    NguongAnToan: 50,
    NguongCanhBao: 100,
    MucDanhGia: 'Tốt',
    ThoiGianCapNhat: '2026-01-30 08:30',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: '15 phút/lần',
    GhiChu: ''
  },
  {
    MaDiem: 'KK002',
    TenDiem: 'Trạm Khu công nghiệp',
    LoaiQuanTrac: 'Không khí',
    ViTri: 'Cổng KCN',
    KhuVuc: 'Khu vực 5',
    ChiSoChinh: 'AQI',
    GiaTriHienTai: 78,
    DonVi: '',
    NguongAnToan: 50,
    NguongCanhBao: 100,
    MucDanhGia: 'Trung bình',
    ThoiGianCapNhat: '2026-01-30 08:25',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: '15 phút/lần',
    GhiChu: 'Cần theo dõi PM2.5'
  },
  {
    MaDiem: 'KK003',
    TenDiem: 'Trạm Trường học',
    LoaiQuanTrac: 'Không khí',
    ViTri: 'Sân trường THCS',
    KhuVuc: 'Khu vực 2',
    ChiSoChinh: 'AQI',
    GiaTriHienTai: 35,
    DonVi: '',
    NguongAnToan: 50,
    NguongCanhBao: 100,
    MucDanhGia: 'Tốt',
    ThoiGianCapNhat: '2026-01-30 08:20',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: '30 phút/lần',
    GhiChu: ''
  }
];

const mockNuoc: DiemQuanTrac[] = [
  {
    MaDiem: 'NC001',
    TenDiem: 'Trạm Sông chính',
    LoaiQuanTrac: 'Nước mặt',
    ViTri: 'Cầu bắc qua sông',
    KhuVuc: 'Khu vực 3',
    ChiSoChinh: 'pH',
    GiaTriHienTai: 7.2,
    DonVi: '',
    NguongAnToan: 7.5,
    NguongCanhBao: 8.5,
    MucDanhGia: 'Đạt chuẩn',
    ThoiGianCapNhat: '2026-01-30 07:00',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: '1 giờ/lần',
    GhiChu: ''
  },
  {
    MaDiem: 'NC002',
    TenDiem: 'Trạm Kênh nội đồng',
    LoaiQuanTrac: 'Nước mặt',
    ViTri: 'Kênh cấp 2',
    KhuVuc: 'Khu vực 4',
    ChiSoChinh: 'DO',
    GiaTriHienTai: 5.8,
    DonVi: 'mg/L',
    NguongAnToan: 5,
    NguongCanhBao: 4,
    MucDanhGia: 'Đạt chuẩn',
    ThoiGianCapNhat: '2026-01-30 07:00',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: '1 giờ/lần',
    GhiChu: ''
  },
  {
    MaDiem: 'NC003',
    TenDiem: 'Giếng quan trắc nước ngầm',
    LoaiQuanTrac: 'Nước ngầm',
    ViTri: 'UBND xã',
    KhuVuc: 'Khu vực 1',
    ChiSoChinh: 'Độ cứng',
    GiaTriHienTai: 280,
    DonVi: 'mg/L',
    NguongAnToan: 300,
    NguongCanhBao: 500,
    MucDanhGia: 'Đạt chuẩn',
    ThoiGianCapNhat: '2026-01-29 16:00',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: '6 giờ/lần',
    GhiChu: ''
  }
];

const mockDat: DiemQuanTrac[] = [
  {
    MaDiem: 'DT001',
    TenDiem: 'Điểm A - Đất nông nghiệp',
    LoaiQuanTrac: 'Đất',
    ViTri: 'Cánh đồng B',
    KhuVuc: 'Khu vực 4',
    ChiSoChinh: 'pH đất',
    GiaTriHienTai: 6.5,
    DonVi: '',
    NguongAnToan: 6.8,
    NguongCanhBao: 5.5,
    MucDanhGia: 'Bình thường',
    ThoiGianCapNhat: '2026-01-28 14:00',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: 'Hàng tuần',
    GhiChu: ''
  },
  {
    MaDiem: 'DT002',
    TenDiem: 'Điểm B - Khu dân cư',
    LoaiQuanTrac: 'Đất',
    ViTri: 'Khu phố 2',
    KhuVuc: 'Khu vực 2',
    ChiSoChinh: 'Kim loại nặng',
    GiaTriHienTai: 0.05,
    DonVi: 'mg/kg',
    NguongAnToan: 0.1,
    NguongCanhBao: 0.3,
    MucDanhGia: 'An toàn',
    ThoiGianCapNhat: '2026-01-25 10:00',
    TrangThaiThietBi: 'Hoạt động',
    TanSuatDo: 'Hàng tháng',
    GhiChu: ''
  }
];

const loaiQuanTracOptions = ['Không khí', 'Nước mặt', 'Nước ngầm', 'Đất'];
const mucDanhGiaOptions = ['Tốt', 'Đạt chuẩn', 'Trung bình', 'Bình thường', 'An toàn', 'Cảnh báo', 'Nguy hiểm'];

export default function ChatLuongMoiTruongPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEval, setFilterEval] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<DiemQuanTrac | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('khong-khi');

  const allData = [...mockKhongKhi, ...mockNuoc, ...mockDat];

  const getCurrentData = () => {
    let data: DiemQuanTrac[] = [];
    switch (currentTab) {
      case 'khong-khi': data = mockKhongKhi; break;
      case 'nuoc': data = [...mockNuoc]; break;
      case 'dat': data = [...mockDat]; break;
      default: data = allData;
    }
    return data.filter((item) => {
      const matchesSearch =
        item.MaDiem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.TenDiem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.KhuVuc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEval = filterEval === 'all' || item.MucDanhGia === filterEval;
      return matchesSearch && matchesEval;
    });
  };

  const stats = {
    tongDiem: allData.length,
    hoatDong: allData.filter(d => d.TrangThaiThietBi === 'Hoạt động').length,
    tot: allData.filter(d => ['Tốt', 'Đạt chuẩn', 'An toàn'].includes(d.MucDanhGia)).length,
    canhBao: allData.filter(d => ['Cảnh báo', 'Nguy hiểm'].includes(d.MucDanhGia)).length,
    aqiTB: Math.round(mockKhongKhi.reduce((sum, d) => sum + d.GiaTriHienTai, 0) / mockKhongKhi.length)
  };

  const getMucDanhGiaBadge = (muc: string) => {
    switch (muc) {
      case 'Tốt': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{muc}</Badge>;
      case 'Đạt chuẩn': return <Badge className="bg-blue-500 hover:bg-blue-600"><CheckCircle2 className="h-3 w-3 mr-1" />{muc}</Badge>;
      case 'An toàn': return <Badge className="bg-teal-500 hover:bg-teal-600">{muc}</Badge>;
      case 'Bình thường': return <Badge className="bg-gray-500 hover:bg-gray-600">{muc}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600">{muc}</Badge>;
      case 'Cảnh báo': return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertTriangle className="h-3 w-3 mr-1" />{muc}</Badge>;
      case 'Nguy hiểm': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{muc}</Badge>;
      default: return <Badge variant="secondary">{muc}</Badge>;
    }
  };

  const getLoaiIcon = (loai: string) => {
    switch (loai) {
      case 'Không khí': return <Wind className="h-4 w-4 text-blue-500" />;
      case 'Nước mặt':
      case 'Nước ngầm': return <Droplet className="h-4 w-4 text-cyan-500" />;
      case 'Đất': return <MapPin className="h-4 w-4 text-amber-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredData = getCurrentData();

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-status-success via-secondary to-status-success rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Giám sát Chất lượng Môi trường</h1>
              <p className="text-green-100">Theo dõi chất lượng không khí, nước, đất theo thời gian thực</p>
            </div>
          </div>
          <div className="flex w-full 2xl:w-auto flex-col sm:flex-row gap-2">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
              <RefreshCw className="mr-2 h-4 w-4" />
              Cập nhật
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-green-600 hover:bg-white/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm điểm quan trắc
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm điểm quan trắc mới</DialogTitle>
                  <DialogDescription>Nhập thông tin điểm quan trắc môi trường</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Tên điểm quan trắc *</Label>
                    <Input placeholder="Nhập tên điểm" />
                  </div>
                  <div className="space-y-2">
                    <Label>Loại quan trắc *</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                      <SelectContent>
                        {loaiQuanTracOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Vị trí</Label>
                    <Input placeholder="Mô tả vị trí" />
                  </div>
                  <div className="space-y-2">
                    <Label>Khu vực</Label>
                    <Input placeholder="Khu vực" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chỉ số chính</Label>
                    <Input placeholder="VD: AQI, pH, DO..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Đơn vị</Label>
                    <Input placeholder="VD: mg/L" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngưỡng an toàn</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngưỡng cảnh báo</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tần suất đo</Label>
                    <Input placeholder="VD: 15 phút/lần" />
                  </div>
                  <div className="space-y-2">
                    <Label>Trạng thái thiết bị</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                        <SelectItem value="Bảo trì">Bảo trì</SelectItem>
                        <SelectItem value="Hỏng">Hỏng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mức đánh giá</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Chọn mức đánh giá" /></SelectTrigger>
                      <SelectContent>
                        {mucDanhGiaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
                  <Button onClick={() => setIsAddOpen(false)}>Thêm điểm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng điểm quan trắc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.tongDiem}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.hoatDong}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chỉ số tốt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-teal-500" />
              <span className="text-2xl font-bold">{stats.tot}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cảnh báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.canhBao}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AQI trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-cyan-500" />
              <span className="text-2xl font-bold">{stats.aqiTB}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="khong-khi" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="khong-khi" className="flex items-center gap-2">
            <Wind className="h-4 w-4" /> Không khí
          </TabsTrigger>
          <TabsTrigger value="nuoc" className="flex items-center gap-2">
            <Droplet className="h-4 w-4" /> Nước
          </TabsTrigger>
          <TabsTrigger value="dat" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Đất
          </TabsTrigger>
          <TabsTrigger value="tat-ca" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Tất cả
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
            <Select value={filterEval} onValueChange={setFilterEval}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Mức đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {mucDanhGiaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
          <CardTitle>Danh sách điểm quan trắc</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} điểm quan trắc</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Điểm quan trắc</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Chỉ số</TableHead>
                <TableHead className="text-right">Giá trị</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead>Thiết bị</TableHead>
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
                      <div className="text-xs text-muted-foreground">{item.ViTri}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLoaiIcon(item.LoaiQuanTrac)}
                      <span>{item.LoaiQuanTrac}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.ChiSoChinh}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.GiaTriHienTai} {item.DonVi}
                  </TableCell>
                  <TableCell>{getMucDanhGiaBadge(item.MucDanhGia)}</TableCell>
                  <TableCell className="text-sm">{item.ThoiGianCapNhat}</TableCell>
                  <TableCell>
                    <Badge variant={item.TrangThaiThietBi === 'Hoạt động' ? 'secondary' : 'destructive'}>
                      {item.TrangThaiThietBi}
                    </Badge>
                  </TableCell>
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
                            <DialogTitle>Chi tiết điểm quan trắc</DialogTitle>
                            <DialogDescription>Mã: {item.MaDiem}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tên điểm</p>
                              <p className="font-medium">{item.TenDiem}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại quan trắc</p>
                              <p className="font-medium">{item.LoaiQuanTrac}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Vị trí</p>
                              <p className="font-medium">{item.ViTri}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Khu vực</p>
                              <p className="font-medium">{item.KhuVuc}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Chỉ số chính</p>
                              <p className="font-medium">{item.ChiSoChinh}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Giá trị hiện tại</p>
                              <p className="font-medium text-lg">{item.GiaTriHienTai} {item.DonVi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngưỡng an toàn</p>
                              <p className="font-medium text-green-600">{item.NguongAnToan} {item.DonVi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngưỡng cảnh báo</p>
                              <p className="font-medium text-amber-600">{item.NguongCanhBao} {item.DonVi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mức đánh giá</p>
                              {getMucDanhGiaBadge(item.MucDanhGia)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tần suất đo</p>
                              <p className="font-medium">{item.TanSuatDo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái thiết bị</p>
                              <Badge variant={item.TrangThaiThietBi === 'Hoạt động' ? 'secondary' : 'destructive'}>
                                {item.TrangThaiThietBi}
                              </Badge>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Thời gian cập nhật</p>
                              <p className="font-medium">{item.ThoiGianCapNhat}</p>
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
                            <DialogTitle>Cập nhật điểm quan trắc</DialogTitle>
                            <DialogDescription>Mã: {item.MaDiem}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin điểm</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Tên điểm quan trắc *</Label>
                                  <Input defaultValue={item.TenDiem} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại quan trắc</Label>
                                  <Select defaultValue={item.LoaiQuanTrac}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {loaiQuanTracOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Khu vực</Label>
                                  <Input defaultValue={item.KhuVuc} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Vị trí</Label>
                                  <Input defaultValue={item.ViTri} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Chỉ số quan trắc</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Chỉ số chính</Label>
                                  <Input defaultValue={item.ChiSoChinh} placeholder="VD: AQI, pH, DO..." />
                                </div>
                                <div className="space-y-2">
                                  <Label>Đơn vị</Label>
                                  <Input defaultValue={item.DonVi} placeholder="VD: mg/L" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Giá trị đo được</Label>
                                  <Input type="number" defaultValue={item.GiaTriHienTai} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mức đánh giá</Label>
                                  <Select defaultValue={item.MucDanhGia}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {mucDanhGiaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Ngưỡng cảnh báo</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngưỡng an toàn</Label>
                                  <Input type="number" defaultValue={item.NguongAnToan} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngưỡng cảnh báo</Label>
                                  <Input type="number" defaultValue={item.NguongCanhBao} />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Trạng thái thiết bị</Label>
                                <Select defaultValue={item.TrangThaiThietBi}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                                    <SelectItem value="Bảo trì">Bảo trì</SelectItem>
                                    <SelectItem value="Hỏng">Hỏng</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Tần suất đo</Label>
                                <Input defaultValue={item.TanSuatDo} placeholder="VD: 15 phút/lần" />
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
