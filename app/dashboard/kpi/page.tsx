'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { FALLBACK_LEADER_DATA, fetchLeaderDashboardData } from '@/lib/leader-live-data';

export default function KPIPage() {
  const [kpiData, setKpiData] = useState(() =>
    FALLBACK_LEADER_DATA.kpiMonthlyData.map((row) => {
      const actual = row.totalCases ? Math.round((row.completedOnTime / row.totalCases) * 100) : 0;
      return {
        month: row.month,
        target: actual,
        actual,
        completed: row.completedOnTime,
      };
    }),
  );
  const [departmentKpi, setDepartmentKpi] = useState(() =>
    FALLBACK_LEADER_DATA.fieldStatistics.map((field) => {
      const actual = field.completionRate;
      return {
        name: field.name.split(' - ')[0],
        target: actual,
        actual,
        status: actual >= 90 ? 'success' : actual >= 80 ? 'warning' : 'danger',
      };
    }),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchLeaderDashboardData()
      .then((data) => {
        if (!active) return;
        setKpiData(
          data.kpiMonthlyData.map((row) => {
            const actual = row.totalCases ? Math.round((row.completedOnTime / row.totalCases) * 100) : 0;
            return {
              month: row.month,
              target: actual,
              actual,
              completed: row.completedOnTime,
            };
          }),
        );
        setDepartmentKpi(
          data.fieldStatistics.map((field) => {
            const actual = field.completionRate;
            return {
              name: field.name.split(' - ')[0],
              target: actual,
              actual,
              status: actual >= 90 ? 'success' : actual >= 80 ? 'warning' : 'danger',
            };
          }),
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Tổng quan KPI
          </h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi các chỉ tiêu hiệu suất chính
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1month">1 tháng</option>
            <option value="3months">3 tháng</option>
            <option value="6months">6 tháng</option>
            <option value="1year">1 năm</option>
          </select>
          <Button variant="outline" className="gap-2" disabled={isLoading}>
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overall KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tỷ lệ đúng hạn</p>
              <p className="text-4xl font-bold text-foreground mt-2">88%</p>
              <div className="flex items-center gap-1 mt-2 text-status-success text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+3% so với tháng trước</span>
              </div>
            </div>
            <Target className="w-12 h-12 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hồ sơ hoàn thành</p>
              <p className="text-4xl font-bold text-foreground mt-2">1,878</p>
              <div className="flex items-center gap-1 mt-2 text-foreground text-sm">
                <span>Năm nay</span>
              </div>
            </div>
            <Target className="w-12 h-12 text-status-success opacity-20" />
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Mức hài lòng</p>
              <p className="text-4xl font-bold text-foreground mt-2">4.6/5</p>
              <div className="flex items-center gap-2 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < 4 ? 'text-yellow-500' : 'text-muted-foreground'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <Target className="w-12 h-12 text-accent opacity-20" />
          </div>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Xu hướng KPI theo tháng
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={kpiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#8b5cf6"
              name="Mục tiêu"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#4ade80"
              name="Thực tế"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Department KPI */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          KPI theo bộ phận
        </h3>
        <div className="space-y-3">
          {departmentKpi.map((dept, i) => {
            const statusColor =
              dept.status === 'success'
                ? 'bg-status-success/20'
                : dept.status === 'warning'
                  ? 'bg-status-warning/20'
                  : 'bg-status-danger/20';

            return (
              <div
                key={i}
                className={`p-4 rounded-lg ${statusColor} border border-border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Mục tiêu: {dept.target}% • Thực tế: {dept.actual}%
                    </p>
                  </div>
                  <Badge
                    className={
                      dept.status === 'success'
                        ? 'bg-status-success text-white'
                        : dept.status === 'warning'
                          ? 'bg-status-warning text-black'
                          : 'bg-status-danger text-white'
                    }
                  >
                    {dept.status === 'success'
                      ? 'Đạt'
                      : dept.status === 'warning'
                        ? 'Cảnh báo'
                        : 'Không đạt'}
                  </Badge>
                </div>
                <div className="bg-muted/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={
                      dept.status === 'success'
                        ? 'bg-status-success'
                        : dept.status === 'warning'
                          ? 'bg-status-warning'
                          : 'bg-status-danger'
                    }
                    style={{ width: `${dept.actual}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Case Processing Chart */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Hồ sơ hoàn thành theo tháng
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={kpiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar
              dataKey="completed"
              fill="#5544aa"
              name="Hồ sơ hoàn thành"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Actions */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Hành động nhanh
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Xuất báo cáo KPI
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            So sánh kỳ trước
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            Đặt mục tiêu mới
          </Button>
        </div>
      </Card>
    </div>
  );
}
