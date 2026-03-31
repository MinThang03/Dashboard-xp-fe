'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import {
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Plus,
  Eye,
  Download,
  Search,
  Send,
  AlertCircle,
  Info,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Smile,
  Meh,
  Frown,
  Heart,
  ThumbsUp,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { hoSoTthcApi, phanAnhApi } from '@/lib/api';

type SubmissionStatus = 'pending' | 'in-progress' | 'completed' | 'rejected';

type Submission = {
  id: string;
  title: string;
  submitDate: string;
  status: SubmissionStatus;
  completedDate?: string;
  expectedDate?: string;
  submittedBy?: string;
  rating?: number;
  progress?: number;
  trackingSteps: Array<{ step: string; date: string; completed: boolean }>;
};

type ServiceItem = {
  id: number;
  name: string;
  processing: string;
  fee: string;
  department: string;
  icon: any;
  color: string;
  popular: boolean;
};

const FALLBACK_SUBMISSIONS: Submission[] = [
  {
    id: 'HS-2024-001',
    title: 'Cấp giấy chứng thực',
    submitDate: '2024-01-15',
    status: 'completed',
    completedDate: '2024-01-22',
    rating: 5,
    trackingSteps: [
      { step: 'Nộp hồ sơ', date: '2024-01-15', completed: true },
      { step: 'Tiếp nhận', date: '2024-01-16', completed: true },
      { step: 'Xử lý', date: '2024-01-20', completed: true },
      { step: 'Hoàn thành', date: '2024-01-22', completed: true },
    ],
  },
  {
    id: 'HS-2024-002',
    title: 'Đăng ký biến động dân số',
    submitDate: '2024-01-16',
    status: 'in-progress',
    progress: 70,
    expectedDate: '2024-01-28',
    trackingSteps: [
      { step: 'Nộp hồ sơ', date: '2024-01-16', completed: true },
      { step: 'Tiếp nhận', date: '2024-01-17', completed: true },
      { step: 'Xử lý', date: '-', completed: false },
      { step: 'Hoàn thành', date: '-', completed: false },
    ],
  },
  {
    id: 'HS-2024-003',
    title: 'Cấp phép xây dựng',
    submitDate: '2024-01-10',
    status: 'pending',
    progress: 20,
    expectedDate: '2024-01-30',
    trackingSteps: [
      { step: 'Nộp hồ sơ', date: '2024-01-10', completed: true },
      { step: 'Tiếp nhận', date: '-', completed: false },
      { step: 'Xử lý', date: '-', completed: false },
      { step: 'Hoàn thành', date: '-', completed: false },
    ],
  },
];

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: 1,
    name: 'Cấp giấy chứng thực',
    processing: '3-5 ngày',
    fee: 'Miễn phí',
    department: 'Tư pháp - Hộ tịch',
    icon: FileText,
    color: 'from-primary to-primary',
    popular: true,
  },
  {
    id: 2,
    name: 'Đăng ký biến động dân số',
    processing: '2-3 ngày',
    fee: 'Miễn phí',
    department: 'Tư pháp - Hộ tịch',
    icon: Building2,
    color: 'from-status-success to-status-success',
    popular: true,
  },
  {
    id: 3,
    name: 'Cấp phép xây dựng',
    processing: '15 ngày',
    fee: '500,000 đ',
    department: 'Địa chính - Xây dựng',
    icon: Building2,
    color: 'from-status-warning to-status-warning',
    popular: false,
  },
  {
    id: 4,
    name: 'Bổ sung thửa đất',
    processing: '7-10 ngày',
    fee: '200,000 đ',
    department: 'Địa chính - Xây dựng',
    icon: MapPin,
    color: 'from-accent to-accent',
    popular: false,
  },
];

const STATUS_PRIORITY: Record<SubmissionStatus, number> = {
  completed: 3,
  'in-progress': 2,
  pending: 1,
  rejected: 0,
};

const SERVICE_COLORS = [
  'from-primary to-primary',
  'from-status-success to-status-success',
  'from-status-warning to-status-warning',
  'from-accent to-accent',
];

