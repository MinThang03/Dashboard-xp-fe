'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  MapPin,
  Minus,
  RefreshCw,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
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
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { FALLBACK_LEADER_DATA, fetchLeaderDashboardData } from '@/lib/leader-live-data';
import { getLeaderSignalSnapshot } from '@/lib/frontend-dss';

const PERIOD_OPTIONS = [
  { value: 3, label: '3 tháng' },
  { value: 6, label: '6 tháng' },
] as const;

type DomainGroup = {
  id: string;
  name: string;
  modules: string[];
  color: string;
};

const DOMAIN_GROUPS: DomainGroup[] = [
  {
    id: 'service',
    name: 'Dịch vụ công',
    modules: ['hanh-chinh-tu-phap', 'y-te-giao-duc', 'lao-dong-tbxh'],
    color: '#3b82f6',
  },
  {
    id: 'economy',
    name: 'Kinh tế - Tài chính',
    modules: ['kinh-te-thuong-mai', 'tai-chinh'],
    color: '#0ea5e9',
  },
  {
    id: 'security',
    name: 'An ninh - Giám sát',
    modules: ['quoc-phong-an-ninh'],
    color: '#ef4444',
  },
  {
    id: 'infrastructure',
    name: 'Hạ tầng - Đất đai - Môi trường - Văn hóa',
    modules: ['xay-dung-ha-tang', 'dia-chinh', 'moi-truong', 'van-hoa-du-lich'],
    color: '#14b8a6',
  },
];

const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

function shortLabel(value: string) {
  const compact = value.replace('Hành chính - ', '').replace('Quản lý ', '');
  if (compact.length <= 14) return compact;
  return `${compact.slice(0, 14)}...`;
}

function safePercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sum(values: number[]) {
  return values.reduce((acc, curr) => acc + curr, 0);
}

type NumberTickerProps = {
  value: number;
  trigger: number;
  duration?: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  formatter?: (value: number) => string;
};

