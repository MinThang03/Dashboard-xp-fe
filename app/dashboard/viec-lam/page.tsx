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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, X } from 'lucide-react';
import {
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
  Search,
  Plus,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  Clock,
  DollarSign,
  GraduationCap,
  User,
} from 'lucide-react';
import { mockNguoiThatNghiep, mockHoTroThatNghiep } from '@/lib/mock-data';

export default function ViecLamPage() {
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
    tongNguoiTimViec: mockNguoiThatNghiep.length,
    dangTimViec: mockNguoiThatNghiep.filter(n => n.TrangThai === 'Đang tìm việc').length,
    daCoViec: mockNguoiThatNghiep.filter(n => n.TrangThai === 'Đã tìm được việc').length,
    dangHuongBHTN: mockNguoiThatNghiep.filter(n => n.DangKyBHTN).length,
  };

  // Lọc dữ liệu
  const filteredData = mockNguoiThatNghiep.filter(n =>
    n.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.NgheNghiep.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã NTV', 'Họ tên', 'CCCD', 'Trình độ', 'Nghề nghiệp', 'Trạng thái'],
      ...filteredData.map(item => [
        item.MaNTV,
        item.HoTen,
        item.CCCD,
        item.TrinhDo,
        item.NgheNghiep,
        item.TrangThai
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `viec-lam-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAdd = () => {
    setFormData({
      HoTen: '',
      NgaySinh: '',
      GioiTinh: 'Nam',
      CCCD: '',
      DiaChi: '',
      NgheNghiep: '',
      TrinhDo: 'Trung học phổ thông',
      KinhNghiem: '',
      NgheNghiepMongMuon: '',
      MucLuongMongMuon: '',
      LyDoThatNghiep: '',
      DangKyBHTN: false,
      SoThangHuongBHTN: 0,
      MucHuongBHTN: 0,
      TrangThai: 'Đang tìm việc',
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

  const handleOpenAdd = () => {
    setIsAddOpen(true);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã tìm được việc':
        return <Badge className="bg-status-success/10 text-status-success border-0"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'Đang tìm việc':
        return <Badge className="bg-amber-500/10 text-amber-700 border-0"><Search className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTrinhDoBadge = (trinhDo: string) => {
    const colors: Record<string, string> = {
      'Đại học': 'bg-primary/10 text-primary',
      'Cao đẳng': 'bg-secondary/10 text-secondary',
      'Trung cấp': 'bg-cyan-500/10 text-cyan-700',
      'Trung học phổ thông': 'bg-gray-500/10 text-gray-700',
    };
    return <Badge className={`${colors[trinhDo] || 'bg-gray-500/10 text-gray-700'} border-0`}>{trinhDo}</Badge>;
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
          <span className="text-foreground font-medium">Việc làm - Thất nghiệp</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Việc làm - Thất nghiệp</h1>
              </div>
              <p className="text-white/90">Giới thiệu việc làm và hỗ trợ bảo hiểm thất nghiệp</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-sky-600 hover:bg-white/90" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Đăng ký mới
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
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.tongNguoiTimViec}</p>
          <p className="text-sm text-muted-foreground">Tổng đăng ký</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Search className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.dangTimViec}</p>
          <p className="text-sm text-muted-foreground">Đang tìm việc</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.daCoViec}</p>
          <p className="text-sm text-muted-foreground">Đã có việc</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-purple-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.dangHuongBHTN}</p>
          <p className="text-sm text-muted-foreground">Hưởng BHTN</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nguoi-tim-viec" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nguoi-tim-viec">Người tìm việc</TabsTrigger>
          <TabsTrigger value="ho-tro-bhtn">Hỗ trợ BHTN</TabsTrigger>
        </TabsList>

        <TabsContent value="nguoi-tim-viec" className="space-y-4">
          {/* Search */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, nghề nghiệp..."
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
              <h3 className="text-lg font-semibold">Danh sách người tìm việc</h3>
              <Badge className="bg-primary/10 text-primary border-0">
                Tổng: {filteredData.length}
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Họ tên</th>
                    <th className="text-left p-4 font-semibold">Nghề nghiệp</th>
                    <th className="text-left p-4 font-semibold">Trình độ</th>
                    <th className="text-left p-4 font-semibold">Kinh nghiệm</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                    <th className="text-right p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((n) => (
                    <tr key={n.MaNTV} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">NTV-{String(n.MaNTV).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{n.HoTen}</p>
                        <p className="text-xs text-muted-foreground">{n.GioiTinh} - {n.NgaySinh}</p>
                      </td>
                      <td className="p-4">{n.NgheNghiep}</td>
                      <td className="p-4">{getTrinhDoBadge(n.TrinhDo)}</td>
                      <td className="p-4 text-sm">{n.KinhNghiem}</td>
                      <td className="p-4">{getStatusBadge(n.TrangThai)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(n)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(n)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(n)}>
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

        <TabsContent value="ho-tro-bhtn" className="space-y-4">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Chi trả bảo hiểm thất nghiệp</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Họ tên</th>
                    <th className="text-left p-4 font-semibold">Tháng hưởng</th>
                    <th className="text-right p-4 font-semibold">Số tiền</th>
                    <th className="text-left p-4 font-semibold">Ngày chi trả</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHoTroThatNghiep.map((ht) => (
                    <tr key={ht.ThatNghiepID} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">TN-{String(ht.ThatNghiepID).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4 font-medium">{ht.HoTen}</td>
                      <td className="p-4">{ht.ThangHuong}</td>
                      <td className="p-4 text-right font-semibold">{formatCurrency(ht.SoTien)}</td>
                      <td className="p-4 text-sm">{ht.NgayChiTra}</td>
                      <td className="p-4">
                        <Badge className="bg-status-success/10 text-status-success border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />{ht.TrangThai}
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
            <DialogTitle>Chi tiết người tìm việc</DialogTitle>
            <DialogDescription>
              NTV-{String(selectedItem?.MaNTV).padStart(3, '0')}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedItem.HoTen}</h3>
                  {getStatusBadge(selectedItem.TrangThai)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Ngày sinh</p>
                  <p className="font-medium">{selectedItem.NgaySinh}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giới tính</p>
                  <p className="font-medium">{selectedItem.GioiTinh}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CCCD</p>
                  <p className="font-medium">{selectedItem.CCCD}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{selectedItem.DiaChi}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nghề nghiệp</p>
                  <p className="font-medium">{selectedItem.NgheNghiep}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trình độ</p>
                  {getTrinhDoBadge(selectedItem.TrinhDo)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
                  <p className="font-medium">{selectedItem.KinhNghiem}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lý do thất nghiệp</p>
                  <p className="font-medium">{selectedItem.LyDoThatNghiep}</p>
                </div>
              </div>

              {selectedItem.DangKyBHTN && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Thông tin BHTN</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Số tháng hưởng</p>
                      <p className="font-medium">{selectedItem.SoThangHuongBHTN} tháng</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mức hưởng</p>
                      <p className="font-semibold text-primary">{formatCurrency(selectedItem.MucHuongBHTN)}/tháng</p>
                    </div>
                  </div>
                </div>
              )}

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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cập nhật hồ sơ người tìm việc</DialogTitle>
            <DialogDescription>NTV-{String(selectedItem?.MaNTV).padStart(3, '0')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ho_ten_ntv">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_ho_ten_ntv"
                  value={formData.HoTen || ''}
                  onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_cccd_ntv">Số CCCD <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_cccd_ntv"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_ngay_sinh_ntv">Ngày sinh</Label>
                <Input
                  id="edit_ngay_sinh_ntv"
                  type="date"
                  value={formData.NgaySinh || ''}
                  onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_gioi_tinh_ntv">Giới tính</Label>
                <Select value={formData.GioiTinh || 'Nam'} onValueChange={(v) => setFormData({ ...formData, GioiTinh: v })}>
                  <SelectTrigger id="edit_gioi_tinh_ntv">
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
              <Label htmlFor="edit_dia_chi_ntv">Địa chỉ</Label>
              <Input
                id="edit_dia_chi_ntv"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_nghe_nghiep_ntv">Nghề nghiệp hiện tại</Label>
                <Input
                  id="edit_nghe_nghiep_ntv"
                  value={formData.NgheNghiep || ''}
                  onChange={(e) => setFormData({ ...formData, NgheNghiep: e.target.value })}
                  placeholder="VD: Thợ may"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_trinh_do_ntv">Trình độ học vấn</Label>
                <Select value={formData.TrinhDo || ''} onValueChange={(v) => setFormData({ ...formData, TrinhDo: v })}>
                  <SelectTrigger id="edit_trinh_do_ntv">
                    <SelectValue placeholder="Chọn trình độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đại học">Đại học</SelectItem>
                    <SelectItem value="Cao đẳng">Cao đẳng</SelectItem>
                    <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                    <SelectItem value="Trung học phổ thông">Trung học phổ thông</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_kinh_nghiem_ntv">Kinh nghiệm làm việc</Label>
              <Input
                id="edit_kinh_nghiem_ntv"
                value={formData.KinhNghiem || ''}
                onChange={(e) => setFormData({ ...formData, KinhNghiem: e.target.value })}
                placeholder="VD: 5 năm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_mon_muon_ntv">Nghề nghiệp mong muốn</Label>
                <Input
                  id="edit_mon_muon_ntv"
                  value={formData.NgheNghiepMongMuon || ''}
                  onChange={(e) => setFormData({ ...formData, NgheNghiepMongMuon: e.target.value })}
                  placeholder="VD: Nhân viên kế toán"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_luong_mong_muon_ntv">Mức lương mong muốn</Label>
                <Input
                  id="edit_luong_mong_muon_ntv"
                  value={formData.MucLuongMongMuon || ''}
                  onChange={(e) => setFormData({ ...formData, MucLuongMongMuon: e.target.value })}
                  placeholder="VD: 8-10 triệu"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ly_do_ntv">Lý do thất nghiệp</Label>
              <Textarea
                id="edit_ly_do_ntv"
                value={formData.LyDoThatNghiep || ''}
                onChange={(e) => setFormData({ ...formData, LyDoThatNghiep: e.target.value })}
                placeholder="Nhập lý do thất nghiệp"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_trang_thai_ntv">Trạng thái <span className="text-red-500">*</span></Label>
              <Select value={formData.TrangThai || 'Đang tìm việc'} onValueChange={(v) => setFormData({ ...formData, TrangThai: v })}>
                <SelectTrigger id="edit_trang_thai_ntv">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đang tìm việc">Đang tìm việc</SelectItem>
                  <SelectItem value="Đã tìm được việc">Đã tìm được việc</SelectItem>
                  <SelectItem value="Ngừng tìm việc">Ngừng tìm việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ghi_chu_ntv">Ghi chú</Label>
              <Textarea
                id="edit_ghi_chu_ntv"
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Đăng ký người tìm việc mới</DialogTitle>
            <DialogDescription>Nhập thông tin người tìm việc làm</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ho_ten_ntv">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="add_ho_ten_ntv"
                  value={formData.HoTen || ''}
                  onChange={(e) => setFormData({ ...formData, HoTen: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_cccd_ntv">Số CCCD <span className="text-red-500">*</span></Label>
                <Input
                  id="add_cccd_ntv"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_ngay_sinh_ntv">Ngày sinh</Label>
                <Input
                  id="add_ngay_sinh_ntv"
                  type="date"
                  value={formData.NgaySinh || ''}
                  onChange={(e) => setFormData({ ...formData, NgaySinh: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_gioi_tinh_ntv">Giới tính</Label>
                <Select value={formData.GioiTinh || 'Nam'} onValueChange={(v) => setFormData({ ...formData, GioiTinh: v })}>
                  <SelectTrigger id="add_gioi_tinh_ntv">
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
              <Label htmlFor="add_dia_chi_ntv">Địa chỉ</Label>
              <Input
                id="add_dia_chi_ntv"
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_nghe_nghiep_ntv">Nghề nghiệp hiện tại</Label>
                <Input
                  id="add_nghe_nghiep_ntv"
                  value={formData.NgheNghiep || ''}
                  onChange={(e) => setFormData({ ...formData, NgheNghiep: e.target.value })}
                  placeholder="VD: Thợ may"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_trinh_do_ntv">Trình độ học vấn</Label>
                <Select value={formData.TrinhDo || ''} onValueChange={(v) => setFormData({ ...formData, TrinhDo: v })}>
                  <SelectTrigger id="add_trinh_do_ntv">
                    <SelectValue placeholder="Chọn trình độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đại học">Đại học</SelectItem>
                    <SelectItem value="Cao đẳng">Cao đẳng</SelectItem>
                    <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                    <SelectItem value="Trung học phổ thông">Trung học phổ thông</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_kinh_nghiem_ntv">Kinh nghiệm làm việc</Label>
              <Input
                id="add_kinh_nghiem_ntv"
                value={formData.KinhNghiem || ''}
                onChange={(e) => setFormData({ ...formData, KinhNghiem: e.target.value })}
                placeholder="VD: 5 năm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_mon_muon_ntv">Nghề nghiệp mong muốn</Label>
                <Input
                  id="add_mon_muon_ntv"
                  value={formData.NgheNghiepMongMuon || ''}
                  onChange={(e) => setFormData({ ...formData, NgheNghiepMongMuon: e.target.value })}
                  placeholder="VD: Nhân viên kế toán"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_luong_mong_muon_ntv">Mức lương mong muốn</Label>
                <Input
                  id="add_luong_mong_muon_ntv"
                  value={formData.MucLuongMongMuon || ''}
                  onChange={(e) => setFormData({ ...formData, MucLuongMongMuon: e.target.value })}
                  placeholder="VD: 8-10 triệu"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ly_do_ntv">Lý do thất nghiệp</Label>
              <Textarea
                id="add_ly_do_ntv"
                value={formData.LyDoThatNghiep || ''}
                onChange={(e) => setFormData({ ...formData, LyDoThatNghiep: e.target.value })}
                placeholder="Nhập lý do thất nghiệp"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ghi_chu_ntv">Ghi chú</Label>
              <Textarea
                id="add_ghi_chu_ntv"
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
              Đăng ký
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
