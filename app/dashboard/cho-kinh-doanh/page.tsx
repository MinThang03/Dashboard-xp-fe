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
  AlertTriangle,
  Users,
  Coins,
  TrendingUp,
  Building,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mock-data';

// Mock data cho chợ và điểm kinh doanh
const mockChoKinhDoanh = [
  {
    MaCho: 1,
    MaDiemKD: 'CH-001',
    TenDiemKD: 'Chợ Trung tâm',
    LoaiHinh: 'Chợ truyền thống',
    DiaChi: 'Số 15, Khu phố 1, Phường 1',
    DienTich: 2500,
    SoGianHang: 120,
    SoGianDangKinhDoanh: 115,
    SoGianTrong: 5,
    DoanhThuThang: 850000000,
    ThuPhiThang: 45000000,
    BanQuanLy: 'Nguyễn Văn Quản',
    SoDienThoai: '028 1234 5678',
    NgayThanhLap: '2010-05-15',
    TrangThai: 'Hoạt động',
    GiayPhep: 'GP-2010-001',
    NgayCapPhep: '2010-05-01',
    NgayHetHan: '2025-05-01',
    CoSoHaTang: 'Tốt',
    AnNinhTratTu: 'Ổn định',
    VeSinhMoiTruong: 'Đạt',
    GhiChu: '',
  },
  {
    MaCho: 2,
    MaDiemKD: 'CH-002',
    TenDiemKD: 'Chợ Phường 2',
    LoaiHinh: 'Chợ truyền thống',
    DiaChi: 'Số 45, Khu phố 3, Phường 2',
    DienTich: 1500,
    SoGianHang: 80,
    SoGianDangKinhDoanh: 75,
    SoGianTrong: 5,
    DoanhThuThang: 420000000,
    ThuPhiThang: 24000000,
    BanQuanLy: 'Trần Thị Quản',
    SoDienThoai: '028 2345 6789',
    NgayThanhLap: '2015-08-20',
    TrangThai: 'Hoạt động',
    GiayPhep: 'GP-2015-002',
    NgayCapPhep: '2015-08-01',
    NgayHetHan: '2025-08-01',
    CoSoHaTang: 'Trung bình',
    AnNinhTratTu: 'Ổn định',
    VeSinhMoiTruong: 'Đạt',
    GhiChu: 'Cần nâng cấp hệ thống PCCC',
  },
  {
    MaCho: 3,
    MaDiemKD: 'DK-001',
    TenDiemKD: 'Khu vực vỉa hè P1',
    LoaiHinh: 'Vỉa hè',
    DiaChi: 'Đường Nguyễn Huệ, Phường 1',
    DienTich: 500,
    SoGianHang: 25,
    SoGianDangKinhDoanh: 25,
    SoGianTrong: 0,
    DoanhThuThang: 180000000,
    ThuPhiThang: 12500000,
    BanQuanLy: 'Lê Văn Bảo',
    SoDienThoai: '028 3456 7890',
    NgayThanhLap: '2018-01-01',
    TrangThai: 'Hoạt động',
    GiayPhep: 'GP-2018-003',
    NgayCapPhep: '2018-01-01',
    NgayHetHan: '2024-01-01',
    CoSoHaTang: 'Cơ bản',
    AnNinhTratTu: 'Cần theo dõi',
    VeSinhMoiTruong: 'Cần cải thiện',
    GhiChu: 'Giấy phép sắp hết hạn - cần gia hạn',
  },
  {
    MaCho: 4,
    MaDiemKD: 'TTTM-001',
    TenDiemKD: 'TTTM Hùng Vương',
    LoaiHinh: 'Trung tâm thương mại',
    DiaChi: 'Số 100, Đường Hùng Vương, Phường 3',
    DienTich: 5000,
    SoGianHang: 150,
    SoGianDangKinhDoanh: 140,
    SoGianTrong: 10,
    DoanhThuThang: 1500000000,
    ThuPhiThang: 75000000,
    BanQuanLy: 'Phạm Minh Tuấn',
    SoDienThoai: '028 4567 8901',
    NgayThanhLap: '2020-06-15',
    TrangThai: 'Hoạt động',
    GiayPhep: 'GP-2020-001',
    NgayCapPhep: '2020-06-01',
    NgayHetHan: '2030-06-01',
    CoSoHaTang: 'Hiện đại',
    AnNinhTratTu: 'Ổn định',
    VeSinhMoiTruong: 'Tốt',
    GhiChu: '',
  },
  {
    MaCho: 5,
    MaDiemKD: 'CHD-001',
    TenDiemKD: 'Chợ đêm Phường 1',
    LoaiHinh: 'Chợ đêm',
    DiaChi: 'Công viên Phường 1',
    DienTich: 800,
    SoGianHang: 40,
    SoGianDangKinhDoanh: 35,
    SoGianTrong: 5,
    DoanhThuThang: 200000000,
    ThuPhiThang: 16000000,
    BanQuanLy: 'Hoàng Thị Lan',
    SoDienThoai: '028 5678 9012',
    NgayThanhLap: '2022-03-01',
    TrangThai: 'Hoạt động',
    GiayPhep: 'GP-2022-001',
    NgayCapPhep: '2022-03-01',
    NgayHetHan: '2027-03-01',
    CoSoHaTang: 'Tốt',
    AnNinhTratTu: 'Ổn định',
    VeSinhMoiTruong: 'Đạt',
    GhiChu: 'Hoạt động từ 17h-23h',
  },
];

