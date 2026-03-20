'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DepartmentPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  cases: Array<{
    id: string;
    title: string;
    citizen: string;
    dateSubmitted: string;
    deadline: string;
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    priority: 'critical' | 'high' | 'normal' | 'low';
    progress: number;
  }>;
}

const performanceData = [
  { name: 'Tuần 1', completed: 8, pending: 3 },
  { name: 'Tuần 2', completed: 12, pending: 2 },
  { name: 'Tuần 3', completed: 15, pending: 4 },
  { name: 'Tuần 4', completed: 18, pending: 1 },
];

const statusColors: Record<string, string> = {
  'pending': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'overdue': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityColors: Record<string, string> = {
  'critical': 'bg-red-500',
  'high': 'bg-orange-500',
  'normal': 'bg-blue-500',
  'low': 'bg-green-500',
};

const statusVietnamese: Record<string, string> = {
  'pending': 'Chờ xử lý',
  'in-progress': 'Đang xử lý',
  'completed': 'Hoàn thành',
  'overdue': 'Trễ hạn',
};

const priorityVietnamese: Record<string, string> = {
  'critical': 'Khẩn cấp',
  'high': 'Cao',
  'normal': 'Bình thường',
  'low': 'Thấp',
};

export function DepartmentPage({
  title,
  description,
  icon,
  cases,
}: DepartmentPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: cases.length,
    completed: cases.filter((c) => c.status === 'completed').length,
    pending: cases.filter((c) => c.status === 'pending').length,
    overdue: cases.filter((c) => c.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="text-4xl opacity-50">{icon}</div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng hồ sơ', value: stats.total, color: 'bg-primary/10' },
          { label: 'Hoàn thành', value: stats.completed, color: 'bg-status-success/10' },
          { label: 'Chờ xử lý', value: stats.pending, color: 'bg-blue-500/10' },
          { label: 'Trễ hạn', value: stats.overdue, color: 'bg-status-danger/10' },
        ].map((stat, i) => (
          <Card key={i} className={`border-border p-4 ${stat.color}`}>
            <p className="text-xs text-muted-foreground uppercase font-semibold">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Xu hướng hồ sơ theo tuần
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #2a2a3e',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#4ade80"
              name="Hoàn thành"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#f97316"
              name="Chờ xử lý"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Cases Table */}
      <Card className="bg-card border-border p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Danh sách hồ sơ ({filteredCases.length})
            </h3>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hồ sơ
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="in-progress">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="overdue">Trễ hạn</option>
            </select>
          </div>

          {/* Cases List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCases.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Không tìm thấy hồ sơ phù hợp
              </div>
            ) : (
              filteredCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="p-4 rounded-lg bg-secondary/20 border border-border hover:border-primary/50 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {caseItem.id}
                        </span>
                        <Badge
                          className={`text-xs border ${
                            priorityColors[caseItem.priority]
                          } text-white`}
                        >
                          {priorityVietnamese[caseItem.priority]}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-foreground">
                        {caseItem.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {caseItem.citizen} • Nộp: {caseItem.dateSubmitted}
                      </p>
                    </div>

                    <div className="text-right">
                      <Badge className={statusColors[caseItem.status]}>
                        {statusVietnamese[caseItem.status]}
                      </Badge>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Hạn: {caseItem.deadline}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 bg-muted/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${caseItem.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
