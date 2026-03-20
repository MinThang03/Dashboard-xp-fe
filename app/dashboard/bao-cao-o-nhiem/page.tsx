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
  AlertTriangle, AlertCircle, Clock, CheckCircle2, Search, Plus, Download, Eye, Edit,
  MapPin, Calendar, User, Phone, FileText, Trash2
} from 'lucide-react';

// Mock data báo cáo ô nhiễm
interface BaoCaoONhiem {
  MaBaoCao: string;
  LoaiONhiem: string;
  NguonONhiem: string;
  DiaDiem: string;
  KhuVuc: string;
  MucDo: string;
  MoTa: string;
  NgayBaoCao: string;
  NguoiBaoCao: string;
  SoDienThoai: string;
  TrangThai: string;
  NguoiXuLy: string;
  NgayXuLy: string;
  BienPhapXuLy: string;
  KetQuaXuLy: string;
  GhiChu: string;
}

const mockBaoCaoONhiem: BaoCaoONhiem[] = [
  {
    MaBaoCao: 'ON001',
    LoaiONhiem: 'Không khí',
    NguonONhiem: 'Nhà máy sản xuất',
    DiaDiem: 'Khu công nghiệp địa phương',
    KhuVuc: 'Khu vực 5',
    MucDo: 'Nghiêm trọng',
    MoTa: 'Khí thải đen từ ống khói nhà máy, mùi hắc nồng',
    NgayBaoCao: '2026-01-28',
    NguoiBaoCao: 'Nguyễn Văn A',
    SoDienThoai: '0901234567',
    TrangThai: 'Đang xử lý',
    NguoiXuLy: 'Trần Minh B',
    NgayXuLy: '2026-01-29',
    BienPhapXuLy: 'Kiểm tra thực địa, yêu cầu nhà máy khắc phục',
    KetQuaXuLy: '',
    GhiChu: 'Cần theo dõi thêm'
  },
  {
    MaBaoCao: 'ON002',
    LoaiONhiem: 'Nước',
    NguonONhiem: 'Xả thải trái phép',
    DiaDiem: 'Đoạn sông phía Bắc',
    KhuVuc: 'Khu vực 3',
    MucDo: 'Trung bình',
    MoTa: 'Nước sông đổi màu đen, có mùi hôi tanh',
    NgayBaoCao: '2026-01-25',
    NguoiBaoCao: 'Lê Thị C',
    SoDienThoai: '0912345678',
    TrangThai: 'Đã xử lý',
    NguoiXuLy: 'Phạm Văn D',
    NgayXuLy: '2026-01-26',
    BienPhapXuLy: 'Xác định nguồn xả thải, xử phạt vi phạm',
    KetQuaXuLy: 'Đã xử phạt hành chính, yêu cầu khắc phục',
    GhiChu: ''
  },
  {
    MaBaoCao: 'ON003',
    LoaiONhiem: 'Tiếng ồn',
    NguonONhiem: 'Quán karaoke',
    DiaDiem: 'Số 45 đường Trần Phú',
    KhuVuc: 'Khu vực 1',
    MucDo: 'Nhẹ',
    MoTa: 'Quán karaoke mở nhạc lớn sau 22h',
    NgayBaoCao: '2026-01-27',
    NguoiBaoCao: 'Trần Văn E',
    SoDienThoai: '0923456789',
    TrangThai: 'Đang xử lý',
    NguoiXuLy: 'Nguyễn Thị F',
    NgayXuLy: '',
    BienPhapXuLy: 'Nhắc nhở lần đầu',
    KetQuaXuLy: '',
    GhiChu: ''
  },
  {
    MaBaoCao: 'ON004',
    LoaiONhiem: 'Rác thải',
    NguonONhiem: 'Đổ rác trái phép',
    DiaDiem: 'Bãi đất trống cuối đường',
    KhuVuc: 'Khu vực 4',
    MucDo: 'Trung bình',
    MoTa: 'Bãi rác tự phát, có mùi hôi thối',
    NgayBaoCao: '2026-01-20',
    NguoiBaoCao: 'Hoàng Văn G',
    SoDienThoai: '0934567890',
    TrangThai: 'Đã xử lý',
    NguoiXuLy: 'Lê Minh H',
    NgayXuLy: '2026-01-22',
    BienPhapXuLy: 'Thu gom rác, lập biên bản vi phạm',
    KetQuaXuLy: 'Đã thu gom, phạt đối tượng vi phạm',
    GhiChu: ''
  },
  {
    MaBaoCao: 'ON005',
    LoaiONhiem: 'Không khí',
    NguonONhiem: 'Đốt rác',
    DiaDiem: 'Khu vực ngoài đê',
    KhuVuc: 'Khu vực 4',
    MucDo: 'Nghiêm trọng',
    MoTa: 'Đốt rác thải công nghiệp, khói đen dày đặc',
    NgayBaoCao: '2026-01-29',
    NguoiBaoCao: 'Vũ Thị I',
    SoDienThoai: '0945678901',
    TrangThai: 'Tiếp nhận',
    NguoiXuLy: '',
    NgayXuLy: '',
    BienPhapXuLy: '',
    KetQuaXuLy: '',
    GhiChu: 'Cần xử lý khẩn cấp'
  },
  {
    MaBaoCao: 'ON006',
    LoaiONhiem: 'Nước',
    NguonONhiem: 'Hóa chất nông nghiệp',
    DiaDiem: 'Kênh mương cánh đồng B',
    KhuVuc: 'Khu vực 4',
    MucDo: 'Nhẹ',
    MoTa: 'Nghi có thuốc trừ sâu rửa trôi xuống kênh',
    NgayBaoCao: '2026-01-26',
    NguoiBaoCao: 'Đinh Văn K',
    SoDienThoai: '0956789012',
    TrangThai: 'Đã xử lý',
    NguoiXuLy: 'Nguyễn Văn L',
    NgayXuLy: '2026-01-27',
    BienPhapXuLy: 'Lấy mẫu xét nghiệm, hướng dẫn nông dân',
    KetQuaXuLy: 'Nồng độ trong ngưỡng, đã tuyên truyền',
    GhiChu: ''
  }
];

