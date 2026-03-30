'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Download, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { nganSachApi } from '@/lib/api';

type Item = {
  id: string;
  loai: 'Thu' | 'Chi';
  ten: string;
  duToan: number;
  thucTe: number;
  chenhlech: number;
  tyLe: number;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SoSanhDuToanPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [thuRes, chiRes] = await Promise.all([
        nganSachApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'THU_NGAN_SACH' }),
        nganSachApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'CHI_NGAN_SACH' }),
      ]);

      const nextItems: Item[] = [];

      if (thuRes.success && Array.isArray(thuRes.data)) {
        thuRes.data.forEach((x: any) => {
          const duToan = Number(x.SoTienKeHoach || x.TongDuToan || 0);
          const thucTe = Number(x.SoTien || 0);
          const chenhlech = thucTe - duToan;
          const tyLe = duToan > 0 ? (thucTe / duToan) * 100 : 0;
          nextItems.push({
            id: `thu-${x.MaNganSach}`,
            loai: 'Thu',
            ten: x.LoaiThu || x.NguonThu || x.MaThu || `THU-${x.MaNganSach}`,
            duToan,
            thucTe,
            chenhlech,
            tyLe,
          });
        });
      }

      if (chiRes.success && Array.isArray(chiRes.data)) {
        chiRes.data.forEach((x: any) => {
          const duToan = Number(x.DuToan || x.TongDuToan || 0);
          const thucTe = Number(x.SoTien || 0);
          const chenhlech = thucTe - duToan;
          const tyLe = duToan > 0 ? (thucTe / duToan) * 100 : 0;
          nextItems.push({
            id: `chi-${x.MaNganSach}`,
            loai: 'Chi',
            ten: x.HangMucChi || x.LoaiChi || x.MaChi || `CHI-${x.MaNganSach}`,
            duToan,
            thucTe,
            chenhlech,
            tyLe,
          });
        });
      }

      setItems(nextItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const thu = items.filter((x) => x.loai === 'Thu');
    const chi = items.filter((x) => x.loai === 'Chi');

    const tongThuDuToan = thu.reduce((sum, x) => sum + x.duToan, 0);
    const tongThuThucTe = thu.reduce((sum, x) => sum + x.thucTe, 0);
    const tongChiDuToan = chi.reduce((sum, x) => sum + x.duToan, 0);
    const tongChiThucTe = chi.reduce((sum, x) => sum + x.thucTe, 0);

    return {
      tongThuDuToan,
      tongThuThucTe,
      tongChiDuToan,
      tongChiThucTe,
      tyLeThu: tongThuDuToan > 0 ? (tongThuThucTe / tongThuDuToan) * 100 : 0,
      tyLeChi: tongChiDuToan > 0 ? (tongChiThucTe / tongChiDuToan) * 100 : 0,
    };
  }, [items]);

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        name: item.ten.length > 14 ? `${item.ten.slice(0, 14)}...` : item.ten,
        duToan: item.duToan / 1_000_000,
        thucTe: item.thucTe / 1_000_000,
        loai: item.loai,
      })),
    [items],
  );

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">So sánh Thu Chi với Dự toán</h1>
              <p className="text-purple-100">Phân tích mức độ thực hiện thu chi theo dữ liệu backend</p>
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
                  <DialogTitle>Tổng quan so sánh dự toán</DialogTitle>
                  <DialogDescription>Tóm tắt nhanh các chỉ số thu chi theo dữ liệu đã lưu trong hệ thống.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2 py-2">
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-1">Tổng thu</p>
                    <p className="text-lg font-semibold">{formatCurrency(stats.tongThuThucTe)}</p>
                    <p className="text-sm text-muted-foreground">Dự toán: {formatCurrency(stats.tongThuDuToan)}</p>
                    <p className={`text-sm font-medium ${stats.tyLeThu >= 100 ? 'text-green-600' : 'text-amber-600'}`}>
                      Tỷ lệ thực hiện: {stats.tyLeThu.toFixed(1)}%
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-1">Tổng chi</p>
                    <p className="text-lg font-semibold">{formatCurrency(stats.tongChiThucTe)}</p>
                    <p className="text-sm text-muted-foreground">Dự toán: {formatCurrency(stats.tongChiDuToan)}</p>
                    <p className={`text-sm font-medium ${stats.tyLeChi <= 100 ? 'text-green-600' : 'text-red-600'}`}>
                      Tỷ lệ thực hiện: {stats.tyLeChi.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Đóng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30" onClick={loadData}>
              <Download className="mr-2 h-4 w-4" />
              Làm mới dữ liệu
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Tổng Thu ngân sách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>Dự toán: <strong>{formatCurrency(stats.tongThuDuToan)}</strong></div>
            <div>Thực tế: <strong>{formatCurrency(stats.tongThuThucTe)}</strong></div>
            <div>Chênh lệch: <strong className={stats.tongThuThucTe - stats.tongThuDuToan >= 0 ? 'text-green-600' : 'text-red-600'}>{stats.tongThuThucTe >= stats.tongThuDuToan ? '+' : ''}{formatCurrency(stats.tongThuThucTe - stats.tongThuDuToan)}</strong></div>
            <div>Tỷ lệ thực hiện: <strong>{stats.tyLeThu.toFixed(1)}%</strong></div>
            <Progress value={Math.min(100, stats.tyLeThu)} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Tổng Chi ngân sách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>Dự toán: <strong>{formatCurrency(stats.tongChiDuToan)}</strong></div>
            <div>Thực tế: <strong>{formatCurrency(stats.tongChiThucTe)}</strong></div>
            <div>Chênh lệch: <strong className={stats.tongChiThucTe - stats.tongChiDuToan <= 0 ? 'text-green-600' : 'text-red-600'}>{stats.tongChiThucTe >= stats.tongChiDuToan ? '+' : ''}{formatCurrency(stats.tongChiThucTe - stats.tongChiDuToan)}</strong></div>
            <div>Tỷ lệ thực hiện: <strong>{stats.tyLeChi.toFixed(1)}%</strong></div>
            <Progress value={Math.min(100, stats.tyLeChi)} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ So sánh</CardTitle>
          <CardDescription>Đơn vị: Triệu VNĐ</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" height={84} />
              <YAxis label={{ value: 'Triệu VNĐ', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} tr`} />
              <Legend />
              <Bar dataKey="duToan" fill="#3b82f6" name="Dự toán" />
              <Bar dataKey="thucTe" name="Thực tế">
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
          <CardTitle>Chi tiết khoản mục</CardTitle>
          <CardDescription>{items.length} khoản mục {loading ? '(đang tải...)' : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((x) => (
              <div key={x.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={x.loai === 'Thu' ? 'default' : 'destructive'}>{x.loai}</Badge>
                      <span className="font-semibold">{x.ten}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mã: {x.id}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${x.loai === 'Thu' ? (x.tyLe >= 100 ? 'text-green-600' : 'text-amber-600') : (x.tyLe <= 100 ? 'text-green-600' : 'text-red-600')}`}>
                      {x.tyLe.toFixed(1)}%
                    </div>
                    <div className={`text-sm ${x.chenhlech >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {x.chenhlech >= 0 ? '+' : ''}{formatCurrency(x.chenhlech)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-muted-foreground">Dự toán: </span>
                    <strong>{formatCurrency(x.duToan)}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Thực tế: </span>
                    <strong>{formatCurrency(x.thucTe)}</strong>
                  </div>
                </div>
                <Progress value={Math.min(100, x.tyLe)} className="h-2" />
              </div>
            ))}
            {!loading && items.length === 0 && (
              <div className="text-center text-muted-foreground">Chưa có dữ liệu thu/chi để so sánh</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
