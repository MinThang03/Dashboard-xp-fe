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
  Sparkles,
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
  Award,
  TrendingUp,
  AlertTriangle,
  Home,
  Package,
  DollarSign,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mock-data';

// Mock data cho làng nghề
const mockLangNghe = [
  {
    MaLangNghe: 1,
    MaLN: 'LN-001',
    TenLangNghe: 'Làng gốm Bát Tràng',
    NgheNghiep: 'Gốm sứ',
    LoaiNgheNghiep: 'Thủ công mỹ nghệ',
    DiaChi: 'Xã Bát Tràng, Phường 1',
    DienTich: 50,
    SoHoNghe: 120,
    SoNgheNhan: 25,
    SoLaoDong: 450,
    DoanhThuNam: 15000000000,
    NamThanhLap: 1985,
    DanhHieu: 'Làng nghề truyền thống cấp Quốc gia',
    NamCongNhan: 2000,
    TrangThai: 'Phát triển',
    SanPhamChinh: 'Gốm sứ trang trí, đồ gia dụng',
    ThiTruong: 'Nội địa, Xuất khẩu',
    HoTro: 'Đã được hỗ trợ vốn, đào tạo',
    MoTa: 'Làng gốm truyền thống lâu đời với kỹ thuật làm gốm độc đáo',
    LienHe: 'Ông Nguyễn Văn A',
    DienThoai: '024 1234 5678',
    GhiChu: '',
  },
  {
    MaLangNghe: 2,
    MaLN: 'LN-002',
    TenLangNghe: 'Làng mộc Đồng Kỵ',
    NgheNghiep: 'Mộc mỹ nghệ',
    LoaiNgheNghiep: 'Thủ công mỹ nghệ',
    DiaChi: 'Khu phố Đồng Kỵ, Phường 2',
    DienTich: 80,
    SoHoNghe: 180,
    SoNgheNhan: 35,
    SoLaoDong: 650,
    DoanhThuNam: 25000000000,
    NamThanhLap: 1970,
    DanhHieu: 'Làng nghề truyền thống cấp Quốc gia',
    NamCongNhan: 1995,
    TrangThai: 'Phát triển',
    SanPhamChinh: 'Đồ gỗ nội thất, đồ thờ',
    ThiTruong: 'Nội địa, Xuất khẩu',
    HoTro: 'Đã được hỗ trợ vốn, đào tạo, xúc tiến thương mại',
    MoTa: 'Làng nghề mộc nổi tiếng với sản phẩm gỗ mỹ nghệ cao cấp',
    LienHe: 'Ông Trần Văn B',
    DienThoai: '024 2345 6789',
    GhiChu: '',
  },
  {
    MaLangNghe: 3,
    MaLN: 'LN-003',
    TenLangNghe: 'Làng dệt Vạn Phúc',
    NgheNghiep: 'Dệt lụa',
    LoaiNgheNghiep: 'Dệt may',
    DiaChi: 'Khu phố Vạn Phúc, Phường 3',
    DienTich: 35,
    SoHoNghe: 85,
    SoNgheNhan: 15,
    SoLaoDong: 280,
    DoanhThuNam: 8000000000,
    NamThanhLap: 1960,
    DanhHieu: 'Làng nghề truyền thống cấp Tỉnh',
    NamCongNhan: 2005,
    TrangThai: 'Ổn định',
    SanPhamChinh: 'Lụa tơ tằm, khăn, vải',
    ThiTruong: 'Nội địa',
    HoTro: 'Đã được hỗ trợ đào tạo',
    MoTa: 'Làng dệt lụa truyền thống với kỹ thuật dệt tay tinh xảo',
    LienHe: 'Bà Lê Thị C',
    DienThoai: '024 3456 7890',
    GhiChu: 'Cần hỗ trợ mở rộng thị trường',
  },
  {
    MaLangNghe: 4,
    MaLN: 'LN-004',
    TenLangNghe: 'Làng tranh Đông Hồ',
    NgheNghiep: 'Tranh dân gian',
    LoaiNgheNghiep: 'Thủ công mỹ nghệ',
    DiaChi: 'Khu phố Đông Hồ, Phường 1',
    DienTich: 25,
    SoHoNghe: 45,
    SoNgheNhan: 12,
    SoLaoDong: 120,
    DoanhThuNam: 3500000000,
    NamThanhLap: 1950,
    DanhHieu: 'Di sản văn hóa phi vật thể',
    NamCongNhan: 2010,
    TrangThai: 'Cần bảo tồn',
    SanPhamChinh: 'Tranh Đông Hồ',
    ThiTruong: 'Nội địa, Du lịch',
    HoTro: 'Đang được hỗ trợ bảo tồn',
    MoTa: 'Làng tranh dân gian nổi tiếng với kỹ thuật in tranh gỗ truyền thống',
    LienHe: 'Ông Nguyễn Đăng D',
    DienThoai: '024 4567 8901',
    GhiChu: 'Số nghệ nhân giảm, cần thu hút thế hệ trẻ',
  },
  {
    MaLangNghe: 5,
    MaLN: 'LN-005',
    TenLangNghe: 'Làng rèn Đa Sỹ',
    NgheNghiep: 'Rèn kim loại',
    LoaiNgheNghiep: 'Cơ khí',
    DiaChi: 'Khu phố Đa Sỹ, Phường 2',
    DienTich: 40,
    SoHoNghe: 95,
    SoNgheNhan: 20,
    SoLaoDong: 350,
    DoanhThuNam: 6500000000,
    NamThanhLap: 1975,
    DanhHieu: 'Làng nghề truyền thống cấp Tỉnh',
    NamCongNhan: 2008,
    TrangThai: 'Ổn định',
    SanPhamChinh: 'Dao kéo, dụng cụ nông nghiệp',
    ThiTruong: 'Nội địa',
    HoTro: 'Đã được hỗ trợ thiết bị',
    MoTa: 'Làng rèn truyền thống nổi tiếng với dao kéo chất lượng cao',
    LienHe: 'Ông Phạm Văn E',
    DienThoai: '024 5678 9012',
    GhiChu: '',
  },
];

