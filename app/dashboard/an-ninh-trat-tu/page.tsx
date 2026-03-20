'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, AlertTriangle, CheckCircle2, Clock, TrendingDown, TrendingUp,
  MapPin, Users, FileText, Eye, AlertCircle, Activity, BarChart3,
  Calendar, Building2, Target, Info
} from 'lucide-react';

// Mock data tổng hợp ANTT
const mockThongKeThang = [
  { Thang: 'T1/2025', SuKien: 45, XuLyXong: 42, DangXuLy: 3, TyLe: 93.3 },
  { Thang: 'T2/2025', SuKien: 38, XuLyXong: 35, DangXuLy: 3, TyLe: 92.1 },
  { Thang: 'T3/2025', SuKien: 52, XuLyXong: 48, DangXuLy: 4, TyLe: 92.3 },
  { Thang: 'T4/2025', SuKien: 41, XuLyXong: 39, DangXuLy: 2, TyLe: 95.1 },
  { Thang: 'T5/2025', SuKien: 35, XuLyXong: 33, DangXuLy: 2, TyLe: 94.3 },
  { Thang: 'T6/2025', SuKien: 48, XuLyXong: 45, DangXuLy: 3, TyLe: 93.8 },
];

const mockTheoLoai = [
  { LoaiViPham: 'Tranh chấp đất đai', SoVu: 28, TyLe: 23.3, TrangThai: 'Đang giảm' },
  { LoaiViPham: 'Mâu thuẫn hàng xóm', SoVu: 35, TyLe: 29.2, TrangThai: 'Ổn định' },
  { LoaiViPham: 'Vi phạm giao thông', SoVu: 22, TyLe: 18.3, TrangThai: 'Đang giảm' },
  { LoaiViPham: 'Trộm cắp', SoVu: 15, TyLe: 12.5, TrangThai: 'Giảm mạnh' },
  { LoaiViPham: 'Cờ bạc', SoVu: 8, TyLe: 6.7, TrangThai: 'Đang giảm' },
  { LoaiViPham: 'Khác', SoVu: 12, TyLe: 10.0, TrangThai: 'Ổn định' },
];

const mockTheoKhuVuc = [
  { KhuVuc: 'Khu phố 1', DiemNong: 2, SuKien: 18, TrangThai: 'Cần theo dõi' },
  { KhuVuc: 'Khu phố 2', DiemNong: 1, SuKien: 12, TrangThai: 'Ổn định' },
  { KhuVuc: 'Khu phố 3', DiemNong: 3, SuKien: 25, TrangThai: 'Cảnh báo' },
  { KhuVuc: 'Khu phố 4', DiemNong: 0, SuKien: 8, TrangThai: 'An toàn' },
  { KhuVuc: 'Khu phố 5', DiemNong: 1, SuKien: 15, TrangThai: 'Ổn định' },
  { KhuVuc: 'Khu phố 6', DiemNong: 2, SuKien: 22, TrangThai: 'Cần theo dõi' },
];

const mockSuKienGanDay = [
  { MaSK: 'SK001', NoiDung: 'Tranh chấp ranh giới đất', KhuVuc: 'Khu phố 3', MucDo: 'Cao', NgayPhatSinh: '2025-01-15', TrangThai: 'Đang xử lý', CanBo: 'Nguyễn Văn A' },
  { MaSK: 'SK002', NoiDung: 'Mâu thuẫn tiếng ồn', KhuVuc: 'Khu phố 1', MucDo: 'Thấp', NgayPhatSinh: '2025-01-14', TrangThai: 'Đã giải quyết', CanBo: 'Trần Thị B' },
  { MaSK: 'SK003', NoiDung: 'Vi phạm xây dựng lấn chiếm', KhuVuc: 'Khu phố 6', MucDo: 'Trung bình', NgayPhatSinh: '2025-01-14', TrangThai: 'Đang xử lý', CanBo: 'Lê Văn C' },
  { MaSK: 'SK004', NoiDung: 'Trộm cắp xe máy', KhuVuc: 'Khu phố 2', MucDo: 'Cao', NgayPhatSinh: '2025-01-13', TrangThai: 'Chuyển CA', CanBo: 'Phạm Thị D' },
  { MaSK: 'SK005', NoiDung: 'Gây rối trật tự công cộng', KhuVuc: 'Khu phố 3', MucDo: 'Trung bình', NgayPhatSinh: '2025-01-13', TrangThai: 'Đã giải quyết', CanBo: 'Nguyễn Văn E' },
];

