'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  FileText,
  BarChart3,
  Users,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Building2,
  ShieldCheck,
  Stethoscope,
  GraduationCap,
  Store,
  Home,
  Coins,
  MapPin,
  TreePine,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Award,
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
  AreaChart,
  Area,
} from 'recharts';

// 10 lĩnh vực chính của hệ thống
const CATEGORY_MODULES = [
  { id: 'hanh-chinh-tu-phap', name: 'Hành chính tư pháp', icon: FileText, color: 'from-secondary to-secondary', textColor: 'text-secondary', bgColor: 'bg-secondary/10' },
  { id: 'van-hoa-xa-hoi', name: 'Văn hóa - Xã hội', icon: Users, color: 'from-primary to-primary', textColor: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'kinh-te', name: 'Kinh tế', icon: Store, color: 'from-status-success to-status-success', textColor: 'text-status-success', bgColor: 'bg-status-success/10' },
  { id: 'an-ninh-trat-tu', name: 'An ninh - Trật tự', icon: ShieldCheck, color: 'from-status-danger to-status-danger', textColor: 'text-status-danger', bgColor: 'bg-status-danger/10' },
  { id: 'ha-tang', name: 'Hạ tầng', icon: Building2, color: 'from-gray-500 to-slate-500', textColor: 'text-gray-600', bgColor: 'bg-gray-50' },
  { id: 'tai-chinh', name: 'Tài chính', icon: Coins, color: 'from-yellow-500 to-amber-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'dia-chinh', name: 'Địa chính', icon: MapPin, color: 'from-indigo-500 to-blue-500', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { id: 'moi-truong', name: 'Môi trường', icon: TreePine, color: 'from-teal-500 to-green-500', textColor: 'text-teal-600', bgColor: 'bg-teal-50' },
  { id: 'van-hoa-du-lich', name: 'Văn hóa - Du lịch', icon: Landmark, color: 'from-pink-500 to-rose-500', textColor: 'text-pink-600', bgColor: 'bg-pink-50' },
  { id: 'y-te', name: 'Y tế', icon: Stethoscope, color: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-600', bgColor: 'bg-cyan-50' },
];

// Dữ liệu KPI cho 10 lĩnh vực (tháng hiện tại)
const CATEGORY_KPI_DATA = [
  { category: 'hanh-chinh-tu-phap', total: 245, completed: 220, inProgress: 20, overdue: 5, rate: 90, change: 5 },
  { category: 'van-hoa-xa-hoi', total: 180, completed: 165, inProgress: 12, overdue: 3, rate: 92, change: 8 },
  { category: 'kinh-te', total: 156, completed: 140, inProgress: 10, overdue: 6, rate: 90, change: -2 },
  { category: 'an-ninh-trat-tu', total: 89, completed: 82, inProgress: 5, overdue: 2, rate: 92, change: 3 },
  { category: 'ha-tang', total: 67, completed: 58, inProgress: 7, overdue: 2, rate: 87, change: -5 },
  { category: 'tai-chinh', total: 134, completed: 125, inProgress: 8, overdue: 1, rate: 93, change: 7 },
  { category: 'dia-chinh', total: 198, completed: 175, inProgress: 18, overdue: 5, rate: 88, change: 2 },
  { category: 'moi-truong', total: 112, completed: 98, inProgress: 10, overdue: 4, rate: 88, change: -3 },
  { category: 'van-hoa-du-lich', total: 78, completed: 72, inProgress: 5, overdue: 1, rate: 92, change: 10 },
  { category: 'y-te', total: 145, completed: 135, inProgress: 8, overdue: 2, rate: 93, change: 6 },
];

// Dữ liệu xu hướng 6 tháng cho biểu đồ multi-line
const TREND_DATA = [
  { month: 'T7/23', 'Hành chính': 88, 'Văn hóa-XH': 90, 'Kinh tế': 85, 'An ninh': 95, 'Hạ tầng': 82, 'Tài chính': 91, 'Địa chính': 86, 'Môi trường': 84, 'Du lịch': 89, 'Y tế': 92 },
  { month: 'T8/23', 'Hành chính': 89, 'Văn hóa-XH': 91, 'Kinh tế': 87, 'An ninh': 94, 'Hạ tầng': 85, 'Tài chính': 92, 'Địa chính': 87, 'Môi trường': 86, 'Du lịch': 90, 'Y tế': 93 },
  { month: 'T9/23', 'Hành chính': 87, 'Văn hóa-XH': 89, 'Kinh tế': 86, 'An ninh': 93, 'Hạ tầng': 83, 'Tài chính': 90, 'Địa chính': 85, 'Môi trường': 85, 'Du lịch': 88, 'Y tế': 91 },
  { month: 'T10/23', 'Hành chính': 90, 'Văn hóa-XH': 92, 'Kinh tế': 89, 'An ninh': 95, 'Hạ tầng': 87, 'Tài chính': 93, 'Địa chính': 88, 'Môi trường': 87, 'Du lịch': 91, 'Y tế': 94 },
  { month: 'T11/23', 'Hành chính': 88, 'Văn hóa-XH': 90, 'Kinh tế': 88, 'An ninh': 94, 'Hạ tầng': 85, 'Tài chính': 91, 'Địa chính': 86, 'Môi trường': 86, 'Du lịch': 89, 'Y tế': 92 },
  { month: 'T12/23', 'Hành chính': 90, 'Văn hóa-XH': 92, 'Kinh tế': 90, 'An ninh': 92, 'Hạ tầng': 87, 'Tài chính': 93, 'Địa chính': 88, 'Môi trường': 88, 'Du lịch': 92, 'Y tế': 93 },
];

// Dữ liệu heat map (hiệu suất theo lĩnh vực và thời gian)
const HEATMAP_DATA = [
  { period: 'Tuần 1', data: { 'Hành chính': 92, 'Văn hóa-XH': 88, 'Kinh tế': 85, 'An ninh': 95, 'Hạ tầng': 80, 'Tài chính': 90, 'Địa chính': 87, 'Môi trường': 83, 'Du lịch': 89, 'Y tế': 91 } },
  { period: 'Tuần 2', data: { 'Hành chính': 90, 'Văn hóa-XH': 91, 'Kinh tế': 88, 'An ninh': 93, 'Hạ tầng': 85, 'Tài chính': 92, 'Địa chính': 89, 'Môi trường': 86, 'Du lịch': 90, 'Y tế': 93 } },
  { period: 'Tuần 3', data: { 'Hành chính': 89, 'Văn hóa-XH': 93, 'Kinh tế': 90, 'An ninh': 94, 'Hạ tầng': 88, 'Tài chính': 94, 'Địa chính': 88, 'Môi trường': 89, 'Du lịch': 93, 'Y tế': 94 } },
  { period: 'Tuần 4', data: { 'Hành chính': 91, 'Văn hóa-XH': 92, 'Kinh tế': 89, 'An ninh': 92, 'Hạ tầng': 86, 'Tài chính': 93, 'Địa chính': 87, 'Môi trường': 87, 'Du lịch': 91, 'Y tế': 92 } },
];

// Cảnh báo ưu tiên
const PRIORITY_ALERTS = [
  { id: 1, category: 'ha-tang', title: '2 dự án hạ tầng chậm tiến độ', severity: 'high', count: 2, icon: Building2, color: 'text-red-600' },
  { id: 2, category: 'tai-chinh', title: '1 khoản vượt dự toán', severity: 'high', count: 1, icon: Coins, color: 'text-orange-600' },
  { id: 3, category: 'dia-chinh', title: '5 hồ sơ địa chính sắp quá hạn', severity: 'medium', count: 5, icon: MapPin, color: 'text-yellow-600' },
  { id: 4, category: 'moi-truong', title: '4 phản ánh ô nhiễm chưa xử lý', severity: 'medium', count: 4, icon: TreePine, color: 'text-yellow-600' },
  { id: 5, category: 'kinh-te', title: '6 hồ sơ kinh doanh chờ phê duyệt', severity: 'low', count: 6, icon: Store, color: 'text-blue-600' },
];

// Màu cho heat map
const getHeatmapColor = (value: number) => {
  if (value >= 90) return 'bg-green-500';
  if (value >= 80) return 'bg-green-400';
  if (value >= 70) return 'bg-yellow-400';
  if (value >= 60) return 'bg-orange-400';
  return 'bg-red-400';
};

const getHeatmapTextColor = (value: number) => {
  if (value >= 70) return 'text-white';
  return 'text-gray-800';
};

export function LeaderDashboardV2() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Tính tổng số liệu tổng quan
  const totalStats = CATEGORY_KPI_DATA.reduce(
    (acc, curr) => ({
      total: acc.total + curr.total,
      completed: acc.completed + curr.completed,
      inProgress: acc.inProgress + curr.inProgress,
      overdue: acc.overdue + curr.overdue,
    }),
    { total: 0, completed: 0, inProgress: 0, overdue: 0 }
  );

  const overallRate = Math.round((totalStats.completed / totalStats.total) * 100);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-primary via-secondary to-primary px-6 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Lãnh đạo</h1>
            <p className="mt-2 text-white/90">Tổng quan hiệu suất toàn bộ 10 lĩnh vực hoạt động</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Tổng hồ sơ</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{totalStats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Tất cả lĩnh vực</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Đã hoàn thành</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{totalStats.completed}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <p className="text-xs text-green-600 font-semibold">{overallRate}% tỷ lệ</p>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Đang xử lý</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">{totalStats.inProgress}</p>
              <p className="text-xs text-muted-foreground mt-1">Trong tiến trình</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Quá hạn</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{totalStats.overdue}</p>
              <p className="text-xs text-red-600 font-semibold mt-1">Cần xử lý gấp</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Hiệu suất 10 lĩnh vực - KPI Cards */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Hiệu suất theo lĩnh vực</h2>
            <p className="text-sm text-muted-foreground mt-1">Tỷ lệ hoàn thành và xu hướng tháng hiện tại</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Calendar className="w-3 h-3 mr-1" />
            Tháng 1/2024
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORY_MODULES.map((module) => {
            const kpiData = CATEGORY_KPI_DATA.find((d) => d.category === module.id);
            if (!kpiData) return null;

            const Icon = module.icon;
            const isPositiveChange = kpiData.change >= 0;
            const ChangeIcon = isPositiveChange ? ArrowUpRight : ArrowDownRight;

            return (
              <Card
                key={module.id}
                className={`p-4 border-2 hover:shadow-lg transition cursor-pointer ${
                  selectedCategory === module.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                }`}
                onClick={() => setSelectedCategory(module.id)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${module.bgColor}`}>
                    <Icon className={`w-5 h-5 ${module.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{module.name}</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{kpiData.rate}%</p>
                      <p className="text-xs text-muted-foreground">Tỷ lệ hoàn thành</p>
                    </div>
                    <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                      <ChangeIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{Math.abs(kpiData.change)}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${module.color} transition-all`}
                      style={{ width: `${kpiData.rate}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{kpiData.completed}</p>
                      <p className="text-muted-foreground">Xong</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{kpiData.inProgress}</p>
                      <p className="text-muted-foreground">Đang</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-red-600">{kpiData.overdue}</p>
                      <p className="text-muted-foreground">Trễ</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Biểu đồ xu hướng multi-line */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Xu hướng hiệu suất 6 tháng</h2>
            <p className="text-sm text-muted-foreground mt-1">So sánh tỷ lệ hoàn thành của 10 lĩnh vực</p>
          </div>
          <div className="flex gap-2">
            {['month', 'quarter', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period === 'month' ? '6 tháng' : period === 'quarter' ? 'Theo quý' : 'Theo năm'}
              </Button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} domain={[75, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="Hành chính" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Văn hóa-XH" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Kinh tế" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="An ninh" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Hạ tầng" stroke="#6b7280" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Tài chính" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Địa chính" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Môi trường" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Du lịch" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Y tế" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Heat Map và Cảnh báo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heat Map */}
        <Card className="p-6 lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Heat Map hiệu suất</h2>
            <p className="text-sm text-muted-foreground mt-1">Biểu đồ nhiệt theo tuần và lĩnh vực</p>
          </div>

          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-11 gap-1 text-xs font-semibold text-muted-foreground">
              <div className="text-right pr-2">Tuần</div>
              {CATEGORY_MODULES.map((module) => (
                <div key={module.id} className="text-center truncate" title={module.name}>
                  {module.name.split(' ')[0]}
                </div>
              ))}
            </div>

            {/* Heat Map Rows */}
            {HEATMAP_DATA.map((row, idx) => (
              <div key={idx} className="grid grid-cols-11 gap-1">
                <div className="text-xs font-semibold text-muted-foreground flex items-center justify-end pr-2">
                  {row.period}
                </div>
                {CATEGORY_MODULES.map((module) => {
                  const value = row.data[module.name.split(' ')[0] as keyof typeof row.data] || 0;
                  return (
                    <div
                      key={module.id}
                      className={`h-12 rounded flex items-center justify-center text-xs font-semibold ${getHeatmapColor(
                        value
                      )} ${getHeatmapTextColor(value)} hover:scale-110 transition cursor-pointer`}
                      title={`${module.name}: ${value}%`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="text-muted-foreground font-medium">Chú thích:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-red-400 rounded"></div>
              <span>&lt;60%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-orange-400 rounded"></div>
              <span>60-69%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-yellow-400 rounded"></div>
              <span>70-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-green-400 rounded"></div>
              <span>80-89%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-green-500 rounded"></div>
              <span>≥90%</span>
            </div>
          </div>
        </Card>

        {/* Cảnh báo ưu tiên */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Cảnh báo ưu tiên</h2>
            <Badge variant="destructive" className="text-xs">
              {PRIORITY_ALERTS.length} vấn đề
            </Badge>
          </div>

          <div className="space-y-3">
            {PRIORITY_ALERTS.map((alert) => {
              const Icon = alert.icon;
              return (
                <Alert
                  key={alert.id}
                  className={`border-l-4 ${
                    alert.severity === 'high'
                      ? 'border-l-red-500 bg-red-50'
                      : alert.severity === 'medium'
                        ? 'border-l-yellow-500 bg-yellow-50'
                        : 'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${alert.color} mt-0.5`} />
                    <div className="flex-1">
                      <AlertDescription className="text-sm font-medium text-foreground">
                        {alert.title}
                      </AlertDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            alert.severity === 'high'
                              ? 'border-red-300 text-red-700'
                              : alert.severity === 'medium'
                                ? 'border-yellow-300 text-yellow-700'
                                : 'border-blue-300 text-blue-700'
                          }`}
                        >
                          {alert.severity === 'high' ? 'Cao' : alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Xem chi tiết →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Alert>
              );
            })}
          </div>

          <Button className="w-full mt-4" variant="outline">
            <AlertCircle className="w-4 h-4 mr-2" />
            Xem tất cả cảnh báo
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {CATEGORY_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Button
                key={module.id}
                variant="outline"
                className="h-auto py-4 flex-col gap-2 hover:border-primary hover:bg-primary/5"
              >
                <div className={`p-2 rounded-lg ${module.bgColor}`}>
                  <Icon className={`w-5 h-5 ${module.textColor}`} />
                </div>
                <span className="text-xs font-medium text-center">{module.name}</span>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
