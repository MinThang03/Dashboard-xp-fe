/**
 * Dashboard Statistics - Dữ liệu thống kê tổng hợp cho Dashboard
 * Tổng hợp từ mock-data và database DashboardXaPhuong.sql
 * Theo 10 chuyên ngành của cán bộ
 */

import {
  FileText,
  Stethoscope,
  Store,
  ShieldCheck,
  Hammer,
  Heart,
  DollarSign,
  MapPin,
  TreePine,
  Landmark,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// ================================================================
// ĐỊNH NGHĨA CẤU TRÚC DỮ LIỆU
// ================================================================

export interface ModuleStats {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgGradient: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  trend: number; // Phần trăm thay đổi so với tháng trước
  trendDirection: 'up' | 'down' | 'stable';
  subStats: {
    label: string;
    value: number | string;
  }[];
}

export interface AlertItem {
  id: number;
  type: 'warning' | 'danger' | 'info' | 'success';
  module: string;
  title: string;
  description: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface HotspotItem {
  id: number;
  name: string;
  location: string;
  module: string;
  severity: 'high' | 'medium' | 'low';
  lat: number;
  lng: number;
  description: string;
  reportCount: number;
}

export interface KPIData {
  month: string;
  totalCases: number;
  completedOnTime: number;
  overdue: number;
  satisfaction: number;
}

// ================================================================
// 10 CHUYÊN NGÀNH - THỐNG KÊ TỔNG HỢP
// ================================================================

export const MODULE_STATISTICS: ModuleStats[] = [
  // 1. Hành chính tư pháp
  {
    id: 'hanh-chinh-tu-phap',
    name: 'Hành chính - Tư pháp',
    icon: FileText,
    color: '#3B82F6',
    bgGradient: 'from-blue-500/20 to-cyan-500/10',
    total: 245,
    completed: 198,
    pending: 32,
    overdue: 15,
    trend: 5.2,
    trendDirection: 'up',
    subStats: [
      { label: 'Hộ tịch', value: 68 },
      { label: 'Chứng thực', value: 85 },
      { label: 'Hộ khẩu', value: 42 },
      { label: 'Văn bản', value: 50 },
    ],
  },

  // 2. Y tế - Giáo dục
  {
    id: 'y-te-giao-duc',
    name: 'Y tế - Giáo dục',
    icon: Stethoscope,
    color: '#EF4444',
    bgGradient: 'from-red-500/20 to-pink-500/10',
    total: 1850,
    completed: 1720,
    pending: 98,
    overdue: 32,
    trend: 8.5,
    trendDirection: 'up',
    subStats: [
      { label: 'Lượt khám', value: 1250 },
      { label: 'Tiêm chủng', value: 380 },
      { label: 'Học sinh', value: '2,450' },
      { label: 'Trường học', value: 8 },
    ],
  },

  // 3. Kinh tế - Thương mại
  {
    id: 'kinh-te-thuong-mai',
    name: 'Kinh tế - Thương mại',
    icon: Store,
    color: '#10B981',
    bgGradient: 'from-green-500/20 to-emerald-500/10',
    total: 156,
    completed: 142,
    pending: 10,
    overdue: 4,
    trend: 3.2,
    trendDirection: 'up',
    subStats: [
      { label: 'Hộ kinh doanh', value: 89 },
      { label: 'Chợ/Điểm KD', value: 12 },
      { label: 'Thu phí', value: '45 tr' },
      { label: 'DN nhỏ', value: 23 },
    ],
  },

  // 4. Quốc phòng - An ninh
  {
    id: 'quoc-phong-an-ninh',
    name: 'An ninh - Trật tự',
    icon: ShieldCheck,
    color: '#F97316',
    bgGradient: 'from-orange-500/20 to-red-500/10',
    total: 178,
    completed: 156,
    pending: 15,
    overdue: 7,
    trend: -2.1,
    trendDirection: 'down',
    subStats: [
      { label: 'Tạm trú/vắng', value: 85 },
      { label: 'Vi phạm', value: 23 },
      { label: 'Phản ánh', value: 45 },
      { label: 'Điểm nóng', value: 5 },
    ],
  },

  // 5. Xây dựng - Hạ tầng
  {
    id: 'xay-dung-ha-tang',
    name: 'Xây dựng - Hạ tầng',
    icon: Hammer,
    color: '#F59E0B',
    bgGradient: 'from-amber-500/20 to-yellow-500/10',
    total: 87,
    completed: 72,
    pending: 10,
    overdue: 5,
    trend: 1.8,
    trendDirection: 'up',
    subStats: [
      { label: 'Cấp phép', value: 34 },
      { label: 'Theo dõi XD', value: 28 },
      { label: 'Hạ tầng', value: 15 },
      { label: 'Vi phạm XD', value: 10 },
    ],
  },

  // 6. Lao động - TBXH
  {
    id: 'lao-dong-tbxh',
    name: 'Lao động - TBXH',
    icon: Heart,
    color: '#EC4899',
    bgGradient: 'from-pink-500/20 to-rose-500/10',
    total: 324,
    completed: 298,
    pending: 18,
    overdue: 8,
    trend: 4.5,
    trendDirection: 'up',
    subStats: [
      { label: 'Hộ nghèo', value: 45 },
      { label: 'Bảo trợ XH', value: 128 },
      { label: 'Người có công', value: 67 },
      { label: 'Việc làm', value: 84 },
    ],
  },

  // 7. Tài chính
  {
    id: 'tai-chinh',
    name: 'Quản lý Tài chính',
    icon: DollarSign,
    color: '#8B5CF6',
    bgGradient: 'from-purple-500/20 to-indigo-500/10',
    total: 156,
    completed: 148,
    pending: 6,
    overdue: 2,
    trend: 6.8,
    trendDirection: 'up',
    subStats: [
      { label: 'Thu NS', value: '2.5 tỷ' },
      { label: 'Chi NS', value: '1.8 tỷ' },
      { label: 'Giải ngân', value: '85%' },
      { label: 'Dự toán', value: '12 phiếu' },
    ],
  },

  // 8. Địa chính
  {
    id: 'dia-chinh',
    name: 'Địa chính',
    icon: MapPin,
    color: '#14B8A6',
    bgGradient: 'from-teal-500/20 to-cyan-500/10',
    total: 198,
    completed: 165,
    pending: 25,
    overdue: 8,
    trend: 2.3,
    trendDirection: 'up',
    subStats: [
      { label: 'Hồ sơ đất', value: 78 },
      { label: 'Biến động', value: 45 },
      { label: 'Cấp sổ đỏ', value: 52 },
      { label: 'Tranh chấp', value: 23 },
    ],
  },

  // 9. Môi trường
  {
    id: 'moi-truong',
    name: 'Quản lý Môi trường',
    icon: TreePine,
    color: '#84CC16',
    bgGradient: 'from-lime-500/20 to-green-500/10',
    total: 89,
    completed: 78,
    pending: 8,
    overdue: 3,
    trend: 5.5,
    trendDirection: 'up',
    subStats: [
      { label: 'Chất lượng MT', value: 'Tốt' },
      { label: 'Thu gom rác', value: '95%' },
      { label: 'Vi phạm', value: 12 },
      { label: 'Điểm ô nhiễm', value: 4 },
    ],
  },

  // 10. Văn hóa - Du lịch
  {
    id: 'van-hoa-du-lich',
    name: 'Văn hóa - Du lịch',
    icon: Landmark,
    color: '#EAB308',
    bgGradient: 'from-yellow-500/20 to-amber-500/10',
    total: 67,
    completed: 58,
    pending: 7,
    overdue: 2,
    trend: 12.5,
    trendDirection: 'up',
    subStats: [
      { label: 'Di tích', value: 8 },
      { label: 'Làng nghề', value: 5 },
      { label: 'Lễ hội', value: 4 },
      { label: 'Cơ sở DL', value: 15 },
    ],
  },
];

// ================================================================
// CẢNH BÁO TOÀN HỆ THỐNG
// ================================================================

export const SYSTEM_ALERTS: AlertItem[] = [
  {
    id: 1,
    type: 'danger',
    module: 'Địa chính',
    title: 'Hồ sơ sắp quá hạn',
    description: '8 hồ sơ cấp sổ đỏ sắp quá hạn trong 2 ngày',
    count: 8,
    priority: 'high',
    timestamp: '2026-01-31 08:00:00',
  },
  {
    id: 2,
    type: 'warning',
    module: 'Tài chính',
    title: 'Vượt dự toán chi',
    description: 'Mục chi giáo dục vượt 105% dự toán',
    count: 1,
    priority: 'high',
    timestamp: '2026-01-31 09:30:00',
  },
  {
    id: 3,
    type: 'info',
    module: 'An ninh',
    title: 'Phản ánh mới',
    description: '5 phản ánh người dân cần xử lý',
    count: 5,
    priority: 'medium',
    timestamp: '2026-01-31 10:00:00',
  },
  {
    id: 4,
    type: 'warning',
    module: 'Môi trường',
    title: 'Điểm ô nhiễm mới',
    description: 'Phát hiện điểm xả rác trái phép tại Thôn 3',
    count: 1,
    priority: 'medium',
    timestamp: '2026-01-31 07:45:00',
  },
  {
    id: 5,
    type: 'info',
    module: 'Hành chính',
    title: 'Yêu cầu phê duyệt',
    description: '12 hồ sơ chờ lãnh đạo phê duyệt',
    count: 12,
    priority: 'medium',
    timestamp: '2026-01-31 08:30:00',
  },
  {
    id: 6,
    type: 'danger',
    module: 'Y tế',
    title: 'Dịch bệnh theo dõi',
    description: 'Theo dõi 3 ca nghi nhiễm sốt xuất huyết',
    count: 3,
    priority: 'high',
    timestamp: '2026-01-31 06:00:00',
  },
  {
    id: 7,
    type: 'success',
    module: 'Lao động',
    title: 'Chi trả trợ cấp',
    description: 'Hoàn thành chi trả trợ cấp tháng 1/2026',
    count: 195,
    priority: 'low',
    timestamp: '2026-01-30 16:00:00',
  },
  {
    id: 8,
    type: 'warning',
    module: 'Xây dựng',
    title: 'Xây dựng trái phép',
    description: 'Phát hiện 2 công trình xây không phép',
    count: 2,
    priority: 'high',
    timestamp: '2026-01-31 11:00:00',
  },
];

// ================================================================
// ĐIỂM NÓNG GIS
// ================================================================

export const HOTSPOT_DATA: HotspotItem[] = [
  {
    id: 1,
    name: 'Tranh chấp đất đai Khu A',
    location: 'Phường 1, Tổ 5',
    module: 'Địa chính',
    severity: 'high',
    lat: 21.0285,
    lng: 105.854,
    description: 'Tranh chấp ranh giới giữa 3 hộ dân',
    reportCount: 8,
  },
  {
    id: 2,
    name: 'Điểm xả rác trái phép',
    location: 'Đường ĐT 100, Km 3',
    module: 'Môi trường',
    severity: 'medium',
    lat: 21.0456,
    lng: 105.812,
    description: 'Điểm tập kết rác tự phát, gây ô nhiễm',
    reportCount: 12,
  },
  {
    id: 3,
    name: 'Xây dựng không phép',
    location: 'Thôn 2, Xã A',
    module: 'Xây dựng',
    severity: 'high',
    lat: 21.032,
    lng: 105.865,
    description: 'Công trình 3 tầng chưa có giấy phép',
    reportCount: 3,
  },
  {
    id: 4,
    name: 'Điểm nóng ANTT',
    location: 'Chợ đêm Phường 2',
    module: 'An ninh',
    severity: 'medium',
    lat: 21.025,
    lng: 105.848,
    description: 'Nhiều vụ trộm cắp vặt',
    reportCount: 5,
  },
  {
    id: 5,
    name: 'Khu vực ngập úng',
    location: 'Ngõ 15, Đường Trần Phú',
    module: 'Xây dựng',
    severity: 'low',
    lat: 21.038,
    lng: 105.858,
    description: 'Hệ thống thoát nước xuống cấp',
    reportCount: 15,
  },
];

// ================================================================
// DỮ LIỆU KPI THEO THÁNG
// ================================================================

export const KPI_MONTHLY_DATA: KPIData[] = [
  { month: 'T1', totalCases: 350, completedOnTime: 310, overdue: 40, satisfaction: 4.2 },
  { month: 'T2', totalCases: 380, completedOnTime: 345, overdue: 35, satisfaction: 4.3 },
  { month: 'T3', totalCases: 420, completedOnTime: 390, overdue: 30, satisfaction: 4.4 },
  { month: 'T4', totalCases: 450, completedOnTime: 420, overdue: 30, satisfaction: 4.5 },
  { month: 'T5', totalCases: 480, completedOnTime: 455, overdue: 25, satisfaction: 4.5 },
  { month: 'T6', totalCases: 520, completedOnTime: 495, overdue: 25, satisfaction: 4.6 },
];

// ================================================================
// THỐNG KÊ TỔNG HỢP
// ================================================================

export const SUMMARY_STATS = {
  totalCases: MODULE_STATISTICS.reduce((sum, m) => sum + m.total, 0),
  completedCases: MODULE_STATISTICS.reduce((sum, m) => sum + m.completed, 0),
  pendingCases: MODULE_STATISTICS.reduce((sum, m) => sum + m.pending, 0),
  overdueCases: MODULE_STATISTICS.reduce((sum, m) => sum + m.overdue, 0),
  onTimeRate: Math.round(
    (MODULE_STATISTICS.reduce((sum, m) => sum + m.completed, 0) /
      MODULE_STATISTICS.reduce((sum, m) => sum + m.total, 0)) *
      100
  ),
  avgSatisfaction: 4.6,
  totalAlerts: SYSTEM_ALERTS.filter((a) => a.type === 'danger' || a.type === 'warning').length,
  criticalAlerts: SYSTEM_ALERTS.filter((a) => a.priority === 'high').length,
};

// ================================================================
// DỮ LIỆU BIỂU ĐỒ THEO LĨNH VỰC
// ================================================================

export const CASES_BY_DEPARTMENT = MODULE_STATISTICS.map((m) => ({
  name: m.name.split(' - ')[0],
  value: m.total,
  color: m.color,
  completed: m.completed,
  pending: m.pending,
  overdue: m.overdue,
}));

export const BUDGET_BY_DEPARTMENT = [
  { name: 'Hành chính', allocated: 1200, spent: 980, percent: 82 },
  { name: 'Y tế - GD', allocated: 3500, spent: 3200, percent: 91 },
  { name: 'Kinh tế', allocated: 800, spent: 650, percent: 81 },
  { name: 'An ninh', allocated: 1500, spent: 1350, percent: 90 },
  { name: 'Xây dựng', allocated: 2000, spent: 1600, percent: 80 },
  { name: 'Lao động', allocated: 2800, spent: 2700, percent: 96 },
  { name: 'Tài chính', allocated: 500, spent: 420, percent: 84 },
  { name: 'Địa chính', allocated: 600, spent: 480, percent: 80 },
  { name: 'Môi trường', allocated: 900, spent: 750, percent: 83 },
  { name: 'Văn hóa', allocated: 700, spent: 580, percent: 83 },
];

// ================================================================
// HELPER FUNCTIONS
// ================================================================

export const getModuleStatsById = (id: string): ModuleStats | undefined => {
  return MODULE_STATISTICS.find((m) => m.id === id);
};

export const getAlertsByModule = (module: string): AlertItem[] => {
  return SYSTEM_ALERTS.filter((a) => a.module === module);
};

export const getHighPriorityAlerts = (): AlertItem[] => {
  return SYSTEM_ALERTS.filter((a) => a.priority === 'high');
};

export const getHotspotsByModule = (module: string): HotspotItem[] => {
  return HOTSPOT_DATA.filter((h) => h.module === module);
};

export const getTopModulesByOverdue = (limit: number = 5): ModuleStats[] => {
  return [...MODULE_STATISTICS].sort((a, b) => b.overdue - a.overdue).slice(0, limit);
};

export const getTopModulesByTotal = (limit: number = 5): ModuleStats[] => {
  return [...MODULE_STATISTICS].sort((a, b) => b.total - a.total).slice(0, limit);
};