interface ChoKinhDoanh {
  MaCho: number;
  MaDiemKD: string;
  TenDiemKD: string;
  LoaiHinh: string;
  DiaChi: string;
  DienTich: number;
  SoGianHang: number;
  SoGianDangKinhDoanh: number;
  SoGianTrong: number;
  DoanhThuThang: number;
  ThuPhiThang: number;
  BanQuanLy: string;
  SoDienThoai: string;
  NgayThanhLap: string;
  TrangThai: string;
  GiayPhep: string;
  NgayCapPhep: string;
  NgayHetHan: string;
  CoSoHaTang: string;
  AnNinhTratTu: string;
  VeSinhMoiTruong: string;
  GhiChu: string;
}

export default function ChoKinhDoanhPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ChoKinhDoanh | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaDiemKD: '',
    TenDiemKD: '',
    LoaiHinh: 'Chợ truyền thống',
    DiaChi: '',
    DienTich: 0,
    SoGianHang: 0,
    BanQuanLy: '',
    SoDienThoai: '',
    TrangThai: 'Hoạt động',
    CoSoHaTang: 'Tốt',
    AnNinhTratTu: 'Ổn định',
    VeSinhMoiTruong: 'Đạt',
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockChoKinhDoanh.filter((item) => {
    const matchSearch = 
      item.MaDiemKD.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenDiemKD.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchType = typeFilter === 'all' || item.LoaiHinh === typeFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchType && matchStatus;
  });

  // Stats
  const stats = {
    totalPlaces: mockChoKinhDoanh.length,
    totalStalls: mockChoKinhDoanh.reduce((sum, t) => sum + t.SoGianHang, 0),
    activeStalls: mockChoKinhDoanh.reduce((sum, t) => sum + t.SoGianDangKinhDoanh, 0),
    emptyStalls: mockChoKinhDoanh.reduce((sum, t) => sum + t.SoGianTrong, 0),
    totalRevenue: mockChoKinhDoanh.reduce((sum, t) => sum + t.DoanhThuThang, 0),
    totalFees: mockChoKinhDoanh.reduce((sum, t) => sum + t.ThuPhiThang, 0),
  };

  // Handlers
  const handleView = (record: ChoKinhDoanh) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: ChoKinhDoanh) => {
    setSelectedRecord(record);
    setFormData({
      MaDiemKD: record.MaDiemKD,
      TenDiemKD: record.TenDiemKD,
      LoaiHinh: record.LoaiHinh,
      DiaChi: record.DiaChi,
      DienTich: record.DienTich,
      SoGianHang: record.SoGianHang,
      BanQuanLy: record.BanQuanLy,
      SoDienThoai: record.SoDienThoai,
      TrangThai: record.TrangThai,
      CoSoHaTang: record.CoSoHaTang,
      AnNinhTratTu: record.AnNinhTratTu,
      VeSinhMoiTruong: record.VeSinhMoiTruong,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      MaDiemKD: '',
      TenDiemKD: '',
      LoaiHinh: 'Chợ truyền thống',
      DiaChi: '',
      DienTich: 0,
      SoGianHang: 0,
      BanQuanLy: '',
      SoDienThoai: '',
      TrangThai: 'Hoạt động',
      CoSoHaTang: 'Tốt',
      AnNinhTratTu: 'Ổn định',
      VeSinhMoiTruong: 'Đạt',
      GhiChu: '',
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
      case 'Đóng cửa':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><X className="w-3 h-3 mr-1" />Đóng cửa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Chợ truyền thống':
        return <Store className="w-4 h-4 text-green-500" />;
      case 'Trung tâm thương mại':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'Vỉa hè':
        return <ShoppingBag className="w-4 h-4 text-orange-500" />;
      case 'Chợ đêm':
        return <Store className="w-4 h-4 text-purple-500" />;
      default:
        return <Store className="w-4 h-4 text-gray-500" />;
    }
  };

  const getInfrastructureBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Hiện đại': 'bg-blue-500/10 text-blue-700',
      'Tốt': 'bg-green-500/10 text-green-700',
      'Trung bình': 'bg-yellow-500/10 text-yellow-700',
      'Cơ bản': 'bg-orange-500/10 text-orange-700',
    };
    return <Badge className={`${colors[status] || 'bg-gray-500/10 text-gray-700'} border-0`}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-success via-status-success to-secondary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Store className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Chợ & Điểm kinh doanh</h1>
              </div>
              <p className="text-white/90">Giám sát hoạt động chợ, quầy hàng, vỉa hè trên địa bàn</p>
            </div>
            <Button className="bg-white text-green-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm điểm KD
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
              <p className="text-2xl font-bold">{stats.totalPlaces}</p>
              <p className="text-xs text-muted-foreground">Chợ/Điểm KD</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalStalls}</p>
              <p className="text-xs text-muted-foreground">Tổng gian hàng</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.activeStalls}</p>
              <p className="text-xs text-muted-foreground">Đang kinh doanh</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.emptyStalls}</p>
              <p className="text-xs text-muted-foreground">Gian trống</p>
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
              <p className="text-xs text-muted-foreground">Doanh thu/tháng</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl">
              <Coins className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-teal-600">{(stats.totalFees / 1000000).toFixed(0)}M</p>
              <p className="text-xs text-muted-foreground">Thu phí/tháng</p>
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
              placeholder="Tìm kiếm theo mã, tên, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Loại hình" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại hình</SelectItem>
              <SelectItem value="Chợ truyền thống">Chợ truyền thống</SelectItem>
              <SelectItem value="Trung tâm thương mại">TTTM</SelectItem>
              <SelectItem value="Vỉa hè">Vỉa hè</SelectItem>
              <SelectItem value="Chợ đêm">Chợ đêm</SelectItem>
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
                <th className="text-left p-4 font-semibold">Mã</th>
                <th className="text-left p-4 font-semibold">Tên chợ/Điểm KD</th>
                <th className="text-left p-4 font-semibold">Loại hình</th>
                <th className="text-center p-4 font-semibold">Gian hàng</th>
                <th className="text-right p-4 font-semibold">Thu phí/tháng</th>
                <th className="text-left p-4 font-semibold">Hạ tầng</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaCho} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.MaDiemKD}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.LoaiHinh)}
                      <div>
                        <div className="font-medium">{record.TenDiemKD}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{record.DiaChi}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{record.LoaiHinh}</Badge>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-lg">{record.SoGianDangKinhDoanh}</span>
                    <span className="text-muted-foreground">/{record.SoGianHang}</span>
                  </td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {formatCurrency(record.ThuPhiThang)}
                  </td>
                  <td className="p-4">{getInfrastructureBadge(record.CoSoHaTang)}</td>
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
              Chi tiết điểm kinh doanh
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRecord?.MaDiemKD}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  {getTypeIcon(selectedRecord.LoaiHinh)}
                  Thông tin chung
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên điểm KD</Label>
                    <p className="font-medium">{selectedRecord.TenDiemKD}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại hình</Label>
                    <p className="font-medium">{selectedRecord.LoaiHinh}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Diện tích</Label>
                    <p className="font-medium">{selectedRecord.DienTich.toLocaleString()} m²</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày thành lập</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayThanhLap)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedRecord.SoGianHang}</p>
                  <p className="text-xs text-muted-foreground">Tổng gian</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-600">{selectedRecord.SoGianDangKinhDoanh}</p>
                  <p className="text-xs text-muted-foreground">Đang KD</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">{selectedRecord.SoGianTrong}</p>
                  <p className="text-xs text-muted-foreground">Gian trống</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedRecord.ThuPhiThang)}</p>
                  <p className="text-xs text-muted-foreground">Thu phí/tháng</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Thông tin quản lý</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ban quản lý</Label>
                    <p className="font-medium">{selectedRecord.BanQuanLy}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{selectedRecord.SoDienThoai}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Giấy phép</Label>
                    <p className="font-mono">{selectedRecord.GiayPhep}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Hiệu lực đến</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayHetHan)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Cơ sở hạ tầng</Label>
                  <div>{getInfrastructureBadge(selectedRecord.CoSoHaTang)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">An ninh trật tự</Label>
                  <Badge className={`${selectedRecord.AnNinhTratTu === 'Ổn định' ? 'bg-green-500/10 text-green-700' : 'bg-yellow-500/10 text-yellow-700'} border-0`}>
                    {selectedRecord.AnNinhTratTu}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Vệ sinh MT</Label>
                  <Badge className={`${selectedRecord.VeSinhMoiTruong === 'Đạt' || selectedRecord.VeSinhMoiTruong === 'Tốt' ? 'bg-green-500/10 text-green-700' : 'bg-yellow-500/10 text-yellow-700'} border-0`}>
                    {selectedRecord.VeSinhMoiTruong}
                  </Badge>
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
              Cập nhật điểm kinh doanh
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên điểm KD *</Label>
                <Input
                  value={formData.TenDiemKD}
                  onChange={(e) => setFormData({...formData, TenDiemKD: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Loại hình</Label>
                <Select value={formData.LoaiHinh} onValueChange={(v) => setFormData({...formData, LoaiHinh: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chợ truyền thống">Chợ truyền thống</SelectItem>
                    <SelectItem value="Trung tâm thương mại">TTTM</SelectItem>
                    <SelectItem value="Vỉa hè">Vỉa hè</SelectItem>
                    <SelectItem value="Chợ đêm">Chợ đêm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input
                value={formData.DiaChi}
                onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Diện tích (m²)</Label>
                <Input
                  type="number"
                  value={formData.DienTich}
                  onChange={(e) => setFormData({...formData, DienTich: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số gian hàng</Label>
                <Input
                  type="number"
                  value={formData.SoGianHang}
                  onChange={(e) => setFormData({...formData, SoGianHang: parseInt(e.target.value)})}
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
                    <SelectItem value="Đóng cửa">Đóng cửa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ban quản lý</Label>
                <Input
                  value={formData.BanQuanLy}
                  onChange={(e) => setFormData({...formData, BanQuanLy: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  value={formData.SoDienThoai}
                  onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Giấy phép</Label>
                <Input
                  value={formData.GiayPhep}
                  onChange={(e) => setFormData({...formData, GiayPhep: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày cấp phép</Label>
                <Input
                  type="date"
                  value={formData.NgayCapPhep}
                  onChange={(e) => setFormData({...formData, NgayCapPhep: e.target.value})}
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cơ sở hạ tầng</Label>
                <Select value={formData.CoSoHaTang} onValueChange={(v) => setFormData({...formData, CoSoHaTang: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hiện đại">Hiện đại</SelectItem>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>An ninh trật tự</Label>
                <Select value={formData.AnNinhTratTu} onValueChange={(v) => setFormData({...formData, AnNinhTratTu: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ổn định">Ổn định</SelectItem>
                    <SelectItem value="Cần theo dõi">Cần theo dõi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vệ sinh MT</Label>
                <Select value={formData.VeSinhMoiTruong} onValueChange={(v) => setFormData({...formData, VeSinhMoiTruong: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Đạt">Đạt</SelectItem>
                    <SelectItem value="Cần cải thiện">Cần cải thiện</SelectItem>
                  </SelectContent>
                </Select>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm điểm kinh doanh mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã điểm KD *</Label>
                <Input
                  value={formData.MaDiemKD}
                  onChange={(e) => setFormData({...formData, MaDiemKD: e.target.value})}
                  placeholder="VD: CH-003"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại hình *</Label>
                <Select value={formData.LoaiHinh} onValueChange={(v) => setFormData({...formData, LoaiHinh: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chợ truyền thống">Chợ truyền thống</SelectItem>
                    <SelectItem value="Trung tâm thương mại">TTTM</SelectItem>
                    <SelectItem value="Vỉa hè">Vỉa hè</SelectItem>
                    <SelectItem value="Chợ đêm">Chợ đêm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tên điểm KD *</Label>
              <Input
                value={formData.TenDiemKD}
                onChange={(e) => setFormData({...formData, TenDiemKD: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input
                value={formData.DiaChi}
                onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ngày thành lập</Label>
                <Input
                  type="date"
                  value={formData.NgayThanhLap}
                  onChange={(e) => setFormData({...formData, NgayThanhLap: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Diện tích (m²)</Label>
                <Input
                  type="number"
                  value={formData.DienTich}
                  onChange={(e) => setFormData({...formData, DienTich: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số gian hàng</Label>
                <Input
                  type="number"
                  value={formData.SoGianHang}
                  onChange={(e) => setFormData({...formData, SoGianHang: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ban quản lý</Label>
                <Input
                  value={formData.BanQuanLy}
                  onChange={(e) => setFormData({...formData, BanQuanLy: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  value={formData.SoDienThoai}
                  onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Giấy phép</Label>
                <Input
                  value={formData.GiayPhep}
                  onChange={(e) => setFormData({...formData, GiayPhep: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày cấp phép</Label>
                <Input
                  type="date"
                  value={formData.NgayCapPhep}
                  onChange={(e) => setFormData({...formData, NgayCapPhep: e.target.value})}
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cơ sở hạ tầng</Label>
                <Select value={formData.CoSoHaTang} onValueChange={(v) => setFormData({...formData, CoSoHaTang: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hiện đại">Hiện đại</SelectItem>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>An ninh trật tự</Label>
                <Select value={formData.AnNinhTratTu} onValueChange={(v) => setFormData({...formData, AnNinhTratTu: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ổn định">Ổn định</SelectItem>
                    <SelectItem value="Cần theo dõi">Cần theo dõi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vệ sinh MT</Label>
                <Select value={formData.VeSinhMoiTruong} onValueChange={(v) => setFormData({...formData, VeSinhMoiTruong: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Đạt">Đạt</SelectItem>
                    <SelectItem value="Cần cải thiện">Cần cải thiện</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                    <SelectItem value="Tạm ngưng">Tạm ngưng</SelectItem>
                    <SelectItem value="Đóng cửa">Đóng cửa</SelectItem>
                  </SelectContent>
                </Select>
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
              Thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
