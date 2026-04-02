'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, X } from 'lucide-react';
import {
  Coins,
  TrendingUp,
  Calendar,
  Users,
  Search,
  Plus,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { mockThuPhiLePhi, mockTongHopThuPhi } from '@/lib/mock-data';
import { thuPhiApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

export default function ThuPhiPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [records, setRecords] = useState<any[]>([]);

  const loadData = async () => {
    const res = await thuPhiApi.getList({ page: 1, limit: 200 });
    if (res.success && Array.isArray((res as any).data)) {
      setRecords((res as any).data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dataSource = records.length > 0 ? records : mockThuPhiLePhi;
  const normalizeText = (value: unknown) =>
    typeof value === 'string' ? value.toLowerCase() : String(value ?? '').toLowerCase();

  // Tính toán thống kê
  const tongThuThang = dataSource.reduce((sum, item) => sum + (item.ThanhTien || 0), 0);
  const soDoiTuong = dataSource.reduce((sum, item) => sum + (item.SoLuong || 0), 0);
  const daThu = dataSource.filter(item => item.TrangThai === 'Đã thu').length;
  const tyLeThu = dataSource.length ? Math.round((daThu / dataSource.length) * 100) : 0;

  // Lọc dữ liệu
  const filteredData = dataSource.filter((item) => {
    const normalizedQuery = normalizeText(searchQuery);
    return (
      normalizeText(item.LoaiPhi).includes(normalizedQuery) ||
      normalizeText(item.MoTa).includes(normalizedQuery)
    );
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    }
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã PT', 'Loại phí', 'Số tiền', 'Người nộp', 'Ngày thu'],
      ...filteredData.map(item => [
        item.MaPhieuThu,
        item.LoaiPhi,
        item.SoTien,
        item.TenNguoiNop,
        item.NgayThu
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `thu-phi-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      LoaiPhi: '',
      MoTa: '',
      DonGia: 0,
      SoLuong: 1,
      ThanhTien: 0,
      TenNguoiNop: '',
      CCCDNguoiNop: '',
      DiaChiNguoiNop: '',
      NgayThu: new Date().toISOString().split('T')[0],
      NguoiThu: '',
      TrangThai: 'Đã thu',
      GhiChu: '',
    });
    setIsAddOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (selectedItem?.MaThuPhi) {
      await thuPhiApi.update(selectedItem.MaThuPhi, formData);
    } else {
      await thuPhiApi.create(formData);
    }
    await loadData();
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phiếu thu ${item.LoaiPhi}?`)) {
      thuPhiApi.delete(item.MaThuPhi).then(() => loadData());
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
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
          <span className="text-foreground font-medium">Thu phí - Lệ phí</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-warning via-accent to-status-warning p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Coins className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Thu phí - Lệ phí</h1>
              </div>
              <p className="text-white/90">Quản lý thu phí chợ, vệ sinh, môi trường và lệ phí hành chính</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-emerald-600 hover:bg-white/90" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo phiếu thu
              </Button>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <FunctionStyledPanel
        title="Dòng chảy thu phí - lệ phí"
        subtitle="Area chart giúp quan sát hiệu quả thu và mức hoàn thành theo quy mô phát sinh"
        variant="eco-fee"
        items={[
          { label: 'Thu tháng (triệu)', value: Number((tongThuThang / 1000000).toFixed(0)), color: '#16a34a' },
          { label: 'Loại phí/lệ phí', value: dataSource.length, color: '#3b82f6' },
          { label: 'Lượt thu', value: soDoiTuong, color: '#9333ea' },
          { label: 'Tỷ lệ hoàn thành', value: tyLeThu, color: '#10b981' },
        ]}
      />

      {/* Tổng hợp theo tháng */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Tổng hợp thu theo tháng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTongHopThuPhi.map((item, index) => (
            <Card key={index} className="p-4 bg-slate-50">
              <p className="font-semibold text-primary">{item.ThangNam}</p>
              <p className="text-2xl font-bold mt-2">{formatCurrency(item.TongThu)}</p>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Tỷ lệ thu: {item.TyLeThuDuoc}%</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm loại phí..."
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
          <h3 className="text-lg font-semibold">Chi tiết thu phí tháng</h3>
          <Badge className="bg-primary/10 text-primary border-0">
            Tổng: {filteredData.length} khoản
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Mã</th>
                <th className="text-left p-4 font-semibold">Loại phí</th>
                <th className="text-left p-4 font-semibold">Mô tả</th>
                <th className="text-right p-4 font-semibold">Đơn giá</th>
                <th className="text-right p-4 font-semibold">Số lượng</th>
                <th className="text-right p-4 font-semibold">Thành tiền</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.MaThuPhi} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">TP-{String(item.MaThuPhi).padStart(3, '0')}</span>
                  </td>
                  <td className="p-4 font-medium">{item.LoaiPhi}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{item.MoTa}</td>
                  <td className="p-4 text-right">{item.DonGia.toLocaleString('vi-VN')}đ</td>
                  <td className="p-4 text-right">{item.SoLuong}</td>
                  <td className="p-4 text-right font-semibold">{item.ThanhTien.toLocaleString('vi-VN')}đ</td>
                  <td className="p-4">
                    {item.TrangThai === 'Đã thu' ? (
                      <Badge className="bg-green-500/10 text-green-700 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {item.TrangThai}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700 border-0">
                        <XCircle className="w-3 h-3 mr-1" />
                        Chưa thu
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(item)}>
                        <Trash2 className="w-4 h-4" />
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu thu</DialogTitle>
            <DialogDescription>
              {selectedItem?.LoaiPhi}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mã phiếu</p>
                  <p className="font-medium">TP-{String(selectedItem.MaThuPhi).padStart(3, '0')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tháng năm</p>
                  <p className="font-medium">{selectedItem.ThangNam}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày thu</p>
                  <p className="font-medium">{selectedItem.NgayThu}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Người thu</p>
                  <p className="font-medium">{selectedItem.NguoiThu}</p>
                </div>
              </div>
              {selectedItem.MoTa && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Mô tả</p>
                  <p className="text-sm">{selectedItem.MoTa}</p>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Thông tin người nộp</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Họ tên: </span>
                    <span className="font-medium">{selectedItem.TenNguoiNop || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CCCD: </span>
                    <span className="font-medium">{selectedItem.CCCDNguoiNop || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Địa chỉ: </span>
                    <span className="font-medium">{selectedItem.DiaChiNguoiNop || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đơn giá:</span>
                  <span>{selectedItem.DonGia.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số lượng:</span>
                  <span>{selectedItem.SoLuong}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Thành tiền:</span>
                  <span className="text-primary">{selectedItem.ThanhTien.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              {selectedItem.GhiChu && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="text-sm">{selectedItem.GhiChu}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cập nhật phiếu thu</DialogTitle>
            <DialogDescription>TP-{String(selectedItem?.MaThuPhi).padStart(3, '0')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_loai_phi">Loại phí <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_loai_phi"
                  value={formData.LoaiPhi || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiPhi: e.target.value })}
                  placeholder="VD: Phí chợ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_ngay_thu">Ngày thu <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_ngay_thu"
                  type="date"
                  value={formData.NgayThu || ''}
                  onChange={(e) => setFormData({ ...formData, NgayThu: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_mo_ta">Mô tả</Label>
              <Textarea
                id="edit_mo_ta"
                value={formData.MoTa || ''}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                placeholder="Nhập mô tả chi tiết"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_don_gia">Đơn giá (VNĐ)</Label>
                <Input
                  id="edit_don_gia"
                  type="number"
                  value={formData.DonGia || ''}
                  onChange={(e) => {
                    const donGia = parseInt(e.target.value) || 0;
                    const soLuong = formData.SoLuong || 1;
                    setFormData({ ...formData, DonGia: donGia, ThanhTien: donGia * soLuong });
                  }}
                  placeholder="VD: 50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_so_luong">Số lượng</Label>
                <Input
                  id="edit_so_luong"
                  type="number"
                  value={formData.SoLuong || 1}
                  onChange={(e) => {
                    const soLuong = parseInt(e.target.value) || 1;
                    const donGia = formData.DonGia || 0;
                    setFormData({ ...formData, SoLuong: soLuong, ThanhTien: donGia * soLuong });
                  }}
                  placeholder="VD: 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_thanh_tien">Thành tiền (VNĐ)</Label>
                <Input
                  id="edit_thanh_tien"
                  type="number"
                  value={formData.ThanhTien || 0}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ten_nguoi_nop">Tên người nộp</Label>
                <Input
                  id="edit_ten_nguoi_nop"
                  value={formData.TenNguoiNop || ''}
                  onChange={(e) => setFormData({ ...formData, TenNguoiNop: e.target.value })}
                  placeholder="Nhập tên người nộp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_cccd_nguoi_nop">CCCD người nộp</Label>
                <Input
                  id="edit_cccd_nguoi_nop"
                  value={formData.CCCDNguoiNop || ''}
                  onChange={(e) => setFormData({ ...formData, CCCDNguoiNop: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_dia_chi_nguoi_nop">Địa chỉ người nộp</Label>
              <Input
                id="edit_dia_chi_nguoi_nop"
                value={formData.DiaChiNguoiNop || ''}
                onChange={(e) => setFormData({ ...formData, DiaChiNguoiNop: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_nguoi_thu">Người thu</Label>
                <Input
                  id="edit_nguoi_thu"
                  value={formData.NguoiThu || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiThu: e.target.value })}
                  placeholder="Nhập tên cán bộ thu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_trang_thai_thu">Trạng thái</Label>
                <Select value={formData.TrangThai || 'Đã thu'} onValueChange={(v) => setFormData({ ...formData, TrangThai: v })}>
                  <SelectTrigger id="edit_trang_thai_thu">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đã thu">Đã thu</SelectItem>
                    <SelectItem value="Chưa thu">Chưa thu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ghi_chu_thu">Ghi chú</Label>
              <Textarea
                id="edit_ghi_chu_thu"
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                placeholder="Ghi chú thêm"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiếu thu mới</DialogTitle>
            <DialogDescription>Nhập thông tin phiếu thu phí/lệ phí</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_loai_phi">Loại phí <span className="text-red-500">*</span></Label>
                <Input
                  id="add_loai_phi"
                  value={formData.LoaiPhi || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiPhi: e.target.value })}
                  placeholder="VD: Phí chợ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_ngay_thu">Ngày thu <span className="text-red-500">*</span></Label>
                <Input
                  id="add_ngay_thu"
                  type="date"
                  value={formData.NgayThu || ''}
                  onChange={(e) => setFormData({ ...formData, NgayThu: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_mo_ta">Mô tả</Label>
              <Textarea
                id="add_mo_ta"
                value={formData.MoTa || ''}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                placeholder="Nhập mô tả chi tiết"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_don_gia">Đơn giá (VNĐ)</Label>
                <Input
                  id="add_don_gia"
                  type="number"
                  value={formData.DonGia || ''}
                  onChange={(e) => {
                    const donGia = parseInt(e.target.value) || 0;
                    const soLuong = formData.SoLuong || 1;
                    setFormData({ ...formData, DonGia: donGia, ThanhTien: donGia * soLuong });
                  }}
                  placeholder="VD: 50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_so_luong">Số lượng</Label>
                <Input
                  id="add_so_luong"
                  type="number"
                  value={formData.SoLuong || 1}
                  onChange={(e) => {
                    const soLuong = parseInt(e.target.value) || 1;
                    const donGia = formData.DonGia || 0;
                    setFormData({ ...formData, SoLuong: soLuong, ThanhTien: donGia * soLuong });
                  }}
                  placeholder="VD: 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_thanh_tien">Thành tiền (VNĐ)</Label>
                <Input
                  id="add_thanh_tien"
                  type="number"
                  value={formData.ThanhTien || 0}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ten_nguoi_nop">Tên người nộp</Label>
                <Input
                  id="add_ten_nguoi_nop"
                  value={formData.TenNguoiNop || ''}
                  onChange={(e) => setFormData({ ...formData, TenNguoiNop: e.target.value })}
                  placeholder="Nhập tên người nộp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_cccd_nguoi_nop">CCCD người nộp</Label>
                <Input
                  id="add_cccd_nguoi_nop"
                  value={formData.CCCDNguoiNop || ''}
                  onChange={(e) => setFormData({ ...formData, CCCDNguoiNop: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_dia_chi_nguoi_nop">Địa chỉ người nộp</Label>
              <Input
                id="add_dia_chi_nguoi_nop"
                value={formData.DiaChiNguoiNop || ''}
                onChange={(e) => setFormData({ ...formData, DiaChiNguoiNop: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_nguoi_thu">Người thu</Label>
              <Input
                id="add_nguoi_thu"
                value={formData.NguoiThu || ''}
                onChange={(e) => setFormData({ ...formData, NguoiThu: e.target.value })}
                placeholder="Nhập tên cán bộ thu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ghi_chu_thu">Ghi chú</Label>
              <Textarea
                id="add_ghi_chu_thu"
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                placeholder="Ghi chú thêm"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo phiếu thu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
