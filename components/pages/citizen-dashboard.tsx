'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  MapPin,
  Star,
  Plus,
  Eye,
  Download,
} from 'lucide-react';

// Mock data
const mySubmissions = [
  {
    id: 'HS-2024-001',
    title: 'Cấp giấy chứng thực',
    submitDate: '2024-01-15',
    status: 'completed',
    completedDate: '2024-01-22',
    rating: 5,
  },
  {
    id: 'HS-2024-002',
    title: 'Đăng ký biến động dân số',
    submitDate: '2024-01-16',
    status: 'in-progress',
    progress: 70,
    expectedDate: '2024-01-28',
  },
  {
    id: 'HS-2024-003',
    title: 'Cấp phép xây dựng',
    submitDate: '2024-01-10',
    status: 'pending',
    progress: 20,
    expectedDate: '2024-01-30',
  },
];

const commonServices = [
  {
    id: 1,
    name: 'Cấp giấy chứng thực',
    processing: '3-5 ngày',
    fee: 'Miễn phí',
    department: 'Tư pháp - Hộ tịch',
  },
  {
    id: 2,
    name: 'Đăng ký biến động dân số',
    processing: '2-3 ngày',
    fee: 'Miễn phí',
    department: 'Tư pháp - Hộ tịch',
  },
  {
    id: 3,
    name: 'Cấp phép xây dựng',
    processing: '15 ngày',
    fee: '500,000 đ',
    department: 'Địa chính - Xây dựng',
  },
  {
    id: 4,
    name: 'Bổ sung thửa đất',
    processing: '7-10 ngày',
    fee: '200,000 đ',
    department: 'Địa chính - Xây dựng',
  },
];

const feedbackOptions = [
  { rating: 5, label: 'Rất hài lòng', emoji: '😍' },
  { rating: 4, label: 'Hài lòng', emoji: '😊' },
  { rating: 3, label: 'Bình thường', emoji: '😐' },
  { rating: 2, label: 'Không hài lòng', emoji: '😞' },
  { rating: 1, label: 'Rất không hài lòng', emoji: '😠' },
];

export function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'services' | 'feedback'>('submissions');
  const [feedbackForm, setFeedbackForm] = useState<{ caseId: string; rating: number | null; comment: string } | null>(null);
  const [selectedService, setSelectedService] = useState<typeof commonServices[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header - banner tổng quan dùng xanh nhạt */}
      <div className="rounded-lg bg-[var(--banner)] px-4 py-3">
        <h1 className="text-3xl font-bold text-foreground">
          Cổng Dịch vụ Công dân
        </h1>
        <p className="text-muted-foreground mt-1">
          Nộp hồ sơ trực tuyến, theo dõi tiến độ, gửi phản ánh
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Hồ sơ của tôi</p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {mySubmissions.length}
              </p>
            </div>
            <div className="p-3 bg-primary/20 rounded-full">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Đang xử lý</p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {mySubmissions.filter((s) => s.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-status-success/10 to-status-success/5 border-status-success/20 p-6 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Hoàn thành</p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {mySubmissions.filter((s) => s.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-status-success/20 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-status-success" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto border-b border-border pb-1">
        {[
          { id: 'submissions', label: 'Hồ sơ của tôi', icon: FileText },
          { id: 'services', label: 'Tra cứu dịch vụ', icon: MessageSquare },
          { id: 'feedback', label: 'Gửi phản ánh', icon: MessageSquare },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 font-medium text-sm transition-colors flex items-center gap-2 ${
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nộp hồ sơ mới
            </Button>
          </div>

          {mySubmissions.map((submission) => (
            <Card
              key={submission.id}
              className="bg-card border-border p-6 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                      {submission.id}
                    </span>
                    <Badge
                      className={
                        submission.status === 'completed'
                          ? 'bg-status-success/20 text-status-success border-status-success/30'
                          : submission.status === 'in-progress'
                            ? 'bg-secondary/20 text-secondary border-secondary/30'
                            : 'bg-muted text-muted-foreground border-border'
                      }
                    >
                      {submission.status === 'completed'
                        ? 'Hoàn thành'
                        : submission.status === 'in-progress'
                          ? 'Đang xử lý'
                          : 'Chờ xử lý'}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {submission.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nộp: {submission.submitDate}
                    {submission.status === 'completed' && (
                      <span className="ml-4">
                        • Hoàn thành: {(submission as any).completedDate}
                      </span>
                    )}
                    {submission.status !== 'completed' && (
                      <span className="ml-4">
                        • Dự kiến: {(submission as any).expectedDate}
                      </span>
                    )}
                  </p>

                  {submission.status !== 'completed' && (
                    <div className="mt-3 bg-muted/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(submission as any).progress}%` }}
                      />
                    </div>
                  )}

                  {submission.status === 'completed' && (
                    <div className="mt-3 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (submission as any).rating
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">
                        {(submission as any).rating} sao
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    <Eye className="w-4 h-4 mr-1" />
                    Chi tiết
                  </Button>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    <Download className="w-4 h-4 mr-1" />
                    Tài liệu
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          {commonServices.map((service) => (
            <Card
              key={service.id}
              className="bg-card border-border p-6 cursor-pointer hover:border-primary/50 transition"
              onClick={() => setSelectedService(service)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.department}
                  </p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-muted-foreground">
                      ⏱️ Thời gian: <span className="text-foreground font-medium">{service.processing}</span>
                    </span>
                    <span className="text-muted-foreground">
                      💰 Lệ phí: <span className="text-foreground font-medium">{service.fee}</span>
                    </span>
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Nộp
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {!feedbackForm ? (
            <div>
              <p className="text-muted-foreground mb-4">
                Chọn hồ sơ để gửi phản ánh:
              </p>
              {mySubmissions
                .filter((s) => s.status === 'completed')
                .map((submission) => (
                  <Card
                    key={submission.id}
                    className="bg-card border-border p-4 cursor-pointer hover:border-primary/50 transition"
                    onClick={() =>
                      setFeedbackForm({
                        caseId: submission.id,
                        rating: null,
                        comment: '',
                      })
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {submission.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {submission.id}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="border-border bg-transparent">
                        Gửi phản ánh
                      </Button>
                    </div>
                  </Card>
                ))}
              {mySubmissions.filter((s) => s.status === 'completed').length === 0 && (
                <Card className="bg-card border-border p-6 text-center">
                  <p className="text-muted-foreground">
                    Không có hồ sơ hoàn thành để gửi phản ánh
                  </p>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Gửi phản ánh: {feedbackForm.caseId}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Đánh giá:
                  </p>
                  <div className="flex gap-3">
                    {feedbackOptions.map((option) => (
                      <button
                        key={option.rating}
                        onClick={() =>
                          setFeedbackForm({
                            ...feedbackForm,
                            rating: option.rating,
                          })
                        }
                        className={`text-3xl transition-transform hover:scale-110 ${
                          feedbackForm.rating === option.rating
                            ? 'scale-110'
                            : 'opacity-50'
                        }`}
                        title={option.label}
                      >
                        {option.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Bình luận (tùy chọn)
                  </label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        comment: e.target.value,
                      })
                    }
                    placeholder="Chia sẻ ý kiến của bạn..."
                    className="w-full p-3 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    disabled={!feedbackForm.rating}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    Gửi phản ánh
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border bg-transparent"
                    onClick={() => setFeedbackForm(null)}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
