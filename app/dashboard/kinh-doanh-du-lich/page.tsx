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
  Palmtree,
  Search,
  Plus,
  Download,
  MapPin,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  X,
  Users,
  Star,
  Hotel,
  UtensilsCrossed,
  Bus,
  Camera,
  Phone,
  Mail,
  DollarSign,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mock-data';

// Mock data cho kinh doanh du lịch
const mockDuLich = [
  {
    MaDuLich: 1,
    MaCoSo: 'DL-001',
    TenCoSo: 'Nhà nghỉ Bình Minh',
    LoaiHinh: 'Lưu trú',
    PhanLoai: 'Nhà nghỉ',
    ChuSoHuu: 'Nguyễn Văn A',
    DienThoai: '0901234567',
    Email: 'binhminh@gmail.com',
    DiaChi: 'Số 45, Đường Hùng Vương, Phường 1',
    SoPhong: 20,
    SucChua: 40,
    SaoXepHang: 2,
    GiayCN: 'DL-2020-001',
    NgayCapPhep: '2020-05-15',
    NgayHetHan: '2025-05-15',
    DoanhThuThang: 80000000,
    LuotKhachThang: 150,
    TrangThai: 'Hoạt động',
    DanhGiaTB: 4.2,
    TienIch: 'Wifi, Điều hòa, Nước nóng',
    GhiChu: '',
  },
  {
    MaDuLich: 2,
    MaCoSo: 'DL-002',
    TenCoSo: 'Khách sạn Hoàng Gia',
    LoaiHinh: 'Lưu trú',
    PhanLoai: 'Khách sạn',
    ChuSoHuu: 'Công ty TNHH Hoàng Gia',
    DienThoai: '0912345678',
    Email: 'hoanggia@hotel.com',
    DiaChi: 'Số 100, Đường Lê Lợi, Phường 2',
    SoPhong: 50,
    SucChua: 100,
    SaoXepHang: 3,
    GiayCN: 'DL-2019-002',
    NgayCapPhep: '2019-03-10',
    NgayHetHan: '2024-03-10',
    DoanhThuThang: 250000000,
    LuotKhachThang: 350,
    TrangThai: 'Hoạt động',
    DanhGiaTB: 4.5,
    TienIch: 'Wifi, Điều hòa, Hồ bơi, Gym, Nhà hàng',
    GhiChu: 'Cần gia hạn giấy phép',
  },
  {
    MaDuLich: 3,
    MaCoSo: 'DL-003',
    TenCoSo: 'Nhà hàng Biển Xanh',
    LoaiHinh: 'Ẩm thực',
    PhanLoai: 'Nhà hàng',
    ChuSoHuu: 'Lê Thị B',
    DienThoai: '0923456789',
    Email: 'bienxanh@restaurant.com',
    DiaChi: 'Số 78, Đường Nguyễn Huệ, Phường 1',
    SoPhong: 0,
    SucChua: 120,
    SaoXepHang: 0,
    GiayCN: 'DL-2021-003',
    NgayCapPhep: '2021-08-20',
    NgayHetHan: '2026-08-20',
    DoanhThuThang: 120000000,
    LuotKhachThang: 800,
    TrangThai: 'Hoạt động',
    DanhGiaTB: 4.3,
    TienIch: 'Điều hòa, Wifi, Chỗ đỗ xe',
    GhiChu: '',
  },
  {
    MaDuLich: 4,
    MaCoSo: 'DL-004',
    TenCoSo: 'Công ty Du lịch Phương Nam',
    LoaiHinh: 'Lữ hành',
    PhanLoai: 'Tour du lịch',
    ChuSoHuu: 'Phạm Văn C',
    DienThoai: '0934567890',
    Email: 'phuongnam@travel.com',
    DiaChi: 'Số 56, Đường Trần Phú, Phường 3',
    SoPhong: 0,
    SucChua: 40,
    SaoXepHang: 0,
    GiayCN: 'DL-2022-004',
    NgayCapPhep: '2022-01-15',
    NgayHetHan: '2027-01-15',
    DoanhThuThang: 180000000,
    LuotKhachThang: 200,
    TrangThai: 'Hoạt động',
    DanhGiaTB: 4.6,
    TienIch: 'Xe đời mới, Hướng dẫn viên',
    GhiChu: '',
  },
  {
    MaDuLich: 5,
    MaCoSo: 'DL-005',
    TenCoSo: 'Homestay Đồng Quê',
    LoaiHinh: 'Lưu trú',
    PhanLoai: 'Homestay',
    ChuSoHuu: 'Hoàng Thị D',
    DienThoai: '0945678901',
    Email: 'dongque@homestay.com',
    DiaChi: 'Khu vực 5, Phường 4',
    SoPhong: 8,
    SucChua: 20,
    SaoXepHang: 0,
    GiayCN: 'DL-2023-005',
    NgayCapPhep: '2023-06-01',
    NgayHetHan: '2028-06-01',
    DoanhThuThang: 35000000,
    LuotKhachThang: 45,
    TrangThai: 'Hoạt động',
    DanhGiaTB: 4.8,
    TienIch: 'Wifi, Điều hòa, Vườn, BBQ',
    GhiChu: '',
  },
  {
    MaDuLich: 6,
    MaCoSo: 'DL-006',
    TenCoSo: 'Dịch vụ chụp ảnh Ánh Sáng',
    LoaiHinh: 'Dịch vụ',
    PhanLoai: 'Chụp ảnh du lịch',
    ChuSoHuu: 'Võ Văn E',
    DienThoai: '0956789012',
    Email: 'anhsang@photo.com',
    DiaChi: 'Số 23, Khu phố 2, Phường 1',
    SoPhong: 0,
    SucChua: 0,
    SaoXepHang: 0,
    GiayCN: 'DL-2023-006',
    NgayCapPhep: '2023-09-10',
    NgayHetHan: '2028-09-10',
    DoanhThuThang: 25000000,
    LuotKhachThang: 100,
    TrangThai: 'Hoạt động',
    DanhGiaTB: 4.7,
    TienIch: 'Studio, Thiết bị chuyên nghiệp',
    GhiChu: '',
  },
  {
    MaDuLich: 7,
    MaCoSo: 'DL-007',
    TenCoSo: 'Nhà nghỉ Thanh Bình',
    LoaiHinh: 'Lưu trú',
    PhanLoai: 'Nhà nghỉ',
    ChuSoHuu: 'Đặng Văn F',
    DienThoai: '0967890123',
    Email: 'thanhbinh@gmail.com',
    DiaChi: 'Số 89, Đường Hai Bà Trưng, Phường 2',
    SoPhong: 15,
    SucChua: 30,
    SaoXepHang: 1,
    GiayCN: 'DL-2018-007',
    NgayCapPhep: '2018-12-01',
    NgayHetHan: '2023-12-01',
    DoanhThuThang: 40000000,
    LuotKhachThang: 80,
    TrangThai: 'Tạm ngưng',
    DanhGiaTB: 3.8,
    TienIch: 'Wifi, Điều hòa',
    GhiChu: 'Đang nâng cấp cơ sở vật chất',
  },
];

