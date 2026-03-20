'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { Shield } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-AN-001',
    title: 'Đăng ký tạm trú',
    citizen: 'Phạm Văn H',
    dateSubmitted: '2024-01-12',
    deadline: '2024-01-17',
    status: 'completed' as const,
    priority: 'high' as const,
    progress: 100,
  },
  {
    id: 'HS-ANQP-002',
    title: 'Xác nhận thông tin an ninh',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-16',
    deadline: '2024-01-25',
    status: 'in-progress' as const,
    priority: 'normal' as const,
    progress: 60,
  },
];

export default function SecurityDepartmentPage() {
  const stats = {
    total: mockCases.length,
    pending: 0,
    inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
    completed: mockCases.filter((c) => c.status === 'completed').length,
  };

  const services = [
    'Xử lý vi phạm',
    'Duyệt khai báo tạm trú',
    'Cấp phép tập trung đông người',
    'Bảo vệ trật tự công cộng',
  ];

  return (
    <DepartmentPageTemplate
      departmentName="An ninh - Quốc phòng"
      departmentIcon={<Shield className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
