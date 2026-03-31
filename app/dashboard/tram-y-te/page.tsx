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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDateTime } from '@/lib/mock-data';
import { nhanVienYTeApi, tramYTeApi } from '@/lib/api';
import {
  Stethoscope,
  Users,
  Building2,
  TrendingUp,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Phone,
  MapPin,
} from 'lucide-react';

export default function TramYTePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [nhanVienList, setNhanVienList] = useState<any[]>([]);
  const [viewNhanVienList, setViewNhanVienList] = useState<any[]>([]);
  const [tramList, setTramList] = useState<any[]>([]);
  const [isNhanVienDialogOpen, setIsNhanVienDialogOpen] = useState(false);
  const [editingNhanVienIndex, setEditingNhanVienIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [nhanVienForm, setNhanVienForm] = useState({
    HoTen: '',
    ChucDanh: '',
    ChuyenMon: '',
    SoDienThoai: '',
    TrangThaiLamViec: 'Đang làm việc',
  });

  const toSearchable = (value: any) => String(value ?? '').toLowerCase();
  const parseNumericId = (value: any) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };
  const getNhanVienKey = (item: any, index: number) => {
    const id = parseNumericId(item?.MaNhanVien);
    if (id !== null) {
      return id;
    }
    return `nv-${item?.HoTen || 'unknown'}-${item?.SoDienThoai || 'na'}-${index}`;
  };
  const getTramKey = (item: any, index: number) => {
    const id = parseNumericId(item?.MaTram);
    if (id !== null) {
      return id;
    }
    return `tram-${item?.TenTram || 'unknown'}-${item?.DiaChi || 'na'}-${index}`;
  };

  const filteredData = tramList.filter((item) => {
    const search = toSearchable(searchQuery);
    return (
      toSearchable(item?.TenTram).includes(search) ||
      toSearchable(item?.DiaChi).includes(search) ||
      toSearchable(item?.SoDienThoai).includes(search)
    );
  });

  const loadData = async () => {
    const response = await tramYTeApi.getList({ page: 1, limit: 500 });
    if (response.success && Array.isArray(response.data)) {
      setTramList(response.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const fetchNhanVienByTram = async (maTram: number) => {
    const response = await nhanVienYTeApi.getList({ page: 1, limit: 500, maTram });
    if (!response.success || !Array.isArray(response.data)) {
      return [];
    }
    return response.data.filter((item: any) => Number(item?.MaTram) === Number(maTram));
  };

  const handleView = async (item: any) => {
    setSelectedItem(item);
    setViewNhanVienList([]);
    setIsViewOpen(true);

    const maTram = parseNumericId(item?.MaTram);
    if (maTram !== null) {
      const members = await fetchNhanVienByTram(maTram);
      setViewNhanVienList(members);
    }
  };

  const handleEdit = async (item: any) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setNhanVienList([]);
    setIsEditOpen(true);

    const maTram = parseNumericId(item?.MaTram);
    if (maTram !== null) {
      const members = await fetchNhanVienByTram(maTram);
      setNhanVienList(members);
    }
  };

  const handleAdd = () => {
    setFormData({
      TenTram: '',
      DiaChi: '',
      SoDienThoai: '',
      SoNhanVien: 0,
      SoLuotKhamThang: 0,
      TrangThai: 1,
      GhiChu: '',
    });
    setSelectedItem(null);
    setNhanVienList([]);
    setIsAddOpen(true);
  };

  const handleAddNhanVien = () => {
    setEditingNhanVienIndex(null);
    setNhanVienForm({
      HoTen: '',
      ChucDanh: '',
      ChuyenMon: '',
      SoDienThoai: '',
      TrangThaiLamViec: 'Đang làm việc',
    });
    setIsNhanVienDialogOpen(true);
  };

  const handleEditNhanVien = (index: number) => {
    setEditingNhanVienIndex(index);
    const nv = nhanVienList[index];
    setNhanVienForm({
      HoTen: nv.HoTen || '',
      ChucDanh: nv.ChucDanh || '',
      ChuyenMon: nv.ChuyenMon || '',
      SoDienThoai: nv.SoDienThoai || '',
      TrangThaiLamViec: nv.TrangThaiLamViec || 'Đang làm việc',
    });
    setIsNhanVienDialogOpen(true);
  };

  const handleDeleteNhanVien = (index: number) => {
    setNhanVienList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveNhanVien = () => {
    if (!nhanVienForm.HoTen.trim()) return;

    if (editingNhanVienIndex === null) {
      setNhanVienList((prev) => [
        ...prev,
        {
          ...nhanVienForm,
          MaNhanVien: `temp-${Date.now()}`,
          MaTram: parseNumericId(selectedItem?.MaTram) || 0,
        },
      ]);
    } else {
      setNhanVienList((prev) =>
        prev.map((nv, idx) => {
          if (idx !== editingNhanVienIndex) {
            return nv;
          }
          return {
            ...nv,
            ...nhanVienForm,
          };
        })
      );
    }

    setIsNhanVienDialogOpen(false);
  };

  const syncNhanVienForTram = async (maTram: number) => {
    const latestResponse = await nhanVienYTeApi.getList({ page: 1, limit: 500, maTram });
    const latestFromServer = latestResponse.success && Array.isArray(latestResponse.data)
      ? latestResponse.data.filter((item: any) => Number(item?.MaTram) === maTram)
      : [];

    const localById = new Map<number, any>();
    nhanVienList.forEach((item) => {
      const id = parseNumericId(item?.MaNhanVien);
      if (id !== null) {
        localById.set(id, item);
      }
    });

    for (const serverItem of latestFromServer) {
      const serverId = parseNumericId(serverItem?.MaNhanVien);
      if (serverId !== null && !localById.has(serverId)) {
        await nhanVienYTeApi.delete(serverId);
      }
    }

    for (const member of nhanVienList) {
      const payload = {
        HoTen: member.HoTen,
        ChucDanh: member.ChucDanh || null,
        ChuyenMon: member.ChuyenMon || null,
        SoDienThoai: member.SoDienThoai || null,
        TrangThaiLamViec: member.TrangThaiLamViec || 'Đang làm việc',
        MaTram: maTram,
        GhiChu: member.GhiChu || null,
      };

      const memberId = parseNumericId(member?.MaNhanVien);
      if (memberId !== null) {
        await nhanVienYTeApi.update(memberId, payload);
      } else {
        await nhanVienYTeApi.create(payload);
      }
    }

    const refreshedMembers = await fetchNhanVienByTram(maTram);
    setNhanVienList(refreshedMembers);
    if (selectedItem && Number(selectedItem.MaTram) === maTram) {
      setViewNhanVienList(refreshedMembers);
    }
  };

  const handleSave = async () => {
    if (!String(formData.TenTram || '').trim()) {
      alert('Vui lòng nhập tên trạm y tế.');
      return;
    }

    setIsSaving(true);

    const payload = {
      TenTram: formData.TenTram,
      DiaChi: formData.DiaChi,
      SoDienThoai: formData.SoDienThoai,
      SoNhanVien: nhanVienList.length,
      SoLuotKhamThang: Number(formData.SoLuotKhamThang || 0),
      TrangThai: formData.TrangThai === 1 || formData.TrangThai === true,
      GhiChu: formData.GhiChu || null,
      NgayTao: formData.NgayTao || new Date().toISOString(),
    };

    try {
      let maTram = parseNumericId(selectedItem?.MaTram);

      if (maTram !== null) {
        const updateResponse = await tramYTeApi.update(maTram, payload);
        if (!updateResponse.success) {
          throw new Error(updateResponse.message || 'Không thể cập nhật trạm y tế');
        }
      } else {
        const createResponse = await tramYTeApi.create(payload);
        if (!createResponse.success) {
          throw new Error(createResponse.message || 'Không thể tạo mới trạm y tế');
        }
        maTram = parseNumericId((createResponse as any).data?.MaTram);
      }

      if (maTram !== null) {
        await syncNhanVienForTram(maTram);
      }

      await loadData();
      setIsEditOpen(false);
      setIsAddOpen(false);
      setSelectedItem(null);
      setViewNhanVienList([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu dữ liệu';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa trạm y tế ${item.TenTram}?`)) {
      await tramYTeApi.delete(item.MaTram);
      await loadData();
    }
  };

  const totalNhanVien = tramList.reduce((sum, tram) => sum + Number(tram.SoNhanVien || 0), 0);
  const totalLuotKham = tramList.reduce((sum, tram) => sum + Number(tram.SoLuotKhamThang || 0), 0);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-status-danger to-primary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Trạm Y tế</h1>
              </div>
              <p className="text-white/90">Cơ sở vật chất, nhân lực, trang thiết bị</p>
            </div>
            <Button onClick={handleAdd} className="bg-white text-red-600 hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Thêm trạm y tế
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <Building2 className="w-6 h-6 text-red-600" />
            </div>
            <Badge className="bg-red-500/10 text-red-700 border-0">Tổng</Badge>
          </div>
          <p className="text-3xl font-bold">{tramList.length}</p>
          <p className="text-sm text-muted-foreground">Trạm y tế</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <Badge className="bg-secondary/10 text-secondary border-0">Nhân sự</Badge>
          </div>
          <p className="text-3xl font-bold">{totalNhanVien}</p>
          <p className="text-sm text-muted-foreground">Nhân viên y tế</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-status-success/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-status-success" />
            </div>
            <Badge className="bg-status-success/10 text-status-success border-0">Hoạt động</Badge>
          </div>
          <p className="text-3xl font-bold">{totalLuotKham}</p>
          <p className="text-sm text-muted-foreground">Lượt khám/tháng</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <Badge className="bg-primary/10 text-primary border-0">Hoạt động</Badge>
          </div>
          <p className="text-3xl font-bold">{tramList.filter(t => t.TrangThai === 1 || t.TrangThai === true).length}</p>
          <p className="text-sm text-muted-foreground">Trạm hoạt động</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo tên trạm, địa chỉ, số điện thoại..."
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
                <th className="text-left p-4 font-semibold">Tên trạm</th>
                <th className="text-left p-4 font-semibold">Địa chỉ</th>
                <th className="text-left p-4 font-semibold">Số điện thoại</th>
                <th className="text-left p-4 font-semibold">Số nhân viên</th>
                <th className="text-left p-4 font-semibold">Lượt khám/tháng</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={getTramKey(item, index)} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-red-500" />
                      <span className="font-semibold">{item.TenTram}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="max-w-xs truncate">{item.DiaChi}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{item.SoDienThoai}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.SoNhanVien}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="font-medium">
                      {Number(item.SoLuotKhamThang || 0).toLocaleString()} lượt
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={item.TrangThai === 1 || item.TrangThai === true ? 'bg-status-success/10 text-status-success border-0' : 'bg-status-danger/10 text-status-danger border-0'}>
                      {item.TrangThai === 1 || item.TrangThai === true ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => void handleView(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => void handleEdit(item)}
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
            <DialogTitle>Chi tiết trạm y tế</DialogTitle>
            <DialogDescription>Thông tin chi tiết về trạm y tế</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              {/* Thông tin trạm */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Thông tin trạm y tế
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Tên trạm</Label>
                    <p className="font-medium text-lg">{selectedItem.TenTram}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Địa chỉ</Label>
                    <p className="font-medium">{selectedItem.DiaChi}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số điện thoại</Label>
                    <p className="font-medium">{selectedItem.SoDienThoai}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số nhân viên</Label>
                    <p className="font-medium">{selectedItem.SoNhanVien} người</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Lượt khám/tháng</Label>
                    <p className="font-medium">{Number(selectedItem.SoLuotKhamThang || 0).toLocaleString()} lượt</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Trạng thái</Label>
                    <Badge className={selectedItem.TrangThai === 1 ? 'bg-status-success/10 text-status-success' : 'bg-status-danger/10 text-status-danger'}>
                      {selectedItem.TrangThai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                  {selectedItem.GhiChu && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Ghi chú</Label>
                      <p className="font-medium">{selectedItem.GhiChu}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Ngày tạo</Label>
                    <p className="font-medium text-sm">{formatDateTime(selectedItem.NgayTao)}</p>
                  </div>
                </div>
              </div>

              {/* Danh sách nhân viên */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh sách nhân viên ({viewNhanVienList.length})
                </h3>
                <div className="space-y-3">
                  {viewNhanVienList.map((nv, index) => (
                    <div key={getNhanVienKey(nv, index)} className="border rounded-lg p-4 hover:bg-slate-50">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Họ tên</Label>
                          <p className="font-medium">{nv.HoTen}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Chức danh</Label>
                          <Badge variant="outline">{nv.ChucDanh}</Badge>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Chuyên môn</Label>
                          <p>{nv.ChuyenMon}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Số điện thoại</Label>
                          <p>{nv.SoDienThoai}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground">Trạng thái làm việc</Label>
                          <Badge className="bg-status-success/10 text-status-success border-0">{nv.TrangThaiLamViec}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {viewNhanVienList.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Chưa có nhân viên</p>
                  )}
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
              void handleEdit(selectedItem);
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa trạm y tế</DialogTitle>
            <DialogDescription>Cập nhật thông tin trạm y tế</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Thông tin trạm */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Thông tin trạm y tế
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="TenTram">Tên trạm <span className="text-red-500">*</span></Label>
                  <Input
                    id="TenTram"
                    value={formData.TenTram || ''}
                    onChange={(e) => setFormData({ ...formData, TenTram: e.target.value })}
                    placeholder="Nhập tên trạm y tế"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="DiaChi">Địa chỉ <span className="text-red-500">*</span></Label>
                  <Input
                    id="DiaChi"
                    value={formData.DiaChi || ''}
                    onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                    placeholder="Nhập địa chỉ đầy đủ"
                  />
                </div>
                <div>
                  <Label htmlFor="SoDienThoai">Số điện thoại</Label>
                  <Input
                    id="SoDienThoai"
                    value={formData.SoDienThoai || ''}
                    onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <Label htmlFor="SoNhanVien">Số nhân viên</Label>
                  <Input
                    id="SoNhanVien"
                    type="number"
                    min="0"
                    value={formData.SoNhanVien || 0}
                    onChange={(e) => setFormData({ ...formData, SoNhanVien: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="SoLuotKhamThang">Lượt khám/tháng</Label>
                  <Input
                    id="SoLuotKhamThang"
                    type="number"
                    min="0"
                    value={formData.SoLuotKhamThang || 0}
                    onChange={(e) => setFormData({ ...formData, SoLuotKhamThang: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="TrangThai">Trạng thái</Label>
                  <select
                    id="TrangThai"
                    value={formData.TrangThai || 1}
                    onChange={(e) => setFormData({ ...formData, TrangThai: parseInt(e.target.value) })}
                    className="w-full h-10 px-3 border border-input rounded-md"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Không hoạt động</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="GhiChu">Ghi chú</Label>
                  <Textarea
                    id="GhiChu"
                    value={formData.GhiChu || ''}
                    onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                    placeholder="Nhập ghi chú (nếu có)"
                    rows={3}
                  />
                </div>
                {selectedItem && selectedItem.NgayTao && (
                  <div>
                    <Label className="text-muted-foreground">Ngày tạo</Label>
                    <p className="font-medium text-sm">{formatDateTime(selectedItem.NgayTao)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Danh sách nhân viên */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh sách nhân viên ({nhanVienList.length})
                </h3>
                <Button size="sm" variant="outline" onClick={handleAddNhanVien}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm thành viên
                </Button>
              </div>
              <div className="space-y-3">
                {nhanVienList.map((nv, index) => (
                  <div key={getNhanVienKey(nv, index)} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Họ tên</Label>
                        <p className="font-medium">{nv.HoTen}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Chức danh</Label>
                        <Badge variant="outline">{nv.ChucDanh}</Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Chuyên môn</Label>
                        <p>{nv.ChuyenMon}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Số điện thoại</Label>
                        <p>{nv.SoDienThoai}</p>
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <div>
                          <Label className="text-xs text-muted-foreground">Trạng thái làm việc</Label>
                          <div>
                            <Badge className="bg-status-success/10 text-status-success border-0">{nv.TrangThaiLamViec}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" size="sm" variant="ghost" onClick={() => handleEditNhanVien(index)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button type="button" size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteNhanVien(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {nhanVienList.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Chưa có nhân viên</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm trạm y tế mới</DialogTitle>
            <DialogDescription>Nhập thông tin trạm y tế mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="add_TenTram">Tên trạm <span className="text-red-500">*</span></Label>
                <Input
                  id="add_TenTram"
                  value={formData.TenTram || ''}
                  onChange={(e) => setFormData({ ...formData, TenTram: e.target.value })}
                  placeholder="VD: Trạm Y tế Phường 1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_DiaChi">Địa chỉ <span className="text-red-500">*</span></Label>
                <Input
                  id="add_DiaChi"
                  value={formData.DiaChi || ''}
                  onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>
              <div>
                <Label htmlFor="add_SoDienThoai">Số điện thoại</Label>
                <Input
                  id="add_SoDienThoai"
                  value={formData.SoDienThoai || ''}
                  onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <Label htmlFor="add_SoNhanVien">Số nhân viên</Label>
                <Input
                  id="add_SoNhanVien"
                  type="number"
                  min="0"
                  value={formData.SoNhanVien || 0}
                  onChange={(e) => setFormData({ ...formData, SoNhanVien: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="add_SoLuotKhamThang">Lượt khám/tháng</Label>
                <Input
                  id="add_SoLuotKhamThang"
                  type="number"
                  min="0"
                  value={formData.SoLuotKhamThang || 0}
                  onChange={(e) => setFormData({ ...formData, SoLuotKhamThang: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="add_TrangThai">Trạng thái</Label>
                <Select value={String(formData.TrangThai ?? 1)} onValueChange={(v) => setFormData({ ...formData, TrangThai: parseInt(v, 10) })}>
                  <SelectTrigger id="add_TrangThai">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Hoạt động</SelectItem>
                    <SelectItem value="0">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_GhiChu">Ghi chú</Label>
                <Textarea
                  id="add_GhiChu"
                  value={formData.GhiChu || ''}
                  onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Danh sách thành viên ({nhanVienList.length})
                </h3>
                <Button size="sm" variant="outline" onClick={handleAddNhanVien}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm thành viên
                </Button>
              </div>
              {nhanVienList.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có thành viên, vui lòng thêm ít nhất 1 nhân viên.</p>
              ) : (
                <div className="space-y-2">
                  {nhanVienList.map((nv, index) => (
                    <div key={getNhanVienKey(nv, index)} className="flex items-center justify-between rounded border p-3">
                      <div>
                        <p className="font-medium">{nv.HoTen}</p>
                        <p className="text-sm text-muted-foreground">{nv.ChucDanh} - {nv.ChuyenMon}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="ghost" onClick={() => handleEditNhanVien(index)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button type="button" size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteNhanVien(index)}>
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
            <Button onClick={handleSave} disabled={isSaving}>
              <Plus className="w-4 h-4 mr-2" />
              {isSaving ? 'Đang lưu...' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNhanVienDialogOpen} onOpenChange={setIsNhanVienDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingNhanVienIndex === null ? 'Thêm thành viên y tế' : 'Chỉnh sửa thành viên y tế'}</DialogTitle>
            <DialogDescription>Nhập đầy đủ thông tin thành viên</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label>Họ tên *</Label>
              <Input value={nhanVienForm.HoTen} onChange={(e) => setNhanVienForm({ ...nhanVienForm, HoTen: e.target.value })} />
            </div>
            <div>
              <Label>Chức danh</Label>
              <Input value={nhanVienForm.ChucDanh} onChange={(e) => setNhanVienForm({ ...nhanVienForm, ChucDanh: e.target.value })} />
            </div>
            <div>
              <Label>Chuyên môn</Label>
              <Input value={nhanVienForm.ChuyenMon} onChange={(e) => setNhanVienForm({ ...nhanVienForm, ChuyenMon: e.target.value })} />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input value={nhanVienForm.SoDienThoai} onChange={(e) => setNhanVienForm({ ...nhanVienForm, SoDienThoai: e.target.value })} />
            </div>
            <div>
              <Label>Trạng thái làm việc</Label>
              <Select value={nhanVienForm.TrangThaiLamViec} onValueChange={(v) => setNhanVienForm({ ...nhanVienForm, TrangThaiLamViec: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                  <SelectItem value="Tạm nghỉ">Tạm nghỉ</SelectItem>
                  <SelectItem value="Nghỉ việc">Nghỉ việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNhanVienDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveNhanVien}>Lưu thành viên</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
