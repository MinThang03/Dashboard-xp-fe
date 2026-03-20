'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Search,
  Download,
  Building2,
  Users,
  TrendingUp,
  School,
  BookOpen,
  BarChart3,
  PieChart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Baby,
  Target,
  Award,
} from 'lucide-react';

// Dashboard data
const dashboardData = {
  overview: {
    totalSchools: 5,
    totalClassrooms: 92,
    totalStudents: 3210,
    totalTeachers: 185,
    avgAttendance: 97.2,
    nationalStandardRate: 80,
  },
  byType: [
    { type: 'Mầm non', schools: 2, students: 520, teachers: 41, attendance: 96.5, icon: Baby },
    { type: 'Tiểu học', schools: 2, students: 1570, teachers: 88, attendance: 97.8, icon: BookOpen },
    { type: 'THCS', schools: 1, students: 1120, teachers: 56, attendance: 97.1, icon: GraduationCap },
  ],
  schools: [
    { name: 'MN Hoa Mai', type: 'Mầm non', students: 320, teachers: 25, attendance: 96.0, standard: true },
    { name: 'MN Sao Mai', type: 'Mầm non', students: 200, teachers: 16, attendance: 97.0, standard: false },
    { name: 'TH Nguyễn Trãi', type: 'Tiểu học', students: 850, teachers: 48, attendance: 98.2, standard: true },
    { name: 'TH Hồ Văn Huê', type: 'Tiểu học', students: 720, teachers: 40, attendance: 97.5, standard: true },
    { name: 'THCS Lê Quý Đôn', type: 'THCS', students: 1120, teachers: 56, attendance: 97.1, standard: true },
  ],
  recentActivity: [
    { action: 'Cập nhật sĩ số', school: 'TH Nguyễn Trãi', time: '10 phút trước', status: 'success' },
    { action: 'Báo cáo điểm danh', school: 'MN Hoa Mai', time: '30 phút trước', status: 'success' },
    { action: 'Cần sửa chữa phòng học', school: 'MN Sao Mai', time: '1 giờ trước', status: 'warning' },
    { action: 'Đạt chuẩn quốc gia', school: 'TH Hồ Văn Huê', time: '2 giờ trước', status: 'info' },
  ],
  kpi: [
    { name: 'Tỷ lệ đi học', value: 97.2, target: 95, unit: '%' },
    { name: 'Đạt chuẩn QG', value: 80, target: 100, unit: '%' },
    { name: 'Tỷ lệ HS/GV', value: 17.4, target: 20, unit: '' },
    { name: 'Hoàn thành chương trình', value: 98.5, target: 98, unit: '%' },
  ],
};

export default function GiaoDucPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredSchools = dashboardData.schools.filter(school => {
    const matchSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || school.type === typeFilter;
    return matchSearch && matchType;
  });

  const getSchoolIcon = (type: string) => {
    switch (type) {
      case 'Mầm non': return <Baby className="w-4 h-4 text-pink-500" />;
      case 'Tiểu học': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'THCS': return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      default: return <School className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Tổng hợp Giáo dục</h1>
              </div>
              <p className="text-white/90">Dashboard quản lý giáo dục toàn xã/phường</p>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-white/90">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <School className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardData.overview.totalSchools}</p>
              <p className="text-xs text-muted-foreground">Trường học</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <Building2 className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardData.overview.totalClassrooms}</p>
              <p className="text-xs text-muted-foreground">Phòng học</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardData.overview.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Học sinh</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboardData.overview.totalTeachers}</p>
              <p className="text-xs text-muted-foreground">Giáo viên</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{dashboardData.overview.avgAttendance}%</p>
              <p className="text-xs text-muted-foreground">Tỷ lệ đi học</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-lg hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{dashboardData.overview.nationalStandardRate}%</p>
              <p className="text-xs text-muted-foreground">Đạt chuẩn QG</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats by Type + KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Type */}
        <Card className="col-span-2 p-6 border-0 shadow-lg">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Thống kê theo cấp học
          </h3>
          <div className="space-y-4">
            {dashboardData.byType.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{item.type}</span>
                      <Badge variant="outline">{item.schools} trường</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Học sinh: </span>
                        <span className="font-semibold">{item.students}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Giáo viên: </span>
                        <span className="font-semibold">{item.teachers}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Đi học: </span>
                        <span className="font-semibold text-green-600">{item.attendance}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* KPI */}
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Chỉ số KPI
          </h3>
          <div className="space-y-4">
            {dashboardData.kpi.map((kpi, index) => {
              const percentage = kpi.unit === '%' ? kpi.value : (kpi.value / kpi.target) * 100;
              const isGood = kpi.value >= kpi.target || (kpi.name === 'Tỷ lệ HS/GV' && kpi.value <= kpi.target);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{kpi.name}</span>
                    <span className={`font-semibold ${isGood ? 'text-green-600' : 'text-amber-600'}`}>
                      {kpi.value}{kpi.unit} / {kpi.target}{kpi.unit}
                    </span>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Schools List + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schools */}
        <Card className="col-span-2 border-0 shadow-lg overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <School className="w-5 h-5" />
              Danh sách trường học
            </h3>
            <div className="flex gap-2">
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Mầm non">Mầm non</SelectItem>
                  <SelectItem value="Tiểu học">Tiểu học</SelectItem>
                  <SelectItem value="THCS">THCS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-sm">Tên trường</th>
                  <th className="text-left p-3 font-semibold text-sm">Loại</th>
                  <th className="text-right p-3 font-semibold text-sm">Học sinh</th>
                  <th className="text-right p-3 font-semibold text-sm">Giáo viên</th>
                  <th className="text-right p-3 font-semibold text-sm">Đi học</th>
                  <th className="text-center p-3 font-semibold text-sm">Đạt chuẩn</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map((school, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getSchoolIcon(school.type)}
                        <span className="font-medium">{school.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{school.type}</Badge>
                    </td>
                    <td className="p-3 text-right font-semibold">{school.students}</td>
                    <td className="p-3 text-right">{school.teachers}</td>
                    <td className="p-3 text-right">
                      <span className={`font-semibold ${school.attendance >= 97 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {school.attendance}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {school.standard ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500/10' :
                  activity.status === 'warning' ? 'bg-yellow-500/10' :
                  'bg-blue-500/10'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : activity.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <Award className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.school}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold">Tổng kết tháng</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Học sinh mới</span>
              <span className="font-semibold text-green-600">+15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Giáo viên mới</span>
              <span className="font-semibold text-green-600">+3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phòng sửa chữa xong</span>
              <span className="font-semibold text-green-600">2</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="font-semibold">Cần chú ý</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phòng cần sửa</span>
              <span className="font-semibold text-amber-600">4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thiếu giáo viên</span>
              <span className="font-semibold text-amber-600">2 trường</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chưa đạt chuẩn</span>
              <span className="font-semibold text-amber-600">1 trường</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold">Phân bổ học sinh</h4>
          </div>
          <div className="space-y-2">
            {dashboardData.byType.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.type}</span>
                <span className="font-semibold">
                  {((item.students / dashboardData.overview.totalStudents) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
