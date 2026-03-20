'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart3,
  AlertTriangle,
  Clock,
  TrendingDown,
  Search,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
} from 'lucide-react';
import { mockHoSoTonDong, mockThongKeHoSoTonDong } from '@/lib/mock-data';

export default function HoSoTonDongPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Lọc dữ liệu
  const filteredData = mockHoSoTonDong.filter(hs =>
    hs.TenNghiepVu.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hs.TenCongDan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã HS', 'Tên nghiệp vụ', 'Công dân', 'Ngày nhận', 'Hạn XL', 'Số ngày', 'Mức độ'],
      ...filteredData.map(hs => [
        hs.MaHoSo,
        hs.TenNghiepVu,
        hs.TenCongDan,
        hs.NgayNhan,
        hs.HanXuLy,
        hs.SoNgayTonDong,
        hs.MucDoQuaHan
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ho-so-ton-dong-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const getMucDoQuaHanBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Quá hạn':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><XCircle className="w-3 h-3 mr-1" />{mucDo}</Badge>;
      case 'Trong hạn':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />{mucDo}</Badge>;
      default:
        return <Badge variant="outline">{mucDo}</Badge>;
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
          <span className="text-foreground font-medium">Hồ sơ Tồn đọng</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-warning via-primary to-status-warning p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Thống kê Hồ sơ Tồn động</h1>
              </div>
              <p className="text-white/90">Báo cáo hồ sơ tồn đọng chưa xử lý theo lĩnh vực</p>
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
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{mockThongKeHoSoTonDong.TongHoSoTonDong}</p>
          <p className="text-sm text-muted-foreground">Hồ sơ tồn đọng</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">{mockThongKeHoSoTonDong.QuaHan}</p>
          <p className="text-sm text-muted-foreground">Quá hạn xử lý</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{mockThongKeHoSoTonDong.TrongHan}</p>
          <p className="text-sm text-muted-foreground">Trong hạn xử lý</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">-15%</p>
          <p className="text-sm text-muted-foreground">Giảm so tháng trước</p>
        </Card>
      </div>

      {/* Thống kê theo lĩnh vực và cán bộ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Theo lĩnh vực</h3>
          <div className="space-y-3">
            {mockThongKeHoSoTonDong.TheoLinhVuc.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.LinhVuc}</p>
                  <p className="text-sm text-muted-foreground">{item.QuaHan} quá hạn</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{item.SoLuong}</span>
                  <Badge className={item.QuaHan > 0 ? 'bg-red-500/10 text-red-700 border-0' : 'bg-green-500/10 text-green-700 border-0'}>
                    {item.QuaHan > 0 ? 'Có quá hạn' : 'Tốt'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Theo cán bộ xử lý</h3>
          <div className="space-y-3">
            {mockThongKeHoSoTonDong.TheoCanBo.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium">{item.CanBo}</p>
                </div>
                <span className="text-2xl font-bold">{item.SoLuong}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm hồ sơ..."
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
          <h3 className="text-lg font-semibold">Chi tiết hồ sơ tồn đọng</h3>
          <Badge className="bg-primary/10 text-primary border-0">
            Tổng: {filteredData.length}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Mã HS</th>
                <th className="text-left p-4 font-semibold">Loại hồ sơ</th>
                <th className="text-left p-4 font-semibold">Công dân</th>
                <th className="text-left p-4 font-semibold">Ngày nhận</th>
                <th className="text-left p-4 font-semibold">Hạn XL</th>
                <th className="text-right p-4 font-semibold">Số ngày</th>
                <th className="text-left p-4 font-semibold">Tình trạng</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((hs, index) => (
                <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">{hs.MaHoSo}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{hs.TenNghiepVu}</p>
                    <p className="text-xs text-muted-foreground">{hs.TenLinhVuc}</p>
                  </td>
                  <td className="p-4">{hs.TenCongDan}</td>
                  <td className="p-4 text-sm">{hs.NgayNhan}</td>
                  <td className="p-4 text-sm">{hs.HanXuLy}</td>
                  <td className="p-4 text-right">
                    <span className={`font-semibold ${hs.MucDoQuaHan === 'Quá hạn' ? 'text-red-600' : 'text-amber-600'}`}>
                      {hs.SoNgayTonDong} ngày
                    </span>
                  </td>
                  <td className="p-4">{getMucDoQuaHanBadge(hs.MucDoQuaHan)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(hs)}>
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

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ tồn đọng</DialogTitle>
            <DialogDescription>
              {selectedItem?.MaHoSo}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedItem.TenNghiepVu}</h3>
                {getMucDoQuaHanBadge(selectedItem.MucDoQuaHan)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Công dân</p>
                  <p className="font-medium">{selectedItem.TenCongDan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lĩnh vực</p>
                  <Badge variant="outline">{selectedItem.TenLinhVuc}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày nhận</p>
                  <p className="font-medium">{selectedItem.NgayNhan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hạn xử lý</p>
                  <p className="font-medium">{selectedItem.HanXuLy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số ngày tồn đọng</p>
                  <p className={`font-semibold ${selectedItem.MucDoQuaHan === 'Quá hạn' ? 'text-red-600' : 'text-amber-600'}`}>
                    {selectedItem.SoNgayTonDong} ngày
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cán bộ xử lý</p>
                  <p className="font-medium">{selectedItem.CanBoXuLy}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Lý do tồn đọng</p>
                <p className="p-3 bg-amber-50 rounded-lg text-amber-800 mt-1">{selectedItem.LyDoTonDong}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
