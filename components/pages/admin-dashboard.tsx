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
import { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Users,
  Settings,
  Key,
  Database,
  AlertTriangle,
  X,
} from 'lucide-react';

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn Admin',
    email: 'admin@ubnd.vn',
    role: 'admin',
    department: 'Hệ thống',
    status: 'active',
    lastLogin: '2024-01-17 10:30',
  },
  {
    id: 2,
    name: 'Trần Thị Lãnh Đạo',
    email: 'leader@ubnd.vn',
    role: 'leader',
    department: 'Chủ tịch UBND',
    status: 'active',
    lastLogin: '2024-01-17 09:15',
  },
  {
    id: 3,
    name: 'Lê Văn Cán Bộ 1',
    email: 'officer1@ubnd.vn',
    role: 'officer',
    department: 'Địa chính - Xây dựng',
    status: 'active',
    lastLogin: '2024-01-17 08:45',
  },
  {
    id: 4,
    name: 'Phạm Thị Cán Bộ 2',
    email: 'officer2@ubnd.vn',
    role: 'officer',
    department: 'Tư pháp - Hộ tịch',
    status: 'inactive',
    lastLogin: '2024-01-15 14:20',
  },
  {
    id: 5,
    name: 'Võ Công Dân 1',
    email: 'citizen1@ubnd.vn',
    role: 'citizen',
    department: '-',
    status: 'active',
    lastLogin: '2024-01-17 07:30',
  },
];

const rolePermissions: Record<string, string[]> = {
  admin: [
    'Quản lý người dùng',
    'Cấu hình hệ thống',
    'Xem báo cáo',
    'Quản lý quyền',
    'Quản lý ngân sách',
    'Xem lịch sử',
  ],
  leader: [
    'Xem bảng điều khiển',
    'Phê duyệt hồ sơ',
    'Xem báo cáo',
    'Gửi thông báo',
    'Quản lý cảnh báo',
  ],
  officer: [
    'Xử lý hồ sơ',
    'Upload tài liệu',
    'Xem báo cáo cá nhân',
    'Gửi phản ánh',
  ],
  citizen: [
    'Nộp hồ sơ',
    'Tra cứu hồ sơ',
    'Đánh giá dịch vụ',
    'Gửi phản ánh',
  ],
};

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState(mockUsers);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'officer',
    department: '',
  });

  const handleAddUser = () => {
    if (formData.name && formData.email) {
      const newUser = {
        id: users.length + 1,
        ...formData,
        status: 'active',
        lastLogin: 'Chưa đăng nhập',
      };
      setUsers([...users, newUser as typeof mockUsers[0]]);
      setFormData({ name: '', email: '', role: 'officer', department: '' });
      setDialogOpen(false);
      console.log('Added new user:', newUser);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header with Stats */}
      <div className="rounded-lg bg-gradient-to-r from-red-900 via-purple-950 to-blue-950 px-6 py-8 border border-white/20 shadow-lg">
        <h1 className="text-3xl font-bold text-white">
          Quản trị hệ thống
        </h1>
        <p className="text-white/80 mt-1 mb-6">
          Quản lý người dùng
        </p>
        
        {/* Stats inside header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Tổng người dùng', value: mockUsers.length, icon: Users, color: 'text-white' },
            { label: 'Hoạt động', value: mockUsers.filter((u) => u.status === 'active').length, icon: Shield, color: 'text-green-300' },
            { label: 'Không hoạt động', value: mockUsers.filter((u) => u.status === 'inactive').length, icon: AlertTriangle, color: 'text-yellow-300' },
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

      {/* Tabs */}
      <div className="flex gap-3 border-b border-border">
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
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="bg-card border-border p-4 hover:border-primary/50 transition cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {user.name}
                    </h4>
                    <Badge
                      className={
                        user.role === 'admin'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : user.role === 'leader'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : user.role === 'officer'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }
                    >
                      {user.role === 'admin'
                        ? 'Quản trị'
                        : user.role === 'leader'
                          ? 'Lãnh đạo'
                          : user.role === 'officer'
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
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-status-danger bg-transparent"
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
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="leader">Lãnh đạo</SelectItem>
                  <SelectItem value="officer">Cán bộ</SelectItem>
                  <SelectItem value="citizen">Công dân</SelectItem>
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
    </div>
  );
}
