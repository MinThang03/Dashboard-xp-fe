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
  Building2,
  Search,
  Plus,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  X,
  AlertTriangle,
  GraduationCap,
  Users,
  MapPin,
  Laptop,
  School,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '@/lib/mock-data';

// Mock data cho cơ sở giáo dục
const mockCoSoGD = [
  {
    MaCoSo: 1,
    MaTruong: 'MN-001',
    TenTruong: 'Mầm non Hoa Mai',
    LoaiTruong: 'Mầm non',
    DiaChi: 'Số 12, Phường 1',
    DienThoai: '028 1234 5678',
    Email: 'mn.hoamai@edu.vn',
    HieuTruong: 'Nguyễn Thị Lan',
    NamThanhLap: 2005,
    DienTich: 2500,
    SoPhongHoc: 12,
    SoPhongChucNang: 3,
    SoGiaoVien: 25,
    SoHocSinh: 320,
    TrangThietBi: 'Đầy đủ',
    TinhTrangCoSo: 'Tốt',
    DatChuan: true,
    XepLoai: 'Đạt chuẩn Quốc gia Mức độ 1',
    NgayCapNhat: '2024-01-10',
    GhiChu: '',
  },
  {
    MaCoSo: 2,
    MaTruong: 'TH-001',
    TenTruong: 'Tiểu học Nguyễn Trãi',
    LoaiTruong: 'Tiểu học',
    DiaChi: 'Số 45, Phường 2',
    DienThoai: '028 2345 6789',
    Email: 'th.nguyentrai@edu.vn',
    HieuTruong: 'Trần Văn Minh',
    NamThanhLap: 1998,
    DienTich: 5000,
    SoPhongHoc: 24,
    SoPhongChucNang: 6,
    SoGiaoVien: 48,
    SoHocSinh: 850,
    TrangThietBi: 'Đầy đủ',
    TinhTrangCoSo: 'Tốt',
    DatChuan: true,
    XepLoai: 'Đạt chuẩn Quốc gia Mức độ 2',
    NgayCapNhat: '2024-01-08',
    GhiChu: '',
  },
  {
    MaCoSo: 3,
    MaTruong: 'THCS-001',
    TenTruong: 'THCS Lê Quý Đôn',
    LoaiTruong: 'THCS',
    DiaChi: 'Số 78, Phường 3',
    DienThoai: '028 3456 7890',
    Email: 'thcs.lequydon@edu.vn',
    HieuTruong: 'Phạm Thị Hương',
    NamThanhLap: 2000,
    DienTich: 6500,
    SoPhongHoc: 28,
    SoPhongChucNang: 8,
    SoGiaoVien: 56,
    SoHocSinh: 1120,
    TrangThietBi: 'Đầy đủ',
    TinhTrangCoSo: 'Tốt',
    DatChuan: true,
    XepLoai: 'Đạt chuẩn Quốc gia Mức độ 1',
    NgayCapNhat: '2024-01-05',
    GhiChu: 'Đang xây thêm 4 phòng học',
  },
  {
    MaCoSo: 4,
    MaTruong: 'MN-002',
    TenTruong: 'Mầm non Sao Mai',
    LoaiTruong: 'Mầm non',
    DiaChi: 'Số 23, Phường 1',
    DienThoai: '028 4567 8901',
    Email: 'mn.saomai@edu.vn',
    HieuTruong: 'Lê Thị Bình',
    NamThanhLap: 2010,
    DienTich: 1800,
    SoPhongHoc: 8,
    SoPhongChucNang: 2,
    SoGiaoVien: 16,
    SoHocSinh: 200,
    TrangThietBi: 'Thiếu',
    TinhTrangCoSo: 'Cần sửa chữa',
    DatChuan: false,
    XepLoai: 'Chưa đạt chuẩn',
    NgayCapNhat: '2024-01-12',
    GhiChu: 'Cần bổ sung thiết bị dạy học, sửa chữa 2 phòng',
  },
  {
    MaCoSo: 5,
    MaTruong: 'TH-002',
    TenTruong: 'Tiểu học Hồ Văn Huê',
    LoaiTruong: 'Tiểu học',
    DiaChi: 'Số 56, Phường 2',
    DienThoai: '028 5678 9012',
    Email: 'th.hovanhuee@edu.vn',
    HieuTruong: 'Võ Văn Dũng',
    NamThanhLap: 2002,
    DienTich: 4200,
    SoPhongHoc: 20,
    SoPhongChucNang: 5,
    SoGiaoVien: 40,
    SoHocSinh: 720,
    TrangThietBi: 'Đầy đủ',
    TinhTrangCoSo: 'Tốt',
    DatChuan: true,
    XepLoai: 'Đạt chuẩn Quốc gia Mức độ 1',
    NgayCapNhat: '2024-01-15',
    GhiChu: '',
  },
];

