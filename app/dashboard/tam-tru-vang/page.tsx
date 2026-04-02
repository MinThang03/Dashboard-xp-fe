'use client';

import { useEffect, useState } from 'react';
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
  ShieldCheck,
  Search,
  Plus,
  Download,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  X,
  Calendar,
  MapPin,
  User,
  Home,
  Phone,
  FileText,
  ArrowRightLeft,
  XCircle,
  Trash2,
} from 'lucide-react';
import { formatDate } from '@/lib/mock-data';
import { tamTruTamVangApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

// Mock data cho tạm trú tạm vắng
const mockTamTruVang = [
  {
    MaTT: 1,
    MaDangKy: 'TT-2024-001',
    LoaiDangKy: 'Tạm trú',
    HoTen: 'Nguyễn Văn Minh',
    CCCD: '079123456789',
    NgaySinh: '1990-05-15',
    GioiTinh: 'Nam',
    QueQuan: 'Hà Nội',
    DiaChiThuongTru: 'Số 45, Ngõ 12, Phường Đống Đa, Hà Nội',
    DiaChiTamTru: 'Số 78, Khu phố 1, Phường 1, Quận 1',
    ChuHo: 'Trần Văn A',
    QuanHeVoiChuHo: 'Thuê trọ',
    SoDienThoai: '0901234567',
    NgayDangKy: '2024-01-10',
    NgayHetHan: '2025-01-10',
    LyDo: 'Làm việc tại công ty ABC',
    TrangThai: 'Còn hạn',
    CanBoXuLy: 'Lê Thị B',
    GhiChu: '',
  },
  {
    MaTT: 2,
    MaDangKy: 'TV-2024-001',
    LoaiDangKy: 'Tạm vắng',
    HoTen: 'Trần Thị Hoa',
    CCCD: '079987654321',
    NgaySinh: '1985-08-20',
    GioiTinh: 'Nữ',
    QueQuan: 'Khu phố 2, Phường 2',
    DiaChiThuongTru: 'Số 56, Khu phố 2, Phường 2',
    DiaChiTamTru: 'TP. Hồ Chí Minh',
    ChuHo: 'Trần Văn B',
    QuanHeVoiChuHo: 'Vợ',
    SoDienThoai: '0912345678',
    NgayDangKy: '2024-01-12',
    NgayHetHan: '2024-07-12',
    LyDo: 'Đi công tác dài hạn',
    TrangThai: 'Còn hạn',
    CanBoXuLy: 'Lê Thị B',
    GhiChu: '',
  },
  {
    MaTT: 3,
    MaDangKy: 'TT-2024-002',
    LoaiDangKy: 'Tạm trú',
    HoTen: 'Phạm Văn Nam',
    CCCD: '079456789123',
    NgaySinh: '1995-12-25',
    GioiTinh: 'Nam',
    QueQuan: 'Bình Dương',
    DiaChiThuongTru: 'Thành phố Thủ Dầu Một, Bình Dương',
    DiaChiTamTru: 'Hẻm 234, Khu phố 3, Phường 1',
    ChuHo: 'Nguyễn Văn C',
    QuanHeVoiChuHo: 'Thuê trọ',
    SoDienThoai: '0923456789',
    NgayDangKy: '2024-02-01',
    NgayHetHan: '2025-02-01',
    LyDo: 'Học đại học',
    TrangThai: 'Còn hạn',
    CanBoXuLy: 'Nguyễn Văn D',
    GhiChu: '',
  },
  {
    MaTT: 4,
    MaDangKy: 'TT-2023-045',
    LoaiDangKy: 'Tạm trú',
    HoTen: 'Lê Thị Mai',
    CCCD: '079789123456',
    NgaySinh: '1988-03-10',
    GioiTinh: 'Nữ',
    QueQuan: 'Nghệ An',
    DiaChiThuongTru: 'Xã Nghi Lộc, Nghệ An',
    DiaChiTamTru: 'Số 100, Đường Lê Lợi, Phường 2',
    ChuHo: 'Hoàng Văn E',
    QuanHeVoiChuHo: 'Thuê trọ',
    SoDienThoai: '0934567890',
    NgayDangKy: '2023-03-15',
    NgayHetHan: '2024-03-15',
    LyDo: 'Buôn bán',
    TrangThai: 'Sắp hết hạn',
    CanBoXuLy: 'Lê Thị B',
    GhiChu: 'Cần gia hạn',
  },
  {
    MaTT: 5,
    MaDangKy: 'TV-2024-002',
    LoaiDangKy: 'Tạm vắng',
    HoTen: 'Võ Văn Hùng',
    CCCD: '079321654987',
    NgaySinh: '1992-07-08',
    GioiTinh: 'Nam',
    QueQuan: 'Khu phố 4, Phường 1',
    DiaChiThuongTru: 'Số 89, Khu phố 4, Phường 1',
    DiaChiTamTru: 'Đà Nẵng',
    ChuHo: 'Võ Văn F',
    QuanHeVoiChuHo: 'Con',
    SoDienThoai: '0945678901',
    NgayDangKy: '2024-02-15',
    NgayHetHan: '2024-08-15',
    LyDo: 'Đi du học',
    TrangThai: 'Còn hạn',
    CanBoXuLy: 'Nguyễn Văn D',
    GhiChu: '',
  },
  {
    MaTT: 6,
    MaDangKy: 'TT-2022-089',
    LoaiDangKy: 'Tạm trú',
    HoTen: 'Đặng Thị Lan',
    CCCD: '079654321789',
    NgaySinh: '1980-11-30',
    GioiTinh: 'Nữ',
    QueQuan: 'Thanh Hóa',
    DiaChiThuongTru: 'Huyện Hoằng Hóa, Thanh Hóa',
    DiaChiTamTru: 'Số 67, Khu phố 5, Phường 3',
    ChuHo: 'Trần Văn G',
    QuanHeVoiChuHo: 'Thuê trọ',
    SoDienThoai: '0956789012',
    NgayDangKy: '2022-12-01',
    NgayHetHan: '2023-12-01',
    LyDo: 'Làm việc',
    TrangThai: 'Hết hạn',
    CanBoXuLy: 'Lê Thị B',
    GhiChu: 'Chưa gia hạn',
  },
  {
    MaTT: 7,
    MaDangKy: 'TT-2024-003',
    LoaiDangKy: 'Tạm trú',
    HoTen: 'Ngô Văn Tùng',
    CCCD: '079147258369',
    NgaySinh: '1998-01-20',
    GioiTinh: 'Nam',
    QueQuan: 'Hải Phòng',
    DiaChiThuongTru: 'Quận Hồng Bàng, Hải Phòng',
    DiaChiTamTru: 'Số 123, Đường Nguyễn Huệ, Phường 1',
    ChuHo: 'Lý Văn H',
    QuanHeVoiChuHo: 'Thuê trọ',
    SoDienThoai: '0967890123',
    NgayDangKy: '2024-03-01',
    NgayHetHan: '2025-03-01',
    LyDo: 'Làm việc tại KCN',
    TrangThai: 'Còn hạn',
    CanBoXuLy: 'Nguyễn Văn D',
    GhiChu: '',
  },
  {
    MaTT: 8,
    MaDangKy: 'TV-2024-003',
    LoaiDangKy: 'Tạm vắng',
    HoTen: 'Bùi Thị Ngọc',
    CCCD: '079369258147',
    NgaySinh: '1975-04-05',
    GioiTinh: 'Nữ',
    QueQuan: 'Khu phố 1, Phường 2',
    DiaChiThuongTru: 'Số 34, Khu phố 1, Phường 2',
    DiaChiTamTru: 'Hoa Kỳ',
    ChuHo: 'Bùi Văn K',
    QuanHeVoiChuHo: 'Vợ',
    SoDienThoai: '0978901234',
    NgayDangKy: '2024-03-10',
    NgayHetHan: '2025-03-10',
    LyDo: 'Thăm con định cư nước ngoài',
    TrangThai: 'Còn hạn',
    CanBoXuLy: 'Lê Thị B',
    GhiChu: '',
  },
];

interface TamTruVang {
  MaTT: number;
  MaDangKy: string;
  LoaiDangKy: string;
  HoTen: string;
  CCCD: string;
  NgaySinh: string;
  GioiTinh: string;
  QueQuan: string;
  DiaChiThuongTru: string;
  DiaChiTamTru: string;
  ChuHo: string;
  QuanHeVoiChuHo: string;
  SoDienThoai: string;
  NgayDangKy: string;
  NgayHetHan: string;
  LyDo: string;
  TrangThai: string;
  CanBoXuLy: string;
  GhiChu: string;
}

export default function TamTruVangPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TamTruVang | null>(null);
  const [records, setRecords] = useState<TamTruVang[]>([]);

  // Form state
  const defaultForm = () => ({
    MaDangKy: '',
    LoaiDangKy: 'Tạm trú',
    HoTen: '',
    CCCD: '',
    NgaySinh: '',
    GioiTinh: 'Nam',
    QueQuan: '',
    DiaChiThuongTru: '',
    DiaChiTamTru: '',
    ChuHo: '',
    QuanHeVoiChuHo: '',
    SoDienThoai: '',
    NgayDangKy: new Date().toISOString().split('T')[0],
    NgayHetHan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString().split('T')[0],
    LyDo: '',
    TrangThai: 'Còn hạn',
    CanBoXuLy: '',
    GhiChu: '',
  });

  const [formData, setFormData] = useState(defaultForm());

  const loadData = async () => {
    const res = await tamTruTamVangApi.getList({ page: 1, limit: 200 });
    if (res.success && Array.isArray((res as any).data)) {
      const mapped = (res as any).data.map((item: any) => ({
        MaTT: item.MaTT ?? item.MaHoSo,
        MaDangKy: item.MaDangKy,
        LoaiDangKy: item.LoaiDangKy,
        HoTen: item.HoTen ?? item.HoTenNguoiKhaiBao,
        CCCD: item.CCCD,
        NgaySinh: item.NgaySinh,
        GioiTinh: item.GioiTinh,
        QueQuan: item.QueQuan,
        DiaChiThuongTru: item.DiaChiThuongTru,
        DiaChiTamTru: item.DiaChiTamTru,
        ChuHo: item.ChuHo,
        QuanHeVoiChuHo: item.QuanHeVoiChuHo,
        SoDienThoai: item.SoDienThoai,
        NgayDangKy: item.NgayDangKy ?? item.TuNgay,
        NgayHetHan: item.NgayHetHan ?? item.DenNgay,
        LyDo: item.LyDo,
        TrangThai: item.TrangThai ?? item.TinhTrangHoSo,
        CanBoXuLy: item.CanBoXuLy,
        GhiChu: item.GhiChu,
      }));
      setRecords(mapped);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dataSource = records.length > 0 ? records : mockTamTruVang;

  const normalizeText = (value: unknown) =>
    typeof value === 'string' ? value.toLowerCase() : String(value ?? '').toLowerCase();

  // Filter data
  const filteredData = dataSource.filter((item) => {
    const normalizedQuery = normalizeText(searchQuery);
    const matchSearch =
      normalizeText(item.MaDangKy).includes(normalizedQuery) ||
      normalizeText(item.HoTen).includes(normalizedQuery) ||
      normalizeText(item.CCCD).includes(normalizedQuery);
    
    const matchType = typeFilter === 'all' || item.LoaiDangKy === typeFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchType && matchStatus;
  });

  // Stats
  const stats = {
    total: dataSource.length,
    tamTru: dataSource.filter(t => t.LoaiDangKy === 'Tạm trú').length,
    tamVang: dataSource.filter(t => t.LoaiDangKy === 'Tạm vắng').length,
    valid: dataSource.filter(t => t.TrangThai === 'Còn hạn').length,
    expiring: dataSource.filter(t => t.TrangThai === 'Sắp hết hạn').length,
    expired: dataSource.filter(t => t.TrangThai === 'Hết hạn').length,
  };

  // Handlers
  const handleView = (record: TamTruVang) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: TamTruVang) => {
    const toText = (value: unknown) => (value == null ? '' : String(value));
    const toDateInput = (value: unknown) => {
      if (!value) return '';
      const str = String(value);
      return str.includes('T') ? str.split('T')[0] : str;
    };

    setSelectedRecord(record);
    setFormData({
      MaDangKy: toText(record.MaDangKy),
      LoaiDangKy: toText(record.LoaiDangKy) || 'Tạm trú',
      HoTen: toText(record.HoTen),
      CCCD: toText(record.CCCD),
      NgaySinh: toDateInput(record.NgaySinh),
      GioiTinh: toText(record.GioiTinh) || 'Nam',
      QueQuan: toText(record.QueQuan),
      DiaChiThuongTru: toText(record.DiaChiThuongTru),
      DiaChiTamTru: toText(record.DiaChiTamTru),
      ChuHo: toText(record.ChuHo),
      QuanHeVoiChuHo: toText(record.QuanHeVoiChuHo),
      SoDienThoai: toText(record.SoDienThoai),
      NgayDangKy: toDateInput(record.NgayDangKy),
      NgayHetHan: toDateInput(record.NgayHetHan),
      LyDo: toText(record.LyDo),
      TrangThai: toText(record.TrangThai) || 'Còn hạn',
      CanBoXuLy: toText(record.CanBoXuLy),
      GhiChu: toText(record.GhiChu),
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setFormData({
      ...defaultForm(),
    });
    setAddDialogOpen(true);
  };

  const handleSave = async () => {
    const selectedId = (selectedRecord as any)?.MaTT ?? (selectedRecord as any)?.MaHoSo;
    if (selectedId) {
      await tamTruTamVangApi.update(selectedId, formData);
    } else {
      await tamTruTamVangApi.create(formData);
    }
    await loadData();
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  const handleDelete = async (record: TamTruVang) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${record.MaDangKy}?`)) {
      return;
    }
    const selectedId = (record as any).MaTT ?? (record as any).MaHoSo;
    await tamTruTamVangApi.delete(selectedId);
    await loadData();
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Còn hạn':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Còn hạn</Badge>;
      case 'Sắp hết hạn':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><Clock className="w-3 h-3 mr-1" />Sắp hết hạn</Badge>;
      case 'Hết hạn':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><XCircle className="w-3 h-3 mr-1" />Hết hạn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'Tạm trú' 
      ? <Badge className="bg-blue-500/10 text-blue-700 border-0"><Home className="w-3 h-3 mr-1" />Tạm trú</Badge>
      : <Badge className="bg-amber-500/10 text-amber-700 border-0"><ArrowRightLeft className="w-3 h-3 mr-1" />Tạm vắng</Badge>;
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Tạm trú - Tạm vắng</h1>
              </div>
              <p className="text-white/90">Đăng ký và quản lý tạm trú, tạm vắng cư dân trên địa bàn</p>
            </div>
            <Button className="w-full 2xl:w-auto bg-white text-orange-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Đăng ký mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <FunctionStyledPanel
        title="Nhịp đăng ký cư trú tạm thời"
        subtitle="Biểu đồ vòng cho thấy trạng thái hiệu lực và cơ cấu tạm trú/tạm vắng"
        variant="sec-residence"
        items={[
          { label: 'Tổng đăng ký', value: stats.total, color: '#f97316' },
          { label: 'Tạm trú', value: stats.tamTru, color: '#3b82f6' },
          { label: 'Tạm vắng', value: stats.tamVang, color: '#f59e0b' },
          { label: 'Còn hạn', value: stats.valid, color: '#22c55e' },
          { label: 'Sắp hết hạn', value: stats.expiring, color: '#facc15' },
          { label: 'Hết hạn', value: stats.expired, color: '#ef4444' },
        ]}
      />

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã, họ tên, CCCD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Loại đăng ký" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Tạm trú">Tạm trú</SelectItem>
              <SelectItem value="Tạm vắng">Tạm vắng</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Còn hạn">Còn hạn</SelectItem>
              <SelectItem value="Sắp hết hạn">Sắp hết hạn</SelectItem>
              <SelectItem value="Hết hạn">Hết hạn</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Mã ĐK</th>
                <th className="text-left p-4 font-semibold">Loại</th>
                <th className="text-left p-4 font-semibold">Họ tên</th>
                <th className="text-left p-4 font-semibold">Địa chỉ</th>
                <th className="text-left p-4 font-semibold">Thời hạn</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaTT} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.MaDangKy}</span>
                  </td>
                  <td className="p-4">{getTypeBadge(record.LoaiDangKy)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{record.HoTen}</div>
                        <div className="text-xs text-muted-foreground">{record.CCCD}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      {record.LoaiDangKy === 'Tạm trú' ? (
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-1 text-blue-500 shrink-0" />
                          <span className="line-clamp-2">{record.DiaChiTamTru}</span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-1 text-amber-500 shrink-0" />
                          <span>Đến: {record.DiaChiTamTru}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {formatDate(record.NgayDangKy)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Đến: {formatDate(record.NgayHetHan)}
                      </div>
                    </div>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleDelete(record)}
                      >
                        <Trash2 className="w-4 h-4" />
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
              <ShieldCheck className="w-5 h-5" />
              Chi tiết đăng ký {selectedRecord?.LoaiDangKy}
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRecord?.MaDangKy}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                {getTypeBadge(selectedRecord.LoaiDangKy)}
                {getStatusBadge(selectedRecord.TrangThai)}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Họ và tên</Label>
                    <p className="font-medium">{selectedRecord.HoTen}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Giới tính</Label>
                    <p className="font-medium">{selectedRecord.GioiTinh}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">CCCD</Label>
                    <p className="font-mono">{selectedRecord.CCCD}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày sinh</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgaySinh)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Số điện thoại</Label>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {selectedRecord.SoDienThoai}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Quê quán</Label>
                    <p className="font-medium">{selectedRecord.QueQuan}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Thông tin địa chỉ
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Địa chỉ thường trú</Label>
                    <p className="font-medium">{selectedRecord.DiaChiThuongTru}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">
                      {selectedRecord.LoaiDangKy === 'Tạm trú' ? 'Địa chỉ tạm trú' : 'Nơi đến'}
                    </Label>
                    <p className="font-medium bg-white p-2 rounded">{selectedRecord.DiaChiTamTru}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Chủ hộ nơi ở</Label>
                      <p className="font-medium">{selectedRecord.ChuHo}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Quan hệ với chủ hộ</Label>
                      <p className="font-medium">{selectedRecord.QuanHeVoiChuHo}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">{formatDate(selectedRecord.NgayDangKy)}</p>
                  <p className="text-xs text-muted-foreground">Ngày đăng ký</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">{formatDate(selectedRecord.NgayHetHan)}</p>
                  <p className="text-xs text-muted-foreground">Ngày hết hạn</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">{selectedRecord.CanBoXuLy}</p>
                  <p className="text-xs text-muted-foreground">Cán bộ xử lý</p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Lý do {normalizeText(selectedRecord.LoaiDangKy)}</Label>
                <p className="font-medium bg-yellow-50 p-3 rounded">{selectedRecord.LyDo}</p>
              </div>

              {selectedRecord.GhiChu && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Ghi chú</Label>
                  <p className="font-medium bg-blue-50 p-3 rounded">{selectedRecord.GhiChu}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Đóng
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              In giấy xác nhận
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
              Cập nhật thông tin đăng ký
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại đăng ký</Label>
                <Select value={formData.LoaiDangKy} onValueChange={(v) => setFormData({ ...formData, LoaiDangKy: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tạm trú">Tạm trú</SelectItem>
                    <SelectItem value="Tạm vắng">Tạm vắng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.TrangThai} onValueChange={(v) => setFormData({ ...formData, TrangThai: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Còn hạn">Còn hạn</SelectItem>
                    <SelectItem value="Sắp hết hạn">Sắp hết hạn</SelectItem>
                    <SelectItem value="Hết hạn">Hết hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Họ và tên</Label>
                <Input value={formData.HoTen} onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>CCCD</Label>
                <Input value={formData.CCCD} onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ngày sinh</Label>
                <Input type="date" value={formData.NgaySinh} onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <Select value={formData.GioiTinh} onValueChange={(v) => setFormData({ ...formData, GioiTinh: v })}>
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
                <Label>Số điện thoại</Label>
                <Input value={formData.SoDienThoai} onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quê quán</Label>
                <Input value={formData.QueQuan} onChange={(e) => setFormData({ ...formData, QueQuan: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Địa chỉ thường trú</Label>
              <Input value={formData.DiaChiThuongTru} onChange={(e) => setFormData({ ...formData, DiaChiThuongTru: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ {formData.LoaiDangKy === 'Tạm trú' ? 'tạm trú' : 'đến'}</Label>
              <Input value={formData.DiaChiTamTru} onChange={(e) => setFormData({ ...formData, DiaChiTamTru: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chủ hộ nơi ở</Label>
                <Input value={formData.ChuHo} onChange={(e) => setFormData({ ...formData, ChuHo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quan hệ với chủ hộ</Label>
                <Input value={formData.QuanHeVoiChuHo} onChange={(e) => setFormData({ ...formData, QuanHeVoiChuHo: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày đăng ký</Label>
                <Input type="date" value={formData.NgayDangKy} onChange={(e) => setFormData({ ...formData, NgayDangKy: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ngày hết hạn</Label>
                <Input type="date" value={formData.NgayHetHan} onChange={(e) => setFormData({ ...formData, NgayHetHan: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cán bộ xử lý</Label>
              <Input value={formData.CanBoXuLy} onChange={(e) => setFormData({ ...formData, CanBoXuLy: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Lý do</Label>
              <Textarea value={formData.LyDo} onChange={(e) => setFormData({ ...formData, LyDo: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea value={formData.GhiChu} onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })} rows={2} />
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
              Đăng ký tạm trú/tạm vắng mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã đăng ký *</Label>
                <Input
                  value={formData.MaDangKy}
                  onChange={(e) => setFormData({...formData, MaDangKy: e.target.value})}
                  placeholder="VD: TT-2024-004"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại đăng ký *</Label>
                <Select value={formData.LoaiDangKy} onValueChange={(v) => setFormData({...formData, LoaiDangKy: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tạm trú">Tạm trú</SelectItem>
                    <SelectItem value="Tạm vắng">Tạm vắng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Họ và tên *</Label>
                <Input
                  value={formData.HoTen}
                  onChange={(e) => setFormData({...formData, HoTen: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>CCCD *</Label>
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
                <Label>Giới tính</Label>
                <Select value={formData.GioiTinh} onValueChange={(v) => setFormData({...formData, GioiTinh: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  value={formData.SoDienThoai}
                  onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ thường trú *</Label>
              <Input
                value={formData.DiaChiThuongTru}
                onChange={(e) => setFormData({...formData, DiaChiThuongTru: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ {formData.LoaiDangKy === 'Tạm trú' ? 'tạm trú' : 'đến'} *</Label>
              <Input
                value={formData.DiaChiTamTru}
                onChange={(e) => setFormData({...formData, DiaChiTamTru: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chủ hộ nơi ở</Label>
                <Input
                  value={formData.ChuHo}
                  onChange={(e) => setFormData({...formData, ChuHo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Quan hệ với chủ hộ</Label>
                <Input
                  value={formData.QuanHeVoiChuHo}
                  onChange={(e) => setFormData({...formData, QuanHeVoiChuHo: e.target.value})}
                  placeholder="VD: Thuê trọ, Người thân..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lý do *</Label>
              <Textarea
                value={formData.LyDo}
                onChange={(e) => setFormData({...formData, LyDo: e.target.value})}
                placeholder="Lý do tạm trú/tạm vắng..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày đăng ký</Label>
                <Input
                  type="date"
                  value={formData.NgayDangKy}
                  onChange={(e) => setFormData({ ...formData, NgayDangKy: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày hết hạn</Label>
                <Input
                  type="date"
                  value={formData.NgayHetHan}
                  onChange={(e) => setFormData({ ...formData, NgayHetHan: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cán bộ xử lý</Label>
              <Input
                value={formData.CanBoXuLy}
                onChange={(e) => setFormData({ ...formData, CanBoXuLy: e.target.value })}
                placeholder="Nhập tên cán bộ phụ trách"
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
