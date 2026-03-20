'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { Briefcase } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-LDAS-001',
    title: 'Cấp bảo hiểm xã hội',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-13',
    deadline: '2024-01-20',
    status: 'in-progress' as const,
    priority: 'high' as const,
    progress: 75,
  },
  {
    id: 'HS-LDAS-002',
    title: 'Hỗ trợ thất nghiệp',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-15',
    deadline: '2024-01-25',
    status: 'pending' as const,
    priority: 'normal' as const,
    progress: 30,
  },
];

export default function LaborDepartmentPage() {
  const stats = {
    total: mockCases.length,
    pending: mockCases.filter((c) => c.status === 'pending').length,
    inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
    completed: 0,
  };

  const services = [
    'Cấp bảo hiểm xã hội',
    'Hỗ trợ thất nghiệp',
    'Đăng ký độc lập',
    'Tư vấn việc làm',
  ];

  return (
    <DepartmentPageTemplate
      departmentName="Lao động - An sinh"
      departmentIcon={<Briefcase className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
