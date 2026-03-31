'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowRight, Building2, Lock, Shield, Sparkles, UserCircle2, Users } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { identifier: 'admin', password: 'admin123', role: 'admin' as const, name: 'Quản trị viên', icon: Shield, color: 'from-[#DA291C] to-[#003F88]' },
  { identifier: 'leader', password: 'password', role: 'leader' as const, name: 'Lãnh đạo', icon: Building2, color: 'from-[#003F88] to-[#FFD700]' },
  { identifier: 'officer', password: 'password', role: 'officer' as const, name: 'Cán bộ', icon: Users, color: 'from-[#DA291C] via-[#003F88] to-[#FFD700]' },
  { identifier: 'citizen', password: 'password', role: 'citizen' as const, name: 'Công dân', icon: UserCircle2, color: 'from-[#FFD700] to-[#DA291C]' },
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<UserRole>('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(identifier, password, role);
      if (result.requiresVerification) {
        const email = encodeURIComponent(result.email || identifier);
        router.push(`/verify-otp?email=${email}`);
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setIdentifier(acc.identifier);
    setPassword(acc.password);
    setRole(acc.role);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#DA291C] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#003F88] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 animate-slide-in-left">
                <div className="w-16 h-16 bg-gradient-to-br from-[#DA291C] to-[#003F88] rounded-2xl flex items-center justify-center shadow-lg rotate-6 hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#DA291C] to-[#003F88] bg-clip-text text-transparent">Smart Dashboard</h1>
                  <p className="text-sm text-slate-600 font-medium">Dashboard XP</p>
                </div>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">
                {'Hệ thống quản lý UBND xã/phường với đăng nhập an toàn, đăng ký tài khoản và xác thực OTP email.'}
              </p>
            </div>
          </div>

          <div className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Card className="glass-card border-0 shadow-2xl overflow-hidden">
              <div className="relative bg-gradient-to-br from-[#DA291C] via-[#003F88] to-[#FFD700] p-8 pb-16">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/90 font-medium">Xác thực tài khoản</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h2>
                  <p className="text-white/80">
                    {'Bảo mật đa lớp với mật khẩu mã hóa và OTP email'}
                  </p>
                </div>
              </div>

              <div className="p-8 -mt-8 relative">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <button
                        key={acc.identifier}
                        onClick={() => handleQuickLogin(acc)}
                        className={`relative group p-3 bg-gradient-to-br ${acc.color} rounded-xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                      >
                        <div className="relative flex items-center gap-2">
                          <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-xs">{acc.name}</div>
                            <div className="text-[11px] opacity-90">Dùng nhanh</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="flex gap-3 p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Tên đăng nhập hoặc email" className="h-12 rounded-xl bg-slate-50" required />
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" className="h-12 rounded-xl bg-slate-50" required />
                  <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                    <option value="admin">Quản trị viên</option>
                    <option value="leader">Lãnh đạo</option>
                    <option value="officer">Cán bộ chuyên môn</option>
                    <option value="citizen">Công dân</option>
                  </select>
                  <Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-[#DA291C] to-[#003F88] text-white rounded-xl">
                    {isLoading ? 'Đang xử lý...' : <span className="inline-flex items-center gap-2">Đăng nhập <ArrowRight className="w-4 h-4" /></span>}
                  </Button>
                </form>

                <div className="mt-5 text-center text-sm text-slate-600">
                  Chưa có tài khoản?{' '}
                  <Link href="/register" className="font-semibold text-[#003F88] hover:underline">
                    Đăng ký ngay
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    {'Mật khẩu được mã hóa bcrypt, tài khoản mới phải qua OTP email mới kích hoạt.'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
