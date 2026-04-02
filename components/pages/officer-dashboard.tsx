'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutGrid,
  List,
  Minus,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { OFFICER_MODULES } from '@/lib/officer-modules';
import { FALLBACK_LEADER_DATA, fetchLeaderDashboardData } from '@/lib/leader-live-data';

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

type NumberTickerProps = {
  value: number;
  trigger: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  formatter?: (value: number) => string;
  className?: string;
};

function NumberTicker({
  value,
  trigger,
  duration = 800,
  decimals = 0,
  suffix,
  formatter,
  className,
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
    <span className={className}>
      {text}
      {suffix ?? ''}
    </span>
  );
}

function safePercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getTrendNode(direction: 'up' | 'down' | 'stable', value: number) {
  if (direction === 'up') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
        <ArrowUpRight className="h-3.5 w-3.5" /> +{value}%
      </span>
    );
  }

  if (direction === 'down') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
        <ArrowDownRight className="h-3.5 w-3.5" /> -{value}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
      <Minus className="h-3.5 w-3.5" /> 0%
    </span>
  );
}

export function OfficerDashboard() {
  const [dashboardData, setDashboardData] = useState(FALLBACK_LEADER_DATA);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoadingData(true);

    fetchLeaderDashboardData()
      .then((data) => {
        if (active) {
          setDashboardData(data);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingData(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseTick((prev) => prev + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const data = await fetchLeaderDashboardData(true).catch(() => null);
    if (data) {
      setDashboardData(data);
    }
    setIsRefreshing(false);
  };

  const moduleRows = useMemo(() => {
    return dashboardData.moduleStats
      .map((module) => {
        const completionRate = module.total > 0 ? Math.round((module.completed / module.total) * 100) : 0;
        return {
          ...module,
          completionRate: safePercent(completionRate),
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [dashboardData.moduleStats]);

  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return moduleRows;
    return moduleRows.filter((module) => module.name.toLowerCase().includes(query));
  }, [moduleRows, searchQuery]);

  const importantAlerts = useMemo(() => {
    return dashboardData.systemAlerts
      .filter((alert) => alert.priority === 'high' || alert.type === 'danger')
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [dashboardData.systemAlerts]);

  const highlightedAlert = importantAlerts.length ? importantAlerts[pulseTick % importantAlerts.length] : null;

  const workloadChartData = useMemo(() => {
    return moduleRows.slice(0, 6).map((module) => ({
      name: module.name.replace('Quản lý ', '').replace('Hành chính - ', ''),
      completed: module.completed,
      pending: module.pending,
      overdue: module.overdue,
    }));
  }, [moduleRows]);

  const monthlySeries = useMemo(() => {
    return dashboardData.kpiMonthlyData.map((row) => {
      const completionRate = row.totalCases > 0 ? (row.completedOnTime / row.totalCases) * 100 : 0;
      return {
        ...row,
        completionRate: Number(completionRate.toFixed(1)),
      };
    });
  }, [dashboardData.kpiMonthlyData]);

  const pieData = useMemo(() => {
    return dashboardData.casesByDepartment
      .map((item) => ({
        name: item.name,
        value: item.value,
        color: item.color,
      }))
      .slice(0, 8);
  }, [dashboardData.casesByDepartment]);

  const quickModules = useMemo(() => {
    const size = 4;
    if (!moduleRows.length) return [];
    const pages = Math.max(1, Math.ceil(moduleRows.length / size));
    const index = pulseTick % pages;
    return moduleRows.slice(index * size, index * size + size);
  }, [moduleRows, pulseTick]);

  const summary = dashboardData.summaryStats;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground lg:text-3xl">
              <Target className="h-7 w-7 text-primary" />
              Bảng điều hành cán bộ chuyên môn
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Theo dõi tiến độ xử lý hồ sơ theo chuyên ngành, ưu tiên xử lý đúng hạn và cảnh báo cần hành động.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Cập nhật: {new Date().toLocaleString('vi-VN')}</Badge>
              <Badge variant="outline" className="gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Đồng bộ live mỗi 5 giây
              </Badge>
              {isLoadingData && <Badge variant="secondary">Đang đồng bộ dữ liệu...</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Tháng hiện tại
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || isLoadingData}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {highlightedAlert && (
        <Card className="border-amber-200 bg-amber-50/70 p-3 transition-all duration-500">
          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-800">Cảnh báo nổi bật:</span>
              <span className="text-amber-900">{highlightedAlert.title}</span>
            </div>
            <Badge className="bg-amber-100 text-amber-700">{highlightedAlert.count}</Badge>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Tổng hồ sơ</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            <NumberTicker value={summary.totalCases} trigger={pulseTick} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">10 chuyên ngành</p>
        </Card>

        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Hoàn thành</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            <NumberTicker value={summary.completedCases} trigger={pulseTick} />
          </p>
          <p className="mt-1 text-xs text-green-600">Đúng hạn {summary.onTimeRate}%</p>
        </Card>

        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Đang xử lý</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            <NumberTicker value={summary.pendingCases} trigger={pulseTick} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Cần theo dõi sát</p>
        </Card>

        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Quá hạn</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            <NumberTicker value={summary.overdueCases} trigger={pulseTick} />
          </p>
          <p className="mt-1 text-xs text-red-600">Ưu tiên xử lý gấp</p>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="modules">Chuyên ngành</TabsTrigger>
            <TabsTrigger value="alerts">Cảnh báo ({importantAlerts.length})</TabsTrigger>
            <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm chuyên ngành..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex overflow-hidden rounded-md border border-border">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Xu hướng xử lý 6 tháng gần nhất</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart key={`officer-trend-${pulseTick % 2}`} data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalCases"
                    stroke="#3b82f6"
                    fill="#3b82f622"
                    name="Tổng hồ sơ"
                    isAnimationActive
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="completedOnTime"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Hoàn thành đúng hạn"
                    isAnimationActive
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="overdue"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Quá hạn"
                    isAnimationActive
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Nhiệm vụ cần ưu tiên</h3>
              <div className="space-y-3">
                {quickModules.map((module) => {
                  const officerModule = OFFICER_MODULES.find((m) => m.id === module.id);
                  return (
                    <div key={module.id} className="rounded-md border border-border p-3 transition-all duration-500 hover:bg-muted/30">
                      <p className="text-sm font-semibold text-foreground">{module.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {module.pending} đang xử lý • {module.overdue} quá hạn
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Hoàn thành {module.completionRate}%</span>
                        <Link href={officerModule?.functions[0]?.path || '/dashboard'}>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      <Progress value={module.completionRate} className="mt-1 h-1.5" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredModules.map((module) => {
                const Icon = module.icon;
                const officerModule = OFFICER_MODULES.find((m) => m.id === module.id);
                return (
                  <Card key={module.id} className="p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl p-3" style={{ backgroundColor: `${module.color}20` }}>
                          <Icon className="h-6 w-6" style={{ color: module.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{module.name}</h3>
                          <p className="text-xs text-muted-foreground">{officerModule?.functions.length || 0} chức năng</p>
                        </div>
                      </div>
                      {getTrendNode(module.trendDirection, module.trend)}
                    </div>

                    <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{module.total}</p>
                        <p className="text-xs text-muted-foreground">Tổng</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{module.completed}</p>
                        <p className="text-xs text-muted-foreground">Xong</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-amber-600">{module.pending}</p>
                        <p className="text-xs text-muted-foreground">Chờ</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-red-600">{module.overdue}</p>
                        <p className="text-xs text-muted-foreground">Trễ</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Tiến độ</span>
                        <span className="font-semibold text-foreground">{module.completionRate}%</span>
                      </div>
                      <Progress value={module.completionRate} className="h-2" />
                    </div>

                    <Link href={officerModule?.functions[0]?.path || '/dashboard'}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        Mở chuyên ngành
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Chuyên ngành</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Tổng</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Hoàn thành</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Đang xử lý</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Quá hạn</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Tiến độ</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Xu hướng</th>
                    <th className="p-4 text-right text-sm font-medium text-muted-foreground">Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((module) => {
                    const Icon = module.icon;
                    const officerModule = OFFICER_MODULES.find((m) => m.id === module.id);
                    return (
                      <tr key={module.id} className="border-t border-border transition-colors hover:bg-muted/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg p-2" style={{ backgroundColor: `${module.color}20` }}>
                              <Icon className="h-5 w-5" style={{ color: module.color }} />
                            </div>
                            <span className="font-medium text-foreground">{module.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-semibold">{module.total}</td>
                        <td className="p-4 text-center font-semibold text-green-600">{module.completed}</td>
                        <td className="p-4 text-center font-semibold text-amber-600">{module.pending}</td>
                        <td className="p-4 text-center font-semibold text-red-600">{module.overdue}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Progress value={module.completionRate} className="h-2 flex-1" />
                            <span className="w-10 text-xs font-semibold">{module.completionRate}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">{getTrendNode(module.trendDirection, module.trend)}</td>
                        <td className="p-4 text-right">
                          <Link href={officerModule?.functions[0]?.path || '/dashboard'}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              Mở
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {dashboardData.systemAlerts.map((alert) => (
              <Card key={alert.id} className="p-4 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        alert.type === 'danger'
                          ? 'bg-red-100 text-red-700'
                          : alert.type === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : alert.type === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {alert.type === 'danger' ? <AlertTriangle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{alert.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {alert.priority === 'high' ? 'Cao' : alert.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{alert.module}</Badge>
                        <span>{new Date(alert.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-muted text-foreground">{alert.count}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Phân bổ khối lượng theo chuyên ngành</h3>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart key={`officer-stats-${pulseTick % 2}`} data={workloadChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={110} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Hoàn thành" isAnimationActive animationDuration={900} />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Đang xử lý" isAnimationActive animationDuration={900} />
                  <Bar dataKey="overdue" stackId="a" fill="#ef4444" name="Quá hạn" isAnimationActive animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Tỷ trọng hồ sơ theo lĩnh vực</h3>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={130}
                    innerRadius={62}
                    label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                    isAnimationActive
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Hiệu quả xử lý theo tháng</h3>
              <Badge className="bg-emerald-100 text-emerald-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Theo dõi chất lượng SLA
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart key={`officer-line-${pulseTick % 2}`} data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="completedOnTime"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Đúng hạn"
                  isAnimationActive
                  animationDuration={1000}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="overdue"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Quá hạn"
                  isAnimationActive
                  animationDuration={1000}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Tỷ lệ hoàn thành (%)"
                  isAnimationActive
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
