'use client';

import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';
import { LeaderDashboard } from '@/components/pages/leader-dashboard';
import { OfficerDashboard } from '@/components/pages/officer-dashboard';
import { CitizenDashboardPremium } from '@/components/pages/citizen-dashboard-premium';
import { AdminDashboardPremium } from '@/components/pages/admin-dashboard-premium';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    redirect('/');
  }

  return (
    <>
      {user.role === 'leader' && <LeaderDashboard />}
      {user.role === 'officer' && <OfficerDashboard />}
      {user.role === 'citizen' && <CitizenDashboardPremium />}
      {user.role === 'admin' && <AdminDashboardPremium />}
    </>
  );
}
