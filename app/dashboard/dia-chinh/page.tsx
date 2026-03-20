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
  MapPin,
  Search,
  Plus,
  Download,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Eye,
  Edit,
  Map,
  Building2,
  LandPlot,
  Scale,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

// Mock data theo database schema DiaChinhHoSo
interface DiaChinhHoSo {
  MaHoSo: string;
  MaThua: string;
  SoTo: string;
  DienTich: number;
  LoaiDat: string;
  MucDichSuDung: string;
  ChuSoHuu: string;
  CCCD: string;
  DiaChiThuaDat: string;
  ToaDoX: number;
  ToaDoY: number;
  NguonGocSuDung: string;
  ThoiHanSuDung: string;
  SoSoDo: string;
  NgayCapSoDo: string;
  NgayNhapLieu: string;
  CanBoNhapLieu: string;
  TrangThai: string;
  GhiChu: string;
}

const mockDiaChinhData: DiaChinhHoSo[] = [
  {
    MaHoSo: 'DC001',
    MaThua: '123/45',
    SoTo: 'Tờ 15',
    DienTich: 120.5,
    LoaiDat: 'Đất ở',
    MucDichSuDung: 'Đất ở đô thị',
    ChuSoHuu: 'Nguyễn Văn An',
    CCCD: '001234567890',
    DiaChiThuaDat: 'Số 15, Đường Trần Phú, Khu phố 3',
    ToaDoX: 21.0285,
    ToaDoY: 105.8542,
    NguonGocSuDung: 'Nhà nước giao có thu tiền',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: 'AO 123456',
    NgayCapSoDo: '2020-05-15',
    NgayNhapLieu: '2024-01-15',
    CanBoNhapLieu: 'Trần Văn Bình',
    TrangThai: 'Đã cấp sổ',
    GhiChu: 'Hồ sơ đầy đủ'
  },
  {
    MaHoSo: 'DC002',
    MaThua: '156/78',
    SoTo: 'Tờ 12',
    DienTich: 85.3,
    LoaiDat: 'Đất nông nghiệp',
    MucDichSuDung: 'Đất trồng cây hàng năm',
    ChuSoHuu: 'Trần Thị Bình',
    CCCD: '001234567891',
    DiaChiThuaDat: 'Khu đồng A, Thôn 2',
    ToaDoX: 21.0290,
    ToaDoY: 105.8550,
    NguonGocSuDung: 'Nhà nước giao không thu tiền',
    ThoiHanSuDung: '50 năm',
    SoSoDo: '',
    NgayCapSoDo: '',
    NgayNhapLieu: '2024-01-16',
    CanBoNhapLieu: 'Nguyễn Thị Lan',
    TrangThai: 'Chờ cấp sổ',
    GhiChu: 'Đang chờ xác minh nguồn gốc'
  },
  {
    MaHoSo: 'DC003',
    MaThua: '234/12',
    SoTo: 'Tờ 18',
    DienTich: 200.0,
    LoaiDat: 'Đất thương mại',
    MucDichSuDung: 'Đất thương mại dịch vụ',
    ChuSoHuu: 'Công ty TNHH ABC',
    CCCD: '0100123456',
    DiaChiThuaDat: 'Số 45, Đường Lê Lợi, Khu phố 1',
    ToaDoX: 21.0275,
    ToaDoY: 105.8530,
    NguonGocSuDung: 'Nhà nước cho thuê đất',
    ThoiHanSuDung: '50 năm',
    SoSoDo: '',
    NgayCapSoDo: '',
    NgayNhapLieu: '2024-01-17',
    CanBoNhapLieu: 'Lê Văn Cường',
    TrangThai: 'Tranh chấp',
    GhiChu: 'Có tranh chấp ranh giới với thửa liền kề'
  },
  {
    MaHoSo: 'DC004',
    MaThua: '345/67',
    SoTo: 'Tờ 20',
    DienTich: 150.8,
    LoaiDat: 'Đất ở',
    MucDichSuDung: 'Đất ở nông thôn',
    ChuSoHuu: 'Phạm Thị Dung',
    CCCD: '001234567892',
    DiaChiThuaDat: 'Thôn 3, Xã ABC',
    ToaDoX: 21.0265,
    ToaDoY: 105.8520,
    NguonGocSuDung: 'Thừa kế quyền sử dụng đất',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: '',
    NgayCapSoDo: '',
    NgayNhapLieu: '2024-01-18',
    CanBoNhapLieu: 'Trần Văn Bình',
    TrangThai: 'Đang xử lý',
    GhiChu: 'Đang thẩm định hồ sơ'
  },
  {
    MaHoSo: 'DC005',
    MaThua: '456/89',
    SoTo: 'Tờ 22',
    DienTich: 300.0,
    LoaiDat: 'Đất công cộng',
    MucDichSuDung: 'Đất xây dựng công trình công cộng',
    ChuSoHuu: 'UBND Xã/Phường',
    CCCD: '',
    DiaChiThuaDat: 'Khu trung tâm, Khu phố 2',
    ToaDoX: 21.0295,
    ToaDoY: 105.8560,
    NguonGocSuDung: 'Đất quản lý nhà nước',
    ThoiHanSuDung: 'Không xác định',
    SoSoDo: 'CN 789012',
    NgayCapSoDo: '2018-03-20',
    NgayNhapLieu: '2024-01-10',
    CanBoNhapLieu: 'Nguyễn Thị Lan',
    TrangThai: 'Đã cấp sổ',
    GhiChu: 'Đất công viên cây xanh'
  },
  {
    MaHoSo: 'DC006',
    MaThua: '567/90',
    SoTo: 'Tờ 25',
    DienTich: 95.2,
    LoaiDat: 'Đất ở',
    MucDichSuDung: 'Đất ở đô thị',
    ChuSoHuu: 'Hoàng Văn Em',
    CCCD: '001234567893',
    DiaChiThuaDat: 'Số 78, Đường Nguyễn Huệ, Khu phố 4',
    ToaDoX: 21.0280,
    ToaDoY: 105.8545,
    NguonGocSuDung: 'Chuyển nhượng quyền sử dụng đất',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: 'AO 654321',
    NgayCapSoDo: '2022-08-10',
    NgayNhapLieu: '2024-01-20',
    CanBoNhapLieu: 'Lê Văn Cường',
    TrangThai: 'Đã cấp sổ',
    GhiChu: ''
  },
  {
    MaHoSo: 'DC007',
    MaThua: '678/01',
    SoTo: 'Tờ 28',
    DienTich: 500.0,
    LoaiDat: 'Đất nông nghiệp',
    MucDichSuDung: 'Đất trồng cây lâu năm',
    ChuSoHuu: 'Nguyễn Thị Phương',
    CCCD: '001234567894',
    DiaChiThuaDat: 'Khu đồng B, Thôn 1',
    ToaDoX: 21.0260,
    ToaDoY: 105.8510,
    NguonGocSuDung: 'Nhà nước giao không thu tiền',
    ThoiHanSuDung: '50 năm',
    SoSoDo: 'AO 987654',
    NgayCapSoDo: '2021-12-05',
    NgayNhapLieu: '2024-01-22',
    CanBoNhapLieu: 'Trần Văn Bình',
    TrangThai: 'Đã cấp sổ',
    GhiChu: 'Vườn cây ăn trái'
  },
  {
    MaHoSo: 'DC008',
    MaThua: '789/12',
    SoTo: 'Tờ 30',
    DienTich: 180.5,
    LoaiDat: 'Đất hỗn hợp',
    MucDichSuDung: 'Đất ở kết hợp thương mại',
    ChuSoHuu: 'Lê Văn Giang',
    CCCD: '001234567895',
    DiaChiThuaDat: 'Số 123, Đường Hai Bà Trưng, Khu phố 5',
    ToaDoX: 21.0300,
    ToaDoY: 105.8570,
    NguonGocSuDung: 'Nhà nước giao có thu tiền',
    ThoiHanSuDung: 'Lâu dài',
    SoSoDo: '',
    NgayCapSoDo: '',
    NgayNhapLieu: '2024-01-25',
    CanBoNhapLieu: 'Nguyễn Thị Lan',
    TrangThai: 'Chờ cấp sổ',
    GhiChu: 'Hồ sơ hoàn thiện, chờ in sổ'
  }
];

