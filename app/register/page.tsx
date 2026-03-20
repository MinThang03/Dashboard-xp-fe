'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { type UserRole } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

function roleToRoleId(role: UserRole): number {
  if (role === 'admin') return 1;
  if (role === 'leader') return 2;
  if (role === 'officer') return 3;
  return 4;
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' as UserRole,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.register({
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        roleId: roleToRoleId(form.role),
      });

      if (!response.success) {
        throw new Error(response.message || response.error || 'Đăng ký thất bại');
      }

      router.push(`/verify-otp?email=${encodeURIComponent(response.data?.email || form.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100 p-4">
      <Card className="w-full max-w-lg border-0 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#003F88] to-[#DA291C] p-6 text-white">
          <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-white/85 text-sm mt-1">Hoàn tất thông tin để nhận mã OTP xác thực email</p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <Input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} placeholder="Tên đăng nhập" required />
            <Input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Họ và tên" required />
            <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" required />
            <Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Mật khẩu" required />
            <Input type="password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Xác nhận mật khẩu" required />

            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserRole }))} className="w-full h-10 px-3 border border-slate-200 rounded-md bg-white text-sm">
              <option value="admin">Quản trị viên</option>
              <option value="leader">Lãnh đạo</option>
              <option value="officer">Cán bộ chuyên môn</option>
              <option value="citizen">Công dân</option>
            </select>

            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#003F88] to-[#DA291C] text-white">
              {isLoading ? 'Đang xử lý...' : <span className="inline-flex items-center gap-2">Đăng ký <UserPlus className="w-4 h-4" /></span>}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Đã có tài khoản?{' '}
            <Link href="/" className="font-semibold text-[#003F88] hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Quay về đăng nhập
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
