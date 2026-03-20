'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { Leaf } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-MTRW-001',
    title: 'Cấp phép xả thải môi trường',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-12',
    deadline: '2024-02-05',
    status: 'pending' as const,
    priority: 'high' as const,
    progress: 20,
  },
  {
    id: 'HS-MTRW-002',
    title: 'Báo cáo đánh giá tác động môi trường',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-10',
    deadline: '2024-01-27',
    status: 'in-progress' as const,
    priority: 'critical' as const,
    progress: 65,
  },
];

export default function EnvironmentDepartmentPage() {
  const stats = {
    total: mockCases.length,
    pending: 0,
    inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
    completed: mockCases.filter((c) => c.status === 'completed').length,
  };

  const services = [
    'Cấp phép khai thác tài nguyên',
    'Khảo sát môi trường',
    'Bảo vệ rừng',
    'Phát triển nông lâm',
  ];

  return (
    <DepartmentPageTemplate
      departmentName="Môi trường"
      departmentIcon={<Leaf className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
