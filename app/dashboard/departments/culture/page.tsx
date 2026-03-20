'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { Music } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-VHDT-001',
    title: 'Cấp phép hoạt động văn hóa',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-15',
    deadline: '2024-01-29',
    status: 'in-progress' as const,
    priority: 'normal' as const,
    progress: 80,
  },
  {
    id: 'HS-VHDT-002',
    title: 'Đăng ký di sản văn hóa',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-16',
    deadline: '2024-02-10',
    status: 'pending' as const,
    priority: 'low' as const,
    progress: 10,
  },
];

export default function CultureDepartmentPage() {
  const stats = {
    total: mockCases.length,
    pending: mockCases.filter((c) => c.status === 'pending').length,
    inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
    completed: mockCases.filter((c) => c.status === 'completed').length,
  };

  const services = [
    'Tổ chức sự kiện văn hóa',
    'Bảo tồn di sản',
    'Tổ chức hoạt động thể thao',
    'Tuyên truyền giáo dục',
  ];

  return (
    <DepartmentPageTemplate
      departmentName="Văn hóa - Du lịch"
      departmentIcon={<Music className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
