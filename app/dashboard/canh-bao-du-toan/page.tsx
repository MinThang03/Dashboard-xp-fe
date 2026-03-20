'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, AlertCircle, TrendingUp, XCircle, Download, Bell, CheckCircle2, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CanhBao {
  MaKhoanMuc: string;
  TenKhoanMuc: string;
  DuToan: number;
  DaChi: number;
  TyLeThucHien: number;
  MucDo: string;
  NgayCapNhat: string;
}

const mockCanhBao: CanhBao[] = [
  { MaKhoanMuc: 'CB001', TenKhoanMuc: 'Sửa chữa hạ tầng', DuToan: 800000000, DaChi: 850000000, TyLeThucHien: 106.25, MucDo: 'Nghiêm trọng', NgayCapNhat: '2026-01-30' },
  { MaKhoanMuc: 'CB002', TenKhoanMuc: 'Mua sắm thiết bị', DuToan: 500000000, DaChi: 520000000, TyLeThucHien: 104, MucDo: 'Nghiêm trọng', NgayCapNhat: '2026-01-29' },
  { MaKhoanMuc: 'CB003', TenKhoanMuc: 'Điện nước văn phòng', DuToan: 120000000, DaChi: 115000000, TyLeThucHien: 95.83, MucDo: 'Trung bình', NgayCapNhat: '2026-01-30' },
  { MaKhoanMuc: 'CB004', TenKhoanMuc: 'Văn phòng phẩm', DuToan: 50000000, DaChi: 48000000, TyLeThucHien: 96, MucDo: 'Theo dõi', NgayCapNhat: '2026-01-30' },
  { MaKhoanMuc: 'CB005', TenKhoanMuc: 'Bảo trì xe công vụ', DuToan: 80000000, DaChi: 82000000, TyLeThucHien: 102.5, MucDo: 'Trung bình', NgayCapNhat: '2026-01-28' },
  { MaKhoanMuc: 'CB006', TenKhoanMuc: 'Chi phí đào tạo', DuToan: 150000000, DaChi: 135000000, TyLeThucHien: 90, MucDo: 'An toàn', NgayCapNhat: '2026-01-30' }
];

const chartData = mockCanhBao.map(item => ({
  name: item.TenKhoanMuc.substring(0, 15) + '...',
  'Dự toán': item.DuToan / 1000000,
  'Đã chi': item.DaChi / 1000000
}));

export default function CanhBaoDuToanPage() {
  const nghiemTrong = mockCanhBao.filter(c => c.MucDo === 'Nghiêm trọng').length;
  const trungBinh = mockCanhBao.filter(c => c.MucDo === 'Trung bình').length;
  const theoDoi = mockCanhBao.filter(c => c.MucDo === 'Theo dõi').length;
  const anToan = mockCanhBao.filter(c => c.MucDo === 'An toàn').length;

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Nghiêm trọng': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertCircle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Theo dõi': return <Badge className="bg-blue-500 hover:bg-blue-600"><Bell className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'An toàn': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      default: return <Badge variant="secondary">{mucDo}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-status-danger via-primary to-status-danger rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Cảnh báo Vượt dự toán</h1>
              <p className="text-red-100">Theo dõi và cảnh báo các khoản mục có nguy cơ vượt dự toán</p>
            </div>
          </div>
          <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
                  <Eye className="mr-2 h-4 w-4" />
                  Xem tổng quan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tổng quan cảnh báo dự toán</DialogTitle>
                  <DialogDescription>Tóm tắt mức độ rủi ro và nhóm khoản mục cần ưu tiên xử lý.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2 py-2">
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-2">Phân bố cảnh báo</p>
                    <div className="space-y-1 text-sm">
                      <p>Nghiêm trọng: <strong className="text-red-600">{nghiemTrong}</strong></p>
                      <p>Trung bình: <strong className="text-amber-600">{trungBinh}</strong></p>
                      <p>Theo dõi: <strong className="text-blue-600">{theoDoi}</strong></p>
                      <p>An toàn: <strong className="text-green-600">{anToan}</strong></p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-2">Khoản mục vượt dự toán</p>
                    <p className="text-2xl font-semibold text-red-600">
                      {mockCanhBao.filter((c) => c.TyLeThucHien > 100).length}
                    </p>
                    <p className="text-sm text-muted-foreground">trên tổng số {mockCanhBao.length} khoản mục theo dõi</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Đóng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {nghiemTrong > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Cảnh báo!</strong> Có {nghiemTrong} khoản mục đã vượt dự toán. Cần xem xét và điều chỉnh ngay!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nghiêm trọng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">{nghiemTrong}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{trungBinh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Theo dõi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{theoDoi}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">An toàn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{anToan}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>So sánh Dự toán - Thực chi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Triệu VNĐ', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value} tr`} />
              <Legend />
              <Bar dataKey="Dự toán" fill="#3b82f6" />
              <Bar dataKey="Đã chi" fill="#ef4444">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={mockCanhBao[index].TyLeThucHien > 100 ? '#ef4444' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết các khoản mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCanhBao.map((item) => (
              <div key={item.MaKhoanMuc} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <span className="font-semibold">{item.TenKhoanMuc}</span>
                      {getMucDoBadge(item.MucDo)}
                    </div>
                    <p className="text-sm text-muted-foreground">Mã: {item.MaKhoanMuc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: item.TyLeThucHien > 100 ? '#ef4444' : '#10b981' }}>
                      {item.TyLeThucHien.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">{item.NgayCapNhat}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dự toán: <strong>{formatCurrency(item.DuToan)}</strong></span>
                    <span>Đã chi: <strong>{formatCurrency(item.DaChi)}</strong></span>
                    <span className={item.DaChi > item.DuToan ? 'text-red-600 font-semibold' : 'text-green-600'}>
                      {item.DaChi > item.DuToan ? '+' : ''}{formatCurrency(item.DaChi - item.DuToan)}
                    </span>
                  </div>
                  <Progress value={item.TyLeThucHien} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
