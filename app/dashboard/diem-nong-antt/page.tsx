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
  MapPin,
  Search,
  Plus,
  Download,
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Eye,
  Edit,
  X,
  Users,
  Calendar,
  MapPinned,
  Shield,
  Clock,
  Phone,
} from 'lucide-react';
import { formatDate } from '@/lib/mock-data';

// Mock data cho điểm nóng ANTT
const mockDiemNong = [
  {
    MaDiemNong: 1,
    MaDN: 'DN-001',
    TenDiaDiem: 'Quán Karaoke Happy Night',
    DiaChi: 'Số 45, Khu phố 1, Phường 1',
    LoaiDiaDiem: 'Cơ sở kinh doanh',
    LoaiViPham: 'Ma túy',
    MucDo: 'Cao',
    SoDoiTuong: 8,
    NgayPhatHien: '2024-01-15',
    NgayCapNhat: '2024-03-20',
    CanBoTheoDoi: 'Nguyễn Văn A',
    SoDienThoai: '0901234567',
    MoTa: 'Có dấu hiệu sử dụng và buôn bán ma túy',
    BienPhapXuLy: 'Kiểm tra đột xuất, phối hợp công an',
    TrangThai: 'Đang theo dõi',
    ToaDo: { lat: 10.8231, lng: 106.6297 },
    GhiChu: '',
  },
  {
    MaDiemNong: 2,
    MaDN: 'DN-002',
    TenDiaDiem: 'Khu nhà trọ Thanh Xuân',
    DiaChi: 'Hẻm 234, Khu phố 4, Phường 2',
    LoaiDiaDiem: 'Khu dân cư',
    LoaiViPham: 'Trộm cắp',
    MucDo: 'Trung bình',
    SoDoiTuong: 3,
    NgayPhatHien: '2024-02-10',
    NgayCapNhat: '2024-03-18',
    CanBoTheoDoi: 'Trần Văn B',
    SoDienThoai: '0912345678',
    MoTa: 'Thường xuyên xảy ra trộm cắp xe máy',
    BienPhapXuLy: 'Tăng cường tuần tra, lắp camera',
    TrangThai: 'Đang theo dõi',
    ToaDo: { lat: 10.8245, lng: 106.6312 },
    GhiChu: 'Đã lắp 2 camera',
  },
  {
    MaDiemNong: 3,
    MaDN: 'DN-003',
    TenDiaDiem: 'Ngã tư Đường 3 - Đường 5',
    DiaChi: 'Ngã tư Đường 3 và Đường 5, Khu phố 2',
    LoaiDiaDiem: 'Giao thông',
    LoaiViPham: 'TNGT',
    MucDo: 'Cao',
    SoDoiTuong: 0,
    NgayPhatHien: '2023-11-05',
    NgayCapNhat: '2024-03-15',
    CanBoTheoDoi: 'Lê Văn C',
    SoDienThoai: '0923456789',
    MoTa: 'Điểm đen TNGT, đã xảy ra 5 vụ trong 6 tháng',
    BienPhapXuLy: 'Lắp đèn tín hiệu, gờ giảm tốc',
    TrangThai: 'Đang xử lý',
    ToaDo: { lat: 10.8238, lng: 106.6305 },
    GhiChu: 'Đã trình UBND quận',
  },
  {
    MaDiemNong: 4,
    MaDN: 'DN-004',
    TenDiaDiem: 'Quán nhậu Hải Sản Đêm',
    DiaChi: 'Số 78, Đường Nguyễn Huệ, Phường 1',
    LoaiDiaDiem: 'Cơ sở kinh doanh',
    LoaiViPham: 'Đánh nhau',
    MucDo: 'Trung bình',
    SoDoiTuong: 5,
    NgayPhatHien: '2024-02-28',
    NgayCapNhat: '2024-03-22',
    CanBoTheoDoi: 'Nguyễn Văn A',
    SoDienThoai: '0901234567',
    MoTa: 'Thường xảy ra xô xát sau 22h',
    BienPhapXuLy: 'Yêu cầu đóng cửa trước 23h',
    TrangThai: 'Đang theo dõi',
    ToaDo: { lat: 10.8250, lng: 106.6320 },
    GhiChu: '',
  },
  {
    MaDiemNong: 5,
    MaDN: 'DN-005',
    TenDiaDiem: 'Công viên Khu phố 3',
    DiaChi: 'Công viên trung tâm, Khu phố 3',
    LoaiDiaDiem: 'Công cộng',
    LoaiViPham: 'Cướp giật',
    MucDo: 'Cao',
    SoDoiTuong: 4,
    NgayPhatHien: '2024-01-20',
    NgayCapNhat: '2024-03-25',
    CanBoTheoDoi: 'Phạm Văn D',
    SoDienThoai: '0934567890',
    MoTa: 'Cướp giật tài sản vào ban đêm',
    BienPhapXuLy: 'Tăng cường chiếu sáng, tuần tra',
    TrangThai: 'Đang xử lý',
    ToaDo: { lat: 10.8260, lng: 106.6330 },
    GhiChu: 'Đang thi công lắp đèn',
  },
  {
    MaDiemNong: 6,
    MaDN: 'DN-006',
    TenDiaDiem: 'Tiệm game online ABC',
    DiaChi: 'Số 123, Đường Lê Lợi, Phường 2',
    LoaiDiaDiem: 'Cơ sở kinh doanh',
    LoaiViPham: 'Cờ bạc',
    MucDo: 'Thấp',
    SoDoiTuong: 2,
    NgayPhatHien: '2024-03-01',
    NgayCapNhat: '2024-03-20',
    CanBoTheoDoi: 'Trần Văn B',
    SoDienThoai: '0912345678',
    MoTa: 'Nghi vấn tổ chức cờ bạc trực tuyến',
    BienPhapXuLy: 'Theo dõi, thu thập chứng cứ',
    TrangThai: 'Đang theo dõi',
    ToaDo: { lat: 10.8270, lng: 106.6340 },
    GhiChu: '',
  },
  {
    MaDiemNong: 7,
    MaDN: 'DN-007',
    TenDiaDiem: 'Bãi đất trống Khu phố 5',
    DiaChi: 'Bãi đất trống gần cầu, Khu phố 5',
    LoaiDiaDiem: 'Bãi trống',
    LoaiViPham: 'Tệ nạn xã hội',
    MucDo: 'Trung bình',
    SoDoiTuong: 6,
    NgayPhatHien: '2024-02-15',
    NgayCapNhat: '2024-03-18',
    CanBoTheoDoi: 'Lê Văn C',
    SoDienThoai: '0923456789',
    MoTa: 'Tụ tập thanh niên hút chích',
    BienPhapXuLy: 'Rào chắn, vận động cai nghiện',
    TrangThai: 'Đã xử lý',
    ToaDo: { lat: 10.8280, lng: 106.6350 },
    GhiChu: 'Đã rào chắn khu vực',
  },
  {
    MaDiemNong: 8,
    MaDN: 'DN-008',
    TenDiaDiem: 'Chợ tự phát Đường 7',
    DiaChi: 'Đoạn đường 7, gần trường học',
    LoaiDiaDiem: 'Chợ',
    LoaiViPham: 'Móc túi',
    MucDo: 'Thấp',
    SoDoiTuong: 3,
    NgayPhatHien: '2024-03-05',
    NgayCapNhat: '2024-03-22',
    CanBoTheoDoi: 'Phạm Văn D',
    SoDienThoai: '0934567890',
    MoTa: 'Có hiện tượng móc túi vào giờ tan trường',
    BienPhapXuLy: 'Tuần tra theo giờ cao điểm',
    TrangThai: 'Đang theo dõi',
    ToaDo: { lat: 10.8290, lng: 106.6360 },
    GhiChu: '',
  },
];

