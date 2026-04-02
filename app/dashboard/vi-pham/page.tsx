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
  AlertTriangle,
  Search,
  Plus,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  X,
  FileText,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Gavel,
  FileCheck,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mock-data';
import { viPhamApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

// Mock data cho vi phạm
const mockViPham = [
  {
    MaViPham: 1,
    SoBienBan: 'VP-2024-001',
    LoaiViPham: 'VPHC công trình',
    NgayLap: '2024-01-15',
    DoiTuong: 'Nguyễn Văn A',
    CCCD: '079123456789',
    DiaChi: 'Số 45, Khu phố 1, Phường 1',
    NoiDungViPham: 'Xây dựng không phép tại lô đất số 123',
    DiaChiViPham: 'Lô đất số 123, Khu phố 1',
    CanCuPhapLy: 'NĐ 16/2022/NĐ-CP',
    MucPhat: 5000000,
    BieuMauXuLy: 'Buộc tháo dỡ công trình',
    ThoiHanKhacPhuc: '2024-02-15',
    CanBoLap: 'Trần Văn B',
    NguoiKy: 'Nguyễn Văn C',
    TrangThai: 'Đã xử lý',
    NgayXuLy: '2024-02-10',
    DaNopPhat: true,
    NgayNopPhat: '2024-02-08',
    GhiChu: '',
    TaiPham: false,
  },
  {
    MaViPham: 2,
    SoBienBan: 'VP-2024-002',
    LoaiViPham: 'VPHC trật tự đô thị',
    NgayLap: '2024-02-20',
    DoiTuong: 'Trần Thị B',
    CCCD: '079987654321',
    DiaChi: 'Số 78, Khu phố 2, Phường 2',
    NoiDungViPham: 'Lấn chiếm lòng lề đường để kinh doanh',
    DiaChiViPham: 'Đường Nguyễn Huệ, Khu phố 2',
    CanCuPhapLy: 'NĐ 100/2019/NĐ-CP',
    MucPhat: 2000000,
    BieuMauXuLy: 'Buộc khôi phục hiện trạng',
    ThoiHanKhacPhuc: '2024-03-05',
    CanBoLap: 'Lê Văn D',
    NguoiKy: 'Nguyễn Văn C',
    TrangThai: 'Đang xử lý',
    NgayXuLy: null,
    DaNopPhat: false,
    NgayNopPhat: null,
    GhiChu: 'Đối tượng xin gia hạn nộp phạt',
    TaiPham: false,
  },
  {
    MaViPham: 3,
    SoBienBan: 'VP-2024-003',
    LoaiViPham: 'VPHC vệ sinh môi trường',
    NgayLap: '2024-03-01',
    DoiTuong: 'Lê Văn C',
    CCCD: '079456789123',
    DiaChi: 'Số 56, Khu phố 3, Phường 1',
    NoiDungViPham: 'Xả rác thải không đúng nơi quy định',
    DiaChiViPham: 'Bãi đất trống Khu phố 3',
    CanCuPhapLy: 'NĐ 45/2022/NĐ-CP',
    MucPhat: 1000000,
    BieuMauXuLy: 'Cảnh cáo + Phạt tiền',
    ThoiHanKhacPhuc: '2024-03-10',
    CanBoLap: 'Trần Văn B',
    NguoiKy: 'Nguyễn Văn C',
    TrangThai: 'Đã xử lý',
    NgayXuLy: '2024-03-08',
    DaNopPhat: true,
    NgayNopPhat: '2024-03-06',
    GhiChu: '',
    TaiPham: false,
  },
  {
    MaViPham: 4,
    SoBienBan: 'VP-2024-004',
    LoaiViPham: 'VPHC an ninh trật tự',
    NgayLap: '2024-03-10',
    DoiTuong: 'Phạm Văn D',
    CCCD: '079789123456',
    DiaChi: 'Hẻm 234, Khu phố 4, Phường 2',
    NoiDungViPham: 'Gây mất trật tự công cộng, say rượu la hét',
    DiaChiViPham: 'Công viên Khu phố 4',
    CanCuPhapLy: 'NĐ 167/2013/NĐ-CP',
    MucPhat: 500000,
    BieuMauXuLy: 'Phạt tiền',
    ThoiHanKhacPhuc: null,
    CanBoLap: 'Lê Văn D',
    NguoiKy: 'Nguyễn Văn C',
    TrangThai: 'Đã xử lý',
    NgayXuLy: '2024-03-12',
    DaNopPhat: true,
    NgayNopPhat: '2024-03-11',
    GhiChu: '',
    TaiPham: true,
  },
  {
    MaViPham: 5,
    SoBienBan: 'VP-2024-005',
    LoaiViPham: 'VPHC kinh doanh',
    NgayLap: '2024-03-15',
    DoiTuong: 'Hoàng Thị E',
    CCCD: '079321654987',
    DiaChi: 'Số 100, Đường Lê Lợi, Phường 1',
    NoiDungViPham: 'Kinh doanh không có giấy phép',
    DiaChiViPham: 'Cửa hàng số 100, Đường Lê Lợi',
    CanCuPhapLy: 'NĐ 98/2020/NĐ-CP',
    MucPhat: 3000000,
    BieuMauXuLy: 'Phạt tiền + Buộc đăng ký kinh doanh',
    ThoiHanKhacPhuc: '2024-04-15',
    CanBoLap: 'Trần Văn B',
    NguoiKy: 'Nguyễn Văn C',
    TrangThai: 'Đang xử lý',
    NgayXuLy: null,
    DaNopPhat: true,
    NgayNopPhat: '2024-03-20',
    GhiChu: 'Đang hoàn tất thủ tục đăng ký kinh doanh',
    TaiPham: false,
  },
  {
    MaViPham: 6,
    SoBienBan: 'VP-2024-006',
    LoaiViPham: 'VPHC đất đai',
    NgayLap: '2024-03-20',
    DoiTuong: 'Võ Văn F',
    CCCD: '079654321789',
    DiaChi: 'Số 89, Khu phố 5, Phường 3',
    NoiDungViPham: 'Lấn chiếm đất công',
    DiaChiViPham: 'Bãi đất công Khu phố 5',
    CanCuPhapLy: 'NĐ 91/2019/NĐ-CP',
    MucPhat: 10000000,
    BieuMauXuLy: 'Phạt tiền + Buộc khôi phục hiện trạng',
    ThoiHanKhacPhuc: '2024-05-20',
    CanBoLap: 'Lê Văn D',
    NguoiKy: 'Nguyễn Văn C',
    TrangThai: 'Chờ xác minh',
    NgayXuLy: null,
    DaNopPhat: false,
    NgayNopPhat: null,
    GhiChu: 'Đang chờ kết quả đo đạc địa chính',
    TaiPham: false,
  },
  {
    MaViPham: 7,
    SoBienBan: 'VP-2024-007',
    LoaiViPham: 'VPHC trật tự đô thị',
    NgayLap: '2024-03-22',
    DoiTuong: 'Phạm Văn D',
    CCCD: '079789123456',
    DiaChi: 'Hẻm 234, Khu phố 4, Phường 2',
    NoiDungViPham: 'Đổ vật liệu xây dựng lấn chiếm đường',
    DiaChiViPham: 'Hẻm 234, Khu phố 4',
    CanCuPhapLy: 'NĐ 100/2019/NĐ-CP',
    MucPhat: 1500000,
    BieuMauXuLy: 'Phạt tiền + Buộc dọn dẹp',
    ThoiHanKhacPhuc: '2024-03-25',
    CanBoLap: 'Trần Văn B',
    NguoiKy: 'Nguyễn Văn C',
    TrangThai: 'Đã xử lý',
    NgayXuLy: '2024-03-24',
    DaNopPhat: true,
    NgayNopPhat: '2024-03-24',
    GhiChu: 'Tái phạm lần 2',
    TaiPham: true,
  },
];

interface ViPham {
  MaViPham: number;
  SoBienBan: string;
  LoaiViPham: string;
  NgayLap: string;
  DoiTuong: string;
  CCCD: string;
  DiaChi: string;
  NoiDungViPham: string;
  DiaChiViPham: string;
  CanCuPhapLy: string;
  MucPhat: number;
  BieuMauXuLy: string;
  ThoiHanKhacPhuc: string | null;
  CanBoLap: string;
  NguoiKy: string;
  TrangThai: string;
  NgayXuLy: string | null;
  DaNopPhat: boolean;
  NgayNopPhat: string | null;
  GhiChu: string;
  TaiPham: boolean;
}

export default function ViPhamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ViPham | null>(null);
  const [records, setRecords] = useState<ViPham[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    SoBienBan: '',
    NgayLap: new Date().toISOString().split('T')[0],
    LoaiViPham: 'VPHC công trình',
    DoiTuong: '',
    CCCD: '',
    DiaChi: '',
    NoiDungViPham: '',
    DiaChiViPham: '',
    CanCuPhapLy: '',
    MucPhat: 0,
    BieuMauXuLy: '',
    CanBoLap: '',
    NguoiKy: '',
    ThoiHanKhacPhuc: '',
    NgayXuLy: '',
    DaNopPhat: false,
    NgayNopPhat: '',
    TaiPham: false,
    TrangThai: 'Đang xử lý',
    GhiChu: '',
  });

  const loadData = async () => {
    const res = await viPhamApi.getList({ page: 1, limit: 200 });
    if (res.success && Array.isArray((res as any).data)) {
      setRecords((res as any).data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dataSource = records.length > 0 ? records : mockViPham;

  // Filter data
  const filteredData = dataSource.filter((item) => {
    const matchSearch = 
      item.SoBienBan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DoiTuong.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.NoiDungViPham.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchType = typeFilter === 'all' || item.LoaiViPham === typeFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchType && matchStatus;
  });

  // Stats
  const stats = {
    total: dataSource.length,
    processing: dataSource.filter(v => v.TrangThai === 'Đang xử lý').length,
    resolved: dataSource.filter(v => v.TrangThai === 'Đã xử lý').length,
    pending: dataSource.filter(v => v.TrangThai === 'Chờ xác minh').length,
    totalFine: dataSource.reduce((sum, v) => sum + (v.MucPhat || 0), 0),
    reoffend: dataSource.filter(v => v.TaiPham).length,
  };

  // Handlers
  const handleView = (record: ViPham) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleEdit = (record: ViPham) => {
    setSelectedRecord(record);
    setFormData({
      SoBienBan: record.SoBienBan,
      NgayLap: record.NgayLap,
      LoaiViPham: record.LoaiViPham,
      DoiTuong: record.DoiTuong,
      CCCD: record.CCCD,
      DiaChi: record.DiaChi,
      NoiDungViPham: record.NoiDungViPham,
      DiaChiViPham: record.DiaChiViPham,
      CanCuPhapLy: record.CanCuPhapLy,
      MucPhat: record.MucPhat,
      BieuMauXuLy: record.BieuMauXuLy,
      CanBoLap: record.CanBoLap,
      NguoiKy: record.NguoiKy,
      ThoiHanKhacPhuc: record.ThoiHanKhacPhuc || '',
      NgayXuLy: record.NgayXuLy || '',
      DaNopPhat: record.DaNopPhat,
      NgayNopPhat: record.NgayNopPhat || '',
      TaiPham: record.TaiPham,
      TrangThai: record.TrangThai,
      GhiChu: record.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setFormData({
      SoBienBan: '',
      NgayLap: new Date().toISOString().split('T')[0],
      LoaiViPham: 'VPHC công trình',
      DoiTuong: '',
      CCCD: '',
      DiaChi: '',
      NoiDungViPham: '',
      DiaChiViPham: '',
      CanCuPhapLy: '',
      MucPhat: 0,
      BieuMauXuLy: '',
      CanBoLap: '',
      NguoiKy: '',
      ThoiHanKhacPhuc: '',
      NgayXuLy: '',
      DaNopPhat: false,
      NgayNopPhat: '',
      TaiPham: false,
      TrangThai: 'Đang xử lý',
      GhiChu: '',
    });
    setAddDialogOpen(true);
  };

  const handleSave = async () => {
    if (selectedRecord?.MaViPham) {
      await viPhamApi.update(selectedRecord.MaViPham, formData);
    } else {
      await viPhamApi.create(formData);
    }
    await loadData();
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  const handleDelete = async (record: ViPham) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa biên bản ${record.SoBienBan}?`)) {
      return;
    }
    await viPhamApi.delete(record.MaViPham);
    await loadData();
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã xử lý':
        return <Badge className="bg-status-success/10 text-status-success border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Đã xử lý</Badge>;
      case 'Đang xử lý':
        return <Badge className="bg-status-warning/10 text-status-warning border-0"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'Chờ xác minh':
        return <Badge className="bg-secondary/10 text-secondary border-0"><Eye className="w-3 h-3 mr-1" />Chờ xác minh</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'VPHC công trình': 'bg-status-warning/10 text-status-warning',
      'VPHC trật tự đô thị': 'bg-secondary/10 text-secondary',
      'VPHC vệ sinh môi trường': 'bg-status-success/10 text-status-success',
      'VPHC an ninh trật tự': 'bg-status-danger/10 text-status-danger',
      'VPHC kinh doanh': 'bg-primary/10 text-primary',
      'VPHC đất đai': 'bg-accent/10 text-accent',
    };
    return <Badge className={`${colors[type] || 'bg-gray-500/10 text-gray-700'} border-0`}>{type}</Badge>;
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
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Hồ sơ Vi phạm</h1>
              </div>
              <p className="text-white/90">Quản lý biên bản vi phạm, xử phạt vi phạm hành chính</p>
            </div>
            <Button className="w-full 2xl:w-auto bg-white text-red-600 hover:bg-white/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Lập biên bản
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <FunctionStyledPanel
        title="Phổ vi phạm theo mức độ xử lý"
        subtitle="Biểu đồ phân tán cho thấy mật độ vụ việc và điểm nghẽn xử lý"
        variant="sec-violation"
        items={[
          { label: 'Tổng vụ việc', value: stats.total, color: '#ef4444' },
          { label: 'Đang xử lý', value: stats.processing, color: '#f59e0b' },
          { label: 'Đã xử lý', value: stats.resolved, color: '#22c55e' },
          { label: 'Chờ xác minh', value: stats.pending, color: '#3b82f6' },
          { label: 'Tiền phạt triệu', value: Number((stats.totalFine / 1000000).toFixed(0)), color: '#10b981' },
          { label: 'Tái phạm', value: stats.reoffend, color: '#e11d48' },
        ]}
      />

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo số biên bản, đối tượng, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px] h-11">
              <SelectValue placeholder="Loại vi phạm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="VPHC công trình">VPHC công trình</SelectItem>
              <SelectItem value="VPHC trật tự đô thị">VPHC trật tự đô thị</SelectItem>
              <SelectItem value="VPHC vệ sinh môi trường">VPHC vệ sinh MT</SelectItem>
              <SelectItem value="VPHC an ninh trật tự">VPHC an ninh TT</SelectItem>
              <SelectItem value="VPHC kinh doanh">VPHC kinh doanh</SelectItem>
              <SelectItem value="VPHC đất đai">VPHC đất đai</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
              <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
              <SelectItem value="Chờ xác minh">Chờ xác minh</SelectItem>
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
                <th className="text-left p-4 font-semibold">Số BB</th>
                <th className="text-left p-4 font-semibold">Loại vi phạm</th>
                <th className="text-left p-4 font-semibold">Đối tượng</th>
                <th className="text-left p-4 font-semibold">Nội dung</th>
                <th className="text-right p-4 font-semibold">Mức phạt</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaViPham} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-primary font-mono">{record.SoBienBan}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(record.NgayLap)}</p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {getTypeBadge(record.LoaiViPham)}
                      {record.TaiPham && (
                        <Badge className="bg-rose-500/10 text-rose-700 border-0 ml-1">
                          <RefreshCcw className="w-3 h-3 mr-1" />Tái phạm
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{record.DoiTuong}</div>
                        <div className="text-xs text-muted-foreground">{record.CCCD}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="line-clamp-2 text-sm">{record.NoiDungViPham}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />{record.DiaChiViPham}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-red-600">{formatCurrency(record.MucPhat)}</span>
                    {record.DaNopPhat ? (
                      <Badge className="bg-green-500/10 text-green-700 border-0 ml-2">
                        <CheckCircle2 className="w-3 h-3" />
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700 border-0 ml-2">
                        <XCircle className="w-3 h-3" />
                      </Badge>
                    )}
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
              <AlertTriangle className="w-5 h-5" />
              Chi tiết biên bản vi phạm
            </DialogTitle>
            <DialogDescription>
              Số BB: {selectedRecord?.SoBienBan}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Thông tin biên bản
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày lập</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayLap)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại vi phạm</Label>
                    <div>{getTypeBadge(selectedRecord.LoaiViPham)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Cán bộ lập</Label>
                    <p className="font-medium">{selectedRecord.CanBoLap}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Người ký</Label>
                    <p className="font-medium">{selectedRecord.NguoiKy}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin đối tượng vi phạm
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Họ tên</Label>
                    <p className="font-medium">{selectedRecord.DoiTuong}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">CCCD</Label>
                    <p className="font-mono">{selectedRecord.CCCD}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Địa chỉ</Label>
                    <p className="font-medium">{selectedRecord.DiaChi}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Nội dung vi phạm</Label>
                  <p className="font-medium bg-orange-50 p-3 rounded">{selectedRecord.NoiDungViPham}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Địa điểm vi phạm</Label>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedRecord.DiaChiViPham}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Căn cứ pháp lý</Label>
                  <p className="font-mono">{selectedRecord.CanCuPhapLy}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-xl font-bold text-red-600">{formatCurrency(selectedRecord.MucPhat)}</p>
                  <p className="text-xs text-muted-foreground">Mức phạt</p>
                </div>
                <div className={`p-3 rounded-lg text-center ${selectedRecord.DaNopPhat ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <p className={`text-sm font-bold ${selectedRecord.DaNopPhat ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedRecord.DaNopPhat ? 'Đã nộp phạt' : 'Chưa nộp phạt'}
                  </p>
                  {selectedRecord.NgayNopPhat && (
                    <p className="text-xs text-muted-foreground">{formatDate(selectedRecord.NgayNopPhat)}</p>
                  )}
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div>{getStatusBadge(selectedRecord.TrangThai)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Biện pháp xử lý</Label>
                <p className="font-medium bg-yellow-50 p-3 rounded flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  {selectedRecord.BieuMauXuLy}
                </p>
              </div>

              {selectedRecord.ThoiHanKhacPhuc && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Thời hạn khắc phục</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedRecord.ThoiHanKhacPhuc)}
                  </p>
                </div>
              )}

              {selectedRecord.TaiPham && (
                <Badge className="bg-rose-500/10 text-rose-700 border-0 w-fit">
                  <RefreshCcw className="w-3 h-3 mr-1" />Đối tượng tái phạm
                </Badge>
              )}

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
              <FileCheck className="w-4 h-4 mr-2" />
              In biên bản
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
              Cập nhật biên bản vi phạm
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại vi phạm</Label>
                <Select value={formData.LoaiViPham} onValueChange={(v) => setFormData({...formData, LoaiViPham: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VPHC công trình">VPHC công trình</SelectItem>
                    <SelectItem value="VPHC trật tự đô thị">VPHC trật tự đô thị</SelectItem>
                    <SelectItem value="VPHC vệ sinh môi trường">VPHC vệ sinh MT</SelectItem>
                    <SelectItem value="VPHC an ninh trật tự">VPHC an ninh TT</SelectItem>
                    <SelectItem value="VPHC kinh doanh">VPHC kinh doanh</SelectItem>
                    <SelectItem value="VPHC đất đai">VPHC đất đai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                    <SelectItem value="Chờ xác minh">Chờ xác minh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ngày lập biên bản</Label>
                <Input
                  type="date"
                  value={formData.NgayLap}
                  onChange={(e) => setFormData({ ...formData, NgayLap: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Thời hạn khắc phục</Label>
                <Input
                  type="date"
                  value={formData.ThoiHanKhacPhuc || ''}
                  onChange={(e) => setFormData({ ...formData, ThoiHanKhacPhuc: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày xử lý</Label>
                <Input
                  type="date"
                  value={formData.NgayXuLy || ''}
                  onChange={(e) => setFormData({ ...formData, NgayXuLy: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mức phạt (VNĐ)</Label>
              <Input
                type="number"
                value={formData.MucPhat}
                onChange={(e) => setFormData({...formData, MucPhat: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Biện pháp xử lý</Label>
              <Textarea
                value={formData.BieuMauXuLy}
                onChange={(e) => setFormData({...formData, BieuMauXuLy: e.target.value})}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Căn cứ pháp lý</Label>
                <Input
                  value={formData.CanCuPhapLy}
                  onChange={(e) => setFormData({ ...formData, CanCuPhapLy: e.target.value })}
                  placeholder="VD: NĐ 16/2022/NĐ-CP"
                />
              </div>
              <div className="space-y-2">
                <Label>Số biên bản</Label>
                <Input
                  value={formData.SoBienBan}
                  onChange={(e) => setFormData({ ...formData, SoBienBan: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cán bộ lập</Label>
                <Input
                  value={formData.CanBoLap}
                  onChange={(e) => setFormData({ ...formData, CanBoLap: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Người ký</Label>
                <Input
                  value={formData.NguoiKy}
                  onChange={(e) => setFormData({ ...formData, NguoiKy: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đã nộp phạt?</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.DaNopPhat}
                    onChange={(e) => setFormData({ ...formData, DaNopPhat: e.target.checked })}
                  />
                  <span>Đánh dấu đã thu phạt</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ngày nộp phạt</Label>
                <Input
                  type="date"
                  value={formData.NgayNopPhat || ''}
                  onChange={(e) => setFormData({ ...formData, NgayNopPhat: e.target.value })}
                  disabled={!formData.DaNopPhat}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đối tượng tái phạm?</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.TaiPham}
                    onChange={(e) => setFormData({ ...formData, TaiPham: e.target.checked })}
                  />
                  <span>Đánh dấu tái phạm</span>
                </div>
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
              Lập biên bản vi phạm mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số biên bản *</Label>
                <Input
                  value={formData.SoBienBan}
                  onChange={(e) => setFormData({...formData, SoBienBan: e.target.value})}
                  placeholder="VD: VP-2024-008"
                />
              </div>
              <div className="space-y-2">
                <Label>Loại vi phạm *</Label>
                <Select value={formData.LoaiViPham} onValueChange={(v) => setFormData({...formData, LoaiViPham: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VPHC công trình">VPHC công trình</SelectItem>
                    <SelectItem value="VPHC trật tự đô thị">VPHC trật tự đô thị</SelectItem>
                    <SelectItem value="VPHC vệ sinh môi trường">VPHC vệ sinh MT</SelectItem>
                    <SelectItem value="VPHC an ninh trật tự">VPHC an ninh TT</SelectItem>
                    <SelectItem value="VPHC kinh doanh">VPHC kinh doanh</SelectItem>
                    <SelectItem value="VPHC đất đai">VPHC đất đai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ngày lập biên bản</Label>
                <Input
                  type="date"
                  value={formData.NgayLap}
                  onChange={(e) => setFormData({ ...formData, NgayLap: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Thời hạn khắc phục</Label>
                <Input
                  type="date"
                  value={formData.ThoiHanKhacPhuc || ''}
                  onChange={(e) => setFormData({ ...formData, ThoiHanKhacPhuc: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày xử lý</Label>
                <Input
                  type="date"
                  value={formData.NgayXuLy || ''}
                  onChange={(e) => setFormData({ ...formData, NgayXuLy: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đối tượng vi phạm *</Label>
                <Input
                  value={formData.DoiTuong}
                  onChange={(e) => setFormData({...formData, DoiTuong: e.target.value})}
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
            <div className="space-y-2">
              <Label>Địa chỉ đối tượng</Label>
              <Input
                value={formData.DiaChi}
                onChange={(e) => setFormData({...formData, DiaChi: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Nội dung vi phạm *</Label>
              <Textarea
                value={formData.NoiDungViPham}
                onChange={(e) => setFormData({...formData, NoiDungViPham: e.target.value})}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa điểm vi phạm</Label>
              <Input
                value={formData.DiaChiViPham}
                onChange={(e) => setFormData({...formData, DiaChiViPham: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Căn cứ pháp lý</Label>
                <Input
                  value={formData.CanCuPhapLy}
                  onChange={(e) => setFormData({...formData, CanCuPhapLy: e.target.value})}
                  placeholder="VD: NĐ 16/2022/NĐ-CP"
                />
              </div>
              <div className="space-y-2">
                <Label>Mức phạt (VNĐ) *</Label>
                <Input
                  type="number"
                  value={formData.MucPhat}
                  onChange={(e) => setFormData({...formData, MucPhat: parseInt(e.target.value) || 0})}
                  placeholder="Nhập số tiền phạt"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Biện pháp xử lý</Label>
                <Textarea
                  value={formData.BieuMauXuLy}
                  onChange={(e) => setFormData({...formData, BieuMauXuLy: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.TrangThai} onValueChange={(v) => setFormData({...formData, TrangThai: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                    <SelectItem value="Chờ xác minh">Chờ xác minh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cán bộ lập</Label>
                <Input
                  value={formData.CanBoLap}
                  onChange={(e) => setFormData({ ...formData, CanBoLap: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Người ký</Label>
                <Input
                  value={formData.NguoiKy}
                  onChange={(e) => setFormData({ ...formData, NguoiKy: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đã nộp phạt?</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.DaNopPhat}
                    onChange={(e) => setFormData({ ...formData, DaNopPhat: e.target.checked })}
                  />
                  <span>Đánh dấu đã thu phạt</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ngày nộp phạt</Label>
                <Input
                  type="date"
                  value={formData.NgayNopPhat || ''}
                  onChange={(e) => setFormData({ ...formData, NgayNopPhat: e.target.value })}
                  disabled={!formData.DaNopPhat}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đối tượng tái phạm?</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.TaiPham}
                    onChange={(e) => setFormData({ ...formData, TaiPham: e.target.checked })}
                  />
                  <span>Đánh dấu tái phạm</span>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm vi phạm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
