'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
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

const mySubmissions = [
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

const services = [
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
};

export function CitizenDashboardPremium() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'services' | 'feedback'>('submissions');
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mySubmissions[0] | null>(null);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [searchService, setSearchService] = useState('');

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchService.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-8 text-white">
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
            <Button className="bg-white text-green-600 hover:bg-white/90">
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
            <p className="text-4xl font-bold mb-2">3</p>
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
            <p className="text-4xl font-bold mb-2">2</p>
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
            <p className="text-4xl font-bold mb-2">1</p>
            <p className="text-sm text-muted-foreground">Hồ sơ hoàn thành</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-2 border-0 shadow-lg">
        <div className="flex gap-2">
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
          {mySubmissions.map((submission) => {
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

                  {submission.status !== 'completed' && submission.progress && (
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
                        <Button className="w-full mt-4">
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
                <Input type="tel" placeholder="0912 345 678" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold">Email</label>
                <Input type="email" placeholder="email@example.com" className="bg-slate-50" />
              </div>
            </div>

            <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90">
              <Send className="w-4 h-4 mr-2" />
              Gửi phản ánh
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
