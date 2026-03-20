'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { Heart } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-YTGD-001',
    title: 'Cấp giấy tiêm chủng',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-14',
    deadline: '2024-01-21',
    status: 'completed' as const,
    priority: 'normal' as const,
    progress: 100,
  },
  {
    id: 'HS-YTGD-002',
    title: 'Xác nhận lịch sử y tế',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-16',
    deadline: '2024-01-23',
    status: 'in-progress' as const,
    priority: 'normal' as const,
    progress: 45,
  },
];

export default function HealthDepartmentPage() {
  const stats = {
    total: mockCases.length,
    pending: 0,
    inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
    completed: mockCases.filter((c) => c.status === 'completed').length,
  };

  const services = [
    'Khám sức khỏe tổng quát',
    'Tiêm chủng',
    'Tư vấn chăm sóc trẻ em',
    'Cấp phiếu sức khỏe',
  ];

  return (
    <DepartmentPageTemplate
      departmentName="Y tế - Giáo dục"
      departmentIcon={<Heart className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