const mockDiemNong = [
  { MaDN: 'DN001', TenDiaDiem: 'Ngã tư chợ', LoaiViPham: 'Mâu thuẫn kinh doanh', MucDo: 'Cao', SoVuThang: 5, TrangThai: 'Giám sát chặt' },
  { MaDN: 'DN002', TenDiaDiem: 'Khu dân cư mới', LoaiViPham: 'Tranh chấp đất', MucDo: 'Cao', SoVuThang: 4, TrangThai: 'Giám sát chặt' },
  { MaDN: 'DN003', TenDiaDiem: 'Trường học A', LoaiViPham: 'An ninh học đường', MucDo: 'Trung bình', SoVuThang: 2, TrangThai: 'Theo dõi' },
  { MaDN: 'DN004', TenDiaDiem: 'Công viên trung tâm', LoaiViPham: 'Trật tự công cộng', MucDo: 'Thấp', SoVuThang: 1, TrangThai: 'Bình thường' },
];

const mockDoiTuongTheoDoi = [
  { MaDT: 'DT001', HoTen: 'Nguyễn Văn X', LoaiDoiTuong: 'Tiền án', DiaChi: 'Khu phố 3', NgayBatDau: '2024-06-15', TrangThai: 'Đang giám sát' },
  { MaDT: 'DT002', HoTen: 'Trần Văn Y', LoaiDoiTuong: 'Nghiện MT', DiaChi: 'Khu phố 1', NgayBatDau: '2024-08-20', TrangThai: 'Đang cai nghiện' },
  { MaDT: 'DT003', HoTen: 'Lê Thị Z', LoaiDoiTuong: 'Tái phạm', DiaChi: 'Khu phố 6', NgayBatDau: '2024-11-10', TrangThai: 'Đang giám sát' },
];

