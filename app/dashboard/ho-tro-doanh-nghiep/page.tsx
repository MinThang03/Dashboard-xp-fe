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
  Briefcase,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  X,
  Users,
  FileText,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Building,
  HelpCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mock-data';

// Mock data cho hỗ trợ doanh nghiệp
const mockHoTroDN = [
  {
    MaHoTro: 1,
    MaYC: 'HT-2024-001',
    TenDoanhNghiep: 'Cửa hàng tạp hóa ABC',
    LoaiDoanhNghiep: 'Hộ kinh doanh',
    LinhVuc: 'Bán lẻ',
    NguoiDaiDien: 'Nguyễn Văn A',
    DienThoai: '0901234567',
    Email: 'nguyenvana@gmail.com',
    DiaChi: 'Số 45, Khu phố 2, Phường 1',
    LoaiHoTro: 'Tư vấn pháp lý',
    NoiDungYeuCau: 'Cần tư vấn thủ tục đăng ký kinh doanh online',
    NgayTiepNhan: '2024-01-15',
    NgayHenTra: '2024-01-20',
    NgayHoanThanh: '2024-01-19',
    CanBoXuLy: 'Lê Thị B',
    TrangThai: 'Hoàn thành',
    KetQuaXuLy: 'Đã tư vấn thành công, hướng dẫn đăng ký DVC',
    GiaTriHoTro: 0,
    DanhGia: 5,
    GhiChu: '',
  },
  {
    MaHoTro: 2,
    MaYC: 'HT-2024-002',
    TenDoanhNghiep: 'Xưởng mộc Phú Thịnh',
    LoaiDoanhNghiep: 'Doanh nghiệp nhỏ',
    LinhVuc: 'Sản xuất',
    NguoiDaiDien: 'Trần Văn B',
    DienThoai: '0912345678',
    Email: 'xuongmocpt@gmail.com',
    DiaChi: 'Số 120, Khu CN Phường 2',
    LoaiHoTro: 'Hỗ trợ vốn',
    NoiDungYeuCau: 'Xin hỗ trợ vay vốn ưu đãi mở rộng sản xuất',
    NgayTiepNhan: '2024-01-10',
    NgayHenTra: '2024-01-25',
    NgayHoanThanh: '2024-01-24',
    CanBoXuLy: 'Phạm Văn C',
    TrangThai: 'Hoàn thành',
    KetQuaXuLy: 'Đã kết nối với Quỹ hỗ trợ DNNVV, được duyệt vay 500 triệu',
    GiaTriHoTro: 500000000,
    DanhGia: 5,
    GhiChu: '',
  },
  {
    MaHoTro: 3,
    MaYC: 'HT-2024-003',
    TenDoanhNghiep: 'Quán ăn Hương Quê',
    LoaiDoanhNghiep: 'Hộ kinh doanh',
    LinhVuc: 'Dịch vụ ăn uống',
    NguoiDaiDien: 'Lê Thị C',
    DienThoai: '0923456789',
    Email: 'huongque@gmail.com',
    DiaChi: 'Số 78, Đường Nguyễn Huệ, Phường 1',
    LoaiHoTro: 'Tư vấn ATTP',
    NoiDungYeuCau: 'Cần hướng dẫn thủ tục xin giấy phép ATTP',
    NgayTiepNhan: '2024-01-18',
    NgayHenTra: '2024-01-23',
    NgayHoanThanh: null,
    CanBoXuLy: 'Nguyễn Thị D',
    TrangThai: 'Đang xử lý',
    KetQuaXuLy: '',
    GiaTriHoTro: 0,
    DanhGia: null,
    GhiChu: 'Đang chờ bổ sung hồ sơ',
  },
  {
    MaHoTro: 4,
    MaYC: 'HT-2024-004',
    TenDoanhNghiep: 'Công ty TNHH Thiên Long',
    LoaiDoanhNghiep: 'Doanh nghiệp vừa',
    LinhVuc: 'Thương mại',
    NguoiDaiDien: 'Hoàng Văn D',
    DienThoai: '0934567890',
    Email: 'thienlong@company.com',
    DiaChi: 'Số 200, Đường Hùng Vương, Phường 3',
    LoaiHoTro: 'Xúc tiến thương mại',
    NoiDungYeuCau: 'Đăng ký tham gia hội chợ OCOP',
    NgayTiepNhan: '2024-01-20',
    NgayHenTra: '2024-02-05',
    NgayHoanThanh: null,
    CanBoXuLy: 'Trần Văn E',
    TrangThai: 'Chờ xử lý',
    KetQuaXuLy: '',
    GiaTriHoTro: 0,
    DanhGia: null,
    GhiChu: '',
  },
  {
    MaHoTro: 5,
    MaYC: 'HT-2024-005',
    TenDoanhNghiep: 'Tiệm may Ánh Dương',
    LoaiDoanhNghiep: 'Hộ kinh doanh',
    LinhVuc: 'Dịch vụ',
    NguoiDaiDien: 'Võ Thị E',
    DienThoai: '0945678901',
    Email: 'anhduong@gmail.com',
    DiaChi: 'Số 56, Khu phố 3, Phường 2',
    LoaiHoTro: 'Đào tạo nghề',
    NoiDungYeuCau: 'Xin đăng ký khóa đào tạo nâng cao tay nghề may',
    NgayTiepNhan: '2024-01-12',
    NgayHenTra: '2024-01-17',
    NgayHoanThanh: '2024-01-16',
    CanBoXuLy: 'Lê Văn F',
    TrangThai: 'Hoàn thành',
    KetQuaXuLy: 'Đã kết nối với Trung tâm dạy nghề, học viên đã tham gia khóa học',
    GiaTriHoTro: 2000000,
    DanhGia: 4,
    GhiChu: '',
  },
  {
    MaHoTro: 6,
    MaYC: 'HT-2024-006',
    TenDoanhNghiep: 'HTX Nông nghiệp Xanh',
    LoaiDoanhNghiep: 'Hợp tác xã',
    LinhVuc: 'Nông nghiệp',
    NguoiDaiDien: 'Nguyễn Văn F',
    DienThoai: '0956789012',
    Email: 'htxnongxanh@gmail.com',
    DiaChi: 'Khu vực 5, Phường 4',
    LoaiHoTro: 'Chuyển đổi số',
    NoiDungYeuCau: 'Cần hỗ trợ triển khai phần mềm quản lý bán hàng',
    NgayTiepNhan: '2024-01-22',
    NgayHenTra: '2024-02-10',
    NgayHoanThanh: null,
    CanBoXuLy: 'Phạm Thị G',
    TrangThai: 'Đang xử lý',
    KetQuaXuLy: '',
    GiaTriHoTro: 15000000,
    DanhGia: null,
    GhiChu: 'Đang triển khai phần mềm',
  },
];

