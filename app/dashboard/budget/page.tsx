'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown, Download, AlertCircle } from 'lucide-react';
import { useState } from 'react';
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
  Cell,
} from 'recharts';

const budgetData = [
  { month: 'T1', allocated: 500, spent: 420 },
  { month: 'T2', allocated: 500, spent: 480 },
  { month: 'T3', allocated: 500, spent: 450 },
  { month: 'T4', allocated: 500, spent: 510 },
  { month: 'T5', allocated: 500, spent: 480 },
  { month: 'T6', allocated: 500, spent: 490 },
];

const departmentBudget = [
  { name: 'Địa chính - Xây dựng', allocated: 1500, spent: 1200, status: 'normal' },
  { name: 'An ninh - Quốc phòng', allocated: 2000, spent: 1950, status: 'warning' },
  { name: 'Tư pháp - Hộ tịch', allocated: 1000, spent: 850, status: 'normal' },
  { name: 'Lao động - An sinh', allocated: 800, spent: 750, status: 'normal' },
  { name: 'Tài chính - Kế toán', allocated: 1200, spent: 1100, status: 'normal' },
  { name: 'Y tế - Giáo dục', allocated: 900, spent: 920, status: 'over' },
];

export default function BudgetPage() {
  const totalAllocated = 7400;
  const totalSpent = 6770;
  const totalRemaining = totalAllocated - totalSpent;
  const percentageUsed = Math.round((totalSpent / totalAllocated) * 100);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Giám sát ngân sách
          </h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi chi tiêu và dự toán
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Budget Alert */}
      {showAlert && (
        <Alert className="bg-status-danger/10 border-status-danger/30">
          <AlertCircle className="h-4 w-4 text-status-danger" />
          <AlertDescription className="text-status-danger">
            <strong>Cảnh báo:</strong> Bộ phận "Y tế - Giáo dục" đã vượt 2% ngân sách được cấp. Cần kiểm tra và điều chỉnh.
            <button
              onClick={() => setShowAlert(false)}
              className="ml-2 underline hover:no-underline"
            >
              Đóng
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <p className="text-sm text-muted-foreground">Dự toán năm</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {totalAllocated}M
          </p>
          <p className="text-xs text-muted-foreground mt-2">Tổng cộng</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-sm text-muted-foreground">Đã chi</p>
          <p className="text-3xl font-bold text-status-warning mt-2">
            {totalSpent}M
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {percentageUsed}% dự toán
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-sm text-muted-foreground">Còn lại</p>
          <p className="text-3xl font-bold text-status-success mt-2">
            {totalRemaining}M
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {100 - percentageUsed}% dự toán
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-sm text-muted-foreground">Vượt ngân sách</p>
          <p className="text-3xl font-bold text-status-danger mt-2">1</p>
          <p className="text-xs text-muted-foreground mt-2">
            Bộ phận cần kiểm soát
          </p>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Tiến độ chi tiêu
        </h3>
        <div className="bg-muted/20 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-status-success to-status-warning transition-all"
            style={{ width: `${percentageUsed}%` }}
          />
        </div>
        <div className="flex justify-between items-end mt-4">
          <span className="text-sm text-muted-foreground">
            0M
          </span>
          <span className="text-sm font-medium text-foreground">
            {totalSpent}M / {totalAllocated}M
          </span>
          <span className="text-sm text-muted-foreground">
            {totalAllocated}M
          </span>
        </div>
      </Card>

      {/* Trend Chart */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Xu hướng chi tiêu theo tháng
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetData}>
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
            <Bar dataKey="allocated" fill="#8b5cf6" name="Dự toán" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spent" fill="#ef4444" name="Đã chi" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Department Budget */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Ngân sách theo bộ phận
        </h3>
        <div className="space-y-3">
          {departmentBudget.map((dept, i) => {
            const percentageUsed = Math.round((dept.spent / dept.allocated) * 100);
            const isOver = dept.status === 'over';
            const isWarning = dept.status === 'warning';

            return (
              <div
                key={i}
                className={`p-4 rounded-lg border border-border ${
                  isOver
                    ? 'bg-status-danger/10'
                    : isWarning
                      ? 'bg-status-warning/10'
                      : 'bg-secondary/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{dept.name}</p>
                    {isOver && (
                      <AlertTriangle className="w-4 h-4 text-status-danger" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {dept.spent}M / {dept.allocated}M ({percentageUsed}%)
                  </span>
                </div>

                <div className="bg-muted/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={
                      isOver
                        ? 'bg-status-danger'
                        : isWarning
                          ? 'bg-status-warning'
                          : 'bg-primary'
                    }
                    style={{
                      width: `${Math.min(percentageUsed, 100)}%`,
                    }}
                  />
                </div>

                {isOver && (
                  <p className="text-xs text-status-danger mt-2">
                    Vượt ngân sách {dept.spent - dept.allocated}M
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Hành động nhanh
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Xuất báo cáo chi tiết
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            Điều chỉnh dự toán
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            Gửi cảnh báo
          </Button>
        </div>
      </Card>
    </div>
  );
}