export default function AnNinhTratTuPage() {
  const [kyBaoCao, setKyBaoCao] = useState('thang');
  const [selectedSuKien, setSelectedSuKien] = useState<typeof mockSuKienGanDay[0] | null>(null);

  // Tính toán thống kê tổng hợp
  const tongSuKien = mockThongKeThang.reduce((acc, item) => acc + item.SuKien, 0);
  const tongXuLyXong = mockThongKeThang.reduce((acc, item) => acc + item.XuLyXong, 0);
  const tongDangXuLy = mockThongKeThang.reduce((acc, item) => acc + item.DangXuLy, 0);
  const tyLeXuLy = ((tongXuLyXong / tongSuKien) * 100).toFixed(1);
  const tongDiemNong = mockDiemNong.length;
  const tongDoiTuong = mockDoiTuongTheoDoi.length;

  // So sánh với tháng trước
  const thangHienTai = mockThongKeThang[mockThongKeThang.length - 1];
  const thangTruoc = mockThongKeThang[mockThongKeThang.length - 2];
  const soSanh = thangHienTai && thangTruoc 
    ? (((thangHienTai.SuKien - thangTruoc.SuKien) / thangTruoc.SuKien) * 100).toFixed(1)
    : '0';

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Cao': return <Badge variant="destructive">{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600">{mucDo}</Badge>;
      case 'Thấp': return <Badge className="bg-green-500 hover:bg-green-600">{mucDo}</Badge>;
      default: return <Badge variant="secondary">{mucDo}</Badge>;
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đang xử lý': return <Badge className="bg-blue-500 hover:bg-blue-600">{trangThai}</Badge>;
      case 'Đã giải quyết': return <Badge className="bg-green-500 hover:bg-green-600">{trangThai}</Badge>;
      case 'Chuyển CA': return <Badge className="bg-purple-500 hover:bg-purple-600">{trangThai}</Badge>;
      case 'Cảnh báo': return <Badge variant="destructive">{trangThai}</Badge>;
      case 'An toàn': return <Badge className="bg-green-500 hover:bg-green-600">{trangThai}</Badge>;
      case 'Ổn định': return <Badge className="bg-blue-500 hover:bg-blue-600">{trangThai}</Badge>;
      case 'Cần theo dõi': return <Badge className="bg-amber-500 hover:bg-amber-600">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getXuHuongBadge = (trangThai: string) => {
    if (trangThai.includes('Giảm')) {
      return <Badge className="bg-green-500 hover:bg-green-600"><TrendingDown className="h-3 w-3 mr-1" />{trangThai}</Badge>;
    }
    if (trangThai.includes('Tăng')) {
      return <Badge variant="destructive"><TrendingUp className="h-3 w-3 mr-1" />{trangThai}</Badge>;
    }
    return <Badge variant="secondary">{trangThai}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-muted to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Dashboard An ninh Trật tự</h1>
            <p className="text-slate-100">Tổng hợp tình hình ANTT trên địa bàn xã/phường</p>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4">
        <Select value={kyBaoCao} onValueChange={setKyBaoCao}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kỳ báo cáo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tuan">Tuần này</SelectItem>
            <SelectItem value="thang">Tháng này</SelectItem>
            <SelectItem value="quy">Quý này</SelectItem>
            <SelectItem value="nam">Năm nay</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng sự kiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{tongSuKien}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">6 tháng gần nhất</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{tongXuLyXong}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{tyLeXuLy}% tỷ lệ</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{tongDangXuLy}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cần theo dõi</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Điểm nóng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{tongDiemNong}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Đang giám sát</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đối tượng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{tongDoiTuong}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Đang theo dõi</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${parseFloat(soSanh) < 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">So với tháng trước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {parseFloat(soSanh) < 0 ? (
                <TrendingDown className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingUp className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-2xl font-bold ${parseFloat(soSanh) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {soSanh}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{parseFloat(soSanh) < 0 ? 'Giảm' : 'Tăng'} sự kiện</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs nội dung chi tiết */}
      <Tabs defaultValue="tong-hop" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tong-hop">Tổng hợp</TabsTrigger>
          <TabsTrigger value="theo-loai">Theo loại</TabsTrigger>
          <TabsTrigger value="theo-khu-vuc">Theo khu vực</TabsTrigger>
          <TabsTrigger value="diem-nong">Điểm nóng</TabsTrigger>
          <TabsTrigger value="doi-tuong">Đối tượng</TabsTrigger>
        </TabsList>

        {/* Tab Tổng hợp */}
        <TabsContent value="tong-hop" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sự kiện gần đây */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sự kiện gần đây
                </CardTitle>
                <CardDescription>Các sự kiện ANTT mới nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nội dung</TableHead>
                      <TableHead>Mức độ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSuKienGanDay.map((sk) => (
                      <TableRow key={sk.MaSK}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sk.NoiDung}</p>
                            <p className="text-xs text-muted-foreground">{sk.KhuVuc} - {sk.NgayPhatSinh}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getMucDoBadge(sk.MucDo)}</TableCell>
                        <TableCell>{getTrangThaiBadge(sk.TrangThai)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedSuKien(sk)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Chi tiết sự kiện</DialogTitle>
                                <DialogDescription>Thông tin chi tiết về sự kiện ANTT</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div><strong>Mã sự kiện:</strong> {sk.MaSK}</div>
                                  <div><strong>Ngày phát sinh:</strong> {sk.NgayPhatSinh}</div>
                                  <div className="col-span-2"><strong>Nội dung:</strong> {sk.NoiDung}</div>
                                  <div><strong>Khu vực:</strong> {sk.KhuVuc}</div>
                                  <div><strong>Mức độ:</strong> {getMucDoBadge(sk.MucDo)}</div>
                                  <div><strong>Trạng thái:</strong> {getTrangThaiBadge(sk.TrangThai)}</div>
                                  <div><strong>Cán bộ xử lý:</strong> {sk.CanBo}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Thống kê theo tháng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Thống kê theo tháng
                </CardTitle>
                <CardDescription>Diễn biến tình hình ANTT 6 tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tháng</TableHead>
                      <TableHead className="text-right">Sự kiện</TableHead>
                      <TableHead className="text-right">Xử lý xong</TableHead>
                      <TableHead className="text-right">Tỷ lệ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockThongKeThang.map((item) => (
                      <TableRow key={item.Thang}>
                        <TableCell className="font-medium">{item.Thang}</TableCell>
                        <TableCell className="text-right">{item.SuKien}</TableCell>
                        <TableCell className="text-right text-green-600">{item.XuLyXong}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={item.TyLe} className="w-16 h-2" />
                            <span className="text-sm">{item.TyLe}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Theo loại */}
        <TabsContent value="theo-loai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Phân loại sự kiện ANTT
              </CardTitle>
              <CardDescription>Thống kê theo loại vi phạm/sự kiện</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại vi phạm</TableHead>
                    <TableHead className="text-right">Số vụ</TableHead>
                    <TableHead className="text-right">Tỷ lệ</TableHead>
                    <TableHead>Xu hướng</TableHead>
                    <TableHead>Biểu đồ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTheoLoai.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.LoaiViPham}</TableCell>
                      <TableCell className="text-right">{item.SoVu}</TableCell>
                      <TableCell className="text-right">{item.TyLe}%</TableCell>
                      <TableCell>{getXuHuongBadge(item.TrangThai)}</TableCell>
                      <TableCell>
                        <Progress value={item.TyLe} className="w-24 h-2" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Theo khu vực */}
        <TabsContent value="theo-khu-vuc">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Tình hình theo khu vực
              </CardTitle>
              <CardDescription>Phân bố sự kiện ANTT theo địa bàn</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khu vực</TableHead>
                    <TableHead className="text-right">Điểm nóng</TableHead>
                    <TableHead className="text-right">Sự kiện</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Mức độ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTheoKhuVuc.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {item.KhuVuc}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.DiemNong > 0 ? (
                          <Badge variant="destructive">{item.DiemNong}</Badge>
                        ) : (
                          <Badge className="bg-green-500">{item.DiemNong}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{item.SuKien}</TableCell>
                      <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                      <TableCell>
                        <Progress 
                          value={(item.SuKien / 30) * 100} 
                          className={`w-20 h-2 ${item.SuKien > 20 ? '[&>div]:bg-red-500' : item.SuKien > 10 ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500'}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Điểm nóng */}
        <TabsContent value="diem-nong">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Danh sách điểm nóng ANTT
              </CardTitle>
              <CardDescription>Các địa điểm cần tập trung giám sát</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Loại vi phạm</TableHead>
                    <TableHead>Mức độ</TableHead>
                    <TableHead className="text-right">Số vụ/tháng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDiemNong.map((item) => (
                    <TableRow key={item.MaDN}>
                      <TableCell className="font-medium">{item.MaDN}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          {item.TenDiaDiem}
                        </div>
                      </TableCell>
                      <TableCell>{item.LoaiViPham}</TableCell>
                      <TableCell>{getMucDoBadge(item.MucDo)}</TableCell>
                      <TableCell className="text-right">{item.SoVuThang}</TableCell>
                      <TableCell>
                        <Badge variant={item.TrangThai === 'Giám sát chặt' ? 'destructive' : 'secondary'}>
                          {item.TrangThai}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Đối tượng */}
        <TabsContent value="doi-tuong">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Đối tượng theo dõi
              </CardTitle>
              <CardDescription>Danh sách đối tượng cần quản lý, giám sát</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDoiTuongTheoDoi.map((item) => (
                    <TableRow key={item.MaDT}>
                      <TableCell className="font-medium">{item.MaDT}</TableCell>
                      <TableCell>{item.HoTen}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.LoaiDoiTuong}</Badge>
                      </TableCell>
                      <TableCell>{item.DiaChi}</TableCell>
                      <TableCell>{item.NgayBatDau}</TableCell>
                      <TableCell>
                        <Badge className={item.TrangThai === 'Đang giám sát' ? 'bg-amber-500' : 'bg-blue-500'}>
                          {item.TrangThai}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ghi chú */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4" />
            Ghi chú
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Cao</Badge>
              <span>Cần xử lý ngay</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500">Trung bình</Badge>
              <span>Theo dõi chặt</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">Thấp</Badge>
              <span>Xử lý bình thường</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500">Chuyển CA</Badge>
              <span>Đã chuyển Công an xử lý</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
