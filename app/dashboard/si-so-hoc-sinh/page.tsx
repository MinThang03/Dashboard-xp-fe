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
  Users,
  Search,
  Plus,
  Download,
  Calendar,
  CheckCircle2,
  Eye,
  Edit,
  X,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  School,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { formatDate } from '@/lib/mock-data';

// Mock data cho sĩ số học sinh
const mockSiSoHS = [
  {
    MaSiSo: 1,
    MaLop: 'TH-NT-1A',
    TenLop: 'Lớp 1A',
    TenTruong: 'TH Nguyễn Trãi',
    MaTruong: 'TH-001',
    LoaiTruong: 'Tiểu học',
    GiaoVienChuNhiem: 'Nguyễn Thị An',
    NamHoc: '2023-2024',
    HocKy: 1,
    SiSoDauNam: 35,
    SiSoHienTai: 35,
    Nam: 18,
    Nu: 17,
    CoMatHomNay: 34,
    VangCoPhep: 1,
    VangKhongPhep: 0,
    TyLeDiHoc: 97.1,
    NgayCapNhat: '2024-01-17',
    GhiChu: '',
  },
  {
    MaSiSo: 2,
    MaLop: 'TH-NT-2B',
    TenLop: 'Lớp 2B',
    TenTruong: 'TH Nguyễn Trãi',
    MaTruong: 'TH-001',
    LoaiTruong: 'Tiểu học',
    GiaoVienChuNhiem: 'Trần Văn Bình',
    NamHoc: '2023-2024',
    HocKy: 1,
    SiSoDauNam: 38,
    SiSoHienTai: 38,
    Nam: 20,
    Nu: 18,
    CoMatHomNay: 38,
    VangCoPhep: 0,
    VangKhongPhep: 0,
    TyLeDiHoc: 100,
    NgayCapNhat: '2024-01-17',
    GhiChu: '',
  },
  {
    MaSiSo: 3,
    MaLop: 'MN-HM-CHOI',
    TenLop: 'Lớp Chồi',
    TenTruong: 'MN Hoa Mai',
    MaTruong: 'MN-001',
    LoaiTruong: 'Mầm non',
    GiaoVienChuNhiem: 'Lê Thị Cúc',
    NamHoc: '2023-2024',
    HocKy: 1,
    SiSoDauNam: 25,
    SiSoHienTai: 25,
    Nam: 13,
    Nu: 12,
    CoMatHomNay: 24,
    VangCoPhep: 1,
    VangKhongPhep: 0,
    TyLeDiHoc: 96,
    NgayCapNhat: '2024-01-17',
    GhiChu: '1 bé nghỉ ốm',
  },
  {
    MaSiSo: 4,
    MaLop: 'THCS-LQD-6A',
    TenLop: 'Lớp 6A',
    TenTruong: 'THCS Lê Quý Đôn',
    MaTruong: 'THCS-001',
    LoaiTruong: 'THCS',
    GiaoVienChuNhiem: 'Phạm Văn Dũng',
    NamHoc: '2023-2024',
    HocKy: 1,
    SiSoDauNam: 42,
    SiSoHienTai: 42,
    Nam: 22,
    Nu: 20,
    CoMatHomNay: 40,
    VangCoPhep: 1,
    VangKhongPhep: 1,
    TyLeDiHoc: 95.2,
    NgayCapNhat: '2024-01-17',
    GhiChu: '1 học sinh nghỉ không phép - đã liên hệ gia đình',
  },
  {
    MaSiSo: 5,
    MaLop: 'MN-HM-LA',
    TenLop: 'Lớp Lá',
    TenTruong: 'MN Hoa Mai',
    MaTruong: 'MN-001',
    LoaiTruong: 'Mầm non',
    GiaoVienChuNhiem: 'Hoàng Thị Em',
    NamHoc: '2023-2024',
    HocKy: 1,
    SiSoDauNam: 30,
    SiSoHienTai: 30,
    Nam: 16,
    Nu: 14,
    CoMatHomNay: 30,
    VangCoPhep: 0,
    VangKhongPhep: 0,
    TyLeDiHoc: 100,
    NgayCapNhat: '2024-01-17',
    GhiChu: '',
  },
  {
    MaSiSo: 6,
    MaLop: 'TH-HVH-3C',
    TenLop: 'Lớp 3C',
    TenTruong: 'TH Hồ Văn Huê',
    MaTruong: 'TH-002',
    LoaiTruong: 'Tiểu học',
    GiaoVienChuNhiem: 'Võ Văn Phúc',
    NamHoc: '2023-2024',
    HocKy: 1,
    SiSoDauNam: 36,
    SiSoHienTai: 35,
    Nam: 18,
    Nu: 17,
    CoMatHomNay: 33,
    VangCoPhep: 2,
    VangKhongPhep: 0,
    TyLeDiHoc: 94.3,
    NgayCapNhat: '2024-01-17',
    GhiChu: '1 HS chuyển trường',
  },
];

