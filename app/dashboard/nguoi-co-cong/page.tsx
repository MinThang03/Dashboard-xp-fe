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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Award,
  Users,
  Heart,
  Search,
  Plus,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  CheckCircle2,
  Gift,
  Coins,
  Calendar,
  User,
} from 'lucide-react';
import { mockNguoiCoCong, mockCheDoNguoiCoCong, mockQuaTangThamHoi } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, X } from 'lucide-react';

export default function NguoiCoCongPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Tính toán thống kê
  const stats = {
    tongNCC: mockNguoiCoCong.length,
    thuongBinh: mockNguoiCoCong.filter(ncc => ncc.LoaiDoiTuong.includes('Thương binh')).length,
    giaDinhLietSi: mockNguoiCoCong.filter(ncc => ncc.LoaiDoiTuong.includes('liệt sĩ') || ncc.LoaiDoiTuong.includes('VNAH')).length,
    dangHuong: mockCheDoNguoiCoCong.filter(cd => cd.TrangThai === 'Đang hưởng').length,
  };

  // Lọc dữ liệu
  const filteredNCC = mockNguoiCoCong.filter(ncc =>
    ncc.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ncc.LoaiDoiTuong.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã NCC', 'Họ tên', 'Ngày sinh', 'Loại', 'Mức hưởng', 'Tình trạng'],
      ...filteredNCC.map(ncc => [
        ncc.MaNguoiCoCong,
        ncc.HoTen,
        ncc.NgaySinh,
        ncc.LoaiDoiTuong,
        ncc.MucHuongHangThang,
        ncc.TinhTrang
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nguoi-co-cong-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAdd = () => {
    setFormData({
      CCCD: '',
      HoTen: '',
      NgaySinh: '',
      GioiTinh: 'Nam',
      DiaChi: '',
      LoaiDoiTuong: 'Thương binh',
      HangThuongBinh: '',
      TyLeMatSucLaoDong: 0,
      DanhHieu: '',
      MucHuongHangThang: 0,
      NgayHuong: '',
      TinhTrang: 'Đang hưởng',
      GhiChu: '',
    });
    setIsAddOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    // TODO: API call to save
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${item.HoTen}?`)) {
      console.log('Deleting:', item);
      // TODO: API call to delete
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    }
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const getLoaiBadge = (loai: string) => {
    const colors: Record<string, string> = {
      'Thương binh': 'bg-red-500/10 text-red-700',
      'Bà mẹ VNAH': 'bg-yellow-500/10 text-yellow-700',
      'Gia đình liệt sĩ': 'bg-purple-500/10 text-purple-700',
    };
    const colorClass = Object.entries(colors).find(([key]) => loai.includes(key))?.[1] || 'bg-gray-500/10 text-gray-700';
    return <Badge className={`${colorClass} border-0`}>{loai}</Badge>;
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
          <span className="text-foreground font-medium">Người có Công</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-status-warning to-accent p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Người có Công</h1>
              </div>
              <p className="text-white/90">Quản lý chính sách ưu đãi người có công với cách mạng</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-amber-600 hover:bg-white/90" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm hồ sơ
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.tongNCC}</p>
          <p className="text-sm text-muted-foreground">Người có công</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-red-100 rounded-xl">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.thuongBinh}</p>
          <p className="text-sm text-muted-foreground">Thương binh</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.giaDinhLietSi}</p>
          <p className="text-sm text-muted-foreground">Gia đình LS/VNAH</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <Coins className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.dangHuong}</p>
          <p className="text-sm text-muted-foreground">Chế độ đang hưởng</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="danh-sach" className="space-y-4">
        <TabsList>
          <TabsTrigger value="danh-sach">Danh sách NCC</TabsTrigger>
          <TabsTrigger value="che-do">Chế độ ưu đãi</TabsTrigger>
          <TabsTrigger value="tham-hoi">Thăm hỏi - Tặng quà</TabsTrigger>
        </TabsList>

        <TabsContent value="danh-sach" className="space-y-4">
          {/* Search */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm người có công..."
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
              <h3 className="text-lg font-semibold">Danh sách người có công</h3>
              <Badge className="bg-primary/10 text-primary border-0">
                Tổng: {filteredNCC.length}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã NCC</th>
                    <th className="text-left p-4 font-semibold">Họ tên</th>
                    <th className="text-left p-4 font-semibold">Danh hiệu/Loại</th>
                    <th className="text-right p-4 font-semibold">Mức trợ cấp</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                    <th className="text-right p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNCC.map((ncc) => (
                    <tr key={ncc.MaNguoiCoCong} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">NCC-{String(ncc.MaNguoiCoCong).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{ncc.HoTen}</p>
                        <p className="text-xs text-muted-foreground">{ncc.NgaySinh}</p>
                      </td>
                      <td className="p-4">{getLoaiBadge(ncc.LoaiDoiTuong)}</td>
                      <td className="p-4 text-right font-semibold">{formatCurrency(ncc.MucHuongHangThang)}</td>
                      <td className="p-4">
                        <Badge className="bg-green-500/10 text-green-700 border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />{ncc.TinhTrang}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(ncc)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(ncc)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(ncc)}>
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
        </TabsContent>

        <TabsContent value="che-do" className="space-y-4">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Chế độ ưu đãi người có công</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Người có công</th>
                    <th className="text-left p-4 font-semibold">Loại</th>
                    <th className="text-left p-4 font-semibold">Tên chế độ</th>
                    <th className="text-right p-4 font-semibold">Số tiền</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCheDoNguoiCoCong.map((cd) => (
                    <tr key={cd.CheDoID} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">CD-{String(cd.CheDoID).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4 font-medium">{cd.TenNguoiCoCong}</td>
                      <td className="p-4">{getLoaiBadge(cd.LoaiDoiTuong)}</td>
                      <td className="p-4">{cd.TenCheDo}</td>
                      <td className="p-4 text-right font-semibold">{formatCurrency(cd.SoTien)}</td>
                      <td className="p-4">
                        {cd.TrangThai === 'Đang hưởng' ? (
                          <Badge className="bg-green-500/10 text-green-700 border-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" />{cd.TrangThai}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-700 border-0">{cd.TrangThai}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tham-hoi" className="space-y-4">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Lịch sử thăm hỏi - Tặng quà</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Người có công</th>
                    <th className="text-left p-4 font-semibold">Hình thức</th>
                    <th className="text-right p-4 font-semibold">Giá trị</th>
                    <th className="text-left p-4 font-semibold">Ngày thực hiện</th>
                    <th className="text-left p-4 font-semibold">Người thực hiện</th>
                  </tr>
                </thead>
                <tbody>
                  {mockQuaTangThamHoi.map((qt) => (
                    <tr key={qt.ThamHoiID} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">TH-{String(qt.ThamHoiID).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4 font-medium">{qt.TenNguoiCoCong}</td>
                      <td className="p-4">
                        <Badge variant="outline">
                          <Gift className="w-3 h-3 mr-1" />{qt.HinhThuc}
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-semibold">{formatCurrency(qt.GiaTri)}</td>
                      <td className="p-4 text-sm">{qt.NgayThucHien}</td>
                      <td className="p-4 text-sm text-muted-foreground">{qt.NguoiThucHien}</td>
                    </tr>
                  ))}
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
            <DialogTitle>Chi tiết người có công</DialogTitle>
            <DialogDescription>
              NCC-{String(selectedItem?.MaNCC).padStart(3, '0')}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedItem.HoTen}</h3>
                  {getLoaiBadge(selectedItem.LoaiDoiTuong)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Ngày sinh</p>
                  <p className="font-medium">{selectedItem.NgaySinh}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giới tính</p>
                  <p className="font-medium">{selectedItem.GioiTinh || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CCCD</p>
                  <p className="font-medium">{selectedItem.CCCD}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{selectedItem.DiaChi}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hồ sơ gốc</p>
                  <p className="font-medium">{selectedItem.HoSoGoc}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mức trợ cấp</p>
                  <p className="font-semibold text-primary text-lg">{formatCurrency(selectedItem.MucHuongHangThang)}/tháng</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hạng thương binh</p>
                  <p className="font-medium">{selectedItem.HangThuongBinh || 'Không áp dụng'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tỷ lệ mất sức lao động</p>
                  <p className="font-medium">{selectedItem.TyLeMatSucLaoDong ? `${selectedItem.TyLeMatSucLaoDong}%` : 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Danh hiệu</p>
                  <p className="font-medium">{selectedItem.DanhHieu || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu hưởng</p>
                  <p className="font-medium">{selectedItem.NgayHuong || 'Chưa cập nhật'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Tình trạng</p>
                  <p className="font-medium">{selectedItem.TinhTrang || 'Đang hưởng'}</p>
                </div>
              </div>
              {selectedItem.GhiChu && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium">{selectedItem.GhiChu}</p>
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
            <DialogTitle>Chỉnh sửa hồ sơ người có công</DialogTitle>
            <DialogDescription>NCC-{String(selectedItem?.MaNguoiCoCong).padStart(3, '0')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ho_ten">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_ho_ten"
                  value={formData.HoTen || ''}
                  onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_cccd_ncc">Số CCCD <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_cccd_ncc"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ngay_sinh_ncc">Ngày sinh</Label>
                <Input
                  id="edit_ngay_sinh_ncc"
                  type="date"
                  value={formData.NgaySinh || ''}
                  onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_gioi_tinh_ncc">Giới tính</Label>
                <Select value={formData.GioiTinh || 'Nam'} onValueChange={(v) => setFormData({ ...formData, GioiTinh: v })}>
                  <SelectTrigger id="edit_gioi_tinh_ncc">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_dia_chi_ncc">Địa chỉ <span className="text-red-500">*</span></Label>
              <Input
                id="edit_dia_chi_ncc"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_loai_ncc">Loại đối tượng <span className="text-red-500">*</span></Label>
                <Select value={formData.LoaiDoiTuong || ''} onValueChange={(v) => setFormData({ ...formData, LoaiDoiTuong: v })}>
                  <SelectTrigger id="edit_loai_ncc">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thương binh">Thương binh</SelectItem>
                    <SelectItem value="Bệnh binh">Bệnh binh</SelectItem>
                    <SelectItem value="Bà mẹ VNAH">Bà mẹ VNAH</SelectItem>
                    <SelectItem value="Gia đình liệt sĩ">Gia đình liệt sĩ</SelectItem>
                    <SelectItem value="Con liệt sĩ">Con liệt sĩ</SelectItem>
                    <SelectItem value="Người có công giúp đỡ CM">Người có công giúp đỡ CM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_hang_tb">Hạng thương binh</Label>
                <Input
                  id="edit_hang_tb"
                  value={formData.HangThuongBinh || ''}
                  onChange={(e) => setFormData({ ...formData, HangThuongBinh: e.target.value })}
                  placeholder="VD: 2/4, 3/4"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ty_le">Tỷ lệ mất sức lao động (%)</Label>
                <Input
                  id="edit_ty_le"
                  type="number"
                  value={formData.TyLeMatSucLaoDong || ''}
                  onChange={(e) => setFormData({ ...formData, TyLeMatSucLaoDong: parseInt(e.target.value) })}
                  placeholder="VD: 61"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_danh_hieu">Danh hiệu</Label>
                <Input
                  id="edit_danh_hieu"
                  value={formData.DanhHieu || ''}
                  onChange={(e) => setFormData({ ...formData, DanhHieu: e.target.value })}
                  placeholder="VD: Anh hùng LLVTND"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_muc_huong">Mức hưởng hằng tháng (VNĐ)</Label>
                <Input
                  id="edit_muc_huong"
                  type="number"
                  value={formData.MucHuongHangThang || ''}
                  onChange={(e) => setFormData({ ...formData, MucHuongHangThang: parseInt(e.target.value) })}
                  placeholder="VD: 3500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_ngay_huong">Ngày bắt đầu hưởng</Label>
                <Input
                  id="edit_ngay_huong"
                  type="date"
                  value={formData.NgayHuong || ''}
                  onChange={(e) => setFormData({ ...formData, NgayHuong: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_tinh_trang_ncc">Tình trạng</Label>
              <Select value={formData.TinhTrang || 'Đang hưởng'} onValueChange={(v) => setFormData({ ...formData, TinhTrang: v })}>
                <SelectTrigger id="edit_tinh_trang_ncc">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đang hưởng">Đang hưởng</SelectItem>
                  <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
                  <SelectItem value="Đã ngừng">Đã ngừng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ghi_chu_ncc">Ghi chú</Label>
              <Textarea
                id="edit_ghi_chu_ncc"
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                placeholder="Nhập ghi chú"
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
            <DialogTitle>Thêm người có công mới</DialogTitle>
            <DialogDescription>Nhập thông tin hồ sơ người có công</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ho_ten_ncc">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="add_ho_ten_ncc"
                  value={formData.HoTen || ''}
                  onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_cccd_ncc">Số CCCD <span className="text-red-500">*</span></Label>
                <Input
                  id="add_cccd_ncc"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ngay_sinh_ncc">Ngày sinh</Label>
                <Input
                  id="add_ngay_sinh_ncc"
                  type="date"
                  value={formData.NgaySinh || ''}
                  onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_gioi_tinh_ncc">Giới tính</Label>
                <Select value={formData.GioiTinh || 'Nam'} onValueChange={(v) => setFormData({ ...formData, GioiTinh: v })}>
                  <SelectTrigger id="add_gioi_tinh_ncc">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_dia_chi_ncc">Địa chỉ <span className="text-red-500">*</span></Label>
              <Input
                id="add_dia_chi_ncc"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_loai_ncc">Loại đối tượng <span className="text-red-500">*</span></Label>
                <Select value={formData.LoaiDoiTuong || ''} onValueChange={(v) => setFormData({ ...formData, LoaiDoiTuong: v })}>
                  <SelectTrigger id="add_loai_ncc">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thương binh">Thương binh</SelectItem>
                    <SelectItem value="Bệnh binh">Bệnh binh</SelectItem>
                    <SelectItem value="Bà mẹ VNAH">Bà mẹ VNAH</SelectItem>
                    <SelectItem value="Gia đình liệt sĩ">Gia đình liệt sĩ</SelectItem>
                    <SelectItem value="Con liệt sĩ">Con liệt sĩ</SelectItem>
                    <SelectItem value="Người có công giúp đỡ CM">Người có công giúp đỡ CM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_hang_tb">Hạng thương binh</Label>
                <Input
                  id="add_hang_tb"
                  value={formData.HangThuongBinh || ''}
                  onChange={(e) => setFormData({ ...formData, HangThuongBinh: e.target.value })}
                  placeholder="VD: 2/4, 3/4"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ty_le">Tỷ lệ mất sức lao động (%)</Label>
                <Input
                  id="add_ty_le"
                  type="number"
                  value={formData.TyLeMatSucLaoDong || ''}
                  onChange={(e) => setFormData({ ...formData, TyLeMatSucLaoDong: parseInt(e.target.value) })}
                  placeholder="VD: 61"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_danh_hieu">Danh hiệu</Label>
                <Input
                  id="add_danh_hieu"
                  value={formData.DanhHieu || ''}
                  onChange={(e) => setFormData({ ...formData, DanhHieu: e.target.value })}
                  placeholder="VD: Anh hùng LLVTND"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_muc_huong">Mức hưởng hằng tháng (VNĐ)</Label>
                <Input
                  id="add_muc_huong"
                  type="number"
                  value={formData.MucHuongHangThang || ''}
                  onChange={(e) => setFormData({ ...formData, MucHuongHangThang: parseInt(e.target.value) })}
                  placeholder="VD: 3500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_ngay_huong">Ngày bắt đầu hưởng</Label>
                <Input
                  id="add_ngay_huong"
                  type="date"
                  value={formData.NgayHuong || ''}
                  onChange={(e) => setFormData({ ...formData, NgayHuong: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ghi_chu_ncc">Ghi chú</Label>
              <Textarea
                id="add_ghi_chu_ncc"
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                placeholder="Nhập ghi chú"
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
