'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
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
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
} from 'lucide-react';

interface CategoryDashboardProps {
  categoryId: string;
  categoryName: string;
  gradientColors: string;
  icon: any;
}

const SAMPLE_DATA = {
  'hanh-chinh-tu-phap': {
    stats: [
      { label: 'Hồ sơ xử lý', value: 245, change: '+12%', icon: FileText, color: 'text-primary' },
      { label: 'Hoàn thành', value: 198, change: '+8%', icon: CheckCircle2, color: 'text-status-success' },
      { label: 'Đang xử lý', value: 34, change: '-5%', icon: Clock, color: 'text-status-warning' },
      { label: 'Quá hạn', value: 13, change: '-15%', icon: AlertCircle, color: 'text-status-danger' },
    ],
    chartData: [
      { month: 'T1', hoSo: 185, hoanThanh: 156, quaHan: 8 },
      { month: 'T2', hoSo: 210, hoanThanh: 178, quaHan: 12 },
      { month: 'T3', hoSo: 245, hoanThanh: 198, quaHan: 13 },
    ],
    pieData: [
      { name: 'Hộ tịch', value: 450, color: '#DA291C' },
      { name: 'Chứng thực', value: 320, color: '#003F88' },
      { name: 'Hộ khẩu', value: 280, color: '#FFD700' },
      { name: 'Văn bản', value: 150, color: '#16a34a' },
    ],
  },
  'y-te-giao-duc': {
    stats: [
      { label: 'Học sinh', value: 2845, change: '+3%', icon: Users, color: 'text-secondary' },
      { label: 'Tỷ lệ đi học', value: '98.5%', change: '+1.2%', icon: CheckCircle2, color: 'text-status-success' },
      { label: 'Khám bệnh/ngày', value: 145, change: '+5%', icon: FileText, color: 'text-primary' },
      { label: 'Tiêm chủng', value: '95%', change: '+2%', icon: TrendingUp, color: 'text-status-success' },
    ],
    chartData: [
      { month: 'T1', hocSinh: 2805, khamBenh: 4120, tiemChung: 450 },
      { month: 'T2', hocSinh: 2825, khamBenh: 4350, tiemChung: 520 },
      { month: 'T3', hocSinh: 2845, khamBenh: 4480, tiemChung: 580 },
    ],
    pieData: [
      { name: 'Y tế', value: 680, color: '#DA291C' },
      { name: 'Giáo dục', value: 520, color: '#003F88' },
    ],
  },
  'kinh-te-thuong-mai': {
    stats: [
      { label: 'Hộ kinh doanh', value: 356, change: '+8%', icon: Users, color: 'text-status-success' },
      { label: 'Doanh thu/tháng', value: '450M', change: '+12%', icon: TrendingUp, color: 'text-status-success' },
      { label: 'Thu phí', value: '45.8M', change: '+5%', icon: FileText, color: 'text-status-warning' },
      { label: 'Tăng trưởng', value: '+15%', change: '+3%', icon: BarChart3, color: 'text-status-success' },
    ],
    chartData: [
      { month: 'T1', doanhThu: 380, thuPhi: 38, hoKD: 320 },
      { month: 'T2', doanhThu: 420, thuPhi: 42, hoKD: 345 },
      { month: 'T3', doanhThu: 450, thuPhi: 45, hoKD: 356 },
    ],
    pieData: [
      { name: 'Chợ', value: 245, color: '#16a34a' },
      { name: 'Hộ KD', value: 356, color: '#003F88' },
      { name: 'DN nhỏ', value: 89, color: '#FFD700' },
    ],
  },
  'quoc-phong-an-ninh': {
    stats: [
      { label: 'Sự kiện/tháng', value: 23, change: '-15%', icon: AlertCircle, color: 'text-red-600' },
      { label: 'Đã xử lý', value: 18, change: '+5%', icon: CheckCircle2, color: 'text-green-600' },
      { label: 'Phản ánh', value: 145, change: '+8%', icon: FileText, color: 'text-blue-600' },
      { label: 'Điểm nóng', value: 8, change: '-25%', icon: TrendingDown, color: 'text-green-600' },
    ],
    chartData: [
      { month: 'T1', suKien: 35, daXL: 28, diemNong: 12 },
      { month: 'T2', suKien: 28, daXL: 22, diemNong: 10 },
      { month: 'T3', suKien: 23, daXL: 18, diemNong: 8 },
    ],
    pieData: [
      { name: 'Vi phạm', value: 87, color: '#ef4444' },
      { name: 'ANTT', value: 145, color: '#f59e0b' },
      { name: 'Phản ánh', value: 145, color: '#3b82f6' },
    ],
  },
  'xay-dung-ha-tang': {
    stats: [
      { label: 'Công trình', value: 156, change: '+10%', icon: FileText, color: 'text-blue-600' },
      { label: 'GP xây dựng', value: 45, change: '+12%', icon: CheckCircle2, color: 'text-green-600' },
      { label: 'Vi phạm', value: 12, change: '-20%', icon: AlertCircle, color: 'text-red-600' },
      { label: 'Hạ tầng tốt', value: '81%', change: '+12%', icon: TrendingUp, color: 'text-green-600' },
    ],
    chartData: [
      { month: 'T1', congTrinh: 135, GP: 38, viPham: 18 },
      { month: 'T2', congTrinh: 148, GP: 42, viPham: 15 },
      { month: 'T3', congTrinh: 156, GP: 45, viPham: 12 },
    ],
    pieData: [
      { name: 'Nhà ở', value: 1245, color: '#3b82f6' },
      { name: 'Công trình CC', value: 28, color: '#10b981' },
      { name: 'Hạ tầng', value: 245, color: '#f59e0b' },
    ],
  },
  'lao-dong-tbxh': {
    stats: [
      { label: 'Hộ nghèo', value: 234, change: '-8%', icon: Users, color: 'text-blue-600' },
      { label: 'Bảo trợ XH', value: 156, change: '+5%', icon: FileText, color: 'text-purple-600' },
      { label: 'Người có công', value: 89, change: '+3%', icon: CheckCircle2, color: 'text-green-600' },
      { label: 'Tìm việc làm', value: 145, change: '+12%', icon: TrendingUp, color: 'text-amber-600' },
    ],
    chartData: [
      { month: 'T1', hoNgheo: 258, baoTro: 145, daCoViec: 75 },
      { month: 'T2', hoNgheo: 245, baoTro: 150, daCoViec: 82 },
      { month: 'T3', hoNgheo: 234, baoTro: 156, daCoViec: 89 },
    ],
    pieData: [
      { name: 'Hộ nghèo', value: 234, color: '#ef4444' },
      { name: 'Bảo trợ XH', value: 156, color: '#f59e0b' },
      { name: 'Người có công', value: 89, color: '#10b981' },
      { name: 'Việc làm', value: 145, color: '#3b82f6' },
    ],
  },
  'tai-chinh': {
    stats: [
      { label: 'Thu/tháng', value: '450M', change: '+8%', icon: TrendingUp, color: 'text-green-600' },
      { label: 'Chi/tháng', value: '380M', change: '+5%', icon: TrendingDown, color: 'text-red-600' },
      { label: 'Cân đối', value: '+70M', change: '+15%', icon: CheckCircle2, color: 'text-green-600' },
      { label: 'Giải ngân', value: '73%', change: '+12%', icon: BarChart3, color: 'text-blue-600' },
    ],
    chartData: [
      { month: 'T1', thu: 400, chi: 350, canDoi: 50 },
      { month: 'T2', thu: 430, chi: 365, canDoi: 65 },
      { month: 'T3', thu: 450, chi: 380, canDoi: 70 },
    ],
    pieData: [
      { name: 'Thu', value: 450, color: '#10b981' },
      { name: 'Chi', value: 380, color: '#ef4444' },
    ],
  },
  'dia-chinh': {
    stats: [
      { label: 'Hồ sơ đất', value: 3245, change: '+5%', icon: FileText, color: 'text-teal-600' },
      { label: 'Đã cấp sổ', value: 2856, change: '+8%', icon: CheckCircle2, color: 'text-green-600' },
      { label: 'Tranh chấp', value: 23, change: '-12%', icon: AlertCircle, color: 'text-red-600' },
      { label: 'Tỷ lệ số hóa', value: '94%', change: '+3%', icon: TrendingUp, color: 'text-purple-600' },
    ],
    chartData: [
      { month: 'T1', hoSo: 3180, capSo: 2750, tranhChap: 28 },
      { month: 'T2', hoSo: 3210, capSo: 2805, tranhChap: 25 },
      { month: 'T3', hoSo: 3245, capSo: 2856, tranhChap: 23 },
    ],
    pieData: [
      { name: 'Đã cấp sổ', value: 2856, color: '#10b981' },
      { name: 'Chưa cấp sổ', value: 389, color: '#f59e0b' },
      { name: 'Tranh chấp', value: 23, color: '#ef4444' },
    ],
  },
  'moi-truong': {
    stats: [
      { label: 'Chỉ số AQI', value: 45, change: '+8%', icon: TrendingUp, color: 'text-green-600' },
      { label: 'Rác thu/ngày', value: '2.5 tấn', change: '+5%', icon: FileText, color: 'text-amber-600' },
      { label: 'Phân loại', value: '68%', change: '+15%', icon: CheckCircle2, color: 'text-green-600' },
      { label: 'Báo cáo ô nhiễm', value: 34, change: '-10%', icon: AlertCircle, color: 'text-red-600' },
    ],
    chartData: [
      { month: 'T1', aqi: 52, racThai: 2.2, phanLoai: 58 },
      { month: 'T2', aqi: 48, racThai: 2.4, phanLoai: 64 },
      { month: 'T3', aqi: 45, racThai: 2.5, phanLoai: 68 },
    ],
    pieData: [
      { name: 'Không khí', value: 45, color: '#10b981' },
      { name: 'Nước', value: 72, color: '#3b82f6' },
      { name: 'Đất', value: 65, color: '#f59e0b' },
      { name: 'Rác thải', value: 250, color: '#ef4444' },
    ],
  },
  'van-hoa-du-lich': {
    stats: [
      { label: 'Di tích', value: 12, change: '0%', icon: FileText, color: 'text-amber-600' },
      { label: 'Cơ sở DL', value: 28, change: '+18%', icon: TrendingUp, color: 'text-green-600' },
      { label: 'Lễ hội/năm', value: 12, change: '+20%', icon: CheckCircle2, color: 'text-purple-600' },
      { label: 'Khách/tháng', value: 1245, change: '+25%', icon: Users, color: 'text-blue-600' },
    ],
    chartData: [
      { month: 'T1', khach: 980, doanhThu: 350, leHoi: 2 },
      { month: 'T2', khach: 1150, doanhThu: 420, leHoi: 3 },
      { month: 'T3', khach: 1245, doanhThu: 450, leHoi: 2 },
    ],
    pieData: [
      { name: 'Di tích', value: 12, color: '#f59e0b' },
      { name: 'Du lịch', value: 28, color: '#10b981' },
      { name: 'Làng nghề', value: 3, color: '#3b82f6' },
      { name: 'Lễ hội', value: 12, color: '#ef4444' },
    ],
  },
};

