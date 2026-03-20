'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';

interface HoTich {
  MaHoTich: number;
  LoaiDangKy: string;
  HoTen: string;
  NgaySinh?: string;
  NoiDangKy?: string;
  NgayDangKy?: string;
  TrangThai?: string;
}

interface VanBan {
  MaVanBan: number;
  SoVanBan: string;
  TenVanBan: string;
  LoaiVanBan: string;
  NgayBanHanh: string;
  CoQuanBanHanh?: string;
  TrangThai?: string;
}

export default function DatabaseDemoPage() {
  const [hoTichData, setHoTichData] = useState<HoTich[]>([]);
  const [vanBanData, setVanBanData] = useState<VanBan[]>([]);
  const [hoTichStats, setHoTichStats] = useState<any>(null);
  const [vanBanStats, setVanBanStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load Hộ Tịch data
      const hoTichResponse: any = await api.hoTich.getList({ page: 1, limit: 10 });
      if (hoTichResponse.success) {
        setHoTichData(hoTichResponse.data);
      }

      const hoTichStatsResponse: any = await api.hoTich.getStats();
      if (hoTichStatsResponse.success) {
        setHoTichStats(hoTichStatsResponse.data);
      }

      // Load Văn Bản data
      const vanBanResponse: any = await api.vanBan.getList({ page: 1, limit: 10 });
      if (vanBanResponse.success) {
        setVanBanData(vanBanResponse.data);
      }

      const vanBanStatsResponse: any = await api.vanBan.getStats();
      if (vanBanStatsResponse.success) {
        setVanBanStats(vanBanStatsResponse.data);
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data from database');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu từ database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle className="text-destructive">Lỗi kết nối</CardTitle>
            <CardDescription>Không thể kết nối đến backend API</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <p className="text-sm">
              Vui lòng kiểm tra:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Backend đang chạy tại http://localhost:3006</li>
                <li>Database PostgreSQL đã được khởi động</li>
                <li>Migrations đã được chạy</li>
              </ul>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🎉 Kết nối Database thành công!</h1>
        <p className="text-muted-foreground mt-2">
          Dữ liệu được load trực tiếp từ PostgreSQL database
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tổng Hộ Tịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hoTichStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">hồ sơ trong database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Khai sinh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hoTichStats?.khaisinh || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">đăng ký khai sinh</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tổng Văn Bản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vanBanStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">văn bản trong database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Còn hiệu lực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vanBanStats?.conHieuLuc || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">văn bản đang có hiệu lực</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="ho-tich" className="w-full">
        <TabsList>
          <TabsTrigger value="ho-tich">Hộ Tịch ({hoTichData.length})</TabsTrigger>
          <TabsTrigger value="van-ban">Văn Bản ({vanBanData.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ho-tich" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dữ liệu Hộ Tịch từ Database</CardTitle>
              <CardDescription>
                Danh sách các hồ sơ hộ tịch được load từ bảng HoTich
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hoTichData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Chưa có dữ liệu. Chạy migrations seed để tạo dữ liệu mẫu.</p>
                  <code className="text-xs mt-2 block">npm run migration:run</code>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã</TableHead>
                      <TableHead>Loại đăng ký</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Nơi đăng ký</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hoTichData.map((item) => (
                      <TableRow key={item.MaHoTich}>
                        <TableCell className="font-medium">{item.MaHoTich}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.LoaiDangKy}</Badge>
                        </TableCell>
                        <TableCell>{item.HoTen}</TableCell>
                        <TableCell>
                          {item.NgayDangKy ? new Date(item.NgayDangKy).toLocaleDateString('vi-VN') : '-'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.NoiDangKy || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={item.TrangThai === 'Đã duyệt' ? 'default' : 'secondary'}>
                            {item.TrangThai || 'Chưa xử lý'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="van-ban" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dữ liệu Văn Bản từ Database</CardTitle>
              <CardDescription>
                Danh sách các văn bản được load từ bảng VanBan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vanBanData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Chưa có dữ liệu. Chạy migrations seed để tạo dữ liệu mẫu.</p>
                  <code className="text-xs mt-2 block">npm run migration:run</code>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã</TableHead>
                      <TableHead>Số văn bản</TableHead>
                      <TableHead>Tên văn bản</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Ngày ban hành</TableHead>
                      <TableHead>Cơ quan</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vanBanData.map((item) => (
                      <TableRow key={item.MaVanBan}>
                        <TableCell className="font-medium">{item.MaVanBan}</TableCell>
                        <TableCell>{item.SoVanBan}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{item.TenVanBan}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.LoaiVanBan}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.NgayBanHanh).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">{item.CoQuanBanHanh || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={item.TrangThai === 'Còn hiệu lực' ? 'default' : 'secondary'}>
                            {item.TrangThai || 'N/A'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">ℹ️ Thông tin API</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Backend URL:</span>
            <code className="bg-background px-2 py-1 rounded">http://localhost:3006/api</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hộ Tịch API:</span>
            <code className="bg-background px-2 py-1 rounded">GET /ho-tich</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Văn Bản API:</span>
            <code className="bg-background px-2 py-1 rounded">GET /van-ban</code>
          </div>
          <div className="mt-4 p-3 bg-status-success/10 border border-status-success/20 rounded">
            <p className="text-status-success dark:text-status-success/80 text-xs">
              ✅ Kết nối database thành công! Bạn đã có thể thay thế mock data bằng API calls thực.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