function formatDate(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function normalizeAscii(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function mapStatus(status: string): SubmissionStatus {
  const normalized = normalizeAscii(status);
  if (normalized.includes('hoan thanh')) return 'completed';
  if (normalized.includes('tu choi')) return 'rejected';
  if (normalized.includes('dang xu ly') || normalized.includes('cho bo sung')) return 'in-progress';
  if (normalized.includes('da tiep nhan') || normalized.includes('moi')) return 'pending';
  return 'pending';
}

function estimateProgress(status: SubmissionStatus): number | undefined {
  if (status === 'pending') return 25;
  if (status === 'in-progress') return 65;
  if (status === 'rejected') return 100;
  return undefined;
}

function buildTrackingSteps(
  status: SubmissionStatus,
  submitDate: string,
  expectedDate: string,
  completedDate: string,
): Submission['trackingSteps'] {
  const isCompleted = status === 'completed';
  const isRejected = status === 'rejected';
  const hasProcessing = status === 'in-progress' || isCompleted || isRejected;
  const hasReceived = status !== 'pending';

  return [
    { step: 'Nộp hồ sơ', date: submitDate || '-', completed: Boolean(submitDate) },
    { step: 'Tiếp nhận', date: submitDate || '-', completed: hasReceived },
    { step: 'Xử lý', date: hasProcessing ? expectedDate || '-' : '-', completed: hasProcessing },
    {
      step: isRejected ? 'Từ chối' : 'Hoàn thành',
      date: isCompleted || isRejected ? completedDate || expectedDate || '-' : '-',
      completed: isCompleted || isRejected,
    },
  ];
}

const statusConfig = {
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-gray-100 text-gray-700',
    icon: Clock,
  },
  'in-progress': {
    label: 'Đang xử lý',
    color: 'bg-blue-100 text-blue-700',
    icon: AlertCircle,
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Từ chối',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
  },
};

export function CitizenDashboardPremium() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'submissions' | 'services' | 'feedback'>('submissions');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [searchService, setSearchService] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>(FALLBACK_SUBMISSIONS);
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK_SERVICES);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  useEffect(() => {
    setFeedbackPhone('');
    setFeedbackEmail(user?.email || '');
  }, [user?.email]);

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [hoSoRes, loaiRes] = await Promise.all([
          hoSoTthcApi.getList({ page: 1, limit: 200 }),
          hoSoTthcApi.getLoaiThuTuc(),
        ]);

        if (!active) return;

        const loaiList = loaiRes?.success && Array.isArray(loaiRes.data) ? loaiRes.data : [];
        const hoSoRows = hoSoRes?.success && Array.isArray(hoSoRes.data) ? hoSoRes.data : [];

        if (loaiList.length) {
          const mappedServices = loaiList.map((item: any, index: number) => ({
            id: item.MaLoaiThuTuc || index + 1,
            name: String(item.TenThuTuc || `Thu tuc #${index + 1}`),
            processing: item.ThoiGianXuLy ? `${item.ThoiGianXuLy} ngày` : 'Đang cập nhật',
            fee: item.PhiDichVu ? `${Number(item.PhiDichVu).toLocaleString('vi-VN')} đ` : 'Miễn phí',
            department: String(item.LinhVuc || 'Tổng hợp'),
            icon: FileText,
            color: SERVICE_COLORS[index % SERVICE_COLORS.length],
            popular: index < 2,
          }));
          setServices(mappedServices);
        }

        if (hoSoRows.length) {
          const mapped = hoSoRows.map((row: any) => {
            const status = mapStatus(String(row.TrangThai || ''));
            const submitDate = formatDate(row.NgayNop || row.NgayTao) || '-';
            const expectedDate = formatDate(row.NgayHenTra) || '';
            const completedDate = formatDate(row.NgayHoanThanh) || '';
            const title = String(row.TenThuTuc || row.LinhVuc || 'Thủ tục hành chính');
            const submittedBy = String(row.NguoiNop || '').trim();
            const fallbackId = `HS-${new Date().getFullYear()}-${String(Math.random()).slice(2, 6)}`;
            const trackingSteps = buildTrackingSteps(status, submitDate, expectedDate, completedDate);

            return {
              id: String(row.MaHoSo || row.SoHoSo || fallbackId),
              title,
              submitDate,
              status,
              completedDate: completedDate || undefined,
              expectedDate: expectedDate || undefined,
              submittedBy: submittedBy || undefined,
              progress: estimateProgress(status),
              trackingSteps,
              rating: status === 'completed' ? 5 : undefined,
            } as Submission;
          });

          const normalizedUser = normalizeAscii(user?.name || user?.username || '');
          const filtered = normalizedUser
            ? mapped.filter((item) => normalizeAscii(item.submittedBy || '').includes(normalizedUser))
            : mapped;

          const sorted = (filtered.length ? filtered : mapped)
            .sort((a, b) => STATUS_PRIORITY[b.status] - STATUS_PRIORITY[a.status]);
          setSubmissions(sorted.length ? sorted : FALLBACK_SUBMISSIONS);
        }
      } catch {
        if (active) {
          setSubmissions(FALLBACK_SUBMISSIONS);
          setServices(FALLBACK_SERVICES);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      active = false;
    };
  }, [user?.name, user?.username]);

  const handleSubmitFeedback = async () => {
    if (!feedbackComment.trim()) {
      setFeedbackMessage('Vui lòng nhập nội dung phản ánh.');
      return;
    }

    const rating = feedbackRating || 3;
    const priority = rating <= 1 ? 'Khẩn cấp' : rating <= 2 ? 'Cao' : 'Thường';
    const title = feedbackComment.split('\n')[0].slice(0, 120) || 'Phản ánh công dân';
    const userId = Number(user?.id);

    setIsSendingFeedback(true);
    setFeedbackMessage(null);

    try {
      const response = await phanAnhApi.create({
        TieuDe: title,
        NoiDung: feedbackComment,
        MucDoUuTien: priority,
        TenNguoiPhanAnh: user?.name || user?.username || 'Công dân',
        SoDienThoai: feedbackPhone || undefined,
        DiaChi: undefined,
        TenLinhVuc: 'Dịch vụ công',
        MaCongDan: Number.isFinite(userId) ? userId : null,
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Gui phan anh that bai');
      }

      setFeedbackRating(0);
      setFeedbackComment('');
      setFeedbackMessage('Gửi phản ánh thành công.');
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : 'Gửi phản ánh thất bại');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchService.toLowerCase())
  );

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-4 text-white sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Heart className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Cổng Dịch vụ Công dân</h1>
              </div>
              <p className="text-white/90 text-lg">Nộp hồ sơ, theo dõi và phản ánh ý kiến</p>
            </div>
            <Button
              className="w-full bg-white text-green-600 hover:bg-white/90 sm:w-auto"
              onClick={() => router.push('/dashboard/submit')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nộp hồ sơ mới
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-700 border-0">Tổng số</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">{submissions.length}</p>
            <p className="text-sm text-muted-foreground">Hồ sơ đã nộp</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-status-warning/10 to-status-warning/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <Badge className="bg-orange-500/10 text-orange-700 border-0">Đang xử lý</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">
              {submissions.filter((s) => s.status === 'in-progress').length}
            </p>
            <p className="text-sm text-muted-foreground">Hồ sơ đang xử lý</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-status-success/10 to-status-success/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-500/10 text-green-700 border-0">Hoàn thành</Badge>
            </div>
            <p className="text-4xl font-bold mb-2">
              {submissions.filter((s) => s.status === 'completed').length}
            </p>
            <p className="text-sm text-muted-foreground">Hồ sơ hoàn thành</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-2 border-0 shadow-lg">
        <div className="flex gap-2 overflow-x-auto">
          <Button
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 ${activeTab === 'submissions' ? 'bg-primary text-white' : 'bg-transparent text-foreground hover:bg-slate-100'}`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Hồ sơ của tôi
          </Button>
          <Button
            onClick={() => setActiveTab('services')}
            className={`flex-1 ${activeTab === 'services' ? 'bg-primary text-white' : 'bg-transparent text-foreground hover:bg-slate-100'}`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Dịch vụ công
          </Button>
          <Button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 ${activeTab === 'feedback' ? 'bg-primary text-white' : 'bg-transparent text-foreground hover:bg-slate-100'}`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Phản ánh ý kiến
          </Button>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const config = statusConfig[submission.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <Card key={submission.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={config.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{submission.id}</span>
                        </div>
                        <h3 className="text-xl font-semibold">{submission.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Nộp ngày: {submission.submitDate}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="space-y-3 mt-6">
                      {submission.trackingSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed 
                                ? 'bg-green-500 text-white' 
                                : 'bg-slate-200 text-slate-400'
                            }`}>
                              {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            {index < submission.trackingSteps.length - 1 && (
                              <div className={`w-0.5 h-8 ${step.completed ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.step}
                              </p>
                              <span className="text-sm text-muted-foreground">{step.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(submission.status === 'pending' || submission.status === 'in-progress') && submission.progress && (
                    <div className="lg:w-48 flex flex-col justify-center">
                      <div className="relative w-32 h-32 mx-auto">
                        <svg className="transform -rotate-90 w-32 h-32">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#e2e8f0"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#00ADB5"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - submission.progress / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{submission.progress}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-center text-muted-foreground mt-4">
                        Dự kiến: {submission.expectedDate}
                      </p>
                    </div>
                  )}

                  {submission.status === 'completed' && submission.rating && (
                    <div className="lg:w-48 flex flex-col justify-center items-center">
                      <div className="p-4 bg-green-50 rounded-xl text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-700">Đã hoàn thành</p>
                        <p className="text-xs text-muted-foreground mt-1">{submission.completedDate}</p>
                        <div className="flex justify-center gap-1 mt-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < submission.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {submission.status === 'rejected' && (
                    <div className="lg:w-48 flex flex-col justify-center items-center">
                      <div className="p-4 bg-red-50 rounded-xl text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-red-700">Hồ sơ bị từ chối</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Liên hệ bộ phận tiếp nhận để biết thêm chi tiết.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Search */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                className="pl-10 h-12 bg-slate-50"
              />
            </div>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <Card
                  key={service.id}
                  className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => setSelectedService(service)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 bg-gradient-to-br ${service.color} rounded-xl`}>
                        <ServiceIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{service.name}</h3>
                          {service.popular && (
                            <Badge className="bg-amber-500/10 text-amber-700 border-0">
                              Phổ biến
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{service.department}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Thời gian:</span>
                            <span className="font-semibold">{service.processing}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Phí:</span>
                            <span className="font-semibold text-green-600">{service.fee}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push('/dashboard/submit');
                          }}
                        >
                          Nộp hồ sơ
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <Card className="p-8 border-0 shadow-lg">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Gửi phản ánh ý kiến</h2>
              <p className="text-muted-foreground">Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ</p>
            </div>

            {/* Rating */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold">Đánh giá của bạn</label>
              <div className="flex justify-center gap-4">
                {[
                  { rating: 5, icon: Smile, label: 'Rất hài lòng', color: 'text-green-500' },
                  { rating: 4, icon: ThumbsUp, label: 'Hài lòng', color: 'text-blue-500' },
                  { rating: 3, icon: Meh, label: 'Bình thường', color: 'text-yellow-500' },
                  { rating: 2, icon: Frown, label: 'Không hài lòng', color: 'text-orange-500' },
                  { rating: 1, icon: AlertCircle, label: 'Rất không hài lòng', color: 'text-red-500' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.rating}
                      onClick={() => setFeedbackRating(item.rating)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        feedbackRating === item.rating
                          ? 'border-primary bg-primary/5 scale-110'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${feedbackRating === item.rating ? item.color : 'text-slate-400'}`} />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Nội dung phản ánh</label>
              <Textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Nhập nội dung phản ánh của bạn..."
                className="min-h-[150px] bg-slate-50"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold">Số điện thoại</label>
                <Input
                  type="tel"
                  placeholder="0912 345 678"
                  className="bg-slate-50"
                  value={feedbackPhone}
                  onChange={(e) => setFeedbackPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold">Email</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  className="bg-slate-50"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                />
              </div>
            </div>

            {feedbackMessage && (
              <div className="text-sm text-center text-muted-foreground">{feedbackMessage}</div>
            )}

            <Button
              className="w-full h-12 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90"
              onClick={handleSubmitFeedback}
              disabled={isSendingFeedback || isLoading}
            >
              <Send className="w-4 h-4 mr-2" />
              {isSendingFeedback ? 'Đang gửi...' : 'Gửi phản ánh'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
