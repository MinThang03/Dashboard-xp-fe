'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { formatDate, formatDateTime } from '@/lib/mock-data';
import { hoTichApi } from '@/lib/api';
import { VisualStatsPanel } from '@/components/charts/visual-stats-panel';
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  User,
} from 'lucide-react';

type HoTichRecord = {
  id: number;
  so_ho_tich: string;
  ho_ten_ca_nhan: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  dia_chi_thuong_tru: string;
  loai_su_kien_ho_tich: string;
  ngay_dang_ky: string;
  noi_dang_ky: string;
  ghi_chu: string;
  trang_thai: boolean;
  created_at?: string;
};

const DEFAULT_FORM: Omit<HoTichRecord, 'id'> = {
  so_ho_tich: '',
  ho_ten_ca_nhan: '',
  ngay_sinh: '',
  gioi_tinh: 'Nam',
  so_cccd: '',
  dia_chi_thuong_tru: '',
  loai_su_kien_ho_tich: 'Khai sinh',
  ngay_dang_ky: new Date().toISOString().split('T')[0],
  noi_dang_ky: '',
  ghi_chu: '',
  trang_thai: true,
};

export default function HoTichPage() {
  const [records, setRecords] = useState<HoTichRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HoTichRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<HoTichRecord, 'id'>>(DEFAULT_FORM);

  const toSearchable = (value: unknown) => String(value ?? '').toLowerCase();
  const toIsoDate = (value: unknown) => String(value ?? '').split('T')[0];

  const mapFromApi = (item: any): HoTichRecord => ({
    id: Number(item.id),
    so_ho_tich: String(item.so_ho_tich ?? ''),
    ho_ten_ca_nhan: String(item.ho_ten_ca_nhan ?? item.ten_chu_ho ?? ''),
    ngay_sinh: toIsoDate(item.ngay_sinh ?? item.ngay_sinh_chu_ho),
    gioi_tinh: String(item.gioi_tinh ?? item.gioi_tinh_chu_ho ?? 'Nam'),
    so_cccd: String(item.so_cccd ?? ''),
    dia_chi_thuong_tru: String(item.dia_chi_thuong_tru ?? item.dia_chi_ho_tich ?? ''),
    loai_su_kien_ho_tich: String(item.loai_su_kien_ho_tich ?? 'Khai sinh'),
    ngay_dang_ky: toIsoDate(item.ngay_dang_ky ?? item.ngay_lap_ho_tich),
    noi_dang_ky: String(item.noi_dang_ky ?? ''),
    ghi_chu: String(item.ghi_chu ?? ''),
    trang_thai: item.trang_thai === true || item.trang_thai === 1,
    created_at: item.created_at,
  });

  const loadData = async () => {
    const result = await hoTichApi.getList({ page: 1, limit: 500 });
    if (result.success && Array.isArray(result.data)) {
      setRecords(result.data.map(mapFromApi));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(
    () =>
      records.filter((item) => {
        const search = toSearchable(searchQuery);
        return (
          toSearchable(item.so_ho_tich).includes(search) ||
          toSearchable(item.ho_ten_ca_nhan).includes(search) ||
          toSearchable(item.so_cccd).includes(search) ||
          toSearchable(item.dia_chi_thuong_tru).includes(search)
        );
      }),
    [records, searchQuery],
  );

  const stats = useMemo(() => {
    const active = records.filter((r) => r.trang_thai).length;
    const khaiSinh = records.filter((r) => r.loai_su_kien_ho_tich === 'Khai sinh').length;
    const ketHon = records.filter((r) => r.loai_su_kien_ho_tich === 'Kết hôn').length;
    return {
      total: records.length,
      active,
      khaiSinh,
      ketHon,
    };
  }, [records]);

  const handleView = (item: HoTichRecord) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: HoTichRecord) => {
    setSelectedItem(item);
    setFormData({
      so_ho_tich: item.so_ho_tich,
      ho_ten_ca_nhan: item.ho_ten_ca_nhan,
      ngay_sinh: item.ngay_sinh,
      gioi_tinh: item.gioi_tinh,
      so_cccd: item.so_cccd,
      dia_chi_thuong_tru: item.dia_chi_thuong_tru,
      loai_su_kien_ho_tich: item.loai_su_kien_ho_tich,
      ngay_dang_ky: item.ngay_dang_ky,
      noi_dang_ky: item.noi_dang_ky,
      ghi_chu: item.ghi_chu,
      trang_thai: item.trang_thai,
    });
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({ ...DEFAULT_FORM });
    setIsAddOpen(true);
  };

  const handleSave = async () => {
    const soHoTich = String(formData.so_ho_tich || '').trim();
    const hoTen = String(formData.ho_ten_ca_nhan || '').trim();
    const diaChi = String(formData.dia_chi_thuong_tru || '').trim();

    if (!soHoTich) {
      alert('Vui lòng nhập số hộ tịch');
      return;
    }
    if (!hoTen) {
      alert('Vui lòng nhập họ tên cá nhân');
      return;
    }
    if (!diaChi) {
      alert('Vui lòng nhập địa chỉ thường trú');
      return;
    }

    const payload = {
      so_ho_tich: soHoTich,
      ho_ten_ca_nhan: hoTen,
      ngay_sinh: formData.ngay_sinh || null,
      gioi_tinh: formData.gioi_tinh || null,
      so_cccd: String(formData.so_cccd || '').trim() || null,
      dia_chi_thuong_tru: diaChi,
      loai_su_kien_ho_tich: formData.loai_su_kien_ho_tich || null,
      ngay_dang_ky: formData.ngay_dang_ky || null,
      noi_dang_ky: String(formData.noi_dang_ky || '').trim() || null,
      ghi_chu: String(formData.ghi_chu || '').trim() || null,
      trang_thai: Boolean(formData.trang_thai),
    };

    try {
      setIsSaving(true);
      const result = selectedItem
        ? await hoTichApi.update(selectedItem.id, payload)
        : await hoTichApi.create(payload);

      if (!result?.success) {
        throw new Error(result?.message || 'Không thể lưu hồ sơ hộ tịch');
      }

      await loadData();
      setIsEditOpen(false);
      setIsAddOpen(false);
      setSelectedItem(null);
      setFormData({ ...DEFAULT_FORM });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Lưu hồ sơ hộ tịch thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: HoTichRecord) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa hồ sơ hộ tịch ${item.so_ho_tich}?`)) {
      return;
    }

    try {
      const result = await hoTichApi.delete(item.id);
      if (!result?.success) {
        throw new Error(result?.message || 'Không thể xóa hồ sơ hộ tịch');
      }
      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Xóa hồ sơ hộ tịch thất bại');
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Hộ tịch cá nhân</h1>
              </div>
              <p className="text-white/90">Hồ sơ hộ tịch theo từng cá nhân</p>
            </div>
            <Button onClick={handleAdd} className="bg-white text-blue-600 hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hồ sơ
            </Button>
          </div>
        </div>
      </div>

      <VisualStatsPanel
        title="Biểu đồ theo dõi hồ sơ hộ tịch"
        subtitle="Phân bổ hồ sơ theo trạng thái và nhóm thủ tục"
        items={[
          { label: 'Tổng hồ sơ', value: stats.total, color: '#3b82f6' },
          { label: 'Đang hoạt động', value: stats.active, color: '#22c55e' },
          { label: 'Khai sinh', value: stats.khaiSinh, color: '#8b5cf6' },
          { label: 'Kết hôn', value: stats.ketHon, color: '#f59e0b' },
        ]}
      />

      <Card className="p-4 border-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo số hộ tịch, họ tên, CCCD, địa chỉ..."
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

      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Số hộ tịch</th>
                <th className="text-left p-4 font-semibold">Họ tên cá nhân</th>
                <th className="text-left p-4 font-semibold">CCCD</th>
                <th className="text-left p-4 font-semibold">Sự kiện hộ tịch</th>
                <th className="text-left p-4 font-semibold">Ngày đăng ký</th>
                <th className="text-left p-4 font-semibold">Địa chỉ</th>
                <th className="text-left p-4 font-semibold">Trạng thái</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id || index} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-primary">{item.so_ho_tich}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {item.ho_ten_ca_nhan}
                    </div>
                  </td>
                  <td className="p-4">{item.so_cccd || '-'}</td>
                  <td className="p-4">{item.loai_su_kien_ho_tich || '-'}</td>
                  <td className="p-4">{formatDate(item.ngay_dang_ky)}</td>
                  <td className="p-4 max-w-xs truncate">{item.dia_chi_thuong_tru}</td>
                  <td className="p-4">
                    <Badge className={item.trang_thai ? 'bg-green-500/10 text-green-700 border-0' : 'bg-red-500/10 text-red-700 border-0'}>
                      {item.trang_thai ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
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

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ hộ tịch</DialogTitle>
            <DialogDescription>{selectedItem?.so_ho_tich}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <Label className="text-muted-foreground">Họ tên cá nhân</Label>
                <p className="font-medium">{selectedItem.ho_ten_ca_nhan}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CCCD</Label>
                <p className="font-medium">{selectedItem.so_cccd || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Ngày sinh</Label>
                <p className="font-medium">{formatDate(selectedItem.ngay_sinh)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Giới tính</Label>
                <p className="font-medium">{selectedItem.gioi_tinh || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Sự kiện hộ tịch</Label>
                <p className="font-medium">{selectedItem.loai_su_kien_ho_tich || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Ngày đăng ký</Label>
                <p className="font-medium">{formatDate(selectedItem.ngay_dang_ky)}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Địa chỉ thường trú</Label>
                <p className="font-medium">{selectedItem.dia_chi_thuong_tru}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Nơi đăng ký</Label>
                <p className="font-medium">{selectedItem.noi_dang_ky || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Trạng thái</Label>
                <div>
                  <Badge className={selectedItem.trang_thai ? 'bg-green-500/10 text-green-700 border-0' : 'bg-red-500/10 text-red-700 border-0'}>
                    {selectedItem.trang_thai ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
              </div>
              {selectedItem.ghi_chu && (
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Ghi chú</Label>
                  <p className="font-medium">{selectedItem.ghi_chu}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Ngày tạo</Label>
                <p className="font-medium">{formatDateTime(selectedItem.created_at)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen || isAddOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditOpen(false);
          setIsAddOpen(false);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Chỉnh sửa hồ sơ hộ tịch' : 'Thêm hồ sơ hộ tịch'}</DialogTitle>
            <DialogDescription>
              Hộ tịch là hồ sơ của một cá nhân, không có chủ hộ hoặc danh sách thành viên.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Label>Số hộ tịch *</Label>
              <Input
                value={formData.so_ho_tich}
                onChange={(e) => setFormData({ ...formData, so_ho_tich: e.target.value })}
              />
            </div>
            <div>
              <Label>Họ tên cá nhân *</Label>
              <Input
                value={formData.ho_ten_ca_nhan}
                onChange={(e) => setFormData({ ...formData, ho_ten_ca_nhan: e.target.value })}
              />
            </div>
            <div>
              <Label>Ngày sinh</Label>
              <Input
                type="date"
                value={formData.ngay_sinh}
                onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
              />
            </div>
            <div>
              <Label>Giới tính</Label>
              <Select value={formData.gioi_tinh} onValueChange={(value) => setFormData({ ...formData, gioi_tinh: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>CCCD</Label>
              <Input
                value={formData.so_cccd}
                onChange={(e) => setFormData({ ...formData, so_cccd: e.target.value })}
              />
            </div>
            <div>
              <Label>Sự kiện hộ tịch</Label>
              <Select
                value={formData.loai_su_kien_ho_tich}
                onValueChange={(value) => setFormData({ ...formData, loai_su_kien_ho_tich: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Khai sinh">Khai sinh</SelectItem>
                  <SelectItem value="Kết hôn">Kết hôn</SelectItem>
                  <SelectItem value="Khai tử">Khai tử</SelectItem>
                  <SelectItem value="Nhận con nuôi">Nhận con nuôi</SelectItem>
                  <SelectItem value="Thay đổi hộ tịch">Thay đổi hộ tịch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Địa chỉ thường trú *</Label>
              <Input
                value={formData.dia_chi_thuong_tru}
                onChange={(e) => setFormData({ ...formData, dia_chi_thuong_tru: e.target.value })}
              />
            </div>
            <div>
              <Label>Ngày đăng ký</Label>
              <Input
                type="date"
                value={formData.ngay_dang_ky}
                onChange={(e) => setFormData({ ...formData, ngay_dang_ky: e.target.value })}
              />
            </div>
            <div>
              <Label>Nơi đăng ký</Label>
              <Input
                value={formData.noi_dang_ky}
                onChange={(e) => setFormData({ ...formData, noi_dang_ky: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Ghi chú</Label>
              <Textarea
                rows={3}
                value={formData.ghi_chu}
                onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
              />
            </div>
            <div>
              <Label>Trạng thái</Label>
              <Select
                value={formData.trang_thai ? '1' : '0'}
                onValueChange={(value) => setFormData({ ...formData, trang_thai: value === '1' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hoạt động</SelectItem>
                  <SelectItem value="0">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setIsAddOpen(false); }}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : selectedItem ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
