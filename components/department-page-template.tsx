'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
} from 'lucide-react';

interface DepartmentStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

interface CaseItem {
  id: string;
  title: string;
  citizen: string;
  dateSubmitted: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'normal' | 'high' | 'critical';
}

interface DepartmentPageProps {
  departmentName: string;
  departmentIcon: React.ReactNode;
  stats: DepartmentStats;
  cases: CaseItem[];
  services: string[];
}

const statusColors = {
  'pending': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'overdue': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels = {
  'pending': 'Chờ xử lý',
  'in-progress': 'Đang xử lý',
  'completed': 'Hoàn thành',
  'overdue': 'Trễ hạn',
};

const priorityColors = {
  'critical': 'bg-red-500',
  'high': 'bg-orange-500',
  'normal': 'bg-blue-500',
  'low': 'bg-green-500',
};

export function DepartmentPageTemplate({
  departmentName,
  departmentIcon,
  stats,
  cases,
  services,
}: DepartmentPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          {departmentIcon}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{departmentName}</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý hồ sơ và dịch vụ chuyên môn
            </p>
          </div>
        </div>
        <Button className="gap-2 bg-primary">
          <Plus className="w-4 h-4" />
          Tạo hồ sơ mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng hồ sơ</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
            </div>
            <FileText className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chờ xử lý</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-status-warning opacity-20" />
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang xử lý</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.inProgress}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-status-info opacity-20" />
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-status-success opacity-20" />
          </div>
        </Card>
      </div>

      {/* Services List */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Dịch vụ cung cấp
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{service}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Cases Table */}
      <Card className="bg-card border-border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Danh sách hồ sơ ({filteredCases.length})
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Lọc
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Xuất
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            variant={filterStatus === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(null)}
          >
            Tất cả
          </Button>
          {Object.entries(statusLabels).map(([status, label]) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Cases List */}
        <div className="space-y-3">
          {filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không tìm thấy hồ sơ nào</p>
            </div>
          ) : (
            filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-secondary/20 rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm text-muted-foreground">
                      {caseItem.id}
                    </span>
                    <Badge className={statusColors[caseItem.status]}>
                      {statusLabels[caseItem.status]}
                    </Badge>
                    <div
                      className={`w-2 h-2 rounded-full ${priorityColors[caseItem.priority]}`}
                      title={caseItem.priority}
                    />
                  </div>
                  <h4 className="font-semibold text-foreground">{caseItem.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {caseItem.citizen}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Nộp: {caseItem.dateSubmitted}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Hạn: {caseItem.deadline}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Sửa
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