interface HoTroDN {
  MaHoTro: number;
  MaYC: string;
  TenDoanhNghiep: string;
  LoaiDoanhNghiep: string;
  LinhVuc: string;
  NguoiDaiDien: string;
  DienThoai: string;
  Email: string;
  DiaChi: string;
  LoaiHoTro: string;
  NoiDungYeuCau: string;
  NgayTiepNhan: string;
  NgayHenTra: string;
  NgayHoanThanh: string | null;
  CanBoXuLy: string;
  TrangThai: string;
  KetQuaXuLy: string;
  GiaTriHoTro: number;
  DanhGia: number | null;
  GhiChu: string;
}

export default function HoTroDoanhNghiepPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportTypeFilter, setSupportTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HoTroDN | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaYC: '',
    TenDoanhNghiep: '',
    LoaiDoanhNghiep: 'Hộ kinh doanh',
    LinhVuc: 'Bán lẻ',
    NguoiDaiDien: '',
    DienThoai: '',
    Email: '',
    DiaChi: '',
    LoaiHoTro: 'Tư vấn pháp lý',
    NoiDungYeuCau: '',
    CanBoXuLy: '',
    TrangThai: 'Chờ xử lý',
    GiaTriHoTro: 0,
    DanhGia: 0,
    KetQuaXuLy: '',
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockHoTroDN.filter((item) => {
    const matchSearch = 
      item.MaYC.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenDoanhNghiep.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.NguoiDaiDien.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchType = supportTypeFilter === 'all' || item.LoaiHoTro === supportTypeFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchType && matchStatus;
  });

  // Stats
  const stats = {
    total: mockHoTroDN.length,
    completed: mockHoTroDN.filter(h => h.TrangThai === 'Hoàn thành').length,
    processing: mockHoTroDN.filter(h => h.TrangThai === 'Đang xử lý').length,
    pending: mockHoTroDN.filter(h => h.TrangThai === 'Chờ xử lý').length,
    totalValue: mockHoTroDN.reduce((sum, h) => sum + h.GiaTriHoTro, 0),
    successRate: Math.round((mockHoTroDN.filter(h => h.TrangThai === 'Hoàn thành').length / mockHoTroDN.length) * 100),
  };

  // Handlers
  const handleView = (record: HoTroDN) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: HoTroDN) => {
    setSelectedRecord(record);
    setFormData({
      MaYC: record.MaYC,
      TenDoanhNghiep: record.TenDoanhNghiep,
      LoaiDoanhNghiep: record.LoaiDoanhNghiep,
      LinhVuc: record.LinhVuc,
      NguoiDaiDien: record.NguoiDaiDien,
      DienThoai: record.DienThoai,
      Email: record.Email,
      DiaChi: record.DiaChi,
      LoaiHoTro: record.LoaiHoTro,
      NoiDungYeuCau: record.NoiDungYeuCau,
      CanBoXuLy: record.CanBoXuLy,
      TrangThai: record.TrangThai,
      GiaTriHoTro: record.GiaTriHoTro,
      DanhGia: record.DanhGia || 0,
      KetQuaXuLy: record.KetQuaXuLy,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      MaYC: '',
      TenDoanhNghiep: '',
      LoaiDoanhNghiep: 'Hộ kinh doanh',
      LinhVuc: 'Bán lẻ',
      NguoiDaiDien: '',
      DienThoai: '',
      Email: '',
      DiaChi: '',
      LoaiHoTro: 'Tư vấn pháp lý',
      NoiDungYeuCau: '',
      CanBoXuLy: '',
      TrangThai: 'Chờ xử lý',
      GiaTriHoTro: 0,
      DanhGia: 0,
      KetQuaXuLy: '',
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
      case 'Hoàn thành':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'Đang xử lý':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'Chờ xử lý':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><HelpCircle className="w-3 h-3 mr-1" />Chờ xử lý</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSupportTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Tư vấn pháp lý': 'bg-purple-500/10 text-purple-700',
      'Hỗ trợ vốn': 'bg-green-500/10 text-green-700',
      'Tư vấn ATTP': 'bg-orange-500/10 text-orange-700',
      'Xúc tiến thương mại': 'bg-blue-500/10 text-blue-700',
      'Đào tạo nghề': 'bg-amber-500/10 text-amber-700',
      'Chuyển đổi số': 'bg-cyan-500/10 text-cyan-700',
    };
    return <Badge className={`${colors[type] || 'bg-gray-500/10 text-gray-700'} border-0`}>{type}</Badge>;
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case 'Doanh nghiệp vừa':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'Doanh nghiệp nhỏ':
        return <Building className="w-4 h-4 text-green-500" />;
      case 'Hợp tác xã':
        return <Users className="w-4 h-4 text-orange-500" />;
      default:
        return <Briefcase className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Hỗ trợ Doanh nghiệp nhỏ</h1>
              </div>
              <p className="text-white/90">Tư vấn, hỗ trợ DNNVV và hộ kinh doanh trên địa bàn</p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tiếp nhận yêu cầu
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Tổng yêu cầu</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-600">{stats.processing}</p>
              <p className="text-xs text-muted-foreground">Đang xử lý</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <HelpCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Chờ xử lý</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-600">{(stats.totalValue / 1000000).toFixed(0)}M</p>
              <p className="text-xs text-muted-foreground">Giá trị hỗ trợ</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.successRate}%</p>
              <p className="text-xs text-muted-foreground">Tỷ lệ thành công</p>
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
              placeholder="Tìm kiếm theo mã, tên DN, người đại diện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={supportTypeFilter} onValueChange={setSupportTypeFilter}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Loại hỗ trợ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="Tư vấn pháp lý">Tư vấn pháp lý</SelectItem>
              <SelectItem value="Hỗ trợ vốn">Hỗ trợ vốn</SelectItem>
              <SelectItem value="Tư vấn ATTP">Tư vấn ATTP</SelectItem>
              <SelectItem value="Xúc tiến thương mại">Xúc tiến TM</SelectItem>
              <SelectItem value="Đào tạo nghề">Đào tạo nghề</SelectItem>
              <SelectItem value="Chuyển đổi số">Chuyển đổi số</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
              <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
              <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
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
                <th className="text-left p-4 font-semibold">Mã YC</th>
                <th className="text-left p-4 font-semibold">Doanh nghiệp/Hộ KD</th>
                <th className="text-left p-4 font-semibold">Loại hỗ trợ</th>
                <th className="text-left p-4 font-semibold">Ngày tiếp nhận</th>
                <th className="text-left p-4 font-semibold">Cán bộ xử lý</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaHoTro} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.MaYC}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getBusinessTypeIcon(record.LoaiDoanhNghiep)}
                      <div>
                        <div className="font-medium">{record.TenDoanhNghiep}</div>
                        <div className="text-xs text-muted-foreground">{record.LinhVuc} • {record.LoaiDoanhNghiep}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{getSupportTypeBadge(record.LoaiHoTro)}</td>
                  <td className="p-4 text-muted-foreground">
                    {formatDate(record.NgayTiepNhan)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{record.CanBoXuLy}</span>
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
              <Briefcase className="w-5 h-5" />
              Chi tiết yêu cầu hỗ trợ
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRecord?.MaYC}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  {getBusinessTypeIcon(selectedRecord.LoaiDoanhNghiep)}
                  Thông tin doanh nghiệp
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tên DN/Hộ KD</Label>
                    <p className="font-medium">{selectedRecord.TenDoanhNghiep}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại hình</Label>
                    <p className="font-medium">{selectedRecord.LoaiDoanhNghiep}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Lĩnh vực</Label>
                    <p className="font-medium">{selectedRecord.LinhVuc}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Người đại diện</Label>
                    <p className="font-medium">{selectedRecord.NguoiDaiDien}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                    <p className="font-medium">{selectedRecord.DienThoai}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="font-medium">{selectedRecord.Email}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Nội dung yêu cầu</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại hỗ trợ</Label>
                    <div>{getSupportTypeBadge(selectedRecord.LoaiHoTro)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Trạng thái</Label>
                    <div>{getStatusBadge(selectedRecord.TrangThai)}</div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Nội dung yêu cầu</Label>
                    <p className="font-medium">{selectedRecord.NoiDungYeuCau}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <Calendar className="w-4 h-4 mx-auto mb-1 text-slate-600" />
                  <p className="text-sm font-medium">{formatDate(selectedRecord.NgayTiepNhan)}</p>
                  <p className="text-xs text-muted-foreground">Ngày tiếp nhận</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg text-center">
                  <Calendar className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <p className="text-sm font-medium">{formatDate(selectedRecord.NgayHenTra)}</p>
                  <p className="text-xs text-muted-foreground">Hẹn trả</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  <p className="text-sm font-medium">{selectedRecord.NgayHoanThanh ? formatDate(selectedRecord.NgayHoanThanh) : '-'}</p>
                  <p className="text-xs text-muted-foreground">Hoàn thành</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Xử lý</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Cán bộ xử lý</Label>
                    <p className="font-medium">{selectedRecord.CanBoXuLy}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Giá trị hỗ trợ</Label>
                    <p className="font-medium text-green-600">{selectedRecord.GiaTriHoTro > 0 ? formatCurrency(selectedRecord.GiaTriHoTro) : '-'}</p>
                  </div>
                  {selectedRecord.KetQuaXuLy && (
                    <div className="space-y-1 col-span-2">
                      <Label className="text-muted-foreground text-xs">Kết quả xử lý</Label>
                      <p className="font-medium">{selectedRecord.KetQuaXuLy}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRecord.DanhGia && (
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground text-xs">Đánh giá:</Label>
                  <div className="flex">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={`text-xl ${star <= selectedRecord.DanhGia! ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
              )}

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
              Cập nhật yêu cầu hỗ trợ
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Thông tin doanh nghiệp</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên DN/Hộ KD</Label>
                  <Input
                    value={formData.TenDoanhNghiep}
                    onChange={(e) => setFormData({...formData, TenDoanhNghiep: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loại hình</Label>
                  <Select value={formData.LoaiDoanhNghiep} onValueChange={(v) => setFormData({...formData, LoaiDoanhNghiep: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hộ kinh doanh">Hộ kinh doanh</SelectItem>
                      <SelectItem value="Doanh nghiệp nhỏ">Doanh nghiệp nhỏ</SelectItem>
                      <SelectItem value="Doanh nghiệp vừa">Doanh nghiệp vừa</SelectItem>
                      <SelectItem value="Hợp tác xã">Hợp tác xã</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lĩnh vực</Label>
                  <Select value={formData.LinhVuc} onValueChange={(v) => setFormData({...formData, LinhVuc: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bán lẻ">Bán lẻ</SelectItem>
                      <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                      <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
                      <SelectItem value="Dịch vụ ăn uống">Dịch vụ ăn uống</SelectItem>
                      <SelectItem value="Thương mại">Thương mại</SelectItem>
                      <SelectItem value="Nông nghiệp">Nông nghiệp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Người đại diện</Label>
                  <Input
                    value={formData.NguoiDaiDien}
                    onChange={(e) => setFormData({...formData, NguoiDaiDien: e.target.value})}
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
                    type="email"
                    value={formData.Email}
                    onChange={(e) => setFormData({...formData, Email: e.target.value})}
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

            <div className="bg-cyan-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Nội dung yêu cầu</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại hỗ trợ</Label>
                  <Select value={formData.LoaiHoTro} onValueChange={(v) => setFormData({...formData, LoaiHoTro: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tư vấn pháp lý">Tư vấn pháp lý</SelectItem>
                      <SelectItem value="Hỗ trợ vốn">Hỗ trợ vốn</SelectItem>
                      <SelectItem value="Tư vấn ATTP">Tư vấn ATTP</SelectItem>
                      <SelectItem value="Xúc tiến thương mại">Xúc tiến thương mại</SelectItem>
                      <SelectItem value="Đào tạo nghề">Đào tạo nghề</SelectItem>
                      <SelectItem value="Chuyển đổi số">Chuyển đổi số</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Nội dung yêu cầu</Label>
                <Textarea
                  value={formData.NoiDungYeuCau}
                  onChange={(e) => setFormData({...formData, NoiDungYeuCau: e.target.value})}
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Xử lý</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cán bộ xử lý</Label>
                  <Input
                    value={formData.CanBoXuLy}
                    onChange={(e) => setFormData({...formData, CanBoXuLy: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                      <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                      <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Giá trị hỗ trợ (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.GiaTriHoTro}
                    onChange={(e) => setFormData({...formData, GiaTriHoTro: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đánh giá (1-5 sao)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.DanhGia}
                    onChange={(e) => setFormData({...formData, DanhGia: Number(e.target.value)})}
                    placeholder="Chưa đánh giá"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label>Kết quả xử lý</Label>
                <Textarea
                  value={formData.KetQuaXuLy}
                  onChange={(e) => setFormData({...formData, KetQuaXuLy: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="space-y-2 mt-4">
                <Label>Ghi chú</Label>
                <Textarea
                  value={formData.GhiChu}
                  onChange={(e) => setFormData({...formData, GhiChu: e.target.value})}
                  rows={2}
                />
              </div>
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
              Tiếp nhận yêu cầu hỗ trợ mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên DN/Hộ KD *</Label>
                <Input
                  value={formData.TenDoanhNghiep}
                  onChange={(e) => setFormData({...formData, TenDoanhNghiep: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Loại hình *</Label>
                <Select value={formData.LoaiDoanhNghiep} onValueChange={(v) => setFormData({...formData, LoaiDoanhNghiep: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hộ kinh doanh">Hộ kinh doanh</SelectItem>
                    <SelectItem value="Doanh nghiệp nhỏ">Doanh nghiệp nhỏ</SelectItem>
                    <SelectItem value="Doanh nghiệp vừa">Doanh nghiệp vừa</SelectItem>
                    <SelectItem value="Hợp tác xã">Hợp tác xã</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Người đại diện *</Label>
                <Input
                  value={formData.NguoiDaiDien}
                  onChange={(e) => setFormData({...formData, NguoiDaiDien: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Điện thoại *</Label>
                <Input
                  value={formData.DienThoai}
                  onChange={(e) => setFormData({...formData, DienThoai: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lĩnh vực</Label>
                <Select value={formData.LinhVuc} onValueChange={(v) => setFormData({...formData, LinhVuc: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bán lẻ">Bán lẻ</SelectItem>
                    <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                    <SelectItem value="Dịch vụ">Dịch vụ</SelectItem>
                    <SelectItem value="Dịch vụ ăn uống">Dịch vụ ăn uống</SelectItem>
                    <SelectItem value="Thương mại">Thương mại</SelectItem>
                    <SelectItem value="Nông nghiệp">Nông nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Loại hỗ trợ *</Label>
                <Select value={formData.LoaiHoTro} onValueChange={(v) => setFormData({...formData, LoaiHoTro: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tư vấn pháp lý">Tư vấn pháp lý</SelectItem>
                    <SelectItem value="Hỗ trợ vốn">Hỗ trợ vốn</SelectItem>
                    <SelectItem value="Tư vấn ATTP">Tư vấn ATTP</SelectItem>
                    <SelectItem value="Xúc tiến thương mại">Xúc tiến thương mại</SelectItem>
                    <SelectItem value="Đào tạo nghề">Đào tạo nghề</SelectItem>
                    <SelectItem value="Chuyển đổi số">Chuyển đổi số</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nội dung yêu cầu *</Label>
              <Textarea
                value={formData.NoiDungYeuCau}
                onChange={(e) => setFormData({...formData, NoiDungYeuCau: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input
                value={formData.DiaChi}
                onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold">Xử lý</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cán bộ xử lý</Label>
                  <Input
                    value={formData.CanBoXuLy}
                    onChange={(e) => setFormData({...formData, CanBoXuLy: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                      <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                      <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Giá trị hỗ trợ (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.GiaTriHoTro}
                    onChange={(e) => setFormData({...formData, GiaTriHoTro: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đánh giá (1-5 sao)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.DanhGia}
                    onChange={(e) => setFormData({...formData, DanhGia: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kết quả xử lý</Label>
                <Textarea
                  value={formData.KetQuaXuLy}
                  onChange={(e) => setFormData({...formData, KetQuaXuLy: e.target.value})}
                  rows={3}
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
