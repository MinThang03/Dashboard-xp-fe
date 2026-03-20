'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  List,
  Bell,
  Calendar,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { OFFICER_MODULES } from '@/lib/officer-modules';
import {
  MODULE_STATISTICS,
  SYSTEM_ALERTS,
  SUMMARY_STATS,
  KPI_MONTHLY_DATA,
  CASES_BY_DEPARTMENT,
} from '@/lib/dashboard-stats';

export function OfficerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Filter modules dựa trên search
  const filteredModules = MODULE_STATISTICS.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lấy các cảnh báo quan trọng
  const importantAlerts = SYSTEM_ALERTS.filter(
    (a) => a.priority === 'high' || a.type === 'danger'
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-6 border border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              Tổng quan Cán bộ Chuyên môn
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý và xử lý công việc theo 10 chuyên ngành
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Tháng 1/2026
            </Button>
            <Button variant="outline" size="sm" className="gap-2 relative">
              <Bell className="w-4 h-4" />
              Thông báo
              {importantAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-danger text-white text-xs rounded-full flex items-center justify-center">
                  {importantAlerts.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Tổng hồ sơ
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {SUMMARY_STATS.totalCases.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">10 chuyên ngành</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Hoàn thành
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {SUMMARY_STATS.completedCases.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {SUMMARY_STATS.onTimeRate}% đúng hạn
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Đang xử lý
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {SUMMARY_STATS.pendingCases}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Cần hoàn thành</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Quá hạn
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                {SUMMARY_STATS.overdueCases}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Cần xử lý gấp
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="modules">10 Chuyên ngành</TabsTrigger>
            <TabsTrigger value="alerts">Cảnh báo ({importantAlerts.length})</TabsTrigger>
            <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm chuyên ngành..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tab: Tổng quan */}
        <TabsContent value="overview" className="space-y-6">
          {/* Biểu đồ và Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Biểu đồ xu hướng */}
            <Card className="lg:col-span-2 bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Xu hướng xử lý hồ sơ 6 tháng gần nhất
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={KPI_MONTHLY_DATA}>
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
                  <Line
                    type="monotone"
                    dataKey="completedOnTime"
                    stroke="#4ade80"
                    name="Đúng hạn"
                    strokeWidth={2}
                    dot={{ fill: '#4ade80' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="overdue"
                    stroke="#f87171"
                    name="Quá hạn"
                    strokeWidth={2}
                    dot={{ fill: '#f87171' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Cảnh báo nhanh */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Cảnh báo quan trọng
              </h3>
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {importantAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === 'danger'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {alert.module}
                        </Badge>
                      </div>
                      <span className="text-lg font-bold text-foreground">{alert.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Access Modules */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Truy cập nhanh các chuyên ngành
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {MODULE_STATISTICS.slice(0, 10).map((module) => {
                const Icon = module.icon;
                const officerModule = OFFICER_MODULES.find((m) => m.id === module.id);
                return (
                  <Link
                    key={module.id}
                    href={officerModule?.functions[0]?.path || '/dashboard'}
                  >
                    <Card
                      className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className="p-3 rounded-full mb-3 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: module.color }} />
                        </div>
                        <h4 className="font-medium text-sm text-foreground line-clamp-2">
                          {module.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold" style={{ color: module.color }}>
                            {module.total}
                          </span>
                          <span className="text-xs text-muted-foreground">hồ sơ</span>
                        </div>
                        {module.overdue > 0 && (
                          <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            {module.overdue} quá hạn
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Tab: 10 Chuyên ngành */}
        <TabsContent value="modules" className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((module) => {
                const Icon = module.icon;
                const officerModule = OFFICER_MODULES.find((m) => m.id === module.id);
                const completionRate = Math.round((module.completed / module.total) * 100);

                return (
                  <Card
                    key={module.id}
                    className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: module.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{module.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {officerModule?.functions.length || 0} chức năng
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {module.trendDirection === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            module.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {module.trend}%
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{module.total}</p>
                        <p className="text-xs text-muted-foreground">Tổng</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-500">{module.completed}</p>
                        <p className="text-xs text-muted-foreground">Xong</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-yellow-500">{module.pending}</p>
                        <p className="text-xs text-muted-foreground">Chờ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-500">{module.overdue}</p>
                        <p className="text-xs text-muted-foreground">Trễ</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Tiến độ hoàn thành</span>
                        <span className="font-medium text-foreground">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>

                    {/* Sub Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {module.subStats.map((stat, i) => (
                        <div key={i} className="bg-background/50 rounded-lg p-2 text-center">
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="font-semibold text-foreground">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    <Link href={officerModule?.functions[0]?.path || '/dashboard'}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 border-border hover:bg-background/50"
                      >
                        Xem chi tiết
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-card border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Chuyên ngành</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Tổng</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Hoàn thành</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Đang xử lý</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Quá hạn</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Tiến độ</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Xu hướng</th>
                    <th className="text-right p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((module) => {
                    const Icon = module.icon;
                    const officerModule = OFFICER_MODULES.find((m) => m.id === module.id);
                    const completionRate = Math.round((module.completed / module.total) * 100);

                    return (
                      <tr key={module.id} className="border-t border-border hover:bg-muted/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${module.color}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: module.color }} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{module.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {officerModule?.functions.length || 0} chức năng
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-semibold text-foreground">
                          {module.total}
                        </td>
                        <td className="p-4 text-center font-semibold text-green-500">
                          {module.completed}
                        </td>
                        <td className="p-4 text-center font-semibold text-yellow-500">
                          {module.pending}
                        </td>
                        <td className="p-4 text-center">
                          {module.overdue > 0 ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              {module.overdue}
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              0
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Progress value={completionRate} className="h-2 flex-1" />
                            <span className="text-xs font-medium text-foreground w-10">
                              {completionRate}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {module.trendDirection === 'up' ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                module.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {module.trend}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Link href={officerModule?.functions[0]?.path || '/dashboard'}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              Chi tiết
                              <ChevronRight className="w-4 h-4" />
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
                              ? 'border-red-500/50 text-red-400'
                              : alert.priority === 'medium'
                              ? 'border-yellow-500/50 text-yellow-400'
                              : 'border-green-500/50 text-green-400'
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

        {/* Tab: Thống kê */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ cột theo lĩnh vực */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Hồ sơ theo chuyên ngành
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={CASES_BY_DEPARTMENT} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #2a2a3e',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="completed" stackId="a" fill="#4ade80" name="Hoàn thành" />
                  <Bar dataKey="pending" stackId="a" fill="#facc15" name="Đang xử lý" />
                  <Bar dataKey="overdue" stackId="a" fill="#f87171" name="Quá hạn" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Biểu đồ tròn phân bổ */}
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Phân bổ hồ sơ theo lĩnh vực
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={CASES_BY_DEPARTMENT}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {CASES_BY_DEPARTMENT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #2a2a3e',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
