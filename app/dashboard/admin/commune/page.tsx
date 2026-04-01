'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCallback, useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { donViHanhChinhApi, quanHuyenApi, xaPhuongApi } from '@/lib/api';

interface CommuneItem {
  id: number;
  name: string;
  districtId?: number | null;
  districtName?: string | null;
  dvhcCode?: string | null;
  dvhcName?: string | null;
  mayor?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  population: number;
  area?: number | null;
  isActive: boolean;
}

interface DistrictItem {
  id: number;
  name: string;
  dvhcCode?: string | null;
}

interface DvhcItem {
  code: string;
  name: string;
  level: number;
}

export default function CommunePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [communes, setCommunes] = useState<CommuneItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [dvhcs, setDvhcs] = useState<DvhcItem[]>([]);
  const [editingCommuneId, setEditingCommuneId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dvhcCode: '',
    districtId: '',
    mayor: '',
    phone: '',
    email: '',
    address: '',
    population: '',
    area: '',
    isActive: true,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const [communesRes, districtsRes, dvhcRes] = await Promise.all([
      xaPhuongApi.getList(),
      quanHuyenApi.getList(),
      donViHanhChinhApi.getList(),
    ]);

    if (communesRes?.success && Array.isArray(communesRes.data)) {
      setCommunes(communesRes.data as CommuneItem[]);
    } else {
      setErrorMessage(communesRes?.message || 'Không thể tải danh sách xã/phường');
    }

    if (districtsRes?.success && Array.isArray(districtsRes.data)) {
      const mapped = districtsRes.data.map((item: any) => ({
        id: item.id ?? item.MaQuanHuyen,
        name: item.name ?? item.TenQuanHuyen,
        dvhcCode: item.dvhcCode ?? item.MaDVHC ?? null,
      }));
      setDistricts(mapped);
    }

    if (dvhcRes?.success && Array.isArray(dvhcRes.data)) {
      const mapped = dvhcRes.data.map((item: any) => ({
        code: item.code ?? item.MaDVHC,
        name: item.name ?? item.TenDVHC,
        level: Number(item.level ?? item.Cap ?? 0),
      }));
      setDvhcs(mapped);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await loadData();
    };
    run();
    return () => {
      active = false;
    };
  }, [loadData]);

  const handleAddOrEdit = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setIsSaving(true);
    const payload = {
      name: formData.name.trim(),
      dvhcCode: formData.dvhcCode || null,
      districtId: formData.districtId ? Number(formData.districtId) : null,
      mayor: formData.mayor || null,
      phone: formData.phone || null,
      email: formData.email || null,
      address: formData.address || null,
      population: parseInt(formData.population, 10) || 0,
      area: formData.area ? Number(formData.area) : null,
      isActive: formData.isActive,
    };

    const result = editingCommuneId
      ? await xaPhuongApi.update(editingCommuneId, payload)
      : await xaPhuongApi.create(payload);

    if (result?.success) {
      await loadData();
      setFormData({
        name: '',
        dvhcCode: '',
        districtId: '',
        mayor: '',
        phone: '',
        email: '',
        address: '',
        population: '',
        area: '',
        isActive: true,
      });
      setDialogOpen(false);
      setEditingCommuneId(null);
    } else {
      setErrorMessage(result?.message || 'Không thể lưu thông tin xã/phường');
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa xã/phường này?')) {
      return;
    }

    const result = await xaPhuongApi.delete(id);
    if (result?.success) {
      await loadData();
    } else {
      setErrorMessage(result?.message || 'Không thể xóa xã/phường');
    }
  };

  const openEditDialog = (commune: CommuneItem) => {
    setFormData({
      name: commune.name,
      dvhcCode: commune.dvhcCode || '',
      districtId: commune.districtId ? String(commune.districtId) : '',
      mayor: commune.mayor || '',
      phone: commune.phone || '',
      email: commune.email || '',
      address: commune.address || '',
      population: commune.population?.toString() || '0',
      area: commune.area ? String(commune.area) : '',
      isActive: commune.isActive,
    });
    setEditingCommuneId(commune.id);
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setFormData({
      name: '',
      dvhcCode: '',
      districtId: '',
      mayor: '',
      phone: '',
      email: '',
      address: '',
      population: '',
      area: '',
      isActive: true,
    });
    setEditingCommuneId(null);
    setDialogOpen(true);
  };

  const filteredCommunes = communes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.dvhcCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.districtName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDistrictName = (commune: CommuneItem) => {
    if (commune.districtName) return commune.districtName;
    const match = districts.find((district) => district.id === commune.districtId);
    return match?.name || 'Chưa cập nhật';
  };

  const getDvhcName = (commune: CommuneItem) => {
    if (commune.dvhcName) return commune.dvhcName;
    const match = dvhcs.find((item) => item.code === commune.dvhcCode);
    return match?.name || 'Chưa cập nhật';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-lg bg-[var(--banner)] px-4 py-3">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-8 h-8" />
          Thông tin Xã Phường
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý thông tin xã/phường trong hệ thống
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          Đang tải dữ liệu xã/phường...
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Tổng xã/phường',
            value: communes.length,
            icon: MapPin,
            color: 'text-primary',
          },
          {
            label: 'Hoạt động',
            value: communes.filter((c) => c.isActive).length,
            icon: Users,
            color: 'text-status-success',
          },
          {
            label: 'Tổng dân số',
            value: communes.reduce((sum, c) => sum + (c.population || 0), 0).toLocaleString(),
            icon: AlertTriangle,
            color: 'text-blue-400',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-card border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm xã phường..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
          onClick={openNewDialog}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm xã phường
        </Button>
      </div>

      {/* Communes List */}
      <div className="space-y-2">
        {filteredCommunes.map((commune) => (
          <Card
            key={commune.id}
            className="bg-card border-border p-4 hover:border-primary/50 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground text-lg">
                    {commune.name}
                  </h4>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {commune.dvhcCode || 'N/A'}
                  </Badge>
                  <Badge
                    className={
                      commune.isActive
                        ? 'bg-status-success/20 text-status-success border-status-success/30'
                        : 'bg-status-warning/20 text-status-warning border-status-warning/30'
                    }
                  >
                    {commune.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Huyện/Quận</p>
                    <p className="text-foreground font-medium">{getDistrictName(commune)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Đơn vị hành chính</p>
                    <p className="text-foreground font-medium">{getDvhcName(commune)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Người đứng đầu</p>
                    <p className="text-foreground font-medium">{commune.mayor || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Dân số</p>
                    <p className="text-foreground font-medium">
                      {commune.population.toLocaleString()} người
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Diện tích</p>
                    <p className="text-foreground font-medium">
                      {commune.area ? `${commune.area} km²` : 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Điện thoại</p>
                    <p className="text-foreground font-medium">{commune.phone || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Email</p>
                    <p className="text-foreground font-medium text-xs">{commune.email || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground text-xs uppercase">Địa chỉ</p>
                  <p className="text-foreground text-sm">{commune.address || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-transparent"
                  onClick={() => openEditDialog(commune)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-status-danger bg-transparent"
                  onClick={() => handleDelete(commune.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCommuneId ? 'Chỉnh sửa thông tin xã phường' : 'Thêm xã phường mới'}
            </DialogTitle>
            <DialogDescription>
              {editingCommuneId
                ? 'Cập nhật thông tin xã phường'
                : 'Nhập thông tin xã phường mới vào hệ thống'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên xã phường *</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Xã Hòa Bình"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Mã đơn vị hành chính</Label>
              <Select
                value={formData.dvhcCode}
                onValueChange={(value) =>
                  setFormData({ ...formData, dvhcCode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mã DVHC" />
                </SelectTrigger>
                <SelectContent>
                  {dvhcs.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.name} ({item.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Huyện/Quận</Label>
              <Select
                value={formData.districtId}
                onValueChange={(value) =>
                  setFormData({ ...formData, districtId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn huyện/quận" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={String(district.id)}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mayor">Người đứng đầu</Label>
              <Input
                id="mayor"
                placeholder="Tên chủ tịch/trưởng phường"
                value={formData.mayor}
                onChange={(e) => setFormData({ ...formData, mayor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Điện thoại</Label>
              <Input
                id="phone"
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hoabinh@ubnd.vn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                placeholder="Địa chỉ trụ sở"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="population">Dân số</Label>
              <Input
                id="population"
                type="number"
                placeholder="8500"
                value={formData.population}
                onChange={(e) => setFormData({ ...formData, population: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Diện tích (km²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="45.5"
                step="0.1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>

            <div className="col-span-2 flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <Label htmlFor="status">Trạng thái hoạt động</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="status"
                  checked={formData.isActive}
                  onCheckedChange={(value) =>
                    setFormData({ ...formData, isActive: value })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {formData.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddOrEdit} disabled={isSaving}>
              <Plus className="w-4 h-4 mr-2" />
              {isSaving
                ? 'Đang lưu...'
                : editingCommuneId
                  ? 'Cập nhật'
                  : 'Thêm xã phường'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
