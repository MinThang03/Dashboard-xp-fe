'use client';

import React from "react"

import { useAuth, type UserRole } from '@/lib/auth-context';
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
import { useState } from 'react';
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
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<typeof notifications[0] | null>(null);

  const notifications = [
    {
      id: 1,
      type: 'feedback',
      title: 'Phản ánh mới: Ô nhiễm môi trường Khu A',
      time: '5 phút trước',
      unread: true,
      detail: {
        id: 'PA-MT-A-01',
        area: 'Khu A, Thôn 1',
        category: 'Môi trường',
        channel: 'Cổng dịch vụ công',
        description: 'Người dân phản ánh mùi hôi thối, xả thải trực tiếp ra suối gần khu dân cư, ảnh hưởng sức khỏe.',
        department: 'Tài nguyên & Môi trường',
        handler: 'Nguyễn Văn Hùng',
        status: 'Đang xử lý',
      },
    },
    {
      id: 2,
      type: 'report',
      title: 'Cán bộ Nguyễn Văn A đã nộp báo cáo tài chính quý I',
      time: '1 giờ trước',
      unread: true,
      detail: {
        documentTitle: 'Báo cáo tài chính quý I',
        submittedBy: 'Nguyễn Văn A',
        department: 'Tài chính - Kế toán',
        submittedDate: '2024-01-17',
        fileName: 'bao-cao-tai-chinh-Q1.pdf',
        fileSize: '2.4 MB',
      },
    },
    {
      id: 3,
      type: 'approval',
      title: 'Có 3 tài liệu chờ phê duyệt',
      time: '2 giờ trước',
      unread: false,
      detail: {
        count: 3,
        urgent: 1,
        items: [
          { title: 'Báo cáo tài chính quý I', priority: 'critical' },
          { title: 'Kế hoạch phát triển năm 2024', priority: 'high' },
          { title: 'Quy hoạch xây dựng khu A', priority: 'high' },
        ],
      },
    },
    {
      id: 4,
      type: 'alert',
      title: 'Cảnh báo: Hồ sơ sắp quá hạn',
      time: '3 giờ trước',
      unread: false,
      detail: {
        count: 3,
        deadline: '2024-01-20',
        items: [
          { id: 'HS-DC-001', name: 'Cấp phép xây dựng nhà ở riêng lẻ', daysLeft: 1 },
        ],
      },
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

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
        className={cn(
          'flex flex-col flex-1 transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Top Bar - nền trắng, viền/dải rõ hơn theo palette */}
        <header className="bg-card h-16 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 border-b-2 border-primary">
          <div className="flex-1 flex items-center gap-4">
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
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                Ủy ban nhân dân xã/phường
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Hệ thống quản lý hành chính điện tử
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
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
                  {notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                        notif.unread ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => setSelectedNotification(notif)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <p className="text-sm font-medium text-foreground flex-1">
                          {notif.title}
                        </p>
                        {notif.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{notif.time}</p>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-sm text-primary">
                  Xem tất cả thông báo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MessageSquare className="w-5 h-5" />
            </Button>

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
                  defaultValue={user.name}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                <input
                  type="email"
                  defaultValue={user.email || ''}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Số điện thoại</p>
                  <input
                    type="tel"
                    placeholder="0123456789"
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">CMND/CCCD</p>
                  <input
                    type="text"
                    placeholder="Nhập số CMND/CCCD"
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Ngày tháng năm sinh</p>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Thời gian bắt đầu làm việc</p>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Địa chỉ thường trú</p>
                <textarea
                  rows={2}
                  placeholder="Nhập địa chỉ thường trú"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Đơn vị công tác</p>
                <input
                  type="text"
                  placeholder="Nhập đơn vị công tác"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Chức vụ</p>
                <input
                  type="text"
                  placeholder="Nhập chức vụ"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsProfileOpen(false)}
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
                <p className="font-semibold">{selectedNotification.time}</p>
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
    </div>
  );
}
