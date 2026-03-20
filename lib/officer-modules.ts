// Cấu trúc Module hệ thống cho Cán bộ chuyên môn
// Dựa trên sơ đồ đặc tả chức năng

import {
  FileText,
  Users,
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
  Activity,
  CheckSquare,
  ClipboardList,
  UserCheck,
  Calendar,
  BarChart3,
  FileCheck,
  Map,
  Hammer,
  Heart,
  Briefcase,
  DollarSign,
  Receipt,
  TrendingUp,
  FileSearch,
  Truck,
  AlertTriangle,
  Mountain,
  Award,
  Shield,
  Leaf,
  Droplet,
  Wind,
  Trash2,
} from 'lucide-react';

export interface ModuleFunction {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: any;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  functions: ModuleFunction[];
}

export const OFFICER_MODULES: Module[] = [
  // 1. Hành chính tư pháp
  {
    id: 'hanh-chinh-tu-phap',
    name: 'Hành chính tư pháp',
    description: 'Quản lý hộ tịch, giấy tờ, văn bản',
    icon: FileText,
    color: 'from-blue-500 to-cyan-500',
    category: 'administration',
    functions: [
      {
        id: 'quan-ly-ho-tich',
        name: 'Quản lý Hộ tịch',
        description: 'Quản lý khai sinh, kết hôn, ly hôn, tử vong',
        path: '/dashboard/ho-tich',
        icon: Users,
      },
      {
        id: 'chung-thuc-xac-nhan',
        name: 'Chứng thực, xác nhận giấy tờ',
        description: 'Chứng thực bản sao, chữ ký, hợp đồng',
        path: '/dashboard/chung-thuc',
        icon: FileCheck,
      },
      {
        id: 'quan-ly-ho-khau',
        name: 'Quản lý hộ khẩu, cư trú',
        description: 'Đăng ký hộ khẩu, tạm trú, tạm vắng',
        path: '/dashboard/ho-khau',
        icon: Home,
      },
      {
        id: 'quan-ly-van-ban',
        name: 'Quản lý văn bản đến/đi',
        description: 'Tiếp nhận, phân loại, theo dõi văn bản',
        path: '/dashboard/van-ban',
        icon: ClipboardList,
      },
      {
        id: 'quan-ly-ho-so-tthc',
        name: 'Quản lý hồ sơ thủ tục hành chính',
        description: 'Tiếp nhận, xử lý hồ sơ TTHC',
        path: '/dashboard/ho-so-tthc',
        icon: FileText,
      },
      {
        id: 'theo-doi-giai-quyet',
        name: 'Theo dõi giải quyết TTHC (một cửa)',
        description: 'Giám sát tiến độ xử lý hồ sơ',
        path: '/dashboard/mot-cua',
        icon: Activity,
      },
      {
        id: 'thong-ke-bao-cao',
        name: 'Thống kê, báo cáo hành chính',
        description: 'Báo cáo định kỳ, thống kê số liệu',
        path: '/dashboard/bao-cao-hc',
        icon: BarChart3,
      },
    ],
  },

  // 2. Y tế - Giáo dục
  {
    id: 'y-te-giao-duc',
    name: 'Y tế - Giáo dục',
    description: 'Quản lý y tế, giáo dục địa phương',
    icon: Stethoscope,
    color: 'from-red-500 to-pink-500',
    category: 'social',
    functions: [
      // Y tế
      {
        id: 'quan-ly-tram-y-te',
        name: 'Quản lý trạm y tế',
        description: 'Quản lý cơ sở vật chất, nhân lực',
        path: '/dashboard/tram-y-te',
        icon: Building2,
      },
      {
        id: 'theo-doi-dich-benh',
        name: 'Theo dõi dịch bệnh',
        description: 'Giám sát, cảnh báo dịch bệnh',
        path: '/dashboard/dich-benh',
        icon: AlertTriangle,
      },
      {
        id: 'theo-doi-tiem-chung',
        name: 'Theo dõi tiêm chủng',
        description: 'Lịch tiêm, quản lý đối tượng',
        path: '/dashboard/tiem-chung',
        icon: Activity,
      },
      {
        id: 'kham-chua-benh',
        name: 'Quản lý Khám chữa bệnh ban đầu',
        description: 'Khám bệnh, cấp thuốc, chăm sóc',
        path: '/dashboard/kham-benh',
        icon: Stethoscope,
      },
      // Giáo dục
      {
        id: 'quan-ly-truong-mam-non',
        name: 'Quản lý trường mầm non/tiểu học',
        description: 'Quản lý cơ sở giáo dục',
        path: '/dashboard/giao-duc',
        icon: GraduationCap,
      },
      {
        id: 'theo-doi-si-so',
        name: 'Theo dõi sĩ số học sinh',
        description: 'Thống kê học sinh, tỷ lệ đến lớp',
        path: '/dashboard/si-so-hoc-sinh',
        icon: Users,
      },
      {
        id: 'co-so-vat-chat',
        name: 'Cơ sở vật chất trường học',
        description: 'Quản lý phòng học, thiết bị',
        path: '/dashboard/co-so-giao-duc',
        icon: Building2,
      },
    ],
  },

  // 3. Kinh tế - Thương mại - Hộ kinh doanh
  {
    id: 'kinh-te-thuong-mai',
    name: 'Kinh tế - Thương mại',
    description: 'Quản lý hộ kinh doanh, chợ, phí',
    icon: Store,
    color: 'from-green-500 to-emerald-500',
    category: 'economy',
    functions: [
      {
        id: 'quan-ly-ho-kinh-doanh',
        name: 'Quản lý hộ kinh doanh',
        description: 'Đăng ký, quản lý hộ kinh doanh',
        path: '/dashboard/ho-kinh-doanh',
        icon: Store,
      },
      {
        id: 'quan-ly-cho-diem',
        name: 'Quản lý chợ, điểm kinh doanh',
        description: 'Giám sát hoạt động chợ, quầy hàng',
        path: '/dashboard/cho-kinh-doanh',
        icon: Building2,
      },
      {
        id: 'theo-doi-thu-phi',
        name: 'Theo dõi thu phí, lệ phí địa phương',
        description: 'Quản lý thu phí chợ, vệ sinh',
        path: '/dashboard/thu-phi',
        icon: Coins,
      },
      {
        id: 'ho-tro-doanh-nghiep',
        name: 'Hỗ trợ doanh nghiệp nhỏ',
        description: 'Tư vấn, hỗ trợ DNNVV',
        path: '/dashboard/ho-tro-doanh-nghiep',
        icon: Briefcase,
      },
      {
        id: 'thong-ke-hoat-dong',
        name: 'Thống kê hoạt động kinh tế',
        description: 'Báo cáo kinh tế định kỳ',
        path: '/dashboard/thong-ke-kinh-te',
        icon: BarChart3,
      },
    ],
  },

  // 4. Quốc phòng an ninh trật tự
  {
    id: 'quoc-phong-an-ninh',
    name: 'Quốc phòng - An ninh',
    description: 'Quản lý an ninh, trật tự, vi phạm',
    icon: ShieldCheck,
    color: 'from-red-600 to-orange-600',
    category: 'security',
    functions: [
      {
        id: 'quan-ly-tam-tru',
        name: 'Quản lý tạm trú tạm vắng',
        description: 'Đăng ký tạm trú, tạm vắng',
        path: '/dashboard/tam-tru-vang',
        icon: Users,
      },
      {
        id: 'theo-doi-vi-pham',
        name: 'Theo dõi vi phạm hành chính',
        description: 'Ghi nhận, xử lý vi phạm',
        path: '/dashboard/vi-pham',
        icon: AlertTriangle,
      },
      {
        id: 'quan-ly-an-ninh',
        name: 'Quản lý an ninh trật tự khu dân cư',
        description: 'Giám sát, tuần tra khu vực',
        path: '/dashboard/an-ninh-trat-tu',
        icon: ShieldCheck,
      },
      {
        id: 'tiep-nhan-phan-anh',
        name: 'Tiếp nhận phản ánh người dân',
        description: 'Tiếp nhận, xử lý phản ánh',
        path: '/dashboard/phan-anh',
        icon: ClipboardList,
      },
      {
        id: 'ban-do-diem-nong',
        name: 'Bản đồ điểm nóng ANTT',
        description: 'Hiển thị điểm nóng trên bản đồ',
        path: '/dashboard/diem-nong-antt',
        icon: Map,
      },
    ],
  },

  // 5. Xây dựng - Hạ tầng - Đô thị
  {
    id: 'xay-dung-ha-tang',
    name: 'Xây dựng - Hạ tầng',
    description: 'Quản lý xây dựng, hạ tầng, nhà ở',
    icon: Hammer,
    color: 'from-orange-500 to-amber-500',
    category: 'infrastructure',
    functions: [
      {
        id: 'quan-ly-cap-phep',
        name: 'Quản lý cấp phép xây dựng',
        description: 'Tiếp nhận, xử lý hồ sơ xây dựng',
        path: '/dashboard/cap-phep-xay-dung',
        icon: FileCheck,
      },
      {
        id: 'theo-doi-trat-tu',
        name: 'Theo dõi trật tự xây dựng',
        description: 'Giám sát xây dựng theo quy hoạch',
        path: '/dashboard/trat-tu-xay-dung',
        icon: CheckSquare,
      },
      {
        id: 'quan-ly-ha-tang',
        name: 'Quản lý hạ tầng',
        description: 'Quản lý đường, điện, nước',
        path: '/dashboard/ha-tang',
        icon: Activity,
      },
      {
        id: 'phat-hien-xay-dung-trai-phep',
        name: 'Phát hiện xây dựng trái phép',
        description: 'Phát hiện, xử lý xây dựng sai',
        path: '/dashboard/xay-dung-trai-phep',
        icon: AlertTriangle,
      },
      {
        id: 'quan-ly-nha-o',
        name: 'Quản lý nhà ở, công trình công cộng',
        description: 'Thống kê nhà ở, công trình',
        path: '/dashboard/nha-o-cong-trinh',
        icon: Building2,
      },
    ],
  },

  // 6. Quản lý Lao động - TBXH
  {
    id: 'lao-dong-tbxh',
    name: 'Lao động - TBXH',
    description: 'Quản lý hộ nghèo, đối tượng chính sách',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    category: 'social',
    functions: [
      {
        id: 'quan-ly-ho-ngheo',
        name: 'Quản lý hộ nghèo, cận nghèo',
        description: 'Rà soát, quản lý hộ nghèo',
        path: '/dashboard/ho-ngheo',
        icon: Users,
      },
      {
        id: 'quan-ly-doi-tuong',
        name: 'Quản lý đối tượng bảo trợ xã hội',
        description: 'Người khuyết tật, người cao tuổi',
        path: '/dashboard/bao-tro-xa-hoi',
        icon: Heart,
      },
      {
        id: 'quan-ly-nguoi-co-cong',
        name: 'Quản lý người có công',
        description: 'Quản lý, chi trả trợ cấp',
        path: '/dashboard/nguoi-co-cong',
        icon: Award,
      },
      {
        id: 'theo-doi-that-nghiep',
        name: 'Theo dõi thất nghiệp, việc làm',
        description: 'Quản lý lao động, việc làm',
        path: '/dashboard/viec-lam',
        icon: Briefcase,
      },
    ],
  },

  // 7. Quản lý tài chính
  {
    id: 'tai-chinh',
    name: 'Quản lý tài chính',
    description: 'Quản lý ngân sách, thu chi',
    icon: DollarSign,
    color: 'from-purple-500 to-indigo-500',
    category: 'finance',
    functions: [
      {
        id: 'theo-doi-thu-ngan-sach',
        name: 'Theo dõi thu ngân sách',
        description: 'Quản lý các khoản thu',
        path: '/dashboard/thu-ngan-sach',
        icon: TrendingUp,
      },
      {
        id: 'theo-doi-chi-ngan-sach',
        name: 'Theo dõi chi ngân sách',
        description: 'Quản lý các khoản chi',
        path: '/dashboard/chi-ngan-sach',
        icon: Receipt,
      },
      {
        id: 'so-sanh-thu-chi',
        name: 'So sánh thu chi với dự toán',
        description: 'Phân tích thu chi',
        path: '/dashboard/so-sanh-du-toan',
        icon: BarChart3,
      },
      {
        id: 'canh-bao-vuot-du-toan',
        name: 'Cảnh báo vượt dự toán',
        description: 'Thông báo khi vượt dự toán',
        path: '/dashboard/canh-bao-du-toan',
        icon: AlertTriangle,
      },
      {
        id: 'giam-sat-tien-do',
        name: 'Giám sát tiến độ giải ngân',
        description: 'Theo dõi tiến độ giải ngân',
        path: '/dashboard/giai-ngan',
        icon: Activity,
      },
      {
        id: 'phan-tich-xu-huong',
        name: 'Phân tích xu hướng tài chính (AI)',
        description: 'Dự báo xu hướng bằng AI',
        path: '/dashboard/xu-huong-tai-chinh',
        icon: TrendingUp,
      },
      {
        id: 'lap-xuat-bao-cao',
        name: 'Lập và xuất báo cáo tài chính',
        description: 'Báo cáo tài chính định kỳ',
        path: '/dashboard/bao-cao-tai-chinh',
        icon: FileText,
      },
    ],
  },

  // 8. Địa chính
  {
    id: 'dia-chinh',
    name: 'Địa chính',
    description: 'Quản lý đất đai, sổ đỏ, tranh chấp',
    icon: MapPin,
    color: 'from-teal-500 to-cyan-500',
    category: 'land',
    functions: [
      {
        id: 'tra-cuu-ho-so-dat',
        name: 'Tra cứu hồ sơ địa',
        description: 'Tra cứu thông tin đất đai',
        path: '/dashboard/tra-cuu-dat',
        icon: FileSearch,
      },
      {
        id: 'theo-doi-bien-dong',
        name: 'Theo dõi biến động sử dụng đất',
        description: 'Quản lý chuyển đổi mục đích',
        path: '/dashboard/bien-dong-dat',
        icon: Activity,
      },
      {
        id: 'quan-ly-tinh-trang',
        name: 'Quản lý tình trạng cấp sổ đỏ',
        description: 'Theo dõi tiến độ cấp sổ',
        path: '/dashboard/cap-so-do',
        icon: FileCheck,
      },
      {
        id: 'cap-nhat-ho-so',
        name: 'Cập nhật hồ sơ thẩm định thực địa',
        description: 'Cập nhật thông tin thực tế',
        path: '/dashboard/tham-dinh-thuc-dia',
        icon: Map,
      },
      {
        id: 'phat-hien-khu-vuc',
        name: 'Phát hiện khu vực tranh chấp',
        description: 'Quản lý khu vực tranh chấp',
        path: '/dashboard/tranh-chap',
        icon: AlertTriangle,
      },
      {
        id: 'danh-gia-rui-ro',
        name: 'Đánh giá rủi ro quy hoạch (AI)',
        description: 'Phân tích rủi ro bằng AI',
        path: '/dashboard/rui-ro-quy-hoach',
        icon: TrendingUp,
      },
      {
        id: 'thong-ke-ho-so-ton-dong',
        name: 'Thống kê hồ sơ tồn động',
        description: 'Báo cáo hồ sơ tồn đọng',
        path: '/dashboard/ho-so-ton-dong',
        icon: BarChart3,
      },
      {
        id: 'xuat-bao-cao-dat-dai',
        name: 'Xuất báo cáo đất đai',
        description: 'Báo cáo đất đai định kỳ',
        path: '/dashboard/bao-cao-dat-dai',
        icon: FileText,
      },
    ],
  },

  // 9. Quản lý môi trường
  {
    id: 'moi-truong',
    name: 'Quản lý môi trường',
    description: 'Giám sát môi trường, rác thải',
    icon: TreePine,
    color: 'from-green-600 to-lime-600',
    category: 'environment',
    functions: [
      {
        id: 'giam-sat-chat-luong',
        name: 'Giám sát chất lượng môi trường',
        description: 'Theo dõi không khí, nước',
        path: '/dashboard/chat-luong-moi-truong',
        icon: Activity,
      },
      {
        id: 'quan-ly-rac-thai',
        name: 'Quản lý rác thải',
        description: 'Thu gom, xử lý rác thải',
        path: '/dashboard/rac-thai',
        icon: Truck,
      },
      {
        id: 'bao-cao-o-nhiem',
        name: 'Báo cáo về ô nhiễm',
        description: 'Báo cáo tình trạng ô nhiễm',
        path: '/dashboard/bao-cao-o-nhiem',
        icon: AlertTriangle,
      },
      {
        id: 'thong-ke-moi-truong',
        name: 'Thống kê',
        description: 'Thống kê, báo cáo môi trường',
        path: '/dashboard/thong-ke-moi-truong',
        icon: BarChart3,
      },
    ],
  },

  // 10. Văn hóa - Du lịch
  {
    id: 'van-hoa-du-lich',
    name: 'Văn hóa - Du lịch',
    description: 'Quản lý di tích, làng nghề, lễ hội',
    icon: Landmark,
    color: 'from-amber-600 to-yellow-600',
    category: 'culture',
    functions: [
      {
        id: 'quan-ly-di-tich',
        name: 'Quản lý di tích sở hóa',
        description: 'Bảo tồn, quản lý di tích',
        path: '/dashboard/di-tich',
        icon: Landmark,
      },
      {
        id: 'quan-ly-ho-so-di-tich',
        name: 'Quản lý Hồ sơ Di tích',
        description: 'Lưu trữ hồ sơ di tích',
        path: '/dashboard/ho-so-di-tich',
        icon: FileText,
      },
      {
        id: 'quan-ly-ho-kinh-doanh-du-lich',
        name: 'Quản lý Hộ kinh doanh Du lịch',
        description: 'Quản lý cơ sở du lịch',
        path: '/dashboard/kinh-doanh-du-lich',
        icon: Store,
      },
      {
        id: 'quan-ly-lang-nghe',
        name: 'Quản lý Làng nghề & Sản phẩm',
        description: 'Quản lý làng nghề truyền thống',
        path: '/dashboard/lang-nghe',
        icon: Mountain,
      },
      {
        id: 'quan-ly-le-hoi',
        name: 'Quản lý Lễ hội & Sự kiện',
        description: 'Tổ chức, quản lý lễ hội',
        path: '/dashboard/le-hoi',
        icon: Calendar,
      },
      {
        id: 'nhiem-vu-bao-cao',
        name: 'Nhiệm vụ & Báo cáo',
        description: 'Báo cáo hoạt động văn hóa',
        path: '/dashboard/bao-cao-van-hoa',
        icon: FileText,
      },
    ],
  },
];