interface CoSoGD {
  MaCoSo: number;
  MaTruong: string;
  TenTruong: string;
  LoaiTruong: string;
  DiaChi: string;
  DienThoai: string;
  Email: string;
  HieuTruong: string;
  NamThanhLap: number;
  DienTich: number;
  SoPhongHoc: number;
  SoPhongChucNang: number;
  SoGiaoVien: number;
  SoHocSinh: number;
  TrangThietBi: string;
  TinhTrangCoSo: string;
  DatChuan: boolean;
  XepLoai: string;
  NgayCapNhat: string;
  GhiChu: string;
}

export default function CoSoGiaoDucPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CoSoGD | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaTruong: '',
    TenTruong: '',
    LoaiTruong: 'Mầm non',
    DiaChi: '',
    DienThoai: '',
    Email: '',
    HieuTruong: '',
    NamThanhLap: 2020,
    DienTich: 0,
    SoPhongHoc: 0,
    SoPhongChucNang: 0,
    SoGiaoVien: 0,
    SoHocSinh: 0,
    TrangThietBi: 'Đầy đủ',
    TinhTrangCoSo: 'Tốt',
    DatChuan: true,
    XepLoai: '',
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockCoSoGD.filter((item) => {
    const matchSearch = 
      item.MaTruong.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenTruong.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.HieuTruong.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchType = typeFilter === 'all' || item.LoaiTruong === typeFilter;
    const matchStatus = statusFilter === 'all' || item.TinhTrangCoSo === statusFilter;
    
    return matchSearch && matchType && matchStatus;
  });

  // Stats
  const stats = {
    total: mockCoSoGD.length,
    totalRooms: mockCoSoGD.reduce((sum, t) => sum + t.SoPhongHoc, 0),
    totalStudents: mockCoSoGD.reduce((sum, t) => sum + t.SoHocSinh, 0),
    totalTeachers: mockCoSoGD.reduce((sum, t) => sum + t.SoGiaoVien, 0),
    standard: mockCoSoGD.filter(t => t.DatChuan).length,
  };

  // Handlers
  const handleView = (record: CoSoGD) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: CoSoGD) => {
    setSelectedRecord(record);
    setFormData({
      MaTruong: record.MaTruong,
      TenTruong: record.TenTruong,
      LoaiTruong: record.LoaiTruong,
      DiaChi: record.DiaChi,
      DienThoai: record.DienThoai,
      Email: record.Email,
      HieuTruong: record.HieuTruong,
      NamThanhLap: record.NamThanhLap,
      DienTich: record.DienTich,
      SoPhongHoc: record.SoPhongHoc,
      SoPhongChucNang: record.SoPhongChucNang,
      SoGiaoVien: record.SoGiaoVien,
      SoHocSinh: record.SoHocSinh,
      TrangThietBi: record.TrangThietBi,
      TinhTrangCoSo: record.TinhTrangCoSo,
      DatChuan: record.DatChuan,
      XepLoai: record.XepLoai,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      MaTruong: '',
      TenTruong: '',
      LoaiTruong: 'Mầm non',
      DiaChi: '',
      DienThoai: '',
      Email: '',
      HieuTruong: '',
      NamThanhLap: 2020,
      DienTich: 0,
      SoPhongHoc: 0,
      SoPhongChucNang: 0,
      SoGiaoVien: 0,
      SoHocSinh: 0,
      TrangThietBi: 'Đầy đủ',
      TinhTrangCoSo: 'Tốt',
      DatChuan: true,
      XepLoai: '',
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
      case 'Tốt':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Tốt</Badge>;
      case 'Cần sửa chữa':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><AlertTriangle className="w-3 h-3 mr-1" />Cần sửa chữa</Badge>;
      case 'Xuống cấp':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><X className="w-3 h-3 mr-1" />Xuống cấp</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSchoolIcon = (type: string) => {
    switch (type) {
      case 'Mầm non':
        return <School className="w-4 h-4 text-pink-500" />;
      case 'Tiểu học':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'THCS':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Cơ sở vật chất Giáo dục</h1>
              </div>
              <p className="text-white/90">Quản lý trường học, phòng học, thiết bị dạy học</p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm cơ sở
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <School className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Cơ sở giáo dục</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
              <Building2 className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalRooms}</p>
          <p className="text-sm text-muted-foreground">Phòng học</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Học sinh</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalTeachers}</p>
          <p className="text-sm text-muted-foreground">Giáo viên</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.standard}/{stats.total}</p>
          <p className="text-sm text-muted-foreground">Đạt chuẩn QG</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã, tên trường, hiệu trưởng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Loại trường" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="Mầm non">Mầm non</SelectItem>
              <SelectItem value="Tiểu học">Tiểu học</SelectItem>
              <SelectItem value="THCS">THCS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-11">
              <SelectValue placeholder="Tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tình trạng</SelectItem>
              <SelectItem value="Tốt">Tốt</SelectItem>
              <SelectItem value="Cần sửa chữa">Cần sửa chữa</SelectItem>
              <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
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
                <th className="text-left p-4 font-semibold">Mã trường</th>
                <th className="text-left p-4 font-semibold">Tên trường</th>
                <th className="text-left p-4 font-semibold">Loại</th>
                <th className="text-left p-4 font-semibold">Phòng học</th>
                <th className="text-left p-4 font-semibold">Học sinh</th>
                <th className="text-left p-4 font-semibold">Giáo viên</th>
                <th className="text-left p-4 font-semibold">Thiết bị</th>
                <th className="text-left p-4 font-semibold">Tình trạng</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaCoSo} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">{record.MaTruong}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getSchoolIcon(record.LoaiTruong)}
                      <div>
                        <div className="font-medium">{record.TenTruong}</div>
                        <div className="text-xs text-muted-foreground">{record.DiaChi}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{record.LoaiTruong}</Badge>
                  </td>
                  <td className="p-4 font-semibold">{record.SoPhongHoc}</td>
                  <td className="p-4 font-semibold">{record.SoHocSinh}</td>
                  <td className="p-4">{record.SoGiaoVien}</td>
                  <td className="p-4">
                    {record.TrangThietBi === 'Đầy đủ' ? (
                      <Badge className="bg-green-500/10 text-green-700 border-0"><Laptop className="w-3 h-3 mr-1" />Đầy đủ</Badge>
                    ) : (
                      <Badge className="bg-orange-500/10 text-orange-700 border-0"><AlertTriangle className="w-3 h-3 mr-1" />Thiếu</Badge>
                    )}
                  </td>
                  <td className="p-4">{getStatusBadge(record.TinhTrangCoSo)}</td>
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
                        title="Chỉnh sửa"
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
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy cơ sở giáo dục phù hợp</p>
          </div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Chi tiết cơ sở giáo dục
            </DialogTitle>
            <DialogDescription>
              Mã trường: {selectedRecord?.MaTruong}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  {getSchoolIcon(selectedRecord.LoaiTruong)}
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên trường</Label>
                    <p className="font-medium">{selectedRecord.TenTruong}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại trường</Label>
                    <p className="font-medium">{selectedRecord.LoaiTruong}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Hiệu trưởng</Label>
                    <p className="font-medium">{selectedRecord.HieuTruong}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Năm thành lập</Label>
                    <p className="font-medium">{selectedRecord.NamThanhLap}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{selectedRecord.DienThoai}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="font-medium">{selectedRecord.Email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Cơ sở vật chất
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Diện tích</Label>
                    <p className="font-medium">{selectedRecord.DienTich.toLocaleString()} m²</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Số phòng học</Label>
                    <p className="font-semibold text-xl text-blue-600">{selectedRecord.SoPhongHoc}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Phòng chức năng</Label>
                    <p className="font-medium">{selectedRecord.SoPhongChucNang}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 bg-indigo-50 p-3 rounded-lg text-center">
                  <Label className="text-muted-foreground text-xs">Học sinh</Label>
                  <p className="font-bold text-2xl text-indigo-600">{selectedRecord.SoHocSinh}</p>
                </div>
                <div className="space-y-1 bg-purple-50 p-3 rounded-lg text-center">
                  <Label className="text-muted-foreground text-xs">Giáo viên</Label>
                  <p className="font-bold text-2xl text-purple-600">{selectedRecord.SoGiaoVien}</p>
                </div>
                <div className="space-y-1 bg-cyan-50 p-3 rounded-lg text-center">
                  <Label className="text-muted-foreground text-xs">Tỷ lệ HS/GV</Label>
                  <p className="font-bold text-2xl text-cyan-600">{Math.round(selectedRecord.SoHocSinh / selectedRecord.SoGiaoVien)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Trang thiết bị</Label>
                  <div>{selectedRecord.TrangThietBi === 'Đầy đủ' ? (
                    <Badge className="bg-green-500/10 text-green-700 border-0">Đầy đủ</Badge>
                  ) : (
                    <Badge className="bg-orange-500/10 text-orange-700 border-0">Thiếu</Badge>
                  )}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Tình trạng cơ sở</Label>
                  <div>{getStatusBadge(selectedRecord.TinhTrangCoSo)}</div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Xếp loại</Label>
                <p className="font-medium">{selectedRecord.XepLoai}</p>
                {selectedRecord.DatChuan ? (
                  <Badge className="bg-green-500/10 text-green-700 border-0 mt-1"><CheckCircle2 className="w-3 h-3 mr-1" />Đạt chuẩn Quốc gia</Badge>
                ) : (
                  <Badge className="bg-gray-500/10 text-gray-700 border-0 mt-1"><X className="w-3 h-3 mr-1" />Chưa đạt chuẩn</Badge>
                )}
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
              Cập nhật thông tin cơ sở giáo dục
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên trường *</Label>
                <Input
                  value={formData.TenTruong}
                  onChange={(e) => setFormData({...formData, TenTruong: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Hiệu trưởng</Label>
                <Input
                  value={formData.HieuTruong}
                  onChange={(e) => setFormData({...formData, HieuTruong: e.target.value})}
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
              <div className="space-y-2">
                <Label>Năm thành lập</Label>
                <Input
                  type="number"
                  value={formData.NamThanhLap}
                  onChange={(e) => setFormData({...formData, NamThanhLap: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Số phòng học</Label>
                <Input
                  type="number"
                  value={formData.SoPhongHoc}
                  onChange={(e) => setFormData({...formData, SoPhongHoc: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Phòng chức năng</Label>
                <Input
                  type="number"
                  value={formData.SoPhongChucNang}
                  onChange={(e) => setFormData({...formData, SoPhongChucNang: parseInt(e.target.value)})}
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số giáo viên</Label>
                <Input
                  type="number"
                  value={formData.SoGiaoVien}
                  onChange={(e) => setFormData({...formData, SoGiaoVien: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số học sinh</Label>
                <Input
                  type="number"
                  value={formData.SoHocSinh}
                  onChange={(e) => setFormData({...formData, SoHocSinh: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trang thiết bị</Label>
                <Select value={formData.TrangThietBi} onValueChange={(v) => setFormData({...formData, TrangThietBi: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đầy đủ">Đầy đủ</SelectItem>
                    <SelectItem value="Thiếu">Thiếu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tình trạng cơ sở</Label>
                <Select value={formData.TinhTrangCoSo} onValueChange={(v) => setFormData({...formData, TinhTrangCoSo: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Cần sửa chữa">Cần sửa chữa</SelectItem>
                    <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Xếp loại</Label>
                <Input
                  value={formData.XepLoai}
                  onChange={(e) => setFormData({...formData, XepLoai: e.target.value})}
                  placeholder="VD: Đạt chuẩn Quốc gia Mức độ 1"
                />
              </div>
              <div className="space-y-2">
                <Label>Đạt chuẩn Quốc gia</Label>
                <Select value={formData.DatChuan ? 'true' : 'false'} onValueChange={(v) => setFormData({...formData, DatChuan: v === 'true'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Đạt chuẩn</SelectItem>
                    <SelectItem value="false">Chưa đạt chuẩn</SelectItem>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm cơ sở giáo dục mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã trường *</Label>
                <Input
                  value={formData.MaTruong}
                  onChange={(e) => setFormData({...formData, MaTruong: e.target.value})}
                  placeholder="VD: MN-003"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại trường *</Label>
                <Select value={formData.LoaiTruong} onValueChange={(v) => setFormData({...formData, LoaiTruong: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mầm non">Mầm non</SelectItem>
                    <SelectItem value="Tiểu học">Tiểu học</SelectItem>
                    <SelectItem value="THCS">THCS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên trường *</Label>
                <Input
                  value={formData.TenTruong}
                  onChange={(e) => setFormData({...formData, TenTruong: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Hiệu trưởng</Label>
                <Input
                  value={formData.HieuTruong}
                  onChange={(e) => setFormData({...formData, HieuTruong: e.target.value})}
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Năm thành lập</Label>
                <Input
                  type="number"
                  value={formData.NamThanhLap}
                  onChange={(e) => setFormData({...formData, NamThanhLap: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số phòng học</Label>
                <Input
                  type="number"
                  value={formData.SoPhongHoc}
                  onChange={(e) => setFormData({...formData, SoPhongHoc: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Phòng chức năng</Label>
                <Input
                  type="number"
                  value={formData.SoPhongChucNang}
                  onChange={(e) => setFormData({...formData, SoPhongChucNang: parseInt(e.target.value)})}
                />
              </div>
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
                <Label>Số giáo viên</Label>
                <Input
                  type="number"
                  value={formData.SoGiaoVien}
                  onChange={(e) => setFormData({...formData, SoGiaoVien: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số học sinh</Label>
                <Input
                  type="number"
                  value={formData.SoHocSinh}
                  onChange={(e) => setFormData({...formData, SoHocSinh: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trang thiết bị</Label>
                <Select value={formData.TrangThietBi} onValueChange={(v) => setFormData({...formData, TrangThietBi: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đầy đủ">Đầy đủ</SelectItem>
                    <SelectItem value="Thiếu">Thiếu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tình trạng cơ sở</Label>
                <Select value={formData.TinhTrangCoSo} onValueChange={(v) => setFormData({...formData, TinhTrangCoSo: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Cần sửa chữa">Cần sửa chữa</SelectItem>
                    <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Xếp loại</Label>
                <Input
                  value={formData.XepLoai}
                  onChange={(e) => setFormData({...formData, XepLoai: e.target.value})}
                  placeholder="VD: Đạt chuẩn Quốc gia Mức độ 1"
                />
              </div>
              <div className="space-y-2">
                <Label>Đạt chuẩn Quốc gia</Label>
                <Select value={formData.DatChuan ? 'true' : 'false'} onValueChange={(v) => setFormData({...formData, DatChuan: v === 'true'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Đạt chuẩn</SelectItem>
                    <SelectItem value="false">Chưa đạt chuẩn</SelectItem>
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
