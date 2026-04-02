'use client';

import { useEffect, useState } from 'react';
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
import {
  Home,
  Search,
  Plus,
  Download,
  User,
  Calendar,
  Users,
  MapPin,
  Eye,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { hoKhauApi } from '@/lib/api';
import { VisualStatsPanel } from '@/components/charts/visual-stats-panel';

interface HoKhau {
  id: string;
  soHoKhau: string;
  chuHo: string;
  diaChi: string;
  soThanhVien: number;
  loai: 'thuong-tru' | 'tam-tru' | 'tam-vang';
  ngayDangKy: string;
  trangThai: 'active' | 'pending' | 'inactive';
}

interface ThanhVienHoKhau {
  id?: number;
  hoTen: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: string;
  quanHe: string;
  soDienThoai: string;
}

const loaiLabels = {
  'thuong-tru': { label: 'Thường trú', color: 'bg-green-500/10 text-green-700' },
  'tam-tru': { label: 'Tạm trú', color: 'bg-blue-500/10 text-blue-700' },
  'tam-vang': { label: 'Tạm vắng', color: 'bg-amber-500/10 text-amber-700' },
};

export default function HoKhauPage() {
  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HoKhau | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [thanhVienList, setThanhVienList] = useState<ThanhVienHoKhau[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberFormData, setMemberFormData] = useState<ThanhVienHoKhau>({
    hoTen: '',
    cccd: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    quanHe: '',
    soDienThoai: '',
  });

  const mapLoaiToUi = (value: string): HoKhau['loai'] => {
    if (value === 'Tạm trú') return 'tam-tru';
    if (value === 'Tạm vắng') return 'tam-vang';
    return 'thuong-tru';
  };

  const mapLoaiToDb = (value: HoKhau['loai']): string => {
    if (value === 'tam-tru') return 'Tạm trú';
    if (value === 'tam-vang') return 'Tạm vắng';
    return 'Thường trú';
  };

  const normalizeMembersWithChuHo = (members: ThanhVienHoKhau[]) => {
    const chuHoName = String(formData.chuHo || '').trim();
    const chuHoCccd = String(formData.cccd || '').trim();
    const chuHoNgaySinh = String(formData.ngaySinh || '').trim();
    const chuHoGioiTinh = String(formData.gioiTinh || 'Nam').trim();
    const chuHoPhone = String(formData.soDienThoai || '').trim();

    const existingChuHo = members.find((tv) => String(tv.quanHe || '').trim() === 'Chủ hộ');
    const ownerMember: ThanhVienHoKhau = {
      id: existingChuHo?.id,
      hoTen: chuHoName,
      cccd: chuHoCccd,
      ngaySinh: chuHoNgaySinh,
      gioiTinh: chuHoGioiTinh,
      quanHe: 'Chủ hộ',
      soDienThoai: chuHoPhone,
    };

    const others = members.filter((tv) => String(tv.quanHe || '').trim() !== 'Chủ hộ');
    const normalizedOthers = others.filter((tv) => String(tv.hoTen || '').trim());

    return [ownerMember, ...normalizedOthers];
  };

  const loadHoKhau = async () => {
    const result = await hoKhauApi.getList({ page: 1, limit: 500 });
    if (result.success && Array.isArray(result.data)) {
      const mapped = result.data.map((item: any) => ({
        id: item.MaHoKhau,
        soHoKhau: item.SoHoKhau,
        chuHo: item.ChuHo,
        cccd: item.CCCDChuHo || '',
        ngaySinh: item.NgaySinhChuHo || '',
        gioiTinh: item.GioiTinhChuHo || 'Nam',
        soDienThoai: item.SoDienThoaiChuHo || '',
        diaChi: item.DiaChiThuongTru,
        soThanhVien: Number(item.SoThanhVien || 0),
        loai: mapLoaiToUi(item.LoaiHoKhau),
        ngayDangKy: item.NgayDangKy,
        trangThai: item.TrangThai === 'Hoạt động' ? 'active' : item.TrangThai === 'Tạm dừng' ? 'pending' : 'inactive',
      } as HoKhau));
      setHoKhauList(mapped);
    }
  };

  useEffect(() => {
    loadHoKhau();
  }, []);

  const stats = {
    total: hoKhauList.length,
    thuongTru: hoKhauList.filter((item) => item.loai === 'thuong-tru').length,
    tamTru: hoKhauList.filter((item) => item.loai === 'tam-tru').length,
    tamVang: hoKhauList.filter((item) => item.loai === 'tam-vang').length,
  };

  const filteredData = hoKhauList.filter((item) =>
    item.soHoKhau.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.chuHo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.diaChi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: HoKhau) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = async (item: HoKhau) => {
    setSelectedItem(item);
    setFormData({ ...item });
    const members = await hoKhauApi.getMembers(item.id);
    if (members.success && Array.isArray(members.data)) {
      const mappedMembers = members.data.map((tv: any) => ({
        id: tv.MaThanhVien,
        hoTen: tv.HoTen,
        cccd: tv.CCCD || '',
        ngaySinh: tv.NgaySinh || '',
        gioiTinh: tv.GioiTinh || 'Nam',
        quanHe: tv.QuanHeChuHo || '',
        soDienThoai: tv.SoDienThoai || '',
      }));
      setThanhVienList(mappedMembers);
    } else {
      setThanhVienList([]);
    }
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      soHoKhau: '',
      chuHo: '',
      cccd: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      soDienThoai: '',
      diaChi: '',
      soThanhVien: 1,
      loai: 'thuong-tru',
      ngayDangKy: new Date().toISOString().split('T')[0],
      ghiChu: '',
    });
    setThanhVienList([]);
    setIsAddOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!String(formData.soHoKhau || '').trim()) {
        alert('Vui lòng nhập số hộ khẩu');
        return;
      }

      if (!String(formData.chuHo || '').trim()) {
        alert('Vui lòng nhập tên chủ hộ');
        return;
      }

      if (!String(formData.diaChi || '').trim()) {
        alert('Vui lòng nhập địa chỉ thường trú');
        return;
      }

      const generatedMaHoKhau = `HK${Date.now().toString().slice(-10)}`;
      const maHoKhau = formData.id || formData.MaHoKhau || generatedMaHoKhau;
      const normalizedMembers = normalizeMembersWithChuHo(thanhVienList);
      const payload = {
        MaHoKhau: maHoKhau,
        SoHoKhau: formData.soHoKhau,
        ChuHo: formData.chuHo,
        CCCDChuHo: formData.cccd || null,
        NgaySinhChuHo: formData.ngaySinh || null,
        GioiTinhChuHo: formData.gioiTinh || null,
        SoDienThoaiChuHo: formData.soDienThoai || null,
        DiaChiThuongTru: formData.diaChi,
        SoThanhVien: normalizedMembers.length,
        LoaiHoKhau: mapLoaiToDb(formData.loai || 'thuong-tru'),
        NgayDangKy: formData.ngayDangKy,
        GhiChu: formData.ghiChu || '',
      };

      const result = (formData.id || formData.MaHoKhau)
        ? await hoKhauApi.update(maHoKhau, payload)
        : await hoKhauApi.create(payload);

      if (!result?.success) {
        throw new Error(result?.message || 'Không thể lưu hộ khẩu');
      }

      for (const tv of normalizedMembers) {
        if (!String(tv.hoTen || '').trim()) {
          continue;
        }

        const memberPayload = {
          HoTen: tv.hoTen,
          CCCD: tv.cccd || null,
          NgaySinh: tv.ngaySinh || null,
          GioiTinh: tv.gioiTinh || null,
          QuanHeChuHo: tv.quanHe || null,
          SoDienThoai: tv.soDienThoai || null,
        };

        if (tv.id) {
          const updateMemberRes = await hoKhauApi.updateMember(tv.id, memberPayload);
          if (!updateMemberRes?.success) {
            throw new Error(updateMemberRes?.message || 'Không thể cập nhật thành viên hộ khẩu');
          }
        } else {
          const addMemberRes = await hoKhauApi.addMember(maHoKhau, memberPayload);
          if (!addMemberRes?.success) {
            throw new Error(addMemberRes?.message || 'Không thể thêm thành viên hộ khẩu');
          }
        }
      }

      await loadHoKhau();
      setIsEditOpen(false);
      setIsAddOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Lưu hộ khẩu thất bại');
    }
  };

  const handleDeleteHoKhau = async (item: HoKhau) => {
    if (confirm(`Bạn có chắc chắn muốn xóa hộ khẩu ${item.soHoKhau}?`)) {
      try {
        const result = await hoKhauApi.delete(item.id);
        if (!result?.success) {
          throw new Error(result?.message || 'Không thể xóa hộ khẩu');
        }
        await loadHoKhau();
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Xóa hộ khẩu thất bại');
      }
    }
  };

  const handleAddMember = () => {
    setMemberFormData({
      hoTen: '',
      cccd: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      quanHe: '',
      soDienThoai: '',
    });
    setIsAddMemberOpen(true);
  };

  const handleSaveMember = () => {
    if (!memberFormData.hoTen || !memberFormData.cccd) {
      alert('Vui lòng nhập đầy đủ họ tên và số CCCD');
      return;
    }
    
    const newMember: ThanhVienHoKhau = {
      ...memberFormData,
    };
    
    setThanhVienList([...thanhVienList, newMember]);
    setIsAddMemberOpen(false);
  };

  const handleDeleteMember = async (index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      const selected = thanhVienList[index];
      if (selected?.id) {
        const result = await hoKhauApi.deleteMember(selected.id);
        if (!result?.success) {
          alert(result?.message || 'Không thể xóa thành viên hộ khẩu');
          return;
        }
      }
      setThanhVienList(thanhVienList.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Home className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Hộ khẩu - Cư trú</h1>
              </div>
              <p className="text-white/90">Đăng ký thường trú, tạm trú, tạm vắng</p>
            </div>
            <Button onClick={handleAdd} className="bg-white text-indigo-600 hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Đăng ký mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <VisualStatsPanel
        title="Biểu đồ phân loại hộ khẩu"
        subtitle="Theo dõi nhanh thường trú, tạm trú và tạm vắng"
        items={[
          { label: 'Tổng hộ khẩu', value: stats.total, color: '#4f46e5' },
          { label: 'Thường trú', value: stats.thuongTru, color: '#22c55e' },
          { label: 'Tạm trú', value: stats.tamTru, color: '#3b82f6' },
          { label: 'Tạm vắng', value: stats.tamVang, color: '#f59e0b' },
        ]}
      />

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo số hộ khẩu, chủ hộ, địa chỉ..."
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
                <th className="text-left p-4 font-semibold">Số hộ khẩu</th>
                <th className="text-left p-4 font-semibold">Chủ hộ</th>
                <th className="text-left p-4 font-semibold">Địa chỉ</th>
                <th className="text-left p-4 font-semibold">Số thành viên</th>
                <th className="text-left p-4 font-semibold">Loại</th>
                <th className="text-left p-4 font-semibold">Ngày đăng ký</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">{item.soHoKhau}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {item.chuHo}
                    </div>
                  </td>
                  <td className="p-4 text-sm">{item.diaChi}</td>
                  <td className="p-4">
                    <Badge className="bg-indigo-500/10 text-indigo-700 border-0">
                      <Users className="w-3 h-3 mr-1" />
                      {item.soThanhVien} người
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={`${loaiLabels[item.loai].color} border-0`}>
                      {loaiLabels[item.loai].label}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{item.ngayDangKy}</td>
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
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteHoKhau(item)}
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
            <DialogTitle>Chi tiết hộ khẩu</DialogTitle>
            <DialogDescription>Thông tin chi tiết về hộ khẩu và thành viên</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Thông tin hộ khẩu</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Số hộ khẩu</Label>
                    <p className="font-medium">{selectedItem.soHoKhau}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Chủ hộ</Label>
                    <p className="font-medium">{selectedItem.chuHo}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Địa chỉ</Label>
                    <p className="font-medium">{selectedItem.diaChi}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Loại</Label>
                    <Badge className={loaiLabels[selectedItem.loai].color}>
                      {loaiLabels[selectedItem.loai].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ngày đăng ký</Label>
                    <p className="font-medium">{selectedItem.ngayDangKy}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hộ khẩu</DialogTitle>
            <DialogDescription>Cập nhật thông tin hộ khẩu và thành viên</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Thông tin chủ hộ */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Thông tin chủ hộ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit_soHoKhau">Số hộ khẩu *</Label>
                  <Input
                    id="edit_soHoKhau"
                    value={formData.soHoKhau || ''}
                    onChange={(e) => setFormData({ ...formData, soHoKhau: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_chuHo">Tên chủ hộ *</Label>
                  <Input
                    id="edit_chuHo"
                    value={formData.chuHo || ''}
                    onChange={(e) => setFormData({ ...formData, chuHo: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_cccd">Số CCCD *</Label>
                  <Input
                    id="edit_cccd"
                    value={formData.cccd || ''}
                    onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_ngaySinh">Ngày sinh</Label>
                  <Input
                    id="edit_ngaySinh"
                    type="date"
                    value={formData.ngaySinh || ''}
                    onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_gioiTinh">Giới tính</Label>
                  <select
                    id="edit_gioiTinh"
                    value={formData.gioiTinh || 'Nam'}
                    onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                    className="w-full h-10 px-3 border border-input rounded-md"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit_diaChi">Địa chỉ *</Label>
                  <Input
                    id="edit_diaChi"
                    value={formData.diaChi || ''}
                    onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_loai">Loại hộ khẩu *</Label>
                  <select
                    id="edit_loai"
                    value={formData.loai || 'thuong-tru'}
                    onChange={(e) => setFormData({ ...formData, loai: e.target.value })}
                    className="w-full h-10 px-3 border border-input rounded-md"
                  >
                    <option value="thuong-tru">Thường trú</option>
                    <option value="tam-tru">Tạm trú</option>
                    <option value="tam-vang">Tạm vắng</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit_ngayDangKy">Ngày đăng ký</Label>
                  <Input
                    id="edit_ngayDangKy"
                    type="date"
                    value={formData.ngayDangKy || ''}
                    onChange={(e) => setFormData({ ...formData, ngayDangKy: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Danh sách thành viên */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh sách thành viên ({thanhVienList.length})
                </h3>
                <Button onClick={handleAddMember} size="sm" className="h-8">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Thêm thành viên
                </Button>
              </div>
              
              {thanhVienList.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Chưa có thành viên nào</p>
                  <Button onClick={handleAddMember} size="sm" variant="outline" className="mt-3">
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm thành viên đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {thanhVienList.map((tv, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
                          <div>
                            <Label className="text-xs text-muted-foreground">Họ tên</Label>
                            <p className="font-medium">{tv.hoTen}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Số CCCD</Label>
                            <p className="font-medium">{tv.cccd}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
                            <p>{tv.ngaySinh || 'Chưa có'}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Giới tính</Label>
                            <p>{tv.gioiTinh}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Quan hệ</Label>
                            <Badge variant="outline" className="mt-1">{tv.quanHe}</Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">SĐT</Label>
                            <p>{tv.soDienThoai || 'Chưa có'}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleDeleteMember(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Edit className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog - Tương tự như Edit Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Đăng ký hộ khẩu mới</DialogTitle>
            <DialogDescription>Nhập thông tin hộ khẩu và thành viên</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Cùng layout như Edit Dialog */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Thông tin chủ hộ</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="add_soHoKhau">Số hộ khẩu *</Label>
                  <Input
                    id="add_soHoKhau"
                    value={formData.soHoKhau || ''}
                    onChange={(e) => setFormData({ ...formData, soHoKhau: e.target.value })}
                    placeholder="Nhập số hộ khẩu"
                  />
                </div>
                <div>
                  <Label htmlFor="add_chuHo">Tên chủ hộ *</Label>
                  <Input
                    id="add_chuHo"
                    value={formData.chuHo || ''}
                    onChange={(e) => setFormData({ ...formData, chuHo: e.target.value })}
                    placeholder="Nhập tên chủ hộ"
                  />
                </div>
                <div>
                  <Label htmlFor="add_cccd">Số CCCD *</Label>
                  <Input
                    id="add_cccd"
                    value={formData.cccd || ''}
                    onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                    placeholder="Nhập số CCCD"
                  />
                </div>
                <div>
                  <Label htmlFor="add_ngaySinh">Ngày sinh</Label>
                  <Input
                    id="add_ngaySinh"
                    type="date"
                    value={formData.ngaySinh || ''}
                    onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="add_gioiTinh">Giới tính</Label>
                  <select
                    id="add_gioiTinh"
                    value={formData.gioiTinh || 'Nam'}
                    onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                    className="w-full h-10 px-3 border border-input rounded-md"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="add_diaChi">Địa chỉ *</Label>
                  <Input
                    id="add_diaChi"
                    value={formData.diaChi || ''}
                    onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                    placeholder="Nhập địa chỉ đầy đủ"
                  />
                </div>
                <div>
                  <Label htmlFor="add_loai">Loại hộ khẩu *</Label>
                  <select
                    id="add_loai"
                    value={formData.loai || 'thuong-tru'}
                    onChange={(e) => setFormData({ ...formData, loai: e.target.value })}
                    className="w-full h-10 px-3 border border-input rounded-md"
                  >
                    <option value="thuong-tru">Thường trú</option>
                    <option value="tam-tru">Tạm trú</option>
                    <option value="tam-vang">Tạm vắng</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="add_ngayDangKy">Ngày đăng ký</Label>
                  <Input
                    id="add_ngayDangKy"
                    type="date"
                    value={formData.ngayDangKy || ''}
                    onChange={(e) => setFormData({ ...formData, ngayDangKy: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Danh sách thành viên - Giống Edit Dialog */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh sách thành viên ({thanhVienList.length})
                </h3>
                <Button onClick={handleAddMember} size="sm" className="h-8">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Thêm thành viên
                </Button>
              </div>
              
              {thanhVienList.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Chưa có thành viên nào</p>
                  <Button onClick={handleAddMember} size="sm" variant="outline" className="mt-3">
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm thành viên đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {thanhVienList.map((tv, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
                          <div>
                            <Label className="text-xs text-muted-foreground">Họ tên</Label>
                            <p className="font-medium">{tv.hoTen}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Số CCCD</Label>
                            <p className="font-medium">{tv.cccd}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
                            <p>{tv.ngaySinh || 'Chưa có'}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Giới tính</Label>
                            <p>{tv.gioiTinh}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Quan hệ</Label>
                            <Badge variant="outline" className="mt-1">{tv.quanHe}</Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">SĐT</Label>
                            <p>{tv.soDienThoai || 'Chưa có'}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleDeleteMember(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Dialog Thêm thành viên */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm thành viên hộ khẩu</DialogTitle>
            <DialogDescription>Nhập thông tin thành viên mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="member_hoTen">Họ và tên *</Label>
                <Input
                  id="member_hoTen"
                  value={memberFormData.hoTen}
                  onChange={(e) => setMemberFormData({ ...memberFormData, hoTen: e.target.value })}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div>
                <Label htmlFor="member_cccd">Số CCCD *</Label>
                <Input
                  id="member_cccd"
                  value={memberFormData.cccd}
                  onChange={(e) => setMemberFormData({ ...memberFormData, cccd: e.target.value })}
                  placeholder="Nhập số CCCD"
                />
              </div>
              <div>
                <Label htmlFor="member_ngaySinh">Ngày sinh</Label>
                <Input
                  id="member_ngaySinh"
                  type="date"
                  value={memberFormData.ngaySinh}
                  onChange={(e) => setMemberFormData({ ...memberFormData, ngaySinh: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="member_gioiTinh">Giới tính</Label>
                <select
                  id="member_gioiTinh"
                  value={memberFormData.gioiTinh}
                  onChange={(e) => setMemberFormData({ ...memberFormData, gioiTinh: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div>
                <Label htmlFor="member_soDienThoai">Số điện thoại</Label>
                <Input
                  id="member_soDienThoai"
                  value={memberFormData.soDienThoai}
                  onChange={(e) => setMemberFormData({ ...memberFormData, soDienThoai: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <Label htmlFor="member_quanHe">Quan hệ với chủ hộ *</Label>
                <select
                  id="member_quanHe"
                  value={memberFormData.quanHe}
                  onChange={(e) => setMemberFormData({ ...memberFormData, quanHe: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="">-- Chọn quan hệ --</option>
                  <option value="Chủ hộ">Chủ hộ</option>
                  <option value="Vợ">Vợ</option>
                  <option value="Chồng">Chồng</option>
                  <option value="Con">Con</option>
                  <option value="Cha">Cha</option>
                  <option value="Mẹ">Mẹ</option>
                  <option value="Anh">Anh</option>
                  <option value="Chị">Chị</option>
                  <option value="Em">Em</option>
                  <option value="Ông">Ông</option>
                  <option value="Bà">Bà</option>
                  <option value="Cháu">Cháu</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveMember}>
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm thành viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
