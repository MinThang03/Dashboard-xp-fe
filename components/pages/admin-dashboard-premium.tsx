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
  X,
} from 'lucide-react';
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
  role: 'admin' | 'leader' | 'officer' | 'citizen';
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
];

const roleConfig = {
  admin: { label: 'Quản trị viên', color: 'from-primary to-primary', icon: Shield },
  leader: { label: 'Lãnh đạo', color: 'from-secondary to-secondary', icon: Users },
  officer: { label: 'Cán bộ', color: 'from-status-success to-status-success', icon: UserCheck },
  citizen: { label: 'Công dân', color: 'from-orange-500 to-amber-500', icon: Users },
};

const systemStats = [
  { name: 'T1', users: 120, active: 95, requests: 1200 },
  { name: 'T2', users: 135, active: 108, requests: 1450 },
  { name: 'T3', users: 148, active: 120, requests: 1680 },
  { name: 'T4', users: 162, active: 135, requests: 1920 },
  { name: 'T5', users: 178, active: 150, requests: 2100 },
  { name: 'T6', users: 195, active: 168, requests: 2350 },
];

const usersByRole = [
  { name: 'Công dân', value: 150, color: '#f59e0b' },
  { name: 'Cán bộ', value: 35, color: '#10b981' },
  { name: 'Lãnh đạo', value: 8, color: '#00ADB5' },
  { name: 'Admin', value: 2, color: '#8b5cf6' },
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'officer' as const,
    department: '',
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
      setFormData({ name: '', email: '', role: 'officer', department: '' });
      setDialogOpen(false);
      console.log('Added new user:', newUser);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-white">
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
            <div className="flex gap-3">
              <Button className="bg-white text-purple-600 hover:bg-white/90" onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm người dùng
              </Button>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </Button>
            </div>
          </div>
        </div>
      </div>

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
            <p className="text-4xl font-bold mb-2">195</p>
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
            <p className="text-4xl font-bold mb-2">168</p>
            <p className="text-sm text-muted-foreground">Người dùng hoạt động</p>
            <div className="mt-4 text-sm text-muted-foreground">
              86% tỷ lệ hoạt động
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
              <p className="text-sm text-muted-foreground mt-1">Tổng: 195 người dùng</p>
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
              <option value="admin">Quản trị viên</option>
              <option value="leader">Lãnh đạo</option>
              <option value="officer">Cán bộ</option>
              <option value="citizen">Công dân</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const config = roleConfig[user.role];
            const RoleIcon = config.icon;
            
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
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
              <Select value={formData.role} onValueChange={(v: any) => setFormData({ ...formData, role: v })}>
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
