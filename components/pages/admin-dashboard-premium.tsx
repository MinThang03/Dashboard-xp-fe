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
  Edit2,
  Trash2,
  Shield,
  Users,
  Settings,
  Key,
  Activity,
  Server,
  Database,
  AlertTriangle,
  TrendingUp,
  Eye,
  MoreVertical,
  UserCheck,
  UserX,
  Clock,
  Zap,
} from 'lucide-react';
import { usersApi, vaiTroApi } from '@/lib/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'LANHDAO' | 'CANBO' | 'CONGDAN';
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar?: string;
}

const mockUsers: User[] = [
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
];

const roleConfig = {
  ADMIN: { label: 'Quản trị viên', color: 'from-primary to-primary', icon: Shield },
  LANHDAO: { label: 'Lãnh đạo', color: 'from-secondary to-secondary', icon: Users },
  CANBO: { label: 'Cán bộ', color: 'from-status-success to-status-success', icon: UserCheck },
  CONGDAN: { label: 'Công dân', color: 'from-orange-500 to-amber-500', icon: Users },
};

const roleChartColors: Record<User['role'], string> = {
  ADMIN: '#8b5cf6',
  LANHDAO: '#00ADB5',
  CANBO: '#10b981',
  CONGDAN: '#f59e0b',
};

const systemStats = [
  { name: 'T1', users: 120, active: 95, requests: 1200 },
  { name: 'T2', users: 135, active: 108, requests: 1450 },
  { name: 'T3', users: 148, active: 120, requests: 1680 },
  { name: 'T4', users: 162, active: 135, requests: 1920 },
  { name: 'T5', users: 178, active: 150, requests: 2100 },
  { name: 'T6', users: 195, active: 168, requests: 2350 },
];

const activityLog = [
  { time: '10:30', user: 'Nguyễn Văn A', action: 'Đăng nhập hệ thống', type: 'info' },
  { time: '10:25', user: 'Trần Thị B', action: 'Tạo hồ sơ mới', type: 'success' },
  { time: '10:20', user: 'Lê Văn C', action: 'Cập nhật thông tin', type: 'info' },
  { time: '10:15', user: 'System', action: 'Sao lưu dữ liệu thành công', type: 'success' },
  { time: '10:10', user: 'Phạm Thị D', action: 'Thử đăng nhập thất bại', type: 'warning' },
];

export function AdminDashboardPremium() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Array<{ id: number; code: string; name: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
        role: (roleMap.get(user.roleId) || 'CONGDAN') as User['role'],
        department: user.department || '-',
        status: user.isActive ? 'active' : 'inactive',
        lastLogin: user.lastLogin || 'Chưa cập nhật',
      }));
      setUsers(mapped);
    } else if (!usersRes?.success) {
      setErrorMessage(usersRes?.message || 'Không thể tải danh sách người dùng');
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

    setIsSavingUser(true);
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
      await loadData();
      setDialogOpen(false);
      setEditingUserId(null);
    } else {
      setErrorMessage(result?.message || 'Không thể lưu người dùng');
    }
    setIsSavingUser(false);
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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === 'active').length;
  const activeRate = totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<User['role'], number>);

  const usersByRole = (Object.entries(roleConfig) as Array<
    [User['role'], { label: string; color: string; icon: any }]
  >).map(([role, config]) => ({
    name: config.label,
    value: roleCounts[role] || 0,
    color: roleChartColors[role],
  }));

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-4 text-white sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Bảng điều khiển Quản trị</h1>
              </div>
              <p className="text-white/90 text-lg">Quản lý hệ thống và người dùng</p>
            </div>
            <div className="flex w-full flex-wrap gap-3 xl:w-auto xl:flex-nowrap">
              <Button className="w-full bg-white text-purple-600 hover:bg-white/90 sm:w-auto" onClick={handleOpenAddUser}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm người dùng
              </Button>
              <Button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0 sm:w-auto">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </Button>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-700 border-0">+12</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">{totalUsers}</p>
            <p className="text-sm text-muted-foreground">Tổng người dùng</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span>+15% so với tháng trước</span>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-status-success/10 to-status-success/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-0">Online</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">{activeUsers}</p>
            <p className="text-sm text-muted-foreground">Người dùng hoạt động</p>
            <div className="mt-4 text-sm text-muted-foreground">
              {activeRate}% tỷ lệ hoạt động
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-500/10 text-purple-700 border-0">Hôm nay</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">2,350</p>
            <p className="text-sm text-muted-foreground">Yêu cầu xử lý</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8% hiệu suất</span>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Server className="w-6 h-6 text-amber-600" />
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-0">Tốt</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">99.8%</p>
            <p className="text-sm text-muted-foreground">Uptime hệ thống</p>
            <div className="mt-4 text-sm text-muted-foreground">
              0 sự cố trong tháng
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Tăng trưởng người dùng</h3>
              <p className="text-sm text-muted-foreground mt-1">6 tháng gần nhất</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={systemStats}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ADB5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ADB5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#00ADB5"
                fillOpacity={1}
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Users by Role */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Phân bổ vai trò</h3>
              <p className="text-sm text-muted-foreground mt-1">Tổng: {totalUsers} người dùng</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={usersByRole}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {usersByRole.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {usersByRole.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Management */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">Quản lý người dùng</h3>
            <p className="text-sm text-muted-foreground mt-1">Danh sách toàn bộ người dùng</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm người dùng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg bg-slate-50"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="LANHDAO">Lãnh đạo</option>
              <option value="CANBO">Cán bộ</option>
              <option value="CONGDAN">Công dân</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const config = roleConfig[user.role] ?? roleConfig.CONGDAN;
            
            return (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {user.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold truncate">{user.name}</h4>
                    <Badge className={`bg-gradient-to-r ${config.color} text-white border-0`}>
                      {config.label}
                    </Badge>
                    <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                    <span>•</span>
                    <span>{user.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {user.lastLogin}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Activity Log */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Nhật ký hoạt động</h3>
            <p className="text-sm text-muted-foreground mt-1">Hoạt động gần đây</p>
          </div>
          <Button variant="outline" size="sm">
            Xem tất cả
          </Button>
        </div>
        <div className="space-y-3">
          {activityLog.map((log, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                log.type === 'success' ? 'bg-green-500' :
                log.type === 'warning' ? 'bg-amber-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{log.action}</p>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{log.user}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
              <Select value={formData.role} onValueChange={(v: any) => setFormData({ ...formData, role: v })}>
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
              <Label htmlFor="department">Phòng ban/Lĩnh vực</Label>
              <Input
                id="department"
                placeholder="Ví dụ: Tư pháp - Hộ tịch"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveUser} disabled={isSavingUser}>
              <Plus className="w-4 h-4 mr-2" />
              {isSavingUser ? 'Đang lưu...' : editingUserId ? 'Cập nhật' : 'Thêm người dùng'}
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
                  className={`w-20 h-20 bg-gradient-to-br ${
                    roleConfig[selectedUser.role]?.color || roleConfig.CONGDAN.color
                  } rounded-lg flex items-center justify-center text-white font-bold text-3xl`}
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
                  <Badge className={`bg-gradient-to-r ${roleConfig[selectedUser.role]?.color || roleConfig.CONGDAN.color} text-white border-0`}>
                    {roleConfig[selectedUser.role]?.label || 'Công dân'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phòng ban</p>
                  <p className="font-semibold">{selectedUser.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <Badge className={selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
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
