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
import { 
  AlertTriangle, MapPin, Clock, XCircle, Search, Plus, Download, Eye, Edit,
  CheckCircle2, Scale, Users, FileText, Calendar, Gavel, MessageSquare
} from 'lucide-react';

// Mock data tranh chấp đất đai
interface TranhChapDat {
  MaVu: string;
  LoaiTranhChap: string;
  MaThua: string;
  SoTo: string;
  DiaChiThuaDat: string;
  DienTichTranhChap: number;
  BenKhieuNai: string;
  CCCDKhieuNai: string;
  SDTKhieuNai: string;
  BenBiKhieuNai: string;
  CCCDBiKhieuNai: string;
  NgayKhieuNai: string;
  NoiDung: string;
  MucDo: string;
  TrangThai: string;
  CanBoThuLy: string;
  PhuongAnGiaiQuyet: string;
  NgayGiaiQuyet: string;
  KetQuaGiaiQuyet: string;
  GhiChu: string;
}

const mockTranhChap: TranhChapDat[] = [
  {
    MaVu: 'TC001',
    LoaiTranhChap: 'Tranh chấp ranh giới',
    MaThua: '123, 124',
    SoTo: '45',
    DiaChiThuaDat: 'Khu phố 3, phường ABC',
    DienTichTranhChap: 15.5,
    BenKhieuNai: 'Nguyễn Văn An',
    CCCDKhieuNai: '001234567890',
    SDTKhieuNai: '0901234567',
    BenBiKhieuNai: 'Trần Văn Bình',
    CCCDBiKhieuNai: '001234567891',
    NgayKhieuNai: '2025-01-05',
    NoiDung: 'Bên B xây tường lấn sang đất bên A khoảng 0.5m',
    MucDo: 'Trung bình',
    TrangThai: 'Đang giải quyết',
    CanBoThuLy: 'Lê Văn Cường',
    PhuongAnGiaiQuyet: 'Hòa giải, yêu cầu đo đạc lại ranh giới',
    NgayGiaiQuyet: '',
    KetQuaGiaiQuyet: '',
    GhiChu: 'Đã mời 2 bên hòa giải lần 1'
  },
  {
    MaVu: 'TC002',
    LoaiTranhChap: 'Tranh chấp quyền sở hữu',
    MaThua: '456',
    SoTo: '67',
    DiaChiThuaDat: 'Thôn 2, xã XYZ',
    DienTichTranhChap: 200,
    BenKhieuNai: 'Phạm Thị Dung',
    CCCDKhieuNai: '001234567892',
    SDTKhieuNai: '0902345678',
    BenBiKhieuNai: 'Hoàng Văn Em',
    CCCDBiKhieuNai: '001234567893',
    NgayKhieuNai: '2024-11-20',
    NoiDung: 'Tranh chấp đất thừa kế từ bố mẹ để lại',
    MucDo: 'Phức tạp',
    TrangThai: 'Đã giải quyết',
    CanBoThuLy: 'Nguyễn Thị Lan',
    PhuongAnGiaiQuyet: 'Xác minh giấy tờ thừa kế',
    NgayGiaiQuyet: '2025-01-10',
    KetQuaGiaiQuyet: 'Công nhận quyền sở hữu cho bên khiếu nại theo di chúc',
    GhiChu: ''
  },
  {
    MaVu: 'TC003',
    LoaiTranhChap: 'Lấn chiếm đất công',
    MaThua: '789',
    SoTo: '89',
    DiaChiThuaDat: 'Đường liên thôn, thôn 1',
    DienTichTranhChap: 50,
    BenKhieuNai: 'UBND Xã/Phường',
    CCCDKhieuNai: '',
    SDTKhieuNai: '',
    BenBiKhieuNai: 'Lê Văn Giang',
    CCCDBiKhieuNai: '001234567894',
    NgayKhieuNai: '2025-01-08',
    NoiDung: 'Tự ý xây dựng hàng rào lấn chiếm đất hành lang giao thông',
    MucDo: 'Nghiêm trọng',
    TrangThai: 'Đang giải quyết',
    CanBoThuLy: 'Trần Văn Bình',
    PhuongAnGiaiQuyet: 'Cưỡng chế tháo dỡ theo quyết định',
    NgayGiaiQuyet: '',
    KetQuaGiaiQuyet: '',
    GhiChu: 'Đã ban hành quyết định xử phạt, chờ cưỡng chế'
  },
  {
    MaVu: 'TC004',
    LoaiTranhChap: 'Tranh chấp lối đi',
    MaThua: '234, 235',
    SoTo: '12',
    DiaChiThuaDat: 'Khu phố 1, phường DEF',
    DienTichTranhChap: 8,
    BenKhieuNai: 'Nguyễn Thị Hải',
    CCCDKhieuNai: '001234567895',
    SDTKhieuNai: '0903456789',
    BenBiKhieuNai: 'Trần Văn Khánh',
    CCCDBiKhieuNai: '001234567896',
    NgayKhieuNai: '2025-01-12',
    NoiDung: 'Bên B xây tường chắn lối đi chung đã sử dụng 20 năm',
    MucDo: 'Trung bình',
    TrangThai: 'Chờ xử lý',
    CanBoThuLy: '',
    PhuongAnGiaiQuyet: '',
    NgayGiaiQuyet: '',
    KetQuaGiaiQuyet: '',
    GhiChu: 'Hồ sơ mới tiếp nhận'
  },
  {
    MaVu: 'TC005',
    LoaiTranhChap: 'Tranh chấp quyền sử dụng',
    MaThua: '567',
    SoTo: '34',
    DiaChiThuaDat: 'Khu đồng A, xã GHI',
    DienTichTranhChap: 500,
    BenKhieuNai: 'Lê Thị Lan',
    CCCDKhieuNai: '001234567897',
    SDTKhieuNai: '0904567890',
    BenBiKhieuNai: 'HTX Nông nghiệp XYZ',
    CCCDBiKhieuNai: '0100567890',
    NgayKhieuNai: '2024-12-15',
    NoiDung: 'Yêu cầu trả lại đất đã góp vào HTX từ năm 1975',
    MucDo: 'Phức tạp',
    TrangThai: 'Đang giải quyết',
    CanBoThuLy: 'Phạm Thị Em',
    PhuongAnGiaiQuyet: 'Xác minh lịch sử sử dụng đất, họp hội đồng',
    NgayGiaiQuyet: '',
    KetQuaGiaiQuyet: '',
    GhiChu: 'Vụ việc phức tạp, liên quan chính sách đất đai qua nhiều thời kỳ'
  },
  {
    MaVu: 'TC006',
    LoaiTranhChap: 'Tranh chấp ranh giới',
    MaThua: '890, 891',
    SoTo: '56',
    DiaChiThuaDat: 'Thôn 3, xã JKL',
    DienTichTranhChap: 25,
    BenKhieuNai: 'Hoàng Văn Minh',
    CCCDKhieuNai: '001234567898',
    SDTKhieuNai: '0905678901',
    BenBiKhieuNai: 'Nguyễn Thị Nga',
    CCCDBiKhieuNai: '001234567899',
    NgayKhieuNai: '2024-10-20',
    NoiDung: 'Ranh giới thực tế không khớp với bản đồ địa chính',
    MucDo: 'Nhẹ',
    TrangThai: 'Đã giải quyết',
    CanBoThuLy: 'Lê Văn Cường',
    PhuongAnGiaiQuyet: 'Đo đạc chính xác và điều chỉnh hồ sơ',
    NgayGiaiQuyet: '2024-12-05',
    KetQuaGiaiQuyet: 'Đã cập nhật ranh giới theo kết quả đo đạc mới',
    GhiChu: ''
  }
];

