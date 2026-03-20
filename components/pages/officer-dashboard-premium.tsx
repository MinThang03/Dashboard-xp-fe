'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OFFICER_MODULES, CATEGORIES, type Module } from '@/lib/officer-modules';
import { CategoryDashboard } from '@/components/category-dashboard';
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  FileText,
  MoreVertical,
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
  Award,
  Grid3x3,
  List,
  LayoutGrid,
  BarChart3,
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
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CaseItem {
  id: string;
  title: string;
  citizen: string;
  dateSubmitted: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  department: string;
  progress: number;
  assignee?: string;
}

const mockCases: CaseItem[] = [
  {
    id: 'HS-2024-001',
    title: 'Cấp giấy chứng thực hợp đồng',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-15',
    deadline: '2024-01-25',
    status: 'pending',
    priority: 'high',
    department: 'Tư pháp - Hộ tịch',
    progress: 0,
  },
  {
    id: 'HS-2024-002',
    title: 'Đăng ký biến động dân số',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-16',
    deadline: '2024-01-26',
    status: 'in-progress',
    priority: 'normal',
    department: 'Tư pháp - Hộ tịch',
    progress: 60,
    assignee: 'Bạn',
  },
  {
    id: 'HS-2024-003',
    title: 'Cấp phép xây dựng nhà ở',
    citizen: 'Lê Văn C',
    dateSubmitted: '2024-01-10',
    deadline: '2024-01-20',
    status: 'review',
    priority: 'urgent',
    department: 'Địa chính - Xây dựng',
    progress: 85,
    assignee: 'Bạn',
  },
  {
    id: 'HS-2024-004',
    title: 'Bổ sung thửa đất',
    citizen: 'Phạm Thị D',
    dateSubmitted: '2024-01-14',
    deadline: '2024-01-28',
    status: 'completed',
    priority: 'normal',
    department: 'Địa chính - Xây dựng',
    progress: 100,
  },
  {
    id: 'HS-2024-005',
    title: 'Cấp sổ bảo hiểm xã hội',
    citizen: 'Võ Văn E',
    dateSubmitted: '2024-01-13',
    deadline: '2024-01-27',
    status: 'in-progress',
    priority: 'high',
    department: 'Lao động - An sinh',
    progress: 45,
  },
  {
    id: 'HS-2024-006',
    title: 'Xin giấy phép kinh doanh',
    citizen: 'Hoàng Thị F',
    dateSubmitted: '2024-01-17',
    deadline: '2024-01-30',
    status: 'pending',
    priority: 'normal',
    department: 'Tài chính - Kế hoạch',
    progress: 0,
  },
];

const performanceData = [
  { day: 'T2', completed: 8, target: 10 },
  { day: 'T3', completed: 12, target: 10 },
  { day: 'T4', completed: 10, target: 10 },
  { day: 'T5', completed: 15, target: 10 },
  { day: 'T6', completed: 11, target: 10 },
  { day: 'T7', completed: 9, target: 10 },
  { day: 'CN', completed: 0, target: 0 },
];

const statusConfig = {
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: Clock,
    gradient: 'from-gray-400 to-gray-500',
  },
  'in-progress': {
    label: 'Đang xử lý',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: Zap,
    gradient: 'from-blue-400 to-cyan-500',
  },
  review: {
    label: 'Chờ duyệt',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    icon: Eye,
    gradient: 'from-purple-400 to-pink-500',
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: CheckCircle2,
    gradient: 'from-green-400 to-emerald-500',
  },
};

const priorityConfig = {
  low: { label: 'Thấp', color: 'bg-slate-500', dotColor: 'bg-slate-400' },
  normal: { label: 'Thường', color: 'bg-blue-500', dotColor: 'bg-blue-400' },
  high: { label: 'Cao', color: 'bg-orange-500', dotColor: 'bg-orange-400' },
  urgent: { label: 'Khẩn cấp', color: 'bg-red-500', dotColor: 'bg-red-400' },
};

