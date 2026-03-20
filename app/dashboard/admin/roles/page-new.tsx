'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Eye,
} from 'lucide-react';

const mockRoles = [
  {
    id: 1,
    name: 'Quản trị viên',
    code: 'ADMIN',
    users: 2,
    permissions: [
      'Toàn quyền hệ thống',
      'Quản lý người dùng',
      'Cấu hình hệ thống',
      'Xem tất cả dữ liệu',
    ],
    color: 'red',
  },
  {
    id: 2,
    name: 'Lãnh đạo',
    code: 'LEADER',
    users: 5,
    permissions: [
      'Xem KPI và báo cáo',
      'Phê duyệt hồ sơ',
      'Giám sát ngân sách',
      'Xem cảnh báo',
    ],
    color: 'purple',
  },
  {
    id: 3,
    name: 'Cán bộ chuyên môn',
    code: 'OFFICER',
    users: 15,
    permissions: [
      'Xử lý hồ sơ',
      'Cập nhật tiến độ',
      'Tải tài liệu',
      'Liên hệ công dân',
    ],
    color: 'blue',
  },
  {
    id: 4,
    name: 'Công dân',
    code: 'CITIZEN',
    users: 120,
    permissions: [
      'Nộp hồ sơ',
      'Tra cứu hồ sơ',
      'Gửi phản ánh',
      'Xem dịch vụ',
    ],
    color: 'green',
  },
];

const colorClasses: Record<string, string> = {
  red: 'bg-status-danger/20 text-status-danger border-status-danger/30',
  purple: 'bg-secondary/20 text-secondary border-secondary/30',
  blue: 'bg-primary/20 text-primary border-primary/30',
  green: 'bg-status-success/20 text-status-success border-status-success/30',
};

export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = mockRoles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quyền & Vai trò
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý phân quyền và vai trò trong hệ thống
          </p>
        </div>
        <Button className="gap-2 bg-primary">
          <Plus className="w-4 h-4" />
          Thêm vai trò mới
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockRoles.map((role) => (
          <Card key={role.id} className={`p-4 bg-gradient-to-br from-${role.color}-500/10 to-${role.color}-500/5`}>
            <p className="text-sm text-muted-foreground">{role.name}</p>
            <p className="text-2xl font-bold mt-1">{role.users}</p>
            <p className="text-xs text-muted-foreground mt-1">người dùng</p>
          </Card>
        ))}
      </div>

      {/* Roles List */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm vai trò..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="p-6 bg-secondary/20 border-border hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-${role.color}-500/20`}>
                      <Shield className={`w-6 h-6 text-${role.color}-500`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {role.name}
                      </h3>
                      <Badge className={colorClasses[role.color]}>
                        {role.code}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Users className="w-4 h-4" />
                    <span>{role.users} người dùng</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Quyền hạn:</p>
                  <div className="space-y-1">
                    {role.permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