const loaiDatOptions = ['Đất ở', 'Đất nông nghiệp', 'Đất thương mại', 'Đất công cộng', 'Đất hỗn hợp'];
const trangThaiOptions = ['Đã cấp sổ', 'Chờ cấp sổ', 'Đang xử lý', 'Tranh chấp'];

export default function DiaChinhPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLoaiDat, setFilterLoaiDat] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<DiaChinhHoSo | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredRecords = mockDiaChinhData.filter((record) => {
    const matchesSearch =
      record.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ChuSoHuu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.MaThua.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.DiaChiThuaDat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.TrangThai === filterStatus;
    const matchesLoaiDat = filterLoaiDat === 'all' || record.LoaiDat === filterLoaiDat;
    return matchesSearch && matchesStatus && matchesLoaiDat;
  });

  const stats = {
    total: mockDiaChinhData.length,
    daCap: mockDiaChinhData.filter((r) => r.TrangThai === 'Đã cấp sổ').length,
    choCap: mockDiaChinhData.filter((r) => r.TrangThai === 'Chờ cấp sổ').length,
    dangXuLy: mockDiaChinhData.filter((r) => r.TrangThai === 'Đang xử lý').length,
    tranhChap: mockDiaChinhData.filter((r) => r.TrangThai === 'Tranh chấp').length,
    tongDienTich: mockDiaChinhData.reduce((sum, r) => sum + r.DienTich, 0),
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã cấp sổ': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ cấp sổ': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-blue-500 hover:bg-blue-600"><ClipboardList className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Tranh chấp': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getLoaiDatBadge = (loaiDat: string) => {
    const colors: Record<string, string> = {
      'Đất ở': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Đất nông nghiệp': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Đất thương mại': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Đất công cộng': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      'Đất hỗn hợp': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    };
    return <Badge className={colors[loaiDat] || 'bg-gray-100 text-gray-800'}>{loaiDat}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Địa chính</h1>
              <p className="text-teal-100">Hồ sơ địa chính, cấp sổ đỏ, biến động đất đai</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
              <Map className="mr-2 h-4 w-4" />
              Xem bản đồ
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-teal-600 hover:bg-white/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm hồ sơ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Thêm hồ sơ địa chính mới</DialogTitle>
                  <DialogDescription>Nhập thông tin hồ sơ đất đai</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Mã thửa *</Label>
                    <Input placeholder="Nhập mã thửa" />
                  </div>
                  <div className="space-y-2">
                    <Label>Số tờ *</Label>
                    <Input placeholder="Nhập số tờ" />
                  </div>
                  <div className="space-y-2">
                    <Label>Diện tích (m²) *</Label>
                    <Input type="number" placeholder="Nhập diện tích" />
                  </div>
                  <div className="space-y-2">
                    <Label>Loại đất *</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Chọn loại đất" /></SelectTrigger>
                      <SelectContent>
                        {loaiDatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Mục đích sử dụng</Label>
                    <Input placeholder="Nhập mục đích sử dụng" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chủ sở hữu *</Label>
                    <Input placeholder="Nhập tên chủ sở hữu" />
                  </div>
                  <div className="space-y-2">
                    <Label>CCCD/Mã số DN</Label>
                    <Input placeholder="Nhập CCCD hoặc Mã số DN" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Địa chỉ thửa đất *</Label>
                    <Input placeholder="Nhập địa chỉ thửa đất" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tọa độ X</Label>
                    <Input type="number" step="0.0001" placeholder="Vĩ độ" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tọa độ Y</Label>
                    <Input type="number" step="0.0001" placeholder="Kinh độ" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nguồn gốc sử dụng</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Chọn nguồn gốc" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="giao-co-thu">Nhà nước giao có thu tiền</SelectItem>
                        <SelectItem value="giao-khong-thu">Nhà nước giao không thu tiền</SelectItem>
                        <SelectItem value="cho-thue">Nhà nước cho thuê đất</SelectItem>
                        <SelectItem value="chuyen-nhuong">Chuyển nhượng quyền sử dụng đất</SelectItem>
                        <SelectItem value="thua-ke">Thừa kế quyền sử dụng đất</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Thời hạn sử dụng</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Chọn thời hạn" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lau-dai">Lâu dài</SelectItem>
                        <SelectItem value="50-nam">50 năm</SelectItem>
                        <SelectItem value="khac">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                      <SelectContent>
                        {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cán bộ nhập liệu</Label>
                    <Input placeholder="Tên cán bộ" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Ghi chú</Label>
                    <Textarea placeholder="Nhập ghi chú" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                  <Button onClick={() => setIsAddOpen(false)}>Lưu hồ sơ</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã cấp sổ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daCap}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ cấp sổ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.choCap}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.dangXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tranh chấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.tranhChap}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng DT (m²)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <LandPlot className="h-5 w-5 text-cyan-500" />
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
                placeholder="Tìm theo mã, thửa, chủ sở hữu, địa chỉ..."
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
          <CardTitle>Danh sách hồ sơ địa chính</CardTitle>
          <CardDescription>Tìm thấy {filteredRecords.length} hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Thửa/Tờ</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead className="text-right">Diện tích</TableHead>
                <TableHead>Loại đất</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Số sổ đỏ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.MaHoSo}>
                  <TableCell className="font-medium text-primary">{record.MaHoSo}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{record.MaThua}</div>
                      <div className="text-muted-foreground">{record.SoTo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{record.ChuSoHuu}</div>
                        <div className="text-xs text-muted-foreground">{record.CCCD}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{record.DienTich} m²</TableCell>
                  <TableCell>{getLoaiDatBadge(record.LoaiDat)}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={record.DiaChiThuaDat}>
                    {record.DiaChiThuaDat}
                  </TableCell>
                  <TableCell>
                    {record.SoSoDo || <span className="text-muted-foreground">Chưa có</span>}
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(record.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedRecord?.MaHoSo === record.MaHoSo} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedRecord(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedRecord(record); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết hồ sơ địa chính</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {record.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa</p>
                              <p className="font-medium">{record.MaThua}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số tờ</p>
                              <p className="font-medium">{record.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diện tích</p>
                              <p className="font-medium">{record.DienTich} m²</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại đất</p>
                              <p className="font-medium">{record.LoaiDat}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Mục đích sử dụng</p>
                              <p className="font-medium">{record.MucDichSuDung}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Chủ sở hữu</p>
                              <p className="font-medium">{record.ChuSoHuu}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">CCCD/Mã số DN</p>
                              <p className="font-medium">{record.CCCD || '-'}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ thửa đất</p>
                              <p className="font-medium">{record.DiaChiThuaDat}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tọa độ</p>
                              <p className="font-medium">X: {record.ToaDoX}, Y: {record.ToaDoY}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Nguồn gốc sử dụng</p>
                              <p className="font-medium">{record.NguonGocSuDung}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Thời hạn sử dụng</p>
                              <p className="font-medium">{record.ThoiHanSuDung}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số sổ đỏ</p>
                              <p className="font-medium">{record.SoSoDo || 'Chưa cấp'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày cấp sổ đỏ</p>
                              <p className="font-medium">{record.NgayCapSoDo || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(record.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày nhập liệu</p>
                              <p className="font-medium">{record.NgayNhapLieu}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cán bộ nhập liệu</p>
                              <p className="font-medium">{record.CanBoNhapLieu}</p>
                            </div>
                            {record.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium">{record.GhiChu}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Dialog */}
                      <Dialog open={isEditOpen && selectedRecord?.MaHoSo === record.MaHoSo} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedRecord(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedRecord(record); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật hồ sơ địa chính</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {record.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Mã thửa</Label>
                              <Input defaultValue={record.MaThua} />
                            </div>
                            <div className="space-y-2">
                              <Label>Số tờ</Label>
                              <Input defaultValue={record.SoTo} />
                            </div>
                            <div className="space-y-2">
                              <Label>Diện tích (m²)</Label>
                              <Input type="number" defaultValue={record.DienTich} />
                            </div>
                            <div className="space-y-2">
                              <Label>Loại đất</Label>
                              <Select defaultValue={record.LoaiDat}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {loaiDatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Mục đích sử dụng</Label>
                              <Input defaultValue={record.MucDichSuDung} />
                            </div>
                            <div className="space-y-2">
                              <Label>Chủ sở hữu</Label>
                              <Input defaultValue={record.ChuSoHuu} />
                            </div>
                            <div className="space-y-2">
                              <Label>CCCD/Mã số DN</Label>
                              <Input defaultValue={record.CCCD} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Địa chỉ thửa đất</Label>
                              <Input defaultValue={record.DiaChiThuaDat} />
                            </div>
                            <div className="space-y-2">
                              <Label>Số sổ đỏ</Label>
                              <Input defaultValue={record.SoSoDo} />
                            </div>
                            <div className="space-y-2">
                              <Label>Ngày cấp sổ đỏ</Label>
                              <Input type="date" defaultValue={record.NgayCapSoDo} />
                            </div>
                            <div className="space-y-2">
                              <Label>Trạng thái</Label>
                              <Select defaultValue={record.TrangThai}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Cán bộ cập nhật</Label>
                              <Input defaultValue={record.CanBoNhapLieu} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Ghi chú</Label>
                              <Textarea defaultValue={record.GhiChu} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                            <Button onClick={() => setIsEditOpen(false)}>Cập nhật</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon">
                        <Map className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cảnh báo tranh chấp */}
      {stats.tranhChap > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo tranh chấp đất đai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Hiện có <strong>{stats.tranhChap}</strong> khu vực đang trong tình trạng tranh chấp. Cần xem xét và giải quyết sớm.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