interface SiSoHS {
  MaSiSo: number;
  MaLop: string;
  TenLop: string;
  TenTruong: string;
  MaTruong: string;
  LoaiTruong: string;
  GiaoVienChuNhiem: string;
  NamHoc: string;
  HocKy: number;
  SiSoDauNam: number;
  SiSoHienTai: number;
  Nam: number;
  Nu: number;
  CoMatHomNay: number;
  VangCoPhep: number;
  VangKhongPhep: number;
  TyLeDiHoc: number;
  NgayCapNhat: string;
  GhiChu: string;
}

export default function SiSoHocSinhPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SiSoHS | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    CoMatHomNay: 0,
    VangCoPhep: 0,
    VangKhongPhep: 0,
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockSiSoHS.filter((item) => {
    const matchSearch = 
      item.MaLop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenLop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenTruong.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.GiaoVienChuNhiem.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchSchool = schoolFilter === 'all' || item.MaTruong === schoolFilter;
    const matchType = typeFilter === 'all' || item.LoaiTruong === typeFilter;
    
    return matchSearch && matchSchool && matchType;
  });

  // Stats
  const stats = {
    totalStudents: mockSiSoHS.reduce((sum, t) => sum + t.SiSoHienTai, 0),
    present: mockSiSoHS.reduce((sum, t) => sum + t.CoMatHomNay, 0),
    absentWithPermission: mockSiSoHS.reduce((sum, t) => sum + t.VangCoPhep, 0),
    absentWithoutPermission: mockSiSoHS.reduce((sum, t) => sum + t.VangKhongPhep, 0),
    avgRate: (mockSiSoHS.reduce((sum, t) => sum + t.TyLeDiHoc, 0) / mockSiSoHS.length).toFixed(1),
    totalClasses: mockSiSoHS.length,
  };

  // Handlers
  const handleView = (record: SiSoHS) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: SiSoHS) => {
    setSelectedRecord(record);
    setFormData({
      CoMatHomNay: record.CoMatHomNay,
      VangCoPhep: record.VangCoPhep,
      VangKhongPhep: record.VangKhongPhep,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setEditDialogOpen(false);
  };

  // Helper functions
  const getSchoolIcon = (type: string) => {
    switch (type) {
      case 'Mầm non':
        return <School className="w-4 h-4 text-pink-500" />;
      case 'Tiểu học':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'THCS':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRateBadge = (rate: number) => {
    if (rate >= 98) {
      return <Badge className="bg-green-500/10 text-green-700 border-0">{rate}%</Badge>;
    } else if (rate >= 95) {
      return <Badge className="bg-blue-500/10 text-blue-700 border-0">{rate}%</Badge>;
    } else if (rate >= 90) {
      return <Badge className="bg-yellow-500/10 text-yellow-700 border-0">{rate}%</Badge>;
    } else {
      return <Badge className="bg-red-500/10 text-red-700 border-0">{rate}%</Badge>;
    }
  };

  const schools = [...new Set(mockSiSoHS.map(s => ({ id: s.MaTruong, name: s.TenTruong })))];

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
                  <Users className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Sĩ số Học sinh</h1>
              </div>
              <p className="text-white/90">Theo dõi sĩ số, tỷ lệ đến lớp học sinh hàng ngày</p>
            </div>
            <Button className="bg-white text-indigo-600 hover:bg-white/90">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
          <p className="text-xs text-muted-foreground">Tổng học sinh</p>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          <p className="text-xs text-muted-foreground">Có mặt hôm nay</p>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <TrendingDown className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.absentWithPermission}</p>
          <p className="text-xs text-muted-foreground">Vắng có phép</p>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.absentWithoutPermission}</p>
          <p className="text-xs text-muted-foreground">Vắng không phép</p>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{stats.avgRate}%</p>
          <p className="text-xs text-muted-foreground">Tỷ lệ đi học</p>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <School className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalClasses}</p>
          <p className="text-xs text-muted-foreground">Số lớp</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã lớp, tên lớp, giáo viên..."
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
          <Select value={schoolFilter} onValueChange={setSchoolFilter}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Trường" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trường</SelectItem>
              <SelectItem value="MN-001">MN Hoa Mai</SelectItem>
              <SelectItem value="TH-001">TH Nguyễn Trãi</SelectItem>
              <SelectItem value="TH-002">TH Hồ Văn Huê</SelectItem>
              <SelectItem value="THCS-001">THCS Lê Quý Đôn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Lớp</th>
                <th className="text-left p-4 font-semibold">Trường</th>
                <th className="text-left p-4 font-semibold">GVCN</th>
                <th className="text-center p-4 font-semibold">Sĩ số</th>
                <th className="text-center p-4 font-semibold">Có mặt</th>
                <th className="text-center p-4 font-semibold">Vắng CP</th>
                <th className="text-center p-4 font-semibold">Vắng KP</th>
                <th className="text-center p-4 font-semibold">Tỷ lệ</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaSiSo} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getSchoolIcon(record.LoaiTruong)}
                      <div>
                        <div className="font-semibold text-primary">{record.TenLop}</div>
                        <div className="text-xs text-muted-foreground font-mono">{record.MaLop}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{record.TenTruong}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{record.GiaoVienChuNhiem}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-lg">{record.SiSoHienTai}</span>
                    <div className="text-xs text-muted-foreground">({record.Nam}N/{record.Nu}Nữ)</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-lg text-green-600">{record.CoMatHomNay}</span>
                  </td>
                  <td className="p-4 text-center">
                    {record.VangCoPhep > 0 ? (
                      <span className="font-semibold text-yellow-600">{record.VangCoPhep}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {record.VangKhongPhep > 0 ? (
                      <span className="font-semibold text-red-600">{record.VangKhongPhep}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {getRateBadge(record.TyLeDiHoc)}
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
                        title="Điểm danh"
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
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy lớp học phù hợp</p>
          </div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Chi tiết sĩ số lớp
            </DialogTitle>
            <DialogDescription>
              Mã lớp: {selectedRecord?.MaLop}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  {getSchoolIcon(selectedRecord.LoaiTruong)}
                  Thông tin lớp học
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên lớp</Label>
                    <p className="font-medium">{selectedRecord.TenLop}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Trường</Label>
                    <p className="font-medium">{selectedRecord.TenTruong}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">GVCN</Label>
                    <p className="font-medium">{selectedRecord.GiaoVienChuNhiem}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Năm học</Label>
                    <p className="font-medium">{selectedRecord.NamHoc} - HK{selectedRecord.HocKy}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">{selectedRecord.SiSoDauNam}</p>
                  <p className="text-xs text-muted-foreground">Sĩ số đầu năm</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-indigo-600">{selectedRecord.SiSoHienTai}</p>
                  <p className="text-xs text-muted-foreground">Sĩ số hiện tại</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedRecord.Nam}</p>
                  <p className="text-xs text-muted-foreground">Nam</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-600">{selectedRecord.Nu}</p>
                  <p className="text-xs text-muted-foreground">Nữ</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Điểm danh hôm nay ({formatDate(selectedRecord.NgayCapNhat)})</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{selectedRecord.CoMatHomNay}</p>
                    <p className="text-xs text-muted-foreground">Có mặt</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">{selectedRecord.VangCoPhep}</p>
                    <p className="text-xs text-muted-foreground">Vắng có phép</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{selectedRecord.VangKhongPhep}</p>
                    <p className="text-xs text-muted-foreground">Vắng không phép</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{getRateBadge(selectedRecord.TyLeDiHoc)}</p>
                    <p className="text-xs text-muted-foreground">Tỷ lệ đi học</p>
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

      {/* Edit Dialog (Điểm danh) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Cập nhật điểm danh
            </DialogTitle>
            <DialogDescription>
              {selectedRecord?.TenLop} - {selectedRecord?.TenTruong}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Sĩ số hiện tại: <span className="font-bold text-primary">{selectedRecord?.SiSoHienTai}</span></p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Có mặt</Label>
                <Input
                  type="number"
                  value={formData.CoMatHomNay}
                  onChange={(e) => setFormData({...formData, CoMatHomNay: parseInt(e.target.value)})}
                  max={selectedRecord?.SiSoHienTai}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label>Vắng CP</Label>
                <Input
                  type="number"
                  value={formData.VangCoPhep}
                  onChange={(e) => setFormData({...formData, VangCoPhep: parseInt(e.target.value)})}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label>Vắng KP</Label>
                <Input
                  type="number"
                  value={formData.VangKhongPhep}
                  onChange={(e) => setFormData({...formData, VangKhongPhep: parseInt(e.target.value)})}
                  className="text-center"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.GhiChu}
                onChange={(e) => setFormData({...formData, GhiChu: e.target.value})}
                rows={2}
                placeholder="Ghi chú về học sinh vắng..."
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
              Lưu điểm danh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
