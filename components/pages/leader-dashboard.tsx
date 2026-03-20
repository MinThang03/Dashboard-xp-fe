'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  FileText,
  BarChart3,
  MapPin,
  Users,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Bell,
  Activity,
  DollarSign,
  ChevronRight,
  Eye,
  Target,
  Star,
  Award,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

import { OFFICER_MODULES } from '@/lib/officer-modules';
import {
  MODULE_STATISTICS,
  SYSTEM_ALERTS,
  SUMMARY_STATS,
  KPI_MONTHLY_DATA,
  CASES_BY_DEPARTMENT,
  BUDGET_BY_DEPARTMENT,
  HOTSPOT_DATA,
  getHighPriorityAlerts,
} from '@/lib/dashboard-stats';
import { FIELD_STATISTICS, OVERALL_STATISTICS, ALERTS, OFFICER_KPI_DATA, FIELD_KPI_DETAILED } from '@/lib/leader-data';

// Radar data cho KPI theo lĩnh vực
const radarData = FIELD_STATISTICS.map((field) => ({
  subject: field.name.split(' - ')[0].slice(0, 10),
  A: field.completionRate,
  fullMark: 100,
}));

export function LeaderDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const highPriorityAlerts = getHighPriorityAlerts();

  return (
    <div className="space-y-6">
      {/* Page Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-6 border border-border">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Bảng điều khiển Lãnh đạo
          </h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan KPI, ngân sách và cảnh báo thời gian thực - 10 Chuyên ngành
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Tháng 1/2026
          </Button>
          <Button className="gap-2 bg-primary">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Cards - Tổng quan nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Tỷ lệ đúng hạn */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Tỷ lệ đúng hạn</p>
              <p className="text-4xl font-bold text-foreground mt-2">{SUMMARY_STATS.onTimeRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+5% so với tháng trước</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Tổng hồ sơ */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Tổng hồ sơ xử lý</p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {SUMMARY_STATS.totalCases.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
                <span>10 chuyên ngành</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Hồ sơ trễ hạn */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Hồ sơ trễ hạn</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{SUMMARY_STATS.overdueCases}</p>
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>Cần xử lý gấp</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        {/* Cảnh báo */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Cảnh báo hệ thống</p>
              <p className="text-4xl font-bold text-amber-600 mt-2">{SUMMARY_STATS.totalAlerts}</p>
              <div className="flex items-center gap-1 mt-2 text-amber-600 text-sm">
                <span>{SUMMARY_STATS.criticalAlerts} cảnh báo quan trọng</span>
              </div>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        {/* Hài lòng */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm font-medium">Hài lòng trung bình</p>
              <p className="text-4xl font-bold text-foreground mt-2">{SUMMARY_STATS.avgSatisfaction}/5.0</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < 4 ? 'text-yellow-500' : 'text-muted-foreground'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="departments">10 Chuyên ngành</TabsTrigger>
          <TabsTrigger value="kpi-officers">KPI Cán bộ</TabsTrigger>
          <TabsTrigger value="kpi-fields">KPI Lĩnh vực</TabsTrigger>
          <TabsTrigger value="budget">Ngân sách</TabsTrigger>
          <TabsTrigger value="alerts">Cảnh báo ({highPriorityAlerts.length})</TabsTrigger>
          <TabsTrigger value="hotspots">Điểm nóng GIS</TabsTrigger>
        </TabsList>

        {/* Tab: Tổng quan */}
        <TabsContent value="overview" className="space-y-6">
          {/* Row 1: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Xu hướng hồ sơ đúng hạn vs trễ hạn */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Xu hướng hồ sơ đúng hạn vs trễ hạn
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={KPI_MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #2a2a3e',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="completedOnTime"
                    stroke="#4ade80"
                    fill="#4ade8040"
                    name="Đúng hạn"
                  />
                  <Area
                    type="monotone"
                    dataKey="overdue"
                    stroke="#f87171"
                    fill="#f8717140"
                    name="Trễ hạn"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* KPI theo lĩnh vực - Radar */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Tỷ lệ hoàn thành theo lĩnh vực
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2a3e" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                  <Radar
                    name="Hoàn thành %"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="#8b5cf680"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #2a2a3e',
                      borderRadius: '8px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Row 2: Cảnh báo + Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cảnh báo quan trọng */}
            <Card className="lg:col-span-2 bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Cảnh báo cần chú ý
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {highPriorityAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.type === 'danger'
                        ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle
                            className={`w-4 h-4 ${
                              alert.type === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                            }`}
                          />
                          <span className="font-medium text-foreground">{alert.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {alert.module}
                        </Badge>
                      </div>
                      <span className="text-2xl font-bold text-foreground">{alert.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top 5 lĩnh vực có hồ sơ trễ */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Lĩnh vực cần chú ý
              </h3>
              <div className="space-y-3">
                {MODULE_STATISTICS.filter((m) => m.overdue > 0)
                  .sort((a, b) => b.overdue - a.overdue)
                  .slice(0, 5)
                  .map((module) => {
                    const Icon = module.icon;
                    return (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg bg-opacity-100"
                            style={{
                              backgroundColor: module.color.includes('rgb') ? `${module.color}20` : `${module.color}20`,
                            }}
                          >
                            <Icon className="w-4 h-4" style={{ color: module.color }} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{module.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {module.pending} đang xử lý
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700">
                          {module.overdue} trễ
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: 10 Chuyên ngành */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {MODULE_STATISTICS.map((module) => {
              const Icon = module.icon;
              const officerModule = OFFICER_MODULES.find((m) => m.id === module.id);
              const completionRate = Math.round((module.completed / module.total) * 100);

              return (
                <Card
                  key={module.id}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${module.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: module.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate">
                        {module.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {officerModule?.functions.length || 0} chức năng
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                      <p className="text-lg font-bold text-foreground">{module.total}</p>
                      <p className="text-xs text-muted-foreground">Tổng</p>
                    </div>
                    <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                      <p className="text-lg font-bold text-green-500">{module.completed}</p>
                      <p className="text-xs text-muted-foreground">Xong</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="font-medium text-foreground">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between">
                    {module.overdue > 0 ? (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                        {module.overdue} trễ hạn
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Tốt
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      {module.trendDirection === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs ${
                          module.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {module.trend}%
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Biểu đồ so sánh */}
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              So sánh hồ sơ theo chuyên ngành
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={CASES_BY_DEPARTMENT}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#4ade80" name="Hoàn thành" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#facc15" name="Đang xử lý" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" fill="#f87171" name="Quá hạn" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Tab: KPI Cán bộ */}
        <TabsContent value="kpi-officers" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Theo dõi KPI cán bộ
              </h3>
            </div>

            {/* Officer KPI Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {OFFICER_KPI_DATA.map((officer) => (
                <Card key={officer.id} className="p-4 border-border bg-card hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{officer.name}</h4>
                        <p className="text-sm text-muted-foreground">{officer.position}</p>
                        <p className="text-xs text-muted-foreground">{officer.department}</p>
                      </div>
                      <Badge
                        className={`${
                          officer.qualityScore >= 95
                            ? 'bg-green-500/20 text-green-600 border-green-500/30'
                            : officer.qualityScore >= 85
                            ? 'bg-blue-500/20 text-blue-600 border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
                        }`}
                      >
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {officer.qualityScore}/100
                      </Badge>
                    </div>

                    {/* KPI Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-slate-50 dark:bg-slate-900/30 rounded p-2">
                        <p className="text-muted-foreground text-xs">Hoàn thành</p>
                        <p className="font-semibold text-foreground">
                          {officer.completedCases}/{officer.targetCases}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/30 rounded p-2">
                        <p className="text-muted-foreground text-xs">Tỷ lệ %</p>
                        <p className="font-semibold text-green-600">{officer.completionRate}%</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/30 rounded p-2">
                        <p className="text-muted-foreground text-xs">Đúng hạn</p>
                        <p className="font-semibold text-blue-600">{officer.onTimeRate}%</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/30 rounded p-2">
                        <p className="text-muted-foreground text-xs">Hài lòng</p>
                        <p className="font-semibold text-purple-600">{officer.satisfactionRate}%</p>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Tỷ lệ hoàn thành</span>
                          <span className="font-medium text-foreground">{officer.completionRate}%</span>
                        </div>
                        <Progress value={officer.completionRate} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Tỷ lệ đúng hạn</span>
                          <span className="font-medium text-foreground">{officer.onTimeRate}%</span>
                        </div>
                        <Progress value={officer.onTimeRate} className="h-1.5" />
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="flex items-center gap-2 text-sm">
                      {officer.trendDirection === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={officer.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}
                      >
                        {officer.trendDirection === 'up' ? '+' : ''}{officer.trend}% so với tháng trước
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab: KPI Lĩnh vực */}
        <TabsContent value="kpi-fields" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Theo dõi KPI lĩnh vực
              </h3>
            </div>

            {/* Field KPI Comparison Table */}
            <Card className="p-6 border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-semibold text-foreground py-3 px-3">Lĩnh vực</th>
                    <th className="text-center font-semibold text-foreground py-3 px-3">Chỉ tiêu</th>
                    <th className="text-center font-semibold text-foreground py-3 px-3">Hoàn thành</th>
                    <th className="text-center font-semibold text-foreground py-3 px-3">Tỷ lệ %</th>
                    <th className="text-center font-semibold text-foreground py-3 px-3">Đúng hạn %</th>
                    <th className="text-center font-semibold text-foreground py-3 px-3">Hài lòng %</th>
                    <th className="text-center font-semibold text-foreground py-3 px-3">Giải ngân %</th>
                    <th className="text-center font-semibold text-foreground py-3 px-3">Xu hướng</th>
                  </tr>
                </thead>
                <tbody>
                  {FIELD_KPI_DETAILED.map((field) => (
                    <tr
                      key={field.code}
                      className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: field.color }}
                          ></div>
                          <span className="font-medium text-foreground">{field.name}</span>
                        </div>
                      </td>
                      <td className="text-center text-foreground font-semibold">
                        {field.targetCases}
                      </td>
                      <td className="text-center text-foreground">{field.completedCases}</td>
                      <td className="text-center font-semibold text-green-600">
                        {field.completionRate}%
                      </td>
                      <td className="text-center font-semibold text-blue-600">
                        {field.onTimeRate}%
                      </td>
                      <td className="text-center font-semibold text-purple-600">
                        {field.satisfactionRate}%
                      </td>
                      <td className="text-center font-semibold text-cyan-600">
                        {field.budgetExecution}%
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {field.trendDirection === 'up' ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">+{field.trend}%</span>
                            </>
                          ) : field.trendDirection === 'down' ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="text-red-600 font-medium">{field.trend}%</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Field KPI Details Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {FIELD_KPI_DETAILED.slice(0, 4).map((field) => (
                <Card
                  key={field.code}
                  className="p-4 border-border bg-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setSelectedField(selectedField === field.code ? null : field.code)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${field.color}20` }}
                      >
                        <div
                          className="w-5 h-5 rounded"
                          style={{ backgroundColor: field.color }}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{field.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {field.completedCases}/{field.targetCases} hoàn thành
                        </p>
                      </div>
                    </div>

                    {/* Mini Stats */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-900/30 rounded p-2 text-center">
                        <p className="text-muted-foreground">Tỷ lệ</p>
                        <p className="font-semibold text-green-600">{field.completionRate}%</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/30 rounded p-2 text-center">
                        <p className="text-muted-foreground">Đúng hạn</p>
                        <p className="font-semibold text-blue-600">{field.onTimeRate}%</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/30 rounded p-2 text-center">
                        <p className="text-muted-foreground">Giải ngân</p>
                        <p className="font-semibold text-cyan-600">{field.budgetExecution}%</p>
                      </div>
                    </div>

                    {/* Officers in field */}
                    {selectedField === field.code && field.officers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Cán bộ bộ phận</p>
                        {field.officers.map((officer, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900/30 p-2 rounded"
                          >
                            <span className="text-foreground">{officer.name}</span>
                            <span className="text-muted-foreground">{officer.completionRate}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Ngân sách */}
        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Giám sát ngân sách theo lĩnh vực
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={BUDGET_BY_DEPARTMENT} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #2a2a3e',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value.toLocaleString()} tr`}
                  />
                  <Legend />
                  <Bar dataKey="allocated" fill="#8b5cf6" name="Dự toán (tr)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="spent" fill="#60a5fa" name="Đã chi (tr)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Tỷ lệ giải ngân theo lĩnh vực
              </h3>
              <div className="space-y-4">
                {BUDGET_BY_DEPARTMENT.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.spent.toLocaleString()} / {item.allocated.toLocaleString()} tr ({item.percent}%)
                      </span>
                    </div>
                    <Progress
                      value={item.percent}
                      className={`h-2 ${
                        item.percent > 90
                          ? '[&>div]:bg-red-500'
                          : item.percent > 75
                          ? '[&>div]:bg-yellow-500'
                          : '[&>div]:bg-green-500'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Cảnh báo */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SYSTEM_ALERTS.map((alert) => (
              <Card
                key={alert.id}
                className={`p-4 border ${
                  alert.type === 'danger'
                    ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800'
                    : alert.type === 'warning'
                    ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800'
                    : alert.type === 'success'
                    ? 'bg-white dark:bg-slate-900 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        alert.type === 'danger'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : alert.type === 'warning'
                          ? 'bg-amber-100 dark:bg-amber-900/30'
                          : alert.type === 'success'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 ${
                          alert.type === 'danger'
                            ? 'text-red-600 dark:text-red-400'
                            : alert.type === 'warning'
                            ? 'text-amber-600 dark:text-amber-400'
                            : alert.type === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{alert.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            alert.priority === 'high'
                              ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400'
                              : alert.priority === 'medium'
                              ? 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400'
                              : 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400'
                          }`}
                        >
                          {alert.priority === 'high'
                            ? 'Quan trọng'
                            : alert.priority === 'medium'
                            ? 'Trung bình'
                            : 'Thấp'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.module}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-foreground">{alert.count}</span>
                    <p className="text-xs text-muted-foreground">mục</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Điểm nóng GIS */}
        <TabsContent value="hotspots" className="space-y-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Bản đồ điểm nóng - GIS
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map placeholder - trong thực tế sẽ tích hợp bản đồ */}
              <div className="bg-secondary/20 rounded-lg p-8 border border-border min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Tích hợp bản đồ GIS tại đây
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (Google Maps / Leaflet / Mapbox)
                  </p>
                </div>
              </div>

              {/* Danh sách điểm nóng */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Danh sách điểm nóng</h4>
                {HOTSPOT_DATA.map((spot) => (
                  <div
                    key={spot.id}
                    className={`p-4 rounded-lg border ${
                      spot.severity === 'high'
                        ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-800'
                        : spot.severity === 'medium'
                        ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800'
                        : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <MapPin
                          className={`w-5 h-5 mt-0.5 ${
                            spot.severity === 'high'
                              ? 'text-red-600 dark:text-red-400'
                              : spot.severity === 'medium'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-foreground">{spot.name}</p>
                          <p className="text-sm text-muted-foreground">{spot.location}</p>
                          <p className="text-xs text-muted-foreground mt-1">{spot.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {spot.module}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {spot.reportCount} phản ánh
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          spot.severity === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : spot.severity === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }
                      >
                        {spot.severity === 'high'
                          ? 'Nghiêm trọng'
                          : spot.severity === 'medium'
                          ? 'Trung bình'
                          : 'Thấp'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Hành động nhanh</h3>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Eye className="w-4 h-4 mr-2" />
            Phê duyệt hồ sơ chờ
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            Xem báo cáo chi tiết
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Xuất PDF
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            <Bell className="w-4 h-4 mr-2" />
            Gửi thông báo
          </Button>
        </div>
      </Card>
    </div>
  );
}