const loaiTranhChapOptions = ['Tranh chấp ranh giới', 'Tranh chấp quyền sở hữu', 'Tranh chấp quyền sử dụng', 'Lấn chiếm đất công', 'Tranh chấp lối đi', 'Khác'];
const mucDoOptions = ['Nhẹ', 'Trung bình', 'Phức tạp', 'Nghiêm trọng'];
const trangThaiOptions = ['Chờ xử lý', 'Đang giải quyết', 'Đã giải quyết', 'Chuyển tòa án'];

export default function TranhChapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMucDo, setFilterMucDo] = useState<string>('all');
  const [selectedVu, setSelectedVu] = useState<TranhChapDat | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockTranhChap.filter((item) => {
    const matchesSearch =
      item.MaVu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.BenKhieuNai.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.BenBiKhieuNai.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.MaThua.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || item.TrangThai === filterStatus;
    const matchesMucDo = filterMucDo === 'all' || item.MucDo === filterMucDo;
    return matchesSearch && matchesStatus && matchesMucDo;
  });

  const stats = {
    total: mockTranhChap.length,
    choXuLy: mockTranhChap.filter(r => r.TrangThai === 'Chờ xử lý').length,
    dangGiaiQuyet: mockTranhChap.filter(r => r.TrangThai === 'Đang giải quyết').length,
    daGiaiQuyet: mockTranhChap.filter(r => r.TrangThai === 'Đã giải quyết').length,
    phucTap: mockTranhChap.filter(r => r.MucDo === 'Phức tạp' || r.MucDo === 'Nghiêm trọng').length,
    tongDienTich: mockTranhChap.reduce((sum, r) => sum + r.DienTichTranhChap, 0)
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã giải quyết': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang giải quyết': return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ xử lý': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chuyển tòa án': return <Badge className="bg-purple-500 hover:bg-purple-600"><Gavel className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Nghiêm trọng': return <Badge variant="destructive">{mucDo}</Badge>;
      case 'Phức tạp': return <Badge className="bg-orange-500 hover:bg-orange-600">{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600">{mucDo}</Badge>;
      case 'Nhẹ': return <Badge className="bg-green-500 hover:bg-green-600">{mucDo}</Badge>;
      default: return <Badge variant="secondary">{mucDo}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-status-danger via-primary to-status-danger rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Tranh chấp Đất đai</h1>
              <p className="text-orange-100">Theo dõi, giải quyết các vụ tranh chấp quyền sử dụng đất</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-orange-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm vụ việc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tiếp nhận vụ tranh chấp mới</DialogTitle>
                <DialogDescription>Nhập thông tin đơn khiếu nại tranh chấp đất đai</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại tranh chấp *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại tranh chấp" /></SelectTrigger>
                    <SelectContent>
                      {loaiTranhChapOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mức độ</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn mức độ" /></SelectTrigger>
                    <SelectContent>
                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa liên quan *</Label>
                  <Input placeholder="Nhập mã thửa" />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ *</Label>
                  <Input placeholder="Nhập số tờ" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ thửa đất</Label>
                  <Input placeholder="Nhập địa chỉ" />
                </div>
                <div className="space-y-2">
                  <Label>Diện tích tranh chấp (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích" />
                </div>
                <div className="space-y-2">
                  <Label>Ngày khiếu nại</Label>
                  <Input type="date" />
                </div>
                <div className="col-span-2 border-t pt-4 mt-2">
                  <h4 className="font-semibold mb-3">Bên khiếu nại</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Họ tên *</Label>
                      <Input placeholder="Nhập họ tên" />
                    </div>
                    <div className="space-y-2">
                      <Label>CCCD</Label>
                      <Input placeholder="Nhập CCCD" />
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input placeholder="Nhập SĐT" />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 border-t pt-4 mt-2">
                  <h4 className="font-semibold mb-3">Bên bị khiếu nại</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Họ tên *</Label>
                      <Input placeholder="Nhập họ tên" />
                    </div>
                    <div className="space-y-2">
                      <Label>CCCD</Label>
                      <Input placeholder="Nhập CCCD" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Nội dung tranh chấp *</Label>
                  <Textarea placeholder="Mô tả chi tiết nội dung tranh chấp" rows={3} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>Tiếp nhận</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng vụ việc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.choXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang giải quyết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.dangGiaiQuyet}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã giải quyết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daGiaiQuyet}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phức tạp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.phucTap}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng DT (m²)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-500" />
              <span className="text-2xl font-bold">{stats.tongDienTich.toLocaleString()}</span>
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
                placeholder="Tìm theo mã vụ, bên khiếu nại, mã thửa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterMucDo} onValueChange={setFilterMucDo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách vụ tranh chấp</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} vụ việc</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã vụ</TableHead>
                <TableHead>Loại tranh chấp</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Các bên liên quan</TableHead>
                <TableHead>Ngày KN</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaVu}>
                  <TableCell className="font-medium text-primary">{item.MaVu}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.LoaiTranhChap}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Thửa: {item.MaThua}
                      </div>
                      <div className="text-muted-foreground text-xs">{item.DiaChiThuaDat}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.BenKhieuNai}
                      </div>
                      <div className="text-muted-foreground text-xs">vs {item.BenBiKhieuNai}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayKhieuNai}
                    </div>
                  </TableCell>
                  <TableCell>{getMucDoBadge(item.MucDo)}</TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedVu?.MaVu === item.MaVu} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedVu(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedVu(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết vụ tranh chấp</DialogTitle>
                            <DialogDescription>Mã vụ: {item.MaVu}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại tranh chấp</p>
                              <Badge variant="outline">{item.LoaiTranhChap}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mức độ</p>
                              {getMucDoBadge(item.MucDo)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diện tích tranh chấp</p>
                              <p className="font-medium">{item.DienTichTranhChap} m²</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ</p>
                              <p className="font-medium">{item.DiaChiThuaDat}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Bên khiếu nại</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.BenKhieuNai}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD</p>
                                  <p className="font-medium">{item.CCCDKhieuNai || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                                  <p className="font-medium">{item.SDTKhieuNai || '-'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Bên bị khiếu nại</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.BenBiKhieuNai}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD</p>
                                  <p className="font-medium">{item.CCCDBiKhieuNai}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Nội dung tranh chấp</p>
                              <p className="font-medium">{item.NoiDung}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày khiếu nại</p>
                              <p className="font-medium">{item.NgayKhieuNai}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cán bộ thụ lý</p>
                              <p className="font-medium">{item.CanBoThuLy || 'Chưa phân công'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày giải quyết</p>
                              <p className="font-medium">{item.NgayGiaiQuyet || 'Chưa có'}</p>
                            </div>
                            {item.PhuongAnGiaiQuyet && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Phương án giải quyết</p>
                                <p className="font-medium">{item.PhuongAnGiaiQuyet}</p>
                              </div>
                            )}
                            {item.KetQuaGiaiQuyet && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Kết quả giải quyết</p>
                                <p className="font-medium">{item.KetQuaGiaiQuyet}</p>
                              </div>
                            )}
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
                      <Dialog open={isEditOpen && selectedVu?.MaVu === item.MaVu} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedVu(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedVu(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật vụ tranh chấp</DialogTitle>
                            <DialogDescription>Mã vụ: {item.MaVu}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin vụ tranh chấp</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại tranh chấp</Label>
                                  <Input defaultValue={item.LoaiTranhChap} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mức độ</Label>
                                  <Select defaultValue={item.MucDo}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày khiếu nại</Label>
                                  <Input type="date" defaultValue={item.NgayKhieuNai} />
                                </div>
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

                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin thửa đất</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Mã thửa</Label>
                                  <Input defaultValue={item.MaThua} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số tờ</Label>
                                  <Input defaultValue={item.SoTo} />
                                </div>
                                <div className="space-y-2">
                                  <Label>DT tranh chấp (m²)</Label>
                                  <Input type="number" defaultValue={item.DienTichTranhChap} />
                                </div>
                                <div className="space-y-2 col-span-3">
                                  <Label>Địa chỉ thửa đất</Label>
                                  <Input defaultValue={item.DiaChiThuaDat} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Bên khiếu nại</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Họ tên</Label>
                                  <Input defaultValue={item.BenKhieuNai} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD</Label>
                                  <Input defaultValue={item.CCCDKhieuNai} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Điện thoại</Label>
                                  <Input defaultValue={item.SDTKhieuNai} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Bên bị khiếu nại</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Họ tên</Label>
                                  <Input defaultValue={item.BenBiKhieuNai} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD</Label>
                                  <Input defaultValue={item.CCCDBiKhieuNai} />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Nội dung tranh chấp</Label>
                              <Textarea defaultValue={item.NoiDung} rows={2} />
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Xử lý</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Cán bộ thụ lý</Label>
                                  <Input defaultValue={item.CanBoThuLy} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày giải quyết</Label>
                                  <Input type="date" defaultValue={item.NgayGiaiQuyet} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Phương án giải quyết</Label>
                                  <Textarea defaultValue={item.PhuongAnGiaiQuyet} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Kết quả giải quyết</Label>
                                  <Textarea defaultValue={item.KetQuaGiaiQuyet} />
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

      {/* Cảnh báo vụ nghiêm trọng */}
      {stats.phucTap > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Vụ việc cần ưu tiên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Có <strong>{stats.phucTap}</strong> vụ việc mức độ phức tạp hoặc nghiêm trọng cần được ưu tiên giải quyết.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
