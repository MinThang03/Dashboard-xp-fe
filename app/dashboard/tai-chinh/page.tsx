'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Calendar,
  PieChart,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const revenueData = [
  { month: 'T1', thu: 450, chi: 380, duToan: 500 },
  { month: 'T2', thu: 520, chi: 420, duToan: 500 },
  { month: 'T3', thu: 480, chi: 450, duToan: 500 },
  { month: 'T4', thu: 610, chi: 490, duToan: 500 },
  { month: 'T5', thu: 580, chi: 510, duToan: 500 },
  { month: 'T6', thu: 670, chi: 540, duToan: 500 },
];

const budgetData = [
  { name: 'Giáo dục', value: 35, color: '#3b82f6' },
  { name: 'Y tế', value: 25, color: '#10b981' },
  { name: 'Hạ tầng', value: 20, color: '#f59e0b' },
  { name: 'An ninh', value: 12, color: '#ef4444' },
  { name: 'Khác', value: 8, color: '#8b5cf6' },
];

const departmentSpending = [
  { dept: 'Giáo dục', spending: 350, budget: 400, status: 'good' },
  { dept: 'Y tế', spending: 240, budget: 250, status: 'warning' },
  { dept: 'Hạ tầng', spending: 195, budget: 200, status: 'good' },
  { dept: 'An ninh', spending: 125, budget: 120, status: 'danger' },
  { dept: 'Văn hóa', spending: 75, budget: 100, status: 'good' },
];

export default function TaiChinhPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  const totalRevenue = 3310;
  const totalExpense = 2790;
  const totalBudget = 3000;
  const balance = totalRevenue - totalExpense;
  const budgetUsage = (totalExpense / totalBudget) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-success via-secondary to-status-success p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Tài chính</h1>
              </div>
              <p className="text-white/90">Theo dõi thu chi, ngân sách và giải ngân</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="h-11 px-4 bg-white/20 backdrop-blur-sm border-0 rounded-lg text-white"
              >
                <option value="2024">Năm 2024</option>
                <option value="2023">Năm 2023</option>
              </select>
              <Button className="bg-white text-green-600 hover:bg-white/90">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-0">+12%</Badge>
          </div>
          <p className="text-3xl font-bold">{totalRevenue}M</p>
          <p className="text-sm text-muted-foreground mt-1">Tổng thu</p>
          <div className="mt-3 text-xs text-green-600">So với kỳ trước</div>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <Badge className="bg-red-500/10 text-red-700 border-0">+8%</Badge>
          </div>
          <p className="text-3xl font-bold">{totalExpense}M</p>
          <p className="text-sm text-muted-foreground mt-1">Tổng chi</p>
          <div className="mt-3 text-xs text-red-600">So với kỳ trước</div>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-500/10 text-blue-700 border-0">Dương</Badge>
          </div>
          <p className="text-3xl font-bold">{balance}M</p>
          <p className="text-sm text-muted-foreground mt-1">Số dư</p>
          <div className="mt-3 text-xs text-blue-600">Tình hình tốt</div>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <PieChart className="w-6 h-6 text-amber-600" />
            </div>
            <Badge
              className={`${
                budgetUsage > 95 ? 'bg-red-500/10 text-red-700' : 'bg-amber-500/10 text-amber-700'
              } border-0`}
            >
              {budgetUsage.toFixed(0)}%
            </Badge>
          </div>
          <p className="text-3xl font-bold">{totalBudget}M</p>
          <p className="text-sm text-muted-foreground mt-1">Dự toán</p>
          <div className="mt-3">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: `${budgetUsage}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue/Expense Trend */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Thu chi theo tháng</h3>
              <p className="text-sm text-muted-foreground mt-1">So sánh với dự toán</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorThu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorChi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="thu"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorThu)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="chi"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorChi)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Budget Distribution */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Phân bổ ngân sách</h3>
              <p className="text-sm text-muted-foreground mt-1">Theo lĩnh vực</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {budgetData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-semibold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Spending */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Chi tiêu theo phòng ban</h3>
            <p className="text-sm text-muted-foreground mt-1">So sánh với dự toán phân bổ</p>
          </div>
        </div>
        <div className="space-y-4">
          {departmentSpending.map((dept) => {
            const percentage = (dept.spending / dept.budget) * 100;
            const isOverBudget = dept.spending > dept.budget;

            return (
              <div key={dept.dept} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{dept.dept}</span>
                    {isOverBudget && (
                      <Badge className="bg-red-500/10 text-red-700 border-0 gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Vượt dự toán
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Chi: <span className="font-semibold text-foreground">{dept.spending}M</span>
                    </span>
                    <span className="text-muted-foreground">
                      Dự toán: <span className="font-semibold text-foreground">{dept.budget}M</span>
                    </span>
                    <span
                      className={`font-semibold ${
                        isOverBudget ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isOverBudget
                        ? 'bg-gradient-to-r from-red-400 to-red-600'
                        : 'bg-gradient-to-r from-green-400 to-green-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-6 border-0 shadow-lg border-l-4 border-l-amber-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Cảnh báo ngân sách</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Phòng An ninh đã vượt 104% dự toán - Cần xem xét điều chỉnh
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Phòng Y tế sắp đạt 96% dự toán - Theo dõi chặt chẽ
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Tỷ lệ giải ngân quý 2 đạt 87% - Tình hình tốt
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
