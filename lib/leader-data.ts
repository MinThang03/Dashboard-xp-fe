/**
 * Leader Dashboard Data - Dữ liệu tổng hợp cho Lãnh đạo
 * Bao gồm thống kê và dữ liệu theo dõi 10 lĩnh vực
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
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

// ================================================================
// 10 LĨNH VỰC CHÍNH - Theo Database
// ================================================================

export interface FieldStats {
  id: string;
  code: string;
  name: string;
  icon: any;
  color: string;
  bgGradient: string;
  
  // Thống kê tổng quan
  totalCases: number;
  completedCases: number;
  pendingCases: number;
  overdueCases: number;
  
  // KPI
  completionRate: number; // % hoàn thành
  onTimeRate: number; // % đúng hạn
  satisfactionRate: number; // % hài lòng
  
  // Xu hướng
  trend: number; // % thay đổi so với kỳ trước
  trendDirection: 'up' | 'down' | 'stable';
  
  // Chi tiết theo phòng ban
  departments: {
    name: string;
    total: number;
    completed: number;
    pending: number;
  }[];
  
  // Các vấn đề cần chú ý
  alerts: {
    type: 'warning' | 'danger' | 'info';
    title: string;
    count: number;
  }[];
}

export const FIELD_STATISTICS: FieldStats[] = [
  // 1. Hành chính Tư pháp
  {
    id: '1',
    code: 'TU_PHAP',
    name: 'Hành chính Tư pháp',
    icon: FileText,
    color: '#3b82f6',
    bgGradient: 'from-blue-500 to-blue-700',
    totalCases: 2450,
    completedCases: 2180,
    pendingCases: 220,
    overdueCases: 50,
    completionRate: 89,
    onTimeRate: 85,
    satisfactionRate: 92,
    trend: 5.2,
    trendDirection: 'up',
    departments: [
      { name: 'Hộ tịch', total: 850, completed: 780, pending: 70 },
      { name: 'Chứng thực', total: 620, completed: 560, pending: 60 },
      { name: 'Hộ khẩu', total: 480, completed: 440, pending: 40 },
      { name: 'Một cửa', total: 500, completed: 400, pending: 50 },
    ],
    alerts: [
      { type: 'warning', title: 'Hồ sơ sắp quá hạn', count: 25 },
      { type: 'danger', title: 'Hồ sơ quá hạn', count: 15 },
      { type: 'info', title: 'Chờ bổ sung hồ sơ', count: 45 },
    ],
  },
  
  // 2. Y tế - Giáo dục
  {
    id: '2',
    code: 'Y_TE_GD',
    name: 'Y tế - Giáo dục',
    icon: Stethoscope,
    color: '#10b981',
    bgGradient: 'from-green-500 to-green-700',
    totalCases: 1850,
    completedCases: 1620,
    pendingCases: 180,
    overdueCases: 50,
    completionRate: 88,
    onTimeRate: 87,
    satisfactionRate: 94,
    trend: 3.8,
    trendDirection: 'up',
    departments: [
      { name: 'Y tế cơ sở', total: 680, completed: 600, pending: 80 },
      { name: 'Giáo dục', total: 520, completed: 460, pending: 60 },
      { name: 'Tiêm chủng', total: 350, completed: 320, pending: 30 },
      { name: 'Trạm y tế', total: 300, completed: 240, pending: 10 },
    ],
    alerts: [
      { type: 'info', title: 'Chiến dịch tiêm chủng', count: 12 },
      { type: 'warning', title: 'Dịch bệnh cần theo dõi', count: 8 },
      { type: 'info', title: 'Khám sức khỏe học sinh', count: 15 },
    ],
  },
  
  // 3. Kinh tế - Thương mại
  {
    id: '3',
    code: 'KINH_TE',
    name: 'Kinh tế - Thương mại',
    icon: Store,
    color: '#f59e0b',
    bgGradient: 'from-amber-500 to-amber-700',
    totalCases: 1320,
    completedCases: 1150,
    pendingCases: 140,
    overdueCases: 30,
    completionRate: 87,
    onTimeRate: 84,
    satisfactionRate: 88,
    trend: 7.5,
    trendDirection: 'up',
    departments: [
      { name: 'Hộ kinh doanh', total: 480, completed: 420, pending: 60 },
      { name: 'Chợ & TMĐT', total: 350, completed: 310, pending: 40 },
      { name: 'Hỗ trợ DN', total: 280, completed: 250, pending: 30 },
      { name: 'Việc làm', total: 210, completed: 170, pending: 10 },
    ],
    alerts: [
      { type: 'info', title: 'Đăng ký KD mới', count: 35 },
      { type: 'warning', title: 'Chứng nhận sắp hết hạn', count: 18 },
      { type: 'info', title: 'Hỗ trợ vốn vay', count: 22 },
    ],
  },
  
  // 4. Quốc phòng - An ninh
  {
    id: '4',
    code: 'AN_NINH',
    name: 'Quốc phòng - An ninh',
    icon: ShieldCheck,
    color: '#ef4444',
    bgGradient: 'from-red-500 to-red-700',
    totalCases: 980,
    completedCases: 880,
    pendingCases: 85,
    overdueCases: 15,
    completionRate: 90,
    onTimeRate: 89,
    satisfactionRate: 91,
    trend: -2.1,
    trendDirection: 'down',
    departments: [
      { name: 'An ninh trật tự', total: 380, completed: 350, pending: 30 },
      { name: 'Điểm nóng ANTT', total: 220, completed: 200, pending: 20 },
      { name: 'Vi phạm ATGT', total: 280, completed: 240, pending: 25 },
      { name: 'Tranh chấp', total: 100, completed: 90, pending: 10 },
    ],
    alerts: [
      { type: 'danger', title: 'Điểm nóng cần xử lý', count: 5 },
      { type: 'warning', title: 'Vi phạm trật tự', count: 12 },
      { type: 'info', title: 'Tuần tra định kỳ', count: 8 },
    ],
  },
  
  // 5. Xây dựng - Hạ tầng
  {
    id: '5',
    code: 'XAY_DUNG',
    name: 'Xây dựng - Hạ tầng',
    icon: Hammer,
    color: '#8b5cf6',
    bgGradient: 'from-purple-500 to-purple-700',
    totalCases: 1680,
    completedCases: 1420,
    pendingCases: 210,
    overdueCases: 50,
    completionRate: 85,
    onTimeRate: 81,
    satisfactionRate: 86,
    trend: 4.3,
    trendDirection: 'up',
    departments: [
      { name: 'Cấp phép XD', total: 520, completed: 450, pending: 70 },
      { name: 'Trật tự XD', total: 380, completed: 320, pending: 60 },
      { name: 'Hạ tầng', total: 450, completed: 380, pending: 50 },
      { name: 'Quy hoạch', total: 330, completed: 270, pending: 30 },
    ],
    alerts: [
      { type: 'danger', title: 'XD trái phép', count: 8 },
      { type: 'warning', title: 'Rủi ro quy hoạch', count: 15 },
      { type: 'info', title: 'Dự án hạ tầng mới', count: 10 },
    ],
  },
  
  // 6. Dân cư - Lao động
  {
    id: '6',
    code: 'LAO_DONG',
    name: 'Dân cư - Lao động',
    icon: Heart,
    color: '#ec4899',
    bgGradient: 'from-pink-500 to-pink-700',
    totalCases: 2150,
    completedCases: 1920,
    pendingCases: 180,
    overdueCases: 50,
    completionRate: 89,
    onTimeRate: 86,
    satisfactionRate: 93,
    trend: 2.8,
    trendDirection: 'up',
    departments: [
      { name: 'Hộ nghèo', total: 680, completed: 620, pending: 60 },
      { name: 'Bảo trợ xã hội', total: 580, completed: 520, pending: 60 },
      { name: 'Người có công', total: 480, completed: 440, pending: 40 },
      { name: 'Tạm trú/vắng', total: 410, completed: 340, pending: 20 },
    ],
    alerts: [
      { type: 'info', title: 'Hỗ trợ hộ nghèo', count: 45 },
      { type: 'info', title: 'Chế độ ưu đãi', count: 28 },
      { type: 'warning', title: 'Cần rà soát hồ sơ', count: 12 },
    ],
  },
  
  // 7. Quản lý Tài chính
  {
    id: '7',
    code: 'TAI_CHINH',
    name: 'Quản lý Tài chính',
    icon: DollarSign,
    color: '#06b6d4',
    bgGradient: 'from-cyan-500 to-cyan-700',
    totalCases: 1580,
    completedCases: 1420,
    pendingCases: 135,
    overdueCases: 25,
    completionRate: 90,
    onTimeRate: 88,
    satisfactionRate: 87,
    trend: 1.5,
    trendDirection: 'up',
    departments: [
      { name: 'Thu ngân sách', total: 580, completed: 540, pending: 40 },
      { name: 'Chi ngân sách', total: 480, completed: 430, pending: 50 },
      { name: 'Giải ngân', total: 320, completed: 280, pending: 30 },
      { name: 'Thu phí', total: 200, completed: 170, pending: 15 },
    ],
    alerts: [
      { type: 'warning', title: 'Cảnh báo dự toán', count: 8 },
      { type: 'info', title: 'Báo cáo tài chính', count: 15 },
      { type: 'warning', title: 'So sánh dự toán', count: 5 },
    ],
  },
  
  // 8. Địa chính
  {
    id: '8',
    code: 'DIA_CHINH',
    name: 'Địa chính',
    icon: MapPin,
    color: '#14b8a6',
    bgGradient: 'from-teal-500 to-teal-700',
    totalCases: 1450,
    completedCases: 1280,
    pendingCases: 140,
    overdueCases: 30,
    completionRate: 88,
    onTimeRate: 85,
    satisfactionRate: 89,
    trend: 3.2,
    trendDirection: 'up',
    departments: [
      { name: 'Cấp sổ đỏ', total: 520, completed: 460, pending: 60 },
      { name: 'Tra cứu đất', total: 380, completed: 340, pending: 40 },
      { name: 'Biến động đất', total: 320, completed: 280, pending: 30 },
      { name: 'Thẩm định đất', total: 230, completed: 200, pending: 10 },
    ],
    alerts: [
      { type: 'info', title: 'Cấp sổ mới', count: 32 },
      { type: 'warning', title: 'Tranh chấp đất đai', count: 8 },
      { type: 'info', title: 'Báo cáo đất đai', count: 12 },
    ],
  },
  
  // 9. Quản lý Môi trường
  {
    id: '9',
    code: 'MOI_TRUONG',
    name: 'Quản lý Môi trường',
    icon: TreePine,
    color: '#22c55e',
    bgGradient: 'from-green-600 to-green-800',
    totalCases: 1120,
    completedCases: 950,
    pendingCases: 140,
    overdueCases: 30,
    completionRate: 85,
    onTimeRate: 82,
    satisfactionRate: 88,
    trend: 6.8,
    trendDirection: 'up',
    departments: [
      { name: 'Chất lượng MT', total: 380, completed: 330, pending: 50 },
      { name: 'Rác thải', total: 320, completed: 270, pending: 40 },
      { name: 'Ô nhiễm', total: 280, completed: 230, pending: 35 },
      { name: 'Báo cáo MT', total: 140, completed: 120, pending: 15 },
    ],
    alerts: [
      { type: 'danger', title: 'Ô nhiễm nghiêm trọng', count: 3 },
      { type: 'warning', title: 'Điểm nóng MT', count: 12 },
      { type: 'info', title: 'Kiểm tra định kỳ', count: 8 },
    ],
  },
  
  // 10. Văn hóa - Du lịch
  {
    id: '10',
    code: 'VAN_HOA',
    name: 'Văn hóa - Du lịch',
    icon: Landmark,
    color: '#a855f7',
    bgGradient: 'from-purple-600 to-purple-800',
    totalCases: 820,
    completedCases: 710,
    pendingCases: 95,
    overdueCases: 15,
    completionRate: 87,
    onTimeRate: 84,
    satisfactionRate: 91,
    trend: 8.5,
    trendDirection: 'up',
    departments: [
      { name: 'Di tích', total: 280, completed: 250, pending: 30 },
      { name: 'Lễ hội', total: 220, completed: 190, pending: 30 },
      { name: 'Làng nghề', total: 180, completed: 150, pending: 25 },
      { name: 'Kinh doanh DL', total: 140, completed: 120, pending: 10 },
    ],
    alerts: [
      { type: 'info', title: 'Lễ hội sắp tới', count: 5 },
      { type: 'info', title: 'Hồ sơ di tích', count: 8 },
      { type: 'warning', title: 'Bảo tồn di sản', count: 4 },
    ],
  },
];

// ================================================================
// TỔNG QUAN TOÀN XÃ/PHƯỜNG
// ================================================================

export interface OverallStats {
  totalPopulation: number;
  totalHouseholds: number;
  totalCases: number;
  completedCases: number;
  pendingCases: number;
  overdueCases: number;
  totalDepartments: number;
  totalOfficers: number;
  
  // KPI tổng
  overallCompletionRate: number;
  overallOnTimeRate: number;
  overallSatisfactionRate: number;
  
  // Tài chính
  budget: {
    total: number;
    spent: number;
    remaining: number;
    spentPercentage: number;
  };
  
  // Xu hướng theo tháng (12 tháng)
  monthlyTrend: {
    month: string;
    totalCases: number;
    completedCases: number;
    completionRate: number;
  }[];
}

export const OVERALL_STATISTICS: OverallStats = {
  totalPopulation: 28500,
  totalHouseholds: 7850,
  totalCases: 15400,
  completedCases: 13530,
  pendingCases: 1625,
  overdueCases: 345,
  totalDepartments: 42,
  totalOfficers: 125,
  
  overallCompletionRate: 88,
  overallOnTimeRate: 85,
  overallSatisfactionRate: 90,
  
  budget: {
    total: 58500000000, // 58.5 tỷ
    spent: 42800000000, // 42.8 tỷ
    remaining: 15700000000, // 15.7 tỷ
    spentPercentage: 73,
  },
  
  monthlyTrend: [
    { month: 'T1', totalCases: 1180, completedCases: 1020, completionRate: 86 },
    { month: 'T2', totalCases: 1250, completedCases: 1080, completionRate: 86 },
    { month: 'T3', totalCases: 1320, completedCases: 1150, completionRate: 87 },
    { month: 'T4', totalCases: 1280, completedCases: 1120, completionRate: 87 },
    { month: 'T5', totalCases: 1350, completedCases: 1190, completionRate: 88 },
    { month: 'T6', totalCases: 1420, completedCases: 1260, completionRate: 89 },
    { month: 'T7', totalCases: 1380, completedCases: 1220, completionRate: 88 },
    { month: 'T8', totalCases: 1290, completedCases: 1140, completionRate: 88 },
    { month: 'T9', totalCases: 1310, completedCases: 1160, completionRate: 89 },
    { month: 'T10', totalCases: 1240, completedCases: 1100, completionRate: 89 },
    { month: 'T11', totalCases: 1200, completedCases: 1060, completionRate: 88 },
    { month: 'T12', totalCases: 1180, completedCases: 1030, completionRate: 87 },
  ],
};

// ================================================================
// CẢNH BÁO VÀ ĐIỂM NÓNG
// ================================================================

export interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  fieldCode: string;
  fieldName: string;
  title: string;
  description: string;
  department: string;
  createdDate: string;
  dueDate?: string;
  status: 'new' | 'processing' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

export const ALERTS: Alert[] = [
  {
    id: 1,
    type: 'critical',
    fieldCode: 'AN_NINH',
    fieldName: 'An ninh trật tự',
    title: 'Điểm nóng ANTT tại Khu A cần xử lý khẩn',
    description: 'Có 3 vụ tranh chấp đất đai leo thang, cần sự can thiệp của lãnh đạo',
    department: 'Công an xã',
    createdDate: '2024-01-15',
    dueDate: '2024-01-18',
    status: 'processing',
    priority: 'high',
    assignedTo: 'Đội trưởng CA',
  },
  {
    id: 2,
    type: 'critical',
    fieldCode: 'MOI_TRUONG',
    fieldName: 'Môi trường',
    title: 'Ô nhiễm nghiêm trọng tại Khu công nghiệp',
    description: 'Mức độ ô nhiễm vượt ngưỡng cho phép 3 lần, cần xử lý ngay',
    department: 'TN&MT',
    createdDate: '2024-01-16',
    dueDate: '2024-01-19',
    status: 'new',
    priority: 'high',
    assignedTo: 'Trưởng phòng TN&MT',
  },
  {
    id: 3,
    type: 'warning',
    fieldCode: 'XAY_DUNG',
    fieldName: 'Xây dựng',
    title: '8 công trình xây dựng trái phép',
    description: 'Phát hiện 8 công trình xây dựng không phép tại thôn 2 và 3',
    department: 'Xây dựng & Quy hoạch',
    createdDate: '2024-01-14',
    status: 'processing',
    priority: 'medium',
    assignedTo: 'Thanh tra XD',
  },
  {
    id: 4,
    type: 'warning',
    fieldCode: 'TAI_CHINH',
    fieldName: 'Tài chính',
    title: 'Cảnh báo dự toán vượt mức cho phép',
    description: 'Chi phí thực tế của 2 dự án đang vượt dự toán 15%',
    department: 'Tài chính - Kế toán',
    createdDate: '2024-01-13',
    status: 'processing',
    priority: 'medium',
  },
  {
    id: 5,
    type: 'warning',
    fieldCode: 'TU_PHAP',
    fieldName: 'Hành chính',
    title: '50 hồ sơ sắp quá hạn xử lý',
    description: 'Có 50 hồ sơ hành chính sẽ quá hạn trong 3 ngày tới',
    department: 'Văn phòng UBND',
    createdDate: '2024-01-15',
    dueDate: '2024-01-18',
    status: 'new',
    priority: 'medium',
  },
  {
    id: 6,
    type: 'info',
    fieldCode: 'VAN_HOA',
    fieldName: 'Văn hóa',
    title: '3 lễ hội truyền thống sắp diễn ra',
    description: 'Cần phê duyệt kế hoạch và ngân sách cho 3 lễ hội truyền thống',
    department: 'Văn hóa - Thể thao',
    createdDate: '2024-01-12',
    status: 'new',
    priority: 'low',
  },
  {
    id: 7,
    type: 'info',
    fieldCode: 'Y_TE_GD',
    fieldName: 'Y tế',
    title: 'Chiến dịch tiêm chủng mở rộng',
    description: 'Kế hoạch triển khai chiến dịch tiêm chủng cho trẻ em dưới 5 tuổi',
    department: 'Trạm y tế xã',
    createdDate: '2024-01-10',
    status: 'resolved',
    priority: 'low',
  },
  {
    id: 8,
    type: 'warning',
    fieldCode: 'DIA_CHINH',
    fieldName: 'Địa chính',
    title: 'Tranh chấp đất đai tăng cao',
    description: 'Số vụ tranh chấp đất đai tháng này tăng 25% so với tháng trước',
    department: 'TN&MT',
    createdDate: '2024-01-14',
    status: 'processing',
    priority: 'medium',
  },
];

// ================================================================
// HỒ SƠ CHỜ PHÊ DUYỆT
// ================================================================

export interface ApprovalCase {
  id: number;
  caseNumber: string;
  title: string;
  fieldCode: string;
  fieldName: string;
  department: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  documents: {
    name: string;
    size: string;
  }[];
  amount?: number; // Số tiền (cho hồ sơ tài chính)
}

export const APPROVAL_CASES: ApprovalCase[] = [
  {
    id: 1,
    caseNumber: 'TC-2024-001',
    title: 'Báo cáo quyết toán ngân sách quý I/2024',
    fieldCode: 'TAI_CHINH',
    fieldName: 'Tài chính',
    department: 'Tài chính - Kế toán',
    submittedBy: 'Nguyễn Văn Tài',
    submittedDate: '2024-01-15',
    dueDate: '2024-01-20',
    priority: 'critical',
    type: 'Báo cáo tài chính',
    status: 'pending',
    amount: 15800000000,
    documents: [
      { name: 'bao-cao-quyet-toan-q1.pdf', size: '3.2 MB' },
      { name: 'bang-ke-chi-tiet.xlsx', size: '1.8 MB' },
    ],
  },
  {
    id: 2,
    caseNumber: 'XD-2024-048',
    title: 'Cấp phép xây dựng nhà ở - Anh Trần Văn B',
    fieldCode: 'XAY_DUNG',
    fieldName: 'Xây dựng',
    department: 'Xây dựng & Quy hoạch',
    submittedBy: 'Phạm Thị Hoa',
    submittedDate: '2024-01-14',
    dueDate: '2024-01-25',
    priority: 'high',
    type: 'Cấp phép xây dựng',
    status: 'reviewing',
    documents: [
      { name: 'don-xin-phep.pdf', size: '890 KB' },
      { name: 'ban-ve-thiet-ke.pdf', size: '4.5 MB' },
      { name: 'giay-to-quyen-su-dung-dat.pdf', size: '1.2 MB' },
    ],
  },
  {
    id: 3,
    caseNumber: 'DC-2024-125',
    title: 'Cấp giấy chứng nhận quyền sử dụng đất - Chị Lê T.C',
    fieldCode: 'DIA_CHINH',
    fieldName: 'Địa chính',
    department: 'TN&MT',
    submittedBy: 'Vũ Văn Long',
    submittedDate: '2024-01-13',
    dueDate: '2024-01-28',
    priority: 'high',
    type: 'Cấp sổ đỏ',
    status: 'pending',
    documents: [
      { name: 'don-xin-cap-so.pdf', size: '650 KB' },
      { name: 'ban-do-thua-dat.pdf', size: '2.1 MB' },
      { name: 'hop-dong-chuyen-nhuong.pdf', size: '1.5 MB' },
    ],
  },
  {
    id: 4,
    caseNumber: 'VH-2024-008',
    title: 'Kế hoạch tổ chức Lễ hội truyền thống',
    fieldCode: 'VAN_HOA',
    fieldName: 'Văn hóa',
    department: 'Văn hóa - Thể thao',
    submittedBy: 'Hoàng Thị Mai',
    submittedDate: '2024-01-12',
    dueDate: '2024-01-22',
    priority: 'medium',
    type: 'Kế hoạch sự kiện',
    status: 'pending',
    amount: 125000000,
    documents: [
      { name: 'ke-hoach-to-chuc.pdf', size: '1.8 MB' },
      { name: 'du-toan-kinh-phi.xlsx', size: '420 KB' },
    ],
  },
  {
    id: 5,
    caseNumber: 'LD-2024-082',
    title: 'Hỗ trợ hộ nghèo - 15 hộ gia đình',
    fieldCode: 'LAO_DONG',
    fieldName: 'Lao động',
    department: 'Lao động - TB&XH',
    submittedBy: 'Đỗ Văn Khoa',
    submittedDate: '2024-01-16',
    dueDate: '2024-01-26',
    priority: 'high',
    type: 'Hỗ trợ xã hội',
    status: 'pending',
    amount: 45000000,
    documents: [
      { name: 'danh-sach-ho-ngheo.xlsx', size: '280 KB' },
      { name: 'bien-ban-kiem-tra.pdf', size: '1.1 MB' },
    ],
  },
  {
    id: 6,
    caseNumber: 'HA-2024-035',
    title: 'Dự án nâng cấp đường giao thông nội bộ',
    fieldCode: 'XAY_DUNG',
    fieldName: 'Hạ tầng',
    department: 'Xây dựng & Quy hoạch',
    submittedBy: 'Lương Văn Đức',
    submittedDate: '2024-01-11',
    dueDate: '2024-01-30',
    priority: 'critical',
    type: 'Dự án đầu tư',
    status: 'reviewing',
    amount: 2500000000,
    documents: [
      { name: 'du-an-dau-tu.pdf', size: '5.8 MB' },
      { name: 'ban-ve-thiet-ke.pdf', size: '12.4 MB' },
      { name: 'du-toan-tong-hop.xlsx', size: '2.2 MB' },
    ],
  },
  {
    id: 7,
    caseNumber: 'MT-2024-019',
    title: 'Báo cáo đánh giá tác động môi trường - Dự án XD',
    fieldCode: 'MOI_TRUONG',
    fieldName: 'Môi trường',
    department: 'TN&MT',
    submittedBy: 'Trần Thị Lan',
    submittedDate: '2024-01-15',
    dueDate: '2024-01-27',
    priority: 'high',
    type: 'Đánh giá môi trường',
    status: 'pending',
    documents: [
      { name: 'bao-cao-dtmt.pdf', size: '8.5 MB' },
      { name: 'ket-qua-phan-tich.xlsx', size: '1.5 MB' },
    ],
  },
  {
    id: 8,
    caseNumber: 'YT-2024-042',
    title: 'Kế hoạch triển khai chiến dịch tiêm chủng mở rộng',
    fieldCode: 'Y_TE_GD',
    fieldName: 'Y tế',
    department: 'Trạm y tế xã',
    submittedBy: 'Bác sĩ Phạm Minh',
    submittedDate: '2024-01-10',
    dueDate: '2024-01-23',
    priority: 'medium',
    type: 'Kế hoạch y tế',
    status: 'approved',
    amount: 85000000,
    documents: [
      { name: 'ke-hoach-tiem-chung.pdf', size: '1.9 MB' },
      { name: 'danh-sach-tre-em.xlsx', size: '620 KB' },
    ],
  },
];

// ================================================================
// BÁO CÁO TỔNG HỢP
// ================================================================

export interface Report {
  id: number;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  fieldCode: string;
  fieldName: string;
  department: string;
  createdBy: string;
  createdDate: string;
  period: string;
  status: 'draft' | 'submitted' | 'approved' | 'published';
  summary: string;
  fileSize: string;
}

export const REPORTS: Report[] = [
  {
    id: 1,
    title: 'Báo cáo tổng hợp tình hình xã/phường tháng 1/2024',
    type: 'monthly',
    fieldCode: 'ALL',
    fieldName: 'Tổng hợp',
    department: 'Văn phòng UBND',
    createdBy: 'Lê Văn Tổng',
    createdDate: '2024-01-16',
    period: 'Tháng 1/2024',
    status: 'submitted',
    summary: 'Báo cáo tổng hợp về tình hình kinh tế, xã hội, an ninh, văn hóa của xã/phường trong tháng 1/2024',
    fileSize: '8.5 MB',
  },
  {
    id: 2,
    title: 'Báo cáo tài chính quý I/2024',
    type: 'quarterly',
    fieldCode: 'TAI_CHINH',
    fieldName: 'Tài chính',
    department: 'Tài chính - Kế toán',
    createdBy: 'Nguyễn Văn Tài',
    createdDate: '2024-01-15',
    period: 'Quý I/2024',
    status: 'submitted',
    summary: 'Báo cáo quyết toán thu chi ngân sách, tình hình thực hiện dự toán quý I',
    fileSize: '4.2 MB',
  },
  {
    id: 3,
    title: 'Báo cáo tình hình an ninh trật tự tuần 3 tháng 1',
    type: 'weekly',
    fieldCode: 'AN_NINH',
    fieldName: 'An ninh',
    department: 'Công an xã',
    createdBy: 'Thiếu tá Vũ Đức',
    createdDate: '2024-01-15',
    period: 'Tuần 3/01/2024',
    status: 'approved',
    summary: 'Tổng hợp tình hình ANTT, vi phạm ATGT, điểm nóng cần theo dõi',
    fileSize: '1.8 MB',
  },
  {
    id: 4,
    title: 'Báo cáo tiến độ các dự án xây dựng hạ tầng',
    type: 'monthly',
    fieldCode: 'XAY_DUNG',
    fieldName: 'Xây dựng',
    department: 'Xây dựng & Quy hoạch',
    createdBy: 'Lương Văn Đức',
    createdDate: '2024-01-14',
    period: 'Tháng 1/2024',
    status: 'approved',
    summary: 'Báo cáo tiến độ thực hiện 8 dự án hạ tầng đang triển khai',
    fileSize: '6.3 MB',
  },
  {
    id: 5,
    title: 'Báo cáo chất lượng môi trường tháng 1/2024',
    type: 'monthly',
    fieldCode: 'MOI_TRUONG',
    fieldName: 'Môi trường',
    department: 'TN&MT',
    createdBy: 'Trần Thị Lan',
    createdDate: '2024-01-13',
    period: 'Tháng 1/2024',
    status: 'published',
    summary: 'Đánh giá chất lượng không khí, nước, xử lý rác thải và các điểm ô nhiễm',
    fileSize: '3.7 MB',
  },
];

// ================================================================
// KPI THEO CÁN BỘ (CHI TI ẾT)
// ================================================================

export interface OfficerKPI {
  id: string;
  name: string;
  position: string;
  department: string;
  fieldCode: string;
  fieldName: string;
  avatar?: string;
  
  // KPI Chi tiêu
  targetCases: number; // Chỉ tiêu hồ sơ xử lý
  completedCases: number;
  pendingCases: number;
  overdueCases: number;
  
  // Chỉ số hiệu suất
  completionRate: number; // % hoàn thành
  onTimeRate: number; // % đúng hạn
  satisfactionRate: number; // % hài lòng từ công dân
  qualityScore: number; // Điểm chất lượng (0-100)
  
  // Xu hướng
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  
  // Dữ liệu theo tuần/tháng
  monthlyData: {
    month: string;
    completed: number;
    onTime: number;
    satisfaction: number;
  }[];
}

export const OFFICER_KPI_DATA: OfficerKPI[] = [
  {
    id: 'CB001',
    name: 'Nguyễn Văn An',
    position: 'Cảng viên Hộ tịch',
    department: 'Phòng Hành chính Tư pháp',
    fieldCode: 'TU_PHAP',
    fieldName: 'Hành chính Tư pháp',
    targetCases: 150,
    completedCases: 148,
    pendingCases: 2,
    overdueCases: 0,
    completionRate: 99,
    onTimeRate: 100,
    satisfactionRate: 96,
    qualityScore: 98,
    trend: 2.5,
    trendDirection: 'up',
    monthlyData: [
      { month: 'T11', completed: 48, onTime: 48, satisfaction: 94 },
      { month: 'T12', completed: 50, onTime: 50, satisfaction: 95 },
      { month: 'T1', completed: 50, onTime: 50, satisfaction: 96 },
    ],
  },
  {
    id: 'CB002',
    name: 'Trần Thị Bình',
    position: 'Cán bộ Chứng thực',
    department: 'Phòng Hành chính Tư pháp',
    fieldCode: 'TU_PHAP',
    fieldName: 'Hành chính Tư pháp',
    targetCases: 120,
    completedCases: 115,
    pendingCases: 5,
    overdueCases: 2,
    completionRate: 96,
    onTimeRate: 92,
    satisfactionRate: 89,
    qualityScore: 91,
    trend: 1.8,
    trendDirection: 'up',
    monthlyData: [
      { month: 'T11', completed: 38, onTime: 35, satisfaction: 88 },
      { month: 'T12', completed: 40, onTime: 38, satisfaction: 88 },
      { month: 'T1', completed: 37, onTime: 34, satisfaction: 89 },
    ],
  },
  {
    id: 'CB003',
    name: 'Lê Minh Phương',
    position: 'Cán bộ Hộ khẩu',
    department: 'Phòng Hành chính Tư pháp',
    fieldCode: 'TU_PHAP',
    fieldName: 'Hành chính Tư pháp',
    targetCases: 100,
    completedCases: 95,
    pendingCases: 5,
    overdueCases: 3,
    completionRate: 95,
    onTimeRate: 88,
    satisfactionRate: 85,
    qualityScore: 87,
    trend: -1.2,
    trendDirection: 'down',
    monthlyData: [
      { month: 'T11', completed: 32, onTime: 30, satisfaction: 86 },
      { month: 'T12', completed: 33, onTime: 29, satisfaction: 85 },
      { month: 'T1', completed: 30, onTime: 26, satisfaction: 85 },
    ],
  },
  {
    id: 'CB004',
    name: 'Phạm Hồng Anh',
    position: 'Cán bộ Y tế',
    department: 'Trạm y tế',
    fieldCode: 'Y_TE_GD',
    fieldName: 'Y tế - Giáo dục',
    targetCases: 200,
    completedCases: 185,
    pendingCases: 15,
    overdueCases: 5,
    completionRate: 93,
    onTimeRate: 90,
    satisfactionRate: 91,
    qualityScore: 92,
    trend: 3.5,
    trendDirection: 'up',
    monthlyData: [
      { month: 'T11', completed: 60, onTime: 54, satisfaction: 89 },
      { month: 'T12', completed: 63, onTime: 57, satisfaction: 90 },
      { month: 'T1', completed: 62, onTime: 56, satisfaction: 91 },
    ],
  },
  {
    id: 'CB005',
    name: 'Võ Thị Cẩm Tú',
    position: 'Giáo viên chủ nhiệm',
    department: 'Trường Tiểu học',
    fieldCode: 'Y_TE_GD',
    fieldName: 'Y tế - Giáo dục',
    targetCases: 150,
    completedCases: 142,
    pendingCases: 8,
    overdueCases: 1,
    completionRate: 95,
    onTimeRate: 93,
    satisfactionRate: 94,
    qualityScore: 94,
    trend: 2.1,
    trendDirection: 'up',
    monthlyData: [
      { month: 'T11', completed: 47, onTime: 44, satisfaction: 93 },
      { month: 'T12', completed: 48, onTime: 45, satisfaction: 93 },
      { month: 'T1', completed: 47, onTime: 44, satisfaction: 94 },
    ],
  },
  {
    id: 'CB006',
    name: 'Đặng Văn Dương',
    position: 'Cán bộ Kinh tế',
    department: 'Phòng Kinh tế',
    fieldCode: 'KINH_TE',
    fieldName: 'Kinh tế - Thương mại',
    targetCases: 120,
    completedCases: 108,
    pendingCases: 12,
    overdueCases: 8,
    completionRate: 90,
    onTimeRate: 82,
    satisfactionRate: 83,
    qualityScore: 84,
    trend: -2.3,
    trendDirection: 'down',
    monthlyData: [
      { month: 'T11', completed: 38, onTime: 32, satisfaction: 85 },
      { month: 'T12', completed: 36, onTime: 30, satisfaction: 84 },
      { month: 'T1', completed: 34, onTime: 28, satisfaction: 83 },
    ],
  },
  {
    id: 'CB007',
    name: 'Bùi Xuân Hùng',
    position: 'Trạm trưởng CSGT',
    department: 'Công an',
    fieldCode: 'AN_NINH',
    fieldName: 'Quốc phòng - An ninh',
    targetCases: 180,
    completedCases: 168,
    pendingCases: 12,
    overdueCases: 6,
    completionRate: 93,
    onTimeRate: 89,
    satisfactionRate: 88,
    qualityScore: 89,
    trend: 0.5,
    trendDirection: 'stable',
    monthlyData: [
      { month: 'T11', completed: 56, onTime: 50, satisfaction: 88 },
      { month: 'T12', completed: 57, onTime: 51, satisfaction: 88 },
      { month: 'T1', completed: 55, onTime: 49, satisfaction: 88 },
    ],
  },
  {
    id: 'CB008',
    name: 'Lương Văn Đức',
    position: 'Giám đốc Quản lý xây dựng',
    department: 'Phòng Xây dựng',
    fieldCode: 'XAY_DUNG',
    fieldName: 'Xây dựng - Hạ tầng',
    targetCases: 130,
    completedCases: 122,
    pendingCases: 8,
    overdueCases: 2,
    completionRate: 94,
    onTimeRate: 91,
    satisfactionRate: 90,
    qualityScore: 91,
    trend: 1.9,
    trendDirection: 'up',
    monthlyData: [
      { month: 'T11', completed: 40, onTime: 36, satisfaction: 89 },
      { month: 'T12', completed: 41, onTime: 38, satisfaction: 89 },
      { month: 'T1', completed: 41, onTime: 37, satisfaction: 90 },
    ],
  },
  {
    id: 'CB009',
    name: 'Trần Thị Lan',
    position: 'Cán bộ Môi trường',
    department: 'Phòng TN&MT',
    fieldCode: 'MOI_TRUONG',
    fieldName: 'Quản lý Môi trường',
    targetCases: 140,
    completedCases: 128,
    pendingCases: 12,
    overdueCases: 4,
    completionRate: 91,
    onTimeRate: 87,
    satisfactionRate: 86,
    qualityScore: 87,
    trend: 1.2,
    trendDirection: 'up',
    monthlyData: [
      { month: 'T11', completed: 42, onTime: 37, satisfaction: 85 },
      { month: 'T12', completed: 43, onTime: 38, satisfaction: 86 },
      { month: 'T1', completed: 43, onTime: 38, satisfaction: 86 },
    ],
  },
  {
    id: 'CB010',
    name: 'Ngô Văn Hữu',
    position: 'Cán bộ Tài chính',
    department: 'Kế toán',
    fieldCode: 'TAI_CHINH',
    fieldName: 'Quản lý Tài chính',
    targetCases: 160,
    completedCases: 152,
    pendingCases: 8,
    overdueCases: 1,
    completionRate: 95,
    onTimeRate: 94,
    satisfactionRate: 92,
    qualityScore: 93,
    trend: 2.8,
    trendDirection: 'up',
    monthlyData: [
      { month: 'T11', completed: 50, onTime: 47, satisfaction: 91 },
      { month: 'T12', completed: 51, onTime: 48, satisfaction: 91 },
      { month: 'T1', completed: 51, onTime: 49, satisfaction: 92 },
    ],
  },
];

// ================================================================
// KPI THEO LĨNH VỰC (CHI TI ẾT)
// ================================================================

export interface FieldKPI {
  code: string;
  name: string;
  icon: any;
  color: string;
  
  // Chỉ tiêu tổng thể
  targetCases: number;
  completedCases: number;
  pendingCases: number;
  overdueCases: number;
  
  // Chỉ số hiệu suất
  completionRate: number; // %
  onTimeRate: number; // %
  satisfactionRate: number; // %
  budgetExecution: number; // % giải ngân
  
  // So sánh với kỳ trước
  trend: number; // %
  trendDirection: 'up' | 'down' | 'stable';
  
  // Cán bộ bộ phận
  officers: {
    name: string;
    position: string;
    completionRate: number;
    satisfactionRate: number;
    status: 'excellent' | 'good' | 'normal' | 'needs-improvement';
  }[];
  
  // Dữ liệu so sánh
  monthlyComparison: {
    month: string;
    completed: number;
    target: number;
    onTime: number;
  }[];
}

export const FIELD_KPI_DETAILED: FieldKPI[] = [
  {
    code: 'TU_PHAP',
    name: 'Hành chính Tư pháp',
    icon: FileText,
    color: '#3b82f6',
    targetCases: 2500,
    completedCases: 2180,
    pendingCases: 220,
    overdueCases: 50,
    completionRate: 89,
    onTimeRate: 85,
    satisfactionRate: 92,
    budgetExecution: 78,
    trend: 5.2,
    trendDirection: 'up',
    officers: [
      { name: 'Nguyễn Văn An', position: 'Cảng viên Hộ tịch', completionRate: 99, satisfactionRate: 96, status: 'excellent' },
      { name: 'Trần Thị Bình', position: 'Cán bộ Chứng thực', completionRate: 96, satisfactionRate: 89, status: 'good' },
      { name: 'Lê Minh Phương', position: 'Cán bộ Hộ khẩu', completionRate: 95, satisfactionRate: 85, status: 'normal' },
    ],
    monthlyComparison: [
      { month: 'T11', completed: 705, target: 750, onTime: 640 },
      { month: 'T12', completed: 740, target: 760, onTime: 680 },
      { month: 'T1', completed: 735, target: 770, onTime: 670 },
    ],
  },
  {
    code: 'Y_TE_GD',
    name: 'Y tế - Giáo dục',
    icon: Stethoscope,
    color: '#ef4444',
    targetCases: 2200,
    completedCases: 2050,
    pendingCases: 120,
    overdueCases: 30,
    completionRate: 93,
    onTimeRate: 91,
    satisfactionRate: 94,
    budgetExecution: 85,
    trend: 3.8,
    trendDirection: 'up',
    officers: [
      { name: 'Phạm Hồng Anh', position: 'Cán bộ Y tế', completionRate: 93, satisfactionRate: 91, status: 'good' },
      { name: 'Võ Thị Cẩm Tú', position: 'Giáo viên chủ nhiệm', completionRate: 95, satisfactionRate: 94, status: 'excellent' },
    ],
    monthlyComparison: [
      { month: 'T11', completed: 680, target: 700, onTime: 640 },
      { month: 'T12', completed: 700, target: 720, onTime: 670 },
      { month: 'T1', completed: 670, target: 740, onTime: 640 },
    ],
  },
  {
    code: 'KINH_TE',
    name: 'Kinh tế - Thương mại',
    icon: Store,
    color: '#10b981',
    targetCases: 1800,
    completedCases: 1620,
    pendingCases: 150,
    overdueCases: 30,
    completionRate: 90,
    onTimeRate: 86,
    satisfactionRate: 88,
    budgetExecution: 72,
    trend: 2.1,
    trendDirection: 'up',
    officers: [
      { name: 'Đặng Văn Dương', position: 'Cán bộ Kinh tế', completionRate: 90, satisfactionRate: 83, status: 'normal' },
    ],
    monthlyComparison: [
      { month: 'T11', completed: 540, target: 580, onTime: 480 },
      { month: 'T12', completed: 560, target: 600, onTime: 500 },
      { month: 'T1', completed: 520, target: 620, onTime: 460 },
    ],
  },
  {
    code: 'AN_NINH',
    name: 'Quốc phòng - An ninh',
    icon: ShieldCheck,
    color: '#f59e0b',
    targetCases: 1900,
    completedCases: 1750,
    pendingCases: 130,
    overdueCases: 20,
    completionRate: 92,
    onTimeRate: 88,
    satisfactionRate: 90,
    budgetExecution: 80,
    trend: 1.5,
    trendDirection: 'up',
    officers: [
      { name: 'Bùi Xuân Hùng', position: 'Trạm trưởng CSGT', completionRate: 93, satisfactionRate: 88, status: 'good' },
    ],
    monthlyComparison: [
      { month: 'T11', completed: 580, target: 620, onTime: 520 },
      { month: 'T12', completed: 590, target: 630, onTime: 540 },
      { month: 'T1', completed: 580, target: 650, onTime: 520 },
    ],
  },
  {
    code: 'XAY_DUNG',
    name: 'Xây dựng - Hạ tầng',
    icon: Hammer,
    color: '#8b5cf6',
    targetCases: 1650,
    completedCases: 1540,
    pendingCases: 100,
    overdueCases: 10,
    completionRate: 94,
    onTimeRate: 91,
    satisfactionRate: 90,
    budgetExecution: 88,
    trend: 1.9,
    trendDirection: 'up',
    officers: [
      { name: 'Lương Văn Đức', position: 'Giám đốc Quản lý xây dựng', completionRate: 94, satisfactionRate: 90, status: 'good' },
    ],
    monthlyComparison: [
      { month: 'T11', completed: 510, target: 540, onTime: 480 },
      { month: 'T12', completed: 520, target: 550, onTime: 490 },
      { month: 'T1', completed: 510, target: 560, onTime: 490 },
    ],
  },
  {
    code: 'MOI_TRUONG',
    name: 'Quản lý Môi trường',
    icon: TreePine,
    color: '#06b6d4',
    targetCases: 1700,
    completedCases: 1550,
    pendingCases: 130,
    overdueCases: 20,
    completionRate: 91,
    onTimeRate: 87,
    satisfactionRate: 86,
    budgetExecution: 76,
    trend: 1.2,
    trendDirection: 'up',
    officers: [
      { name: 'Trần Thị Lan', position: 'Cán bộ Môi trường', completionRate: 91, satisfactionRate: 86, status: 'good' },
    ],
    monthlyComparison: [
      { month: 'T11', completed: 510, target: 550, onTime: 450 },
      { month: 'T12', completed: 520, target: 570, onTime: 470 },
      { month: 'T1', completed: 520, target: 580, onTime: 470 },
    ],
  },
  {
    code: 'TAI_CHINH',
    name: 'Quản lý Tài chính',
    icon: DollarSign,
    color: '#ec4899',
    targetCases: 1600,
    completedCases: 1520,
    pendingCases: 70,
    overdueCases: 10,
    completionRate: 95,
    onTimeRate: 94,
    satisfactionRate: 92,
    budgetExecution: 92,
    trend: 2.8,
    trendDirection: 'up',
    officers: [
      { name: 'Ngô Văn Hữu', position: 'Cán bộ Tài chính', completionRate: 95, satisfactionRate: 92, status: 'excellent' },
    ],
    monthlyComparison: [
      { month: 'T11', completed: 505, target: 520, onTime: 485 },
      { month: 'T12', completed: 510, target: 530, onTime: 495 },
      { month: 'T1', completed: 505, target: 550, onTime: 495 },
    ],
  },
  {
    code: 'DIA_CHINH',
    name: 'Địa chính',
    icon: MapPin,
    color: '#6366f1',
    targetCases: 1750,
    completedCases: 1570,
    pendingCases: 150,
    overdueCases: 30,
    completionRate: 90,
    onTimeRate: 85,
    satisfactionRate: 87,
    budgetExecution: 74,
    trend: 1.5,
    trendDirection: 'up',
    officers: [],
    monthlyComparison: [
      { month: 'T11', completed: 520, target: 570, onTime: 450 },
      { month: 'T12', completed: 530, target: 590, onTime: 470 },
      { month: 'T1', completed: 520, target: 600, onTime: 460 },
    ],
  },
];