export function CategoryDashboard({ categoryId, categoryName, gradientColors, icon: Icon }: CategoryDashboardProps) {
  const data = SAMPLE_DATA[categoryId as keyof typeof SAMPLE_DATA] || SAMPLE_DATA['hanh-chinh-tu-phap'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientColors} p-8 text-white`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Icon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Dashboard {categoryName}</h1>
          </div>
          <p className="text-white/90">Tổng quan và phân tích dữ liệu {categoryName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.stats.map((stat, index) => {
          const StatIcon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <Card key={index} className="p-6 border-0 shadow-lg hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 ${stat.color}/10 rounded-xl`}>
                  <StatIcon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge className={`${isPositive ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'} border-0`}>
                  {stat.change}
                </Badge>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Xu hướng theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={Object.keys(data.chartData[0])[1]} stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey={Object.keys(data.chartData[0])[2]} stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Phân bố theo loại</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6 border-0 shadow-lg lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">So sánh chi tiết</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={Object.keys(data.chartData[0])[1]} fill="#3b82f6" />
              <Bar dataKey={Object.keys(data.chartData[0])[2]} fill="#10b981" />
              {Object.keys(data.chartData[0]).length > 3 && (
                <Bar dataKey={Object.keys(data.chartData[0])[3]} fill="#f59e0b" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

export default CategoryDashboard;
