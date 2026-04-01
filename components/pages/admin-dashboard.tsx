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
  Eye,
  Shield,
  Users,
  Settings,
  Key,
  Database,
  AlertTriangle,
  X,
} from 'lucide-react';
import { usersApi, vaiTroApi } from '@/lib/api';

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn Admin',
    email: 'admin@ubnd.vn',
    role: 'ADMIN',
    department: 'Hệ thống',
    status: 'active',
    lastLogin: '2024-01-17 10:30',
  },
  {
    id: 2,
    name: 'Trần Thị Lãnh Đạo',
    email: 'leader@ubnd.vn',
    role: 'LANHDAO',
    department: 'Chủ tịch UBND',
    status: 'active',
    lastLogin: '2024-01-17 09:15',
  },
  {
    id: 3,
    name: 'Lê Văn Cán Bộ 1',
    email: 'officer1@ubnd.vn',
    role: 'CANBO',
    department: 'Địa chính - Xây dựng',
    status: 'active',
    lastLogin: '2024-01-17 08:45',
  },
  {
    id: 4,
    name: 'Phạm Thị Cán Bộ 2',
    email: 'officer2@ubnd.vn',
    role: 'CANBO',
    department: 'Tư pháp - Hộ tịch',
    status: 'inactive',
    lastLogin: '2024-01-15 14:20',
  },
  {
    id: 5,
    name: 'Võ Công Dân 1',
    email: 'citizen1@ubnd.vn',
    role: 'CONGDAN',
    department: '-',
    status: 'active',
    lastLogin: '2024-01-17 07:30',
  },
];

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState<Array<{ id: number; code: string; name: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'CANBO',
    department: '',
    status: 'active',
  });

  const buildUsername = (name: string, email: string) => {
    if (email.includes('@')) {
      return email.split('@')[0];
    }
    const normalized = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '');
    return normalized || `user${Date.now()}`;
  };

  const loadData = useCallback(async () => {
    setErrorMessage(null);
    try {
      const [rolesRes, usersRes] = await Promise.all([
        vaiTroApi.getList(),
        usersApi.getList(),
      ]);

      const roleItems = rolesRes?.success && Array.isArray(rolesRes.data)
        ? rolesRes.data.map((role: any) => ({
            id: role.id ?? role.MaVaiTro,
            code: role.code ?? role.MaCode,
            name: role.name ?? role.TenVaiTro,
          }))
        : [];

      if (roleItems.length) {
        setRoles(roleItems);
      }

      if (usersRes?.success && Array.isArray(usersRes.data)) {
        const roleMap = new Map(roleItems.map((role) => [role.id, role.code]));
        const mapped = usersRes.data.map((user: any) => ({
          id: user.id,
          name: user.fullName || user.username,
          email: user.email || '',
          role: roleMap.get(user.roleId) || 'CONGDAN',
          department: user.department || '-',
          status: user.isActive ? 'active' : 'inactive',
          lastLogin: user.lastLogin || 'Chưa cập nhật',
        }));
        setUsers(mapped);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu');
    }
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

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setFormData({ name: '', email: '', role: 'CANBO', department: '', status: 'active' });
    setDialogOpen(true);
  };

  const handleEditUser = (user: (typeof mockUsers)[0]) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department === '-' ? '' : user.department,
      status: user.status,
    });
    setDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!formData.name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    const roleId = roles.find((role) => role.code === formData.role)?.id ?? 4;
    const username = buildUsername(formData.name, formData.email);

    const result = editingUserId
      ? await usersApi.update(editingUserId, {
          username,
          fullName: formData.name,
          email: formData.email || null,
          roleId,
          isActive: formData.status === 'active',
          department: formData.department || null,
        })
      : await usersApi.create({
          username,
          fullName: formData.name,
          email: formData.email || null,
          roleId,
          isActive: formData.status === 'active',
          department: formData.department || null,
        });

    if (result?.success) {
      setDialogOpen(false);
      setEditingUserId(null);
      await loadData();
    } else {
      setErrorMessage(result?.message || 'Không thể lưu người dùng');
    }
    setIsSaving(false);
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    const result = await usersApi.delete(id);
    if (result?.success) {
      await loadData();
    } else {
      setErrorMessage(result?.message || 'Không thể xóa người dùng');
    }
  };

  const handleViewUser = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeUsers = users.filter((u) => u.status === 'active').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Page Header with Stats */}
      <div className="rounded-lg bg-gradient-to-r from-red-900 via-purple-950 to-blue-950 border border-white/20 px-4 py-5 shadow-lg sm:px-6 sm:py-8">
        <h1 className="text-3xl font-bold text-white">
          Quản trị hệ thống
        </h1>
        <p className="text-white/80 mt-1 mb-6">
          Quản lý người dùng
        </p>
        
        {/* Stats inside header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Tổng người dùng', value: users.length, icon: Users, color: 'text-white' },
            { label: 'Hoạt động', value: activeUsers, icon: Shield, color: 'text-green-300' },
            { label: 'Không hoạt động', value: inactiveUsers, icon: AlertTriangle, color: 'text-yellow-300' },
            { label: 'Ngày hôm nay', value: 24, icon: Database, color: 'text-blue-300' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/70 uppercase">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-40`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto border-b border-border pb-1">
        {[
          { id: 'users', label: 'Quản lý người dùng', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`pb-3 px-4 font-medium text-sm transition-colors flex items-center gap-2 border-b-2 border-primary text-primary`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto" onClick={handleOpenAddUser}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="bg-card border-border p-4 hover:border-primary/50 transition cursor-pointer"
              onClick={() => handleViewUser(user)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {user.name}
                    </h4>
                    <Badge
                      className={
                        user.role === 'ADMIN'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : user.role === 'LANHDAO'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : user.role === 'CANBO'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }
                    >
                      {user.role === 'ADMIN'
                        ? 'Quản trị'
                        : user.role === 'LANHDAO'
                          ? 'Lãnh đạo'
                          : user.role === 'CANBO'
                            ? 'Cán bộ'
                            : 'Công dân'}
                    </Badge>
                    <Badge
                      className={
                        user.status === 'active'
                          ? 'bg-status-success/20 text-status-success border-status-success/30'
                          : 'bg-status-warning/20 text-status-warning border-status-warning/30'
                      }
                    >
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.email} • {user.department}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Truy cập cuối: {user.lastLogin}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-transparent"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleViewUser(user);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-transparent"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEditUser(user);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-status-danger bg-transparent"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteUser(user.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUserId ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}</DialogTitle>
            <DialogDescription>
              Nhập thông tin người dùng từ cơ sở dữ liệu
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                placeholder="Nhập họ tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@ubnd.vn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò *</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                  <SelectItem value="LANHDAO">Lãnh đạo</SelectItem>
                  <SelectItem value="CANBO">Cán bộ</SelectItem>
                  <SelectItem value="CONGDAN">Công dân</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban/Lĩnh vực</Label>
              <Input
                id="department"
                placeholder="Ví dụ: Tư pháp - Hộ tịch"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveUser} disabled={isSaving}>
              <Plus className="w-4 h-4 mr-2" />
              {isSaving ? 'Đang lưu...' : editingUserId ? 'Cập nhật' : 'Thêm người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <div
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-white font-bold text-3xl ${
                    selectedUser.role === 'ADMIN'
                      ? 'bg-red-500'
                      : selectedUser.role === 'LANHDAO'
                        ? 'bg-purple-500'
                        : selectedUser.role === 'CANBO'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                  }`}
                >
                  {selectedUser.name.charAt(0)}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Họ và tên</p>
                  <p className="font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vai trò</p>
                  <p className="font-semibold">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phòng ban</p>
                  <p className="font-semibold">{selectedUser.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <Badge
                    className={
                      selectedUser.status === 'active'
                        ? 'bg-status-success/20 text-status-success border-status-success/30'
                        : 'bg-status-warning/20 text-status-warning border-status-warning/30'
                    }
                  >
                    {selectedUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Truy cập cuối</p>
                  <p className="text-sm">{selectedUser.lastLogin}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
