'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, AlertTriangle, TrendingUp, BarChart3, Search, Plus, Download, Eye, Edit,
  MapPin, Brain, ShieldAlert, Lightbulb, AlertCircle, CheckCircle2
} from 'lucide-react';

// Mock data phân tích rủi ro quy hoạch
interface RuiRoQuyHoach {
  MaPhanTich: string;
  KhuVuc: string;
  DiaChi: string;
  MaThua: string;
  SoTo: string;
  LoaiRuiRo: string;
  MucDoRuiRo: string;
  XacSuat: number;
  DoTinCayAI: number;
  MoTaRuiRo: string;
  NguyenNhan: string;
  KhuyenNghiAI: string;
  TrangThai: string;
  NgayPhanTich: string;
  NgayCapNhat: string;
  GhiChu: string;
}

const mockRuiRo: RuiRoQuyHoach[] = [
  {
    MaPhanTich: 'RRQH001',
    KhuVuc: 'Khu dân cư A - Phường 1',
    DiaChi: 'Đường ABC, Phường 1',
    MaThua: '100-150',
    SoTo: '45',
    LoaiRuiRo: 'Ngập lụt',
    MucDoRuiRo: 'Cao',
    XacSuat: 87,
    DoTinCayAI: 94,
    MoTaRuiRo: 'Khu vực trũng, nằm gần sông, hệ thống thoát nước kém',
    NguyenNhan: 'Địa hình thấp, mật độ xây dựng cao làm giảm thấm nước',
    KhuyenNghiAI: 'Nâng cấp hệ thống thoát nước, hạn chế cấp phép xây dựng mới, xây hồ điều tiết',
    TrangThai: 'Đang theo dõi',
    NgayPhanTich: '2025-01-10',
    NgayCapNhat: '2025-01-14',
    GhiChu: 'Đã xảy ra ngập 3 lần trong năm 2024'
  },
  {
    MaPhanTich: 'RRQH002',
    KhuVuc: 'Khu B - Phường 2',
    DiaChi: 'Đường DEF, Phường 2',
    MaThua: '200-250',
    SoTo: '67',
    LoaiRuiRo: 'Sạt lở',
    MucDoRuiRo: 'Trung bình',
    XacSuat: 65,
    DoTinCayAI: 88,
    MoTaRuiRo: 'Khu vực đồi, độ dốc cao, đất yếu',
    NguyenNhan: 'Mưa lớn kéo dài, xây dựng không theo quy chuẩn',
    KhuyenNghiAI: 'Kiểm tra gia cố nền móng, trồng cây chống xói mòn, hạn chế đào đất',
    TrangThai: 'Cần xử lý',
    NgayPhanTich: '2025-01-08',
    NgayCapNhat: '2025-01-12',
    GhiChu: ''
  },
  {
    MaPhanTich: 'RRQH003',
    KhuVuc: 'Khu C - Xã 3',
    DiaChi: 'Thôn 1, Xã 3',
    MaThua: '300-400',
    SoTo: '89',
    LoaiRuiRo: 'Tranh chấp đất',
    MucDoRuiRo: 'Thấp',
    XacSuat: 32,
    DoTinCayAI: 79,
    MoTaRuiRo: 'Khu vực có nhiều thửa đất chưa cấp sổ, ranh giới không rõ ràng',
    NguyenNhan: 'Lịch sử quản lý đất đai phức tạp, hồ sơ không đầy đủ',
    KhuyenNghiAI: 'Đẩy nhanh cấp sổ đỏ, đo đạc lại ranh giới, công bố công khai quy hoạch',
    TrangThai: 'Đã xử lý',
    NgayPhanTich: '2025-01-05',
    NgayCapNhat: '2025-01-10',
    GhiChu: 'Đã hoàn thành đo đạc'
  },
  {
    MaPhanTich: 'RRQH004',
    KhuVuc: 'Khu công nghiệp D',
    DiaChi: 'KCN D, Xã 4',
    MaThua: '500-600',
    SoTo: '12',
    LoaiRuiRo: 'Ô nhiễm môi trường',
    MucDoRuiRo: 'Cao',
    XacSuat: 91,
    DoTinCayAI: 96,
    MoTaRuiRo: 'Nhiều nhà máy xả thải, không có hệ thống xử lý tập trung',
    NguyenNhan: 'Quy hoạch KCN cũ thiếu hệ thống xử lý, doanh nghiệp vi phạm',
    KhuyenNghiAI: 'Xây dựng hệ thống xử lý nước thải tập trung, tăng cường giám sát, xử phạt nghiêm',
    TrangThai: 'Đang theo dõi',
    NgayPhanTich: '2025-01-12',
    NgayCapNhat: '2025-01-14',
    GhiChu: 'Đã lập danh sách doanh nghiệp vi phạm'
  },
  {
    MaPhanTich: 'RRQH005',
    KhuVuc: 'Khu E - Phường 5',
    DiaChi: 'Đường GHI, Phường 5',
    MaThua: '700-750',
    SoTo: '34',
    LoaiRuiRo: 'Xung đột quy hoạch',
    MucDoRuiRo: 'Trung bình',
    XacSuat: 58,
    DoTinCayAI: 82,
    MoTaRuiRo: 'Quy hoạch đường xuyên qua khu dân cư hiện hữu',
    NguyenNhan: 'Quy hoạch mới không đồng bộ với hiện trạng xây dựng',
    KhuyenNghiAI: 'Điều chỉnh hướng tuyến, đền bù thỏa đáng, tổ chức đối thoại với dân',
    TrangThai: 'Cần xử lý',
    NgayPhanTich: '2025-01-06',
    NgayCapNhat: '2025-01-13',
    GhiChu: 'Có 25 hộ dân bị ảnh hưởng'
  },
  {
    MaPhanTich: 'RRQH006',
    KhuVuc: 'Khu F - Phường 6',
    DiaChi: 'Đường JKL, Phường 6',
    MaThua: '800-850',
    SoTo: '56',
    LoaiRuiRo: 'Hạ tầng quá tải',
    MucDoRuiRo: 'Cao',
    XacSuat: 78,
    DoTinCayAI: 90,
    MoTaRuiRo: 'Mật độ dân cư tăng nhanh, hạ tầng không theo kịp',
    NguyenNhan: 'Cấp phép xây dựng quá nhiều, không đồng bộ hạ tầng',
    KhuyenNghiAI: 'Tạm dừng cấp phép, nâng cấp hạ tầng điện, nước, giao thông',
    TrangThai: 'Đang theo dõi',
    NgayPhanTich: '2025-01-09',
    NgayCapNhat: '2025-01-14',
    GhiChu: ''
  }
];

