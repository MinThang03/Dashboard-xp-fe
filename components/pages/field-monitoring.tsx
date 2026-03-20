'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { FIELD_STATISTICS, FieldStats } from '@/lib/leader-data';

export function FieldMonitoringPage() {
  const [selectedField, setSelectedField] = useState<FieldStats | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Giám sát 10 Lĩnh vực</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi tình hình hoạt động của tất cả các lĩnh vực
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === 'week' && 'Tuần'}
            {range === 'month' && 'Tháng'}
            {range === 'quarter' && 'Quý'}
            {range === 'year' && 'Năm'}
          </Button>
        ))}
      </div>

      {/* Overview Grid - 10 Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {FIELD_STATISTICS.map((field) => {
          const Icon = field.icon;
          return (
            <Card
              key={field.id}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedField(field)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${field.bgGradient} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge
                    variant={
                      field.trendDirection === 'up'
                        ? 'default'
                        : field.trendDirection === 'down'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {field.trendDirection === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                    {field.trendDirection === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                    {field.trend > 0 ? '+' : ''}
                    {field.trend}%
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold mt-3">{field.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hoàn thành</span>
                    <span className="font-semibold">{field.completionRate}%</span>
                  </div>
                  <Progress value={field.completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Tổng số</div>
                    <div className="font-semibold text-lg">{field.totalCases}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Quá hạn</div>
                    <div className="font-semibold text-lg text-red-600">{field.overdueCases}</div>
                  </div>
                </div>
                {field.alerts.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{field.alerts.length} cảnh báo</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View */}
      {selectedField && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedField.bgGradient} flex items-center justify-center`}
                >
                  {React.createElement(selectedField.icon, { className: 'w-8 h-8 text-white' })}
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedField.name}</CardTitle>
                  <CardDescription>Chi tiết theo dõi lĩnh vực</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedField(null)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="departments">Phòng ban</TabsTrigger>
                <TabsTrigger value="alerts">Cảnh báo</TabsTrigger>
                <TabsTrigger value="kpi">KPI</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Tổng số hồ sơ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{selectedField.totalCases}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        +{selectedField.trend}% so với kỳ trước
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Đã hoàn thành</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {selectedField.completedCases}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedField.completionRate}% tỷ lệ hoàn thành
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Đang xử lý</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {selectedField.pendingCases}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Đang trong tiến trình</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Quá hạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">
                        {selectedField.overdueCases}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Cần xử lý khẩn</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tỷ lệ hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Hoàn thành', value: selectedField.completedCases },
                              { name: 'Đang xử lý', value: selectedField.pendingCases },
                              { name: 'Quá hạn', value: selectedField.overdueCases },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label
                          >
                            <Cell fill="#22c55e" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">KPI chính</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Tỷ lệ hoàn thành</span>
                          <span className="text-sm font-semibold">
                            {selectedField.completionRate}%
                          </span>
                        </div>
                        <Progress value={selectedField.completionRate} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Đúng hạn</span>
                          <span className="text-sm font-semibold">{selectedField.onTimeRate}%</span>
                        </div>
                        <Progress value={selectedField.onTimeRate} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Hài lòng</span>
                          <span className="text-sm font-semibold">
                            {selectedField.satisfactionRate}%
                          </span>
                        </div>
                        <Progress value={selectedField.satisfactionRate} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments" className="space-y-4">
                <div className="grid gap-4">
                  {selectedField.departments.map((dept, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <Badge>
                            {Math.round((dept.completed / dept.total) * 100)}% hoàn thành
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold">{dept.total}</div>
                              <div className="text-xs text-muted-foreground">Tổng số</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-green-600">
                                {dept.completed}
                              </div>
                              <div className="text-xs text-muted-foreground">Hoàn thành</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-blue-600">{dept.pending}</div>
                              <div className="text-xs text-muted-foreground">Đang xử lý</div>
                            </div>
                          </div>
                          <Progress value={(dept.completed / dept.total) * 100} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Alerts Tab */}
              <TabsContent value="alerts" className="space-y-4">
                {selectedField.alerts.map((alert, index) => (
                  <Card
                    key={index}
                    className={
                      alert.type === 'danger'
                        ? 'border-red-300 bg-red-50'
                        : alert.type === 'warning'
                        ? 'border-amber-300 bg-amber-50'
                        : 'border-blue-300 bg-blue-50'
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle
                            className={`w-5 h-5 ${
                              alert.type === 'danger'
                                ? 'text-red-600'
                                : alert.type === 'warning'
                                ? 'text-amber-600'
                                : 'text-blue-600'
                            }`}
                          />
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                        </div>
                        <Badge
                          variant={
                            alert.type === 'danger'
                              ? 'destructive'
                              : alert.type === 'warning'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {alert.count} trường hợp
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" variant="outline">
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* KPI Tab */}
              <TabsContent value="kpi" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardDescription>Tỷ lệ hoàn thành</CardDescription>
                      <CardTitle className="text-3xl">{selectedField.completionRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={selectedField.completionRate} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-2">Mục tiêu: 90%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Tỷ lệ đúng hạn</CardDescription>
                      <CardTitle className="text-3xl">{selectedField.onTimeRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={selectedField.onTimeRate} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-2">Mục tiêu: 85%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Độ hài lòng</CardDescription>
                      <CardTitle className="text-3xl">{selectedField.satisfactionRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={selectedField.satisfactionRate} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-2">Mục tiêu: 90%</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