interface LangNghe {
  MaLangNghe: number;
  MaLN: string;
  TenLangNghe: string;
  NgheNghiep: string;
  LoaiNgheNghiep: string;
  DiaChi: string;
  DienTich: number;
  SoHoNghe: number;
  SoNgheNhan: number;
  SoLaoDong: number;
  DoanhThuNam: number;
  NamThanhLap: number;
  DanhHieu: string;
  NamCongNhan: number;
  TrangThai: string;
  SanPhamChinh: string;
  ThiTruong: string;
  HoTro: string;
  MoTa: string;
  LienHe: string;
  DienThoai: string;
  GhiChu: string;
}

export default function LangNghePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LangNghe | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaLN: '',
    TenLangNghe: '',
    NgheNghiep: 'Gốm sứ',
    LoaiNgheNghiep: 'Thủ công mỹ nghệ',
    DiaChi: '',
    DienTich: 0,
    SoHoNghe: 0,
    SoNgheNhan: 0,
    SoLaoDong: 0,
    DoanhThuNam: 0,
    NamThanhLap: new Date().getFullYear(),
    DanhHieu: '',
    NamCongNhan: new Date().getFullYear(),
    TrangThai: 'Ổn định',
    SanPhamChinh: '',
    ThiTruong: 'Nội địa',
    HoTro: '',
    MoTa: '',
    LienHe: '',
    DienThoai: '',
    GhiChu: '',
  });

  const normalizeText = (value: unknown) =>
    typeof value === 'string' ? value.toLowerCase() : String(value ?? '').toLowerCase();

  // Filter data
  const filteredData = mockLangNghe.filter((item) => {
    const normalizedQuery = normalizeText(searchQuery);
    const matchSearch =
      normalizeText(item.MaLN).includes(normalizedQuery) ||
      normalizeText(item.TenLangNghe).includes(normalizedQuery) ||
      normalizeText(item.NgheNghiep).includes(normalizedQuery);
    
    const matchType = typeFilter === 'all' || item.LoaiNgheNghiep === typeFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchType && matchStatus;
  });

  // Stats
  const stats = {
    total: mockLangNghe.length,
    totalHo: mockLangNghe.reduce((sum, l) => sum + l.SoHoNghe, 0),
    totalNgheNhan: mockLangNghe.reduce((sum, l) => sum + l.SoNgheNhan, 0),
    totalLabor: mockLangNghe.reduce((sum, l) => sum + l.SoLaoDong, 0),
    totalRevenue: mockLangNghe.reduce((sum, l) => sum + l.DoanhThuNam, 0),
    developing: mockLangNghe.filter(l => l.TrangThai === 'Phát triển').length,
  };

  // Handlers
  const handleView = (record: LangNghe) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: LangNghe) => {
    setSelectedRecord(record);
    setFormData({
      MaLN: record.MaLN,
      TenLangNghe: record.TenLangNghe,
      NgheNghiep: record.NgheNghiep,
      LoaiNgheNghiep: record.LoaiNgheNghiep,
      DiaChi: record.DiaChi,
      DienTich: record.DienTich,
      SoHoNghe: record.SoHoNghe,
      SoNgheNhan: record.SoNgheNhan,
      SoLaoDong: record.SoLaoDong,
      DoanhThuNam: record.DoanhThuNam,
      NamThanhLap: record.NamThanhLap,
      DanhHieu: record.DanhHieu,
      NamCongNhan: record.NamCongNhan,
      TrangThai: record.TrangThai,
      SanPhamChinh: record.SanPhamChinh,
      ThiTruong: record.ThiTruong,
      HoTro: record.HoTro,
      MoTa: record.MoTa,
      LienHe: record.LienHe,
      DienThoai: record.DienThoai,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      MaLN: '',
      TenLangNghe: '',
      NgheNghiep: 'Gốm sứ',
      LoaiNgheNghiep: 'Thủ công mỹ nghệ',
      DiaChi: '',
      DienTich: 0,
      SoHoNghe: 0,
      SoNgheNhan: 0,
      SoLaoDong: 0,
      DoanhThuNam: 0,
      NamThanhLap: new Date().getFullYear(),
      DanhHieu: '',
      NamCongNhan: new Date().getFullYear(),
      TrangThai: 'Ổn định',
      SanPhamChinh: '',
      ThiTruong: 'Nội địa',
      HoTro: '',
      MoTa: '',
      LienHe: '',
      DienThoai: '',
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
      case 'Phát triển':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><TrendingUp className="w-3 h-3 mr-1" />Phát triển</Badge>;
      case 'Ổn định':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Ổn định</Badge>;
      case 'Cần bảo tồn':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><AlertTriangle className="w-3 h-3 mr-1" />Cần bảo tồn</Badge>;
      case 'Suy giảm':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><AlertTriangle className="w-3 h-3 mr-1" />Suy giảm</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCraftIcon = (type: string) => {
    switch (type) {
      case 'Thủ công mỹ nghệ':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Dệt may':
        return <Package className="w-4 h-4 text-purple-500" />;
      case 'Cơ khí':
        return <Package className="w-4 h-4 text-slate-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-status-warning to-accent p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Làng nghề truyền thống</h1>
              </div>
              <p className="text-white/90">Bảo tồn và phát triển làng nghề, nghề thủ công truyền thống</p>
            </div>
            <Button className="w-full 2xl:w-auto bg-white text-orange-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm làng nghề
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Làng nghề</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.totalNgheNhan}</p>
              <p className="text-xs text-muted-foreground">Nghệ nhân</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalHo}</p>
              <p className="text-xs text-muted-foreground">Hộ nghề</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">{stats.totalLabor.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Lao động</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-600">{(stats.totalRevenue / 1000000000).toFixed(0)}B</p>
              <p className="text-xs text-muted-foreground">Doanh thu/năm</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.developing}</p>
              <p className="text-xs text-muted-foreground">Đang phát triển</p>
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
              placeholder="Tìm kiếm theo mã, tên, nghề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Loại nghề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại nghề</SelectItem>
              <SelectItem value="Thủ công mỹ nghệ">Thủ công mỹ nghệ</SelectItem>
              <SelectItem value="Dệt may">Dệt may</SelectItem>
              <SelectItem value="Cơ khí">Cơ khí</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Phát triển">Phát triển</SelectItem>
              <SelectItem value="Ổn định">Ổn định</SelectItem>
              <SelectItem value="Cần bảo tồn">Cần bảo tồn</SelectItem>
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
                <th className="text-left p-4 font-semibold">Tên làng nghề</th>
                <th className="text-left p-4 font-semibold">Nghề</th>
                <th className="text-center p-4 font-semibold">Hộ nghề</th>
                <th className="text-center p-4 font-semibold">Nghệ nhân</th>
                <th className="text-right p-4 font-semibold">Doanh thu/năm</th>
                <th className="text-left p-4 font-semibold">Tình trạng</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaLangNghe} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.MaLN}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getCraftIcon(record.LoaiNgheNghiep)}
                      <div>
                        <div className="font-medium">{record.TenLangNghe}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{record.DiaChi}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{record.NgheNghiep}</Badge>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-lg">{record.SoHoNghe}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-lg text-purple-600">{record.SoNgheNhan}</span>
                  </td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {formatCurrency(record.DoanhThuNam)}
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
              <Sparkles className="w-5 h-5" />
              Chi tiết làng nghề
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRecord?.MaLN}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  {getCraftIcon(selectedRecord.LoaiNgheNghiep)}
                  Thông tin làng nghề
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên làng nghề</Label>
                    <p className="font-medium">{selectedRecord.TenLangNghe}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Nghề nghiệp</Label>
                    <p className="font-medium">{selectedRecord.NgheNghiep}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Năm thành lập</Label>
                    <p className="font-medium">{selectedRecord.NamThanhLap}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Diện tích</Label>
                    <p className="font-medium">{selectedRecord.DienTich} ha</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedRecord.SoHoNghe}</p>
                  <p className="text-xs text-muted-foreground">Hộ nghề</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedRecord.SoNgheNhan}</p>
                  <p className="text-xs text-muted-foreground">Nghệ nhân</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-teal-600">{selectedRecord.SoLaoDong}</p>
                  <p className="text-xs text-muted-foreground">Lao động</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedRecord.DoanhThuNam)}</p>
                  <p className="text-xs text-muted-foreground">DT/năm</p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Danh hiệu & Công nhận
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Danh hiệu</Label>
                    <p className="font-medium">{selectedRecord.DanhHieu}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Năm công nhận</Label>
                    <p className="font-medium">{selectedRecord.NamCongNhan}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Sản phẩm & Thị trường</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Sản phẩm chính</Label>
                    <p className="font-medium">{selectedRecord.SanPhamChinh}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Thị trường</Label>
                    <p className="font-medium">{selectedRecord.ThiTruong}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Hỗ trợ đã nhận</Label>
                    <p className="font-medium">{selectedRecord.HoTro}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Mô tả</Label>
                    <p className="font-medium">{selectedRecord.MoTa}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Liên hệ</Label>
                  <p className="font-medium">{selectedRecord.LienHe}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                  <p className="font-medium">{selectedRecord.DienThoai}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-muted-foreground text-xs">Tình trạng</Label>
                  <div>{getStatusBadge(selectedRecord.TrangThai)}</div>
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
              Cập nhật làng nghề
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Thông tin cơ bản</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Tên làng nghề *</Label>
                  <Input
                    value={formData.TenLangNghe}
                    onChange={(e) => setFormData({...formData, TenLangNghe: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nghề nghiệp</Label>
                  <Input
                    value={formData.NgheNghiep}
                    onChange={(e) => setFormData({...formData, NgheNghiep: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tình trạng</Label>
                  <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phát triển">Phát triển</SelectItem>
                      <SelectItem value="Ổn định">Ổn định</SelectItem>
                      <SelectItem value="Cần bảo tồn">Cần bảo tồn</SelectItem>
                      <SelectItem value="Suy giảm">Suy giảm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={formData.DiaChi}
                    onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
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
                <div className="space-y-2">
                  <Label>Diện tích (ha)</Label>
                  <Input
                    type="number"
                    value={formData.DienTich}
                    onChange={(e) => setFormData({...formData, DienTich: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Quy mô hoạt động</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Số hộ nghề</Label>
                  <Input
                    type="number"
                    value={formData.SoHoNghe}
                    onChange={(e) => setFormData({...formData, SoHoNghe: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số nghệ nhân</Label>
                  <Input
                    type="number"
                    value={formData.SoNgheNhan}
                    onChange={(e) => setFormData({...formData, SoNgheNhan: parseInt(e.target.value)})}
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
                  <Label>DT/năm (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.DoanhThuNam}
                    onChange={(e) => setFormData({...formData, DoanhThuNam: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Danh hiệu & Công nhận</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Danh hiệu</Label>
                  <Input
                    value={formData.DanhHieu}
                    onChange={(e) => setFormData({...formData, DanhHieu: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Năm công nhận</Label>
                  <Input
                    type="number"
                    value={formData.NamCongNhan}
                    onChange={(e) => setFormData({...formData, NamCongNhan: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Sản phẩm & Thị trường</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sản phẩm chính</Label>
                  <Input
                    value={formData.SanPhamChinh}
                    onChange={(e) => setFormData({...formData, SanPhamChinh: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thị trường</Label>
                  <Input
                    value={formData.ThiTruong}
                    onChange={(e) => setFormData({...formData, ThiTruong: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Hỗ trợ đã nhận</Label>
                  <Input
                    value={formData.HoTro}
                    onChange={(e) => setFormData({...formData, HoTro: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Mô tả</Label>
                  <Textarea
                    value={formData.MoTa}
                    onChange={(e) => setFormData({...formData, MoTa: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Liên hệ</Label>
                <Input
                  value={formData.LienHe}
                  onChange={(e) => setFormData({...formData, LienHe: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Điện thoại</Label>
                <Input
                  value={formData.DienThoai}
                  onChange={(e) => setFormData({...formData, DienThoai: e.target.value})}
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
              Thêm làng nghề mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã làng nghề *</Label>
                <Input
                  value={formData.MaLN}
                  onChange={(e) => setFormData({...formData, MaLN: e.target.value})}
                  placeholder="VD: LN-006"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại nghề *</Label>
                <Select value={formData.LoaiNgheNghiep} onValueChange={(v) => setFormData({...formData, LoaiNgheNghiep: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thủ công mỹ nghệ">Thủ công mỹ nghệ</SelectItem>
                    <SelectItem value="Dệt may">Dệt may</SelectItem>
                    <SelectItem value="Cơ khí">Cơ khí</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tên làng nghề *</Label>
              <Input
                value={formData.TenLangNghe}
                onChange={(e) => setFormData({...formData, TenLangNghe: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nghề nghiệp *</Label>
                <Input
                  value={formData.NgheNghiep}
                  onChange={(e) => setFormData({...formData, NgheNghiep: e.target.value})}
                  placeholder="VD: Gốm sứ, Mộc mỹ nghệ..."
                />
              </div>
              <div className="space-y-2">
                <Label>Thị trường</Label>
                <Select value={formData.ThiTruong} onValueChange={(v) => setFormData({...formData, ThiTruong: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nội địa">Nội địa</SelectItem>
                    <SelectItem value="Xuất khẩu">Xuất khẩu</SelectItem>
                    <SelectItem value="Nội địa, Xuất khẩu">Nội địa, Xuất khẩu</SelectItem>
                    <SelectItem value="Nội địa, Du lịch">Nội địa, Du lịch</SelectItem>
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
                <Label>Số hộ nghề</Label>
                <Input
                  type="number"
                  value={formData.SoHoNghe}
                  onChange={(e) => setFormData({...formData, SoHoNghe: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Số nghệ nhân</Label>
                <Input
                  type="number"
                  value={formData.SoNgheNhan}
                  onChange={(e) => setFormData({...formData, SoNgheNhan: parseInt(e.target.value)})}
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
                <Label>Năm thành lập</Label>
                <Input
                  type="number"
                  value={formData.NamThanhLap}
                  onChange={(e) => setFormData({...formData, NamThanhLap: parseInt(e.target.value) || new Date().getFullYear()})}
                />
              </div>
              <div className="space-y-2">
                <Label>Diện tích (ha)</Label>
                <Input
                  type="number"
                  value={formData.DienTich}
                  onChange={(e) => setFormData({...formData, DienTich: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>DT/năm (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.DoanhThuNam}
                  onChange={(e) => setFormData({...formData, DoanhThuNam: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sản phẩm chính</Label>
              <Input
                value={formData.SanPhamChinh}
                onChange={(e) => setFormData({...formData, SanPhamChinh: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Danh hiệu</Label>
                <Input
                  value={formData.DanhHieu}
                  onChange={(e) => setFormData({...formData, DanhHieu: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Năm công nhận</Label>
                <Input
                  type="number"
                  value={formData.NamCongNhan}
                  onChange={(e) => setFormData({...formData, NamCongNhan: parseInt(e.target.value) || new Date().getFullYear()})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hỗ trợ đã nhận</Label>
              <Input
                value={formData.HoTro}
                onChange={(e) => setFormData({...formData, HoTro: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={formData.MoTa}
                onChange={(e) => setFormData({...formData, MoTa: e.target.value})}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Liên hệ</Label>
                <Input
                  value={formData.LienHe}
                  onChange={(e) => setFormData({...formData, LienHe: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Điện thoại</Label>
                <Input
                  value={formData.DienThoai}
                  onChange={(e) => setFormData({...formData, DienThoai: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tình trạng</Label>
              <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phát triển">Phát triển</SelectItem>
                  <SelectItem value="Ổn định">Ổn định</SelectItem>
                  <SelectItem value="Cần bảo tồn">Cần bảo tồn</SelectItem>
                  <SelectItem value="Suy giảm">Suy giảm</SelectItem>
                </SelectContent>
              </Select>
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
