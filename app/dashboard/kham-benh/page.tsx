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
  Stethoscope,
  Search,
  Plus,
  Download,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  X,
  Activity,
  Pill,
  FileText,
  UserCheck,
  Phone,
  MapPin,
  Heart,
  Thermometer,
} from 'lucide-react';
import { mockPhieuKham, formatDateTime } from '@/lib/mock-data';

// Extended mock data for PhieuKham
const mockPhieuKhamFull = [
  {
    MaPhieuKham: 1,
    MaPhieu: 'PK-2024-0001',
    MaBenhNhan: 1,
    TenBenhNhan: 'Nguyễn Văn An',
    NgaySinh: '1985-05-15',
    GioiTinh: 'Nam',
    CCCD: '001234567890',
    SoDienThoai: '0901234567',
    DiaChi: 'Số 123, Phường 1',
    MaBHYT: '79-01-00-12345678-9',
    NgayKham: '2024-01-20 08:30:00',
    TrieuChung: 'Sốt cao, ho khan, đau họng',
    NhietDo: 38.5,
    HuyetAp: '120/80',
    NhipTim: 85,
    CanNang: 65,
    ChieuCao: 170,
    ChuanDoan: 'Viêm họng cấp (J02)',
    PhuongPhapDieuTri: 'Điều trị ngoại trú, uống thuốc theo đơn',
    DonThuoc: 'Paracetamol 500mg (3 viên/ngày), Vitamin C 1000mg (1 viên/ngày), Thuốc ho Prospan (3 lần/ngày)',
    BacSiKham: 'BS. Trần Văn Bình',
    MaTrangThai: 'HOAN_THANH',
    TrangThai: 'Hoàn thành',
    NgayTaiKham: '2024-01-27',
    PhiKham: 50000,
    BHYTChiTra: 40000,
    GhiChu: 'Theo dõi, uống nhiều nước',
  },
  {
    MaPhieuKham: 2,
    MaPhieu: 'PK-2024-0002',
    MaBenhNhan: 2,
    TenBenhNhan: 'Trần Thị Bình',
    NgaySinh: '1990-08-20',
    GioiTinh: 'Nữ',
    CCCD: '001234567891',
    SoDienThoai: '0912345678',
    DiaChi: 'Số 45, Phường 2',
    MaBHYT: '79-01-00-12345679-0',
    NgayKham: '2024-01-20 09:15:00',
    TrieuChung: 'Đau bụng, buồn nôn',
    NhietDo: 37.2,
    HuyetAp: '110/70',
    NhipTim: 78,
    CanNang: 52,
    ChieuCao: 158,
    ChuanDoan: 'Viêm dạ dày (K29)',
    PhuongPhapDieuTri: 'Điều trị ngoại trú',
    DonThuoc: 'Omeprazole 20mg (2 viên/ngày), Domperidone 10mg (3 viên/ngày)',
    BacSiKham: 'BS. Lê Thị Dung',
    MaTrangThai: 'HOAN_THANH',
    TrangThai: 'Hoàn thành',
    NgayTaiKham: '2024-01-30',
    PhiKham: 50000,
    BHYTChiTra: 40000,
    GhiChu: 'Kiêng đồ chua, cay',
  },
  {
    MaPhieuKham: 3,
    MaPhieu: 'PK-2024-0003',
    MaBenhNhan: 3,
    TenBenhNhan: 'Lê Văn Cường',
    NgaySinh: '1978-03-10',
    GioiTinh: 'Nam',
    CCCD: '001234567892',
    SoDienThoai: '0923456789',
    DiaChi: 'Số 67, Phường 3',
    MaBHYT: '79-01-00-12345680-1',
    NgayKham: '2024-01-20 10:00:00',
    TrieuChung: 'Khám sức khỏe định kỳ',
    NhietDo: 36.8,
    HuyetAp: '130/85',
    NhipTim: 72,
    CanNang: 70,
    ChieuCao: 168,
    ChuanDoan: 'Sức khỏe bình thường, huyết áp hơi cao',
    PhuongPhapDieuTri: 'Theo dõi huyết áp',
    DonThuoc: '',
    BacSiKham: 'BS. Trần Văn Bình',
    MaTrangThai: 'HOAN_THANH',
    TrangThai: 'Hoàn thành',
    NgayTaiKham: '2024-04-20',
    PhiKham: 100000,
    BHYTChiTra: 80000,
    GhiChu: 'Khám định kỳ 3 tháng/lần',
  },
  {
    MaPhieuKham: 4,
    MaPhieu: 'PK-2024-0004',
    MaBenhNhan: 4,
    TenBenhNhan: 'Phạm Thị Dung',
    NgaySinh: '2015-11-25',
    GioiTinh: 'Nữ',
    CCCD: '',
    SoDienThoai: '0934567890',
    DiaChi: 'Số 89, Phường 1',
    MaBHYT: '79-03-00-12345681-2',
    NgayKham: '2024-01-20 10:30:00',
    TrieuChung: 'Sốt, phát ban',
    NhietDo: 38.8,
    HuyetAp: '',
    NhipTim: 95,
    CanNang: 20,
    ChieuCao: 110,
    ChuanDoan: 'Sốt phát ban (chờ xét nghiệm)',
    PhuongPhapDieuTri: 'Theo dõi, hạ sốt',
    DonThuoc: 'Paracetamol 150mg (theo cân nặng)',
    BacSiKham: 'BS. Lê Thị Dung',
    MaTrangThai: 'DANG_XU_LY',
    TrangThai: 'Đang theo dõi',
    NgayTaiKham: '2024-01-21',
    PhiKham: 50000,
    BHYTChiTra: 50000,
    GhiChu: 'Trẻ em - theo dõi sát',
  },
  {
    MaPhieuKham: 5,
    MaPhieu: 'PK-2024-0005',
    MaBenhNhan: 5,
    TenBenhNhan: 'Hoàng Văn Em',
    NgaySinh: '1955-07-05',
    GioiTinh: 'Nam',
    CCCD: '001234567893',
    SoDienThoai: '0945678901',
    DiaChi: 'Số 12, Phường 2',
    MaBHYT: '79-02-00-12345682-3',
    NgayKham: '2024-01-20 11:00:00',
    TrieuChung: 'Đau ngực, khó thở',
    NhietDo: 36.5,
    HuyetAp: '150/95',
    NhipTim: 90,
    CanNang: 72,
    ChieuCao: 165,
    ChuanDoan: 'Tăng huyết áp, cần chuyển viện',
    PhuongPhapDieuTri: 'Chuyển viện tuyến trên',
    DonThuoc: '',
    BacSiKham: 'BS. Trần Văn Bình',
    MaTrangThai: 'CHUYEN_VIEN',
    TrangThai: 'Chuyển viện',
    NgayTaiKham: null,
    PhiKham: 50000,
    BHYTChiTra: 40000,
    GhiChu: 'Chuyển BV Đa khoa tỉnh, cấp cứu',
  },
];

