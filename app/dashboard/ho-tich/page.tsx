'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockHoTich, mockThanhVienHoTich, formatDate, formatDateTime } from '@/lib/mock-data';
import {
  FileText,
  Search,
  Plus,
  Download,
  User,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Users,
  Home,
} from 'lucide-react';


export default function HoTichPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const filteredData = mockHoTich.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      item.so_ho_tich.toLowerCase().includes(search) ||
      item.ten_chu_ho.toLowerCase().includes(search) ||
      item.dia_chi_ho_tich.toLowerCase().includes(search)
    );
  });

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    const thanhVien = getThanhVien(item.id);
    setFormData({
      ...item,
      thanh_vien: thanhVien.length
        ? thanhVien
        : [
            {
              ho_ten: '',
              so_cccd: '',
              ngay_sinh: '',
              gioi_tinh: 'Nam',
              quan_he_voi_chu_ho: '',
            },
          ],
      so_thanh_vien_ho_tich: thanhVien.length || item.so_thanh_vien_ho_tich || 1,
    });
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      so_ho_tich: '',
      ten_chu_ho: '',
      ngay_sinh_chu_ho: '',
      gioi_tinh_chu_ho: 'Nam',
      dia_chi_ho_tich: '',
      so_thanh_vien_ho_tich: 1,
      ngay_lap_ho_tich: new Date().toISOString().split('T')[0],
      ghi_chu: '',
      trang_thai: 1,
      thanh_vien: [
        {
          ho_ten: '',
          so_cccd: '',
          ngay_sinh: '',
          gioi_tinh: 'Nam',
          quan_he_voi_chu_ho: '',
        },
      ],
    });
    setIsAddOpen(true);
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      so_thanh_vien_ho_tich: formData.thanh_vien?.length || formData.so_thanh_vien_ho_tich || 0,
    };
    console.log('Saving:', payload);
    // TODO: API call to save
    setIsEditOpen(false);
    setIsAddOpen(false);
  };

  const handleDelete = (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hộ tịch ${item.so_ho_tich}?`)) {
      console.log('Deleting:', item);
      // TODO: API call to delete
    }
  };

  const getThanhVien = (idHoTich: number) => {
    return mockThanhVienHoTich.filter((tv) => tv.id_ho_tich === idHoTich);
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updated = [...(formData.thanh_vien || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      thanh_vien: updated,
      so_thanh_vien_ho_tich: updated.length,
    });
  };

  const addMemberRow = () => {
    const next = [
      ...(formData.thanh_vien || []),
      { ho_ten: '', so_cccd: '', ngay_sinh: '', gioi_tinh: 'Nam', quan_he_voi_chu_ho: '' },
    ];
    setFormData({
      ...formData,
      thanh_vien: next,
      so_thanh_vien_ho_tich: next.length,
    });
  };

  const removeMemberRow = (index: number) => {
    const current = formData.thanh_vien || [];
    const next = current.filter((_: any, i: number) => i !== index);
    setFormData({
      ...formData,
      thanh_vien: next.length ? next : [
        { ho_ten: '', so_cccd: '', ngay_sinh: '', gioi_tinh: 'Nam', quan_he_voi_chu_ho: '' },
      ],
      so_thanh_vien_ho_tich: next.length || 1,
    });
  };


  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Hộ tịch</h1>
              </div>
              <p className="text-white/90">Quản lý sổ hộ tịch và thành viên hộ gia đình</p>
            </div>
            <Button onClick={handleAdd} className="bg-white text-blue-600 hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hộ tịch mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-500/10 text-blue-700 border-0">Tổng</Badge>
          </div>
          <p className="text-3xl font-bold">{mockHoTich.length}</p>
          <p className="text-sm text-muted-foreground">Tổng số hộ</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-0">Thành viên</Badge>
          </div>
          <p className="text-3xl font-bold">{mockThanhVienHoTich.length}</p>
          <p className="text-sm text-muted-foreground">Tổng thành viên</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
            <Badge className="bg-purple-500/10 text-purple-700 border-0">Hoạt động</Badge>
          </div>
          <p className="text-3xl font-bold">{mockHoTich.filter(h => h.trang_thai === 1).length}</p>
          <p className="text-sm text-muted-foreground">Hộ đang hoạt động</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <Badge className="bg-amber-500/10 text-amber-700 border-0">Mới</Badge>
          </div>
          <p className="text-3xl font-bold">
            {mockHoTich.filter(h => 
              new Date(h.created_at).getMonth() === new Date().getMonth()
            ).length}
          </p>
          <p className="text-sm text-muted-foreground">Hộ tháng này</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo số hộ tịch, tên chủ hộ, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50"
            />
          </div>
          <Button variant="outline" className="h-11">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Số hộ tịch</th>
                <th className="text-left p-4 font-semibold">Tên chủ hộ</th>
                <th className="text-left p-4 font-semibold">Ngày sinh</th>
                <th className="text-left p-4 font-semibold">Giới tính</th>
                <th className="text-left p-4 font-semibold">Địa chỉ</th>
                <th className="text-left p-4 font-semibold">Số thành viên</th>
                <th className="text-left p-4 font-semibold">Ngày lập</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">{item.so_ho_tich}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{item.ten_chu_ho}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDate(item.ngay_sinh_chu_ho)}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{item.gioi_tinh_chu_ho}</Badge>
                  </td>
                  <td className="p-4 text-sm max-w-xs truncate">{item.dia_chi_ho_tich}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.so_thanh_vien_ho_tich}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatDate(item.ngay_lap_ho_tich)}
                  </td>
                  <td className="p-4">
                    <Badge className={item.trang_thai === 1 ? 'bg-green-500/10 text-green-700 border-0' : 'bg-red-500/10 text-red-700 border-0'}>
                      {item.trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </td>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết hộ tịch</DialogTitle>
            <DialogDescription>Thông tin chi tiết về hộ tịch</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              {/* Thông tin chủ hộ */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Thông tin chủ hộ
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Số hộ tịch</Label>
                    <p className="font-medium">{selectedItem.so_ho_tich}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tên chủ hộ</Label>
                    <p className="font-medium">{selectedItem.ten_chu_ho}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ngày sinh</Label>
                    <p className="font-medium">{formatDate(selectedItem.ngay_sinh_chu_ho)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Giới tính</Label>
                    <p className="font-medium">{selectedItem.gioi_tinh_chu_ho}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Địa chỉ hộ tịch</Label>
                    <p className="font-medium">{selectedItem.dia_chi_ho_tich}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số thành viên</Label>
                    <p className="font-medium">{selectedItem.so_thanh_vien_ho_tich}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ngày lập hộ tịch</Label>
                    <p className="font-medium">{formatDate(selectedItem.ngay_lap_ho_tich)}</p>
                  </div>
                  {selectedItem.ghi_chu && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Ghi chú</Label>
                      <p className="font-medium">{selectedItem.ghi_chu}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Trạng thái</Label>
                    <Badge className={selectedItem.trang_thai === 1 ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}>
                      {selectedItem.trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ngày tạo</Label>
                    <p className="font-medium text-sm">{formatDateTime(selectedItem.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Danh sách thành viên */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh sách thành viên ({getThanhVien(selectedItem.id).length})
                </h3>
                <div className="space-y-3">
                  {getThanhVien(selectedItem.id).map((tv) => (
                    <div key={tv.id} className="border rounded-lg p-4 hover:bg-slate-50">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Họ tên</Label>
                          <p className="font-medium">{tv.ho_ten}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Số CCCD</Label>
                          <p className="font-medium">{tv.so_cccd}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
                          <p>{formatDate(tv.ngay_sinh)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Giới tính</Label>
                          <p>{tv.gioi_tinh}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground">Quan hệ với chủ hộ</Label>
                          <Badge variant="outline">{tv.quan_he_voi_chu_ho}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Đóng
            </Button>
            <Button onClick={() => {
              setIsViewOpen(false);
              handleEdit(selectedItem);
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hộ tịch</DialogTitle>
            <DialogDescription>Cập nhật thông tin hộ tịch</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="so_ho_tich">Số hộ tịch <span className="text-red-500">*</span></Label>
                <Input
                  id="so_ho_tich"
                  value={formData.so_ho_tich || ''}
                  onChange={(e) => setFormData({ ...formData, so_ho_tich: e.target.value })}
                  placeholder="Nhập số hộ tịch"
                />
              </div>
              <div>
                <Label htmlFor="ten_chu_ho">Tên chủ hộ <span className="text-red-500">*</span></Label>
                <Input
                  id="ten_chu_ho"
                  value={formData.ten_chu_ho || ''}
                  onChange={(e) => setFormData({ ...formData, ten_chu_ho: e.target.value })}
                  placeholder="Nhập tên chủ hộ"
                />
              </div>
              <div>
                <Label htmlFor="ngay_sinh_chu_ho">Ngày sinh chủ hộ</Label>
                <Input
                  id="ngay_sinh_chu_ho"
                  type="date"
                  value={formData.ngay_sinh_chu_ho || ''}
                  onChange={(e) => setFormData({ ...formData, ngay_sinh_chu_ho: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gioi_tinh_chu_ho">Giới tính</Label>
                <select
                  id="gioi_tinh_chu_ho"
                  value={formData.gioi_tinh_chu_ho || 'Nam'}
                  onChange={(e) => setFormData({ ...formData, gioi_tinh_chu_ho: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="dia_chi_ho_tich">Địa chỉ hộ tịch <span className="text-red-500">*</span></Label>
                <Input
                  id="dia_chi_ho_tich"
                  value={formData.dia_chi_ho_tich || ''}
                  onChange={(e) => setFormData({ ...formData, dia_chi_ho_tich: e.target.value })}
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>
              <div>
                <Label htmlFor="so_thanh_vien_ho_tich">Số thành viên</Label>
                <Input
                  id="so_thanh_vien_ho_tich"
                  type="number"
                  min="1"
                  value={formData.so_thanh_vien_ho_tich || 1}
                  onChange={(e) => setFormData({ ...formData, so_thanh_vien_ho_tich: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="ngay_lap_ho_tich">Ngày lập hộ tịch</Label>
                <Input
                  id="ngay_lap_ho_tich"
                  type="date"
                  value={formData.ngay_lap_ho_tich || ''}
                  onChange={(e) => setFormData({ ...formData, ngay_lap_ho_tich: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="ghi_chu">Ghi chú</Label>
                <Textarea
                  id="ghi_chu"
                  value={formData.ghi_chu || ''}
                  onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="trang_thai">Trạng thái</Label>
                <select
                  id="trang_thai"
                  value={formData.trang_thai || 1}
                  onChange={(e) => setFormData({ ...formData, trang_thai: parseInt(e.target.value) })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>
            </div>
            <div className="bg-slate-50 border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Thành viên hộ tịch</p>
                    <p className="text-sm text-muted-foreground">Nhập đầy đủ thông tin từng thành viên</p>
                  </div>
                  <Badge variant="outline">{formData.thanh_vien?.length || 0} người</Badge>
                </div>
                <Button size="sm" variant="outline" onClick={addMemberRow}>
                  <Plus className="w-4 h-4 mr-1" /> Thêm thành viên
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.thanh_vien || []).map((tv: any, index: number) => (
                  <div key={index} className="rounded-lg border bg-white p-3 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        Thành viên {index + 1}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeMemberRow(index)}
                        disabled={(formData.thanh_vien || []).length <= 1}
                        title="Xóa thành viên"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Họ tên</Label>
                        <Input
                          value={tv?.ho_ten || ''}
                          onChange={(e) => handleMemberChange(index, 'ho_ten', e.target.value)}
                          placeholder="VD: Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Số CCCD</Label>
                        <Input
                          value={tv?.so_cccd || ''}
                          onChange={(e) => handleMemberChange(index, 'so_cccd', e.target.value)}
                          placeholder="Nhập số căn cước"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Ngày sinh</Label>
                        <Input
                          type="date"
                          value={tv?.ngay_sinh || ''}
                          onChange={(e) => handleMemberChange(index, 'ngay_sinh', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Giới tính</Label>
                        <select
                          value={tv?.gioi_tinh || 'Nam'}
                          onChange={(e) => handleMemberChange(index, 'gioi_tinh', e.target.value)}
                          className="w-full h-10 px-3 border border-input rounded-md"
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">Quan hệ với chủ hộ</Label>
                        <Input
                          value={tv?.quan_he_voi_chu_ho || ''}
                          onChange={(e) => handleMemberChange(index, 'quan_he_voi_chu_ho', e.target.value)}
                          placeholder="VD: Vợ/chồng, Con, Ông/bà"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm hộ tịch mới</DialogTitle>
            <DialogDescription>Nhập thông tin hộ tịch mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="add_so_ho_tich">Số hộ tịch <span className="text-red-500">*</span></Label>
                <Input
                  id="add_so_ho_tich"
                  value={formData.so_ho_tich || ''}
                  onChange={(e) => setFormData({ ...formData, so_ho_tich: e.target.value })}
                  placeholder="VD: HT-2024-001"
                />
              </div>
              <div>
                <Label htmlFor="add_ten_chu_ho">Tên chủ hộ <span className="text-red-500">*</span></Label>
                <Input
                  id="add_ten_chu_ho"
                  value={formData.ten_chu_ho || ''}
                  onChange={(e) => setFormData({ ...formData, ten_chu_ho: e.target.value })}
                  placeholder="Nhập tên chủ hộ"
                />
              </div>
              <div>
                <Label htmlFor="add_ngay_sinh_chu_ho">Ngày sinh chủ hộ</Label>
                <Input
                  id="add_ngay_sinh_chu_ho"
                  type="date"
                  value={formData.ngay_sinh_chu_ho || ''}
                  onChange={(e) => setFormData({ ...formData, ngay_sinh_chu_ho: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="add_gioi_tinh_chu_ho">Giới tính</Label>
                <select
                  id="add_gioi_tinh_chu_ho"
                  value={formData.gioi_tinh_chu_ho || 'Nam'}
                  onChange={(e) => setFormData({ ...formData, gioi_tinh_chu_ho: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_dia_chi_ho_tich">Địa chỉ hộ tịch <span className="text-red-500">*</span></Label>
                <Input
                  id="add_dia_chi_ho_tich"
                  value={formData.dia_chi_ho_tich || ''}
                  onChange={(e) => setFormData({ ...formData, dia_chi_ho_tich: e.target.value })}
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>
              <div>
                <Label htmlFor="add_so_thanh_vien_ho_tich">Số thành viên</Label>
                <Input
                  id="add_so_thanh_vien_ho_tich"
                  type="number"
                  min="1"
                  value={formData.so_thanh_vien_ho_tich || 1}
                  onChange={(e) => setFormData({ ...formData, so_thanh_vien_ho_tich: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="add_ngay_lap_ho_tich">Ngày lập hộ tịch</Label>
                <Input
                  id="add_ngay_lap_ho_tich"
                  type="date"
                  value={formData.ngay_lap_ho_tich || ''}
                  onChange={(e) => setFormData({ ...formData, ngay_lap_ho_tich: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_ghi_chu">Ghi chú</Label>
                <Textarea
                  id="add_ghi_chu"
                  value={formData.ghi_chu || ''}
                  onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                />
              </div>
            </div>
            <div className="bg-slate-50 border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Thành viên hộ tịch</p>
                    <p className="text-sm text-muted-foreground">Điền thông tin từng thành viên trong hộ</p>
                  </div>
                  <Badge variant="outline">{formData.thanh_vien?.length || 0} người</Badge>
                </div>
                <Button size="sm" variant="outline" onClick={addMemberRow}>
                  <Plus className="w-4 h-4 mr-1" /> Thêm thành viên
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.thanh_vien || []).map((tv: any, index: number) => (
                  <div key={index} className="rounded-lg border bg-white p-3 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        Thành viên {index + 1}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeMemberRow(index)}
                        disabled={(formData.thanh_vien || []).length <= 1}
                        title="Xóa thành viên"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Họ tên</Label>
                        <Input
                          value={tv?.ho_ten || ''}
                          onChange={(e) => handleMemberChange(index, 'ho_ten', e.target.value)}
                          placeholder="VD: Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Số CCCD</Label>
                        <Input
                          value={tv?.so_cccd || ''}
                          onChange={(e) => handleMemberChange(index, 'so_cccd', e.target.value)}
                          placeholder="Nhập số căn cước"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Ngày sinh</Label>
                        <Input
                          type="date"
                          value={tv?.ngay_sinh || ''}
                          onChange={(e) => handleMemberChange(index, 'ngay_sinh', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Giới tính</Label>
                        <select
                          value={tv?.gioi_tinh || 'Nam'}
                          onChange={(e) => handleMemberChange(index, 'gioi_tinh', e.target.value)}
                          className="w-full h-10 px-3 border border-input rounded-md"
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">Quan hệ với chủ hộ</Label>
                        <Input
                          value={tv?.quan_he_voi_chu_ho || ''}
                          onChange={(e) => handleMemberChange(index, 'quan_he_voi_chu_ho', e.target.value)}
                          placeholder="VD: Vợ/chồng, Con, Ông/bà"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
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
