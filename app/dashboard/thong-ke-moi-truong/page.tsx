'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, FileText, Calendar, TrendingUp, Download, Eye, CheckCircle2, Clock, 
  Wind, Droplet, Trash2, AlertTriangle, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

// Mock data thống kê môi trường
interface BaoCaoMoiTruong {
  MaBaoCao: string;
  LoaiBaoCao: string;
  KyBaoCao: string;
  NgayTao: string;
  NguoiTao: string;
  TrangThai: string;
  NgayDuyet: string;
}

interface ChiSoMoiTruong {
  ChiSo: string;
  DonVi: string;
  ThangTruoc: number;
  ThangNay: number;
  XuHuong: string;
  DanhGia: string;
}

const mockBaoCao: BaoCaoMoiTruong[] = [
  { MaBaoCao: 'BC001', LoaiBaoCao: 'Chất lượng không khí', KyBaoCao: 'Tháng 01/2026', NgayTao: '2026-02-01', NguoiTao: 'Nguyễn Văn A', TrangThai: 'Đã duyệt', NgayDuyet: '2026-02-03' },
  { MaBaoCao: 'BC002', LoaiBaoCao: 'Thu gom rác thải', KyBaoCao: 'Tháng 01/2026', NgayTao: '2026-02-02', NguoiTao: 'Trần Thị B', TrangThai: 'Đã duyệt', NgayDuyet: '2026-02-04' },
  { MaBaoCao: 'BC003', LoaiBaoCao: 'Ô nhiễm', KyBaoCao: 'Quý IV/2025', NgayTao: '2026-01-05', NguoiTao: 'Lê Văn C', TrangThai: 'Đã duyệt', NgayDuyet: '2026-01-08' },
  { MaBaoCao: 'BC004', LoaiBaoCao: 'Chất lượng nước', KyBaoCao: 'Tháng 01/2026', NgayTao: '2026-02-01', NguoiTao: 'Phạm Thị D', TrangThai: 'Chờ duyệt', NgayDuyet: '' },
  { MaBaoCao: 'BC005', LoaiBaoCao: 'Tổng hợp môi trường', KyBaoCao: 'Năm 2025', NgayTao: '2026-01-15', NguoiTao: 'Hoàng Văn E', TrangThai: 'Đã duyệt', NgayDuyet: '2026-01-18' }
];

const mockChiSoKhongKhi: ChiSoMoiTruong[] = [
  { ChiSo: 'AQI trung bình', DonVi: '', ThangTruoc: 52, ThangNay: 48, XuHuong: 'Giảm', DanhGia: 'Tốt' },
  { ChiSo: 'PM2.5', DonVi: 'µg/m³', ThangTruoc: 25, ThangNay: 22, XuHuong: 'Giảm', DanhGia: 'Tốt' },
  { ChiSo: 'PM10', DonVi: 'µg/m³', ThangTruoc: 45, ThangNay: 42, XuHuong: 'Giảm', DanhGia: 'Trung bình' },
  { ChiSo: 'CO', DonVi: 'ppm', ThangTruoc: 1.2, ThangNay: 1.1, XuHuong: 'Giảm', DanhGia: 'Tốt' },
  { ChiSo: 'NO2', DonVi: 'ppb', ThangTruoc: 18, ThangNay: 20, XuHuong: 'Tăng', DanhGia: 'Trung bình' }
];

const mockChiSoNuoc: ChiSoMoiTruong[] = [
  { ChiSo: 'pH trung bình', DonVi: '', ThangTruoc: 7.1, ThangNay: 7.2, XuHuong: 'Ổn định', DanhGia: 'Tốt' },
  { ChiSo: 'DO', DonVi: 'mg/L', ThangTruoc: 5.5, ThangNay: 5.8, XuHuong: 'Tăng', DanhGia: 'Tốt' },
  { ChiSo: 'BOD5', DonVi: 'mg/L', ThangTruoc: 12, ThangNay: 10, XuHuong: 'Giảm', DanhGia: 'Đạt chuẩn' },
  { ChiSo: 'COD', DonVi: 'mg/L', ThangTruoc: 28, ThangNay: 25, XuHuong: 'Giảm', DanhGia: 'Đạt chuẩn' },
  { ChiSo: 'TSS', DonVi: 'mg/L', ThangTruoc: 35, ThangNay: 38, XuHuong: 'Tăng', DanhGia: 'Cần theo dõi' }
];

