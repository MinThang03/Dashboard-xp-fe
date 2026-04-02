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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  MapPin,
  Phone,
  Calendar,
  User,
  Star,
} from 'lucide-react';
import { mockPhanAnhKienNghi } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, X } from 'lucide-react';
import { phanAnhApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

export default function PhanAnhPage() {
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
    const res = await phanAnhApi.getList({ page: 1, limit: 200 } as any);
    if (res.success && Array.isArray((res as any).data)) {
      setRecords((res as any).data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const dataSource = records.length > 0 ? records : mockPhanAnhKienNghi;

  // Tính toán thống kê
  const stats = {
    total: dataSource.length,
    choXuLy: dataSource.filter(pa => pa.TrangThai === 'Mới' || pa.TrangThai === 'Đang xử lý').length,
    daXuLy: dataSource.filter(pa => pa.TrangThai === 'Đã xử lý').length,
    khanCap: dataSource.filter(pa => pa.MucDoUuTien === 'Khẩn cấp').length,
  };

  // Lọc dữ liệu
  const filteredData = dataSource.filter(pa =>
    pa.TieuDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pa.TenNguoiPhanAnh.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pa.NoiDung.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã PA', 'Tiêu đề', 'Người gửi', 'Ngày gửi', 'Mức độ', 'Trạng thái'],
      ...filteredData.map(item => [
        item.MaPhanAnh,
        item.TieuDe,
        item.TenNguoiPhanAnh,
        item.NgayTao,
        item.MucDoUuTien,
        item.TrangThai
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `phan-anh-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      TieuDe: '',
      NoiDung: '',
      TenNguoiPhanAnh: '',
      SoDienThoai: '',
      DiaChi: '',
      TenLinhVuc: 'Hạ tầng',
      ToaDo: '',
      MucDoUuTien: 'Thường',
      TrangThai: 'Mới',
      TenCanBoXuLy: '',
      NgayTao: new Date().toISOString(),
      KetQuaXuLy: '',
      DiemDanhGia: null,
    });
    setIsAddOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (selectedItem?.MaPhanAnh) {
      await (phanAnhApi as any).update(selectedItem.MaPhanAnh, formData);
    } else {
      await (phanAnhApi as any).create(formData);
    }
    await loadData();
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phản ánh "${item.TieuDe}"?`)) {
      (phanAnhApi as any).delete(item.MaPhanAnh).then(() => loadData());
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã xử lý':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'Đang xử lý':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'Mới':
        return <Badge className="bg-amber-500/10 text-amber-700 border-0"><AlertCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-700 border-0">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Khẩn cấp':
        return <Badge className="bg-red-500 text-white">{priority}</Badge>;
      case 'Cao':
        return <Badge className="bg-orange-500 text-white">{priority}</Badge>;
      case 'Thường':
        return <Badge variant="outline">{priority}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
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
          <span className="text-foreground font-medium">Phản ánh - Kiến nghị</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Phản ánh - Kiến nghị</h1>
              </div>
              <p className="text-white/90">Tiếp nhận và xử lý phản ánh từ nhân dân</p>
            </div>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row gap-2 sm:gap-3">
              <Button className="w-full sm:w-auto bg-white text-orange-600 hover:bg-white/90" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Tiếp nhận
              </Button>
              <Button className="w-full sm:w-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <FunctionStyledPanel
        title="Nhiệt độ phản ánh người dân"
        subtitle="Donut chart thể hiện áp lực xử lý phản ánh và mức ưu tiên khẩn"
        variant="sec-feedback"
        items={[
          { label: 'Tổng phản ánh', value: stats.total, color: '#3b82f6' },
          { label: 'Chờ/Đang xử lý', value: stats.choXuLy, color: '#f59e0b' },
          { label: 'Đã xử lý', value: stats.daXuLy, color: '#22c55e' },
          { label: 'Khẩn cấp', value: stats.khanCap, color: '#ef4444' },
        ]}
      />

      {/* Search */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm phản ánh..."
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
          <h3 className="text-lg font-semibold">Danh sách phản ánh</h3>
          <Badge className="bg-primary/10 text-primary border-0">
            Tổng: {filteredData.length}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Mã</th>
                <th className="text-left p-4 font-semibold">Nội dung</th>
                <th className="text-left p-4 font-semibold">Người gửi</th>
                <th className="text-left p-4 font-semibold">Lĩnh vực</th>
                <th className="text-left p-4 font-semibold">Độ ưu tiên</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((pa) => (
                <tr key={pa.MaPhanAnh} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">PA-{String(pa.MaPhanAnh).padStart(3, '0')}</span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="font-medium truncate">{pa.TieuDe}</p>
                    <p className="text-xs text-muted-foreground truncate">{pa.NoiDung.substring(0, 50)}...</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{pa.TenNguoiPhanAnh}</p>
                    <p className="text-xs text-muted-foreground">{pa.SoDienThoai}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{pa.TenLinhVuc}</Badge>
                  </td>
                  <td className="p-4">{getPriorityBadge(pa.MucDoUuTien)}</td>
                  <td className="p-4">{getStatusBadge(pa.TrangThai)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(pa)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(pa)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(pa)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết phản ánh</DialogTitle>
            <DialogDescription>
              PA-{String(selectedItem?.MaPhanAnh).padStart(3, '0')}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedItem.TieuDe}</h3>
                <div className="flex gap-2 mt-2">
                  {getPriorityBadge(selectedItem.MucDoUuTien)}
                  {getStatusBadge(selectedItem.TrangThai)}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm">{selectedItem.NoiDung}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Người gửi</p>
                    <p className="font-medium">{selectedItem.TenNguoiPhanAnh}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{selectedItem.SoDienThoai}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{selectedItem.DiaChi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày gửi</p>
                    <p className="font-medium">{selectedItem.NgayTao}</p>
                  </div>
                </div>
              </div>

              {selectedItem.TenCanBoXuLy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Cán bộ xử lý</p>
                  <p className="font-medium">{selectedItem.TenCanBoXuLy}</p>
                </div>
              )}

              {selectedItem.KetQuaXuLy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Kết quả xử lý</p>
                  <p className="p-3 bg-green-50 rounded-lg text-green-800">{selectedItem.KetQuaXuLy}</p>
                </div>
              )}

              {selectedItem.DiemDanhGia && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{selectedItem.DiemDanhGia}/5 điểm hài lòng</span>
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
            <DialogTitle>Xử lý phản ánh - kiến nghị</DialogTitle>
            <DialogDescription>PA-{String(selectedItem?.MaPhanAnh).padStart(4, '0')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_tieu_de_pa">Tiêu đề <span className="text-red-500">*</span></Label>
              <Input
                id="edit_tieu_de_pa"
                value={formData.TieuDe || ''}
                onChange={(e) => setFormData({ ...formData, TieuDe: e.target.value })}
                placeholder="Nhập tiêu đề phản ánh"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_noi_dung_pa">Nội dung <span className="text-red-500">*</span></Label>
              <Textarea
                id="edit_noi_dung_pa"
                value={formData.NoiDung || ''}
                onChange={(e) => setFormData({ ...formData, NoiDung: e.target.value })}
                placeholder="Mô tả chi tiết vấn đề..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_nguoi_pa">Người phản ánh</Label>
                <Input
                  id="edit_nguoi_pa"
                  value={formData.TenNguoiPhanAnh || ''}
                  onChange={(e) => setFormData({ ...formData, TenNguoiPhanAnh: e.target.value })}
                  placeholder="Họ tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_sdt_pa">Số điện thoại</Label>
                <Input
                  id="edit_sdt_pa"
                  value={formData.SoDienThoai || ''}
                  onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
                  placeholder="Số điện thoại liên hệ"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_dia_chi_pa">Địa chỉ</Label>
              <Input
                id="edit_dia_chi_pa"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Địa chỉ người phản ánh"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_linh_vuc_pa">Lĩnh vực <span className="text-red-500">*</span></Label>
                <Select value={formData.TenLinhVuc || ''} onValueChange={(v) => setFormData({ ...formData, TenLinhVuc: v })}>
                  <SelectTrigger id="edit_linh_vuc_pa">
                    <SelectValue placeholder="Chọn lĩnh vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hạ tầng">Hạ tầng</SelectItem>
                    <SelectItem value="Môi trường">Môi trường</SelectItem>
                    <SelectItem value="An ninh trật tự">An ninh trật tự</SelectItem>
                    <SelectItem value="Y tế">Y tế</SelectItem>
                    <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_muc_do_pa">Mức độ ưu tiên <span className="text-red-500">*</span></Label>
                <Select value={formData.MucDoUuTien || ''} onValueChange={(v) => setFormData({ ...formData, MucDoUuTien: v })}>
                  <SelectTrigger id="edit_muc_do_pa">
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Khẩn cấp">Khẩn cấp</SelectItem>
                    <SelectItem value="Cao">Cao</SelectItem>
                    <SelectItem value="Thường">Thường</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_toa_do_pa">Tọa độ địa điểm</Label>
              <Input
                id="edit_toa_do_pa"
                value={formData.ToaDo || ''}
                onChange={(e) => setFormData({ ...formData, ToaDo: e.target.value })}
                placeholder="VD: 10.762622, 106.660172"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_trang_thai_pa">Trạng thái <span className="text-red-500">*</span></Label>
                <Select value={formData.TrangThai || ''} onValueChange={(v) => setFormData({ ...formData, TrangThai: v })}>
                  <SelectTrigger id="edit_trang_thai_pa">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mới">Mới</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                    <SelectItem value="Từ chối">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_can_bo_pa">Cán bộ xử lý</Label>
                <Input
                  id="edit_can_bo_pa"
                  value={formData.TenCanBoXuLy || ''}
                  onChange={(e) => setFormData({ ...formData, TenCanBoXuLy: e.target.value })}
                  placeholder="Tên cán bộ phụ trách"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ket_qua_pa">Kết quả xử lý</Label>
              <Textarea
                id="edit_ket_qua_pa"
                value={formData.KetQuaXuLy || ''}
                onChange={(e) => setFormData({ ...formData, KetQuaXuLy: e.target.value })}
                placeholder="Mô tả kết quả xử lý..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_diem_danh_gia">Điểm đánh giá (nếu đã xử lý)</Label>
              <Select value={formData.DiemDanhGia?.toString() || ''} onValueChange={(v) => setFormData({ ...formData, DiemDanhGia: v ? parseInt(v) : null })}>
                <SelectTrigger id="edit_diem_danh_gia">
                  <SelectValue placeholder="Chọn điểm đánh giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ Rất hài lòng (5)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ Hài lòng (4)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Trung bình (3)</SelectItem>
                  <SelectItem value="2">⭐⭐ Không hài lòng (2)</SelectItem>
                  <SelectItem value="1">⭐ Rất không hài lòng (1)</SelectItem>
                </SelectContent>
              </Select>
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
            <DialogTitle>Tiếp nhận phản ánh - kiến nghị mới</DialogTitle>
            <DialogDescription>Nhập thông tin phản ánh từ nhân dân</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add_tieu_de_pa">Tiêu đề <span className="text-red-500">*</span></Label>
              <Input
                id="add_tieu_de_pa"
                value={formData.TieuDe || ''}
                onChange={(e) => setFormData({ ...formData, TieuDe: e.target.value })}
                placeholder="Nhập tiêu đề phản ánh"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_noi_dung_pa">Nội dung <span className="text-red-500">*</span></Label>
              <Textarea
                id="add_noi_dung_pa"
                value={formData.NoiDung || ''}
                onChange={(e) => setFormData({ ...formData, NoiDung: e.target.value })}
                placeholder="Mô tả chi tiết vấn đề..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_nguoi_pa">Người phản ánh</Label>
                <Input
                  id="add_nguoi_pa"
                  value={formData.TenNguoiPhanAnh || ''}
                  onChange={(e) => setFormData({ ...formData, TenNguoiPhanAnh: e.target.value })}
                  placeholder="Họ tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_sdt_pa">Số điện thoại</Label>
                <Input
                  id="add_sdt_pa"
                  value={formData.SoDienThoai || ''}
                  onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
                  placeholder="Số điện thoại liên hệ"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_dia_chi_pa">Địa chỉ</Label>
              <Input
                id="add_dia_chi_pa"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Địa chỉ người phản ánh"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_linh_vuc_pa">Lĩnh vực <span className="text-red-500">*</span></Label>
                <Select value={formData.TenLinhVuc || ''} onValueChange={(v) => setFormData({ ...formData, TenLinhVuc: v })}>
                  <SelectTrigger id="add_linh_vuc_pa">
                    <SelectValue placeholder="Chọn lĩnh vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hạ tầng">Hạ tầng</SelectItem>
                    <SelectItem value="Môi trường">Môi trường</SelectItem>
                    <SelectItem value="An ninh trật tự">An ninh trật tự</SelectItem>
                    <SelectItem value="Y tế">Y tế</SelectItem>
                    <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_muc_do_pa">Mức độ ưu tiên <span className="text-red-500">*</span></Label>
                <Select value={formData.MucDoUuTien || ''} onValueChange={(v) => setFormData({ ...formData, MucDoUuTien: v })}>
                  <SelectTrigger id="add_muc_do_pa">
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Khẩn cấp">Khẩn cấp</SelectItem>
                    <SelectItem value="Cao">Cao</SelectItem>
                    <SelectItem value="Thường">Thường</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_toa_do_pa">Tọa độ địa điểm</Label>
              <Input
                id="add_toa_do_pa"
                value={formData.ToaDo || ''}
                onChange={(e) => setFormData({ ...formData, ToaDo: e.target.value })}
                placeholder="VD: 10.762622, 106.660172 (nếu có)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_can_bo_pa">Cán bộ xử lý</Label>
              <Input
                id="add_can_bo_pa"
                value={formData.TenCanBoXuLy || ''}
                onChange={(e) => setFormData({ ...formData, TenCanBoXuLy: e.target.value })}
                placeholder="Tên cán bộ phụ trách (nếu có)"
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
              Tiếp nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
