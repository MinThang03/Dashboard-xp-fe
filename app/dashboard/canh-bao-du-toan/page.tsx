'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, AlertCircle, XCircle, Bell, CheckCircle2, Download, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { nganSachApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

type WarningItem = {
  id: number;
  tenKhoanMuc: string;
  duToan: number;
  daChi: number;
  tyLe: number;
  mucDo: 'Nghiêm trọng' | 'Trung bình' | 'Theo dõi' | 'An toàn';
};

function getLevel(tyLe: number): WarningItem['mucDo'] {
  if (tyLe >= 110) return 'Nghiêm trọng';
  if (tyLe >= 100) return 'Trung bình';
  if (tyLe >= 85) return 'Theo dõi';
  return 'An toàn';
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CanhBaoDuToanPage() {
  const [items, setItems] = useState<WarningItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await nganSachApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'CHI_NGAN_SACH' });
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((x: any) => {
          const duToan = Number(x.DuToan || x.TongDuToan || 0);
          const daChi = Number(x.SoTien || 0);
          const tyLe = duToan > 0 ? (daChi / duToan) * 100 : 0;
          return {
            id: Number(x.MaNganSach),
            tenKhoanMuc: x.HangMucChi || x.LoaiChi || x.MaChi || `CHI-${x.MaNganSach}`,
            duToan,
            daChi,
            tyLe,
            mucDo: getLevel(tyLe),
          } satisfies WarningItem;
        });
        setItems(mapped.sort((a, b) => b.tyLe - a.tyLe));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const nghiemTrong = items.filter((x) => x.mucDo === 'Nghiêm trọng').length;
    const trungBinh = items.filter((x) => x.mucDo === 'Trung bình').length;
    const theoDoi = items.filter((x) => x.mucDo === 'Theo dõi').length;
    const anToan = items.filter((x) => x.mucDo === 'An toàn').length;
    return { nghiemTrong, trungBinh, theoDoi, anToan };
  }, [items]);

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        name: item.tenKhoanMuc.length > 16 ? `${item.tenKhoanMuc.slice(0, 16)}...` : item.tenKhoanMuc,
        duToan: item.duToan / 1_000_000,
        daChi: item.daChi / 1_000_000,
        vuot: item.tyLe > 100,
      })),
    [items],
  );

  const getMucDoBadge = (mucDo: WarningItem['mucDo']) => {
    switch (mucDo) {
      case 'Nghiêm trọng':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Trung bình':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertCircle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Theo dõi':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Bell className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      default:
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{mucDo}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-status-danger via-primary to-status-danger rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Cảnh báo vượt dự toán</h1>
              <p className="text-red-100">Theo dõi và cảnh báo tự động theo dữ liệu chi ngân sách thực tế</p>
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
                  <DialogDescription>Tóm tắt số khoản mục vượt ngưỡng theo dữ liệu backend mới nhất.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2 py-2">
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-2">Phân bố cảnh báo</p>
                    <div className="space-y-1 text-sm">
                      <p>Nghiêm trọng: <strong className="text-red-600">{stats.nghiemTrong}</strong></p>
                      <p>Trung bình: <strong className="text-amber-600">{stats.trungBinh}</strong></p>
                      <p>Theo dõi: <strong className="text-blue-600">{stats.theoDoi}</strong></p>
                      <p>An toàn: <strong className="text-green-600">{stats.anToan}</strong></p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-2">Khoản mục vượt dự toán</p>
                    <p className="text-2xl font-semibold text-red-600">{items.filter((x) => x.tyLe > 100).length}</p>
                    <p className="text-sm text-muted-foreground">trên tổng số {items.length} khoản mục đang theo dõi</p>
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

      {stats.nghiemTrong > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Có {stats.nghiemTrong} khoản mục vượt ngưỡng nghiêm trọng (&gt;= 110% dự toán).
          </AlertDescription>
        </Alert>
      )}

      <FunctionStyledPanel
        title="Mức cảnh báo vượt dự toán"
        subtitle="Biểu đồ đường cho thấy tương quan giữa mức cảnh báo và số khoản mục đang theo dõi"
        variant="finance-overrun-alert"
        items={[
          { label: 'Nghiêm trọng', value: stats.nghiemTrong, color: '#ef4444' },
          { label: 'Trung bình', value: stats.trungBinh, color: '#f59e0b' },
          { label: 'Theo dõi', value: stats.theoDoi, color: '#3b82f6' },
          { label: 'An toàn', value: stats.anToan, color: '#22c55e' },
          { label: 'Vượt dự toán', value: items.filter((x) => x.tyLe > 100).length, color: '#dc2626' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>So sánh Dự toán - Đã chi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" height={84} />
              <YAxis label={{ value: 'Triệu VNĐ', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} tr`} />
              <Legend />
              <Bar dataKey="duToan" fill="#3b82f6" name="Dự toán" />
              <Bar dataKey="daChi" name="Đã chi">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.vuot ? '#ef4444' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết khoản mục cảnh báo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((x) => (
            <div key={x.id} className="rounded border p-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{x.tenKhoanMuc}</div>
                {getMucDoBadge(x.mucDo)}
              </div>
              <div className="text-sm text-muted-foreground">
                Dự toán: {formatCurrency(x.duToan)} | Đã chi: {formatCurrency(x.daChi)} | Tỷ lệ: {x.tyLe.toFixed(1)}%
              </div>
              <Progress value={Math.min(100, x.tyLe)} className="h-2" />
            </div>
          ))}
          {!loading && items.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">Chưa có dữ liệu chi ngân sách</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, className, icon }: { title: string; value: number; className?: string; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          {icon}
          <div className={`text-2xl font-bold ${className || ''}`}>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
