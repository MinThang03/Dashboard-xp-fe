'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageSquare,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  ArrowLeft,
  Search,
  Download,
  Filter,
} from 'lucide-react';
import { phanAnhApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

// Mock data
const FALLBACK_FEEDBACKS = [
  {
    MaFeedback: 1,
    LoaiFeedback: 'Sự cố',
    TieuDe: 'Đèn đường hư',
    MoTa: 'Đèn đường tại khu phố 3 bị hư, cần sửa chữa gấp',
    DiaChi: 'Khu phố 3, đường số 5',
    NguoiGui: 'Nguyễn Văn A',
    SoDienThoai: '0901234567',
    NgayGui: '2026-02-20',
    TrangThai: 'Mới',
    MucDoUuTien: 'Cao',
    NguoiXuLy: '',
    KetQuaXuLy: '',
    GhiChu: '',
  },
  {
    MaFeedback: 2,
    LoaiFeedback: 'Đề xuất',
    TieuDe: 'Xây dựng sân chơi trẻ em',
    MoTa: 'Đề xuất xây dựng sân chơi trẻ em tại khu phố 1',
    DiaChi: 'Khu phố 1, gần công viên',
    NguoiGui: 'Trần Thị B',
    SoDienThoai: '0912345678',
    NgayGui: '2026-02-18',
    TrangThai: 'Đang xử lý',
    MucDoUuTien: 'Thường',
    NguoiXuLy: 'Phòng Văn hóa',
    KetQuaXuLy: '',
    GhiChu: '',
  },
  {
    MaFeedback: 3,
    LoaiFeedback: 'Vấn đề',
    TieuDe: 'Ô nhiễm tiếng ồn',
    MoTa: 'Quán karaoke hoạt động quá giờ gây ồn',
    DiaChi: 'Khu phố 2, đường chính',
    NguoiGui: 'Lê Văn C',
    SoDienThoai: '0923456789',
    NgayGui: '2026-02-15',
    TrangThai: 'Đã xử lý',
    MucDoUuTien: 'Cao',
    NguoiXuLy: 'Công an xã',
    KetQuaXuLy: 'Đã nhắc nhở chủ quán, yêu cầu tuân thủ giờ giấc',
    GhiChu: '',
  },
];

const normalizeAscii = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const mapFromApi = (item: any) => {
  return {
    MaFeedback: item.MaPhanAnh ?? item.MaFeedback ?? item.id,
    LoaiFeedback: item.TenLinhVuc || item.LoaiFeedback || 'Khác',
    TieuDe: item.TieuDe || item.TenBaoCao || 'Phản hồi',
    MoTa: item.NoiDung || item.MoTa || '',
    DiaChi: item.DiaChi || '',
    NguoiGui: item.TenNguoiPhanAnh || item.NguoiGui || '',
    SoDienThoai: item.SoDienThoai || '',
    NgayGui: String(item.NgayTao || item.NgayGui || '').slice(0, 10),
    TrangThai: item.TrangThai || 'Mới',
    MucDoUuTien: item.MucDoUuTien || 'Thường',
    NguoiXuLy: item.TenCanBoXuLy || item.NguoiXuLy || '',
    KetQuaXuLy: item.KetQuaXuLy || '',
    GhiChu: item.GhiChu || '',
    MaCongDan: item.MaCongDan ?? null,
    MaLinhVuc: item.MaLinhVuc ?? null,
  };
};

const mapToPayload = (item: any, userId: number | null) => {
  return {
    MaLinhVuc: item.MaLinhVuc ?? null,
    MaCongDan: Number.isFinite(userId) ? userId : null,
    TieuDe: item.TieuDe || 'Phản hồi từ công dân',
    NoiDung: item.MoTa || '',
    MucDoUuTien: item.MucDoUuTien || 'Thường',
    TenNguoiPhanAnh: item.NguoiGui || '',
    SoDienThoai: item.SoDienThoai || '',
    DiaChi: item.DiaChi || '',
    TenLinhVuc: item.LoaiFeedback || '',
    TrangThai: item.TrangThai || 'Mới',
    TenCanBoXuLy: item.NguoiXuLy || '',
    KetQuaXuLy: item.KetQuaXuLy || '',
    GhiChu: item.GhiChu || '',
  };
};

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [feedbacks, setFeedbacks] = useState(FALLBACK_FEEDBACKS);

  const loadData = async () => {
    const res = await phanAnhApi.getList({ page: 1, limit: 200 } as any);
    if (res?.success && Array.isArray((res as any).data)) {
      const mapped = (res as any).data.map(mapFromApi);
      const normalizedUser = normalizeAscii(user?.name || user?.username || '');
      const filtered = normalizedUser
        ? mapped.filter((item: any) => normalizeAscii(item.NguoiGui || '').includes(normalizedUser))
        : mapped;
      setFeedbacks(filtered.length ? filtered : mapped);
      return;
    }
    setFeedbacks(FALLBACK_FEEDBACKS);
  };

  useEffect(() => {
    loadData();
  }, [user?.name, user?.username]);

  // Tính toán thống kê
  const stats = {
    total: feedbacks.length,
    moi: feedbacks.filter(f => f.TrangThai === 'Mới').length,
    dangXuLy: feedbacks.filter(f => f.TrangThai === 'Đang xử lý').length,
    daXuLy: feedbacks.filter(f => f.TrangThai === 'Đã xử lý').length,
  };

  // Lọc dữ liệu
  const filteredData = feedbacks.filter(
    (f) =>
      f.TieuDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.NguoiGui.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.MoTa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      LoaiFeedback: 'Sự cố',
      TieuDe: '',
      MoTa: '',
      DiaChi: '',
      NguoiGui: user?.name || user?.username || '',
      SoDienThoai: '',
      NgayGui: new Date().toISOString().split('T')[0],
      TrangThai: 'Mới',
      MucDoUuTien: 'Thường',
      NguoiXuLy: '',
      KetQuaXuLy: '',
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
    const userId = Number(user?.id);
    const payload = mapToPayload(formData, Number.isFinite(userId) ? userId : null);

    if (isAddOpen) {
      await phanAnhApi.create(payload as any);
    } else if (selectedItem?.MaFeedback) {
      await phanAnhApi.update(selectedItem.MaFeedback, payload as any);
    }

    await loadData();
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa feedback "${item.TieuDe}"?`)) {
      phanAnhApi.delete(item.MaFeedback).then(() => loadData());
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã', 'Loại', 'Tiêu đề', 'Người gửi', 'Ngày gửi', 'Trạng thái'],
      ...filteredData.map(f => [
        f.MaFeedback,
        f.LoaiFeedback,
        f.TieuDe,
        f.NguoiGui,
        f.NgayGui,
        f.TrangThai,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã xử lý':
        return (
          <Badge className="bg-green-500/10 text-green-700 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case 'Đang xử lý':
        return (
          <Badge className="bg-blue-500/10 text-blue-700 border-0">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case 'Mới':
        return (
          <Badge className="bg-amber-500/10 text-amber-700 border-0">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Khẩn cấp':
        return <Badge className="bg-red-600 text-white">{priority}</Badge>;
      case 'Cao':
        return <Badge className="bg-red-500 text-white">{priority}</Badge>;
      case 'Thường':
        return <Badge variant="outline">{priority}</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Breadcrumb */}
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            Bàn làm việc
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">Phản hồi</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-4 text-white sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Phản hồi - Góp ý</h1>
              </div>
              <p className="text-white/90">Tiếp nhận và xử lý phản hồi từ người dân</p>
            </div>
            <div className="flex w-full flex-wrap gap-3 xl:w-auto xl:flex-nowrap">
              <Button className="w-full bg-white text-blue-600 hover:bg-white/90 sm:w-auto" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm phản hồi
              </Button>
              <Button
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0 sm:w-auto"
                onClick={handleExport}
              >
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
            <div className="p-3 bg-blue-100 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Tổng phản hồi</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-amber-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.moi}</p>
          <p className="text-sm text-muted-foreground">Phản hồi mới</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.dangXuLy}</p>
          <p className="text-sm text-muted-foreground">Đang xử lý</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.daXuLy}</p>
          <p className="text-sm text-muted-foreground">Đã xử lý</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm phản hồi..."
              className="pl-10 h-11 bg-slate-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Danh sách phản hồi</h3>
          <Badge className="bg-primary/10 text-primary border-0">
            Tổng: {filteredData.length}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Mã</th>
                <th className="text-left p-4 font-semibold">Loại</th>
                <th className="text-left p-4 font-semibold">Tiêu đề</th>
                <th className="text-left p-4 font-semibold">Người gửi</th>
                <th className="text-left p-4 font-semibold">Ngày gửi</th>
                <th className="text-left p-4 font-semibold">Mức độ</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.MaFeedback} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">
                      FB-{String(item.MaFeedback).padStart(3, '0')}
                    </span>
                  </td>
                  <td className="p-4">{item.LoaiFeedback}</td>
                  <td className="p-4">
                    <p className="font-medium">{item.TieuDe}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{item.MoTa}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{item.NguoiGui}</p>
                    <p className="text-xs text-muted-foreground">{item.SoDienThoai}</p>
                  </td>
                  <td className="p-4 text-sm">{item.NgayGui}</td>
                  <td className="p-4">{getPriorityBadge(item.MucDoUuTien)}</td>
                  <td className="p-4">{getStatusBadge(item.TrangThai)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(item)}
                      >
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết phản hồi</DialogTitle>
            <DialogDescription>FB-{String(selectedItem?.MaFeedback).padStart(3, '0')}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loại phản hồi</p>
                  <p className="font-medium">{selectedItem.LoaiFeedback}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mức độ</p>
                  {getPriorityBadge(selectedItem.MucDoUuTien)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiêu đề</p>
                <p className="font-medium text-lg">{selectedItem.TieuDe}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="text-sm">{selectedItem.MoTa}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p className="font-medium">{selectedItem.DiaChi}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Người gửi</p>
                  <p className="font-medium">{selectedItem.NguoiGui}</p>
                  <p className="text-xs text-muted-foreground">{selectedItem.SoDienThoai}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày gửi</p>
                  <p className="font-medium">{selectedItem.NgayGui}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                {getStatusBadge(selectedItem.TrangThai)}
              </div>
              {selectedItem.NguoiXuLy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Người xử lý</p>
                  <p className="font-medium">{selectedItem.NguoiXuLy}</p>
                </div>
              )}
              {selectedItem.KetQuaXuLy && (
                <div>
                  <p className="text-sm text-muted-foreground">Kết quả xử lý</p>
                  <p className="text-sm bg-green-50 p-3 rounded-lg text-green-800">
                    {selectedItem.KetQuaXuLy}
                  </p>
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
            <DialogTitle>Xử lý phản hồi</DialogTitle>
            <DialogDescription>FB-{String(selectedItem?.MaFeedback).padStart(3, '0')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_loai_fb">Loại phản hồi <span className="text-red-500">*</span></Label>
                <Select value={formData.LoaiFeedback || ''} onValueChange={(v) => setFormData({ ...formData, LoaiFeedback: v })}>
                  <SelectTrigger id="edit_loai_fb">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sự cố">Sự cố</SelectItem>
                    <SelectItem value="Vấn đề">Vấn đề</SelectItem>
                    <SelectItem value="Đề xuất">Đề xuất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_muc_do">Mức độ ưu tiên</Label>
                <Select value={formData.MucDoUuTien || ''} onValueChange={(v) => setFormData({ ...formData, MucDoUuTien: v })}>
                  <SelectTrigger id="edit_muc_do">
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
              <Label htmlFor="edit_tieu_de_fb">Tiêu đề <span className="text-red-500">*</span></Label>
              <Input
                id="edit_tieu_de_fb"
                value={formData.TieuDe || ''}
                onChange={(e) => setFormData({ ...formData, TieuDe: e.target.value })}
                placeholder="Nhập tiêu đề"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_mo_ta_fb">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="edit_mo_ta_fb"
                value={formData.MoTa || ''}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                placeholder="Mô tả chi tiết"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_dia_chi_fb">Địa chỉ</Label>
              <Input
                id="edit_dia_chi_fb"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_nguoi_gui_fb">Người gửi</Label>
                <Input
                  id="edit_nguoi_gui_fb"
                  value={formData.NguoiGui || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiGui: e.target.value })}
                  placeholder="Họ tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_sdt_fb">Số điện thoại</Label>
                <Input
                  id="edit_sdt_fb"
                  value={formData.SoDienThoai || ''}
                  onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
                  placeholder="Số điện thoại"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_trang_thai_fb">Trạng thái <span className="text-red-500">*</span></Label>
                <Select value={formData.TrangThai || ''} onValueChange={(v) => setFormData({ ...formData, TrangThai: v })}>
                  <SelectTrigger id="edit_trang_thai_fb">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mới">Mới</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_nguoi_xu_ly_fb">Người xử lý</Label>
                <Input
                  id="edit_nguoi_xu_ly_fb"
                  value={formData.NguoiXuLy || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiXuLy: e.target.value })}
                  placeholder="Tên cán bộ xử lý"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ket_qua_fb">Kết quả xử lý</Label>
              <Textarea
                id="edit_ket_qua_fb"
                value={formData.KetQuaXuLy || ''}
                onChange={(e) => setFormData({ ...formData, KetQuaXuLy: e.target.value })}
                placeholder="Mô tả kết quả xử lý"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ghi_chu_fb">Ghi chú</Label>
              <Textarea
                id="edit_ghi_chu_fb"
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
            <DialogTitle>Thêm phản hồi mới</DialogTitle>
            <DialogDescription>Nhập thông tin phản hồi từ người dân</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_loai_fb">Loại phản hồi <span className="text-red-500">*</span></Label>
                <Select value={formData.LoaiFeedback || ''} onValueChange={(v) => setFormData({ ...formData, LoaiFeedback: v })}>
                  <SelectTrigger id="add_loai_fb">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sự cố">Sự cố</SelectItem>
                    <SelectItem value="Vấn đề">Vấn đề</SelectItem>
                    <SelectItem value="Đề xuất">Đề xuất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_muc_do">Mức độ ưu tiên</Label>
                <Select value={formData.MucDoUuTien || ''} onValueChange={(v) => setFormData({ ...formData, MucDoUuTien: v })}>
                  <SelectTrigger id="add_muc_do">
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
              <Label htmlFor="add_tieu_de_fb">Tiêu đề <span className="text-red-500">*</span></Label>
              <Input
                id="add_tieu_de_fb"
                value={formData.TieuDe || ''}
                onChange={(e) => setFormData({ ...formData, TieuDe: e.target.value })}
                placeholder="Nhập tiêu đề"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_mo_ta_fb">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="add_mo_ta_fb"
                value={formData.MoTa || ''}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                placeholder="Mô tả chi tiết"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_dia_chi_fb">Địa chỉ</Label>
              <Input
                id="add_dia_chi_fb"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_nguoi_gui_fb">Người gửi</Label>
                <Input
                  id="add_nguoi_gui_fb"
                  value={formData.NguoiGui || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiGui: e.target.value })}
                  placeholder="Họ tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_sdt_fb">Số điện thoại</Label>
                <Input
                  id="add_sdt_fb"
                  value={formData.SoDienThoai || ''}
                  onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
                  placeholder="Số điện thoại"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ghi_chu_fb">Ghi chú</Label>
              <Textarea
                id="add_ghi_chu_fb"
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
              Thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
