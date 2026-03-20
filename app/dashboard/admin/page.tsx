'use client';

import { useState, useCallback } from 'react';
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

// Mock users from database
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

const roleConfig = {
  ADMIN: { name: 'Quản trị viên', color: 'from-red-500 to-red-600', badge: 'bg-red-500/10 text-red-700' },
  LANHDAO: { name: 'Lãnh đạo', color: 'from-purple-500 to-purple-600', badge: 'bg-purple-500/10 text-purple-700' },
  CANBO: { name: 'Cán bộ', color: 'from-blue-500 to-blue-600', badge: 'bg-blue-500/10 text-blue-700' },
  CONGDAN: { name: 'Công dân', color: 'from-green-500 to-green-600', badge: 'bg-green-500/10 text-green-700' },
};

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  department: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'CANBO',
    department: '',
  });

  const filteredUsers = users.filter(u => {
    const matchSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAddUser = () => {
    if (formData.name && formData.email && formData.role) {
      const newUser: User = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: 'active',
        lastLogin: 'Chưa đăng nhập',
      };
      setUsers([...users, newUser]);
      setFormData({ name: '', email: '', role: 'CANBO', department: '' });
      setDialogOpen(false);
      console.log('Added new user:', newUser);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
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
            <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90" onClick={() => setDialogOpen(true)}>
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
          const roleInfo = roleConfig[user.role as keyof typeof roleConfig];
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
            <DialogTitle>Thêm người dùng mới</DialogTitle>
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
                  <SelectItem value="CANBO">Cán bộ chuyên môn</SelectItem>
                  <SelectItem value="CONGDAN">Công dân</SelectItem>
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
            <Button onClick={handleAddUser}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm người dùng
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
