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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Heart,
  Users,
  Coins,
  TrendingUp,
  Search,
  Plus,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  User,
} from 'lucide-react';
import { mockDoiTuongBaoTro, mockTroCapXaHoi, mockTongHopBaoTro } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, X } from 'lucide-react';

export default function BaoTroXaHoiPage() {
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
    tongDoiTuong: mockDoiTuongBaoTro.length,
    dangHuong: mockDoiTuongBaoTro.filter(dt => dt.TinhTrang === 'Đang hưởng').length,
    tongTienThang: mockTroCapXaHoi.reduce((sum, tc) => sum + tc.SoTien, 0),
    daChiTra: mockTroCapXaHoi.filter(tc => tc.TrangThai === 'Đã chi trả').length,
  };

  // Lọc dữ liệu
  const filteredDoiTuong = mockDoiTuongBaoTro.filter(dt =>
    dt.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dt.LoaiDoiTuong.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã đối tượng', 'Họ tên', 'CCCD', 'Loại', 'Mức trợ cấp', 'Trạng thái'],
      ...filteredDoiTuong.map(item => [
        item.MaDoiTuong,
        item.HoTen,
        item.CCCD,
        item.LoaiDoiTuong,
        item.MucTroCap,
        item.TinhTrang
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao-tro-xa-hoi-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAdd = () => {
    setFormData({
      CCCD: '',
      HoTen: '',
      NgaySinh: '',
      GioiTinh: 'Nam',
      DiaChi: '',
      LoaiDoiTuong: 'Người cao tuổi cô đơn',
      MucTroCap: 540000,
      NgayBatDau: new Date().toISOString().split('T')[0],
      TinhTrang: 'Đang hưởng',
      NguoiGiamHo: '',
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
    if (confirm(`Bạn có chắc chắn muốn xóa đối tượng ${item.HoTen}?`)) {
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
      'Người cao tuổi cô đơn': 'bg-purple-500/10 text-purple-700',
      'Người khuyết tật nặng': 'bg-blue-500/10 text-blue-700',
      'Người khuyết tật đặc biệt nặng': 'bg-red-500/10 text-red-700',
      'Trẻ mồ côi': 'bg-amber-500/10 text-amber-700',
    };
    return <Badge className={`${colors[loai] || 'bg-gray-500/10 text-gray-700'} border-0`}>{loai}</Badge>;
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
          <span className="text-foreground font-medium">Bảo trợ Xã hội</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-status-danger to-primary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Heart className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Bảo trợ Xã hội</h1>
              </div>
              <p className="text-white/90">Quản lý đối tượng và chi trả trợ cấp xã hội</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-cyan-600 hover:bg-white/90" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm đối tượng
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
            <div className="p-3 bg-pink-100 rounded-xl">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.tongDoiTuong}</p>
          <p className="text-sm text-muted-foreground">Tổng đối tượng</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.dangHuong}</p>
          <p className="text-sm text-muted-foreground">Đang hưởng trợ cấp</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <Coins className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.tongTienThang)}</p>
          <p className="text-sm text-muted-foreground">Chi trả tháng này</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.daChiTra}</p>
          <p className="text-sm text-muted-foreground">Đã chi trả</p>
        </Card>
      </div>

      {/* Tổng hợp theo tháng */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Tổng hợp chi trả theo tháng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTongHopBaoTro.map((item, index) => (
            <Card key={index} className="p-4 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-primary">{item.ThangNam}</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(item.TongTienChiTra)}</p>
                </div>
                <Badge className="bg-green-500/10 text-green-700 border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />{item.TrangThai}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Người cao tuổi</p>
                  <p className="font-medium">{item.NguoiCaoTuoi}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Khuyết tật</p>
                  <p className="font-medium">{item.NguoiKhuyetTat}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trẻ mồ côi</p>
                  <p className="font-medium">{item.TreMoCoi}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="doi-tuong" className="space-y-4">
        <TabsList>
          <TabsTrigger value="doi-tuong">Đối tượng bảo trợ</TabsTrigger>
          <TabsTrigger value="chi-tra">Chi trả trợ cấp</TabsTrigger>
        </TabsList>

        <TabsContent value="doi-tuong" className="space-y-4">
          {/* Search */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm đối tượng..."
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
              <h3 className="text-lg font-semibold">Danh sách đối tượng bảo trợ</h3>
              <Badge className="bg-primary/10 text-primary border-0">
                Tổng: {filteredDoiTuong.length}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Họ tên</th>
                    <th className="text-left p-4 font-semibold">Loại đối tượng</th>
                    <th className="text-right p-4 font-semibold">Mức trợ cấp</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                    <th className="text-right p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoiTuong.map((dt) => (
                    <tr key={dt.MaDoiTuong} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">BT-{String(dt.MaDoiTuong).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{dt.HoTen}</p>
                        <p className="text-xs text-muted-foreground">{dt.DiaChi}</p>
                      </td>
                      <td className="p-4">{getLoaiBadge(dt.LoaiDoiTuong)}</td>
                      <td className="p-4 text-right font-semibold">{dt.MucTroCap.toLocaleString('vi-VN')}đ</td>
                      <td className="p-4">
                        <Badge className="bg-green-500/10 text-green-700 border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />{dt.TinhTrang}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(dt)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(dt)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(dt)}>
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

        <TabsContent value="chi-tra" className="space-y-4">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Chi trả trợ cấp tháng này</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Đối tượng</th>
                    <th className="text-left p-4 font-semibold">Loại</th>
                    <th className="text-right p-4 font-semibold">Số tiền</th>
                    <th className="text-left p-4 font-semibold">Ngày chi trả</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTroCapXaHoi.map((tc) => (
                    <tr key={tc.TroCapID} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">TC-{String(tc.TroCapID).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4 font-medium">{tc.TenDoiTuong}</td>
                      <td className="p-4">{getLoaiBadge(tc.LoaiDoiTuong)}</td>
                      <td className="p-4 text-right font-semibold">{tc.SoTien.toLocaleString('vi-VN')}đ</td>
                      <td className="p-4 text-sm">{tc.NgayChiTra}</td>
                      <td className="p-4">
                        <Badge className="bg-green-500/10 text-green-700 border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />{tc.TrangThai}
                        </Badge>
                      </td>
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
            <DialogTitle>Chi tiết đối tượng bảo trợ</DialogTitle>
            <DialogDescription>
              BT-{String(selectedItem?.MaDoiTuong).padStart(3, '0')}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
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
                  <p className="text-sm text-muted-foreground">Mức trợ cấp</p>
                  <p className="font-semibold text-primary text-lg">{selectedItem.MucTroCap.toLocaleString('vi-VN')}đ/tháng</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thời hạn</p>
                  <p className="font-medium">{selectedItem.ThoiHanTroCap}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu hưởng</p>
                  <p className="font-medium">{selectedItem.NgayBatDau || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tình trạng</p>
                  <p className="font-medium">{selectedItem.TinhTrang || 'Đang hưởng'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Người giám hộ</p>
                  <p className="font-medium">{selectedItem.NguoiGiamHo || 'Không có'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đối tượng bảo trợ</DialogTitle>
            <DialogDescription>BT-{String(selectedItem?.MaDoiTuong).padStart(3, '0')}</DialogDescription>
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
                <Label htmlFor="edit_cccd">Số CCCD/CMND <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_cccd"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ngay_sinh">Ngày sinh</Label>
                <Input
                  id="edit_ngay_sinh"
                  type="date"
                  value={formData.NgaySinh || ''}
                  onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_gioi_tinh">Giới tính</Label>
                <Select value={formData.GioiTinh || 'Nam'} onValueChange={(v) => setFormData({ ...formData, GioiTinh: v })}>
                  <SelectTrigger id="edit_gioi_tinh">
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
              <Label htmlFor="edit_dia_chi">Địa chỉ <span className="text-red-500">*</span></Label>
              <Input
                id="edit_dia_chi"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_loai">Loại đối tượng <span className="text-red-500">*</span></Label>
                <Select value={formData.LoaiDoiTuong || ''} onValueChange={(v) => setFormData({ ...formData, LoaiDoiTuong: v })}>
                  <SelectTrigger id="edit_loai">
                    <SelectValue placeholder="Chọn loại đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Người cao tuổi cô đơn">Người cao tuổi cô đơn</SelectItem>
                    <SelectItem value="Người khuyết tật nặng">Người khuyết tật nặng</SelectItem>
                    <SelectItem value="Người khuyết tật đặc biệt nặng">Người khuyết tật đặc biệt nặng</SelectItem>
                    <SelectItem value="Trẻ mồ côi">Trẻ mồ côi</SelectItem>
                    <SelectItem value="Người nhiễm HIV/AIDS">Người nhiễm HIV/AIDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_muc_tro_cap">Mức trợ cấp (VNĐ/tháng) <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_muc_tro_cap"
                  type="number"
                  value={formData.MucTroCap || ''}
                  onChange={(e) => setFormData({ ...formData, MucTroCap: parseInt(e.target.value) })}
                  placeholder="VD: 540000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ngay_bat_dau">Ngày bắt đầu hưởng</Label>
                <Input
                  id="edit_ngay_bat_dau"
                  type="date"
                  value={formData.NgayBatDau || ''}
                  onChange={(e) => setFormData({ ...formData, NgayBatDau: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_tinh_trang">Tình trạng</Label>
                <Select value={formData.TinhTrang || 'Đang hưởng'} onValueChange={(v) => setFormData({ ...formData, TinhTrang: v })}>
                  <SelectTrigger id="edit_tinh_trang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang hưởng">Đang hưởng</SelectItem>
                    <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
                    <SelectItem value="Đã ngừng">Đã ngừng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_nguoi_giam_ho">Người giám hộ</Label>
              <Input
                id="edit_nguoi_giam_ho"
                value={formData.NguoiGiamHo || ''}
                onChange={(e) => setFormData({ ...formData, NguoiGiamHo: e.target.value })}
                placeholder="Nhập tên người giám hộ (nếu có)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ghi_chu">Ghi chú</Label>
              <Textarea
                id="edit_ghi_chu"
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                placeholder="Nhập ghi chú"
                rows={3}
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
            <DialogTitle>Thêm đối tượng bảo trợ mới</DialogTitle>
            <DialogDescription>Nhập thông tin đối tượng bảo trợ xã hội</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ho_ten">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="add_ho_ten"
                  value={formData.HoTen || ''}
                  onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_cccd">Số CCCD/CMND <span className="text-red-500">*</span></Label>
                <Input
                  id="add_cccd"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ngay_sinh">Ngày sinh</Label>
                <Input
                  id="add_ngay_sinh"
                  type="date"
                  value={formData.NgaySinh || ''}
                  onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_gioi_tinh">Giới tính</Label>
                <Select value={formData.GioiTinh || 'Nam'} onValueChange={(v) => setFormData({ ...formData, GioiTinh: v })}>
                  <SelectTrigger id="add_gioi_tinh">
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
              <Label htmlFor="add_dia_chi">Địa chỉ <span className="text-red-500">*</span></Label>
              <Input
                id="add_dia_chi"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_loai">Loại đối tượng <span className="text-red-500">*</span></Label>
                <Select value={formData.LoaiDoiTuong || ''} onValueChange={(v) => setFormData({ ...formData, LoaiDoiTuong: v })}>
                  <SelectTrigger id="add_loai">
                    <SelectValue placeholder="Chọn loại đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Người cao tuổi cô đơn">Người cao tuổi cô đơn</SelectItem>
                    <SelectItem value="Người khuyết tật nặng">Người khuyết tật nặng</SelectItem>
                    <SelectItem value="Người khuyết tật đặc biệt nặng">Người khuyết tật đặc biệt nặng</SelectItem>
                    <SelectItem value="Trẻ mồ côi">Trẻ mồ côi</SelectItem>
                    <SelectItem value="Người nhiễm HIV/AIDS">Người nhiễm HIV/AIDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_muc_tro_cap">Mức trợ cấp (VNĐ/tháng) <span className="text-red-500">*</span></Label>
                <Input
                  id="add_muc_tro_cap"
                  type="number"
                  value={formData.MucTroCap || ''}
                  onChange={(e) => setFormData({ ...formData, MucTroCap: parseInt(e.target.value) })}
                  placeholder="VD: 540000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ngay_bat_dau">Ngày bắt đầu hưởng</Label>
                <Input
                  id="add_ngay_bat_dau"
                  type="date"
                  value={formData.NgayBatDau || ''}
                  onChange={(e) => setFormData({ ...formData, NgayBatDau: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_tinh_trang">Tình trạng</Label>
                <Select value={formData.TinhTrang || 'Đang hưởng'} onValueChange={(v) => setFormData({ ...formData, TinhTrang: v })}>
                  <SelectTrigger id="add_tinh_trang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang hưởng">Đang hưởng</SelectItem>
                    <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
                    <SelectItem value="Đã ngừng">Đã ngừng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_nguoi_giam_ho">Người giám hộ</Label>
              <Input
                id="add_nguoi_giam_ho"
                value={formData.NguoiGiamHo || ''}
                onChange={(e) => setFormData({ ...formData, NguoiGiamHo: e.target.value })}
                placeholder="Nhập tên người giám hộ (nếu có)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ghi_chu">Ghi chú</Label>
              <Textarea
                id="add_ghi_chu"
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                placeholder="Nhập ghi chú"
                rows={3}
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
