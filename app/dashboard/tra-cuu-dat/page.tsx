'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileSearch, MapPin, Users, CheckCircle2, Search, Download, Eye, FileText,
  Layers, Home, Clock, TreePine
} from 'lucide-react';

// Mock data tra cứu đất đai
interface ThongTinDat {
  MaThua: string;
  SoTo: string;
  DiaChiThuaDat: string;
  DienTich: number;
  LoaiDat: string;
  MucDichSuDung: string;
  ChuSoHuu: string;
  CCCD: string;
  DiaChiThuongTru: string;
  SoDienThoai: string;
  NguonGocSuDung: string;
  ThoiHanSuDung: string;
  SoSoDo: string;
  NgayCapSoDo: string;
  TrangThaiPhapLy: string;
  ToaDoX: string;
  ToaDoY: string;
  LoThoBan: string;
  HanCheSuDung: string;
}

const mockThongTinDat: ThongTinDat[] = [
  {
    MaThua: '123',
    SoTo: '45',
    DiaChiThuaDat: 'Khu phố 3, phường ABC, quận XYZ',
    DienTich: 250,
    LoaiDat: 'Đất ở',
    MucDichSuDung: 'Đất ở tại đô thị',
    ChuSoHuu: 'Nguyễn Văn An',
    CCCD: '001234567890',
    DiaChiThuongTru: '123 Đường ABC, phường XYZ',
    SoDienThoai: '0901234567',
    NguonGocSuDung: 'Nhà nước giao đất có thu tiền',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: 'BT001234',
    NgayCapSoDo: '2020-05-15',
    TrangThaiPhapLy: 'Đã cấp sổ đỏ',
    ToaDoX: '106.652347',
    ToaDoY: '10.771256',
    LoThoBan: 'Đất vàng',
    HanCheSuDung: 'Không'
  },
  {
    MaThua: '456',
    SoTo: '67',
    DiaChiThuaDat: 'Thôn 2, xã DEF',
    DienTich: 1500,
    LoaiDat: 'Đất nông nghiệp',
    MucDichSuDung: 'Trồng cây hàng năm',
    ChuSoHuu: 'Trần Thị Bình',
    CCCD: '001234567891',
    DiaChiThuongTru: '456 Đường DEF, xã DEF',
    SoDienThoai: '0902345678',
    NguonGocSuDung: 'Nhà nước giao đất không thu tiền',
    ThoiHanSuDung: '50 năm (2045)',
    SoSoDo: 'BT002345',
    NgayCapSoDo: '2018-03-20',
    TrangThaiPhapLy: 'Đã cấp sổ đỏ',
    ToaDoX: '106.543678',
    ToaDoY: '10.654321',
    LoThoBan: 'Đất xanh',
    HanCheSuDung: 'Không được chuyển mục đích sử dụng'
  },
  {
    MaThua: '789',
    SoTo: '89',
    DiaChiThuaDat: 'Khu công nghiệp GHI',
    DienTich: 5000,
    LoaiDat: 'Đất công nghiệp',
    MucDichSuDung: 'Sản xuất công nghiệp',
    ChuSoHuu: 'Công ty TNHH ABC',
    CCCD: '0108765432',
    DiaChiThuongTru: '789 KCN GHI',
    SoDienThoai: '0903456789',
    NguonGocSuDung: 'Nhà nước cho thuê đất',
    ThoiHanSuDung: '50 năm (2055)',
    SoSoDo: 'BT003456',
    NgayCapSoDo: '2015-08-10',
    TrangThaiPhapLy: 'Đã cấp sổ đỏ',
    ToaDoX: '106.432567',
    ToaDoY: '10.543210',
    LoThoBan: 'Đất tím',
    HanCheSuDung: 'Theo quy hoạch khu công nghiệp'
  },
  {
    MaThua: '234',
    SoTo: '12',
    DiaChiThuaDat: 'Khu phố 1, phường JKL',
    DienTich: 180,
    LoaiDat: 'Đất ở',
    MucDichSuDung: 'Đất ở tại đô thị',
    ChuSoHuu: 'Phạm Văn Cường',
    CCCD: '001234567892',
    DiaChiThuongTru: '234 Đường JKL',
    SoDienThoai: '0904567890',
    NguonGocSuDung: 'Mua bán chuyển nhượng',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: '',
    NgayCapSoDo: '',
    TrangThaiPhapLy: 'Đang làm sổ đỏ',
    ToaDoX: '106.567890',
    ToaDoY: '10.678901',
    LoThoBan: 'Đất vàng',
    HanCheSuDung: 'Không'
  },
  {
    MaThua: '567',
    SoTo: '34',
    DiaChiThuaDat: 'Thôn 3, xã MNO',
    DienTich: 800,
    LoaiDat: 'Đất lâm nghiệp',
    MucDichSuDung: 'Trồng rừng sản xuất',
    ChuSoHuu: 'Hoàng Thị Dung',
    CCCD: '001234567893',
    DiaChiThuongTru: '567 Thôn 3, xã MNO',
    SoDienThoai: '0905678901',
    NguonGocSuDung: 'Nhà nước giao đất',
    ThoiHanSuDung: '50 năm (2050)',
    SoSoDo: 'BT004567',
    NgayCapSoDo: '2012-11-25',
    TrangThaiPhapLy: 'Đã cấp sổ đỏ',
    ToaDoX: '106.345678',
    ToaDoY: '10.456789',
    LoThoBan: 'Đất xanh',
    HanCheSuDung: 'Rừng phòng hộ, không được khai thác'
  },
  {
    MaThua: '890',
    SoTo: '56',
    DiaChiThuaDat: 'Khu phố 5, phường PQR',
    DienTich: 320,
    LoaiDat: 'Đất ở',
    MucDichSuDung: 'Đất ở tại đô thị',
    ChuSoHuu: 'Lê Văn Em',
    CCCD: '001234567894',
    DiaChiThuongTru: '890 Đường PQR',
    SoDienThoai: '0906789012',
    NguonGocSuDung: 'Thừa kế',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: 'BT005678',
    NgayCapSoDo: '2022-02-14',
    TrangThaiPhapLy: 'Đã cấp sổ đỏ',
    ToaDoX: '106.678901',
    ToaDoY: '10.789012',
    LoThoBan: 'Đất vàng',
    HanCheSuDung: 'Không'
  },
  {
    MaThua: '345',
    SoTo: '78',
    DiaChiThuaDat: 'Khu đô thị mới STU',
    DienTich: 400,
    LoaiDat: 'Đất ở',
    MucDichSuDung: 'Đất ở tại đô thị',
    ChuSoHuu: 'Nguyễn Thị Giang',
    CCCD: '001234567895',
    DiaChiThuongTru: '345 KĐT STU',
    SoDienThoai: '0907890123',
    NguonGocSuDung: 'Nhà nước giao đất có thu tiền',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: '',
    NgayCapSoDo: '',
    TrangThaiPhapLy: 'Chờ cấp sổ',
    ToaDoX: '106.789012',
    ToaDoY: '10.890123',
    LoThoBan: 'Đất đỏ',
    HanCheSuDung: 'Theo quy hoạch khu đô thị'
  }
];