function NumberTicker({
  value,
  trigger,
  duration = 900,
  decimals = 0,
  className,
  suffix,
  formatter,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();
    const from = value === 0 ? 0 : Math.max(0, value * 0.92);
    const to = value;

    const animate = (currentTime: number) => {
      const progress = Math.min(1, (currentTime - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(from + (to - from) * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [duration, trigger, value]);

  const formatted = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span className={className}>
      {formatted}
      {suffix ?? ''}
    </span>
  );
}

export function LeaderDashboard() {
  const [dashboardData, setDashboardData] = useState(FALLBACK_LEADER_DATA);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trendWindow, setTrendWindow] = useState<number>(6);
  const [pulseTick, setPulseTick] = useState(0);
  const leaderSignals = useMemo(() => getLeaderSignalSnapshot(), []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const data = await fetchLeaderDashboardData(true).catch(() => null);
    if (data) {
      setDashboardData(data);
    }
    setIsRefreshing(false);
  };

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

  const moduleRows = useMemo(() => {
    return dashboardData.moduleStats
      .map((module) => {
        const completionRate = module.total > 0 ? Math.round((module.completed / module.total) * 100) : 0;
        const onTimeRate = module.completed > 0 ? Math.round(((module.completed - module.overdue) / module.completed) * 100) : 0;
        const overdueRate = module.total > 0 ? Math.round((module.overdue / module.total) * 100) : 0;
        return {
          ...module,
          completionRate: safePercent(completionRate),
          onTimeRate: safePercent(onTimeRate),
          overdueRate: safePercent(overdueRate),
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [dashboardData.moduleStats]);

  const monthlySeries = useMemo(() => {
    return dashboardData.kpiMonthlyData.slice(-trendWindow).map((row) => {
      const onTimeRate = row.totalCases > 0 ? (row.completedOnTime / row.totalCases) * 100 : 0;
      const overdueRate = row.totalCases > 0 ? (row.overdue / row.totalCases) * 100 : 0;
      return {
        ...row,
        onTimeRate: Number(onTimeRate.toFixed(1)),
        overdueRate: Number(overdueRate.toFixed(1)),
      };
    });
  }, [dashboardData.kpiMonthlyData, trendWindow]);

  const moduleTrendData = useMemo(() => {
    return moduleRows.map((row) => ({
      name: shortLabel(row.name),
      completed: row.completed,
      pending: row.pending,
      overdue: row.overdue,
    }));
  }, [moduleRows]);

  const budgetTotals = useMemo(() => {
    const allocated = sum(dashboardData.budgetByDepartment.map((item) => item.allocated));
    const spent = sum(dashboardData.budgetByDepartment.map((item) => item.spent));
    const percent = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;

    return {
      allocated,
      spent,
      remaining: Math.max(allocated - spent, 0),
      percent: safePercent(percent),
    };
  }, [dashboardData.budgetByDepartment]);

  const alertByPriority = useMemo(() => {
    const high = sum(
      dashboardData.systemAlerts.filter((alert) => alert.priority === 'high').map((alert) => alert.count),
    );
    const medium = sum(
      dashboardData.systemAlerts.filter((alert) => alert.priority === 'medium').map((alert) => alert.count),
    );
    const low = sum(
      dashboardData.systemAlerts.filter((alert) => alert.priority === 'low').map((alert) => alert.count),
    );

    return [
      { name: 'Cao', value: high, color: '#ef4444' },
      { name: 'Trung bình', value: medium, color: '#f59e0b' },
      { name: 'Thấp', value: low, color: '#3b82f6' },
    ].filter((item) => item.value > 0);
  }, [dashboardData.systemAlerts]);

  const hotspotBySeverity = useMemo(() => {
    const high = dashboardData.hotspots.filter((spot) => spot.severity === 'high').length;
    const medium = dashboardData.hotspots.filter((spot) => spot.severity === 'medium').length;
    const low = dashboardData.hotspots.filter((spot) => spot.severity === 'low').length;

    return [
      { name: 'Nghiêm trọng', value: high },
      { name: 'Trung bình', value: medium },
      { name: 'Theo dõi', value: low },
    ].filter((item) => item.value > 0);
  }, [dashboardData.hotspots]);

  const domainBoard = useMemo(() => {
    return DOMAIN_GROUPS.map((group) => {
      const modules = moduleRows.filter((module) => group.modules.includes(module.id));
      const totalCases = sum(modules.map((module) => module.total));
      const completedCases = sum(modules.map((module) => module.completed));
      const overdueCases = sum(modules.map((module) => module.overdue));
      const pendingCases = sum(modules.map((module) => module.pending));

      const completionRate = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;
      const overdueRate = totalCases > 0 ? Math.round((overdueCases / totalCases) * 100) : 0;

      return {
        ...group,
        totalCases,
        completedCases,
        overdueCases,
        pendingCases,
        completionRate: safePercent(completionRate),
        overdueRate: safePercent(overdueRate),
      };
    });
  }, [moduleRows]);

  const qualityRadarData = useMemo(() => {
    const criticalAlertCount = dashboardData.systemAlerts.filter((alert) => alert.priority === 'high').length;
    const alertControl = Math.max(0, 100 - criticalAlertCount * 10);

    const highHotspots = dashboardData.hotspots.filter((spot) => spot.severity === 'high').length;
    const hotspotControl = Math.max(0, 100 - highHotspots * 8);

    const avgCompletion = moduleRows.length
      ? Math.round(sum(moduleRows.map((row) => row.completionRate)) / moduleRows.length)
      : 0;
    const avgOnTime = moduleRows.length ? Math.round(sum(moduleRows.map((row) => row.onTimeRate)) / moduleRows.length) : 0;

    const officerQuality = dashboardData.officerKpiData.length
      ? Math.round(
          sum(dashboardData.officerKpiData.map((officer) => officer.qualityScore)) /
            dashboardData.officerKpiData.length,
        )
      : 0;

    return [
      { metric: 'Hoàn thành', value: avgCompletion },
      { metric: 'Đúng hạn', value: avgOnTime },
      { metric: 'Giải ngân', value: budgetTotals.percent },
      { metric: 'Kiểm soát cảnh báo', value: alertControl },
      { metric: 'Kiểm soát điểm nóng', value: hotspotControl },
      { metric: 'Năng lực cán bộ', value: officerQuality },
    ];
  }, [dashboardData.hotspots, dashboardData.officerKpiData, dashboardData.systemAlerts, budgetTotals.percent, moduleRows]);

  const topOfficers = useMemo(() => {
    return [...dashboardData.officerKpiData]
      .sort((a, b) => b.qualityScore - a.qualityScore)
      .slice(0, 8);
  }, [dashboardData.officerKpiData]);

  const priorityAlerts = useMemo(() => {
    return [...dashboardData.systemAlerts]
      .sort((a, b) => {
        if (a.priority === b.priority) return b.count - a.count;
        if (a.priority === 'high') return -1;
        if (b.priority === 'high') return 1;
        if (a.priority === 'medium') return -1;
        return 1;
      })
      .slice(0, 6);
  }, [dashboardData.systemAlerts]);

  const executiveRecommendations = useMemo(() => {
    const recommendations: string[] = [];

    if (dashboardData.summaryStats.overdueCases > 30) {
      recommendations.push('Khoanh vùng tổ công tác xử lý hồ sơ trễ hạn trong 48h tới.');
    }

    if (budgetTotals.percent >= 90) {
      recommendations.push('Kích hoạt cơ chế giám sát ngân sách sát sao cho các lĩnh vực sắp vượt dự toán.');
    }

    if (leaderSignals.tongRuiRoHienTai >= 7) {
      recommendations.push('Ưu tiên họp điều hành nhanh với các đơn vị có chỉ số rủi ro cao.');
    }

    if (!recommendations.length) {
      recommendations.push('Hệ thống ổn định, duy trì nhịp cập nhật và giám sát theo ca trực.');
    }

    return recommendations;
  }, [budgetTotals.percent, dashboardData.summaryStats.overdueCases, leaderSignals.tongRuiRoHienTai]);

  const topRiskModules = useMemo(() => {
    return [...moduleRows].sort((a, b) => b.overdue - a.overdue).slice(0, 6);
  }, [moduleRows]);

  const periodLabel = PERIOD_OPTIONS.find((item) => item.value === trendWindow)?.label ?? '6 tháng';

  const officerPageSize = 4;
  const officerPages = Math.max(1, Math.ceil(topOfficers.length / officerPageSize));
  const officerPageIndex = pulseTick % officerPages;
  const visibleOfficers = topOfficers.slice(
    officerPageIndex * officerPageSize,
    officerPageIndex * officerPageSize + officerPageSize,
  );

  const riskPageSize = 3;
  const riskPages = Math.max(1, Math.ceil(topRiskModules.length / riskPageSize));
  const riskPageIndex = pulseTick % riskPages;
  const visibleRiskModules = topRiskModules.slice(
    riskPageIndex * riskPageSize,
    riskPageIndex * riskPageSize + riskPageSize,
  );

  const rollingModules = useMemo(() => {
    if (!moduleRows.length) return [];
    const start = pulseTick % moduleRows.length;
    const doubled = [...moduleRows, ...moduleRows];
    return doubled.slice(start, start + Math.min(4, moduleRows.length));
  }, [moduleRows, pulseTick]);

  const highlightedAlert = priorityAlerts.length ? priorityAlerts[pulseTick % priorityAlerts.length] : null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground lg:text-3xl">
              <Target className="h-7 w-7 text-primary" />
              Trung tâm điều hành lãnh đạo
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tổng hợp theo dữ liệu DB thực tế của 10 lĩnh vực, tập trung KPI, cảnh báo và quyết định điều hành.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Cập nhật: {new Date().toLocaleString('vi-VN')}</Badge>
              <Badge variant="secondary">Khung báo cáo: {periodLabel}</Badge>
              <Badge variant="outline" className="gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Live mỗi 5 giây
              </Badge>
              {isLoadingData && <Badge variant="outline">Đang đồng bộ dữ liệu...</Badge>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={trendWindow === option.value ? 'default' : 'outline'}
                onClick={() => setTrendWindow(option.value)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {option.label}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || isLoadingData}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {highlightedAlert && (
        <Card className="border-red-200 bg-red-50/70 p-3 transition-all duration-500">
          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-700">Cảnh báo nổi bật:</span>
              <span className="text-red-800">{highlightedAlert.title}</span>
            </div>
            <Badge className="bg-red-100 text-red-700">{highlightedAlert.count}</Badge>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng hồ sơ giám sát</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                <NumberTicker value={dashboardData.summaryStats.totalCases} trigger={pulseTick} decimals={0} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{moduleRows.length} lĩnh vực được đồng bộ</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tỷ lệ đúng hạn</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                <NumberTicker value={dashboardData.summaryStats.onTimeRate} trigger={pulseTick} suffix="%" />
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Hồ sơ hoàn thành đúng hạn
              </p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hồ sơ trễ hạn</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                <NumberTicker value={dashboardData.summaryStats.overdueCases} trigger={pulseTick} />
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <Clock3 className="h-3.5 w-3.5" />
                Ưu tiên xử lý trong ngày
              </p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tiến độ giải ngân</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                <NumberTicker value={budgetTotals.percent} trigger={pulseTick} suffix="%" />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <NumberTicker
                  value={budgetTotals.spent}
                  trigger={pulseTick}
                  formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')}`}
                />
                {' / '}
                {budgetTotals.allocated.toLocaleString('vi-VN')} tr
              </p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <Progress value={budgetTotals.percent} className="mt-3 h-2" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Xu hướng SLA và tồn đọng</h2>
              <p className="text-xs text-muted-foreground">Theo dữ liệu Hồ sơ TTHC trong {periodLabel}</p>
            </div>
            <Badge variant="secondary">Độ tin cậy dự báo {leaderSignals.doTinCayDuBao}%</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart key={`sla-${pulseTick % 2}`} data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="totalCases"
                stroke="#3b82f6"
                fill="#3b82f633"
                name="Tổng hồ sơ"
                isAnimationActive
                animationDuration={1200}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="completedOnTime"
                stroke="#22c55e"
                fill="#22c55e22"
                name="Hoàn thành đúng hạn"
                isAnimationActive
                animationDuration={1200}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="overdueRate"
                stroke="#ef4444"
                strokeWidth={2}
                name="Tỷ lệ trễ hạn (%)"
                isAnimationActive
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Cảnh báo ưu tiên</h2>
            <Badge className="bg-red-100 text-red-700">{dashboardData.summaryStats.criticalAlerts} cao</Badge>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {priorityAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="rounded-md border border-border p-3 transition-all duration-500 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.module}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      alert.priority === 'high'
                        ? 'border-red-300 text-red-700'
                        : alert.priority === 'medium'
                        ? 'border-amber-300 text-amber-700'
                        : 'border-blue-300 text-blue-700'
                    }
                  >
                    {alert.count}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Phân bố mức độ cảnh báo</h2>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={alertByPriority}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={80}
                isAnimationActive
                animationDuration={1100}
              >
                {alertByPriority.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 text-xs">
            {alertByPriority.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Năng lực điều hành theo cụm lĩnh vực</h2>
            <Badge variant="outline">Tổng hợp từ 10 lĩnh vực</Badge>
          </div>
          <div className="space-y-3">
            {domainBoard.map((domain) => (
              <div key={domain.id} className="rounded-md border border-border p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{domain.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {domain.totalCases.toLocaleString('vi-VN')} hồ sơ • {domain.pendingCases} đang xử lý • {domain.overdueCases} trễ hạn
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Hoàn thành {domain.completionRate}%</Badge>
                    <Badge
                      className={
                        domain.overdueRate >= 10
                          ? 'bg-red-100 text-red-700'
                          : domain.overdueRate >= 6
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }
                    >
                      Trễ hạn {domain.overdueRate}%
                    </Badge>
                  </div>
                </div>
                <Progress value={domain.completionRate} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Chỉ số vận hành tổng hợp</h2>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart key={`radar-${pulseTick % 2}`} data={qualityRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f666"
                isAnimationActive
                animationDuration={1200}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Phân rã hồ sơ theo lĩnh vực</h2>
            <Badge variant="outline">Hoàn thành / Đang xử lý / Trễ hạn</Badge>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart key={`module-bar-${pulseTick % 2}`} data={moduleTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#22c55e" name="Hoàn thành" isAnimationActive animationDuration={1000} />
              <Bar dataKey="pending" fill="#f59e0b" name="Đang xử lý" isAnimationActive animationDuration={1000} />
              <Bar dataKey="overdue" fill="#ef4444" name="Trễ hạn" isAnimationActive animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Điểm nóng GIS</h2>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={hotspotBySeverity}
                dataKey="value"
                nameKey="name"
                innerRadius={36}
                outerRadius={62}
                isAnimationActive
                animationDuration={1000}
              >
                {hotspotBySeverity.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {dashboardData.hotspots.slice(0, 4).map((spot) => (
              <div key={spot.id} className="rounded-md border border-border p-2.5 text-xs transition-all duration-500 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{spot.name}</p>
                    <p className="text-muted-foreground">{spot.location}</p>
                  </div>
                  <Badge
                    className={
                      spot.severity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : spot.severity === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }
                  >
                    {spot.severity === 'high' ? 'Cao' : spot.severity === 'medium' ? 'TB' : 'Thấp'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Tổng quan ngân sách theo lĩnh vực</h2>
            <Badge variant="outline">Đơn vị: triệu VND</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart key={`budget-${pulseTick % 2}`} data={dashboardData.budgetByDepartment} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={96} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} tr`} />
              <Legend />
              <Bar dataKey="allocated" fill="#6366f1" name="Dự toán" isAnimationActive animationDuration={900} />
              <Bar dataKey="spent" fill="#06b6d4" name="Đã giải ngân" isAnimationActive animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-muted/40 p-2">
              <p className="text-muted-foreground">Tổng dự toán</p>
              <p className="font-semibold text-foreground">
                <NumberTicker
                  value={budgetTotals.allocated}
                  trigger={pulseTick}
                  formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')} tr`}
                />
              </p>
            </div>
            <div className="rounded-md bg-muted/40 p-2">
              <p className="text-muted-foreground">Còn lại</p>
              <p className="font-semibold text-foreground">
                <NumberTicker
                  value={budgetTotals.remaining}
                  trigger={pulseTick}
                  formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')} tr`}
                />
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Rủi ro 7 ngày và chỉ đạo</h2>
            <Badge className="bg-amber-100 text-amber-700">
              Điểm <NumberTicker value={leaderSignals.tongRuiRoHienTai} trigger={pulseTick} />
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart key={`risk-${pulseTick % 2}`} data={leaderSignals.xuHuongRuiRo7Ngay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="ngay" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="diemRuiRo"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Điểm rủi ro"
                isAnimationActive
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="#ef4444"
                strokeWidth={2}
                name="Critical"
                isAnimationActive
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-3 space-y-2 text-sm">
            {executiveRecommendations.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-md border border-border px-3 py-2 transition-all duration-500 hover:bg-muted/30">
                <ShieldAlert className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Dòng dữ liệu trực tiếp</h2>
          <Badge variant="secondary">Tự động trượt mỗi 5 giây</Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {rollingModules.map((row) => (
            <div key={row.id} className="rounded-md border border-border p-3 transition-all duration-500">
              <p className="font-medium text-foreground">{row.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tổng: {row.total.toLocaleString('vi-VN')} • Trễ hạn: {row.overdue}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                {row.trendDirection === 'up' ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                ) : row.trendDirection === 'down' ? (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-slate-500" />
                )}
                <span
                  className={
                    row.trendDirection === 'up'
                      ? 'font-semibold text-green-600'
                      : row.trendDirection === 'down'
                      ? 'font-semibold text-red-600'
                      : 'font-semibold text-slate-600'
                  }
                >
                  Xu hướng {row.trend}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Bảng điều hành chi tiết 10 lĩnh vực</h2>
          <Badge variant="secondary">Sắp xếp theo tổng khối lượng</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-2 py-2">Lĩnh vực</th>
                <th className="px-2 py-2 text-right">Tổng</th>
                <th className="px-2 py-2 text-right">Hoàn thành</th>
                <th className="px-2 py-2 text-right">Đang xử lý</th>
                <th className="px-2 py-2 text-right">Trễ hạn</th>
                <th className="px-2 py-2 text-right">SLA</th>
                <th className="px-2 py-2 text-right">Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              {moduleRows.map((row) => (
                <tr key={row.id} className="border-b border-border/60 transition-colors duration-500 hover:bg-muted/30">
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="font-medium text-foreground">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-right font-semibold text-foreground">{row.total.toLocaleString('vi-VN')}</td>
                  <td className="px-2 py-2 text-right text-green-600">{row.completed.toLocaleString('vi-VN')}</td>
                  <td className="px-2 py-2 text-right text-amber-600">{row.pending.toLocaleString('vi-VN')}</td>
                  <td className="px-2 py-2 text-right text-red-600">{row.overdue.toLocaleString('vi-VN')}</td>
                  <td className="px-2 py-2 text-right">
                    <Badge variant="outline">{row.onTimeRate}%</Badge>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <span className="inline-flex items-center gap-1">
                      {row.trendDirection === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : row.trendDirection === 'down' ? (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-slate-500" />
                      )}
                      <span
                        className={
                          row.trendDirection === 'up'
                            ? 'font-semibold text-green-600'
                            : row.trendDirection === 'down'
                            ? 'font-semibold text-red-600'
                            : 'font-semibold text-slate-600'
                        }
                      >
                        {row.trend}%
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Top cán bộ KPI</h2>
            <Badge variant="outline">Trang {officerPageIndex + 1}/{officerPages}</Badge>
          </div>
          <div className="space-y-3">
            {visibleOfficers.map((officer) => (
              <div key={officer.id} className="rounded-md border border-border p-3 transition-all duration-500 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{officer.name}</p>
                    <p className="text-xs text-muted-foreground">{officer.department}</p>
                  </div>
                  <Badge
                    className={
                      officer.qualityScore >= 90
                        ? 'bg-green-100 text-green-700'
                        : officer.qualityScore >= 80
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }
                  >
                    {officer.qualityScore}/100
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded bg-muted/50 p-2 text-center">
                    <p className="text-muted-foreground">Hoàn thành</p>
                    <p className="font-semibold text-foreground">{officer.completionRate}%</p>
                  </div>
                  <div className="rounded bg-muted/50 p-2 text-center">
                    <p className="text-muted-foreground">Đúng hạn</p>
                    <p className="font-semibold text-blue-600">{officer.onTimeRate}%</p>
                  </div>
                  <div className="rounded bg-muted/50 p-2 text-center">
                    <p className="text-muted-foreground">Hài lòng</p>
                    <p className="font-semibold text-purple-600">{officer.satisfactionRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Lĩnh vực cần tập trung</h2>
            <Badge className="bg-red-100 text-red-700">Trang {riskPageIndex + 1}/{riskPages}</Badge>
          </div>
          <div className="space-y-3">
            {visibleRiskModules.map((module) => (
              <div key={module.id} className="rounded-md border border-border p-3 transition-all duration-500 hover:bg-muted/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{module.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {module.pending} đang xử lý • {module.overdue} trễ hạn
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-700">{module.overdueRate}%</Badge>
                </div>
                <Progress value={module.completionRate} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/approvals">
                <CheckCircle2 className="h-4 w-4" />
                Phê duyệt hồ sơ
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/alerts">
                <Bell className="h-4 w-4" />
                Quản trị cảnh báo
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/dashboard/reports">
                <Download className="h-4 w-4" />
                Báo cáo chi tiết
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
