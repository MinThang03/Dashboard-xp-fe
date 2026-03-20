'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Users,
  AlertTriangle,
} from 'lucide-react';

// Mock data
const mockCommuneInfo = [
  {
    id: 1,
    name: 'Xã Hòa Bình',
    code: 'XA001',
    district: 'Huyện A',
    province: 'Tỉnh B',
    mayor: 'Trần Văn C',
    phone: '0901234567',
    email: 'hoabinh@ubnd.vn',
    address: 'Trung tâm Xã Hòa Bình',
    population: 8500,
    area: 45.5,
    status: 'active',
  },
  {
    id: 2,
    name: 'Phường Thống Nhất',
    code: 'PW002',
    district: 'Quận 5',
    province: 'TP.HCM',
    mayor: 'Lê Thị D',
    phone: '0912345678',
    email: 'thongnhat@ubnd.vn',
    address: 'Đường Nguyễn Huệ, Phường Thống Nhất',
    population: 12000,
    area: 3.2,
    status: 'active',
  },
];

export default function CommunePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [communes, setCommunes] = useState(mockCommuneInfo);
  const [editingCommuneId, setEditingCommuneId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    district: '',
    province: '',
    mayor: '',
    phone: '',
    email: '',
    address: '',
    population: '',
    area: '',
  });

  const handleAddOrEdit = () => {
    if (formData.name && formData.code) {
      if (editingCommuneId) {
        // Edit existing
        setCommunes(
          communes.map((c) =>
            c.id === editingCommuneId
              ? {
                  ...c,
                  ...formData,
                  population: parseInt(formData.population) || 0,
                  area: parseFloat(formData.area) || 0,
                }
              : c
          )
        );
        console.log('Updated commune:', editingCommuneId);
      } else {
        // Add new
        const newCommune = {
          id: communes.length + 1,
          ...formData,
          population: parseInt(formData.population) || 0,
          area: parseFloat(formData.area) || 0,
          status: 'active' as const,
        };
        setCommunes([...communes, newCommune]);
        console.log('Added new commune:', newCommune);
      }
      setFormData({
        name: '',
        code: '',
        district: '',
        province: '',
        mayor: '',
        phone: '',
        email: '',
        address: '',
        population: '',
        area: '',
      });
      setDialogOpen(false);
      setEditingCommuneId(null);
    }
  };

  const handleDelete = (id: number) => {
    setCommunes(communes.filter((c) => c.id !== id));
    console.log('Deleted commune:', id);
  };

  const openEditDialog = (commune: typeof communes[0]) => {
    setFormData({
      name: commune.name,
      code: commune.code,
      district: commune.district,
      province: commune.province,
      mayor: commune.mayor,
      phone: commune.phone,
      email: commune.email,
      address: commune.address,
      population: commune.population.toString(),
      area: commune.area.toString(),
    });
    setEditingCommuneId(commune.id);
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setFormData({
      name: '',
      code: '',
      district: '',
      province: '',
      mayor: '',
      phone: '',
      email: '',
      address: '',
      population: '',
      area: '',
    });
    setEditingCommuneId(null);
    setDialogOpen(true);
  };

  const filteredCommunes = communes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value: communes.filter((c) => c.status === 'active').length,
            icon: Users,
            color: 'text-status-success',
          },
          {
            label: 'Tổng dân số',
            value: communes.reduce((sum, c) => sum + c.population, 0).toLocaleString(),
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
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm xã phường..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                    {commune.code}
                  </Badge>
                  <Badge className="bg-status-success/20 text-status-success border-status-success/30">
                    Hoạt động
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Huyện/Quận</p>
                    <p className="text-foreground font-medium">{commune.district}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Tỉnh/Thành phố</p>
                    <p className="text-foreground font-medium">{commune.province}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Người đứng đầu</p>
                    <p className="text-foreground font-medium">{commune.mayor}</p>
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
                    <p className="text-foreground font-medium">{commune.area} km²</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Điện thoại</p>
                    <p className="text-foreground font-medium">{commune.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase">Email</p>
                    <p className="text-foreground font-medium text-xs">{commune.email}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground text-xs uppercase">Địa chỉ</p>
                  <p className="text-foreground text-sm">{commune.address}</p>
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
              <Label htmlFor="code">Mã xã phường *</Label>
              <Input
                id="code"
                placeholder="Ví dụ: XA001"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Huyện/Quận *</Label>
              <Input
                id="district"
                placeholder="Ví dụ: Huyện A"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Tỉnh/Thành phố *</Label>
              <Input
                id="province"
                placeholder="Ví dụ: Tỉnh B"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              />
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddOrEdit}>
              <Plus className="w-4 h-4 mr-2" />
              {editingCommuneId ? 'Cập nhật' : 'Thêm xã phường'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
