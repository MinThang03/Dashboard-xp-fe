'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeaderDashboard } from '@/components/pages/leader-dashboard';
import { OfficerDashboard } from '@/components/pages/officer-dashboard';
import { CitizenDashboardPremium } from '@/components/pages/citizen-dashboard-premium';
import { AdminDashboardPremium } from '@/components/pages/admin-dashboard-premium';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
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
