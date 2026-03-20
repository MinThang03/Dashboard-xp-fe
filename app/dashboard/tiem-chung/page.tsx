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
  Syringe,
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
  AlertTriangle,
  Baby,
  Users,
  Activity,
} from 'lucide-react';
import { mockTiemChung, formatDateTime } from '@/lib/mock-data';

// Extended mock data
const mockTiemChungFull = [
  {
    MaTiemChung: 1,
    MaPhieu: 'TC-2024-0001',
    MaDoiTuong: 1,
    TenDoiTuong: 'Nguyễn Văn An',
    NgaySinh: '2023-05-15',
    GioiTinh: 'Nam',
    TenChaMeBaoHo: 'Nguyễn Văn Cha',
    SoDienThoai: '0901234567',
    DiaChi: 'Số 123, Phường 1',
    LoaiDoiTuong: 'Trẻ em',
    TenVacXin: 'BCG (Lao)',
    LoaiVacXin: 'Tiêm chủng mở rộng',
    MuiThu: 1,
    TongSoMui: 1,
    NgayTiem: '2024-01-15 08:30:00',
    ViTriTiem: 'Cánh tay trái',
    SoLo: 'BCG-2024-001',
    NguoiTiem: 'Y sĩ Trần Thị Bình',
    MaTrangThai: 'DA_TIEM',
    TrangThai: 'Đã tiêm',
    PhanUngSauTiem: 'Không có',
    NgayHenTiemKe: '2024-02-15',
    GhiChu: '',
  },
  {
    MaTiemChung: 2,
    MaPhieu: 'TC-2024-0002',
    MaDoiTuong: 2,
    TenDoiTuong: 'Trần Thị Bé',
    NgaySinh: '2023-08-20',
    GioiTinh: 'Nữ',
    TenChaMeBaoHo: 'Trần Văn Ba',
    SoDienThoai: '0912345678',
    DiaChi: 'Số 45, Phường 2',
    LoaiDoiTuong: 'Trẻ em',
    TenVacXin: 'DPT-VGB-Hib (5 trong 1)',
    LoaiVacXin: 'Tiêm chủng mở rộng',
    MuiThu: 2,
    TongSoMui: 3,
    NgayTiem: '2024-01-16 09:00:00',
    ViTriTiem: 'Đùi phải',
    SoLo: 'DPT-2024-002',
    NguoiTiem: 'Y sĩ Lê Thị Dung',
    MaTrangThai: 'DA_TIEM',
    TrangThai: 'Đã tiêm',
    PhanUngSauTiem: 'Sốt nhẹ (đã hết)',
    NgayHenTiemKe: '2024-02-16',
    GhiChu: 'Theo dõi sốt sau tiêm 24h',
  },
  {
    MaTiemChung: 3,
    MaPhieu: 'TC-2024-0003',
    MaDoiTuong: 3,
    TenDoiTuong: 'Lê Văn Cường',
    NgaySinh: '1985-03-10',
    GioiTinh: 'Nam',
    TenChaMeBaoHo: '',
    SoDienThoai: '0923456789',
    DiaChi: 'Số 67, Phường 3',
    LoaiDoiTuong: 'Người lớn',
    TenVacXin: 'COVID-19 (AstraZeneca)',
    LoaiVacXin: 'COVID-19',
    MuiThu: 3,
    TongSoMui: 3,
    NgayTiem: '2024-01-17 10:00:00',
    ViTriTiem: 'Cánh tay trái',
    SoLo: 'AZD-2024-003',
    NguoiTiem: 'Y sĩ Trần Thị Bình',
    MaTrangThai: 'DA_TIEM',
    TrangThai: 'Đã tiêm',
    PhanUngSauTiem: 'Đau tại chỗ tiêm',
    NgayHenTiemKe: null,
    GhiChu: 'Mũi tăng cường',
  },
  {
    MaTiemChung: 4,
    MaPhieu: 'TC-2024-0004',
    MaDoiTuong: 4,
    TenDoiTuong: 'Phạm Thị Dung',
    NgaySinh: '2024-01-05',
    GioiTinh: 'Nữ',
    TenChaMeBaoHo: 'Phạm Văn Dũng',
    SoDienThoai: '0934567890',
    DiaChi: 'Số 89, Phường 1',
    LoaiDoiTuong: 'Trẻ sơ sinh',
    TenVacXin: 'Viêm gan B (mũi 0)',
    LoaiVacXin: 'Tiêm chủng mở rộng',
    MuiThu: 1,
    TongSoMui: 4,
    NgayTiem: '2024-01-20',
    ViTriTiem: 'Đùi trái',
    SoLo: 'HBV-2024-001',
    NguoiTiem: 'Y sĩ Lê Thị Dung',
    MaTrangThai: 'CHO_TIEM',
    TrangThai: 'Chờ tiêm',
    PhanUngSauTiem: '',
    NgayHenTiemKe: '2024-02-05',
    GhiChu: 'Tiêm trong 24h sau sinh',
  },
  {
    MaTiemChung: 5,
    MaPhieu: 'TC-2024-0005',
    MaDoiTuong: 5,
    TenDoiTuong: 'Hoàng Thị Em',
    NgaySinh: '1990-07-25',
    GioiTinh: 'Nữ',
    TenChaMeBaoHo: '',
    SoDienThoai: '0945678901',
    DiaChi: 'Số 12, Phường 2',
    LoaiDoiTuong: 'Phụ nữ mang thai',
    TenVacXin: 'Uốn ván (VAT)',
    LoaiVacXin: 'Tiêm chủng mở rộng',
    MuiThu: 2,
    TongSoMui: 2,
    NgayTiem: '2024-01-18 14:00:00',
    ViTriTiem: 'Cánh tay trái',
    SoLo: 'VAT-2024-001',
    NguoiTiem: 'Y sĩ Trần Thị Bình',
    MaTrangThai: 'DA_TIEM',
    TrangThai: 'Đã tiêm',
    PhanUngSauTiem: 'Không có',
    NgayHenTiemKe: null,
    GhiChu: 'Phụ nữ mang thai tháng thứ 7',
  },
];

