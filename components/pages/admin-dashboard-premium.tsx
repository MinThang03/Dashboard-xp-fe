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
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Users,
  Settings,
  Activity,
  Server,
  TrendingUp,
  Eye,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Clock,
  Zap,
} from 'lucide-react';
import { usersApi, vaiTroApi, hoSoTthcApi, phanAnhApi } from '@/lib/api';
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

type AdminOpsSnapshot = {
  todayRequests: number;
  pendingFeedback: number;
  criticalAlerts: number;
  uptime: number;
};

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
  CANBO: { label: 'Cán bộ', color: 'from-status-success to-status-success', icon: Activity },
  CONGDAN: { label: 'Công dân', color: 'from-orange-500 to-amber-500', icon: Users },
};

const roleChartColors: Record<User['role'], string> = {
  ADMIN: '#8b5cf6',
  LANHDAO: '#00ADB5',
  CANBO: '#10b981',
  CONGDAN: '#f59e0b',
};

type NumberTickerProps = {
  value: number;
  trigger: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  formatter?: (value: number) => string;
};

function NumberTicker({
  value,
  trigger,
  duration = 900,
  decimals = 0,
  suffix,
  formatter,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();
    const from = value === 0 ? 0 : Math.max(0, value * 0.9);
    const to = value;

    const animate = (time: number) => {
      const progress = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(from + (to - from) * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [duration, trigger, value]);

  const text = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span>
      {text}
      {suffix ?? ''}
    </span>
  );
}

function pickNumber(source: any, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return fallback;
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function AdminDashboardPremium() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Array<{ id: number; code: string; name: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pulseTick, setPulseTick] = useState(0);
  const [opsSnapshot, setOpsSnapshot] = useState<AdminOpsSnapshot>({
    todayRequests: 0,
    pendingFeedback: 0,
    criticalAlerts: 0,
    uptime: 99.8,
  });
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
    const [rolesRes, usersRes, hoSoStatsRes, phanAnhStatsRes] = await Promise.all([
      vaiTroApi.getList(),
      usersApi.getList(),
      hoSoTthcApi.getStats(),
      phanAnhApi.getStats(),
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

    const hoSoStats = hoSoStatsRes?.success ? (hoSoStatsRes.data as any) : {};
    const phanAnhStats = phanAnhStatsRes?.success ? (phanAnhStatsRes.data as any) : {};

    const todayRequests = pickNumber(hoSoStats, ['total', 'TongSo', 'totalCases', 'tongHoSo']);
    const pendingHoSo = pickNumber(hoSoStats, ['dangXuLy', 'choBoSung', 'pending', 'choXuLy']);
    const pendingFeedback = pickNumber(phanAnhStats, ['choXuLy', 'pending', 'dangXuLy', 'ChoXuLy']);

    setOpsSnapshot((prev) => ({
      ...prev,
      todayRequests,
      pendingFeedback,
      criticalAlerts: pendingHoSo + pendingFeedback,
    }));
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseTick((prev) => prev + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

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

  const usersByRole = useMemo(() => {
    return (Object.entries(roleConfig) as Array<
      [User['role'], { label: string; color: string; icon: any }]
    >).map(([role, config]) => ({
      name: config.label,
      value: roleCounts[role] || 0,
      color: roleChartColors[role],
    }));
  }, [roleCounts]);

  const usageSeries = useMemo(() => {
    const now = new Date();
    const seed = Math.max(totalUsers, 1);
    const activeSeed = Math.max(activeUsers, 1);
    const requestSeed = Math.max(opsSnapshot.todayRequests, 1);

    return Array.from({ length: 6 }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const factor = 0.78 + index * 0.05;
      return {
        name: `T${monthDate.getMonth() + 1}`,
        users: Math.max(1, Math.round(seed * factor)),
        active: Math.max(1, Math.round(activeSeed * factor)),
        requests: Math.max(1, Math.round(requestSeed * factor)),
      };
    });
  }, [activeUsers, opsSnapshot.todayRequests, totalUsers]);

  const activityLog = useMemo(() => {
    const records = [...users]
      .sort((a, b) => {
        const timeA = parseDate(a.lastLogin)?.getTime() ?? 0;
        const timeB = parseDate(b.lastLogin)?.getTime() ?? 0;
        return timeB - timeA;
      })
      .slice(0, 6)
      .map((userItem) => {
        const isActiveUser = userItem.status === 'active';
        return {
          time: userItem.lastLogin,
          user: userItem.name,
          action: isActiveUser ? 'Truy cập và cập nhật hồ sơ người dùng' : 'Tài khoản tạm ngưng hoạt động',
          type: isActiveUser ? 'success' : 'warning',
        };
      });

    if (records.length) {
      return records;
    }

    return [
      { time: new Date().toLocaleString('vi-VN'), user: 'System', action: 'Đồng bộ dữ liệu người dùng', type: 'info' },
    ];
  }, [users]);

  const spotlightUsers = useMemo(() => {
    return [...users]
      .filter((userItem) => userItem.status === 'active')
      .sort((a, b) => {
        const timeA = parseDate(a.lastLogin)?.getTime() ?? 0;
        const timeB = parseDate(b.lastLogin)?.getTime() ?? 0;
        return timeB - timeA;
      });
  }, [users]);

  const spotlightUser = spotlightUsers.length ? spotlightUsers[pulseTick % spotlightUsers.length] : null;

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
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
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/90">
                <Badge className="border-0 bg-white/20">Cập nhật: {new Date().toLocaleString('vi-VN')}</Badge>
                <Badge className="border-0 bg-white/20">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Live mỗi 5 giây
                </Badge>
              </div>
            </div>
            <div className="flex w-full flex-wrap gap-3 xl:w-auto xl:flex-nowrap">
              <Button className="w-full bg-white text-purple-600 hover:bg-white/90 sm:w-auto" onClick={handleOpenAddUser}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm người dùng
              </Button>
              <Button
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0 sm:w-auto"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>
        </div>
      </div>

      {spotlightUser && (
        <Card className="border-cyan-200 bg-cyan-50/70 p-4 transition-all duration-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-700" />
              <span className="text-sm font-semibold text-cyan-800">Người dùng hoạt động gần nhất:</span>
              <span className="text-sm text-cyan-900">{spotlightUser.name} ({spotlightUser.department})</span>
            </div>
            <Badge className="w-fit bg-cyan-100 text-cyan-700">{spotlightUser.lastLogin}</Badge>
          </div>
        </Card>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-700 border-0">
                {pulseTick % 2 === 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              </Badge>
            </div>
            <p className="text-4xl font-bold mb-2">
              <NumberTicker value={totalUsers} trigger={pulseTick} />
            </p>
            <p className="text-sm text-muted-foreground">Tổng người dùng</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span>{filteredUsers.length} người dùng theo bộ lọc hiện tại</span>
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
            <p className="text-4xl font-bold mb-2">
              <NumberTicker value={activeUsers} trigger={pulseTick} />
            </p>
            <p className="text-sm text-muted-foreground">Người dùng hoạt động</p>
            <div className="mt-4 text-sm text-muted-foreground">
              <NumberTicker value={activeRate} trigger={pulseTick} suffix="%" /> tỷ lệ hoạt động
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
            <p className="text-4xl font-bold mb-2">
              <NumberTicker value={opsSnapshot.todayRequests} trigger={pulseTick} />
            </p>
            <p className="text-sm text-muted-foreground">Yêu cầu xử lý</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-700">
              <ArrowDownRight className="w-4 h-4" />
              <span>{opsSnapshot.pendingFeedback} phản ánh đang chờ xử lý</span>
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
              <Badge className="bg-red-100 text-red-700 border-0">{opsSnapshot.criticalAlerts} cảnh báo</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">
              <NumberTicker value={opsSnapshot.uptime} trigger={pulseTick} decimals={1} suffix="%" />
            </p>
            <p className="text-sm text-muted-foreground">Uptime hệ thống</p>
            <div className="mt-4 text-sm text-muted-foreground">
              Theo dõi vận hành realtime
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Tăng trưởng người dùng</h3>
              <p className="text-sm text-muted-foreground mt-1">6 tháng gần nhất</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart key={`admin-usage-${pulseTick % 2}`} data={usageSeries}>
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
                isAnimationActive
                animationDuration={1000}
              />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} isAnimationActive animationDuration={1000} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Phân bổ vai trò</h3>
              <p className="text-sm text-muted-foreground mt-1">Tổng: {totalUsers} người dùng</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart key={`admin-role-${pulseTick % 2}`}>
              <Pie
                data={usersByRole}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive
                animationDuration={1000}
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

      <Card className="p-6 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">Quản lý người dùng</h3>
            <p className="text-sm text-muted-foreground mt-1">Danh sách người dùng đồng bộ từ hệ thống</p>
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
