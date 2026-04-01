'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Activity,
  TrendingUp,
  Eye,
  X,
} from 'lucide-react';
import { usersApi, vaiTroApi } from '@/lib/api';

const roleConfig = {
  ADMIN: { name: 'Quản trị viên', color: 'from-red-500 to-red-600', badge: 'bg-red-500/10 text-red-700' },
  LANHDAO: { name: 'Lãnh đạo', color: 'from-purple-500 to-purple-600', badge: 'bg-purple-500/10 text-purple-700' },
  CANBO: { name: 'Cán bộ', color: 'from-blue-500 to-blue-600', badge: 'bg-blue-500/10 text-blue-700' },
  CONGDAN: { name: 'Công dân', color: 'from-green-500 to-green-600', badge: 'bg-green-500/10 text-green-700' },
};

const DEFAULT_ROLE_ORDER = ['ADMIN', 'LANHDAO', 'CANBO', 'CONGDAN'];

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
}

interface RoleItem {
  id: number;
  name: string;
  code: string;
  permissions?: string[];
}

interface FormData {
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'CANBO',
    department: '',
    status: 'active',
  });

  const roleById = useMemo(() => {
    const map = new Map<number, RoleItem>();
    roles.forEach((role) => map.set(role.id, role));
    return map;
  }, [roles]);

  const roleByCode = useMemo(() => {
    const map = new Map<string, RoleItem>();
    roles.forEach((role) => map.set(role.code, role));
    return map;
  }, [roles]);

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

  const mapRoleCodeFromId = (roleId?: number) => {
    if (roleId && roleById.has(roleId)) {
      return roleById.get(roleId)?.code || 'CONGDAN';
    }
    return 'CONGDAN';
  };

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [rolesRes, usersRes] = await Promise.all([
        vaiTroApi.getList(),
        usersApi.getList(),
      ]);

      if (rolesRes?.success && Array.isArray(rolesRes.data)) {
        const mappedRoles = rolesRes.data.map((role: any) => ({
          id: role.id ?? role.MaVaiTro,
          name: role.name ?? role.TenVaiTro,
          code: role.code ?? role.MaCode,
          permissions: role.permissions ?? role.DanhSachQuyen ?? [],
        })) as RoleItem[];
        mappedRoles.sort((a, b) => {
          const aIndex = DEFAULT_ROLE_ORDER.indexOf(a.code);
          const bIndex = DEFAULT_ROLE_ORDER.indexOf(b.code);
          if (aIndex === -1 && bIndex === -1) return a.code.localeCompare(b.code);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
        setRoles(mappedRoles);
      }

      if (usersRes?.success && Array.isArray(usersRes.data)) {
        const mappedUsers = usersRes.data.map((user: any) => ({
          id: user.id,
          username: user.username,
          name: user.fullName || user.username,
          email: user.email || '',
          role: mapRoleCodeFromId(user.roleId),
          department: user.department || '-',
          status: user.isActive ? 'active' : 'inactive',
          lastLogin: user.lastLogin || 'Chưa cập nhật',
        })) as User[];
        setUsers(mappedUsers);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAddUser = () => {
    setEditingUserId(null);
    setFormData({ name: '', email: '', role: 'CANBO', department: '', status: 'active' });
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
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

    try {
      const roleId = roleByCode.get(formData.role)?.id ?? 4;
      const username = buildUsername(formData.name, formData.email);

      if (editingUserId) {
        await usersApi.update(editingUserId, {
          username,
          fullName: formData.name,
          email: formData.email || null,
          roleId,
          isActive: formData.status === 'active',
          department: formData.department || null,
        });
      } else {
        await usersApi.create({
          username,
          fullName: formData.name,
          email: formData.email || null,
          roleId,
          isActive: formData.status === 'active',
          department: formData.department || null,
        });
      }

      await loadData();
      setDialogOpen(false);
      setEditingUserId(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể lưu người dùng');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await usersApi.delete(id);
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể xóa người dùng');
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const stats = [
    {
      label: 'Tổng người dùng',
      value: users.length,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Hoạt động',
      value: users.filter(u => u.status === 'active').length,
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Quản trị viên',
      value: users.filter(u => u.role === 'ADMIN').length,
      icon: Shield,
      color: 'text-red-600',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Tăng trưởng',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
              </div>
              <p className="text-white/90">Quản lý tài khoản người dùng và phân quyền</p>
            </div>
            <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90" onClick={handleAddUser}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm người dùng
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Lọc vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="ADMIN">Quản trị viên</SelectItem>
              <SelectItem value="LANHDAO">Lãnh đạo</SelectItem>
              <SelectItem value="CANBO">Cán bộ</SelectItem>
              <SelectItem value="CONGDAN">Công dân</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map(user => {
          const roleInfo = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.CONGDAN;
          return (
            <Card key={user.id} className="border-0 shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${roleInfo.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                  {user.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold truncate">{user.name}</h4>
                    <Badge className={roleInfo.badge}>{roleInfo.name}</Badge>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{user.email}</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-muted-foreground">
                    <span>📁 {user.department}</span>
                    <span>⏱️ {user.lastLogin}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewUser(user)}
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Chỉnh sửa"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
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
                  {(roles.length ? roles : DEFAULT_ROLE_ORDER.map((code) => ({ code } as RoleItem))).map((roleItem) => (
                    <SelectItem key={roleItem.code} value={roleItem.code}>
                      {roleItem.name || roleConfig[roleItem.code as keyof typeof roleConfig]?.name || roleItem.code}
                    </SelectItem>
                  ))}
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

          {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveUser} disabled={isSaving}>
              <Plus className="w-4 h-4 mr-2" />
              {isSaving ? 'Đang lưu...' : 'Lưu người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 bg-gradient-to-br ${roleConfig[selectedUser.role as keyof typeof roleConfig].color} rounded-lg flex items-center justify-center text-white font-bold text-3xl`}>
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
                  <div className="mt-1">
                    <Badge className={roleConfig[selectedUser.role as keyof typeof roleConfig].badge}>
                      {roleConfig[selectedUser.role as keyof typeof roleConfig].name}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phòng ban</p>
                  <p className="font-semibold">{selectedUser.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <Badge variant={selectedUser.status === 'active' ? 'default' : 'secondary'} className="mt-1">
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
