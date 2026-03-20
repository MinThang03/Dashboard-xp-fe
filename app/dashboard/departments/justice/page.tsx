'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { Scale } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-TPHP-001',
    title: 'Cấp giấy chứng thực',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-15',
    deadline: '2024-01-20',
    status: 'completed' as const,
    priority: 'normal' as const,
  },
  {
    id: 'HS-TPHP-002',
    title: 'Đăng ký biến động dân số',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-16',
    deadline: '2024-01-23',
    status: 'in-progress' as const,
    priority: 'high' as const,
  },
  {
    id: 'HS-TPHP-003',
    title: 'Đăng ký kết hôn',
    citizen: 'Lê Văn C',
    dateSubmitted: '2024-01-14',
    deadline: '2024-01-21',
    status: 'pending' as const,
    priority: 'normal' as const,
  },
  {
    id: 'HS-TPHP-004',
    title: 'Cấp bản sao hộ tịch',
    citizen: 'Phạm Thị D',
    dateSubmitted: '2024-01-10',
    deadline: '2024-01-18',
    status: 'overdue' as const,
    priority: 'critical' as const,
  },
];

const services = [
  'Cấp giấy chứng thực',
  'Đăng ký biến động dân số',
  'Đăng ký kết hôn',
  'Đăng ký ly hôn',
  'Cấp bản sao hộ tịch',
  'Đăng ký khai sinh',
  'Đăng ký khai tử',
  'Thay đổi hộ tịch',
  'Công chứng giấy tờ',
];

const stats = {
  total: mockCases.length,
  pending: mockCases.filter((c) => c.status === 'pending').length,
  inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
  completed: mockCases.filter((c) => c.status === 'completed').length,
};

export default function JusticePage() {
  return (
    <DepartmentPageTemplate
      departmentName="Tư pháp - Hộ tịch"
      departmentIcon={<Scale className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
