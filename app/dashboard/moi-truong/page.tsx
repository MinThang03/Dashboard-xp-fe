'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Search,
  Plus,
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Droplet,
  Wind,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const airQualityData = [
  { time: '00:00', aqi: 45, pm25: 12, pm10: 20 },
  { time: '04:00', aqi: 42, pm25: 11, pm10: 18 },
  { time: '08:00', aqi: 65, pm25: 25, pm10: 35 },
  { time: '12:00', aqi: 72, pm25: 30, pm10: 42 },
  { time: '16:00', aqi: 68, pm25: 28, pm10: 38 },
  { time: '20:00', aqi: 55, pm25: 20, pm10: 28 },
];

const wasteData = [
  { id: 'WT001', location: 'Phường 1', type: 'Sinh hoạt', amount: 850, status: 'collected', date: '2024-01-18' },
  { id: 'WT002', location: 'Phường 2', type: 'Tái chế', amount: 320, status: 'pending', date: '2024-01-18' },
  { id: 'WT003', location: 'Phường 3', type: 'Nguy hại', amount: 45, status: 'processing', date: '2024-01-17' },
];

const pollutionReports = [
  { id: 'PR001', type: 'Ô nhiễm nước', location: 'Khu vực A', severity: 'high', reporter: 'Nguyễn Văn A' },
  { id: 'PR002', type: 'Ô nhiễm không khí', location: 'Khu vực B', severity: 'medium', reporter: 'Trần Thị B' },
  { id: 'PR003', type: 'Tiếng ồn', location: 'Khu vực C', severity: 'low', reporter: 'Lê Văn C' },
];

export default function MoiTruongPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const currentAQI = 68;
  const aqiStatus = currentAQI <= 50 ? 'Tốt' : currentAQI <= 100 ? 'Trung bình' : currentAQI <= 150 ? 'Kém' : 'Xấu';
  const aqiColor =
    currentAQI <= 50
      ? 'from-green-500 to-emerald-600'
      : currentAQI <= 100
      ? 'from-yellow-500 to-amber-600'
      : currentAQI <= 150
      ? 'from-orange-500 to-red-600'
      : 'from-red-600 to-red-800';

  const totalWaste = wasteData.reduce((sum, w) => sum + w.amount, 0);
  const collectedWaste = wasteData.filter((w) => w.status === 'collected').reduce((sum, w) => sum + w.amount, 0);
  const collectionRate = ((collectedWaste / totalWaste) * 100).toFixed(1);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-success via-status-success to-secondary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Leaf className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý Môi trường</h1>
              </div>
              <p className="text-white/90">Giám sát chất lượng môi trường, rác thải, ô nhiễm</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-emerald-600 hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" />
                Báo cáo sự cố
              </Button>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${aqiColor} opacity-10`}></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-secondary/20 to-secondary/20 rounded-xl">
                <Wind className="w-6 h-6 text-secondary" />
              </div>
              <Badge
                className={`bg-gradient-to-r ${aqiColor} text-white border-0`}
              >
                {aqiStatus}
              </Badge>
            </div>
            <p className="text-3xl font-bold">{currentAQI}</p>
            <p className="text-sm text-muted-foreground mt-1">Chỉ số AQI</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <TrendingDown className="w-4 h-4" />
              <span>Giảm 5% so với hôm qua</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Trash2 className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-0">{collectionRate}%</Badge>
          </div>
          <p className="text-3xl font-bold">{totalWaste}</p>
          <p className="text-sm text-muted-foreground mt-1">Tổng rác thải (kg)</p>
          <div className="mt-4 text-sm text-muted-foreground">
            {collectedWaste}kg đã thu gom
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Droplet className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-green-500/10 text-green-700 border-0">Đạt</Badge>
          </div>
          <p className="text-3xl font-bold">7.2</p>
          <p className="text-sm text-muted-foreground mt-1">Chất lượng nước (pH)</p>
          <div className="mt-4 text-sm text-green-600">
            Trong tiêu chuẩn cho phép
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <Badge className="bg-red-500/10 text-red-700 border-0">Cần xử lý</Badge>
          </div>
          <p className="text-3xl font-bold">{pollutionReports.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Báo cáo ô nhiễm</p>
          <div className="mt-4 text-sm text-red-600">
            {pollutionReports.filter((r) => r.severity === 'high').length} báo cáo nghiêm trọng
          </div>
        </Card>
      </div>

      {/* Air Quality Chart */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Chất lượng không khí 24h</h3>
            <p className="text-sm text-muted-foreground mt-1">AQI, PM2.5, PM10</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={airQualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} name="AQI" />
            <Line type="monotone" dataKey="pm25" stroke="#10b981" strokeWidth={2} name="PM2.5" />
            <Line type="monotone" dataKey="pm10" stroke="#f59e0b" strokeWidth={2} name="PM10" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Waste Management & Pollution Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Management */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Quản lý rác thải</h3>
              <p className="text-sm text-muted-foreground mt-1">Theo dõi thu gom</p>
            </div>
          </div>
          <div className="space-y-3">
            {wasteData.map((waste) => (
              <div key={waste.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Trash2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{waste.location}</span>
                    <Badge
                      className={`${
                        waste.status === 'collected'
                          ? 'bg-green-500/10 text-green-700'
                          : waste.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-700'
                          : 'bg-blue-500/10 text-blue-700'
                      } border-0`}
                    >
                      {waste.status === 'collected'
                        ? 'Đã thu'
                        : waste.status === 'pending'
                        ? 'Chờ thu'
                        : 'Đang xử lý'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{waste.type}</span>
                    <span>•</span>
                    <span className="font-semibold text-foreground">{waste.amount}kg</span>
                    <span>•</span>
                    <span>{waste.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pollution Reports */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Báo cáo ô nhiễm</h3>
              <p className="text-sm text-muted-foreground mt-1">Cần xử lý khẩn cấp</p>
            </div>
          </div>
          <div className="space-y-3">
            {pollutionReports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div
                  className={`p-3 rounded-lg ${
                    report.severity === 'high'
                      ? 'bg-red-500/10'
                      : report.severity === 'medium'
                      ? 'bg-amber-500/10'
                      : 'bg-blue-500/10'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      report.severity === 'high'
                        ? 'text-red-600'
                        : report.severity === 'medium'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{report.type}</span>
                    <Badge
                      className={`${
                        report.severity === 'high'
                          ? 'bg-red-500/10 text-red-700'
                          : report.severity === 'medium'
                          ? 'bg-amber-500/10 text-amber-700'
                          : 'bg-blue-500/10 text-blue-700'
                      } border-0`}
                    >
                      {report.severity === 'high'
                        ? 'Nghiêm trọng'
                        : report.severity === 'medium'
                        ? 'Trung bình'
                        : 'Nhẹ'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{report.location}</span>
                    <span>•</span>
                    <span>Báo cáo bởi: {report.reporter}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Environmental Alerts */}
      <Card className="p-6 border-0 shadow-lg border-l-4 border-l-amber-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Cảnh báo môi trường</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Chỉ số AQI dự báo tăng cao trong giờ cao điểm chiều nay
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Phường 2 có rác thải chưa thu gom đúng hạn
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Khu vực A có báo cáo ô nhiễm nước nghiêm trọng - Cần kiểm tra ngay
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
