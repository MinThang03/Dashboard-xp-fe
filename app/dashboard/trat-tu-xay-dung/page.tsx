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
  Building2, AlertTriangle, CheckCircle2, Clock, Search, Plus, Download, Eye, Edit,
  MapPin, Calendar, User, FileCheck, Ban, Gavel
} from 'lucide-react';

// Mock data trật tự xây dựng
interface TratTuXayDung {
  MaKiemTra: string;
  DiaChi: string;
  MaThua: string;
  SoTo: string;
  LoaiCongTrinh: string;
  ChuDauTu: string;
  CCCD: string;
  SoDienThoai: string;
  SoGiayPhep: string;
  NgayCapPhep: string;
  TinhTrangGiayPhep: string;
  NoiDungKiemTra: string;
  NgayKiemTra: string;
  CanBoKiemTra: string;
  KetQuaKiemTra: string;
  LoaiViPham: string;
  MucDo: string;
  BienPhapXuLy: string;
  ThoiHanKhacPhuc: string;
  TrangThaiXuLy: string;
  GhiChu: string;
}

const mockTratTuXD: TratTuXayDung[] = [
  {
    MaKiemTra: 'TTXD001',
    DiaChi: '123 Đường ABC, Khu phố 1, phường XYZ',
    MaThua: '123',
    SoTo: '45',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    ChuDauTu: 'Nguyễn Văn An',
    CCCD: '001234567890',
    SoDienThoai: '0901234567',
    SoGiayPhep: 'GP-2024-001234',
    NgayCapPhep: '2024-06-15',
    TinhTrangGiayPhep: 'Có giấy phép',
    NoiDungKiemTra: 'Kiểm tra định kỳ tiến độ xây dựng',
    NgayKiemTra: '2025-01-10',
    CanBoKiemTra: 'Trần Văn Bình',
    KetQuaKiemTra: 'Hợp lệ',
    LoaiViPham: '',
    MucDo: '',
    BienPhapXuLy: '',
    ThoiHanKhacPhuc: '',
    TrangThaiXuLy: 'Đạt yêu cầu',
    GhiChu: 'Công trình đang xây dựng đúng tiến độ, đúng giấy phép'
  },
  {
    MaKiemTra: 'TTXD002',
    DiaChi: '456 Đường DEF, Thôn 2, xã GHI',
    MaThua: '456',
    SoTo: '67',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    ChuDauTu: 'Trần Thị Bình',
    CCCD: '001234567891',
    SoDienThoai: '0902345678',
    SoGiayPhep: '',
    NgayCapPhep: '',
    TinhTrangGiayPhep: 'Không có giấy phép',
    NoiDungKiemTra: 'Kiểm tra theo phản ánh của người dân',
    NgayKiemTra: '2025-01-08',
    CanBoKiemTra: 'Lê Thị Cúc',
    KetQuaKiemTra: 'Vi phạm',
    LoaiViPham: 'Xây dựng không phép',
    MucDo: 'Nghiêm trọng',
    BienPhapXuLy: 'Lập biên bản, đình chỉ thi công, yêu cầu bổ sung giấy phép',
    ThoiHanKhacPhuc: '2025-02-08',
    TrangThaiXuLy: 'Đang xử lý',
    GhiChu: 'Đã đình chỉ thi công, chờ chủ đầu tư bổ sung giấy phép'
  },
  {
    MaKiemTra: 'TTXD003',
    DiaChi: '789 Đường KLM, Khu phố 3, phường NOP',
    MaThua: '789',
    SoTo: '89',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    ChuDauTu: 'Phạm Văn Cường',
    CCCD: '001234567892',
    SoDienThoai: '0903456789',
    SoGiayPhep: 'GP-2024-002345',
    NgayCapPhep: '2024-08-20',
    TinhTrangGiayPhep: 'Có giấy phép',
    NoiDungKiemTra: 'Kiểm tra định kỳ',
    NgayKiemTra: '2025-01-05',
    CanBoKiemTra: 'Trần Văn Bình',
    KetQuaKiemTra: 'Vi phạm',
    LoaiViPham: 'Xây dựng sai phép',
    MucDo: 'Nhẹ',
    BienPhapXuLy: 'Nhắc nhở, yêu cầu điều chỉnh bản vẽ',
    ThoiHanKhacPhuc: '2025-01-20',
    TrangThaiXuLy: 'Đã khắc phục',
    GhiChu: 'Sai lệch 10cm so với bản vẽ, đã điều chỉnh'
  },
  {
    MaKiemTra: 'TTXD004',
    DiaChi: '234 Đường QRS, Khu phố 4, phường TUV',
    MaThua: '234',
    SoTo: '12',
    LoaiCongTrinh: 'Công trình thương mại',
    ChuDauTu: 'Công ty TNHH ABC',
    CCCD: '0108765432',
    SoDienThoai: '0904567890',
    SoGiayPhep: 'GP-2024-003456',
    NgayCapPhep: '2024-03-10',
    TinhTrangGiayPhep: 'Có giấy phép',
    NoiDungKiemTra: 'Kiểm tra nghiệm thu',
    NgayKiemTra: '2025-01-12',
    CanBoKiemTra: 'Nguyễn Thị Dung',
    KetQuaKiemTra: 'Hợp lệ',
    LoaiViPham: '',
    MucDo: '',
    BienPhapXuLy: '',
    ThoiHanKhacPhuc: '',
    TrangThaiXuLy: 'Đạt yêu cầu',
    GhiChu: 'Công trình hoàn thành, đủ điều kiện nghiệm thu'
  },
  {
    MaKiemTra: 'TTXD005',
    DiaChi: '567 Đường WXY, Thôn 3, xã ZAB',
    MaThua: '567',
    SoTo: '34',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    ChuDauTu: 'Hoàng Thị Em',
    CCCD: '001234567893',
    SoDienThoai: '0905678901',
    SoGiayPhep: '',
    NgayCapPhep: '',
    TinhTrangGiayPhep: 'Không có giấy phép',
    NoiDungKiemTra: 'Kiểm tra theo phản ánh',
    NgayKiemTra: '2025-01-11',
    CanBoKiemTra: 'Lê Thị Cúc',
    KetQuaKiemTra: 'Vi phạm',
    LoaiViPham: 'Xây dựng không phép',
    MucDo: 'Nghiêm trọng',
    BienPhapXuLy: 'Lập biên bản, xử phạt hành chính, yêu cầu tháo dỡ',
    ThoiHanKhacPhuc: '2025-02-15',
    TrangThaiXuLy: 'Chờ cưỡng chế',
    GhiChu: 'Không hợp tác, chuyển cưỡng chế'
  },
  {
    MaKiemTra: 'TTXD006',
    DiaChi: '890 Đường CDE, Khu phố 5, phường FGH',
    MaThua: '890',
    SoTo: '56',
    LoaiCongTrinh: 'Nhà ở riêng lẻ',
    ChuDauTu: 'Lê Văn Giang',
    CCCD: '001234567894',
    SoDienThoai: '0906789012',
    SoGiayPhep: 'GP-2024-004567',
    NgayCapPhep: '2024-09-05',
    TinhTrangGiayPhep: 'Có giấy phép',
    NoiDungKiemTra: 'Kiểm tra định kỳ',
    NgayKiemTra: '2025-01-09',
    CanBoKiemTra: 'Trần Văn Bình',
    KetQuaKiemTra: 'Vi phạm',
    LoaiViPham: 'Xây dựng sai phép',
    MucDo: 'Trung bình',
    BienPhapXuLy: 'Lập biên bản, yêu cầu điều chỉnh theo giấy phép',
    ThoiHanKhacPhuc: '2025-01-30',
    TrangThaiXuLy: 'Đang khắc phục',
    GhiChu: 'Xây vượt 1 tầng so với giấy phép'
  }
];

