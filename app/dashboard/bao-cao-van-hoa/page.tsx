'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, CheckCircle2, Clock, PartyPopper, Users, Landmark, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BaoCaoVanHoa {
  Thang: string;
  SoLeHoi: number;
  NguoiThamGia: number;
  DiTichThamQuan: number;
  HoatDongVanNghe: number;
  KinhPhi: number;
}

const baoCaoThang: BaoCaoVanHoa[] = [
  { Thang: 'T1', SoLeHoi: 3, NguoiThamGia: 4500, DiTichThamQuan: 800, HoatDongVanNghe: 6, KinhPhi: 150 },
  { Thang: 'T2', SoLeHoi: 5, NguoiThamGia: 6200, DiTichThamQuan: 1200, HoatDongVanNghe: 8, KinhPhi: 220 },
  { Thang: 'T3', SoLeHoi: 4, NguoiThamGia: 5800, DiTichThamQuan: 950, HoatDongVanNghe: 7, KinhPhi: 180 },
  { Thang: 'T4', SoLeHoi: 6, NguoiThamGia: 7500, DiTichThamQuan: 1400, HoatDongVanNghe: 10, KinhPhi: 280 },
  { Thang: 'T5', SoLeHoi: 4, NguoiThamGia: 5200, DiTichThamQuan: 1100, HoatDongVanNghe: 6, KinhPhi: 190 },
  { Thang: 'T6', SoLeHoi: 5, NguoiThamGia: 6800, DiTichThamQuan: 1350, HoatDongVanNghe: 9, KinhPhi: 250 }
];

const baoCaoQuy = [
  { Quy: 'Quý I', SoLeHoi: 12, NguoiThamGia: 16500, DiTichThamQuan: 2950, HoatDongVanNghe: 21, KinhPhi: 550 },
  { Quy: 'Quý II', SoLeHoi: 15, NguoiThamGia: 19500, DiTichThamQuan: 3850, HoatDongVanNghe: 25, KinhPhi: 720 },
  { Quy: 'Quý III', SoLeHoi: 10, NguoiThamGia: 14200, DiTichThamQuan: 2600, HoatDongVanNghe: 18, KinhPhi: 480 },
  { Quy: 'Quý IV', SoLeHoi: 13, NguoiThamGia: 17800, DiTichThamQuan: 3200, HoatDongVanNghe: 22, KinhPhi: 620 }
];

const soSanhNam = [
  { Nam: '2024', LeHoi: 45, NguoiThamGia: 58000, KinhPhi: 2100 },
  { Nam: '2025', LeHoi: 50, NguoiThamGia: 68000, KinhPhi: 2370 },
  { Nam: '2026', LeHoi: 35, NguoiThamGia: 42500, KinhPhi: 1250 }
];

export default function BaoCaoVanHoaPage() {
  const [selectedTab, setSelectedTab] = useState('thang');

  // Tính tổng
  const tongLeHoi = baoCaoThang.reduce((sum, m) => sum + m.SoLeHoi, 0);
  const tongNguoiThamGia = baoCaoThang.reduce((sum, m) => sum + m.NguoiThamGia, 0);
  const tongDiTichThamQuan = baoCaoThang.reduce((sum, m) => sum + m.DiTichThamQuan, 0);
  const tongKinhPhi = baoCaoThang.reduce((sum, m) => sum + m.KinhPhi, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary via-accent to-secondary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-10 w-10" />
            <h1 className="text-3xl font-bold">Báo cáo Văn hóa</h1>
          </div>
          <p className="text-indigo-50">Báo cáo hoạt động văn hóa văn nghệ định kỳ</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lễ hội/sự kiện</CardTitle>
            <PartyPopper className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{tongLeHoi}</div>
            <p className="text-xs text-muted-foreground">6 tháng đầu năm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người tham gia</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{tongNguoiThamGia.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tổng lượt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt tham quan</CardTitle>
            <Landmark className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{tongDiTichThamQuan.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Di tích văn hóa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kinh phí</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tongKinhPhi}M</div>
            <p className="text-xs text-muted-foreground">Triệu đồng</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="thang">Báo cáo theo tháng</TabsTrigger>
          <TabsTrigger value="quy">Báo cáo theo quý</TabsTrigger>
          <TabsTrigger value="nam">So sánh theo năm</TabsTrigger>
        </TabsList>

        <TabsContent value="thang" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lễ hội & Hoạt động văn nghệ</CardTitle>
                <CardDescription>Số lượng theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={baoCaoThang}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Thang" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="SoLeHoi" fill="#6366f1" name="Lễ hội" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="HoatDongVanNghe" fill="#a855f7" name="Văn nghệ" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Người tham gia</CardTitle>
                <CardDescription>Lượt người theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={baoCaoThang}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Thang" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="NguoiThamGia" stroke="#ec4899" strokeWidth={2} name="Người tham gia" />
                    <Line type="monotone" dataKey="DiTichThamQuan" stroke="#f97316" strokeWidth={2} name="Tham quan di tích" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết báo cáo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {baoCaoThang.map((bc, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{bc.Thang}/2026</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Lễ hội</p>
                        <p className="font-medium">{bc.SoLeHoi} sự kiện</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tham gia</p>
                        <p className="font-medium">{bc.NguoiThamGia.toLocaleString()} người</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tham quan</p>
                        <p className="font-medium">{bc.DiTichThamQuan} lượt</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Kinh phí</p>
                        <p className="font-medium">{bc.KinhPhi}M VNĐ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tổng hợp theo quý</CardTitle>
              <CardDescription>Báo cáo hoạt động văn hóa theo quý</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={baoCaoQuy}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Quy" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="SoLeHoi" fill="#6366f1" name="Lễ hội" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="HoatDongVanNghe" fill="#a855f7" name="Văn nghệ" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {baoCaoQuy.map((quy, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    {quy.Quy}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lễ hội/sự kiện</span>
                      <span className="font-medium">{quy.SoLeHoi} sự kiện</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Người tham gia</span>
                      <span className="font-medium">{quy.NguoiThamGia.toLocaleString()} người</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lượt tham quan</span>
                      <span className="font-medium">{quy.DiTichThamQuan.toLocaleString()} lượt</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Hoạt động văn nghệ</span>
                      <span className="font-medium">{quy.HoatDongVanNghe} hoạt động</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">Kinh phí</span>
                      <span className="font-bold text-green-600">{quy.KinhPhi}M VNĐ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nam" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>So sánh theo năm</CardTitle>
              <CardDescription>Xu hướng phát triển hoạt động văn hóa</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={soSanhNam}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Nam" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="LeHoi" stroke="#6366f1" strokeWidth={3} name="Lễ hội" />
                  <Line type="monotone" dataKey="NguoiThamGia" stroke="#ec4899" strokeWidth={3} name="Người tham gia (x1000)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {soSanhNam.map((nam, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-2xl">{nam.Nam}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lễ hội</span>
                    <span className="font-medium">{nam.LeHoi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Người tham gia</span>
                    <span className="font-medium">{nam.NguoiThamGia.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Kinh phí</span>
                    <span className="font-bold text-green-600">{nam.KinhPhi}M</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