interface PhieuKham {
  MaPhieuKham: number;
  MaPhieu: string;
  MaBenhNhan: number;
  TenBenhNhan: string;
  NgaySinh: string;
  GioiTinh: string;
  CCCD: string;
  SoDienThoai: string;
  DiaChi: string;
  MaBHYT: string;
  NgayKham: string;
  TrieuChung: string;
  NhietDo: number;
  HuyetAp: string;
  NhipTim: number;
  CanNang: number;
  ChieuCao: number;
  ChuanDoan: string;
  PhuongPhapDieuTri: string;
  DonThuoc: string;
  BacSiKham: string;
  MaTrangThai: string;
  TrangThai: string;
  NgayTaiKham: string | null;
  PhiKham: number;
  BHYTChiTra: number;
  GhiChu: string;
}

export default function KhamBenhPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedPhieu, setSelectedPhieu] = useState<PhieuKham | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaPhieu: '',
    TenBenhNhan: '',
    NgaySinh: '',
    GioiTinh: 'Nam',
    CCCD: '',
    SoDienThoai: '',
    DiaChi: '',
    MaBHYT: '',
    TrieuChung: '',
    NhietDo: 36.5,
    HuyetAp: '',
    NhipTim: 0,
    CanNang: 0,
    ChieuCao: 0,
    ChuanDoan: '',
    PhuongPhapDieuTri: '',
    DonThuoc: '',
    BacSiKham: '',
    MaTrangThai: 'DANG_XU_LY',
    NgayTaiKham: '',
    PhiKham: 50000,
    BHYTChiTra: 0,
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockPhieuKhamFull.filter((item) => {
    const matchSearch = 
      item.MaPhieu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenBenhNhan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.CCCD.includes(searchQuery) ||
      item.MaBHYT.includes(searchQuery);
    
    const matchStatus = statusFilter === 'all' || item.MaTrangThai === statusFilter;
    const matchDate = !dateFilter || item.NgayKham.startsWith(dateFilter);
    
    return matchSearch && matchStatus && matchDate;
  });

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const stats = {
    today: mockPhieuKhamFull.filter(p => p.NgayKham.startsWith('2024-01-20')).length, // Demo date
    waiting: mockPhieuKhamFull.filter(p => p.MaTrangThai === 'CHO_KHAM').length,
    processing: mockPhieuKhamFull.filter(p => p.MaTrangThai === 'DANG_XU_LY').length,
    completed: mockPhieuKhamFull.filter(p => p.MaTrangThai === 'HOAN_THANH').length,
    transferred: mockPhieuKhamFull.filter(p => p.MaTrangThai === 'CHUYEN_VIEN').length,
  };

  // Handlers
  const handleView = (phieu: PhieuKham) => {
    setSelectedPhieu(phieu);
    setViewDialogOpen(true);
  };

  const handleEdit = (phieu: PhieuKham) => {
    setSelectedPhieu(phieu);
    setFormData({
      MaPhieu: phieu.MaPhieu,
      TenBenhNhan: phieu.TenBenhNhan,
      NgaySinh: phieu.NgaySinh,
      GioiTinh: phieu.GioiTinh,
      CCCD: phieu.CCCD,
      SoDienThoai: phieu.SoDienThoai,
      DiaChi: phieu.DiaChi,
      MaBHYT: phieu.MaBHYT,
      TrieuChung: phieu.TrieuChung,
      NhietDo: phieu.NhietDo,
      HuyetAp: phieu.HuyetAp,
      NhipTim: phieu.NhipTim,
      CanNang: phieu.CanNang,
      ChieuCao: phieu.ChieuCao,
      ChuanDoan: phieu.ChuanDoan,
      PhuongPhapDieuTri: phieu.PhuongPhapDieuTri,
      DonThuoc: phieu.DonThuoc,
      BacSiKham: phieu.BacSiKham,
      MaTrangThai: phieu.MaTrangThai,
      NgayTaiKham: phieu.NgayTaiKham || '',
      PhiKham: phieu.PhiKham,
      BHYTChiTra: phieu.BHYTChiTra,
      GhiChu: phieu.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    const newMaPhieu = `PK-${new Date().getFullYear()}-${String(mockPhieuKhamFull.length + 1).padStart(4, '0')}`;
    setFormData({
      MaPhieu: newMaPhieu,
      TenBenhNhan: '',
      NgaySinh: '',
      GioiTinh: 'Nam',
      CCCD: '',
      SoDienThoai: '',
      DiaChi: '',
      MaBHYT: '',
      TrieuChung: '',
      NhietDo: 36.5,
      HuyetAp: '',
      NhipTim: 0,
      CanNang: 0,
      ChieuCao: 0,
      ChuanDoan: '',
      PhuongPhapDieuTri: '',
      DonThuoc: '',
      BacSiKham: '',
      MaTrangThai: 'CHO_KHAM',
      NgayTaiKham: '',
      PhiKham: 50000,
      BHYTChiTra: 0,
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
      case 'HOAN_THANH':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'DANG_XU_LY':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><Activity className="w-3 h-3 mr-1" />Đang theo dõi</Badge>;
      case 'CHO_KHAM':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><Clock className="w-3 h-3 mr-1" />Chờ khám</Badge>;
      case 'CHUYEN_VIEN':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><Activity className="w-3 h-3 mr-1" />Chuyển viện</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-700 border-0">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-6 sm:p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Khám chữa bệnh</h1>
              </div>
              <p className="text-sm sm:text-base text-white/90">Quản lý khám chữa bệnh ban đầu tại trạm y tế</p>
            </div>
            <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Tiếp nhận bệnh nhân</span>
              <span className="sm:hidden">Tiếp nhận</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-secondary/10 rounded-xl">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.today}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Lượt khám hôm nay</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-status-warning/10 rounded-xl">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-status-warning" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.waiting}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Đang chờ khám</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.processing}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Đang theo dõi</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-status-success/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-status-success" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.completed}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Hoàn thành</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-status-danger/10 rounded-xl">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-status-danger" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.transferred}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Chuyển viện</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <div className="flex-1 min-w-full sm:min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã, tên bệnh nhân, CCCD, BHYT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 bg-slate-50 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="CHO_KHAM">Chờ khám</SelectItem>
              <SelectItem value="DANG_XU_LY">Đang theo dõi</SelectItem>
              <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
              <SelectItem value="CHUYEN_VIEN">Chuyển viện</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-[180px] h-10 sm:h-11"
          />
          <Button variant="outline" className="w-full sm:w-auto h-10 sm:h-11">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Xuất Excel</span>
            <span className="sm:hidden">Xuất</span>
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">Mã phiếu</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">Bệnh nhân</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden md:table-cell">Tuổi/GT</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden lg:table-cell">BHYT</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden xl:table-cell">Triệu chứng</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden lg:table-cell">Chẩn đoán</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden xl:table-cell">Bác sĩ</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm hidden md:table-cell">Giờ khám</th>
                <th className="text-left p-3 sm:p-4 font-semibold text-xs sm:text-sm">Trạng thái</th>
                <th className="text-right p-3 sm:p-4 font-semibold text-xs sm:text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((phieu) => {
                const age = new Date().getFullYear() - new Date(phieu.NgaySinh).getFullYear();
                return (
                  <tr key={phieu.MaPhieuKham} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      <span className="font-semibold text-primary">{phieu.MaPhieu}</span>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{phieu.TenBenhNhan}</div>
                          <div className="text-xs text-muted-foreground">{phieu.SoDienThoai}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm hidden md:table-cell">
                      {age} tuổi / {phieu.GioiTinh}
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell">
                      <span className="text-xs font-mono">{phieu.MaBHYT || 'Không có'}</span>
                    </td>
                    <td className="p-3 sm:p-4 hidden xl:table-cell">
                      <div className="max-w-[150px] truncate text-xs" title={phieu.TrieuChung}>
                        {phieu.TrieuChung}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell">
                      <div className="max-w-[150px] truncate text-xs" title={phieu.ChuanDoan}>
                        {phieu.ChuanDoan}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-xs">
                        <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        {phieu.BacSiKham}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {phieu.NgayKham.split(' ')[1]}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      {getStatusBadge(phieu.MaTrangThai)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleView(phieu)}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(phieu)}
                          title="Cập nhật"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy phiếu khám phù hợp</p>
          </div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Chi tiết phiếu khám bệnh
            </DialogTitle>
            <DialogDescription>
              Mã phiếu: {selectedPhieu?.MaPhieu}
            </DialogDescription>
          </DialogHeader>
          {selectedPhieu && (
            <div className="grid gap-4 py-4">
              {/* Patient Info */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin bệnh nhân
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Họ và tên</Label>
                    <p className="font-medium">{selectedPhieu.TenBenhNhan}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày sinh</Label>
                    <p className="font-medium">{selectedPhieu.NgaySinh}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Giới tính</Label>
                    <p className="font-medium">{selectedPhieu.GioiTinh}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">CCCD</Label>
                    <p className="font-medium font-mono">{selectedPhieu.CCCD || 'Không có'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{selectedPhieu.SoDienThoai}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">BHYT</Label>
                    <p className="font-medium font-mono text-sm">{selectedPhieu.MaBHYT || 'Không có'}</p>
                  </div>
                  <div className="space-y-1 col-span-3">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedPhieu.DiaChi}</p>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Sinh hiệu
                </h4>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Thermometer className="w-5 h-5 mx-auto mb-1 text-red-500" />
                    <p className="text-lg font-bold">{selectedPhieu.NhietDo}°C</p>
                    <p className="text-xs text-muted-foreground">Nhiệt độ</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Heart className="w-5 h-5 mx-auto mb-1 text-red-500" />
                    <p className="text-lg font-bold">{selectedPhieu.HuyetAp || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Huyết áp</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Activity className="w-5 h-5 mx-auto mb-1 text-green-500" />
                    <p className="text-lg font-bold">{selectedPhieu.NhipTim}</p>
                    <p className="text-xs text-muted-foreground">Nhịp tim</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <User className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                    <p className="text-lg font-bold">{selectedPhieu.CanNang}kg</p>
                    <p className="text-xs text-muted-foreground">Cân nặng</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <User className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                    <p className="text-lg font-bold">{selectedPhieu.ChieuCao}cm</p>
                    <p className="text-xs text-muted-foreground">Chiều cao</p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Khám bệnh
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Triệu chứng</Label>
                    <p className="font-medium">{selectedPhieu.TrieuChung}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Chẩn đoán</Label>
                    <p className="font-medium text-primary">{selectedPhieu.ChuanDoan}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Phương pháp điều trị</Label>
                    <p className="font-medium">{selectedPhieu.PhuongPhapDieuTri}</p>
                  </div>
                </div>
              </div>

              {/* Prescription */}
              {selectedPhieu.DonThuoc && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Đơn thuốc
                  </h4>
                  <p className="font-medium whitespace-pre-line">{selectedPhieu.DonThuoc}</p>
                </div>
              )}

              {/* Footer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Bác sĩ khám</Label>
                  <p className="font-medium">{selectedPhieu.BacSiKham}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                  <div>{getStatusBadge(selectedPhieu.MaTrangThai)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Phí khám</Label>
                  <p className="font-medium">{formatCurrency(selectedPhieu.PhiKham)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">BHYT chi trả</Label>
                  <p className="font-medium text-green-600">{formatCurrency(selectedPhieu.BHYTChiTra)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Ngày tái khám</Label>
                  <p className="font-medium">{selectedPhieu.NgayTaiKham || 'Không có'}</p>
                </div>
              </div>

              {selectedPhieu.GhiChu && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Ghi chú</Label>
                  <p className="font-medium bg-yellow-50 p-3 rounded-lg">{selectedPhieu.GhiChu}</p>
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
              Cập nhật phiếu khám
            </DialogTitle>
            <DialogDescription>
              Mã phiếu: {formData.MaPhieu}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin bệnh nhân
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input
                    value={formData.TenBenhNhan}
                    onChange={(e) => setFormData({...formData, TenBenhNhan: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày sinh</Label>
                  <Input
                    type="date"
                    value={formData.NgaySinh}
                    onChange={(e) => setFormData({...formData, NgaySinh: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <Select value={formData.GioiTinh} onValueChange={(v) => setFormData({...formData, GioiTinh: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CCCD</Label>
                  <Input
                    value={formData.CCCD}
                    onChange={(e) => setFormData({...formData, CCCD: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Điện thoại</Label>
                  <Input
                    value={formData.SoDienThoai}
                    onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã BHYT</Label>
                  <Input
                    value={formData.MaBHYT}
                    onChange={(e) => setFormData({...formData, MaBHYT: e.target.value})}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Triệu chứng *</Label>
                <Textarea
                  value={formData.TrieuChung}
                  onChange={(e) => setFormData({...formData, TrieuChung: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Chẩn đoán *</Label>
                <Textarea
                  value={formData.ChuanDoan}
                  onChange={(e) => setFormData({...formData, ChuanDoan: e.target.value})}
                  rows={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Nhiệt độ (°C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.NhietDo}
                  onChange={(e) => setFormData({...formData, NhietDo: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Huyết áp</Label>
                <Input
                  value={formData.HuyetAp}
                  onChange={(e) => setFormData({...formData, HuyetAp: e.target.value})}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label>Nhịp tim</Label>
                <Input
                  type="number"
                  value={formData.NhipTim}
                  onChange={(e) => setFormData({...formData, NhipTim: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Cân nặng (kg)</Label>
                <Input
                  type="number"
                  value={formData.CanNang}
                  onChange={(e) => setFormData({...formData, CanNang: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phương pháp điều trị</Label>
              <Textarea
                value={formData.PhuongPhapDieuTri}
                onChange={(e) => setFormData({...formData, PhuongPhapDieuTri: e.target.value})}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn thuốc</Label>
              <Textarea
                value={formData.DonThuoc}
                onChange={(e) => setFormData({...formData, DonThuoc: e.target.value})}
                rows={3}
                placeholder="Tên thuốc, liều dùng, cách dùng..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bác sĩ khám</Label>
                <Select value={formData.BacSiKham} onValueChange={(v) => setFormData({...formData, BacSiKham: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bác sĩ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BS. Trần Văn Bình">BS. Trần Văn Bình</SelectItem>
                    <SelectItem value="BS. Lê Thị Dung">BS. Lê Thị Dung</SelectItem>
                    <SelectItem value="BS. Nguyễn Văn Cường">BS. Nguyễn Văn Cường</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.MaTrangThai} onValueChange={(v) => setFormData({...formData, MaTrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHO_KHAM">Chờ khám</SelectItem>
                    <SelectItem value="DANG_XU_LY">Đang theo dõi</SelectItem>
                    <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                    <SelectItem value="CHUYEN_VIEN">Chuyển viện</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày tái khám</Label>
                <Input
                  type="date"
                  value={formData.NgayTaiKham}
                  onChange={(e) => setFormData({...formData, NgayTaiKham: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Phí khám (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.PhiKham}
                  onChange={(e) => setFormData({...formData, PhiKham: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>BHYT chi trả (VNĐ)</Label>
              <Input
                type="number"
                value={formData.BHYTChiTra}
                onChange={(e) => setFormData({...formData, BHYTChiTra: parseInt(e.target.value)})}
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
              Tiếp nhận bệnh nhân mới
            </DialogTitle>
            <DialogDescription>
              Mã phiếu: {formData.MaPhieu}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Họ và tên *</Label>
                <Input
                  value={formData.TenBenhNhan}
                  onChange={(e) => setFormData({...formData, TenBenhNhan: e.target.value})}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày sinh *</Label>
                <Input
                  type="date"
                  value={formData.NgaySinh}
                  onChange={(e) => setFormData({...formData, NgaySinh: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select value={formData.GioiTinh} onValueChange={(v) => setFormData({...formData, GioiTinh: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>CCCD</Label>
                <Input
                  value={formData.CCCD}
                  onChange={(e) => setFormData({...formData, CCCD: e.target.value})}
                  placeholder="Số CCCD"
                />
              </div>
              <div className="space-y-2">
                <Label>Điện thoại *</Label>
                <Input
                  value={formData.SoDienThoai}
                  onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})}
                  placeholder="0xxx xxx xxx"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Địa chỉ</Label>
                <Input
                  value={formData.DiaChi}
                  onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
                  placeholder="Địa chỉ"
                />
              </div>
              <div className="space-y-2">
                <Label>Mã BHYT</Label>
                <Input
                  value={formData.MaBHYT}
                  onChange={(e) => setFormData({...formData, MaBHYT: e.target.value})}
                  placeholder="Mã thẻ BHYT"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Triệu chứng *</Label>
              <Textarea
                value={formData.TrieuChung}
                onChange={(e) => setFormData({...formData, TrieuChung: e.target.value})}
                rows={2}
                placeholder="Mô tả triệu chứng..."
              />
            </div>
            <div className="space-y-2">
              <Label>Chẩn đoán sơ bộ</Label>
              <Textarea
                value={formData.ChuanDoan}
                onChange={(e) => setFormData({...formData, ChuanDoan: e.target.value})}
                rows={2}
                placeholder="Chẩn đoán ban đầu (nếu có)"
              />
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Nhiệt độ (°C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.NhietDo}
                  onChange={(e) => setFormData({...formData, NhietDo: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Huyết áp</Label>
                <Input
                  value={formData.HuyetAp}
                  onChange={(e) => setFormData({...formData, HuyetAp: e.target.value})}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label>Nhịp tim</Label>
                <Input
                  type="number"
                  value={formData.NhipTim}
                  onChange={(e) => setFormData({...formData, NhipTim: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Cân nặng</Label>
                <Input
                  type="number"
                  value={formData.CanNang}
                  onChange={(e) => setFormData({...formData, CanNang: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Chiều cao</Label>
                <Input
                  type="number"
                  value={formData.ChieuCao}
                  onChange={(e) => setFormData({...formData, ChieuCao: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phương pháp điều trị</Label>
              <Textarea
                value={formData.PhuongPhapDieuTri}
                onChange={(e) => setFormData({...formData, PhuongPhapDieuTri: e.target.value})}
                rows={2}
                placeholder="Phương pháp điều trị ban đầu"
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn thuốc</Label>
              <Textarea
                value={formData.DonThuoc}
                onChange={(e) => setFormData({...formData, DonThuoc: e.target.value})}
                rows={2}
                placeholder="Tên thuốc, liều dùng, cách dùng..."
              />
            </div>
            <div className="space-y-2">
              <Label>Bác sĩ khám *</Label>
              <Select value={formData.BacSiKham} onValueChange={(v) => setFormData({...formData, BacSiKham: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BS. Trần Văn Bình">BS. Trần Văn Bình</SelectItem>
                  <SelectItem value="BS. Lê Thị Dung">BS. Lê Thị Dung</SelectItem>
                  <SelectItem value="BS. Nguyễn Văn Cường">BS. Nguyễn Văn Cường</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.MaTrangThai} onValueChange={(v) => setFormData({...formData, MaTrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHO_KHAM">Chờ khám</SelectItem>
                    <SelectItem value="DANG_XU_LY">Đang theo dõi</SelectItem>
                    <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                    <SelectItem value="CHUYEN_VIEN">Chuyển viện</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày tái khám</Label>
                <Input
                  type="date"
                  value={formData.NgayTaiKham}
                  onChange={(e) => setFormData({...formData, NgayTaiKham: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phí khám (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.PhiKham}
                  onChange={(e) => setFormData({...formData, PhiKham: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>BHYT chi trả (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.BHYTChiTra}
                  onChange={(e) => setFormData({...formData, BHYTChiTra: parseInt(e.target.value)})}
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
              Tiếp nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
