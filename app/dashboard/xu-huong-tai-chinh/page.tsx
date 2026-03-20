'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Zap, AlertCircle, Download, Brain, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const duBaoThu = [
  { thang: 'T2/26', thucTe: 450, duBao: 448, doTinCay: 92 },
  { thang: 'T3/26', thucTe: null, duBao: 480, doTinCay: 92 },
  { thang: 'T4/26', thucTe: null, duBao: 510, doTinCay: 89 },
  { thang: 'T5/26', thucTe: null, duBao: 495, doTinCay: 87 },
  { thang: 'T6/26', thucTe: null, duBao: 520, doTinCay: 85 }
];

const duBaoChi = [
  { thang: 'T2/26', thucTe: 420, duBao: 422, doTinCay: 90 },
  { thang: 'T3/26', thucTe: null, duBao: 440, doTinCay: 90 },
  { thang: 'T4/26', thucTe: null, duBao: 460, doTinCay: 88 },
  { thang: 'T5/26', thucTe: null, duBao: 450, doTinCay: 86 },
  { thang: 'T6/26', thucTe: null, duBao: 470, doTinCay: 84 }
];

const xuHuongChiTieu = [
  { chiTieu: 'Thu ngân sách', thangTruoc: 450, duBaoThangSau: 480, xuHuong: 'Tăng', tyLe: 6.7, doTinCay: 92 },
  { chiTieu: 'Chi ngân sách', thangTruoc: 420, duBaoThangSau: 440, xuHuong: 'Tăng', tyLe: 4.8, doTinCay: 90 },
  { chiTieu: 'Cân đối NS', thangTruoc: 30, duBaoThangSau: 40, xuHuong: 'Tăng', tyLe: 33.3, doTinCay: 88 },
  { chiTieu: 'Tỷ lệ thu/chi', thangTruoc: 107.1, duBaoThangSau: 109.1, xuHuong: 'Tăng', tyLe: 1.9, doTinCay: 91 },
  { chiTieu: 'Chi đầu tư', thangTruoc: 150, duBaoThangSau: 165, xuHuong: 'Tăng', tyLe: 10, doTinCay: 85 }
];

const canhBaoRuiRo = [
  { loai: 'Vượt dự toán', mota: 'Khoản mục sửa chữa hạ tầng có nguy cơ vượt 6%', mucDo: 'Cao' },
  { loai: 'Giảm thu', mota: 'Thu phí hành chính dự kiến giảm 3% tháng sau', mucDo: 'Trung bình' }
];

export default function XuHuongTaiChinhPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Phân tích Xu hướng Tài chính (AI)</h1>
              <p className="text-primary/80">Dự báo xu hướng tài chính bằng trí tuệ nhân tạo</p>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
            <Download className="mr-2 h-4 w-4" />
            Xuất dự báo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Độ chính xác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">92%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Xu hướng tháng sau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">+8%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cảnh báo rủi ro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              <span className="text-2xl font-bold">15</span>
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
                    <div className="flex items-center gap-2">
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
                <AlertCircle className={`h-5 w-5 mt-0.5 ${item.mucDo === 'Cao' ? 'text-red-500' : 'text-amber-500'}`} />
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
