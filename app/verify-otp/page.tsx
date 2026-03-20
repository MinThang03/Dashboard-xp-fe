'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialEmail = params.get('email') || '';
    setEmail(initialEmail);
  }, []);

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await authApi.verifyOtp(email.trim(), otp.trim());
      if (!response.success) {
        throw new Error(response.message || response.error || 'Xác thực OTP thất bại');
      }
      setSuccess(response.data?.message || 'Xác thực thành công, vui lòng đăng nhập.');
      setTimeout(() => router.push('/'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực OTP thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const onResend = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const response = await authApi.resendOtp(email.trim());
      if (!response.success) {
        throw new Error(response.message || response.error || 'Không thể gửi lại OTP');
      }
      setSuccess(response.data?.message || 'Đã gửi lại OTP, vui lòng kiểm tra email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#DA291C] to-[#003F88] p-6 text-white">
          <h1 className="text-2xl font-bold">Xác thực OTP</h1>
          <p className="text-white/85 text-sm mt-1">Nhập mã OTP được gửi về email để kích hoạt tài khoản</p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
              <CheckCircle2 className="w-4 h-4 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={onVerify} className="space-y-3">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email đăng ký" required />
            <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Nhập 6 chữ số OTP" className="tracking-[0.3em] text-center text-lg" required />

            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#DA291C] to-[#003F88] text-white">
              {isLoading ? 'Đang xử lý...' : 'Xác thực OTP'}
            </Button>
          </form>

          <Button type="button" variant="outline" onClick={onResend} disabled={isLoading || !email} className="w-full">
            <span className="inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Gửi lại OTP</span>
          </Button>

          <div className="text-center text-sm text-slate-600">
            Nhập sai email?{' '}
            <Link href="/register" className="font-semibold text-[#003F88] hover:underline">
              Quay lại đăng ký
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