const mockThongKeRac = {
  tongKhoiLuong: 1850,
  tyLePhanLoai: 68,
  tyLeTaiChe: 25,
  soLanThu: 150,
  diemThuHoatDong: 45,
  soSanhThangTruoc: '+5%'
};

const mockThongKeONhiem = {
  tongBaoCao: 34,
  daXuLy: 28,
  dangXuLy: 5,
  nghiemTrong: 2,
  tyLeXuLy: 82
};

export default function ThongKeMoiTruongPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('thang');
  const [currentTab, setCurrentTab] = useState('tong-hop');

  const getTrangThaiBadge = (tt: string) => {
    switch (tt) {
      case 'Đã duyệt': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{tt}</Badge>;
      case 'Chờ duyệt': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{tt}</Badge>;
      default: return <Badge variant="secondary">{tt}</Badge>;
    }
  };

  const getXuHuongIcon = (xuHuong: string) => {
    switch (xuHuong) {
      case 'Tăng': return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'Giảm': return <ArrowDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDanhGiaBadge = (dg: string) => {
    switch (dg) {
      case 'Tốt': return <Badge className="bg-green-500">{dg}</Badge>;
      case 'Đạt chuẩn': return <Badge className="bg-blue-500">{dg}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500">{dg}</Badge>;
      case 'Cần theo dõi': return <Badge className="bg-orange-500">{dg}</Badge>;
      case 'Kém': return <Badge variant="destructive">{dg}</Badge>;
      default: return <Badge variant="secondary">{dg}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-status-success via-secondary to-status-success rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Thống kê Môi trường</h1>
              <p className="text-lime-100">Báo cáo và thống kê tổng hợp các chỉ số môi trường</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px] bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thang">Tháng 01/2026</SelectItem>
                <SelectItem value="quy">Quý IV/2025</SelectItem>
                <SelectItem value="nam">Năm 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AQI trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">48</span>
              <Badge className="bg-green-100 text-green-700">Tốt</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chất lượng nước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-cyan-500" />
              <span className="text-2xl font-bold">pH 7.2</span>
              <Badge className="bg-green-100 text-green-700">Đạt</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rác thu gom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">1.85T</span>
              <span className="text-xs text-green-600">+5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Báo cáo ô nhiễm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{mockThongKeONhiem.tongBaoCao}</span>
              <span className="text-xs text-muted-foreground">Đã XL: {mockThongKeONhiem.daXuLy}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tong-hop">Tổng hợp</TabsTrigger>
          <TabsTrigger value="khong-khi">Không khí</TabsTrigger>
          <TabsTrigger value="nuoc">Nước</TabsTrigger>
          <TabsTrigger value="rac-thai">Rác thải</TabsTrigger>
          <TabsTrigger value="bao-cao">Báo cáo</TabsTrigger>
        </TabsList>

        {/* Tổng hợp */}
        <TabsContent value="tong-hop" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-blue-500" />
                  Chất lượng không khí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockChiSoKhongKhi.slice(0, 3).map(item => (
                    <div key={item.ChiSo} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="font-medium">{item.ChiSo}</span>
                      <div className="flex items-center gap-2">
                        <span>{item.ThangNay} {item.DonVi}</span>
                        {getXuHuongIcon(item.XuHuong)}
                        {getDanhGiaBadge(item.DanhGia)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-cyan-500" />
                  Chất lượng nước
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockChiSoNuoc.slice(0, 3).map(item => (
                    <div key={item.ChiSo} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="font-medium">{item.ChiSo}</span>
                      <div className="flex items-center gap-2">
                        <span>{item.ThangNay} {item.DonVi}</span>
                        {getXuHuongIcon(item.XuHuong)}
                        {getDanhGiaBadge(item.DanhGia)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-amber-500" />
                  Thu gom rác thải
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-amber-50 rounded">
                    <div className="text-2xl font-bold text-amber-600">{mockThongKeRac.tongKhoiLuong} kg</div>
                    <div className="text-sm text-muted-foreground">Tổng KL/ngày</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">{mockThongKeRac.tyLePhanLoai}%</div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ phân loại</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">{mockThongKeRac.tyLeTaiChe}%</div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ tái chế</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">{mockThongKeRac.diemThuHoatDong}</div>
                    <div className="text-sm text-muted-foreground">Điểm thu gom</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Báo cáo ô nhiễm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-2xl font-bold text-red-600">{mockThongKeONhiem.tongBaoCao}</div>
                    <div className="text-sm text-muted-foreground">Tổng báo cáo</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">{mockThongKeONhiem.daXuLy}</div>
                    <div className="text-sm text-muted-foreground">Đã xử lý</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded">
                    <div className="text-2xl font-bold text-amber-600">{mockThongKeONhiem.dangXuLy}</div>
                    <div className="text-sm text-muted-foreground">Đang xử lý</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">{mockThongKeONhiem.tyLeXuLy}%</div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ XL</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Không khí */}
        <TabsContent value="khong-khi">
          <Card>
            <CardHeader>
              <CardTitle>Chỉ số chất lượng không khí</CardTitle>
              <CardDescription>So sánh giữa tháng trước và tháng này</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chỉ số</TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead className="text-right">Tháng trước</TableHead>
                    <TableHead className="text-right">Tháng này</TableHead>
                    <TableHead className="text-center">Xu hướng</TableHead>
                    <TableHead>Đánh giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockChiSoKhongKhi.map(item => (
                    <TableRow key={item.ChiSo}>
                      <TableCell className="font-medium">{item.ChiSo}</TableCell>
                      <TableCell>{item.DonVi || '-'}</TableCell>
                      <TableCell className="text-right">{item.ThangTruoc}</TableCell>
                      <TableCell className="text-right font-semibold">{item.ThangNay}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getXuHuongIcon(item.XuHuong)}
                          <span className="text-sm">{item.XuHuong}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getDanhGiaBadge(item.DanhGia)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nước */}
        <TabsContent value="nuoc">
          <Card>
            <CardHeader>
              <CardTitle>Chỉ số chất lượng nước</CardTitle>
              <CardDescription>So sánh giữa tháng trước và tháng này</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chỉ số</TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead className="text-right">Tháng trước</TableHead>
                    <TableHead className="text-right">Tháng này</TableHead>
                    <TableHead className="text-center">Xu hướng</TableHead>
                    <TableHead>Đánh giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockChiSoNuoc.map(item => (
                    <TableRow key={item.ChiSo}>
                      <TableCell className="font-medium">{item.ChiSo}</TableCell>
                      <TableCell>{item.DonVi || '-'}</TableCell>
                      <TableCell className="text-right">{item.ThangTruoc}</TableCell>
                      <TableCell className="text-right font-semibold">{item.ThangNay}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getXuHuongIcon(item.XuHuong)}
                          <span className="text-sm">{item.XuHuong}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getDanhGiaBadge(item.DanhGia)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rác thải */}
        <TabsContent value="rac-thai">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Thống kê thu gom rác thải</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <Trash2 className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                    <div className="text-3xl font-bold text-amber-600">{mockThongKeRac.tongKhoiLuong}</div>
                    <div className="text-sm text-muted-foreground">kg/ngày TB</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <div className="text-3xl font-bold text-green-600">{mockThongKeRac.tyLePhanLoai}%</div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ phân loại</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <div className="text-3xl font-bold text-blue-600">{mockThongKeRac.tyLeTaiChe}%</div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ tái chế</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>So với tháng trước</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Khối lượng thu</span>
                    <Badge className="bg-green-500">{mockThongKeRac.soSanhThangTruoc}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Số lần thu gom</span>
                    <span className="font-semibold">{mockThongKeRac.soLanThu} lần</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Điểm thu hoạt động</span>
                    <span className="font-semibold">{mockThongKeRac.diemThuHoatDong} điểm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Báo cáo */}
        <TabsContent value="bao-cao">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách báo cáo môi trường</CardTitle>
              <CardDescription>Các báo cáo định kỳ theo tháng/quý/năm</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã BC</TableHead>
                    <TableHead>Loại báo cáo</TableHead>
                    <TableHead>Kỳ báo cáo</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Người tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBaoCao.map(bc => (
                    <TableRow key={bc.MaBaoCao}>
                      <TableCell className="font-medium text-primary">{bc.MaBaoCao}</TableCell>
                      <TableCell>{bc.LoaiBaoCao}</TableCell>
                      <TableCell>{bc.KyBaoCao}</TableCell>
                      <TableCell>{bc.NgayTao}</TableCell>
                      <TableCell>{bc.NguoiTao}</TableCell>
                      <TableCell>{getTrangThaiBadge(bc.TrangThai)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> Xem
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Tải
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
