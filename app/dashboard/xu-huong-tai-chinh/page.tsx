'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, BarChart3, Zap, AlertCircle, Download, Brain, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFinancialDssSnapshot } from '@/lib/frontend-dss';

export default function XuHuongTaiChinhPage() {
  const snapshot = useMemo(() => getFinancialDssSnapshot(), []);
  const { duBaoThu, duBaoChi, xuHuongChiTieu, canhBaoRuiRo, doChinhXac, xuHuongThangSau, soBaoCaoAi } = snapshot;

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Phân tích Xu hướng Tài chính (AI)</h1>
              <p className="text-primary/80">Dự báo xu hướng tài chính bằng trí tuệ nhân tạo</p>
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
                  <DialogTitle>Tổng quan dự báo AI</DialogTitle>
                  <DialogDescription>Tóm tắt xu hướng thu chi và mức độ tin cậy của mô hình dự báo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2 py-2">
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-1">Dự báo thu tháng gần nhất</p>
                    <p className="text-lg font-semibold text-green-600">{duBaoThu[1].duBao} triệu VNĐ</p>
                    <p className="text-sm text-muted-foreground">Độ tin cậy: {duBaoThu[1].doTinCay}%</p>
                  </div>
                  <div className="rounded-lg border p-4 bg-slate-50/70">
                    <p className="text-sm text-muted-foreground mb-1">Dự báo chi tháng gần nhất</p>
                    <p className="text-lg font-semibold text-red-600">{duBaoChi[1].duBao} triệu VNĐ</p>
                    <p className="text-sm text-muted-foreground">Độ tin cậy: {duBaoChi[1].doTinCay}%</p>
                  </div>
                  <div className="rounded-lg border p-4 bg-slate-50/70 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Rủi ro cần chú ý</p>
                    <p className="text-2xl font-semibold text-amber-600">{canhBaoRuiRo.length} cảnh báo</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Đóng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
              <Download className="mr-2 h-4 w-4" />
              Xuất dự báo
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Độ chính xác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{doChinhXac}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Xu hướng tháng sau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{xuHuongThangSau > 0 ? '+' : ''}{xuHuongThangSau}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cảnh báo rủi ro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{canhBaoRuiRo.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Báo cáo AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <span className="text-2xl font-bold">{soBaoCaoAi}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dự báo Thu ngân sách</CardTitle>
            <CardDescription>Đơn vị: Triệu VNĐ | Độ tin cậy: 92%</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={duBaoThu}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="thang" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} tr`} />
                <Legend />
                <Area type="monotone" dataKey="thucTe" stroke="#3b82f6" fill="#3b82f6" name="Thực tế" />
                <Area type="monotone" dataKey="duBao" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Dự báo AI" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dự báo Chi ngân sách</CardTitle>
            <CardDescription>Đơn vị: Triệu VNĐ | Độ tin cậy: 90%</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={duBaoChi}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="thang" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} tr`} />
                <Legend />
                <Area type="monotone" dataKey="thucTe" stroke="#ef4444" fill="#ef4444" name="Thực tế" />
                <Area type="monotone" dataKey="duBao" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Dự báo AI" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Xu hướng các chỉ tiêu chính</CardTitle>
          <CardDescription>Phân tích xu hướng và dự báo tháng sau</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {xuHuongChiTieu.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex w-full 2xl:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <span className="font-semibold">{item.chiTieu}</span>
                      <Badge className={item.xuHuong === 'Tăng' ? 'bg-status-success' : 'bg-status-danger'}>
                        {item.xuHuong === 'Tăng' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {item.xuHuong} {item.tyLe.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Độ tin cậy</div>
                    <div className="text-lg font-bold text-purple-600">{item.doTinCay}%</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tháng trước: </span>
                    <strong>{item.thangTruoc} {item.chiTieu.includes('Tỷ lệ') ? '%' : 'tr'}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dự báo tháng sau: </span>
                    <strong className="text-purple-600">{item.duBaoThangSau} {item.chiTieu.includes('Tỷ lệ') ? '%' : 'tr'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo Rủi ro</CardTitle>
          <CardDescription>Phát hiện các rủi ro tài chính tiềm ẩn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {canhBaoRuiRo.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg bg-amber-50">
                <AlertCircle className={`h-5 w-5 mt-0.5 ${item.mucDo === 'Cao' ? 'text-red-500' : item.mucDo === 'Trung bình' ? 'text-amber-500' : 'text-blue-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{item.loai}</span>
                    <Badge variant={item.mucDo === 'Cao' ? 'destructive' : 'secondary'}>{item.mucDo}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.mota}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
