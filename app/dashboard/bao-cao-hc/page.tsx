'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart3,
  FileText,
  Calendar,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  Home,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { baoCaoApi } from '@/lib/api';

export default function BaoCaoHCPage() {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    TenBaoCao: '',
    LoaiBaoCao: 'Báo cáo tháng',
    KyBaoCao: '',
    NgayLap: new Date().toISOString().split('T')[0],
    NguoiLap: '',
    GhiChu: '',
    SoLieuThongKeText: '{"TongHoSo":0}',
    SoLieuThongKe: {},
  });

  const toSearchable = (value: any) => String(value ?? '').toLowerCase();
  const parseId = (value: any) => {
    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : null;
  };

  const loadData = async () => {
    const result = await baoCaoApi.getList({ page: 1, limit: 500 });
    if (result.success && Array.isArray(result.data)) {
      setReports(result.data);
      setLoadError('');
      return;
    }

    setReports([]);
    setLoadError(result?.message || 'Không thể tải danh sách báo cáo hành chính');
  };

  useEffect(() => {
    loadData();
  }, []);

  // Tính toán thống kê từ dữ liệu thực
  const stats = {
    baoCaoThang: reports.filter(bc => bc.LoaiBaoCao === 'Báo cáo tháng' || bc.LoaiBaoCao === 'Báo cáo tuần' || bc.LoaiBaoCao === 'Báo cáo định kỳ').length,
    baoCaoQuy: reports.filter(bc => bc.LoaiBaoCao === 'Báo cáo quý').length,
    baoCaoNam: reports.filter(bc => bc.LoaiBaoCao === 'Báo cáo năm').length,
    daDuyet: reports.filter(bc => bc.TrangThai === 'Đã duyệt' || bc.TrangThai === 'Đã hoàn thành').length,
  };

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = reports.filter(bc =>
    toSearchable(bc.TieuDe).includes(toSearchable(searchQuery)) ||
    toSearchable(bc.ThangNam).includes(toSearchable(searchQuery))
  );

  const handleView = (report: any) => {
    setSelectedReport(report);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã BC', 'Tên báo cáo', 'Loại BC', 'Kỳ BC', 'Ngày lập', 'Trạng thái'],
      ...filteredData.map(bc => [
        bc.MaBaoCao,
        bc.TieuDe,
        bc.LoaiBaoCao,
        bc.ThangNam,
        bc.NgayLap,
        bc.TrangThai
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-hanh-chinh-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAdd = () => {
    setSelectedReport(null);
    setFormData({
      TenBaoCao: '',
      LoaiBaoCao: 'Báo cáo tháng',
      KyBaoCao: '',
      NgayLap: new Date().toISOString().split('T')[0],
      NguoiLap: '',
      GhiChu: '',
      SoLieuThongKeText: '{"TongHoSo":0}',
      SoLieuThongKe: {},
    });
    setIsAddOpen(true);
  };

  const handleEdit = (report: any) => {
    setSelectedReport(report);
    setFormData({
      TenBaoCao: report.TieuDe || '',
      LoaiBaoCao: report.LoaiBaoCao || 'Báo cáo tháng',
      KyBaoCao: report.ThangNam || '',
      NgayLap: report.NgayLap ? String(report.NgayLap).split('T')[0] : new Date().toISOString().split('T')[0],
      NguoiLap: report.NguoiLapText ? String(report.NguoiLapText) : '',
      GhiChu: report.GhiChu || '',
      SoLieuThongKeText: report.SoLieuThongKe ? JSON.stringify(report.SoLieuThongKe, null, 2) : '{"TongHoSo":0}',
      SoLieuThongKe: report.SoLieuThongKe || {},
    });
    setIsAddOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const tieuDe = String(formData.TenBaoCao || '').trim();
      const thangNam = String(formData.KyBaoCao || '').trim();
      const nguoiLap = String(formData.NguoiLap || '').trim();
      const ghiChu = String(formData.GhiChu || '').trim();

      if (!tieuDe) {
        alert('Vui lòng nhập tên báo cáo');
        return;
      }

      if (thangNam.length > 7) {
        alert('Kỳ báo cáo tối đa 7 ký tự. Ví dụ: 2026-03 hoặc Q1/2026');
        return;
      }

      let parsedStats: any = null;
      if (String(formData.SoLieuThongKeText || '').trim()) {
        try {
          parsedStats = JSON.parse(formData.SoLieuThongKeText);
        } catch {
          alert('Số liệu thống kê phải là JSON hợp lệ');
          return;
        }
      }

      const payload = {
        TieuDe: tieuDe,
        LoaiBaoCao: formData.LoaiBaoCao,
        ThangNam: thangNam || null,
        NgayLap: formData.NgayLap || null,
        TrangThai: 'Chờ duyệt',
        NoiDung: null,
        NguoiLapText: nguoiLap || null,
        SoLieuThongKe: parsedStats,
        GhiChu: ghiChu || null,
      };

      const selectedId = parseId(selectedReport?.MaBaoCao);
      const result = selectedId !== null
        ? await baoCaoApi.update(selectedId, payload)
        : await baoCaoApi.create(payload);

      if (!result?.success) {
        throw new Error(result?.message || 'Không thể lưu báo cáo hành chính');
      }

      await loadData();
      setSearchQuery('');
      setIsAddOpen(false);
      setSelectedReport(null);
      setFormData({
        TenBaoCao: '',
        LoaiBaoCao: 'Báo cáo tháng',
        KyBaoCao: '',
        NgayLap: new Date().toISOString().split('T')[0],
        NguoiLap: '',
        GhiChu: '',
        SoLieuThongKeText: '{"TongHoSo":0}',
        SoLieuThongKe: {},
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Lưu báo cáo hành chính thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (report: any) => {
    const reportId = parseId(report?.MaBaoCao);
    if (reportId === null) {
      alert('Mã báo cáo không hợp lệ, không thể xóa');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa báo cáo ${report.TieuDe || report.TenBaoCao}?`)) {
      return;
    }
    try {
      const result = await baoCaoApi.delete(reportId);
      if (!result?.success) {
        throw new Error(result?.message || 'Không thể xóa báo cáo hành chính');
      }
      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Xóa báo cáo hành chính thất bại');
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const handleDownload = (item: any) => {
    const content = `Báo cáo: ${item.TieuDe}\nMã: ${item.MaBaoCao}\nKỳ: ${item.ThangNam}\nNgày lập: ${item.NgayLap}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${item.MaBaoCao}-${item.TieuDe}.txt`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã duyệt':
        return <Badge className="bg-status-success/10 text-status-success border-0"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'Chờ duyệt':
        return <Badge className="bg-amber-500/10 text-amber-700 border-0"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-700 border-0">{status}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Bàn làm việc
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">Báo cáo Hành chính</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {loadError && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-700">
          {loadError}
        </Card>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Báo cáo Hành chính</h1>
              </div>
              <p className="text-white/90">Thống kê và báo cáo định kỳ hoạt động hành chính</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-primary hover:bg-white/90" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo báo cáo
              </Button>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.baoCaoThang}</p>
          <p className="text-sm text-muted-foreground">Báo cáo tháng/tuần</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.baoCaoQuy}</p>
          <p className="text-sm text-muted-foreground">Báo cáo quý</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.baoCaoNam}</p>
          <p className="text-sm text-muted-foreground">Báo cáo năm</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.daDuyet}</p>
          <p className="text-sm text-muted-foreground">Đã phê duyệt</p>
        </Card>
      </div>

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
                <th className="text-left p-4 font-semibold">Loại</th>
                <th className="text-left p-4 font-semibold">Kỳ báo cáo</th>
                <th className="text-left p-4 font-semibold">Ngày lập</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((bc, index) => (
                <tr key={parseId(bc.MaBaoCao) ?? `bao-cao-${index}`} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">BC-{String(bc.MaBaoCao).padStart(3, '0')}</span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="font-medium truncate">{bc.TieuDe}</p>
                    <p className="text-xs text-muted-foreground">{bc.NguoiLapText || 'Không có người lập'}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{bc.LoaiBaoCao}</Badge>
                  </td>
                  <td className="p-4">{bc.ThangNam || '-'}</td>
                  <td className="p-4 text-sm text-muted-foreground">{bc.NgayLap}</td>
                  <td className="p-4">{getStatusBadge(bc.TrangThai)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(bc)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(bc)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" onClick={() => handleDelete(bc)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownload(bc)}>
                        <Download className="w-4 h-4" />
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết báo cáo</DialogTitle>
            <DialogDescription>
              {selectedReport?.TieuDe}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loại báo cáo</p>
                  <p className="font-medium">{selectedReport.LoaiBaoCao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kỳ báo cáo</p>
                  <p className="font-medium">{selectedReport.ThangNam || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày lập</p>
                  <p className="font-medium">{selectedReport.NgayLap}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Người lập</p>
                  <p className="font-medium">{selectedReport.NguoiLapText || 'Không xác định'}</p>
                </div>
              </div>

              {selectedReport.SoLieuThongKe && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Số liệu thống kê</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedReport.SoLieuThongKe).map(([key, value]) => (
                      <Card key={key} className="p-4 bg-slate-50">
                        <p className="text-sm text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-xl font-bold text-primary">
                          {typeof value === 'number' && value > 1000 
                            ? value.toLocaleString('vi-VN') 
                            : String(value)}
                          {key.includes('TyLe') ? '%' : ''}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-2xl md:max-w-3xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle>{selectedReport ? 'Cập nhật báo cáo hành chính' : 'Tạo báo cáo hành chính'}</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết cho báo cáo mới
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 sm:space-y-3">
            {/* Tên báo cáo */}
            <div>
              <label className="text-sm font-medium">Tên báo cáo</label>
              <Input
                placeholder="Nhập tên báo cáo"
                value={formData.TenBaoCao}
                onChange={(e) => setFormData({ ...formData, TenBaoCao: e.target.value })}
                className="h-11 px-4 mt-1"
              />
            </div>

            {/* Loại báo cáo và Kỳ báo cáo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-sm font-medium">Loại báo cáo</label>
                <Select value={formData.LoaiBaoCao} onValueChange={(value) => setFormData({ ...formData, LoaiBaoCao: value })}>
                  <SelectTrigger className="h-11 px-4 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Báo cáo tháng">Báo cáo tháng</SelectItem>
                    <SelectItem value="Báo cáo quý">Báo cáo quý</SelectItem>
                    <SelectItem value="Báo cáo năm">Báo cáo năm</SelectItem>
                    <SelectItem value="Báo cáo tuần">Báo cáo tuần</SelectItem>
                    <SelectItem value="Báo cáo định kỳ">Báo cáo định kỳ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Kỳ báo cáo</label>
                <Input
                  placeholder="Ví dụ: 2026-03 hoặc Q1/2026"
                  value={formData.KyBaoCao}
                  onChange={(e) => setFormData({ ...formData, KyBaoCao: e.target.value })}
                  className="h-11 px-4 mt-1"
                />
              </div>
            </div>

            {/* Ngày lập và Người lập */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-sm font-medium">Ngày lập</label>
                <Input
                  type="date"
                  value={formData.NgayLap}
                  onChange={(e) => setFormData({ ...formData, NgayLap: e.target.value })}
                  className="h-11 px-4 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Người lập</label>
                <Input
                  placeholder="Nhập tên người lập"
                  value={formData.NguoiLap}
                  onChange={(e) => setFormData({ ...formData, NguoiLap: e.target.value })}
                  className="h-11 px-4 mt-1"
                />
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="text-sm font-medium">Ghi chú</label>
              <Textarea
                placeholder="Nhập ghi chú thêm..."
                value={formData.GhiChu}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                className="mt-1 min-h-20 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Số liệu thống kê (JSON)</label>
              <Textarea
                placeholder='{"TongHoSo": 120, "TyLeDungHan": 96}'
                value={formData.SoLieuThongKeText}
                onChange={(e) => setFormData({ ...formData, SoLieuThongKeText: e.target.value })}
                className="mt-1 min-h-24 font-mono text-xs resize-y"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSaving ? 'Đang lưu...' : selectedReport ? 'Lưu thay đổi' : 'Tạo báo cáo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
