'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  FileCheck,
  Send,
} from 'lucide-react';
import { REPORTS, FIELD_STATISTICS, Report } from '@/lib/leader-data';
import { baoCaoApi } from '@/lib/api';

export function ReportsPage() {
  const [reports, setReports] = useState(REPORTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterField, setFilterField] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fieldByCode = useMemo(() => {
    const map = new Map<string, { name: string }>();
    FIELD_STATISTICS.forEach((field) => map.set(field.code, { name: field.name }));
    return map;
  }, []);

  const normalizeAscii = (value: string) => {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const mapLoaiBaoCaoToType = (value?: string | null): Report['type'] => {
    const normalized = normalizeAscii(String(value || '')).trim();
    if (normalized.includes('ngay') || normalized.includes('daily')) return 'daily';
    if (normalized.includes('tuan') || normalized.includes('weekly')) return 'weekly';
    if (normalized.includes('quy') || normalized.includes('quarter')) return 'quarterly';
    if (normalized.includes('nam') || normalized.includes('year')) return 'yearly';
    return 'monthly';
  };

  const mapTrangThai = (value?: string | null): Report['status'] => {
    const normalized = normalizeAscii(String(value || '')).trim();
    if (normalized.includes('nhap') || normalized.includes('draft')) return 'draft';
    if (normalized.includes('nop') || normalized.includes('submitted')) return 'submitted';
    if (normalized.includes('duyet') || normalized.includes('approved')) return 'approved';
    if (normalized.includes('cong bo') || normalized.includes('published')) return 'published';
    return 'draft';
  };

  const mapMaLinhVucToCode = (value?: number | null): string => {
    switch (value) {
      case 1:
        return 'TU_PHAP';
      case 2:
        return 'Y_TE_GD';
      case 3:
        return 'KINH_TE';
      case 4:
        return 'AN_NINH';
      case 5:
        return 'XAY_DUNG';
      case 6:
        return 'LAO_DONG';
      case 7:
        return 'TAI_CHINH';
      case 8:
        return 'DIA_CHINH';
      case 9:
        return 'MOI_TRUONG';
      case 10:
        return 'VAN_HOA';
      default:
        return 'ALL';
    }
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    baoCaoApi
      .getList({ page: 1, limit: 5000 })
      .then((res) => {
        if (!active) return;
        if (!res.success || !Array.isArray(res.data)) {
          return;
        }
        const mapped = res.data.map((item: any) => {
          const fieldCode = mapMaLinhVucToCode(item.MaLinhVuc);
          const fieldName = fieldByCode.get(fieldCode)?.name || 'Tong hop';
          const createdDate = String(item.NgayLap || item.NgayTao || '').slice(0, 10);
          return {
            id: item.MaBaoCao,
            title: item.TieuDe || 'Bao cao',
            type: mapLoaiBaoCaoToType(item.LoaiBaoCao),
            fieldCode,
            fieldName,
            department: fieldName,
            createdBy: item.NguoiLapText || 'He thong',
            createdDate,
            period: item.ThangNam || createdDate,
            status: mapTrangThai(item.TrangThai),
            summary: item.NoiDung || '',
            fileSize: item.FileDinhKem ? '1.0 MB' : '-',
          } as Report;
        });
        setReports(mapped);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fieldByCode]);

  // Statistics
  const stats = {
    total: reports.length,
    daily: reports.filter((r) => r.type === 'daily').length,
    weekly: reports.filter((r) => r.type === 'weekly').length,
    monthly: reports.filter((r) => r.type === 'monthly').length,
    quarterly: reports.filter((r) => r.type === 'quarterly').length,
    yearly: reports.filter((r) => r.type === 'yearly').length,
    draft: reports.filter((r) => r.status === 'draft').length,
    submitted: reports.filter((r) => r.status === 'submitted').length,
    approved: reports.filter((r) => r.status === 'approved').length,
    published: reports.filter((r) => r.status === 'published').length,
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || report.type === filterType;
    const matchField = filterField === 'all' || report.fieldCode === filterField;
    const matchStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchSearch && matchType && matchField && matchStatus;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily':
        return 'Ngày';
      case 'weekly':
        return 'Tuần';
      case 'monthly':
        return 'Tháng';
      case 'quarterly':
        return 'Quý';
      case 'yearly':
        return 'Năm';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Bản nháp';
      case 'submitted':
        return 'Đã nộp';
      case 'approved':
        return 'Đã duyệt';
      case 'published':
        return 'Đã công bố';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo & Phân tích</h1>
          <p className="text-muted-foreground mt-1">
            Tổng hợp và xem xét các báo cáo định kỳ từ các phòng ban
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 xl:w-auto xl:flex-nowrap">
          <Button variant="outline" size="sm" disabled={isLoading}>
            <Filter className="w-4 h-4 mr-2" />
            Lọc nâng cao
          </Button>
          <Button size="sm" disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Xuất danh sách
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Tổng số</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Ngày</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.daily}</div>
          </CardContent>
        </Card>
        <Card className="border-cyan-200 bg-cyan-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Tuần</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-700">{stats.weekly}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.monthly}</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Quý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats.quarterly}</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Năm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.yearly}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đã nộp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đã duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đã công bố</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.published}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm báo cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full xl:w-[160px]">
            <SelectValue placeholder="Loại báo cáo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="daily">Ngày</SelectItem>
            <SelectItem value="weekly">Tuần</SelectItem>
            <SelectItem value="monthly">Tháng</SelectItem>
            <SelectItem value="quarterly">Quý</SelectItem>
            <SelectItem value="yearly">Năm</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterField} onValueChange={setFilterField}>
          <SelectTrigger className="w-full xl:w-[200px]">
            <SelectValue placeholder="Lĩnh vực" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lĩnh vực</SelectItem>
            <SelectItem value="ALL">Tổng hợp</SelectItem>
            {FIELD_STATISTICS.map((field) => (
              <SelectItem key={field.id} value={field.code}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full xl:w-[160px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="submitted">Đã nộp</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="published">Đã công bố</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <Tabs defaultValue="submitted" className="space-y-4">
        <TabsList>
          <TabsTrigger value="submitted">Chờ xem xét ({stats.submitted})</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt ({stats.approved})</TabsTrigger>
          <TabsTrigger value="published">Đã công bố ({stats.published})</TabsTrigger>
          <TabsTrigger value="all">Tất cả ({stats.total})</TabsTrigger>
        </TabsList>

        {(['submitted', 'approved', 'published', 'all'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid gap-4">
              {filteredReports
                .filter((report) => tab === 'all' || report.status === tab)
                .map((report) => (
                  <Card
                    key={report.id}
                    className="hover:shadow-md transition-all cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                            <Badge className={getStatusColor(report.status)}>
                              {getStatusLabel(report.status)}
                            </Badge>
                            {report.fieldCode !== 'ALL' && (
                              <Badge variant="secondary">{report.fieldName}</Badge>
                            )}
                            {report.fieldCode === 'ALL' && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Báo cáo tổng hợp
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <CardDescription className="text-sm">{report.summary}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Kỳ báo cáo</div>
                              <div className="font-medium">{report.period}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Phòng ban</div>
                              <div className="font-medium">{report.department}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Người tạo</div>
                              <div className="font-medium">{report.createdBy}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-xs text-muted-foreground">Kích thước</div>
                              <div className="font-medium">{report.fileSize}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Xem
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Actions */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Hành động nhanh</CardTitle>
          <CardDescription>
            Các tác vụ thường dùng với báo cáo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col">
              <FileCheck className="w-6 h-6 mb-2 text-blue-600" />
              <span className="text-sm">Phê duyệt hàng loạt</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Download className="w-6 h-6 mb-2 text-green-600" />
              <span className="text-sm">Tải tất cả báo cáo</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <Send className="w-6 h-6 mb-2 text-purple-600" />
              <span className="text-sm">Công bố báo cáo</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col">
              <FileText className="w-6 h-6 mb-2 text-amber-600" />
              <span className="text-sm">Tạo báo cáo tổng hợp</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