interface TiemChung {
  MaTiemChung: number;
  MaPhieu: string;
  MaDoiTuong: number;
  TenDoiTuong: string;
  NgaySinh: string;
  GioiTinh: string;
  TenChaMeBaoHo: string;
  SoDienThoai: string;
  DiaChi: string;
  LoaiDoiTuong: string;
  TenVacXin: string;
  LoaiVacXin: string;
  MuiThu: number;
  TongSoMui: number;
  NgayTiem: string;
  ViTriTiem: string;
  SoLo: string;
  NguoiTiem: string;
  MaTrangThai: string;
  TrangThai: string;
  PhanUngSauTiem: string;
  NgayHenTiemKe: string | null;
  GhiChu: string;
}

export default function TiemChungPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vaccineFilter, setVaccineFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TiemChung | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaPhieu: '',
    MaDoiTuong: 0,
    TenDoiTuong: '',
    NgaySinh: '',
    GioiTinh: 'Nam',
    TenChaMeBaoHo: '',
    SoDienThoai: '',
    DiaChi: '',
    LoaiDoiTuong: 'Trẻ em',
    TenVacXin: '',
    LoaiVacXin: '',
    MuiThu: 1,
    TongSoMui: 1,
    NgayTiem: '',
    ViTriTiem: '',
    SoLo: '',
    NguoiTiem: '',
    MaTrangThai: 'CHO_TIEM',
    PhanUngSauTiem: '',
    NgayHenTiemKe: '',
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockTiemChungFull.filter((item) => {
    const matchSearch = 
      item.MaPhieu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenDoiTuong.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenVacXin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || item.MaTrangThai === statusFilter;
    const matchVaccine = vaccineFilter === 'all' || item.LoaiVacXin === vaccineFilter;
    
    return matchSearch && matchStatus && matchVaccine;
  });

  // Stats
  const stats = {
    total: mockTiemChungFull.length,
    completed: mockTiemChungFull.filter(t => t.MaTrangThai === 'DA_TIEM').length,
    waiting: mockTiemChungFull.filter(t => t.MaTrangThai === 'CHO_TIEM').length,
    children: mockTiemChungFull.filter(t => t.LoaiDoiTuong === 'Trẻ em' || t.LoaiDoiTuong === 'Trẻ sơ sinh').length,
    rate: Math.round((mockTiemChungFull.filter(t => t.MaTrangThai === 'DA_TIEM').length / mockTiemChungFull.length) * 100),
  };

  // Handlers
  const handleView = (record: TiemChung) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: TiemChung) => {
    setSelectedRecord(record);
    setFormData({
      MaPhieu: record.MaPhieu,
      MaDoiTuong: record.MaDoiTuong,
      TenDoiTuong: record.TenDoiTuong,
      NgaySinh: record.NgaySinh,
      GioiTinh: record.GioiTinh,
      TenChaMeBaoHo: record.TenChaMeBaoHo,
      SoDienThoai: record.SoDienThoai,
      DiaChi: record.DiaChi,
      LoaiDoiTuong: record.LoaiDoiTuong,
      TenVacXin: record.TenVacXin,
      LoaiVacXin: record.LoaiVacXin,
      MuiThu: record.MuiThu,
      TongSoMui: record.TongSoMui,
      NgayTiem: record.NgayTiem.split(' ')[0],
      ViTriTiem: record.ViTriTiem,
      SoLo: record.SoLo,
      NguoiTiem: record.NguoiTiem,
      MaTrangThai: record.MaTrangThai,
      PhanUngSauTiem: record.PhanUngSauTiem,
      NgayHenTiemKe: record.NgayHenTiemKe || '',
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    const newMaPhieu = `TC-${new Date().getFullYear()}-${String(mockTiemChungFull.length + 1).padStart(4, '0')}`;
    setFormData({
      MaPhieu: newMaPhieu,
      MaDoiTuong: mockTiemChungFull.length + 1,
      TenDoiTuong: '',
      NgaySinh: '',
      GioiTinh: 'Nam',
      TenChaMeBaoHo: '',
      SoDienThoai: '',
      DiaChi: '',
      LoaiDoiTuong: 'Trẻ em',
      TenVacXin: '',
      LoaiVacXin: '',
      MuiThu: 1,
      TongSoMui: 1,
      NgayTiem: '',
      ViTriTiem: '',
      SoLo: '',
      NguoiTiem: '',
      MaTrangThai: 'CHO_TIEM',
      PhanUngSauTiem: '',
      NgayHenTiemKe: '',
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
      case 'DA_TIEM':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Đã tiêm</Badge>;
      case 'CHO_TIEM':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><Clock className="w-3 h-3 mr-1" />Chờ tiêm</Badge>;
      case 'HOAN':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><AlertTriangle className="w-3 h-3 mr-1" />Hoãn tiêm</Badge>;
      case 'TU_CHOI':
        return <Badge className="bg-gray-500/10 text-gray-700 border-0"><X className="w-3 h-3 mr-1" />Từ chối</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-700 border-0">{status}</Badge>;
    }
  };

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (months < 24) return `${months} tháng`;
    return `${Math.floor(months / 12)} tuổi`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-success via-secondary to-status-success p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Syringe className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Theo dõi Tiêm chủng</h1>
              </div>
              <p className="text-white/90">Quản lý lịch tiêm chủng mở rộng và COVID-19</p>
            </div>
            <Button className="bg-white text-emerald-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Đăng ký tiêm
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Syringe className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Tổng số lượt tiêm</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className="text-sm text-muted-foreground">Đã tiêm</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.waiting}</p>
          <p className="text-sm text-muted-foreground">Chờ tiêm</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Baby className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.children}</p>
          <p className="text-sm text-muted-foreground">Trẻ em</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-teal-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.rate}%</p>
          <p className="text-sm text-muted-foreground">Tỷ lệ tiêm</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, vắc xin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="DA_TIEM">Đã tiêm</SelectItem>
              <SelectItem value="CHO_TIEM">Chờ tiêm</SelectItem>
              <SelectItem value="HOAN">Hoãn tiêm</SelectItem>
            </SelectContent>
          </Select>
          <Select value={vaccineFilter} onValueChange={setVaccineFilter}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Loại vắc xin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="Tiêm chủng mở rộng">Tiêm chủng mở rộng</SelectItem>
              <SelectItem value="COVID-19">COVID-19</SelectItem>
              <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
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
                <th className="text-left p-4 font-semibold">Mã phiếu</th>
                <th className="text-left p-4 font-semibold">Đối tượng</th>
                <th className="text-left p-4 font-semibold">Tuổi</th>
                <th className="text-left p-4 font-semibold">Loại ĐT</th>
                <th className="text-left p-4 font-semibold">Vắc xin</th>
                <th className="text-left p-4 font-semibold">Mũi</th>
                <th className="text-left p-4 font-semibold">Ngày tiêm</th>
                <th className="text-left p-4 font-semibold">Người tiêm</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaTiemChung} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">{record.MaPhieu}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{record.TenDoiTuong}</div>
                        <div className="text-xs text-muted-foreground">{record.SoDienThoai}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{getAge(record.NgaySinh)}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-xs">
                      {record.LoaiDoiTuong === 'Trẻ sơ sinh' && <Baby className="w-3 h-3 mr-1" />}
                      {record.LoaiDoiTuong}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="max-w-[150px]">
                      <div className="font-medium text-sm truncate" title={record.TenVacXin}>{record.TenVacXin}</div>
                      <div className="text-xs text-muted-foreground">{record.LoaiVacXin}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className="bg-blue-500/10 text-blue-700 border-0">
                      {record.MuiThu}/{record.TongSoMui}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {record.NgayTiem.split(' ')[0]}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{record.NguoiTiem}</td>
                  <td className="p-4">
                    {getStatusBadge(record.MaTrangThai)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(record)}
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(record)}
                        title="Cập nhật"
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
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Syringe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy bản ghi phù hợp</p>
          </div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Syringe className="w-5 h-5" />
              Chi tiết phiếu tiêm chủng
            </DialogTitle>
            <DialogDescription>
              Mã phiếu: {selectedRecord?.MaPhieu}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin đối tượng tiêm
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Họ và tên</Label>
                    <p className="font-medium">{selectedRecord.TenDoiTuong}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày sinh / Tuổi</Label>
                    <p className="font-medium">{selectedRecord.NgaySinh} ({getAge(selectedRecord.NgaySinh)})</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Giới tính</Label>
                    <p className="font-medium">{selectedRecord.GioiTinh}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại đối tượng</Label>
                    <p className="font-medium">{selectedRecord.LoaiDoiTuong}</p>
                  </div>
                  {selectedRecord.TenChaMeBaoHo && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Cha/Mẹ/Người bảo hộ</Label>
                      <p className="font-medium">{selectedRecord.TenChaMeBaoHo}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{selectedRecord.SoDienThoai}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Syringe className="w-4 h-4" />
                  Thông tin tiêm chủng
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên vắc xin</Label>
                    <p className="font-medium text-primary">{selectedRecord.TenVacXin}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại vắc xin</Label>
                    <p className="font-medium">{selectedRecord.LoaiVacXin}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Mũi tiêm</Label>
                    <p className="font-medium">Mũi {selectedRecord.MuiThu} / {selectedRecord.TongSoMui}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Số lô</Label>
                    <p className="font-medium font-mono">{selectedRecord.SoLo}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày tiêm</Label>
                    <p className="font-medium">{formatDateTime(selectedRecord.NgayTiem)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Vị trí tiêm</Label>
                    <p className="font-medium">{selectedRecord.ViTriTiem}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Người tiêm</Label>
                    <p className="font-medium">{selectedRecord.NguoiTiem}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                    <div>{getStatusBadge(selectedRecord.MaTrangThai)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Phản ứng sau tiêm</Label>
                  <p className="font-medium">{selectedRecord.PhanUngSauTiem || 'Không có'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Ngày hẹn tiêm kế tiếp</Label>
                  <p className="font-medium">{selectedRecord.NgayHenTiemKe || 'Không có'}</p>
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
              Cập nhật phiếu tiêm chủng
            </DialogTitle>
            <DialogDescription>
              Mã phiếu: {formData.MaPhieu}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin đối tượng tiêm
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã đối tượng</Label>
                  <Input
                    type="number"
                    value={formData.MaDoiTuong}
                    onChange={(e) => setFormData({...formData, MaDoiTuong: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input
                    value={formData.TenDoiTuong}
                    onChange={(e) => setFormData({...formData, TenDoiTuong: e.target.value})}
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
                  <Label>Loại đối tượng</Label>
                  <Select value={formData.LoaiDoiTuong} onValueChange={(v) => setFormData({...formData, LoaiDoiTuong: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trẻ sơ sinh">Trẻ sơ sinh</SelectItem>
                      <SelectItem value="Trẻ em">Trẻ em</SelectItem>
                      <SelectItem value="Người lớn">Người lớn</SelectItem>
                      <SelectItem value="Phụ nữ mang thai">Phụ nữ mang thai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cha/Mẹ/Người bảo hộ</Label>
                  <Input
                    value={formData.TenChaMeBaoHo}
                    onChange={(e) => setFormData({...formData, TenChaMeBaoHo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Điện thoại</Label>
                  <Input
                    value={formData.SoDienThoai}
                    onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})}
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

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Syringe className="w-4 h-4" />
                Thông tin tiêm chủng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vắc xin *</Label>
                  <Input
                    value={formData.TenVacXin}
                    onChange={(e) => setFormData({...formData, TenVacXin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loại vắc xin</Label>
                  <Select value={formData.LoaiVacXin} onValueChange={(v) => setFormData({...formData, LoaiVacXin: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tiêm chủng mở rộng">Tiêm chủng mở rộng</SelectItem>
                      <SelectItem value="COVID-19">COVID-19</SelectItem>
                      <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số lô *</Label>
                  <Input
                    value={formData.SoLo}
                    onChange={(e) => setFormData({...formData, SoLo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vị trí tiêm</Label>
                  <Input
                    value={formData.ViTriTiem}
                    onChange={(e) => setFormData({...formData, ViTriTiem: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Mũi thứ</Label>
                <Input
                  type="number"
                  value={formData.MuiThu}
                  onChange={(e) => setFormData({...formData, MuiThu: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Tổng số mũi</Label>
                <Input
                  type="number"
                  value={formData.TongSoMui}
                  onChange={(e) => setFormData({...formData, TongSoMui: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Người tiêm</Label>
                <Select value={formData.NguoiTiem} onValueChange={(v) => setFormData({...formData, NguoiTiem: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người tiêm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y sĩ Trần Thị Bình">Y sĩ Trần Thị Bình</SelectItem>
                    <SelectItem value="Y sĩ Lê Thị Dung">Y sĩ Lê Thị Dung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày tiêm</Label>
                <Input
                  type="date"
                  value={formData.NgayTiem}
                  onChange={(e) => setFormData({...formData, NgayTiem: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày hẹn tiêm kế tiếp</Label>
                <Input
                  type="date"
                  value={formData.NgayHenTiemKe}
                  onChange={(e) => setFormData({...formData, NgayHenTiemKe: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.MaTrangThai} onValueChange={(v) => setFormData({...formData, MaTrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHO_TIEM">Chờ tiêm</SelectItem>
                    <SelectItem value="DA_TIEM">Đã tiêm</SelectItem>
                    <SelectItem value="HOAN">Hoãn tiêm</SelectItem>
                    <SelectItem value="TU_CHOI">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phản ứng sau tiêm</Label>
                <Input
                  value={formData.PhanUngSauTiem}
                  onChange={(e) => setFormData({...formData, PhanUngSauTiem: e.target.value})}
                  placeholder="Không có / Sốt nhẹ / Đau tại chỗ..."
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
              Đăng ký tiêm chủng mới
            </DialogTitle>
            <DialogDescription>
              Mã phiếu: {formData.MaPhieu}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin đối tượng tiêm
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã đối tượng</Label>
                  <Input
                    type="number"
                    value={formData.MaDoiTuong}
                    onChange={(e) => setFormData({...formData, MaDoiTuong: parseInt(e.target.value) || 0})}
                    placeholder="Nhập mã đối tượng"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Họ và tên *</Label>
                  <Input
                    value={formData.TenDoiTuong}
                    onChange={(e) => setFormData({...formData, TenDoiTuong: e.target.value})}
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
                  <Label>Loại đối tượng</Label>
                  <Select value={formData.LoaiDoiTuong} onValueChange={(v) => setFormData({...formData, LoaiDoiTuong: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trẻ sơ sinh">Trẻ sơ sinh</SelectItem>
                      <SelectItem value="Trẻ em">Trẻ em</SelectItem>
                      <SelectItem value="Người lớn">Người lớn</SelectItem>
                      <SelectItem value="Phụ nữ mang thai">Phụ nữ mang thai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cha/Mẹ/Người bảo hộ</Label>
                  <Input
                    value={formData.TenChaMeBaoHo}
                    onChange={(e) => setFormData({...formData, TenChaMeBaoHo: e.target.value})}
                    placeholder="Nếu là trẻ em"
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
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={formData.DiaChi}
                    onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Syringe className="w-4 h-4" />
                Thông tin tiêm chủng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vắc xin *</Label>
                  <Select value={formData.TenVacXin} onValueChange={(v) => setFormData({...formData, TenVacXin: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vắc xin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BCG (Lao)">BCG (Lao)</SelectItem>
                      <SelectItem value="Viêm gan B">Viêm gan B</SelectItem>
                      <SelectItem value="DPT-VGB-Hib (5 trong 1)">DPT-VGB-Hib (5 trong 1)</SelectItem>
                      <SelectItem value="Sởi">Sởi</SelectItem>
                      <SelectItem value="Uốn ván (VAT)">Uốn ván (VAT)</SelectItem>
                      <SelectItem value="COVID-19 (AstraZeneca)">COVID-19 (AstraZeneca)</SelectItem>
                      <SelectItem value="COVID-19 (Pfizer)">COVID-19 (Pfizer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Loại vắc xin</Label>
                  <Select value={formData.LoaiVacXin} onValueChange={(v) => setFormData({...formData, LoaiVacXin: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tiêm chủng mở rộng">Tiêm chủng mở rộng</SelectItem>
                      <SelectItem value="COVID-19">COVID-19</SelectItem>
                      <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mũi thứ</Label>
                  <Input
                    type="number"
                    value={formData.MuiThu}
                    onChange={(e) => setFormData({...formData, MuiThu: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tổng số mũi</Label>
                  <Input
                    type="number"
                    value={formData.TongSoMui}
                    onChange={(e) => setFormData({...formData, TongSoMui: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số lô *</Label>
                  <Input
                    value={formData.SoLo}
                    onChange={(e) => setFormData({...formData, SoLo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vị trí tiêm</Label>
                  <Input
                    value={formData.ViTriTiem}
                    onChange={(e) => setFormData({...formData, ViTriTiem: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày tiêm dự kiến</Label>
                  <Input
                    type="date"
                    value={formData.NgayTiem}
                    onChange={(e) => setFormData({...formData, NgayTiem: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Người tiêm</Label>
                  <Select value={formData.NguoiTiem} onValueChange={(v) => setFormData({...formData, NguoiTiem: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người tiêm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y sĩ Trần Thị Bình">Y sĩ Trần Thị Bình</SelectItem>
                      <SelectItem value="Y sĩ Lê Thị Dung">Y sĩ Lê Thị Dung</SelectItem>
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
                      <SelectItem value="CHO_TIEM">Chờ tiêm</SelectItem>
                      <SelectItem value="DA_TIEM">Đã tiêm</SelectItem>
                      <SelectItem value="HOAN">Hoãn tiêm</SelectItem>
                      <SelectItem value="TU_CHOI">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phản ứng sau tiêm</Label>
                <Input
                  value={formData.PhanUngSauTiem}
                  onChange={(e) => setFormData({...formData, PhanUngSauTiem: e.target.value})}
                  placeholder="Không có / Sốt nhẹ / Đau tại chỗ..."
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày hẹn tiêm kế tiếp</Label>
                <Input
                  type="date"
                  value={formData.NgayHenTiemKe}
                  onChange={(e) => setFormData({...formData, NgayHenTiemKe: e.target.value})}
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
