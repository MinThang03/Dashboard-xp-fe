'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { DollarSign } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-TCKT-001',
    title: 'Quyết toán tài chính năm',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-10',
    deadline: '2024-02-01',
    status: 'in-progress' as const,
    priority: 'critical' as const,
    progress: 50,
  },
  {
    id: 'HS-TCKT-002',
    title: 'Báo cáo tài chính quý',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-15',
    deadline: '2024-01-31',
    status: 'pending' as const,
    priority: 'high' as const,
    progress: 15,
  },
];

export default function FinanceDepartmentPage() {
  const stats = {
    total: mockCases.length,
    pending: 0,
    inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
    completed: mockCases.filter((c) => c.status === 'completed').length,
  };

  const services = [
    'Quản lý ngân sách',
    'Lập dự toán chi',
    'Quản lý tài sản công',
    'Kiểm toán nội bộ',
  ];

  return (
    <DepartmentPageTemplate
      departmentName="Tài chính - Kế toán"
      departmentIcon={<DollarSign className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
