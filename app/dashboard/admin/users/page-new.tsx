'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Shield,
  Download,
} from 'lucide-react';

const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'leader@ubnd.vn',
    phone: '0912345678',
    role: 'leader',
    status: 'active',
    lastLogin: '2024-01-20 14:30',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'officer1@ubnd.vn',
    phone: '0912345679',
    role: 'officer',
    status: 'active',
    lastLogin: '2024-01-20 10:15',
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    email: 'officer2@ubnd.vn',
    phone: '0912345680',
    role: 'officer',
    status: 'active',
    lastLogin: '2024-01-19 16:45',
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    email: 'citizen1@ubnd.vn',
    phone: '0912345681',
    role: 'citizen',
    status: 'active',
    lastLogin: '2024-01-20 09:20',
  },
  {
    id: 5,
    name: 'Hoàng Văn Em',
    email: 'officer3@ubnd.vn',
    phone: '0912345682',
    role: 'officer',
    status: 'inactive',
    lastLogin: '2024-01-15 11:00',
  },
];

const roleLabels: Record<string, string> = {
  admin: 'Quản trị viên',
  leader: 'Lãnh đạo',
  officer: 'Cán bộ',
  citizen: 'Công dân',
};

const roleColors: Record<string, string> = {
  admin: 'bg-primary/20 text-primary border-primary/30',
  leader: 'bg-secondary/20 text-secondary border-secondary/30',
  officer: 'bg-accent/20 text-accent border-accent/30',
  citizen: 'bg-status-success/20 text-status-success border-status-success/30',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === 'active').length,
    leaders: mockUsers.filter((u) => u.role === 'leader').length,
    officers: mockUsers.filter((u) => u.role === 'officer').length,
    citizens: mockUsers.filter((u) => u.role === 'citizen').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý Người dùng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất danh sách
          </Button>
          <Button className="gap-2 bg-primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <p className="text-sm text-muted-foreground">Tổng người dùng</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
          <p className="text-sm text-muted-foreground">Đang hoạt động</p>
          <p className="text-2xl font-bold mt-1">{stats.active}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <p className="text-sm text-muted-foreground">Lãnh đạo</p>
          <p className="text-2xl font-bold mt-1">{stats.leaders}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
          <p className="text-sm text-muted-foreground">Cán bộ</p>
          <p className="text-2xl font-bold mt-1">{stats.officers}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
          <p className="text-sm text-muted-foreground">Công dân</p>
          <p className="text-2xl font-bold mt-1">{stats.citizens}</p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole || ''}
              onChange={(e) => setFilterRole(e.target.value || null)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="leader">Lãnh đạo</option>
              <option value="officer">Cán bộ</option>
              <option value="citizen">Công dân</option>
            </select>
          </div>

          {/* Users List */}
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <Badge className={roleColors[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                      <Badge
                        variant={user.status === 'active' ? 'default' : 'outline'}
                        className={
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }
                      >
                        {user.status === 'active' ? 'Hoạt động' : 'Ngưng'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </span>
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Đăng nhập: {user.lastLogin}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="w-4 h-4" />
                      Xem
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="w-4 h-4" />
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-status-danger hover:bg-status-danger/10">
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
