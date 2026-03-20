'use client';

import { DepartmentPageTemplate } from '@/components/department-page-template';
import { Map } from 'lucide-react';

const mockCases = [
  {
    id: 'HS-DC-001',
    title: 'Cấp phép xây dựng nhà ở',
    citizen: 'Nguyễn Văn A',
    dateSubmitted: '2024-01-10',
    deadline: '2024-01-25',
    status: 'overdue' as const,
    priority: 'critical' as const,
    progress: 40,
  },
  {
    id: 'HS-DCXD-002',
    title: 'Bổ sung thửa đất - Khu vực A',
    citizen: 'Trần Thị B',
    dateSubmitted: '2024-01-14',
    deadline: '2024-01-28',
    status: 'in-progress' as const,
    priority: 'normal' as const,
    progress: 70,
  },
  {
    id: 'HS-DCXD-003',
    title: 'Chứng thực bản đồ đo đạc',
    citizen: 'Lê Văn C',
    dateSubmitted: '2024-01-15',
    deadline: '2024-01-22',
    status: 'pending' as const,
    priority: 'normal' as const,
    progress: 20,
  },
  {
    id: 'HS-DCXD-004',
    title: 'Cấp giấy chứng nhận quyền sử dụng đất',
    citizen: 'Phạm Thị D',
    dateSubmitted: '2024-01-16',
    deadline: '2024-01-30',
    status: 'completed' as const,
    priority: 'high' as const,
    progress: 100,
  },
];

const services = [
  'Cấp phép xây dựng',
  'Bổ sung thửa đất',
  'Chứng thực bản đồ',
  'Cấp giấy chứng nhận quyền sử dụng đất',
];

const stats = {
  total: mockCases.length,
  pending: mockCases.filter((c) => c.status === 'pending').length,
  inProgress: mockCases.filter((c) => c.status === 'in-progress').length,
  completed: mockCases.filter((c) => c.status === 'completed').length,
};

export default function LandDepartmentPage() {
  return (
    <DepartmentPageTemplate
      departmentName="Địa chính - Xây dựng"
      departmentIcon={<Map className="w-10 h-10 text-primary" />}
      stats={stats}
      cases={mockCases}
      services={services}
    />
  );
}
