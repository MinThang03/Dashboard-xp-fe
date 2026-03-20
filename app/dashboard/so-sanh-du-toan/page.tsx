'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, Download, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface KhoanMuc {
  MaKhoanMuc: string;
  TenKhoanMuc: string;
  LoaiKhoanMuc: 'Thu' | 'Chi';
  DuToan: number;
  ThucTe: number;
  ChenhLech: number;
  TyLeThucHien: number;
}

const mockSoSanh: KhoanMuc[] = [
  { MaKhoanMuc: 'SS001', TenKhoanMuc: 'Thu phí hành chính', LoaiKhoanMuc: 'Thu', DuToan: 180000000, ThucTe: 165000000, ChenhLech: -15000000, TyLeThucHien: 91.7 },
  { MaKhoanMuc: 'SS002', TenKhoanMuc: 'Thu phí môi trường', LoaiKhoanMuc: 'Thu', DuToan: 120000000, ThucTe: 125000000, ChenhLech: 5000000, TyLeThucHien: 104.2 },
  { MaKhoanMuc: 'SS003', TenKhoanMuc: 'Thu thuế đất', LoaiKhoanMuc: 'Thu', DuToan: 300000000, ThucTe: 280000000, ChenhLech: -20000000, TyLeThucHien: 93.3 },
  { MaKhoanMuc: 'SS004', TenKhoanMuc: 'Chi lương cán bộ', LoaiKhoanMuc: 'Chi', DuToan: 1500000000, ThucTe: 1500000000, ChenhLech: 0, TyLeThucHien: 100 },
  { MaKhoanMuc: 'SS005', TenKhoanMuc: 'Chi hạ tầng', LoaiKhoanMuc: 'Chi', DuToan: 800000000, ThucTe: 650000000, ChenhLech: -150000000, TyLeThucHien: 81.3 },
  { MaKhoanMuc: 'SS006', TenKhoanMuc: 'Chi văn phòng phẩm', LoaiKhoanMuc: 'Chi', DuToan: 50000000, ThucTe: 48000000, ChenhLech: -2000000, TyLeThucHien: 96 },
  { MaKhoanMuc: 'SS007', TenKhoanMuc: 'Chi đầu tư', LoaiKhoanMuc: 'Chi', DuToan: 600000000, ThucTe: 620000000, ChenhLech: 20000000, TyLeThucHien: 103.3 },
  { MaKhoanMuc: 'SS008', TenKhoanMuc: 'Chi bảo trì', LoaiKhoanMuc: 'Chi', DuToan: 200000000, ThucTe: 185000000, ChenhLech: -15000000, TyLeThucHien: 92.5 }
];

const tongThu = {
  duToan: mockSoSanh.filter(k => k.LoaiKhoanMuc === 'Thu').reduce((sum, k) => sum + k.DuToan, 0),
  thucTe: mockSoSanh.filter(k => k.LoaiKhoanMuc === 'Thu').reduce((sum, k) => sum + k.ThucTe, 0)
};

const tongChi = {
  duToan: mockSoSanh.filter(k => k.LoaiKhoanMuc === 'Chi').reduce((sum, k) => sum + k.DuToan, 0),
  thucTe: mockSoSanh.filter(k => k.LoaiKhoanMuc === 'Chi').reduce((sum, k) => sum + k.ThucTe, 0)
};

const chartData = mockSoSanh.map(item => ({
  name: item.TenKhoanMuc.substring(0, 12) + '...',
  'Dự toán': item.DuToan / 1000000,
  'Thực tế': item.ThucTe / 1000000,
  loai: item.LoaiKhoanMuc
}));

export default function SoSanhDuToanPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">So sánh Thu Chi với Dự toán</h1>
              <p className="text-purple-100">Phân tích và so sánh thu chi thực tế với dự toán đã lập</p>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Tổng Thu ngân sách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dự toán</span>
                <span className="text-2xl font-bold">{formatCurrency(tongThu.duToan)}</span>
              </div>
              <ArrowRight className="h-5 w-5 mx-auto text-muted-foreground" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Thực tế</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(tongThu.thucTe)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Chênh lệch</span>
                  <span className={`text-lg font-bold ${tongThu.thucTe >= tongThu.duToan ? 'text-green-600' : 'text-red-600'}`}>
                    {tongThu.thucTe >= tongThu.duToan ? '+' : ''}{formatCurrency(tongThu.thucTe - tongThu.duToan)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">Tỷ lệ thực hiện</span>
                  <Badge className={tongThu.thucTe >= tongThu.duToan ? 'bg-green-500' : 'bg-amber-500'}>
                    {((tongThu.thucTe / tongThu.duToan) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Tổng Chi ngân sách</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dự toán</span>
                <span className="text-2xl font-bold">{formatCurrency(tongChi.duToan)}</span>
              </div>
              <ArrowRight className="h-5 w-5 mx-auto text-muted-foreground" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Thực tế</span>
                <span className="text-2xl font-bold text-red-600">{formatCurrency(tongChi.thucTe)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Chênh lệch</span>
                  <span className={`text-lg font-bold ${tongChi.thucTe <= tongChi.duToan ? 'text-green-600' : 'text-red-600'}`}>
                    {tongChi.thucTe >= tongChi.duToan ? '+' : ''}{formatCurrency(tongChi.thucTe - tongChi.duToan)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">Tỷ lệ thực hiện</span>
                  <Badge className={tongChi.thucTe <= tongChi.duToan ? 'bg-green-500' : 'bg-red-500'}>
                    {((tongChi.thucTe / tongChi.duToan) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ So sánh</CardTitle>
          <CardDescription>Đơn vị: Triệu VNĐ</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Triệu VNĐ', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value} tr`} />
              <Legend />
              <Bar dataKey="Dự toán" fill="#3b82f6" />
              <Bar dataKey="Thực tế">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.loai === 'Thu' ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết từng khoản mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSoSanh.map((item) => (
              <div key={item.MaKhoanMuc} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={item.LoaiKhoanMuc === 'Thu' ? 'default' : 'destructive'}>
                        {item.LoaiKhoanMuc}
                      </Badge>
                      <span className="font-semibold">{item.TenKhoanMuc}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mã: {item.MaKhoanMuc}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      item.LoaiKhoanMuc === 'Thu' 
                        ? (item.TyLeThucHien >= 100 ? 'text-green-600' : 'text-amber-600')
                        : (item.TyLeThucHien <= 100 ? 'text-green-600' : 'text-red-600')
                    }`}>
                      {item.TyLeThucHien.toFixed(1)}%
                    </div>
                    <div className={`text-sm ${item.ChenhLech >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.ChenhLech >= 0 ? '+' : ''}{formatCurrency(item.ChenhLech)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-muted-foreground">Dự toán: </span>
                    <strong>{formatCurrency(item.DuToan)}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Thực tế: </span>
                    <strong>{formatCurrency(item.ThucTe)}</strong>
                  </div>
                </div>
                <Progress value={item.TyLeThucHien} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
