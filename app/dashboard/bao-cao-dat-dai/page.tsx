'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Map,
  FileCheck,
  Layers,
  LandPlot,
  Search,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { mockBaoCaoDatDai, mockThongKeDatDai } from '@/lib/mock-data';

export default function BaoCaoDatDaiPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Lọc dữ liệu
  const filteredData = mockBaoCaoDatDai.filter(bc =>
    bc.TenBaoCao.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bc.TenDonVi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã BC', 'Tên báo cáo', 'Kỳ BC', 'Đơn vị', 'Diện tích', 'Đã cấp GCN', 'Chưa cấp GCN'],
      ...filteredData.map(bc => [
        bc.MaBaoCao,
        bc.TenBaoCao,
        bc.KyBaoCao,
        bc.TenDonVi,
        bc.TongDienTich,
        bc.DaCapGCN,
        bc.ChuaCapGCN
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-dat-dai-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã hoàn thành':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Đã hoàn thành</Badge>;
      case 'Đang thực hiện':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><Clock className="w-3 h-3 mr-1" />Đang thực hiện</Badge>;
      default:
        return <Badge variant="outline">{trangThai}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Bàn làm việc
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">Báo cáo Đất đai</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-success via-secondary to-status-success p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Map className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Báo cáo Đất đai</h1>
              </div>
              <p className="text-white/90">Thống kê tình hình quản lý đất đai, cấp giấy chứng nhận quyền sử dụng đất</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-lime-100 rounded-xl">
              <LandPlot className="w-6 h-6 text-lime-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{mockThongKeDatDai.TongDienTich.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Tổng diện tích (ha)</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <FileCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{mockThongKeDatDai.DaCapGCN.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Đã cấp GCN</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{mockThongKeDatDai.ChuaCapGCN.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Chưa cấp GCN</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{mockThongKeDatDai.SoThua.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Tổng số thửa</p>
        </Card>
      </div>

      <Tabs defaultValue="bao-cao" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="bao-cao">Báo cáo đất đai</TabsTrigger>
          <TabsTrigger value="thong-ke">Thống kê theo loại</TabsTrigger>
          <TabsTrigger value="theo-ap">Theo ấp/thôn</TabsTrigger>
        </TabsList>

        <TabsContent value="bao-cao" className="space-y-6">
          {/* Search */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm báo cáo..."
                  className="pl-10 h-11 bg-slate-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11" onClick={handleFilter}>
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Danh sách báo cáo</h3>
              <Badge className="bg-primary/10 text-primary border-0">
                Tổng: {filteredData.length}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã BC</th>
                    <th className="text-left p-4 font-semibold">Tên báo cáo</th>
                    <th className="text-left p-4 font-semibold">Kỳ báo cáo</th>
                    <th className="text-left p-4 font-semibold">Đơn vị</th>
                    <th className="text-right p-4 font-semibold">Diện tích (m²)</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                    <th className="text-right p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((bc, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">{bc.MaBaoCao}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{bc.TenBaoCao}</p>
                        <p className="text-xs text-muted-foreground">{bc.LoaiBaoCao}</p>
                      </td>
                      <td className="p-4 text-sm">{bc.KyBaoCao}</td>
                      <td className="p-4 text-sm">{bc.TenDonVi}</td>
                      <td className="p-4 text-right font-semibold">{bc.TongDienTich.toLocaleString()}</td>
                      <td className="p-4">{getTrangThaiBadge(bc.TrangThai)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(bc)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="thong-ke" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Theo loại đất</h3>
              <div className="space-y-3">
                {mockThongKeDatDai.TheoLoaiDat.map((item, index) => {
                  const colors = ['bg-green-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500'];
                  const total = mockThongKeDatDai.TongDienTich;
                  const percent = ((item.DienTich / total) * 100).toFixed(1);
                  return (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                          <p className="font-medium">{item.LoaiDat}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{percent}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.DienTich.toLocaleString()} ha</span>
                        <span className="font-medium">{item.SoThua.toLocaleString()} thửa</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index % colors.length]}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Tình trạng cấp GCN</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#e2e8f0"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="#22c55e"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${(mockThongKeDatDai.DaCapGCN / mockThongKeDatDai.SoThua) * 502} 502`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">
                        {((mockThongKeDatDai.DaCapGCN / mockThongKeDatDai.SoThua) * 100).toFixed(1)}%
                      </span>
                      <span className="text-sm text-muted-foreground">Đã cấp GCN</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">{mockThongKeDatDai.DaCapGCN.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Đã cấp GCN</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl">
                    <p className="text-2xl font-bold text-amber-600">{mockThongKeDatDai.ChuaCapGCN.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Chưa cấp GCN</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="theo-ap" className="space-y-6">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Thống kê theo ấp/thôn</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Ấp/Thôn</th>
                    <th className="text-right p-4 font-semibold">Diện tích (ha)</th>
                    <th className="text-right p-4 font-semibold">Số thửa</th>
                    <th className="text-right p-4 font-semibold">Đã cấp GCN</th>
                    <th className="text-right p-4 font-semibold">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {mockThongKeDatDai.TheoAp.map((ap, index) => {
                    const tyLe = ((ap.DaCapGCN / ap.SoThua) * 100).toFixed(1);
                    return (
                      <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium">{ap.TenAp}</td>
                        <td className="p-4 text-right">{ap.DienTich.toLocaleString()}</td>
                        <td className="p-4 text-right">{ap.SoThua.toLocaleString()}</td>
                        <td className="p-4 text-right text-green-600 font-semibold">{ap.DaCapGCN.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-green-500"
                                style={{ width: `${tyLe}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12">{tyLe}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết báo cáo đất đai</DialogTitle>
            <DialogDescription>
              {selectedItem?.MaBaoCao}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedItem.TenBaoCao}</h3>
                {getTrangThaiBadge(selectedItem.TrangThai)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loại báo cáo</p>
                  <Badge variant="outline">{selectedItem.LoaiBaoCao}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kỳ báo cáo</p>
                  <p className="font-medium">{selectedItem.KyBaoCao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Đơn vị</p>
                  <p className="font-medium">{selectedItem.TenDonVi}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày lập</p>
                  <p className="font-medium">{selectedItem.NgayLap}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Thông tin chi tiết</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-primary">{selectedItem.TongDienTich.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Diện tích (m²)</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{selectedItem.DaCapGCN.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Đã cấp GCN</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-lg font-bold text-amber-600">{selectedItem.ChuaCapGCN.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Chưa cấp GCN</p>
                  </div>
                </div>
              </div>

              {selectedItem.GhiChu && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="text-sm">{selectedItem.GhiChu}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
