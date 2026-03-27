'use client';

import { useEffect, useState } from 'react';
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
  Heart,
  Users,
  Award,
  TrendingDown,
  Search,
  Plus,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { mockHoNgheo, mockRaSoatHoNgheo, mockChinhSachHoNgheo } from '@/lib/mock-data';
import { hoNgheoApi } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, X } from 'lucide-react';

export default function HoNgheoPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoNgheoList, setHoNgheoList] = useState<any[]>(mockHoNgheo);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      const response = await hoNgheoApi.getList({ page: 1, limit: 500 });
      if (response.success && Array.isArray((response.data as any)?.data)) {
        setHoNgheoList((response.data as any).data);
      }
    };
    loadData();
  }, []);

  // Tính toán thống kê từ dữ liệu thực
  const stats = {
    hoNgheo: hoNgheoList.filter(h => h.MucDoNgheo === 'Hộ nghèo').length,
    hoCanNgheo: hoNgheoList.filter(h => h.MucDoNgheo === 'Cận nghèo').length,
    daThoatNgheo: hoNgheoList.filter(h => h.MucDoNgheo === 'Đã thoát nghèo').length,
    dangHuong: mockChinhSachHoNgheo.filter(cs => cs.TrangThai === 'Đang hưởng').length,
  };

  // Lọc dữ liệu
  const filteredHoNgheo = hoNgheoList.filter(h =>
    (h.ChuHo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (h.DiaChi || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã hộ', 'Họ tên chủ hộ', 'Địa chỉ', 'Số nhân khẩu', 'Thu nhập', 'Mức độ', 'Trạng thái'],
      ...filteredHoNgheo.map(item => [
        item.MaHo,
        item.ChuHo,
        item.DiaChi,
        item.SoThanhVien,
        item.ThuNhapBinhQuan,
        item.MucDoNgheo,
        item.DangHuongChinhSach ? 'Đang hưởng chính sách' : 'Không hưởng'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ho-ngheo-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAdd = () => {
    setFormData({
      SoHoKhau: '',
      ChuHo: '',
      CCCD: '',
      DiaChi: '',
      SoThanhVien: 1,
      ThuNhapBinhQuan: 0,
      MucDoNgheo: 'Hộ nghèo',
      NamDanhGia: new Date().getFullYear(),
      LyDoNgheo: '',
      DangHuongChinhSach: true,
      ChinhSachHuong: '',
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
    if (isEditOpen && selectedItem) {
      const id = selectedItem.MaHoNgheo ?? selectedItem.MaHo;
      await hoNgheoApi.update(id, formData);
    } else {
      await hoNgheoApi.create(formData);
    }
    const response = await hoNgheoApi.getList({ page: 1, limit: 500 });
    if (response.success && Array.isArray((response.data as any)?.data)) {
      setHoNgheoList((response.data as any).data);
    }
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = async (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ hộ ${item.ChuHo}?`)) {
      const id = item.MaHoNgheo ?? item.MaHo;
      await hoNgheoApi.delete(id);
      const response = await hoNgheoApi.getList({ page: 1, limit: 500 });
      if (response.success && Array.isArray((response.data as any)?.data)) {
        setHoNgheoList((response.data as any).data);
      }
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đang hưởng chính sách':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Đang hưởng</Badge>;
      case 'Đã thoát nghèo':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><Award className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPhanLoaiBadge = (phanLoai: string) => {
    switch (phanLoai) {
      case 'Hộ nghèo':
        return <Badge className="bg-red-500/10 text-red-700 border-0">{phanLoai}</Badge>;
      case 'Hộ cận nghèo':
        return <Badge className="bg-amber-500/10 text-amber-700 border-0">{phanLoai}</Badge>;
      default:
        return <Badge variant="outline">{phanLoai}</Badge>;
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
          <span className="text-foreground font-medium">Hộ nghèo - Cận nghèo</span>
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
                <h1 className="text-3xl font-bold">Quản lý Hộ nghèo - Cận nghèo</h1>
              </div>
              <p className="text-white/90">Rà soát, quản lý hộ nghèo, hộ cận nghèo và chính sách hỗ trợ</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-rose-600 hover:bg-white/90" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm hộ
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
            <div className="p-3 bg-red-100 rounded-xl">
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.hoNgheo}</p>
          <p className="text-sm text-muted-foreground">Hộ nghèo</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.hoCanNgheo}</p>
          <p className="text-sm text-muted-foreground">Hộ cận nghèo</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.daThoatNgheo}</p>
          <p className="text-sm text-muted-foreground">Đã thoát nghèo</p>
        </Card>
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.dangHuong}</p>
          <p className="text-sm text-muted-foreground">Đang hưởng chính sách</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="danh-sach" className="space-y-4">
        <TabsList>
          <TabsTrigger value="danh-sach">Danh sách hộ</TabsTrigger>
          <TabsTrigger value="ra-soat">Kết quả rà soát</TabsTrigger>
          <TabsTrigger value="chinh-sach">Chính sách hỗ trợ</TabsTrigger>
        </TabsList>

        <TabsContent value="danh-sach" className="space-y-4">
          {/* Search */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm hộ..."
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
              <h3 className="text-lg font-semibold">Danh sách hộ nghèo - cận nghèo</h3>
              <Badge className="bg-primary/10 text-primary border-0">
                Tổng: {filteredHoNgheo.length} hộ
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã hộ</th>
                    <th className="text-left p-4 font-semibold">Chủ hộ</th>
                    <th className="text-left p-4 font-semibold">Địa chỉ</th>
                    <th className="text-right p-4 font-semibold">Số nhân khẩu</th>
                    <th className="text-left p-4 font-semibold">Phân loại</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                    <th className="text-right p-4 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoNgheo.map((ho, index) => (
                    <tr key={ho.MaHoNgheo ?? ho.MaHo ?? index} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">HN-{String(ho.MaHoNgheo ?? ho.MaHo ?? '').padStart(3, '0')}</span>
                      </td>
                      <td className="p-4 font-medium">{ho.ChuHo}</td>
                      <td className="p-4 text-sm text-muted-foreground">{ho.DiaChi}</td>
                      <td className="p-4 text-right">{ho.SoThanhVien}</td>
                      <td className="p-4">{getPhanLoaiBadge(ho.MucDoNgheo)}</td>
                      <td className="p-4">{getStatusBadge(ho.DangHuongChinhSach ? 'Đang hưởng chính sách' : 'Không hưởng')}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(ho)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(ho)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDelete(ho)}>
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

        <TabsContent value="ra-soat" className="space-y-4">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Kết quả rà soát gần đây</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Chủ hộ</th>
                    <th className="text-left p-4 font-semibold">Ngày rà soát</th>
                    <th className="text-left p-4 font-semibold">Kết quả</th>
                    <th className="text-right p-4 font-semibold">Điểm</th>
                    <th className="text-left p-4 font-semibold">Tiêu chí thiếu hụt</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRaSoatHoNgheo.map((rs) => (
                    <tr key={rs.RaSoatID} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">RS-{String(rs.RaSoatID).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4 font-medium">{rs.ChuHo}</td>
                      <td className="p-4 text-sm">{rs.NgayRaSoat}</td>
                      <td className="p-4">{getPhanLoaiBadge(rs.KetQuaDanhGia)}</td>
                      <td className="p-4 text-right font-semibold">{rs.DiemTong}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {rs.TieuChiThieuHut.map((tc, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tc}</Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="chinh-sach" className="space-y-4">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Chính sách đang hưởng</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Mã</th>
                    <th className="text-left p-4 font-semibold">Chủ hộ</th>
                    <th className="text-left p-4 font-semibold">Tên chính sách</th>
                    <th className="text-right p-4 font-semibold">Mức hỗ trợ</th>
                    <th className="text-left p-4 font-semibold">Thời gian</th>
                    <th className="text-left p-4 font-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockChinhSachHoNgheo.map((cs) => (
                    <tr key={cs.HuongID} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-primary">CS-{String(cs.HuongID).padStart(3, '0')}</span>
                      </td>
                      <td className="p-4 font-medium">{cs.ChuHo}</td>
                      <td className="p-4">{cs.TenChinhSach}</td>
                      <td className="p-4 text-right font-semibold">
                        {cs.SoTien > 0 ? cs.SoTien.toLocaleString('vi-VN') + 'đ' : 'Miễn phí'}
                      </td>
                      <td className="p-4 text-sm">{cs.ThoiGianHuong}</td>
                      <td className="p-4">
                        {cs.TrangThai === 'Đang hưởng' ? (
                          <Badge className="bg-green-500/10 text-green-700 border-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" />{cs.TrangThai}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-700 border-0">
                            <Clock className="w-3 h-3 mr-1" />{cs.TrangThai}
                          </Badge>
                        )}
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
            <DialogTitle>Chi tiết hộ gia đình</DialogTitle>
            <DialogDescription>
              HN-{String(selectedItem?.MaHo).padStart(3, '0')}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Chủ hộ</p>
                  <p className="font-medium">{selectedItem.ChuHo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số thành viên</p>
                  <p className="font-medium">{selectedItem.SoThanhVien || selectedItem.SoNhanKhau || 0} người</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số hộ khẩu</p>
                  <p className="font-medium">{selectedItem.SoHoKhau || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CCCD</p>
                  <p className="font-medium">{selectedItem.CCCD || 'Chưa cập nhật'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                  <p className="font-medium">{selectedItem.DiaChi}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phân loại</p>
                  {getPhanLoaiBadge(selectedItem.MucDoNgheo)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  {getStatusBadge(selectedItem.TrangThai)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Thu nhập bình quân</p>
                  <p className="font-medium">{selectedItem.ThuNhapBinhQuan?.toLocaleString('vi-VN')}đ/người/tháng</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Năm xác nhận</p>
                  <p className="font-medium">{selectedItem.NamDanhGia || selectedItem.NamXacNhan || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Đang hưởng chính sách</p>
                  <p className="font-medium">{selectedItem.DangHuongChinhSach ? 'Có' : 'Không'}</p>
                </div>
              </div>
              {selectedItem.LyDoNgheo && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Lý do nghèo</p>
                  <p className="text-sm">{selectedItem.LyDoNgheo}</p>
                </div>
              )}
              {selectedItem.ChinhSachHuong && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Chính sách đang hưởng</p>
                  <p className="text-sm">{selectedItem.ChinhSachHuong}</p>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hồ sơ hộ nghèo</DialogTitle>
            <DialogDescription>HN-{String(selectedItem?.MaHo).padStart(3, '0')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_so_ho_khau">Số hộ khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_so_ho_khau"
                  value={formData.SoHoKhau || ''}
                  onChange={(e) => setFormData({ ...formData, SoHoKhau: e.target.value })}
                  placeholder="VD: HK-001234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_chu_ho">Tên chủ hộ <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_chu_ho"
                  value={formData.ChuHo || ''}
                  onChange={(e) => setFormData({ ...formData, ChuHo: e.target.value })}
                  placeholder="Nhập tên chủ hộ"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_cccd">Số CCCD <span className="text-red-500">*</span></Label>
                <Input
                  id="edit_cccd"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_so_thanh_vien">Số thành viên</Label>
                <Input
                  id="edit_so_thanh_vien"
                  type="number"
                  value={formData.SoThanhVien || ''}
                  onChange={(e) => setFormData({ ...formData, SoThanhVien: parseInt(e.target.value) })}
                  placeholder="Số người trong hộ"
                />
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
                <Label htmlFor="edit_muc_do_ngheo">Mức độ <span className="text-red-500">*</span></Label>
                <Select value={formData.MucDoNgheo || ''} onValueChange={(v) => setFormData({ ...formData, MucDoNgheo: v })}>
                  <SelectTrigger id="edit_muc_do_ngheo">
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hộ nghèo">Hộ nghèo</SelectItem>
                    <SelectItem value="Cận nghèo">Cận nghèo</SelectItem>
                    <SelectItem value="Đã thoát nghèo">Đã thoát nghèo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_thu_nhap">Thu nhập bình quân (VNĐ/người/tháng)</Label>
                <Input
                  id="edit_thu_nhap"
                  type="number"
                  value={formData.ThuNhapBinhQuan || ''}
                  onChange={(e) => setFormData({ ...formData, ThuNhapBinhQuan: parseInt(e.target.value) })}
                  placeholder="VD: 800000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_nam_danh_gia">Năm đánh giá</Label>
                <Input
                  id="edit_nam_danh_gia"
                  type="number"
                  value={formData.NamDanhGia || ''}
                  onChange={(e) => setFormData({ ...formData, NamDanhGia: parseInt(e.target.value) })}
                  placeholder="VD: 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_dang_huong">Đang hưởng chính sách</Label>
                <Select value={formData.DangHuongChinhSach ? 'true' : 'false'} onValueChange={(v) => setFormData({ ...formData, DangHuongChinhSach: v === 'true' })}>
                  <SelectTrigger id="edit_dang_huong">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Có</SelectItem>
                    <SelectItem value="false">Không</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ly_do_ngheo">Lý do nghèo</Label>
              <Textarea
                id="edit_ly_do_ngheo"
                value={formData.LyDoNgheo || ''}
                onChange={(e) => setFormData({ ...formData, LyDoNgheo: e.target.value })}
                placeholder="Mô tả lý do..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_chinh_sach_huong">Chính sách đang hưởng</Label>
              <Textarea
                id="edit_chinh_sach_huong"
                value={formData.ChinhSachHuong || ''}
                onChange={(e) => setFormData({ ...formData, ChinhSachHuong: e.target.value })}
                placeholder="VD: Hỗ trợ BHYT, học phí..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_ghi_chu">Ghi chú</Label>
              <Textarea
                id="edit_ghi_chu"
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
            <DialogTitle>Thêm hộ nghèo/cận nghèo mới</DialogTitle>
            <DialogDescription>Nhập thông tin hồ sơ hộ nghèo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_so_ho_khau">Số hộ khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="add_so_ho_khau"
                  value={formData.SoHoKhau || ''}
                  onChange={(e) => setFormData({ ...formData, SoHoKhau: e.target.value })}
                  placeholder="VD: HK-001234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_chu_ho">Tên chủ hộ <span className="text-red-500">*</span></Label>
                <Input
                  id="add_chu_ho"
                  value={formData.ChuHo || ''}
                  onChange={(e) => setFormData({ ...formData, ChuHo: e.target.value })}
                  placeholder="Nhập tên chủ hộ"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_cccd">Số CCCD <span className="text-red-500">*</span></Label>
                <Input
                  id="add_cccd"
                  value={formData.CCCD || ''}
                  onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_so_thanh_vien">Số thành viên</Label>
                <Input
                  id="add_so_thanh_vien"
                  type="number"
                  value={formData.SoThanhVien || ''}
                  onChange={(e) => setFormData({ ...formData, SoThanhVien: parseInt(e.target.value) })}
                  placeholder="Số người trong hộ"
                />
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
                <Label htmlFor="add_muc_do_ngheo">Mức độ <span className="text-red-500">*</span></Label>
                <Select value={formData.MucDoNgheo || ''} onValueChange={(v) => setFormData({ ...formData, MucDoNgheo: v })}>
                  <SelectTrigger id="add_muc_do_ngheo">
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hộ nghèo">Hộ nghèo</SelectItem>
                    <SelectItem value="Cận nghèo">Cận nghèo</SelectItem>
                    <SelectItem value="Đã thoát nghèo">Đã thoát nghèo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_thu_nhap">Thu nhập bình quân (VNĐ/người/tháng)</Label>
                <Input
                  id="add_thu_nhap"
                  type="number"
                  value={formData.ThuNhapBinhQuan || ''}
                  onChange={(e) => setFormData({ ...formData, ThuNhapBinhQuan: parseInt(e.target.value) })}
                  placeholder="VD: 800000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_nam_danh_gia">Năm đánh giá</Label>
                <Input
                  id="add_nam_danh_gia"
                  type="number"
                  value={formData.NamDanhGia || ''}
                  onChange={(e) => setFormData({ ...formData, NamDanhGia: parseInt(e.target.value) })}
                  placeholder="VD: 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add_dang_huong">Đang hưởng chính sách</Label>
                <Select value={formData.DangHuongChinhSach ? 'true' : 'false'} onValueChange={(v) => setFormData({ ...formData, DangHuongChinhSach: v === 'true' })}>
                  <SelectTrigger id="add_dang_huong">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Có</SelectItem>
                    <SelectItem value="false">Không</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ly_do_ngheo">Lý do nghèo</Label>
              <Textarea
                id="add_ly_do_ngheo"
                value={formData.LyDoNgheo || ''}
                onChange={(e) => setFormData({ ...formData, LyDoNgheo: e.target.value })}
                placeholder="Mô tả lý do..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_chinh_sach_huong">Chính sách đang hưởng</Label>
              <Textarea
                id="add_chinh_sach_huong"
                value={formData.ChinhSachHuong || ''}
                onChange={(e) => setFormData({ ...formData, ChinhSachHuong: e.target.value })}
                placeholder="VD: Hỗ trợ BHYT, học phí..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_ghi_chu">Ghi chú</Label>
              <Textarea
                id="add_ghi_chu"
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