interface DiemNong {
  MaDiemNong: number;
  MaDN: string;
  TenDiaDiem: string;
  DiaChi: string;
  LoaiDiaDiem: string;
  LoaiViPham: string;
  MucDo: string;
  SoDoiTuong: number;
  NgayPhatHien: string;
  NgayCapNhat: string;
  CanBoTheoDoi: string;
  SoDienThoai: string;
  MoTa: string;
  BienPhapXuLy: string;
  TrangThai: string;
  ToaDo: { lat: number; lng: number };
  GhiChu: string;
}

export default function DiemNongANTTPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DiemNong | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaDN: '',
    TenDiaDiem: '',
    DiaChi: '',
    NgayPhatHien: '',
    NgayCapNhat: '',
    ToaDoLat: '',
    ToaDoLng: '',
    LoaiDiaDiem: 'Cơ sở kinh doanh',
    LoaiViPham: 'Trộm cắp',
    MucDo: 'Trung bình',
    SoDoiTuong: 0,
    CanBoTheoDoi: '',
    SoDienThoai: '',
    MoTa: '',
    BienPhapXuLy: '',
    TrangThai: 'Đang theo dõi',
    GhiChu: '',
  });

  // Filter data
  const filteredData = mockDiemNong.filter((item) => {
    const matchSearch = 
      item.MaDN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenDiaDiem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchLevel = levelFilter === 'all' || item.MucDo === levelFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchLevel && matchStatus;
  });

  // Stats
  const stats = {
    total: mockDiemNong.length,
    high: mockDiemNong.filter(d => d.MucDo === 'Cao').length,
    medium: mockDiemNong.filter(d => d.MucDo === 'Trung bình').length,
    low: mockDiemNong.filter(d => d.MucDo === 'Thấp').length,
    totalObjects: mockDiemNong.reduce((sum, d) => sum + d.SoDoiTuong, 0),
    resolved: mockDiemNong.filter(d => d.TrangThai === 'Đã xử lý').length,
  };

  // Handlers
  const handleView = (record: DiemNong) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: DiemNong) => {
    setSelectedRecord(record);
    setFormData({
      MaDN: record.MaDN,
      TenDiaDiem: record.TenDiaDiem,
      DiaChi: record.DiaChi,
      NgayPhatHien: record.NgayPhatHien,
      NgayCapNhat: record.NgayCapNhat,
      ToaDoLat: String(record.ToaDo.lat),
      ToaDoLng: String(record.ToaDo.lng),
      LoaiDiaDiem: record.LoaiDiaDiem,
      LoaiViPham: record.LoaiViPham,
      MucDo: record.MucDo,
      SoDoiTuong: record.SoDoiTuong,
      CanBoTheoDoi: record.CanBoTheoDoi,
      SoDienThoai: record.SoDienThoai,
      MoTa: record.MoTa,
      BienPhapXuLy: record.BienPhapXuLy,
      TrangThai: record.TrangThai,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      MaDN: '',
      TenDiaDiem: '',
      DiaChi: '',
      NgayPhatHien: '',
      NgayCapNhat: '',
      ToaDoLat: '',
      ToaDoLng: '',
      LoaiDiaDiem: 'Cơ sở kinh doanh',
      LoaiViPham: 'Trộm cắp',
      MucDo: 'Trung bình',
      SoDoiTuong: 0,
      CanBoTheoDoi: '',
      SoDienThoai: '',
      MoTa: '',
      BienPhapXuLy: '',
      TrangThai: 'Đang theo dõi',
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
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Cao':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><ShieldAlert className="w-3 h-3 mr-1" />Cao</Badge>;
      case 'Trung bình':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><AlertTriangle className="w-3 h-3 mr-1" />Trung bình</Badge>;
      case 'Thấp':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><AlertCircle className="w-3 h-3 mr-1" />Thấp</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đang theo dõi':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><Eye className="w-3 h-3 mr-1" />Theo dõi</Badge>;
      case 'Đang xử lý':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'Đã xử lý':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Đã xử lý</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-danger via-primary to-status-danger p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Điểm nóng An ninh Trật tự</h1>
              </div>
              <p className="text-white/90">Theo dõi và quản lý các địa điểm phức tạp về ANTT trên địa bàn</p>
            </div>
            <Button className="w-full 2xl:w-auto bg-white text-red-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm điểm nóng
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Tổng điểm nóng</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
              <p className="text-xs text-muted-foreground">Mức độ cao</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
              <p className="text-xs text-muted-foreground">Mức trung bình</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.low}</p>
              <p className="text-xs text-muted-foreground">Mức độ thấp</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.totalObjects}</p>
              <p className="text-xs text-muted-foreground">Đối tượng theo dõi</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-xs text-muted-foreground">Đã xử lý</p>
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
              placeholder="Tìm kiếm theo mã, tên địa điểm, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              <SelectItem value="Cao">Cao</SelectItem>
              <SelectItem value="Trung bình">Trung bình</SelectItem>
              <SelectItem value="Thấp">Thấp</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Đang theo dõi">Đang theo dõi</SelectItem>
              <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
              <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
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
                <th className="text-left p-4 font-semibold">Mã</th>
                <th className="text-left p-4 font-semibold">Địa điểm</th>
                <th className="text-left p-4 font-semibold">Loại vi phạm</th>
                <th className="text-center p-4 font-semibold">Đối tượng</th>
                <th className="text-left p-4 font-semibold">Mức độ</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaDiemNong} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.MaDN}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2">
                      <MapPinned className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <div>
                        <div className="font-medium">{record.TenDiaDiem}</div>
                        <div className="text-xs text-muted-foreground">{record.DiaChi}</div>
                        <Badge variant="outline" className="mt-1 text-xs">{record.LoaiDiaDiem}</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="font-medium">{record.LoaiViPham}</span>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{record.MoTa}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold">{record.SoDoiTuong}</span>
                    </div>
                  </td>
                  <td className="p-4">{getLevelBadge(record.MucDo)}</td>
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
              <MapPin className="w-5 h-5" />
              Chi tiết điểm nóng ANTT
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRecord?.MaDN}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPinned className="w-4 h-4" />
                  Thông tin địa điểm
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Tên địa điểm</Label>
                    <p className="font-medium">{selectedRecord.TenDiaDiem}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại địa điểm</Label>
                    <Badge variant="outline">{selectedRecord.LoaiDiaDiem}</Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Tọa độ</Label>
                    <p className="font-mono text-xs">{selectedRecord.ToaDo.lat}, {selectedRecord.ToaDo.lng}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="mb-1">{getLevelBadge(selectedRecord.MucDo)}</div>
                  <p className="text-xs text-muted-foreground">Mức độ</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedRecord.SoDoiTuong}</p>
                  <p className="text-xs text-muted-foreground">Đối tượng</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="mb-1">{getStatusBadge(selectedRecord.TrangThai)}</div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Thông tin vi phạm</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại vi phạm</Label>
                    <p className="font-medium">{selectedRecord.LoaiViPham}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Mô tả</Label>
                    <p className="font-medium">{selectedRecord.MoTa}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Biện pháp xử lý</Label>
                    <p className="font-medium bg-yellow-50 p-2 rounded">{selectedRecord.BienPhapXuLy}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Ngày phát hiện</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedRecord.NgayPhatHien)}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Cập nhật lần cuối</Label>
                  <p className="font-medium">{formatDate(selectedRecord.NgayCapNhat)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Cán bộ theo dõi</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {selectedRecord.CanBoTheoDoi}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Điện thoại</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {selectedRecord.SoDienThoai}
                  </p>
                </div>
              </div>

              {selectedRecord.GhiChu && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Ghi chú</Label>
                  <p className="font-medium bg-blue-50 p-3 rounded-lg">{selectedRecord.GhiChu}</p>
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
              Cập nhật điểm nóng ANTT
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên địa điểm *</Label>
                <Input
                  value={formData.TenDiaDiem}
                  onChange={(e) => setFormData({...formData, TenDiaDiem: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Loại địa điểm</Label>
                <Select value={formData.LoaiDiaDiem} onValueChange={(v) => setFormData({...formData, LoaiDiaDiem: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cơ sở kinh doanh">Cơ sở kinh doanh</SelectItem>
                    <SelectItem value="Khu dân cư">Khu dân cư</SelectItem>
                    <SelectItem value="Công cộng">Công cộng</SelectItem>
                    <SelectItem value="Giao thông">Giao thông</SelectItem>
                    <SelectItem value="Chợ">Chợ</SelectItem>
                    <SelectItem value="Bãi trống">Bãi trống</SelectItem>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày phát hiện</Label>
                <Input
                  type="date"
                  value={formData.NgayPhatHien}
                  onChange={(e) => setFormData({...formData, NgayPhatHien: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày cập nhật</Label>
                <Input
                  type="date"
                  value={formData.NgayCapNhat}
                  onChange={(e) => setFormData({...formData, NgayCapNhat: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vĩ độ</Label>
                <Input
                  value={formData.ToaDoLat}
                  onChange={(e) => setFormData({...formData, ToaDoLat: e.target.value})}
                  placeholder="VD: 10.8231"
                />
              </div>
              <div className="space-y-2">
                <Label>Kinh độ</Label>
                <Input
                  value={formData.ToaDoLng}
                  onChange={(e) => setFormData({...formData, ToaDoLng: e.target.value})}
                  placeholder="VD: 106.6297"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại vi phạm</Label>
                <Select value={formData.LoaiViPham} onValueChange={(v) => setFormData({...formData, LoaiViPham: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ma túy">Ma túy</SelectItem>
                    <SelectItem value="Trộm cắp">Trộm cắp</SelectItem>
                    <SelectItem value="Cướp giật">Cướp giật</SelectItem>
                    <SelectItem value="Đánh nhau">Đánh nhau</SelectItem>
                    <SelectItem value="Cờ bạc">Cờ bạc</SelectItem>
                    <SelectItem value="TNGT">TNGT</SelectItem>
                    <SelectItem value="Tệ nạn xã hội">Tệ nạn xã hội</SelectItem>
                    <SelectItem value="Móc túi">Móc túi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mức độ</Label>
                <Select value={formData.MucDo} onValueChange={(v) => setFormData({...formData, MucDo: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cao">Cao</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Thấp">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả tình hình</Label>
              <Textarea
                value={formData.MoTa}
                onChange={(e) => setFormData({...formData, MoTa: e.target.value})}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số đối tượng</Label>
                <Input
                  type="number"
                  value={formData.SoDoiTuong}
                  onChange={(e) => setFormData({...formData, SoDoiTuong: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang theo dõi">Đang theo dõi</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cán bộ theo dõi</Label>
                <Input
                  value={formData.CanBoTheoDoi}
                  onChange={(e) => setFormData({...formData, CanBoTheoDoi: e.target.value})}
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
            <div className="space-y-2">
              <Label>Biện pháp xử lý</Label>
              <Textarea
                value={formData.BienPhapXuLy}
                onChange={(e) => setFormData({...formData, BienPhapXuLy: e.target.value})}
                rows={2}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm điểm nóng ANTT mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã điểm nóng *</Label>
                <Input
                  value={formData.MaDN}
                  onChange={(e) => setFormData({...formData, MaDN: e.target.value})}
                  placeholder="VD: DN-009"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại địa điểm *</Label>
                <Select value={formData.LoaiDiaDiem} onValueChange={(v) => setFormData({...formData, LoaiDiaDiem: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cơ sở kinh doanh">Cơ sở kinh doanh</SelectItem>
                    <SelectItem value="Khu dân cư">Khu dân cư</SelectItem>
                    <SelectItem value="Công cộng">Công cộng</SelectItem>
                    <SelectItem value="Giao thông">Giao thông</SelectItem>
                    <SelectItem value="Chợ">Chợ</SelectItem>
                    <SelectItem value="Bãi trống">Bãi trống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tên địa điểm *</Label>
              <Input
                value={formData.TenDiaDiem}
                onChange={(e) => setFormData({...formData, TenDiaDiem: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ *</Label>
              <Input
                value={formData.DiaChi}
                onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày phát hiện</Label>
                <Input
                  type="date"
                  value={formData.NgayPhatHien}
                  onChange={(e) => setFormData({...formData, NgayPhatHien: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày cập nhật</Label>
                <Input
                  type="date"
                  value={formData.NgayCapNhat}
                  onChange={(e) => setFormData({...formData, NgayCapNhat: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vĩ độ</Label>
                <Input
                  value={formData.ToaDoLat}
                  onChange={(e) => setFormData({...formData, ToaDoLat: e.target.value})}
                  placeholder="VD: 10.8231"
                />
              </div>
              <div className="space-y-2">
                <Label>Kinh độ</Label>
                <Input
                  value={formData.ToaDoLng}
                  onChange={(e) => setFormData({...formData, ToaDoLng: e.target.value})}
                  placeholder="VD: 106.6297"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Loại vi phạm *</Label>
                <Select value={formData.LoaiViPham} onValueChange={(v) => setFormData({...formData, LoaiViPham: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ma túy">Ma túy</SelectItem>
                    <SelectItem value="Trộm cắp">Trộm cắp</SelectItem>
                    <SelectItem value="Cướp giật">Cướp giật</SelectItem>
                    <SelectItem value="Đánh nhau">Đánh nhau</SelectItem>
                    <SelectItem value="Cờ bạc">Cờ bạc</SelectItem>
                    <SelectItem value="TNGT">TNGT</SelectItem>
                    <SelectItem value="Tệ nạn xã hội">Tệ nạn xã hội</SelectItem>
                    <SelectItem value="Móc túi">Móc túi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mức độ *</Label>
                <Select value={formData.MucDo} onValueChange={(v) => setFormData({...formData, MucDo: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cao">Cao</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Thấp">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Số đối tượng</Label>
                <Input
                  type="number"
                  value={formData.SoDoiTuong}
                  onChange={(e) => setFormData({...formData, SoDoiTuong: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cán bộ theo dõi</Label>
                <Input
                  value={formData.CanBoTheoDoi}
                  onChange={(e) => setFormData({...formData, CanBoTheoDoi: e.target.value})}
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
            <div className="space-y-2">
              <Label>Mô tả tình hình</Label>
              <Textarea
                value={formData.MoTa}
                onChange={(e) => setFormData({...formData, MoTa: e.target.value})}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Biện pháp xử lý</Label>
              <Textarea
                value={formData.BienPhapXuLy}
                onChange={(e) => setFormData({...formData, BienPhapXuLy: e.target.value})}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Trạng thái *</Label>
              <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đang theo dõi">Đang theo dõi</SelectItem>
                  <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                  <SelectItem value="Ổn định">Ổn định</SelectItem>
                </SelectContent>
              </Select>
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