const loaiRuiRoOptions = ['Ngập lụt', 'Sạt lở', 'Tranh chấp đất', 'Ô nhiễm môi trường', 'Xung đột quy hoạch', 'Hạ tầng quá tải', 'Khác'];
const mucDoOptions = ['Thấp', 'Trung bình', 'Cao', 'Rất cao'];
const trangThaiOptions = ['Mới phát hiện', 'Đang theo dõi', 'Cần xử lý', 'Đang xử lý', 'Đã xử lý'];

export default function RuiRoQuyHoachPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMucDo, setFilterMucDo] = useState<string>('all');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [selectedRuiRo, setSelectedRuiRo] = useState<RuiRoQuyHoach | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockRuiRo.filter((item) => {
    const matchesSearch =
      item.MaPhanTich.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.KhuVuc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMucDo = filterMucDo === 'all' || item.MucDoRuiRo === filterMucDo;
    const matchesLoai = filterLoai === 'all' || item.LoaiRuiRo === filterLoai;
    return matchesSearch && matchesMucDo && matchesLoai;
  });

  const stats = {
    total: mockRuiRo.length,
    ruiRoCao: mockRuiRo.filter(r => r.MucDoRuiRo === 'Cao' || r.MucDoRuiRo === 'Rất cao').length,
    ruiRoTB: mockRuiRo.filter(r => r.MucDoRuiRo === 'Trung bình').length,
    canXuLy: mockRuiRo.filter(r => r.TrangThai === 'Cần xử lý').length,
    daXuLy: mockRuiRo.filter(r => r.TrangThai === 'Đã xử lý').length,
    doTinCayTB: Math.round(mockRuiRo.reduce((sum, r) => sum + r.DoTinCayAI, 0) / mockRuiRo.length)
  };

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Rất cao': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Cao': return <Badge className="bg-red-500 hover:bg-red-600"><AlertTriangle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600"><TrendingUp className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Thấp': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      default: return <Badge variant="secondary">{mucDo}</Badge>;
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã xử lý': return <Badge className="bg-green-500">{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-blue-500">{trangThai}</Badge>;
      case 'Cần xử lý': return <Badge variant="destructive">{trangThai}</Badge>;
      case 'Đang theo dõi': return <Badge className="bg-amber-500">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Đánh giá Rủi ro Quy hoạch (AI)</h1>
              <p className="text-purple-100">Phân tích rủi ro quy hoạch sử dụng đất bằng AI</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-purple-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Phân tích mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yêu cầu phân tích rủi ro mới</DialogTitle>
                <DialogDescription>Nhập thông tin khu vực cần phân tích</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Khu vực *</Label>
                  <Input placeholder="Nhập tên khu vực" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input placeholder="Nhập địa chỉ chi tiết" />
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa (từ - đến)</Label>
                  <Input placeholder="VD: 100-150" />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ</Label>
                  <Input placeholder="Nhập số tờ" />
                </div>
                <div className="space-y-2">
                  <Label>Loại rủi ro cần phân tích</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiRuiRoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Độ ưu tiên</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn độ ưu tiên" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Mô tả tình huống</Label>
                  <Textarea placeholder="Mô tả chi tiết tình huống cần phân tích" rows={3} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>
                  <Brain className="mr-2 h-4 w-4" />
                  Chạy phân tích AI
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng phân tích</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rủi ro cao</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.ruiRoCao}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rủi ro TB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.ruiRoTB}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cần xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.canXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Độ tin cậy AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.doTinCayTB}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, khu vực, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại rủi ro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiRuiRoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMucDo} onValueChange={setFilterMucDo}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phân tích rủi ro quy hoạch</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} kết quả phân tích</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Khu vực</TableHead>
                <TableHead>Loại rủi ro</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Xác suất</TableHead>
                <TableHead>Độ tin cậy AI</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaPhanTich}>
                  <TableCell className="font-medium text-purple-600">{item.MaPhanTich}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.KhuVuc}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.KhuVuc}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-secondary/30 text-secondary">
                      {item.LoaiRuiRo}
                    </Badge>
                  </TableCell>
                  <TableCell>{getMucDoBadge(item.MucDoRuiRo)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.XacSuat} className="w-16 h-2" />
                      <span className="text-sm font-medium">{item.XacSuat}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Brain className="h-3 w-3 text-blue-500" />
                      <span className="font-medium">{item.DoTinCayAI}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedRuiRo?.MaPhanTich === item.MaPhanTich} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedRuiRo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedRuiRo(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết phân tích rủi ro</DialogTitle>
                            <DialogDescription>Mã: {item.MaPhanTich}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Khu vực</p>
                              <p className="font-medium">{item.KhuVuc}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày phân tích</p>
                              <p className="font-medium">{item.NgayPhanTich}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-4 w-4" /> Phân tích rủi ro
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Loại rủi ro</p>
                                  <Badge variant="outline" className="text-red-600">{item.LoaiRuiRo}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Mức độ</p>
                                  {getMucDoBadge(item.MucDoRuiRo)}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Xác suất xảy ra</p>
                                  <div className="flex items-center gap-2">
                                    <Progress value={item.XacSuat} className="w-24 h-2" />
                                    <span className="font-bold text-lg">{item.XacSuat}%</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Độ tin cậy AI</p>
                                  <div className="flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-blue-500" />
                                    <span className="font-bold text-lg">{item.DoTinCayAI}%</span>
                                  </div>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Mô tả rủi ro</p>
                                  <p className="font-medium">{item.MoTaRuiRo}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Nguyên nhân</p>
                                  <p className="font-medium">{item.NguyenNhan}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-600">
                                <Lightbulb className="h-4 w-4" /> Khuyến nghị AI
                              </h4>
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                <p className="font-medium">{item.KhuyenNghiAI}</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cập nhật cuối</p>
                              <p className="font-medium">{item.NgayCapNhat}</p>
                            </div>
                            {item.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium">{item.GhiChu}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Dialog */}
                      <Dialog open={isEditOpen && selectedRuiRo?.MaPhanTich === item.MaPhanTich} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedRuiRo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedRuiRo(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật phân tích rủi ro</DialogTitle>
                            <DialogDescription>Mã: {item.MaPhanTich}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin khu vực</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Khu vực</Label>
                                  <Input defaultValue={item.KhuVuc} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ</Label>
                                  <Input defaultValue={item.DiaChi} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mã thửa</Label>
                                  <Input defaultValue={item.MaThua} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số tờ</Label>
                                  <Input defaultValue={item.SoTo} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày phân tích</Label>
                                  <Input type="date" defaultValue={item.NgayPhanTich} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Phân tích rủi ro</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại rủi ro</Label>
                                  <Input defaultValue={item.LoaiRuiRo} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mức độ rủi ro</Label>
                                  <Select defaultValue={item.MucDoRuiRo}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Xác suất xảy ra (%)</Label>
                                  <Input type="number" min="0" max="100" defaultValue={item.XacSuat} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Độ tin cậy AI (%)</Label>
                                  <Input type="number" min="0" max="100" defaultValue={item.DoTinCayAI} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Mô tả rủi ro</Label>
                                  <Textarea defaultValue={item.MoTaRuiRo} rows={2} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Nguyên nhân</Label>
                                  <Textarea defaultValue={item.NguyenNhan} rows={2} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Khuyến nghị AI</h4>
                              <div className="space-y-2">
                                <Label>Khuyến nghị xử lý</Label>
                                <Textarea defaultValue={item.KhuyenNghiAI} rows={3} />
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Trạng thái</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Trạng thái</Label>
                                  <Select defaultValue={item.TrangThai}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Ghi chú</Label>
                              <Textarea defaultValue={item.GhiChu} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                            <Button onClick={() => setIsEditOpen(false)}>Cập nhật</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
