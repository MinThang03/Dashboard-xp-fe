'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Store,
  Search,
  Plus,
  Download,
  MapPin,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  X,
  User,
  Phone,
  Briefcase,
  TrendingUp,
  Ban,
  Calendar,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mock-data';

// Mock data cho hộ kinh doanh
const mockHoKinhDoanh = [
  {
    MaHoKD: 1,
    SoGCN: 'HKD-2024-001',
    TenHoKD: 'Tạp hóa Bà Hương',
    ChuHo: 'Nguyễn Thị Hương',
    CCCD: '079123456789',
    NgaySinh: '1975-05-15',
    DiaChi: 'Số 45, Khu phố 2, Phường 1',
    DiaChiKinhDoanh: 'Số 45, Khu phố 2, Phường 1',
    DienThoai: '0987654321',
    Email: 'huongnguyen@gmail.com',
    NganhNghe: 'Bán lẻ tạp hóa',
    MaNganhNghe: '4711',
    VonKinhDoanh: 150000000,
    DoanhThuNam: 480000000,
    SoLaoDong: 2,
    NgayDangKy: '2020-03-15',
    NgayHetHan: '2025-03-15',
    TrangThai: 'Hoạt động',
    LanCapPhep: 1,
    DienTichKD: 30,
    LoaiHinhKD: 'Cửa hàng',
    GhiChu: '',
  },
  {
    MaHoKD: 2,
    SoGCN: 'HKD-2024-002',
    TenHoKD: 'Quán cơm Anh Tuấn',
    ChuHo: 'Trần Văn Tuấn',
    CCCD: '079234567890',
    NgaySinh: '1985-08-20',
    DiaChi: 'Số 78, Khu phố 1, Phường 2',
    DiaChiKinhDoanh: 'Số 78, Khu phố 1, Phường 2',
    DienThoai: '0976543210',
    Email: 'tuantran@gmail.com',
    NganhNghe: 'Dịch vụ ăn uống',
    MaNganhNghe: '5610',
    VonKinhDoanh: 200000000,
    DoanhThuNam: 720000000,
    SoLaoDong: 4,
    NgayDangKy: '2019-06-20',
    NgayHetHan: '2024-06-20',
    TrangThai: 'Hoạt động',
    LanCapPhep: 2,
    DienTichKD: 50,
    LoaiHinhKD: 'Nhà hàng',
    GhiChu: 'Cần gia hạn giấy phép',
  },
  {
    MaHoKD: 3,
    SoGCN: 'HKD-2024-003',
    TenHoKD: 'Tiệm may Cô Lan',
    ChuHo: 'Lê Thị Lan',
    CCCD: '079345678901',
    NgaySinh: '1970-12-10',
    DiaChi: 'Số 23, Khu phố 3, Phường 1',
    DiaChiKinhDoanh: 'Số 23, Khu phố 3, Phường 1',
    DienThoai: '0965432109',
    Email: 'lanle@gmail.com',
    NganhNghe: 'May mặc',
    MaNganhNghe: '1410',
    VonKinhDoanh: 80000000,
    DoanhThuNam: 240000000,
    SoLaoDong: 1,
    NgayDangKy: '2018-09-01',
    NgayHetHan: '2028-09-01',
    TrangThai: 'Hoạt động',
    LanCapPhep: 3,
    DienTichKD: 20,
    LoaiHinhKD: 'Tiệm',
    GhiChu: '',
  },
  {
    MaHoKD: 4,
    SoGCN: 'HKD-2024-004',
    TenHoKD: 'Sửa xe Honda Minh',
    ChuHo: 'Phạm Văn Minh',
    CCCD: '079456789012',
    NgaySinh: '1980-04-25',
    DiaChi: 'Số 120, Đường Lê Lợi, Phường 3',
    DiaChiKinhDoanh: 'Số 120, Đường Lê Lợi, Phường 3',
    DienThoai: '0954321098',
    Email: 'minhpham@gmail.com',
    NganhNghe: 'Sửa chữa xe máy',
    MaNganhNghe: '4540',
    VonKinhDoanh: 120000000,
    DoanhThuNam: 360000000,
    SoLaoDong: 3,
    NgayDangKy: '2021-01-15',
    NgayHetHan: '2026-01-15',
    TrangThai: 'Hoạt động',
    LanCapPhep: 1,
    DienTichKD: 40,
    LoaiHinhKD: 'Tiệm',
    GhiChu: '',
  },
  {
    MaHoKD: 5,
    SoGCN: 'HKD-2024-005',
    TenHoKD: 'Quán cafe Sài Gòn',
    ChuHo: 'Hoàng Văn Sơn',
    CCCD: '079567890123',
    NgaySinh: '1990-07-12',
    DiaChi: 'Số 56, Khu phố 4, Phường 2',
    DiaChiKinhDoanh: 'Số 56, Khu phố 4, Phường 2',
    DienThoai: '0943210987',
    Email: 'sonhoang@gmail.com',
    NganhNghe: 'Dịch vụ ăn uống',
    MaNganhNghe: '5630',
    VonKinhDoanh: 300000000,
    DoanhThuNam: 600000000,
    SoLaoDong: 5,
    NgayDangKy: '2022-08-01',
    NgayHetHan: '2027-08-01',
    TrangThai: 'Hoạt động',
    LanCapPhep: 1,
    DienTichKD: 80,
    LoaiHinhKD: 'Quán',
    GhiChu: '',
  },
  {
    MaHoKD: 6,
    SoGCN: 'HKD-2024-006',
    TenHoKD: 'Cửa hàng điện tử Bình',
    ChuHo: 'Võ Văn Bình',
    CCCD: '079678901234',
    NgaySinh: '1988-11-30',
    DiaChi: 'Số 88, Đường Hùng Vương, Phường 1',
    DiaChiKinhDoanh: 'Số 88, Đường Hùng Vương, Phường 1',
    DienThoai: '0932109876',
    Email: 'binhvo@gmail.com',
    NganhNghe: 'Bán lẻ thiết bị điện tử',
    MaNganhNghe: '4741',
    VonKinhDoanh: 500000000,
    DoanhThuNam: 1200000000,
    SoLaoDong: 3,
    NgayDangKy: '2023-02-10',
    NgayHetHan: '2028-02-10',
    TrangThai: 'Hoạt động',
    LanCapPhep: 1,
    DienTichKD: 60,
    LoaiHinhKD: 'Cửa hàng',
    GhiChu: '',
  },
  {
    MaHoKD: 7,
    SoGCN: 'HKD-2024-007',
    TenHoKD: 'Tiệm tóc Anh Khoa',
    ChuHo: 'Đặng Văn Khoa',
    CCCD: '079789012345',
    NgaySinh: '1992-03-18',
    DiaChi: 'Số 15, Khu phố 1, Phường 3',
    DiaChiKinhDoanh: 'Số 15, Khu phố 1, Phường 3',
    DienThoai: '0921098765',
    Email: 'khoadang@gmail.com',
    NganhNghe: 'Dịch vụ làm đẹp',
    MaNganhNghe: '9602',
    VonKinhDoanh: 100000000,
    DoanhThuNam: 300000000,
    SoLaoDong: 2,
    NgayDangKy: '2020-11-01',
    NgayHetHan: '2025-11-01',
    TrangThai: 'Tạm ngưng',
    LanCapPhep: 1,
    DienTichKD: 25,
    LoaiHinhKD: 'Tiệm',
    GhiChu: 'Tạm ngưng do sửa chữa mặt bằng',
  },
];

