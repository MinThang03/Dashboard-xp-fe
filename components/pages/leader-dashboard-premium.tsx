'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Zap,
  Target,
  Award,
  Shield,
  Globe,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
} from 'recharts';

// Enhanced Mock Data
const kpiTrend = [
  { month: 'T1', completed: 245, onTime: 220, overdue: 25, satisfaction: 4.5 },
  { month: 'T2', completed: 268, onTime: 240, overdue: 28, satisfaction: 4.4 },
  { month: 'T3', completed: 290, onTime: 265, overdue: 25, satisfaction: 4.6 },
  { month: 'T4', completed: 315, onTime: 290, overdue: 25, satisfaction: 4.7 },
  { month: 'T5', completed: 338, onTime: 310, overdue: 28, satisfaction: 4.6 },
  { month: 'T6', completed: 360, onTime: 335, overdue: 25, satisfaction: 4.8 },
];

const departmentPerformance = [
  { department: 'Tư pháp', score: 85, cases: 120, satisfaction: 4.5 },
  { department: 'Địa chính', score: 78, cases: 150, satisfaction: 4.2 },
  { department: 'An ninh', score: 92, cases: 90, satisfaction: 4.7 },
  { department: 'Lao động', score: 88, cases: 80, satisfaction: 4.6 },
  { department: 'Tài chính', score: 90, cases: 110, satisfaction: 4.8 },
  { department: 'Y tế', score: 82, cases: 100, satisfaction: 4.4 },
];

const budgetAllocation = [
  { name: 'Đã sử dụng', value: 6500000000, color: '#00ADB5' },
  { name: 'Còn lại', value: 3500000000, color: '#e2e8f0' },
];

const casesByType = [
  { type: 'Hành chính', value: 320, color: '#00ADB5' },
  { type: 'Dân sự', value: 280, color: '#10b981' },
  { type: 'Đất đai', value: 210, color: '#f59e0b' },
  { type: 'Kinh doanh', value: 180, color: '#8b5cf6' },
  { type: 'Khác', value: 120, color: '#ec4899' },
];

const satisfactionTrend = [
  { week: 'T1', rating: 4.3, responses: 45 },
  { week: 'T2', rating: 4.5, responses: 52 },
  { week: 'T3', rating: 4.4, responses: 48 },
  { week: 'T4', rating: 4.6, responses: 55 },
];

const radarData = [
  { metric: 'Hiệu suất', value: 85, fullMark: 100 },
  { metric: 'Chất lượng', value: 92, fullMark: 100 },
  { metric: 'Đúng hạn', value: 88, fullMark: 100 },
  { metric: 'Hài lòng', value: 90, fullMark: 100 },
  { metric: 'Minh bạch', value: 87, fullMark: 100 },
  { metric: 'Đổi mới', value: 78, fullMark: 100 },
];

export function LeaderDashboardPremium() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const COLORS = ['#00ADB5', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

  return (
    <div className="space-y-6 p-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Bảng điều khiển Lãnh đạo</h1>
            </div>
            <p className="text-white/90 text-lg">Tổng quan hiệu suất và KPI thời gian thực</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Data
              </span>
              <span>Cập nhật: vài giây trước</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-white/90">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-xl hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-status-success/10 to-status-success/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-0">+12%</Badge>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tỷ lệ hoàn thành</h3>
            <p className="text-4xl font-bold mb-2">93.1%</p>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">+5.2% so với tháng trước</span>
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-status-success to-status-success rounded-full" style={{ width: '93%' }}></div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-700 border-0">+45</Badge>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tổng hồ sơ</h3>
            <p className="text-4xl font-bold mb-2">2,847</p>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Activity className="w-4 h-4" />
              <span className="font-medium">168 đang xử lý</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-green-600">2,650</div>
                <div className="text-muted-foreground">Hoàn thành</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">168</div>
                <div className="text-muted-foreground">Đang xử lý</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">29</div>
                <div className="text-muted-foreground">Trễ hạn</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-500/10 text-purple-700 border-0">65%</Badge>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Ngân sách</h3>
            <p className="text-4xl font-bold mb-2">6.5B</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Còn lại: </span>
              <span className="font-semibold text-foreground">3.5B VNĐ</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tiến độ sử dụng</span>
                <span className="font-semibold">65%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-xl hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <Badge className="bg-amber-500/10 text-amber-700 border-0">Tốt</Badge>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Hài lòng TB</h3>
            <p className="text-4xl font-bold mb-2">4.7/5.0</p>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < 5 ? 'text-amber-400' : 'text-slate-200'}`}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Dựa trên <span className="font-semibold text-foreground">1,234</span> đánh giá
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend - Area Chart */}
        <Card className="p-6 border-0 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Xu hướng hiệu suất
              </h3>
              <p className="text-sm text-muted-foreground mt-1">6 tháng gần nhất</p>
            </div>
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-slate-50">
              <option>6 tháng</option>
              <option>3 tháng</option>
              <option>1 năm</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={kpiTrend}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ADB5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ADB5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#00ADB5"
                fillOpacity={1}
                fill="url(#colorCompleted)"
                name="Tổng hồ sơ"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="onTime"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorOnTime)"
                name="Đúng hạn"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Performance - Radar Chart */}
        <Card className="p-6 border-0 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Đánh giá toàn diện
              </h3>
              <p className="text-sm text-muted-foreground mt-1">6 chỉ số chính</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" stroke="#64748b" />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar
                name="Điểm đánh giá"
                dataKey="value"
                stroke="#00ADB5"
                fill="#00ADB5"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Budget Allocation - Composed Chart */}
        <Card className="p-6 border-0 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-primary" />
                Phân bổ ngân sách
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Tổng: 10 tỷ VNĐ</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetAllocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {budgetAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${(value / 1000000000).toFixed(1)}B VNĐ`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {budgetAllocation.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="font-semibold">{(item.value / 1000000000).toFixed(1)}B</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Cases by Type - Bar Chart */}
        <Card className="p-6 border-0 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Phân loại hồ sơ
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Theo loại công việc</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={casesByType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="type" type="category" stroke="#64748b" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {casesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Department Performance Table */}
      <Card className="p-6 border-0 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Hiệu suất theo bộ phận
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Chi tiết đánh giá từng phòng ban</p>
          </div>
        </div>
        <div className="space-y-4">
          {departmentPerformance.map((dept, index) => (
            <div
              key={dept.department}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-secondary to-secondary rounded-xl flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{dept.department}</h4>
                <p className="text-sm text-muted-foreground">{dept.cases} hồ sơ xử lý</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{dept.score}</div>
                  <div className="text-sm text-muted-foreground">/100</div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < Math.floor(dept.satisfaction) ? 'text-amber-400' : 'text-slate-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-32">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-secondary rounded-full"
                    style={{ width: `${dept.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-0 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Hành động nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-secondary to-secondary hover:from-secondary/90 hover:to-secondary/90">
            <Zap className="w-5 h-5" />
            <span>Phê duyệt hồ sơ</span>
          </Button>
          <Button className="h-auto py-4 flex-col gap-2" variant="outline">
            <BarChart3 className="w-5 h-5" />
            <span>Xem báo cáo</span>
          </Button>
          <Button className="h-auto py-4 flex-col gap-2" variant="outline">
            <Download className="w-5 h-5" />
            <span>Xuất PDF</span>
          </Button>
          <Button className="h-auto py-4 flex-col gap-2" variant="outline">
            <Users className="w-5 h-5" />
            <span>Quản lý nhân sự</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