// Helper functions
export const getModuleById = (id: string): Module | undefined => {
  return OFFICER_MODULES.find((module) => module.id === id);
};

export const getModulesByCategory = (category: string): Module[] => {
  return OFFICER_MODULES.filter((module) => module.category === category);
};

export const getFunctionById = (functionId: string): ModuleFunction | undefined => {
  for (const module of OFFICER_MODULES) {
    const func = module.functions.find((f) => f.id === functionId);
    if (func) return func;
  }
  return undefined;
};

export const getAllFunctions = (): ModuleFunction[] => {
  return OFFICER_MODULES.flatMap((module) => module.functions);
};

export const CATEGORIES = [
  { id: 'administration', name: 'Hành chính', color: 'blue' },
  { id: 'social', name: 'Xã hội', color: 'red' },
  { id: 'economy', name: 'Kinh tế', color: 'green' },
  { id: 'security', name: 'An ninh', color: 'orange' },
  { id: 'infrastructure', name: 'Hạ tầng', color: 'amber' },
  { id: 'finance', name: 'Tài chính', color: 'purple' },
  { id: 'land', name: 'Địa chính', color: 'teal' },
  { id: 'environment', name: 'Môi trường', color: 'lime' },
  { id: 'culture', name: 'Văn hóa', color: 'yellow' },
];