interface HoKinhDoanh {
  MaHoKD: number;
  SoGCN: string;
  TenHoKD: string;
  ChuHo: string;
  CCCD: string;
  NgaySinh: string;
  DiaChi: string;
  DiaChiKinhDoanh: string;
  DienThoai: string;
  Email: string;
  NganhNghe: string;
  MaNganhNghe: string;
  VonKinhDoanh: number;
  DoanhThuNam: number;
  SoLaoDong: number;
  NgayDangKy: string;
  NgayHetHan: string;
  TrangThai: string;
  LanCapPhep: number;
  DienTichKD: number;
  LoaiHinhKD: string;
  GhiChu: string;
}

export default function HoKinhDoanhPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HoKinhDoanh | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    SoGCN: '',
    TenHoKD: '',
    ChuHo: '',
    CCCD: '',
    NgaySinh: '',
    DiaChi: '',
    DiaChiKinhDoanh: '',
    DienThoai: '',
    Email: '',
    NganhNghe: 'Bán lẻ tạp hóa',
    MaNganhNghe: '',
    VonKinhDoanh: 0,
    DoanhThuNam: 0,
    SoLaoDong: 0,
    DienTichKD: 0,
    LoaiHinhKD: 'Cửa hàng',
    TrangThai: 'Hoạt động',
    GhiChu: '',
    NgayDangKy: '',
    NgayHetHan: '',
    LanCapPhep: 1,
  });

  // Filter data
  const filteredData = mockHoKinhDoanh.filter((item) => {
    const matchSearch = 
      item.SoGCN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenHoKD.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuHo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchIndustry = industryFilter === 'all' || item.NganhNghe.includes(industryFilter);
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchIndustry && matchStatus;
  });

  // Stats
  const stats = {
    total: mockHoKinhDoanh.length,
    active: mockHoKinhDoanh.filter(h => h.TrangThai === 'Hoạt động').length,
    suspended: mockHoKinhDoanh.filter(h => h.TrangThai === 'Tạm ngưng').length,
    totalRevenue: mockHoKinhDoanh.reduce((sum, h) => sum + h.DoanhThuNam, 0),
    totalLabor: mockHoKinhDoanh.reduce((sum, h) => sum + h.SoLaoDong, 0),
    totalCapital: mockHoKinhDoanh.reduce((sum, h) => sum + h.VonKinhDoanh, 0),
  };

  // Handlers
  const handleView = (record: HoKinhDoanh) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: HoKinhDoanh) => {
    setSelectedRecord(record);
    setFormData({
      SoGCN: record.SoGCN,
      TenHoKD: record.TenHoKD,
      ChuHo: record.ChuHo,
      CCCD: record.CCCD,
      NgaySinh: record.NgaySinh,
      DiaChi: record.DiaChi,
      DiaChiKinhDoanh: record.DiaChiKinhDoanh,
      DienThoai: record.DienThoai,
      Email: record.Email,
      NganhNghe: record.NganhNghe,
      MaNganhNghe: record.MaNganhNghe,
      VonKinhDoanh: record.VonKinhDoanh,
      DoanhThuNam: record.DoanhThuNam,
      SoLaoDong: record.SoLaoDong,
      DienTichKD: record.DienTichKD,
      LoaiHinhKD: record.LoaiHinhKD,
      TrangThai: record.TrangThai,
      GhiChu: record.GhiChu,
      NgayDangKy: record.NgayDangKy,
      NgayHetHan: record.NgayHetHan,
      LanCapPhep: record.LanCapPhep,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      SoGCN: '',
      TenHoKD: '',
      ChuHo: '',
      CCCD: '',
      NgaySinh: '',
      DiaChi: '',
      DiaChiKinhDoanh: '',
      DienThoai: '',
      Email: '',
      NganhNghe: 'Bán lẻ tạp hóa',
      MaNganhNghe: '',
      VonKinhDoanh: 0,
      DoanhThuNam: 0,
      SoLaoDong: 0,
      DienTichKD: 0,
      LoaiHinhKD: 'Cửa hàng',
      TrangThai: 'Hoạt động',
      GhiChu: '',
      NgayDangKy: new Date().toISOString().split('T')[0],
      NgayHetHan: '',
      LanCapPhep: 1,
    });
    setAddDialogOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Hoạt động</Badge>;
      case 'Tạm ngưng':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><Clock className="w-3 h-3 mr-1" />Tạm ngưng</Badge>;
      case 'Đã thu hồi':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><Ban className="w-3 h-3 mr-1" />Đã thu hồi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Cửa hàng':
        return <Store className="w-4 h-4 text-blue-500" />;
      case 'Nhà hàng':
        return <Briefcase className="w-4 h-4 text-orange-500" />;
      case 'Quán':
        return <Store className="w-4 h-4 text-purple-500" />;
      case 'Tiệm':
        return <Store className="w-4 h-4 text-green-500" />;
      default:
        return <Store className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-success via-secondary to-status-success p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Store className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Hộ kinh doanh</h1>
              </div>
              <p className="text-white/90">Đăng ký, quản lý hộ kinh doanh cá thể trên địa bàn</p>
            </div>
            <Button className="bg-white text-green-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Đăng ký hộ KD
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <Store className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Tổng hộ KD</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.suspended}</p>
              <p className="text-xs text-muted-foreground">Tạm ngưng</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalLabor}</p>
              <p className="text-xs text-muted-foreground">Lao động</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-600">{(stats.totalRevenue / 1000000000).toFixed(1)}B</p>
              <p className="text-xs text-muted-foreground">Doanh thu/năm</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-purple-600">{(stats.totalCapital / 1000000000).toFixed(1)}B</p>
              <p className="text-xs text-muted-foreground">Tổng vốn</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo số GCN, tên, chủ hộ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Ngành nghề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ngành nghề</SelectItem>
              <SelectItem value="Bán lẻ">Bán lẻ</SelectItem>
              <SelectItem value="Dịch vụ ăn uống">Dịch vụ ăn uống</SelectItem>
              <SelectItem value="May mặc">May mặc</SelectItem>
              <SelectItem value="Sửa chữa">Sửa chữa</SelectItem>
              <SelectItem value="Dịch vụ làm đẹp">Dịch vụ làm đẹp</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Hoạt động">Hoạt động</SelectItem>
              <SelectItem value="Tạm ngưng">Tạm ngưng</SelectItem>
              <SelectItem value="Đã thu hồi">Đã thu hồi</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Số GCN</th>
                <th className="text-left p-4 font-semibold">Tên hộ KD / Chủ hộ</th>
                <th className="text-left p-4 font-semibold">Ngành nghề</th>
                <th className="text-center p-4 font-semibold">Lao động</th>
                <th className="text-right p-4 font-semibold">Doanh thu/năm</th>
                <th className="text-left p-4 font-semibold">Ngày cấp</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaHoKD} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.SoGCN}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.LoaiHinhKD)}
                      <div>
                        <div className="font-medium">{record.TenHoKD}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />{record.ChuHo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{record.NganhNghe}</Badge>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-lg">{record.SoLaoDong}</span>
                  </td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {formatCurrency(record.DoanhThuNam)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDate(record.NgayDangKy)}
                  </td>
                  <td className="p-4">{getStatusBadge(record.TrangThai)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(record)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(record)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Chi tiết hộ kinh doanh
            </DialogTitle>
            <DialogDescription>
              Số GCN: {selectedRecord?.SoGCN}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Thông tin hộ kinh doanh
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên hộ KD</Label>
                    <p className="font-medium">{selectedRecord.TenHoKD}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại hình</Label>
                    <p className="font-medium">{selectedRecord.LoaiHinhKD}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ kinh doanh</Label>
                    <p className="font-medium">{selectedRecord.DiaChiKinhDoanh}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Diện tích</Label>
                    <p className="font-medium">{selectedRecord.DienTichKD} m²</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                    <div>{selectedRecord.TrangThai ? getStatusBadge(selectedRecord.TrangThai) : <Badge variant="outline">Chưa cập nhật</Badge>}</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin chủ hộ
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Họ tên chủ hộ</Label>
                    <p className="font-medium">{selectedRecord.ChuHo}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Số CCCD</Label>
                    <p className="font-mono">{selectedRecord.CCCD}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{selectedRecord.DienThoai}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="font-medium">{selectedRecord.Email || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ thường trú</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(selectedRecord.VonKinhDoanh)}</p>
                  <p className="text-xs text-muted-foreground">Vốn KD</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(selectedRecord.DoanhThuNam)}</p>
                  <p className="text-xs text-muted-foreground">Doanh thu/năm</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedRecord.SoLaoDong}</p>
                  <p className="text-xs text-muted-foreground">Lao động</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedRecord.LanCapPhep}</p>
                  <p className="text-xs text-muted-foreground">Lần cấp phép</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Thông tin ngành nghề & Giấy phép
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngành nghề</Label>
                    <p className="font-medium">{selectedRecord.NganhNghe}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Mã ngành nghề</Label>
                    <p className="font-mono">{selectedRecord.MaNganhNghe}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày đăng ký</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayDangKy)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày hết hạn</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayHetHan)}</p>
                  </div>
                </div>
              </div>

              {selectedRecord.GhiChu && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Ghi chú</Label>
                  <p className="font-medium bg-yellow-50 p-3 rounded-lg">{selectedRecord.GhiChu}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Cập nhật hộ kinh doanh
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số GCN</Label>
                <Input
                  value={formData.SoGCN}
                  onChange={(e) => setFormData({...formData, SoGCN: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Loại hình</Label>
                <Input
                  value={formData.LoaiHinhKD}
                  onChange={(e) => setFormData({...formData, LoaiHinhKD: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên hộ KD *</Label>
                <Input
                  value={formData.TenHoKD}
                  onChange={(e) => setFormData({...formData, TenHoKD: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Chủ hộ</Label>
                <Input
                  value={formData.ChuHo}
                  onChange={(e) => setFormData({...formData, ChuHo: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Số CCCD</Label>
                <Input
                  value={formData.CCCD}
                  onChange={(e) => setFormData({...formData, CCCD: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày sinh chủ hộ</Label>
                <Input
                  type="date"
                  value={formData.NgaySinh}
                  onChange={(e) => setFormData({...formData, NgaySinh: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ thường trú</Label>
                <Input
                  value={formData.DiaChi}
                  onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Điện thoại</Label>
                <Input
                  value={formData.DienThoai}
                  onChange={(e) => setFormData({...formData, DienThoai: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ kinh doanh</Label>
              <Input
                value={formData.DiaChiKinhDoanh}
                onChange={(e) => setFormData({...formData, DiaChiKinhDoanh: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Vốn kinh doanh</Label>
                <Input
                  type="number"
                  value={formData.VonKinhDoanh}
                  onChange={(e) => setFormData({...formData, VonKinhDoanh: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Doanh thu năm</Label>
                <Input
                  type="number"
                  value={formData.DoanhThuNam}
                  onChange={(e) => setFormData({...formData, DoanhThuNam: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số lao động</Label>
                <Input
                  type="number"
                  value={formData.SoLaoDong}
                  onChange={(e) => setFormData({...formData, SoLaoDong: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Diện tích (m²)</Label>
                <Input
                  type="number"
                  value={formData.DienTichKD}
                  onChange={(e) => setFormData({...formData, DienTichKD: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Lần cấp phép</Label>
                <Input
                  type="number"
                  value={formData.LanCapPhep}
                  onChange={(e) => setFormData({...formData, LanCapPhep: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                    <SelectItem value="Tạm ngưng">Tạm ngưng</SelectItem>
                    <SelectItem value="Đã thu hồi">Đã thu hồi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-1">
              <h4 className="font-semibold">Thông tin ngành nghề & Giấy phép</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngành nghề</Label>
                <Select value={formData.NganhNghe} onValueChange={(v) => setFormData({...formData, NganhNghe: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bán lẻ tạp hóa">Bán lẻ tạp hóa</SelectItem>
                    <SelectItem value="Dịch vụ ăn uống">Dịch vụ ăn uống</SelectItem>
                    <SelectItem value="May mặc">May mặc</SelectItem>
                    <SelectItem value="Sửa chữa xe máy">Sửa chữa xe máy</SelectItem>
                    <SelectItem value="Dịch vụ làm đẹp">Dịch vụ làm đẹp</SelectItem>
                    <SelectItem value="Bán lẻ thiết bị điện tử">Bán lẻ thiết bị điện tử</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mã ngành nghề</Label>
                <Input
                  value={formData.MaNganhNghe}
                  onChange={(e) => setFormData({...formData, MaNganhNghe: e.target.value})}
                  placeholder="VD: 4711"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày đăng ký</Label>
                <Input
                  type="date"
                  value={formData.NgayDangKy}
                  onChange={(e) => setFormData({...formData, NgayDangKy: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày hết hạn</Label>
                <Input
                  type="date"
                  value={formData.NgayHetHan}
                  onChange={(e) => setFormData({...formData, NgayHetHan: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.GhiChu}
                onChange={(e) => setFormData({...formData, GhiChu: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Đăng ký hộ kinh doanh mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Thông tin hộ kinh doanh
              </h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số GCN *</Label>
                    <Input
                      value={formData.SoGCN}
                      onChange={(e) => setFormData({...formData, SoGCN: e.target.value})}
                      placeholder="VD: HKD-2024-008"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Loại hình *</Label>
                    <Select value={formData.LoaiHinhKD} onValueChange={(v) => setFormData({...formData, LoaiHinhKD: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại hình" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cá nhân">Cá nhân</SelectItem>
                        <SelectItem value="Gia đình">Gia đình</SelectItem>
                        <SelectItem value="Hợp tác">Hợp tác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tên hộ kinh doanh *</Label>
                  <Input
                    value={formData.TenHoKD}
                    onChange={(e) => setFormData({...formData, TenHoKD: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ kinh doanh *</Label>
                  <Input
                    value={formData.DiaChiKinhDoanh}
                    onChange={(e) => setFormData({...formData, DiaChiKinhDoanh: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Diện tích (m²)</Label>
                    <Input
                      type="number"
                      value={formData.DienTichKD}
                      onChange={(e) => setFormData({...formData, DienTichKD: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                        <SelectItem value="Tạm ngưng">Tạm ngưng</SelectItem>
                        <SelectItem value="Đã thu hồi">Đã thu hồi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin chủ hộ
              </h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chủ hộ *</Label>
                    <Input
                      value={formData.ChuHo}
                      onChange={(e) => setFormData({...formData, ChuHo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số CCCD *</Label>
                    <Input
                      value={formData.CCCD}
                      onChange={(e) => setFormData({...formData, CCCD: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ngày sinh</Label>
                    <Input
                      type="date"
                      value={formData.NgaySinh}
                      onChange={(e) => setFormData({...formData, NgaySinh: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Điện thoại</Label>
                    <Input
                      value={formData.DienThoai}
                      onChange={(e) => setFormData({...formData, DienThoai: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={formData.Email}
                      onChange={(e) => setFormData({...formData, Email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ thường trú</Label>
                  <Input
                    value={formData.DiaChi}
                    onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Thông tin ngành nghề & Giấy phép
              </h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ngành nghề *</Label>
                    <Select value={formData.NganhNghe} onValueChange={(v) => setFormData({...formData, NganhNghe: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngành nghề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bán lẻ tạp hóa">Bán lẻ tạp hóa</SelectItem>
                        <SelectItem value="Dịch vụ ăn uống">Dịch vụ ăn uống</SelectItem>
                        <SelectItem value="May mặc">May mặc</SelectItem>
                        <SelectItem value="Sửa chữa xe máy">Sửa chữa xe máy</SelectItem>
                        <SelectItem value="Dịch vụ làm đẹp">Dịch vụ làm đẹp</SelectItem>
                        <SelectItem value="Bán lẻ thiết bị điện tử">Bán lẻ thiết bị điện tử</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mã ngành nghề</Label>
                    <Input
                      value={formData.MaNganhNghe}
                      onChange={(e) => setFormData({...formData, MaNganhNghe: e.target.value})}
                      placeholder="VD: 4711"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ngày đăng ký</Label>
                    <Input
                      type="date"
                      value={formData.NgayDangKy}
                      onChange={(e) => setFormData({...formData, NgayDangKy: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày hết hạn</Label>
                    <Input
                      type="date"
                      value={formData.NgayHetHan}
                      onChange={(e) => setFormData({...formData, NgayHetHan: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Vốn KD (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.VonKinhDoanh}
                  onChange={(e) => setFormData({...formData, VonKinhDoanh: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Doanh thu/năm</Label>
                <Input
                  type="number"
                  value={formData.DoanhThuNam}
                  onChange={(e) => setFormData({...formData, DoanhThuNam: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số lao động</Label>
                <Input
                  type="number"
                  value={formData.SoLaoDong}
                  onChange={(e) => setFormData({...formData, SoLaoDong: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Lần cấp phép</Label>
                <Input
                  type="number"
                  value={formData.LanCapPhep}
                  onChange={(e) => setFormData({...formData, LanCapPhep: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.GhiChu}
                onChange={(e) => setFormData({...formData, GhiChu: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Plus className="w-4 h-4 mr-2" />
              Đăng ký
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