const loaiCongTrinhOptions = ['Nhà ở riêng lẻ', 'Công trình thương mại', 'Nhà xưởng', 'Công trình công cộng', 'Khác'];
const ketQuaKiemTraOptions = ['Hợp lệ', 'Vi phạm'];
const loaiViPhamOptions = ['Xây dựng không phép', 'Xây dựng sai phép', 'Vượt chiều cao', 'Vi phạm ranh giới', 'Khác'];
const mucDoOptions = ['Nhẹ', 'Trung bình', 'Nghiêm trọng'];
const trangThaiOptions = ['Đạt yêu cầu', 'Đang xử lý', 'Đang khắc phục', 'Đã khắc phục', 'Chờ cưỡng chế', 'Đã cưỡng chế'];

export default function TratTuXayDungPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKetQua, setFilterKetQua] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [selectedKT, setSelectedKT] = useState<TratTuXayDung | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockTratTuXD.filter((item) => {
    const matchesSearch =
      item.MaKiemTra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuDauTu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.SoGiayPhep.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKetQua = filterKetQua === 'all' || item.KetQuaKiemTra === filterKetQua;
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThaiXuLy === filterTrangThai;
    return matchesSearch && matchesKetQua && matchesTrangThai;
  });

  const stats = {
    total: mockTratTuXD.length,
    hopLe: mockTratTuXD.filter(r => r.KetQuaKiemTra === 'Hợp lệ').length,
    viPham: mockTratTuXD.filter(r => r.KetQuaKiemTra === 'Vi phạm').length,
    dangXuLy: mockTratTuXD.filter(r => r.TrangThaiXuLy === 'Đang xử lý' || r.TrangThaiXuLy === 'Đang khắc phục').length,
    daKhacPhuc: mockTratTuXD.filter(r => r.TrangThaiXuLy === 'Đã khắc phục' || r.TrangThaiXuLy === 'Đạt yêu cầu').length,
    choCuongChe: mockTratTuXD.filter(r => r.TrangThaiXuLy === 'Chờ cưỡng chế').length
  };

  const getKetQuaBadge = (ketQua: string) => {
    switch (ketQua) {
      case 'Hợp lệ': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{ketQua}</Badge>;
      case 'Vi phạm': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{ketQua}</Badge>;
      default: return <Badge variant="secondary">{ketQua}</Badge>;
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đạt yêu cầu': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đã khắc phục': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang khắc phục': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ cưỡng chế': return <Badge variant="destructive"><Gavel className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đã cưỡng chế': return <Badge className="bg-purple-500 hover:bg-purple-600"><Ban className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Nghiêm trọng': return <Badge variant="destructive">{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-orange-500 hover:bg-orange-600">{mucDo}</Badge>;
      case 'Nhẹ': return <Badge className="bg-amber-500 hover:bg-amber-600">{mucDo}</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-status-warning via-accent to-status-warning rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Trật tự Xây dựng</h1>
              <p className="text-amber-100">Kiểm tra, xử lý vi phạm trật tự xây dựng</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-amber-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Lập biên bản
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Lập biên bản kiểm tra</DialogTitle>
                <DialogDescription>Nhập thông tin kiểm tra công trình xây dựng</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ công trình *</Label>
                  <Input placeholder="Nhập địa chỉ" />
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa</Label>
                  <Input placeholder="Nhập mã thửa" />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ</Label>
                  <Input placeholder="Nhập số tờ" />
                </div>
                <div className="space-y-2">
                  <Label>Loại công trình</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiCongTrinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số giấy phép XD</Label>
                  <Input placeholder="Nhập số GP (nếu có)" />
                </div>
                <div className="space-y-2">
                  <Label>Tình trạng giấy phép</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn tình trạng" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Có giấy phép">Có giấy phép</SelectItem>
                      <SelectItem value="Không có giấy phép">Không có giấy phép</SelectItem>
                      <SelectItem value="Giấy phép hết hạn">Giấy phép hết hạn</SelectItem>
                      <SelectItem value="Giấy phép không hợp lệ">Giấy phép không hợp lệ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày cấp giấy phép</Label>
                  <Input type="date" />
                </div>
                <div className="col-span-2 border-t pt-4 mt-2">
                  <h4 className="font-semibold mb-3">Chủ đầu tư</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Họ tên *</Label>
                      <Input placeholder="Nhập tên" />
                    </div>
                    <div className="space-y-2">
                      <Label>CCCD</Label>
                      <Input placeholder="Nhập CCCD" />
                    </div>
                    <div className="space-y-2">
                      <Label>Điện thoại</Label>
                      <Input placeholder="Nhập SĐT" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ngày kiểm tra *</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ kiểm tra *</Label>
                  <Input placeholder="Nhập tên cán bộ" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Nội dung kiểm tra</Label>
                  <Textarea placeholder="Mô tả nội dung kiểm tra" />
                </div>
                <div className="space-y-2">
                  <Label>Kết quả kiểm tra *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn kết quả" /></SelectTrigger>
                    <SelectContent>
                      {ketQuaKiemTraOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái xử lý</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                      <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                      <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                      <SelectItem value="Tạm đình chỉ">Tạm đình chỉ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Loại vi phạm</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại vi phạm" /></SelectTrigger>
                    <SelectContent>
                      {loaiViPhamOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mức độ vi phạm</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn mức độ" /></SelectTrigger>
                    <SelectContent>
                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Thời hạn khắc phục</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Biện pháp xử lý</Label>
                  <Textarea placeholder="Mô tả biện pháp xử lý" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={() => setIsAddOpen(false)}>Lập biên bản</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng kiểm tra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hợp lệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.hopLe}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vi phạm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.viPham}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.dangXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã khắc phục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold">{stats.daKhacPhuc}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ cưỡng chế</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.choCuongChe}</span>
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
                placeholder="Tìm theo mã, chủ đầu tư, địa chỉ, số GP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterKetQua} onValueChange={setFilterKetQua}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kết quả KT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kết quả</SelectItem>
                {ketQuaKiemTraOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
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
          <CardTitle>Danh sách kiểm tra trật tự xây dựng</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} biên bản</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KT</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Chủ đầu tư</TableHead>
                <TableHead>Giấy phép</TableHead>
                <TableHead>Ngày KT</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaKiemTra}>
                  <TableCell className="font-medium text-primary">{item.MaKiemTra}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.DiaChi}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.DiaChi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      {item.ChuDauTu}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.SoGiayPhep ? (
                      <span className="text-primary text-sm">{item.SoGiayPhep}</span>
                    ) : (
                      <Badge variant="outline" className="text-red-500">Không có</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayKiemTra}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getKetQuaBadge(item.KetQuaKiemTra)}
                      {item.MucDo && <div className="mt-1">{getMucDoBadge(item.MucDo)}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThaiXuLy)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedKT?.MaKiemTra === item.MaKiemTra} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedKT(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedKT(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết biên bản kiểm tra</DialogTitle>
                            <DialogDescription>Mã: {item.MaKiemTra}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ công trình</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại công trình</p>
                              <Badge variant="outline">{item.LoaiCongTrinh}</Badge>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Chủ đầu tư</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.ChuDauTu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD</p>
                                  <p className="font-medium">{item.CCCD}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                                  <p className="font-medium">{item.SoDienThoai}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Giấy phép xây dựng</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Tình trạng</p>
                                  <p className="font-medium">{item.TinhTrangGiayPhep}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số giấy phép</p>
                                  <p className="font-medium">{item.SoGiayPhep || 'Không có'}</p>
                                </div>
                                {item.NgayCapPhep && (
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Ngày cấp</p>
                                    <p className="font-medium">{item.NgayCapPhep}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Kết quả kiểm tra</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày kiểm tra</p>
                                  <p className="font-medium">{item.NgayKiemTra}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Cán bộ kiểm tra</p>
                                  <p className="font-medium">{item.CanBoKiemTra}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Nội dung kiểm tra</p>
                                  <p className="font-medium">{item.NoiDungKiemTra}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Kết quả</p>
                                  {getKetQuaBadge(item.KetQuaKiemTra)}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Trạng thái xử lý</p>
                                  {getTrangThaiBadge(item.TrangThaiXuLy)}
                                </div>
                              </div>
                            </div>
                            {item.LoaiViPham && (
                              <div className="col-span-2 border-t pt-4 mt-2">
                                <h4 className="font-semibold mb-3 text-red-600">Thông tin vi phạm</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Loại vi phạm</p>
                                    <p className="font-medium">{item.LoaiViPham}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Mức độ</p>
                                    {getMucDoBadge(item.MucDo)}
                                  </div>
                                  <div className="space-y-1 col-span-2">
                                    <p className="text-sm text-muted-foreground">Biện pháp xử lý</p>
                                    <p className="font-medium">{item.BienPhapXuLy}</p>
                                  </div>
                                  {item.ThoiHanKhacPhuc && (
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Thời hạn khắc phục</p>
                                      <p className="font-medium">{item.ThoiHanKhacPhuc}</p>
                                    </div>
                                  )}
                                </div>
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
                      <Dialog open={isEditOpen && selectedKT?.MaKiemTra === item.MaKiemTra} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedKT(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedKT(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật biên bản</DialogTitle>
                            <DialogDescription>Mã: {item.MaKiemTra}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin công trình</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ công trình</Label>
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
                                <div className="space-y-2 col-span-2">
                                  <Label>Loại công trình</Label>
                                  <Input defaultValue={item.LoaiCongTrinh} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Chủ đầu tư</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Họ tên</Label>
                                  <Input defaultValue={item.ChuDauTu} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD</Label>
                                  <Input defaultValue={item.CCCD} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Điện thoại</Label>
                                  <Input defaultValue={item.SoDienThoai} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Giấy phép xây dựng</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Tình trạng giấy phép</Label>
                                  <Input defaultValue={item.TinhTrangGiayPhep} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số giấy phép</Label>
                                  <Input defaultValue={item.SoGiayPhep} placeholder="Không có" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày cấp</Label>
                                  <Input type="date" defaultValue={item.NgayCapPhep} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Kết quả kiểm tra</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngày kiểm tra</Label>
                                  <Input type="date" defaultValue={item.NgayKiemTra} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Cán bộ kiểm tra</Label>
                                  <Input defaultValue={item.CanBoKiemTra} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Nội dung kiểm tra</Label>
                                  <Textarea defaultValue={item.NoiDungKiemTra} rows={2} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Kết quả kiểm tra</Label>
                                  <Select defaultValue={item.KetQuaKiemTra}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {ketQuaKiemTraOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Trạng thái xử lý</Label>
                                  <Select defaultValue={item.TrangThaiXuLy}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin vi phạm</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại vi phạm</Label>
                                  <Select defaultValue={item.LoaiViPham}>
                                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                                    <SelectContent>
                                      {loaiViPhamOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Mức độ</Label>
                                  <Select defaultValue={item.MucDo}>
                                    <SelectTrigger><SelectValue placeholder="Chọn mức độ" /></SelectTrigger>
                                    <SelectContent>
                                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Thời hạn khắc phục</Label>
                                  <Input type="date" defaultValue={item.ThoiHanKhacPhuc} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Biện pháp xử lý</Label>
                                  <Textarea defaultValue={item.BienPhapXuLy} />
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
