
'use client';

import React, { useEffect, useState } from "react"
import { useAuth, type UserRole, type User } from '@/lib/auth-context';
import { messagesApi, notificationsApi, userApi } from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  BarChart3,
  Home,
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
  GraduationCap,
  Zap,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { OFFICER_MODULES } from '@/lib/officer-modules';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/ai-assistant';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
  submenu?: MenuItem[];
}

interface NotificationItem {
  id: number;
  type: 'feedback' | 'report' | 'approval' | 'alert';
  title: string;
  createdAt?: string;
  unread: boolean;
  content?: string | null;
  detail?: Record<string, any>;
}

interface MessageItem {
  id: number;
  from: string;
  title: string;
  preview?: string | null;
  createdAt?: string;
  unread: boolean;
  body?: string | null;
}

interface ProfileFormState {
  name: string;
  email: string;
  phone: string;
  citizenId: string;
  birthDate: string;
  startDate: string;
  address: string;
  department: string;
  title: string;
}

const emptyProfileForm: ProfileFormState = {
  name: '',
  email: '',
  phone: '',
  citizenId: '',
  birthDate: '',
  startDate: '',
  address: '',
  department: '',
  title: '',
};

const navigationItems: MenuItem[] = [
  {
    label: 'Bảng điều khiển',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'leader', 'officer', 'citizen'],
  },
  // Leader menu - Quản lý 10 lĩnh vực
  {
    label: 'Giám sát 10 Lĩnh vực',
    href: '/dashboard/giam-sat-linh-vuc',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['leader'],
  },
  {
    label: 'Phê duyệt & Ký số',
    href: '/dashboard/approvals',
    icon: <CheckCircle2 className="w-5 h-5" />,
    roles: ['leader'],
  },
  {
    label: 'Cảnh báo & Điểm nóng',
    href: '/dashboard/alerts',
    icon: <AlertCircle className="w-5 h-5" />,
    roles: ['leader'],
  },
  {
    label: 'Báo cáo & Phân tích',
    href: '/dashboard/reports',
    icon: <FileText className="w-5 h-5" />,
    roles: ['leader'],
  },
  // Officer menu - Hành chính tư pháp
  {
    label: 'Hành chính - Tư pháp',
    href: '/dashboard',
    icon: <FileText className="w-5 h-5" />,
    roles: ['officer'],
    submenu: [
      {
        label: 'Hộ tịch',
        href: '/dashboard/ho-tich',
        icon: <FileText className="w-4 h-4" />,
        roles: ['officer'],
      },
      {
        label: 'Chứng thực',
        href: '/dashboard/chung-thuc',
        icon: <Shield className="w-4 h-4" />,
        roles: ['officer'],
      },
    ],
  },
  {
    label: 'Tài chính',
    href: '/dashboard/tai-chinh',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['officer'],
  },
  {
    label: 'Địa chính',
    href: '/dashboard/dia-chinh',
    icon: <MapPin className="w-5 h-5" />,
    roles: ['officer'],
  },
  {
    label: 'Môi trường',
    href: '/dashboard/moi-truong',
    icon: <Home className="w-5 h-5" />,
    roles: ['officer'],
  },
  // Citizen menu
  {
    label: 'Nộp hồ sơ',
    href: '/dashboard/submit',
    icon: <FileText className="w-5 h-5" />,
    roles: ['citizen'],
  },
  {
    label: 'Tra cứu hồ sơ',
    href: '/dashboard/track',
    icon: <CheckCircle2 className="w-5 h-5" />,
    roles: ['citizen'],
  },
  {
    label: 'Phản ánh',
    href: '/dashboard/feedback',
    icon: <MessageSquare className="w-5 h-5" />,
    roles: ['citizen'],
  },
  // Admin menu
  {
    label: 'Quản lý người dùng',
    href: '/dashboard/admin/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    label: 'Thông tin Xã Phường',
    href: '/dashboard/admin/commune',
    icon: <MapPin className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    label: 'Quyền & Vai trò',
    href: '/dashboard/admin/roles',
    icon: <Shield className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    label: 'Cài đặt hệ thống',
    href: '/dashboard/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['admin'],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(emptyProfileForm);
  const [profileError, setProfileError] = useState('');

  const unreadCount = notifications.filter((n) => n.unread).length;
  const unreadMessageCount = messages.filter((m) => m.unread).length;

  const formatDateInput = (value?: string | Date | null) => {
    if (!value) return '';
    const parsed = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toISOString().slice(0, 10);
  };

  const buildBaseProfile = (sourceUser: User): ProfileFormState => ({
    name: sourceUser.name || '',
    email: sourceUser.email || '',
    phone: sourceUser.phone || '',
    citizenId: sourceUser.citizenId || '',
    birthDate: formatDateInput(sourceUser.birthDate),
    startDate: formatDateInput(sourceUser.startDate),
    address: sourceUser.address || '',
    department: sourceUser.department || '',
    title: sourceUser.title || '',
  });

  useEffect(() => {
    if (!user) return;
    setProfileForm(buildBaseProfile(user));
  }, [user]);

  useEffect(() => {
    if (!isProfileOpen || !user) return;
    setProfileError('');
    setProfileForm(buildBaseProfile(user));
  }, [isProfileOpen, user]);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      const response = await notificationsApi.list();
      if (response?.success && Array.isArray(response.data)) {
        setNotifications(response.data as NotificationItem[]);
      } else {
        setNotifications([]);
      }
    };

    const loadMessages = async () => {
      const response = await messagesApi.list();
      if (response?.success && Array.isArray(response.data)) {
        setMessages(response.data as MessageItem[]);
      } else {
        setMessages([]);
      }
    };

    loadNotifications();
    loadMessages();
  }, [user]);

  if (!user) {
    return null;
  }

  const filteredMenuItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const buildAvatarFromName = (name: string) => {
    const initials = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return initials || 'U';
  };

  const formatRelativeTime = (value?: string) => {
    if (!value) {
      return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    const diffMs = Date.now() - parsed.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return parsed.toLocaleDateString('vi-VN');
  };

  const markNotificationRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );

    await notificationsApi.markRead(id);
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    await notificationsApi.markAllRead();
  };

  const clearNotifications = async () => {
    setNotifications([]);
    await notificationsApi.clearAll();
  };

  const handleOpenNotification = async (notif: NotificationItem) => {
    await markNotificationRead(notif.id);
    setSelectedNotification(notif);
  };

  const markMessageRead = async (id: number) => {
    setMessages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );

    await messagesApi.markRead(id);
  };

  const markAllMessagesRead = async () => {
    setMessages((prev) => prev.map((item) => ({ ...item, unread: false })));
    await messagesApi.markAllRead();
  };

  const handleOpenMessage = async (message: MessageItem) => {
    await markMessageRead(message.id);
    setSelectedMessage(message);
  };

  const handleProfileSave = async () => {
    if (!user) return;

    const trimmedName = profileForm.name.trim();
    if (!trimmedName) {
      setProfileError('Vui lòng nhập họ và tên.');
      return;
    }

    const trimmedEmail = profileForm.email.trim();
    const trimmedPhone = profileForm.phone.trim();
    if (trimmedPhone && trimmedPhone.length < 10) {
      setProfileError('Số điện thoại phải có ít nhất 10 ký tự.');
      return;
    }

    try {
      const response = await userApi.updateMe({
        fullName: trimmedName,
        email: trimmedEmail ? trimmedEmail : null,
        phone: trimmedPhone || null,
        department: profileForm.department.trim() || null,
        citizenId: profileForm.citizenId.trim() || null,
        birthDate: profileForm.birthDate || null,
        startDate: profileForm.startDate || null,
        address: profileForm.address.trim() || null,
        title: profileForm.title.trim() || null,
      });

      if (!response?.success || !response.data) {
        throw new Error(response?.message || response?.error || 'Không thể cập nhật thông tin');
      }

      const updated = response.data;
      const avatar = updated.avatar || buildAvatarFromName(updated.fullName);
      const nextUser: User = {
        ...user,
        name: updated.fullName,
        email: updated.email ?? undefined,
        department: updated.department ?? undefined,
        phone: updated.phone ?? undefined,
        citizenId: updated.citizenId ?? undefined,
        birthDate: updated.birthDate ?? null,
        startDate: updated.startDate ?? null,
        address: updated.address ?? undefined,
        title: updated.title ?? undefined,
        avatar,
      };

      setUser(nextUser);
      setIsProfileOpen(false);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Không thể cập nhật thông tin');
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <AIAssistant />
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-sidebar border-r-2 border-sidebar-border transition-transform duration-300 z-40 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 px-4 border-b-2 border-sidebar-border flex items-center justify-between shrink-0">
          {sidebarOpen && (
            <div className="font-bold text-lg text-sidebar-primary flex items-center gap-2">
              <Home className="w-6 h-6" />
              <span>Smart Dashboard</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 p-0 shrink-0"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Dashboard Button for Officer */}
          {user?.role === 'officer' && (
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <button
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all mb-2',
                  pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-primary/10 to-cyan-500/10 border-l-4 border-primary text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
                title={!sidebarOpen ? 'Bảng điều khiển' : undefined}
              >
                <LayoutDashboard className="w-5 h-5" />
                {sidebarOpen && <span className="truncate">Bảng điều khiển</span>}
              </button>
            </Link>
          )}

          {/* Officer Modules - Only for officer role */}
          {user?.role === 'officer' && sidebarOpen && (
            <div className="space-y-1 mt-2">
              {OFFICER_MODULES.map((module) => {
                const ModuleIcon = module.icon;
                const isExpanded = expandedModules.includes(module.id);
                
                return (
                  <div key={module.id}>
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className={cn(
                        'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all',
                        'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ModuleIcon className="w-5 h-5" />
                        <span className="truncate">{module.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Module Functions (Submenu) */}
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-sidebar-border pl-2">
                        {module.functions.map((func) => {
                          const FuncIcon = func.icon;
                          const isActive = pathname === func.path;
                          
                          return (
                            <Link
                              key={func.id}
                              href={func.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <button
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all',
                                  isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                )}
                              >
                                <FuncIcon className="w-4 h-4" />
                                <span className="truncate text-xs">{func.name}</span>
                              </button>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Other role menus */}
          {user?.role !== 'officer' && filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <button
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white border-l-4 border-primary text-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {item.icon}
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t-2 border-sidebar-border shrink-0">
          <div className={cn('flex items-center gap-2', sidebarOpen ? 'justify-between' : 'justify-center')}>
            <div className={cn('flex items-center gap-2 min-w-0', sidebarOpen ? '' : 'justify-center')}>
              <div className="text-2xl leading-none">{user.avatar}</div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-sidebar-foreground truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-sidebar-foreground/70 capitalize truncate">
                    {user.role === 'admin'
                      ? 'Quản trị viên'
                      : user.role === 'leader'
                        ? 'Lãnh đạo'
                        : user.role === 'officer'
                          ? 'Cán bộ'
                          : 'Công dân'}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Đăng xuất"
              className={cn(
                'h-9 w-9 p-0',
                'text-sidebar-foreground/70 hover:text-status-danger',
                'hover:bg-white/60'
              )}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        data-role={user.role}
        className={cn(
          'flex flex-col w-full min-w-0 transition-all duration-300',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20',
          user.role === 'officer' ? 'officer-scope' : ''
        )}
      >
        {/* Top Bar - nền trắng, viền/dải rõ hơn theo palette */}
        <header className="bg-card h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 border-b-2 border-primary">
          <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Tên đơn vị */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">
                Ủy ban nhân dân xã/phường
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Hệ thống quản lý hành chính điện tử
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
            {/* Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-status-danger rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Thông báo</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-status-danger text-white text-xs">
                      {unreadCount} mới
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                      Chưa có thông báo mới.
                    </div>
                  )}
                  {notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                        notif.unread ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => handleOpenNotification(notif)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <p className="text-sm font-medium text-foreground flex-1">
                          {notif.title}
                        </p>
                        {notif.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(notif.createdAt)}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={markAllNotificationsRead}
                  className="justify-center text-sm text-primary"
                >
                  Đánh dấu đã đọc tất cả
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clearNotifications}
                  className="justify-center text-sm text-muted-foreground"
                >
                  Xóa toàn bộ thông báo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessageCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-status-danger rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Tin nhắn</span>
                  {unreadMessageCount > 0 && (
                    <Badge className="bg-status-danger text-white text-xs">
                      {unreadMessageCount} mới
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {messages.length === 0 && (
                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                      Chưa có tin nhắn mới.
                    </div>
                  )}
                  {messages.map((message) => (
                    <DropdownMenuItem
                      key={message.id}
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                        message.unread ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => handleOpenMessage(message)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <p className="text-sm font-medium text-foreground flex-1">
                          {message.title}
                        </p>
                        {message.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{message.from}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {message.preview || message.body || ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(message.createdAt)}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={markAllMessagesRead}
                  className="justify-center text-sm text-primary"
                >
                  Đánh dấu đã đọc tất cả
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground font-normal capitalize">
                    {user.role === 'admin'
                      ? 'Quản trị viên'
                      : user.role === 'leader'
                        ? 'Lãnh đạo'
                        : user.role === 'officer'
                          ? 'Cán bộ'
                          : 'Công dân'}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-status-danger">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="pt-10 px-4 lg:px-6 pb-4 lg:pb-6">{children}</div>
        </main>
      </div>

      {/* User Profile Edit Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin cá nhân</DialogTitle>
            <DialogDescription>
              Xem và chỉnh sửa thông tin tài khoản của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {profileError && (
              <div className="rounded-md border border-status-danger/30 bg-status-danger/10 px-3 py-2 text-xs text-status-danger">
                {profileError}
              </div>
            )}
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-lg text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role === 'admin'
                    ? 'Quản trị viên'
                    : user.role === 'leader'
                      ? 'Lãnh đạo'
                      : user.role === 'officer'
                        ? 'Cán bộ'
                        : 'Công dân'}
                </p>
                <Badge className="mt-1 bg-primary/10 text-primary border-primary/30">
                  {user.role === 'admin'
                    ? 'Quyền cao nhất'
                    : user.role === 'leader'
                      ? 'Quản lý toàn bộ'
                      : user.role === 'officer'
                        ? 'Xử lý hồ sơ'
                        : 'Sử dụng dịch vụ'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Họ và tên</p>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Số điện thoại</p>
                  <input
                    type="tel"
                    placeholder="0123456789"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">CMND/CCCD</p>
                  <input
                    type="text"
                    placeholder="Nhập số CMND/CCCD"
                    value={profileForm.citizenId}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, citizenId: e.target.value }))}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Ngày tháng năm sinh</p>
                  <input
                    type="date"
                    value={profileForm.birthDate}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Thời gian bắt đầu làm việc</p>
                  <input
                    type="date"
                    value={profileForm.startDate}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Địa chỉ thường trú</p>
                <textarea
                  rows={2}
                  placeholder="Nhập địa chỉ thường trú"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Đơn vị công tác</p>
                <input
                  type="text"
                  placeholder="Nhập đơn vị công tác"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Chức vụ</p>
                <input
                  type="text"
                  placeholder="Nhập chức vụ"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleProfileSave}
            >
              Lưu thay đổi
            </Button>
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={(open) => {
        if (!open) setSelectedNotification(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết thông báo</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về thông báo này.
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Tiêu đề</p>
                <p className="font-semibold text-foreground">{selectedNotification.title}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Thời gian</p>
                <p className="font-semibold">
                  {formatRelativeTime(selectedNotification.createdAt)}
                </p>
              </div>

              {selectedNotification.type === 'feedback' && selectedNotification.detail && (
                <div className="space-y-2 rounded-md bg-muted/40 border border-border/60 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Mã phản ánh</p>
                  <p className="font-semibold">{selectedNotification.detail.id}</p>
                  <p className="text-xs text-muted-foreground">Khu vực: {selectedNotification.detail.area}</p>
                  <p className="text-xs text-muted-foreground">Lĩnh vực: {selectedNotification.detail.category}</p>
                  <p className="text-xs text-muted-foreground">Đơn vị: {selectedNotification.detail.department}</p>
                  <p className="text-xs text-muted-foreground mt-2">{selectedNotification.detail.description}</p>
                </div>
              )}

              {selectedNotification.type === 'report' && selectedNotification.detail && (
                <div className="space-y-2 rounded-md bg-muted/40 border border-border/60 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Tài liệu</p>
                  <p className="font-semibold">{selectedNotification.detail.documentTitle}</p>
                  <p className="text-xs text-muted-foreground">Người nộp: {selectedNotification.detail.submittedBy}</p>
                  <p className="text-xs text-muted-foreground">Bộ phận: {selectedNotification.detail.department}</p>
                  <p className="text-xs text-muted-foreground">Ngày nộp: {selectedNotification.detail.submittedDate}</p>
                  <p className="text-xs text-muted-foreground">File: {selectedNotification.detail.fileName} ({selectedNotification.detail.fileSize})</p>
                </div>
              )}

              {selectedNotification.type === 'approval' && selectedNotification.detail && (
                <div className="space-y-2 rounded-md bg-muted/40 border border-border/60 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Số lượng tài liệu</p>
                  <p className="font-semibold">{selectedNotification.detail.count} tài liệu chờ phê duyệt</p>
                  {selectedNotification.detail.urgent !== undefined && selectedNotification.detail.urgent > 0 && (
                    <p className="text-xs text-status-danger">Trong đó có {selectedNotification.detail.urgent} tài liệu khẩn cấp</p>
                  )}
                  <div className="mt-2 space-y-1">
                    {selectedNotification.detail.items?.map((item: any, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground">• {item.title}</p>
                    ))}
                  </div>
                </div>
              )}

              {selectedNotification.type === 'alert' && selectedNotification.detail && (
                <div className="space-y-2 rounded-md bg-muted/40 border border-border/60 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Số lượng hồ sơ</p>
                  <p className="font-semibold">{selectedNotification.detail.count} hồ sơ sắp quá hạn</p>
                  <p className="text-xs text-muted-foreground">Hạn cuối: {selectedNotification.detail.deadline}</p>
                  <div className="mt-2 space-y-1">
                    {selectedNotification.detail.items?.map((item: any, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        • {item.name} (Còn {item.daysLeft} ngày)
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedNotification(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => {
        if (!open) setSelectedMessage(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết tin nhắn</DialogTitle>
            <DialogDescription>
              Nội dung trao đổi và hướng dẫn liên quan.
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Tiêu đề</p>
                <p className="font-semibold text-foreground">{selectedMessage.title}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Từ</p>
                <p className="font-semibold">{selectedMessage.from}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Thời gian</p>
                <p className="font-semibold">
                  {formatRelativeTime(selectedMessage.createdAt)}
                </p>
              </div>
              <div className="rounded-md bg-muted/40 border border-border/60 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Nội dung</p>
                <p className="text-sm text-foreground">
                  {selectedMessage.body || selectedMessage.preview || ''}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
