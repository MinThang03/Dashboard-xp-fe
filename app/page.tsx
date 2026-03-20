'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Shield, Users, Building2, UserCircle2, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { email: 'admin@ubnd.vn', password: 'password', role: 'admin' as const, name: 'Admin', icon: Shield, color: 'from-[#DA291C] to-[#003F88]' },
  { email: 'leader@ubnd.vn', password: 'password', role: 'leader' as const, name: 'Lãnh đạo', icon: Building2, color: 'from-[#003F88] to-[#FFD700]' },
  { email: 'officer@ubnd.vn', password: 'password', role: 'officer' as const, name: 'Cán bộ', icon: Users, color: 'from-[#DA291C] via-[#003F88] to-[#FFD700]' },
  { email: 'citizen@ubnd.vn', password: 'password', role: 'citizen' as const, name: 'Công dân', icon: UserCircle2, color: 'from-[#FFD700] to-[#DA291C]' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('leader@ubnd.vn');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState<UserRole>('leader');
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
      await login(email, password, role);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setRole(acc.role);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#DA291C] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#003F88] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
            <div className="space-y-6">
              {/* Logo */}
              <div className="inline-flex items-center gap-3 animate-slide-in-left">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#DA291C] to-[#003F88] rounded-2xl flex items-center justify-center shadow-lg rotate-6 hover:rotate-12 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFD700] rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#DA291C] to-[#003F88] bg-clip-text text-transparent">
                    Smart Dashboard
                  </h1>
                  <p className="text-sm text-slate-600 font-medium">Dashboard XP</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl font-bold text-slate-800">
                  Hệ thống quản lý
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#DA291C] to-[#003F88]">
                    UBND xã/phường thông minh
                  </span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Nền tảng số hóa toàn diện với trợ lý AI, giúp quản lý hiệu quả và minh bạch mọi hoạt động của chính quyền địa phương.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
                {[
                  { icon: '🎯', title: 'KPI Thông minh', desc: 'Theo dõi hiệu suất' },
                  { icon: '📊', title: 'Báo cáo trực quan', desc: 'Biểu đồ đa dạng' },
                  { icon: '🤖', title: 'Trợ lý AI', desc: 'Hỗ trợ 24/7' },
                  { icon: '🔐', title: 'Bảo mật cao', desc: 'An toàn dữ liệu' },
                ].map((feature, index) => (
                  <div key={index} className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                    <p className="text-xs text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Card className="glass-card border-0 shadow-2xl overflow-hidden">
              {/* Card Header with Gradient */}
              <div className="relative bg-gradient-to-br from-[#DA291C] via-[#003F88] to-[#FFD700] p-8 pb-16">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/90 font-medium">Đăng nhập hệ thống</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại!</h2>
                  <p className="text-white/80">Đăng nhập để tiếp tục sử dụng hệ thống</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 -mt-8 relative">
                {/* Quick Login Pills */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <button
                        key={acc.email}
                        onClick={() => handleQuickLogin(acc)}
                        className={`relative group p-4 bg-gradient-to-br ${acc.color} rounded-xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-sm">{acc.name}</div>
                            <div className="text-xs opacity-90">Click để chọn</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-500 font-medium">Hoặc nhập thông tin</span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-shake">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 bg-slate-50 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      Mật khẩu
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 bg-slate-50 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      Vai trò
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all cursor-pointer"
                    >
                      <option value="admin">🛡️ Quản trị viên</option>
                      <option value="leader">🏛️ Lãnh đạo</option>
                      <option value="officer">👔 Cán bộ chuyên môn</option>
                      <option value="citizen">👤 Công dân</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-[#DA291C] to-[#003F88] hover:from-[#C41F15] hover:to-[#002A63] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 mt-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang đăng nhập...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Đăng nhập</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    © 2024 Smart Dashboard Dashboard - Hệ thống quản lý xã/phường thông minh
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