export function OfficerDashboardPremium() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'modules' | 'tasks'>('modules');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const filteredModules = OFFICER_MODULES.filter((module) => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNavigateToFunction = (path: string) => {
    router.push(path);
  };

  const myCompletedToday = 8;
  const myInProgress = 12;
  const totalModules = OFFICER_MODULES.length;
  const totalFunctions = OFFICER_MODULES.reduce((acc, m) => acc + m.functions.length, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Bàn làm việc Cán bộ</h1>
              </div>
              <p className="text-white/90 text-lg">Hệ thống quản lý chuyên môn tổng hợp</p>
              <p className="text-white/80 text-sm mt-2">
                {totalModules} module • {totalFunctions} chức năng
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-blue-600 hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" />
                Tạo hồ sơ mới
              </Button>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-0">Hôm nay</Badge>
            </div>
            <p className="text-3xl font-bold">{myCompletedToday}</p>
            <p className="text-sm text-muted-foreground mt-1">Công việc hoàn thành</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+3 so với hôm qua</span>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-700 border-0">Đang xử lý</Badge>
            </div>
            <p className="text-3xl font-bold">{myInProgress}</p>
            <p className="text-sm text-muted-foreground mt-1">Hồ sơ đang xử lý</p>
            <div className="mt-4 text-sm text-muted-foreground">
              5 hồ sơ cần ưu tiên
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <LayoutGrid className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-500/10 text-purple-700 border-0">Hệ thống</Badge>
            </div>
            <p className="text-3xl font-bold">{totalModules}</p>
            <p className="text-sm text-muted-foreground mt-1">Module chức năng</p>
            <div className="mt-4 text-sm text-muted-foreground">
              {totalFunctions} chức năng chi tiết
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover-lift">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <Badge className="bg-amber-500/10 text-amber-700 border-0">Xuất sắc</Badge>
            </div>
            <p className="text-3xl font-bold">4.8/5.0</p>
            <p className="text-sm text-muted-foreground mt-1">Đánh giá TB</p>
            <div className="mt-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-lg">★</span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs: Overview vs Category Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutGrid className="w-4 h-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="category" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Theo lĩnh vực
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* View Mode Toggle & Filters */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'modules' ? 'default' : 'outline'}
                  onClick={() => setViewMode('modules')}
                  className="gap-2"
                >
                  <Grid3x3 className="w-4 h-4" />
                  Module
                </Button>
                <Button
                  variant={viewMode === 'tasks' ? 'default' : 'outline'}
                  onClick={() => setViewMode('tasks')}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  Công việc
                </Button>
              </div>
              
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm module hoặc chức năng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-slate-50"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-11 px-4 border border-input rounded-lg bg-slate-50"
              >
                <option value="all">Tất cả lĩnh vực</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Module Grid View */}
          {viewMode === 'modules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                const ModuleIcon = module.icon;
                return (
                  <Card
                    key={module.id}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Header with gradient */}
                    <div className={`relative bg-gradient-to-br ${module.color} p-6 text-white`}>
                      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <ModuleIcon className="w-8 h-8" />
                          </div>
                          <Badge className="bg-white/20 text-white border-0">
                            {module.functions.length} chức năng
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{module.name}</h3>
                        <p className="text-white/90 text-sm">{module.description}</p>
                      </div>
                    </div>

                    {/* Functions List */}
                    <div className="p-6 bg-white space-y-2 max-h-80 overflow-y-auto">
                      {module.functions.map((func) => {
                        const FuncIcon = func.icon;
                        return (
                          <button
                            key={func.id}
                            onClick={() => handleNavigateToFunction(func.path)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group/item"
                          >
                            <div className={`p-2 bg-gradient-to-br ${module.color} bg-opacity-10 rounded-lg flex-shrink-0`}>
                              <FuncIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm group-hover/item:text-primary transition-colors">
                                {func.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {func.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t">
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedModule(module);
                          setActiveTab('category');
                        }}
                      >
                        Xem dashboard lĩnh vực
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Tasks View */}
          {viewMode === 'tasks' && (
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="p-6 bg-slate-50 border-b">
                <h3 className="text-lg font-semibold">Các hồ sơ đang xử lý</h3>
                <p className="text-sm text-muted-foreground mt-1">Danh sách hồ sơ theo trạng thái</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold min-w-[100px]">Mã hồ sơ</th>
                      <th className="text-left p-4 font-semibold">Tiêu đề</th>
                      <th className="text-left p-4 font-semibold min-w-[120px]">Công dân</th>
                      <th className="text-left p-4 font-semibold min-w-[100px]">Trạng thái</th>
                      <th className="text-left p-4 font-semibold min-w-[80px]">Ưu tiên</th>
                      <th className="text-left p-4 font-semibold min-w-[100px]">Tiến độ</th>
                      <th className="text-left p-4 font-semibold min-w-[100px]">Hạn chót</th>
                      <th className="text-right p-4 font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCases.map((caseItem, index) => {
                      const StatusIcon = statusConfig[caseItem.status].icon;
                      return (
                        <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="font-semibold text-primary">{caseItem.id}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium">{caseItem.title}</span>
                          </td>
                          <td className="p-4 text-sm">{caseItem.citizen}</td>
                          <td className="p-4">
                            <Badge className={statusConfig[caseItem.status].color}>
                              {statusConfig[caseItem.status].label}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${priorityConfig[caseItem.priority].dotColor}`}></div>
                              <span className="text-sm">{priorityConfig[caseItem.priority].label}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                style={{ width: `${caseItem.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground">{caseItem.progress}%</span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{caseItem.deadline}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Performance Chart */}
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Hiệu suất tuần này</h3>
                <p className="text-sm text-muted-foreground mt-1">So sánh hồ sơ hoàn thành vs mục tiêu</p>
              </div>
              <Badge variant="outline">Tuần 1-2024</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [value, '']}
                />
                <Legend />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" name="Hoàn thành" />
                <Area type="monotone" dataKey="target" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTarget)" name="Mục tiêu" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick Access Shortcuts */}
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Truy cập nhanh</h3>
                <p className="text-sm text-muted-foreground mt-1">Các chức năng sử dụng thường xuyên</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {OFFICER_MODULES.slice(0, 6).map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setSelectedModule(module);
                      setActiveTab('category');
                    }}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`p-4 bg-gradient-to-br ${module.color} rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">{module.name}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Category Dashboard Tab */}
        <TabsContent value="category" className="space-y-6 mt-6">
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <select
                className="h-11 px-4 border border-input rounded-lg bg-slate-50 flex-1"
                value={selectedModule?.id || 'hanh-chinh-tu-phap'}
                onChange={(e) => {
                  const module = OFFICER_MODULES.find(m => m.id === e.target.value);
                  setSelectedModule(module || OFFICER_MODULES[0]);
                }}
              >
                {OFFICER_MODULES.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={() => setActiveTab('overview')}>
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Quay lại tổng quan
              </Button>
            </div>
          </Card>

          {selectedModule && (
            <CategoryDashboard
              categoryId={selectedModule.id}
              categoryName={selectedModule.name}
              gradientColors={selectedModule.color}
              icon={selectedModule.icon}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
