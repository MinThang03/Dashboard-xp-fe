'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  BarChart3,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Eye,
  Store,
  Factory,
  Palmtree,
  Users,
  Landmark,
  Wrench,
  CalendarRange,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Printer,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/mock-data';
import { thongKeKinhTeApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

// Mock data cho thống kê kinh tế
const mockThongKe = [
  {
    MaBaoCao: 1,
    MaBC: 'TK-2024-01',
    KyBaoCao: 'Tháng 01/2024',
    LoaiKy: 'Tháng',
    NgayBaoCao: '2024-02-05',
    NguoiLap: 'Nguyễn Văn A',
    TongHoKinhDoanh: 150,
    TongDoanhThu: 18500000000,
    TongThuNganSach: 1250000000,
    TangTruong: 8.5,
    SoLuongLaoDong: 2850,
    SoHoMoi: 5,
    SoHoNgung: 2,
    TrangThai: 'Đã duyệt',
  },
  {
    MaBaoCao: 2,
    MaBC: 'TK-2024-02',
    KyBaoCao: 'Tháng 02/2024',
    LoaiKy: 'Tháng',
    NgayBaoCao: '2024-03-05',
    NguoiLap: 'Nguyễn Văn A',
    TongHoKinhDoanh: 153,
    TongDoanhThu: 16800000000,
    TongThuNganSach: 1180000000,
    TangTruong: -3.2,
    SoLuongLaoDong: 2890,
    SoHoMoi: 4,
    SoHoNgung: 1,
    TrangThai: 'Đã duyệt',
  },
  {
    MaBaoCao: 3,
    MaBC: 'TK-2024-Q1',
    KyBaoCao: 'Quý I/2024',
    LoaiKy: 'Quý',
    NgayBaoCao: '2024-04-10',
    NguoiLap: 'Trần Thị B',
    TongHoKinhDoanh: 156,
    TongDoanhThu: 52500000000,
    TongThuNganSach: 3680000000,
    TangTruong: 12.5,
    SoLuongLaoDong: 2920,
    SoHoMoi: 12,
    SoHoNgung: 5,
    TrangThai: 'Đã duyệt',
  },
  {
    MaBaoCao: 4,
    MaBC: 'TK-2024-03',
    KyBaoCao: 'Tháng 03/2024',
    LoaiKy: 'Tháng',
    NgayBaoCao: '2024-04-05',
    NguoiLap: 'Nguyễn Văn A',
    TongHoKinhDoanh: 156,
    TongDoanhThu: 17200000000,
    TongThuNganSach: 1250000000,
    TangTruong: 2.4,
    SoLuongLaoDong: 2920,
    SoHoMoi: 3,
    SoHoNgung: 0,
    TrangThai: 'Đã duyệt',
  },
  {
    MaBaoCao: 5,
    MaBC: 'TK-2024-04',
    KyBaoCao: 'Tháng 04/2024',
    LoaiKy: 'Tháng',
    NgayBaoCao: '2024-05-05',
    NguoiLap: 'Nguyễn Văn A',
    TongHoKinhDoanh: 160,
    TongDoanhThu: 19800000000,
    TongThuNganSach: 1380000000,
    TangTruong: 15.1,
    SoLuongLaoDong: 2980,
    SoHoMoi: 5,
    SoHoNgung: 1,
    TrangThai: 'Chờ duyệt',
  },
  {
    MaBaoCao: 6,
    MaBC: 'TK-2023',
    KyBaoCao: 'Năm 2023',
    LoaiKy: 'Năm',
    NgayBaoCao: '2024-01-20',
    NguoiLap: 'Trần Thị B',
    TongHoKinhDoanh: 145,
    TongDoanhThu: 180000000000,
    TongThuNganSach: 12500000000,
    TangTruong: 10.2,
    SoLuongLaoDong: 2750,
    SoHoMoi: 25,
    SoHoNgung: 12,
    TrangThai: 'Đã duyệt',
  },
];

// Mock data tổng hợp theo ngành
const mockTheoNganh = [
  { Nganh: 'Thương mại/Bán lẻ', SoHo: 85, DoanhThu: 28500000000, TyLe: 55, icon: Store },
  { Nganh: 'Sản xuất/Gia công', SoHo: 25, DoanhThu: 15200000000, TyLe: 16, icon: Factory },
  { Nganh: 'Du lịch/Dịch vụ', SoHo: 28, DoanhThu: 12800000000, TyLe: 18, icon: Palmtree },
  { Nganh: 'Xây dựng', SoHo: 12, DoanhThu: 8500000000, TyLe: 8, icon: Landmark },
  { Nganh: 'Khác', SoHo: 10, DoanhThu: 2500000000, TyLe: 6, icon: Wrench },
];

interface ThongKe {
  MaBaoCao: number;
  MaBC: string;
  KyBaoCao: string;
  LoaiKy: string;
  NgayBaoCao: string;
  NguoiLap: string;
  TongHoKinhDoanh: number;
  TongDoanhThu: number;
  TongThuNganSach: number;
  TangTruong: number;
  SoLuongLaoDong: number;
  SoHoMoi: number;
  SoHoNgung: number;
  TrangThai: string;
}

export default function ThongKeKinhTePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [records, setRecords] = useState<ThongKe[]>([]);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ThongKe | null>(null);

  const loadData = async () => {
    const res = await thongKeKinhTeApi.getList({ page: 1, limit: 200 });
    if (res.success && Array.isArray((res as any).data)) {
      setRecords((res as any).data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dataSource = records.length > 0 ? records : mockThongKe;

  const normalizeText = (value: unknown) =>
    typeof value === 'string' ? value.toLowerCase() : String(value ?? '').toLowerCase();

  // Filter data
  const filteredData = dataSource.filter((item) => {
    const normalizedQuery = normalizeText(searchQuery);
    const matchSearch =
      normalizeText(item.MaBC).includes(normalizedQuery) ||
      normalizeText(item.KyBaoCao).includes(normalizedQuery);
    
    const matchPeriod = periodFilter === 'all' || item.LoaiKy === periodFilter;
    const matchStatus = statusFilter === 'all' || item.TrangThai === statusFilter;
    
    return matchSearch && matchPeriod && matchStatus;
  });

  // Tổng hợp stats
  const latestReport = dataSource.find(m => m.LoaiKy === 'Tháng' && m.TrangThai === 'Đã duyệt');
  const stats = {
    tongDoanhThu: latestReport?.TongDoanhThu || 0,
    tongHoKD: latestReport?.TongHoKinhDoanh || 0,
    tangTruong: latestReport?.TangTruong || 0,
    tongThuNganSach: latestReport?.TongThuNganSach || 0,
    tongLaoDong: latestReport?.SoLuongLaoDong || 0,
    soBaoCao: dataSource.length,
  };

  // Handlers
  const handleView = (record: ThongKe) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã duyệt':
        return <Badge className="bg-green-500/10 text-green-700 border-0">Đã duyệt</Badge>;
      case 'Chờ duyệt':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0">Chờ duyệt</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendClass = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Thống kê Kinh tế</h1>
              </div>
              <p className="text-white/90">Báo cáo tổng hợp hoạt động kinh tế - thương mại trên địa bàn</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <RefreshCw className="w-4 h-4 mr-2" />
                Cập nhật
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-white/90">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <FunctionStyledPanel
        title="Động lực kinh tế theo kỳ báo cáo"
        subtitle="Biểu đồ cột ngang tập trung vào quy mô doanh thu, tăng trưởng và nền tảng lao động"
        variant="eco-report"
        items={[
          { label: 'Doanh thu tỷ/tháng', value: Number((stats.tongDoanhThu / 1000000000).toFixed(1)), color: '#16a34a' },
          { label: 'Hộ kinh doanh', value: stats.tongHoKD, color: '#3b82f6' },
          { label: 'Tăng trưởng', value: Number(stats.tangTruong), color: stats.tangTruong >= 0 ? '#22c55e' : '#ef4444' },
          { label: 'Thu ngân sách tỷ', value: Number((stats.tongThuNganSach / 1000000000).toFixed(1)), color: '#9333ea' },
          { label: 'Lao động', value: stats.tongLaoDong, color: '#0ea5e9' },
          { label: 'Số báo cáo', value: stats.soBaoCao, color: '#6366f1' },
        ]}
      />

      {/* Thống kê theo ngành */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Factory className="w-5 h-5 text-purple-600" />
          Cơ cấu theo ngành kinh tế
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mockTheoNganh.map((nganh, idx) => {
            const IconComponent = nganh.icon;
            return (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <IconComponent className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-sm">{nganh.Nganh}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Số hộ:</span>
                    <span className="font-bold">{nganh.SoHo}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doanh thu:</span>
                    <span className="font-bold text-green-600">{(nganh.DoanhThu / 1000000000).toFixed(1)}B</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${nganh.TyLe}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-muted-foreground">{nganh.TyLe}% tổng thể</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm báo cáo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[150px] h-11">
              <SelectValue placeholder="Kỳ báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả kỳ</SelectItem>
              <SelectItem value="Tháng">Tháng</SelectItem>
              <SelectItem value="Quý">Quý</SelectItem>
              <SelectItem value="Năm">Năm</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
              <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11">
            <Printer className="w-4 h-4 mr-2" />
            In báo cáo
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Mã BC</th>
                <th className="text-left p-4 font-semibold">Kỳ báo cáo</th>
                <th className="text-right p-4 font-semibold">Hộ KD</th>
                <th className="text-right p-4 font-semibold">Doanh thu</th>
                <th className="text-right p-4 font-semibold">Thu NS</th>
                <th className="text-center p-4 font-semibold">Tăng trưởng</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.MaBaoCao} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary font-mono">{record.MaBC}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <CalendarRange className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{record.KyBaoCao}</div>
                        <div className="text-xs text-muted-foreground">
                          Lập: {formatDate(record.NgayBaoCao)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold">{record.TongHoKinhDoanh}</div>
                    <div className="text-xs text-muted-foreground">
                      +{record.SoHoMoi} / -{record.SoHoNgung}
                    </div>
                  </td>
                  <td className="p-4 text-right font-semibold text-green-600">
                    {formatCurrency(record.TongDoanhThu)}
                  </td>
                  <td className="p-4 text-right font-semibold text-purple-600">
                    {formatCurrency(record.TongThuNganSach)}
                  </td>
                  <td className="p-4 text-center">
                    <div className={`flex items-center justify-center gap-1 font-semibold ${getTrendClass(record.TangTruong)}`}>
                      {getTrendIcon(record.TangTruong)}
                      {record.TangTruong > 0 ? '+' : ''}{record.TangTruong}%
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4" />
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
              <BarChart3 className="w-5 h-5" />
              Chi tiết báo cáo kinh tế
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRecord?.MaBC} | {selectedRecord?.KyBaoCao}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CalendarRange className="w-4 h-4" />
                  Thông tin báo cáo
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Kỳ báo cáo</Label>
                    <p className="font-medium">{selectedRecord.KyBaoCao}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Loại kỳ</Label>
                    <Badge variant="outline">{selectedRecord.LoaiKy}</Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Ngày lập</Label>
                    <p className="font-medium">{formatDate(selectedRecord.NgayBaoCao)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Người lập</Label>
                    <p className="font-medium">{selectedRecord.NguoiLap}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedRecord.TongDoanhThu)}</p>
                  <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(selectedRecord.TongThuNganSach)}</p>
                  <p className="text-xs text-muted-foreground">Thu ngân sách</p>
                </div>
                <div className={`${selectedRecord.TangTruong >= 0 ? 'bg-green-50' : 'bg-red-50'} p-4 rounded-lg text-center`}>
                  <p className={`text-2xl font-bold ${getTrendClass(selectedRecord.TangTruong)}`}>
                    {selectedRecord.TangTruong > 0 ? '+' : ''}{selectedRecord.TangTruong}%
                  </p>
                  <p className="text-xs text-muted-foreground">Tăng trưởng</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Số liệu chi tiết</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Tổng hộ kinh doanh:</span>
                    <span className="font-bold">{selectedRecord.TongHoKinhDoanh}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Số lao động:</span>
                    <span className="font-bold">{selectedRecord.SoLuongLaoDong.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Hộ mở mới:</span>
                    <span className="font-bold text-green-600">+{selectedRecord.SoHoMoi}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Hộ ngừng hoạt động:</span>
                    <span className="font-bold text-red-600">-{selectedRecord.SoHoNgung}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground text-xs">Trạng thái:</Label>
                {getStatusBadge(selectedRecord.TrangThai)}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Đóng
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
