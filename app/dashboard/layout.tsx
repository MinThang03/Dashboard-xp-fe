'use client';

import React from "react"

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard-layout';
import { redirect } from 'next/navigation';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    redirect('/');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