const loaiONhiemOptions = ['Không khí', 'Nước', 'Tiếng ồn', 'Rác thải', 'Đất', 'Khác'];
const mucDoOptions = ['Nhẹ', 'Trung bình', 'Nghiêm trọng'];
const trangThaiOptions = ['Tiếp nhận', 'Đang xử lý', 'Đã xử lý', 'Từ chối'];

export default function BaoCaoONhiemPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterMucDo, setFilterMucDo] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BaoCaoONhiem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredData = mockBaoCaoONhiem.filter((item) => {
    const matchesSearch =
      item.MaBaoCao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaDiem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.NguoiBaoCao.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiONhiem === filterLoai;
    const matchesMucDo = filterMucDo === 'all' || item.MucDo === filterMucDo;
    const matchesStatus = filterStatus === 'all' || item.TrangThai === filterStatus;
    return matchesSearch && matchesLoai && matchesMucDo && matchesStatus;
  });

  const stats = {
    tongBaoCao: mockBaoCaoONhiem.length,
    tiepNhan: mockBaoCaoONhiem.filter(r => r.TrangThai === 'Tiếp nhận').length,
    dangXuLy: mockBaoCaoONhiem.filter(r => r.TrangThai === 'Đang xử lý').length,
    daXuLy: mockBaoCaoONhiem.filter(r => r.TrangThai === 'Đã xử lý').length,
    nghiemTrong: mockBaoCaoONhiem.filter(r => r.MucDo === 'Nghiêm trọng').length
  };

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Nhẹ': return <Badge className="bg-green-500 hover:bg-green-600">{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600">{mucDo}</Badge>;
      case 'Nghiêm trọng': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      default: return <Badge variant="secondary">{mucDo}</Badge>;
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Tiếp nhận': return <Badge className="bg-blue-500 hover:bg-blue-600"><FileText className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đã xử lý': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Từ chối': return <Badge variant="destructive">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getLoaiIcon = (loai: string) => {
    switch (loai) {
      case 'Không khí': return '💨';
      case 'Nước': return '💧';
      case 'Tiếng ồn': return '🔊';
      case 'Rác thải': return '🗑️';
      case 'Đất': return '🌍';
      default: return '⚠️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-status-danger to-primary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Báo cáo Ô nhiễm Môi trường</h1>
              <p className="text-red-100">Tiếp nhận và xử lý các báo cáo ô nhiễm từ người dân</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-red-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Tiếp nhận báo cáo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tiếp nhận báo cáo ô nhiễm mới</DialogTitle>
                <DialogDescription>Nhập thông tin báo cáo ô nhiễm từ người dân</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại ô nhiễm *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiONhiemOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nguồn ô nhiễm</Label>
                  <Input placeholder="Nguồn gây ô nhiễm" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa điểm *</Label>
                  <Input placeholder="Nhập địa điểm xảy ra ô nhiễm" />
                </div>
                <div className="space-y-2">
                  <Label>Khu vực</Label>
                  <Input placeholder="Khu vực" />
                </div>
                <div className="space-y-2">
                  <Label>Mức độ *</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Chọn mức độ" /></SelectTrigger>
                    <SelectContent>
                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Mô tả chi tiết *</Label>
                  <Textarea placeholder="Mô tả tình trạng ô nhiễm" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Người báo cáo *</Label>
                  <Input placeholder="Họ tên" />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại *</Label>
                  <Input placeholder="0912345678" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Ghi chú thêm" />
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.tongBaoCao}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mới tiếp nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.tiepNhan}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.dangXuLy}</span>
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

        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nghiêm trọng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">{stats.nghiemTrong}</span>
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
                placeholder="Tìm theo mã, địa điểm, người báo cáo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiONhiemOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMucDo} onValueChange={setFilterMucDo}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
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
          <CardTitle>Danh sách báo cáo ô nhiễm</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} báo cáo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaBaoCao}>
                  <TableCell className="font-medium text-primary">{item.MaBaoCao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getLoaiIcon(item.LoaiONhiem)}</span>
                      <span>{item.LoaiONhiem}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.DiaDiem}</div>
                      <div className="text-xs text-muted-foreground">{item.NguonONhiem}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.NguoiBaoCao}</div>
                      <div className="text-xs text-muted-foreground">{item.SoDienThoai}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.NgayBaoCao}</TableCell>
                  <TableCell>{getMucDoBadge(item.MucDo)}</TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Dialog open={isViewOpen && selectedItem?.MaBaoCao === item.MaBaoCao} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedItem(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết báo cáo ô nhiễm</DialogTitle>
                            <DialogDescription>Mã: {item.MaBaoCao}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại ô nhiễm</p>
                              <p className="font-medium">{getLoaiIcon(item.LoaiONhiem)} {item.LoaiONhiem}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Nguồn ô nhiễm</p>
                              <p className="font-medium">{item.NguonONhiem}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa điểm</p>
                              <p className="font-medium">{item.DiaDiem} - {item.KhuVuc}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mức độ</p>
                              {getMucDoBadge(item.MucDo)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Mô tả</p>
                              <p className="font-medium">{item.MoTa}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Người báo cáo</p>
                              <p className="font-medium">{item.NguoiBaoCao}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số điện thoại</p>
                              <p className="font-medium">{item.SoDienThoai}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày báo cáo</p>
                              <p className="font-medium">{item.NgayBaoCao}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Người xử lý</p>
                              <p className="font-medium">{item.NguoiXuLy || 'Chưa phân công'}</p>
                            </div>
                            {item.BienPhapXuLy && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Biện pháp xử lý</p>
                                <p className="font-medium">{item.BienPhapXuLy}</p>
                              </div>
                            )}
                            {item.KetQuaXuLy && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Kết quả xử lý</p>
                                <p className="font-medium">{item.KetQuaXuLy}</p>
                              </div>
                            )}
                            {item.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium text-amber-600">{item.GhiChu}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isEditOpen && selectedItem?.MaBaoCao === item.MaBaoCao} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedItem(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật báo cáo ô nhiễm</DialogTitle>
                            <DialogDescription>Mã: {item.MaBaoCao}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin ô nhiễm</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại ô nhiễm</Label>
                                  <Input defaultValue={item.LoaiONhiem} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Nguồn ô nhiễm</Label>
                                  <Input defaultValue={item.NguonONhiem} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Địa điểm</Label>
                                  <Input defaultValue={item.DiaDiem} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Khu vực</Label>
                                  <Input defaultValue={item.KhuVuc} />
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
                                  <Label>Trạng thái</Label>
                                  <Select defaultValue={item.TrangThai}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Mô tả</Label>
                                  <Textarea defaultValue={item.MoTa} rows={2} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Người báo cáo</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Họ tên</Label>
                                  <Input defaultValue={item.NguoiBaoCao} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số điện thoại</Label>
                                  <Input defaultValue={item.SoDienThoai} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày báo cáo</Label>
                                  <Input type="date" defaultValue={item.NgayBaoCao} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Xử lý báo cáo</h4>
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <Label>Người xử lý</Label>
                                  <Input defaultValue={item.NguoiXuLy} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Biện pháp xử lý</Label>
                                  <Textarea defaultValue={item.BienPhapXuLy} rows={2} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Kết quả xử lý</Label>
                                  <Textarea defaultValue={item.KetQuaXuLy} rows={2} />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Ghi chú</Label>
                              <Textarea defaultValue={item.GhiChu} rows={2} />
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