const loaiDatOptions = ['Đất ở', 'Đất nông nghiệp', 'Đất lâm nghiệp', 'Đất công nghiệp', 'Đất thương mại', 'Khác'];
const trangThaiOptions = ['Đã cấp sổ đỏ', 'Đang làm sổ đỏ', 'Chờ cấp sổ', 'Chưa làm sổ'];

export default function TraCuuDatPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<string>('all');
  const [filterLoaiDat, setFilterLoaiDat] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [selectedThua, setSelectedThua] = useState<ThongTinDat | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const filteredData = mockThongTinDat.filter((item) => {
    let matchesSearch = false;
    if (searchQuery === '') {
      matchesSearch = true;
    } else if (searchType === 'all') {
      matchesSearch =
        item.MaThua.includes(searchQuery) ||
        item.SoTo.includes(searchQuery) ||
        item.ChuSoHuu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.CCCD.includes(searchQuery) ||
        item.SoSoDo.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === 'thua') {
      matchesSearch = item.MaThua.includes(searchQuery);
    } else if (searchType === 'to') {
      matchesSearch = item.SoTo.includes(searchQuery);
    } else if (searchType === 'chusohu') {
      matchesSearch = item.ChuSoHuu.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === 'cccd') {
      matchesSearch = item.CCCD.includes(searchQuery);
    } else if (searchType === 'sodo') {
      matchesSearch = item.SoSoDo.toLowerCase().includes(searchQuery.toLowerCase());
    }

    const matchesLoaiDat = filterLoaiDat === 'all' || item.LoaiDat === filterLoaiDat;
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThaiPhapLy === filterTrangThai;
    return matchesSearch && matchesLoaiDat && matchesTrangThai;
  });

  const stats = {
    tongHoSo: mockThongTinDat.length,
    daCo: mockThongTinDat.filter(r => r.TrangThaiPhapLy === 'Đã cấp sổ đỏ').length,
    chuaCo: mockThongTinDat.filter(r => r.TrangThaiPhapLy !== 'Đã cấp sổ đỏ').length,
    tongDienTich: mockThongTinDat.reduce((sum, r) => sum + r.DienTich, 0),
    chuSoHuu: new Set(mockThongTinDat.map(r => r.CCCD)).size,
    datO: mockThongTinDat.filter(r => r.LoaiDat === 'Đất ở').length
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã cấp sổ đỏ': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang làm sổ đỏ': return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ cấp sổ': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getLoaiDatBadge = (loaiDat: string) => {
    switch (loaiDat) {
      case 'Đất ở': return <Badge className="bg-rose-500 hover:bg-rose-600"><Home className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
      case 'Đất nông nghiệp': return <Badge className="bg-green-500 hover:bg-green-600"><TreePine className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
      case 'Đất lâm nghiệp': return <Badge className="bg-emerald-600 hover:bg-emerald-700"><TreePine className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
      case 'Đất công nghiệp': return <Badge className="bg-purple-500 hover:bg-purple-600"><Layers className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
      default: return <Badge variant="outline">{loaiDat}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <FileSearch className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Tra cứu Hồ sơ Địa chính</h1>
            <p className="text-teal-100">Tra cứu thông tin thửa đất, sổ đỏ, chủ sở hữu</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-500" />
              <span className="text-2xl font-bold">{stats.tongHoSo}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã có sổ đỏ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daCo}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chưa có sổ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.chuaCo}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chủ sở hữu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.chuSoHuu}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đất ở đô thị</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-rose-500" />
              <span className="text-2xl font-bold">{stats.datO}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng DT (m²)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.tongDienTich.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm thông tin đất đai
          </CardTitle>
          <CardDescription>Nhập thông tin để tra cứu hồ sơ địa chính</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại tìm kiếm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="thua">Mã thửa</SelectItem>
                <SelectItem value="to">Số tờ bản đồ</SelectItem>
                <SelectItem value="chusohu">Tên chủ sở hữu</SelectItem>
                <SelectItem value="cccd">Số CCCD</SelectItem>
                <SelectItem value="sodo">Số sổ đỏ</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nhập thông tin tra cứu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoaiDat} onValueChange={setFilterLoaiDat}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại đất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại đất</SelectItem>
                {loaiDatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
          <CardTitle>Kết quả tra cứu</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} thửa đất</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thửa/Tờ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Loại đất</TableHead>
                <TableHead>Diện tích</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead>Số sổ đỏ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={`${item.MaThua}-${item.SoTo}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {item.MaThua} / {item.SoTo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={item.DiaChiThuaDat}>
                      {item.DiaChiThuaDat}
                    </div>
                  </TableCell>
                  <TableCell>{getLoaiDatBadge(item.LoaiDat)}</TableCell>
                  <TableCell className="font-medium">{item.DienTich.toLocaleString()} m²</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3" />
                      {item.ChuSoHuu}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.SoSoDo ? (
                      <span className="text-primary font-medium">{item.SoSoDo}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThaiPhapLy)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <Dialog open={isViewOpen && selectedThua?.MaThua === item.MaThua} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedThua(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedThua(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết thửa đất</DialogTitle>
                            <DialogDescription>Thửa {item.MaThua}, Tờ bản đồ {item.SoTo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="col-span-2 border-b pb-4 mb-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Thông tin thửa đất
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                                  <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Diện tích</p>
                                  <p className="font-medium">{item.DienTich.toLocaleString()} m²</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Loại đất</p>
                                  {getLoaiDatBadge(item.LoaiDat)}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Mục đích sử dụng</p>
                                  <p className="font-medium">{item.MucDichSuDung}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                                  <p className="font-medium">{item.DiaChiThuaDat}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Tọa độ X</p>
                                  <p className="font-medium">{item.ToaDoX}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Tọa độ Y</p>
                                  <p className="font-medium">{item.ToaDoY}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Lô thổ bản</p>
                                  <p className="font-medium">{item.LoThoBan}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Hạn chế sử dụng</p>
                                  <p className="font-medium">{item.HanCheSuDung}</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-2 border-b pb-4 mb-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Thông tin chủ sở hữu
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.ChuSoHuu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số CCCD</p>
                                  <p className="font-medium">{item.CCCD}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                                  <p className="font-medium">{item.SoDienThoai}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Địa chỉ thường trú</p>
                                  <p className="font-medium">{item.DiaChiThuongTru}</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Thông tin pháp lý
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Nguồn gốc sử dụng</p>
                                  <p className="font-medium">{item.NguonGocSuDung}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Thời hạn sử dụng</p>
                                  <p className="font-medium">{item.ThoiHanSuDung}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số sổ đỏ</p>
                                  <p className="font-medium">{item.SoSoDo || 'Chưa cấp'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày cấp</p>
                                  <p className="font-medium">{item.NgayCapSoDo || 'Chưa cấp'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Trạng thái pháp lý</p>
                                  {getTrangThaiBadge(item.TrangThaiPhapLy)}
                                </div>
                              </div>
                            </div>
                          </div>
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

      {/* Hướng dẫn tra cứu */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <FileSearch className="h-5 w-5" />
            Hướng dẫn tra cứu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Có thể tra cứu theo mã thửa, số tờ bản đồ, tên chủ sở hữu, số CCCD hoặc số sổ đỏ</li>
            <li>Sử dụng bộ lọc để thu hẹp phạm vi tìm kiếm theo loại đất hoặc trạng thái pháp lý</li>
            <li>Nhấn vào biểu tượng <Eye className="inline h-3 w-3" /> để xem chi tiết thông tin thửa đất</li>
            <li>Xuất Excel để lưu trữ và báo cáo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