interface DuLich {
  MaDuLich: number;
  MaCoSo: string;
  TenCoSo: string;
  LoaiHinh: string;
  PhanLoai: string;
  ChuSoHuu: string;
  DienThoai: string;
  Email: string;
  DiaChi: string;
  SoPhong: number;
  SucChua: number;
  SaoXepHang: number;
  GiayCN: string;
  NgayCapPhep: string;
  NgayHetHan: string;
  DoanhThuThang: number;
  LuotKhachThang: number;
  TrangThai: string;
  DanhGiaTB: number;
  TienIch: string;
  GhiChu: string;
}

export default function KinhDoanhDuLichPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DuLich | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaCoSo: '',
    TenCoSo: '',
    LoaiHinh: 'Lưu trú',
    PhanLoai: 'Nhà nghỉ',
    ChuSoHuu: '',
    DienThoai: '',
    Email: '',
    DiaChi: '',
    SoPhong: 0,
    SucChua: 0,
    SaoXepHang: 0,
    GiayCN: '',
    NgayCapPhep: '',
    NgayHetHan: '',
    DoanhThuThang: 0,
    LuotKhachThang: 0,
    DanhGiaTB: 0,
    TrangThai: 'Hoạt động',
    TienIch: '',
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockDuLich.filter((item) => {
    const matchSearch = 
      item.MaCoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenCoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuSoHuu.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchType = typeFilter === 'all' || item.LoaiHinh === typeFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchType && matchStatus;
  });

  // Stats
  const stats = {
    total: mockDuLich.length,
    totalRooms: mockDuLich.reduce((sum, d) => sum + d.SoPhong, 0),
    totalRevenue: mockDuLich.reduce((sum, d) => sum + d.DoanhThuThang, 0),
    totalGuests: mockDuLich.reduce((sum, d) => sum + d.LuotKhachThang, 0),
    active: mockDuLich.filter(d => d.TrangThai === 'Hoạt động').length,
    avgRating: (mockDuLich.reduce((sum, d) => sum + d.DanhGiaTB, 0) / mockDuLich.length).toFixed(1),
  };

  // Handlers
  const handleView = (record: DuLich) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: DuLich) => {
    setSelectedRecord(record);
    setFormData({
      MaCoSo: record.MaCoSo,
      TenCoSo: record.TenCoSo,
      LoaiHinh: record.LoaiHinh,
      PhanLoai: record.PhanLoai,
      ChuSoHuu: record.ChuSoHuu,
      DienThoai: record.DienThoai,
      Email: record.Email,
      DiaChi: record.DiaChi,
      SoPhong: record.SoPhong,
      SucChua: record.SucChua,
      SaoXepHang: record.SaoXepHang,
      GiayCN: record.GiayCN,
      NgayCapPhep: record.NgayCapPhep,
      NgayHetHan: record.NgayHetHan,
      DoanhThuThang: record.DoanhThuThang,
      LuotKhachThang: record.LuotKhachThang,
      DanhGiaTB: record.DanhGiaTB,
      TrangThai: record.TrangThai,
      TienIch: record.TienIch,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      MaCoSo: '',
      TenCoSo: '',
      LoaiHinh: 'Lưu trú',
      PhanLoai: 'Nhà nghỉ',
      ChuSoHuu: '',
      DienThoai: '',
      Email: '',
      DiaChi: '',
      SoPhong: 0,
      SucChua: 0,
      SaoXepHang: 0,
      GiayCN: '',
      NgayCapPhep: '',
      NgayHetHan: '',
      DoanhThuThang: 0,
      LuotKhachThang: 0,
      DanhGiaTB: 0,
      TrangThai: 'Hoạt động',
      TienIch: '',
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
      case 'Lưu trú':
        return <Hotel className="w-4 h-4 text-blue-500" />;
      case 'Ẩm thực':
        return <UtensilsCrossed className="w-4 h-4 text-orange-500" />;
      case 'Lữ hành':
        return <Bus className="w-4 h-4 text-green-500" />;
      case 'Dịch vụ':
        return <Camera className="w-4 h-4 text-purple-500" />;
      default:
        return <Palmtree className="w-4 h-4 text-cyan-500" />;
    }
  };

  const renderStars = (rating: number) => {
    if (rating === 0) return <span className="text-muted-foreground text-xs">-</span>;
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(star => (
          <Star 
            key={star} 
            className={`w-3 h-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-status-success to-secondary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Palmtree className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Kinh doanh Du lịch</h1>
              </div>
              <p className="text-white/90">Quản lý cơ sở lưu trú, dịch vụ du lịch trên địa bàn</p>
            </div>
            <Button className="w-full 2xl:w-auto bg-white text-cyan-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm cơ sở
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <Palmtree className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Cơ sở KD</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Hotel className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalRooms}</p>
              <p className="text-xs text-muted-foreground">Phòng lưu trú</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">{stats.totalGuests.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Khách/tháng</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{(stats.totalRevenue / 1000000).toFixed(0)}M</p>
              <p className="text-xs text-muted-foreground">DT/tháng</p>
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
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
              <p className="text-xs text-muted-foreground">Đánh giá TB</p>
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
              placeholder="Tìm kiếm theo mã, tên, chủ sở hữu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] h-11">
              <SelectValue placeholder="Loại hình" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại hình</SelectItem>
              <SelectItem value="Lưu trú">Lưu trú</SelectItem>
              <SelectItem value="Ẩm thực">Ẩm thực</SelectItem>
              <SelectItem value="Lữ hành">Lữ hành</SelectItem>
              <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
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
                <th className="text-left p-4 font-semibold">Tên cơ sở</th>
                <th className="text-left p-4 font-semibold">Loại hình</th>
                <th className="text-center p-4 font-semibold">Sức chứa</th>
                <th className="text-center p-4 font-semibold">Xếp hạng</th>
                <th className="text-right p-4 font-semibold">DT/tháng</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaDuLich} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.MaCoSo}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.LoaiHinh)}
                      <div>
                        <div className="font-medium">{record.TenCoSo}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{record.DiaChi.substring(0, 30)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <Badge variant="outline">{record.LoaiHinh}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{record.PhanLoai}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {record.SoPhong > 0 && <span className="font-bold">{record.SoPhong} phòng</span>}
                    {record.SucChua > 0 && <span className="block text-xs text-muted-foreground">{record.SucChua} khách</span>}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {renderStars(record.SaoXepHang)}
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {record.DanhGiaTB}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {formatCurrency(record.DoanhThuThang)}
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
              <Palmtree className="w-5 h-5" />
              Chi tiết cơ sở du lịch
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRecord?.MaCoSo}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  {getTypeIcon(selectedRecord.LoaiHinh)}
                  Thông tin cơ sở
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên cơ sở</Label>
                    <p className="font-medium">{selectedRecord.TenCoSo}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại hình</Label>
                    <p className="font-medium">{selectedRecord.LoaiHinh} - {selectedRecord.PhanLoai}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Chủ sở hữu</Label>
                    <p className="font-medium">{selectedRecord.ChuSoHuu}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{selectedRecord.DienThoai}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {selectedRecord.SoPhong > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedRecord.SoPhong}</p>
                    <p className="text-xs text-muted-foreground">Phòng</p>
                  </div>
                )}
                <div className="bg-teal-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-teal-600">{selectedRecord.SucChua}</p>
                  <p className="text-xs text-muted-foreground">Sức chứa</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{selectedRecord.LuotKhachThang}</p>
                  <p className="text-xs text-muted-foreground">Khách/tháng</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedRecord.DoanhThuThang)}</p>
                  <p className="text-xs text-muted-foreground">DT/tháng</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Giấy phép & Xếp hạng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Số giấy CN</Label>
                    <p className="font-mono">{selectedRecord.GiayCN}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Xếp hạng sao</Label>
                    <div>{renderStars(selectedRecord.SaoXepHang)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày cấp</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayCapPhep)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày hết hạn</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayHetHan)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Tiện ích</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.TienIch.split(', ').map((tienich, idx) => (
                    <Badge key={idx} variant="outline">{tienich}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground text-xs">Đánh giá trung bình:</Label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.round(selectedRecord.DanhGiaTB) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-1 font-bold">{selectedRecord.DanhGiaTB}</span>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Cập nhật cơ sở du lịch
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Thông tin cơ sở</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên cơ sở *</Label>
                  <Input
                    value={formData.TenCoSo}
                    onChange={(e) => setFormData({...formData, TenCoSo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loại hình</Label>
                  <Input
                    value={formData.LoaiHinh}
                    onChange={(e) => setFormData({...formData, LoaiHinh: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phân loại</Label>
                  <Input
                    value={formData.PhanLoai}
                    onChange={(e) => setFormData({...formData, PhanLoai: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chủ sở hữu</Label>
                  <Input
                    value={formData.ChuSoHuu}
                    onChange={(e) => setFormData({...formData, ChuSoHuu: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Điện thoại</Label>
                  <Input
                    value={formData.DienThoai}
                    onChange={(e) => setFormData({...formData, DienThoai: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={formData.DiaChi}
                    onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Quy mô & Hoạt động</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Số phòng</Label>
                  <Input
                    type="number"
                    value={formData.SoPhong}
                    onChange={(e) => setFormData({...formData, SoPhong: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sức chứa</Label>
                  <Input
                    type="number"
                    value={formData.SucChua}
                    onChange={(e) => setFormData({...formData, SucChua: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Khách/tháng</Label>
                  <Input
                    type="number"
                    value={formData.LuotKhachThang}
                    onChange={(e) => setFormData({...formData, LuotKhachThang: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>DT/tháng (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.DoanhThuThang}
                    onChange={(e) => setFormData({...formData, DoanhThuThang: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Giấy phép & Xếp hạng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số giấy CN</Label>
                  <Input
                    value={formData.GiayCN}
                    onChange={(e) => setFormData({...formData, GiayCN: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Xếp hạng sao</Label>
                  <Select value={formData.SaoXepHang.toString()} onValueChange={(v) => setFormData({...formData, SaoXepHang: parseInt(v)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Không xếp hạng</SelectItem>
                      <SelectItem value="1">1 sao</SelectItem>
                      <SelectItem value="2">2 sao</SelectItem>
                      <SelectItem value="3">3 sao</SelectItem>
                      <SelectItem value="4">4 sao</SelectItem>
                      <SelectItem value="5">5 sao</SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đánh giá TB</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.DanhGiaTB}
                  onChange={(e) => setFormData({...formData, DanhGiaTB: parseFloat(e.target.value)})}
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

            <div className="space-y-2">
              <Label>Tiện ích</Label>
              <Input
                value={formData.TienIch}
                onChange={(e) => setFormData({...formData, TienIch: e.target.value})}
                placeholder="VD: Wifi, Điều hòa, Hồ bơi..."
              />
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
              Thêm cơ sở du lịch mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã cơ sở *</Label>
                <Input
                  value={formData.MaCoSo}
                  onChange={(e) => setFormData({...formData, MaCoSo: e.target.value})}
                  placeholder="VD: DL-008"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại hình *</Label>
                <Select value={formData.LoaiHinh} onValueChange={(v) => setFormData({...formData, LoaiHinh: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lưu trú">Lưu trú</SelectItem>
                    <SelectItem value="Ẩm thực">Ẩm thực</SelectItem>
                    <SelectItem value="Lữ hành">Lữ hành</SelectItem>
                    <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên cơ sở *</Label>
                <Input
                  value={formData.TenCoSo}
                  onChange={(e) => setFormData({...formData, TenCoSo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Phân loại</Label>
                <Select value={formData.PhanLoai} onValueChange={(v) => setFormData({...formData, PhanLoai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nhà nghỉ">Nhà nghỉ</SelectItem>
                    <SelectItem value="Khách sạn">Khách sạn</SelectItem>
                    <SelectItem value="Homestay">Homestay</SelectItem>
                    <SelectItem value="Nhà hàng">Nhà hàng</SelectItem>
                    <SelectItem value="Tour du lịch">Tour du lịch</SelectItem>
                    <SelectItem value="Dịch vụ khác">Dịch vụ khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chủ sở hữu *</Label>
                <Input
                  value={formData.ChuSoHuu}
                  onChange={(e) => setFormData({...formData, ChuSoHuu: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Điện thoại *</Label>
                <Input
                  value={formData.DienThoai}
                  onChange={(e) => setFormData({...formData, DienThoai: e.target.value})}
                />
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
                <Label>Số phòng</Label>
                <Input
                  type="number"
                  value={formData.SoPhong}
                  onChange={(e) => setFormData({...formData, SoPhong: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Sức chứa</Label>
                <Input
                  type="number"
                  value={formData.SucChua}
                  onChange={(e) => setFormData({...formData, SucChua: parseInt(e.target.value)})}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Khách/tháng</Label>
                <Input
                  type="number"
                  value={formData.LuotKhachThang}
                  onChange={(e) => setFormData({...formData, LuotKhachThang: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>DT/tháng (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.DoanhThuThang}
                  onChange={(e) => setFormData({...formData, DoanhThuThang: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold">Giấy phép & Xếp hạng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số giấy CN</Label>
                  <Input
                    value={formData.GiayCN}
                    onChange={(e) => setFormData({...formData, GiayCN: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Xếp hạng sao</Label>
                  <Select value={formData.SaoXepHang.toString()} onValueChange={(v) => setFormData({...formData, SaoXepHang: parseInt(v, 10)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Không xếp hạng</SelectItem>
                      <SelectItem value="1">1 sao</SelectItem>
                      <SelectItem value="2">2 sao</SelectItem>
                      <SelectItem value="3">3 sao</SelectItem>
                      <SelectItem value="4">4 sao</SelectItem>
                      <SelectItem value="5">5 sao</SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đánh giá TB</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.DanhGiaTB}
                  onChange={(e) => setFormData({...formData, DanhGiaTB: parseFloat(e.target.value) || 0})}
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
            <div className="space-y-2">
              <Label>Tiện ích</Label>
              <Input
                value={formData.TienIch}
                onChange={(e) => setFormData({...formData, TienIch: e.target.value})}
                placeholder="VD: Wifi, Điều hòa, Hồ bơi..."
              />
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
