'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, clearAccessToken, setAccessToken, type AuthUserPayload } from '@/lib/api';

export type UserRole = 'admin' | 'leader' | 'officer' | 'citizen';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    identifier: string,
    password: string,
    expectedRole?: UserRole,
  ) => Promise<{ requiresVerification?: boolean; email?: string; message?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_CACHE_KEY = 'dashboardxp_user';
const FRONTEND_AUTH_ONLY = false;

const FRONTEND_USER_PRESETS: Record<UserRole, Omit<User, 'avatar' | 'role'>> = {
  admin: {
    id: 'fe-admin-1',
    username: 'admin',
    name: 'Quản trị viên (Frontend)',
    email: 'admin@frontend.local',
    department: 'Quản trị hệ thống',
  },
  leader: {
    id: 'fe-leader-1',
    username: 'leader',
    name: 'Lãnh đạo (Frontend)',
    email: 'leader@frontend.local',
    department: 'Lãnh đạo UBND',
  },
  officer: {
    id: 'fe-officer-1',
    username: 'officer',
    name: 'Cán bộ (Frontend)',
    email: 'officer@frontend.local',
    department: 'Khối chuyên môn',
  },
  citizen: {
    id: 'fe-citizen-1',
    username: 'citizen',
    name: 'Công dân (Frontend)',
    email: 'citizen@frontend.local',
    department: 'Người dân',
  },
};

function mapRole(roleId: number | null | undefined): UserRole {
  if (roleId === 1) return 'admin';
  if (roleId === 2) return 'leader';
  if (roleId === 3) return 'officer';
  return 'citizen';
}

function resolveRoleId(user: AuthUserPayload): number | null {
  const rawRole =
    user.roleId ??
    user.role ??
    (user as Record<string, unknown>).MaVaiTro ??
    (user as Record<string, unknown>).role_id;

  if (rawRole === null || rawRole === undefined) {
    return null;
  }

  const parsed = Number(rawRole);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveUserId(user: AuthUserPayload): string {
  const rawId =
    user.id ??
    user.userId ??
    (user as Record<string, unknown>).MaNguoiDung ??
    (user as Record<string, unknown>).user_id;

  if (rawId === null || rawId === undefined) {
    return '0';
  }

  const parsed = Number(rawId);
  return Number.isFinite(parsed) ? String(parsed) : String(rawId);
}

function toAppUser(user: AuthUserPayload): User {
  const resolvedRoleId = resolveRoleId(user);
  const fullName = user.fullName?.trim() || user.username || 'Nguoi dung';

  // Generate avatar from first letters of name
  const names = fullName.trim().split(/\s+/);
  const avatar = names.map(n => n[0]).join('').toUpperCase().slice(0, 2) || '👤';
  
  return {
    id: resolveUserId(user),
    username: user.username,
    name: fullName,
    email: user.email,
    role: mapRole(resolvedRoleId),
    avatar,
  };
}

function inferRoleFromIdentifier(identifier: string): UserRole {
  const normalized = identifier.trim().toLowerCase();
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('leader')) return 'leader';
  if (normalized.includes('officer') || normalized.includes('canbo')) return 'officer';
  return 'citizen';
}

function buildFrontendUser(identifier: string, expectedRole?: UserRole): User {
  const role = expectedRole ?? inferRoleFromIdentifier(identifier);
  const preset = FRONTEND_USER_PRESETS[role];
  const username = identifier.trim() || preset.username;
  const name = role === 'citizen' && identifier.trim() ? `${identifier.trim()} (Frontend)` : preset.name;

  return {
    ...preset,
    username,
    name,
    role,
    avatar: name
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U',
  };
}

export function isFrontendAuthOnlyEnabled() {
  return FRONTEND_AUTH_ONLY;
}

function cacheUser(user: User | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(USER_CACHE_KEY);
    return;
  }

  window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser);
    cacheUser(nextUser);
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const cachedUser = window.localStorage.getItem(USER_CACHE_KEY);
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser) as User;
            if (isMounted) {
              setUserState(parsed);
            }
          } catch {
            window.localStorage.removeItem(USER_CACHE_KEY);
          }
        }
      }

      if (FRONTEND_AUTH_ONLY) {
        clearAccessToken();
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      const me = await authApi.me();
      if (me?.data) {
        const appUser = toAppUser(me.data);
        if (isMounted) {
          setUser(appUser);
        }
      } else {
        clearAccessToken();
        if (isMounted) {
          setUser(null);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (identifier: string, password: string, expectedRole?: UserRole) => {
    setIsLoading(true);

    try {
      if (FRONTEND_AUTH_ONLY) {
        if (!identifier.trim() || !password.trim()) {
          throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu');
        }

        const frontendUser = buildFrontendUser(identifier, expectedRole);
        setUser(frontendUser);
        clearAccessToken();

        return {
          requiresVerification: false,
          message: 'Đăng nhập frontend-only thành công',
        };
      }

      const response = await authApi.login(identifier, password);
      const verificationPayload = response?.data as {
        requiresVerification?: boolean;
        email?: string;
        message?: string;
      };

      if (response?.success && verificationPayload?.requiresVerification) {
        clearAccessToken();
        setUser(null);
        return {
          requiresVerification: true,
          email: verificationPayload.email,
          message: verificationPayload.message,
        };
      }

      const accessToken = response?.data?.accessToken;
      const payloadUser = response?.data?.user;

      if (!response?.success || !accessToken || !payloadUser) {
        throw new Error(response?.message || response?.error || 'Đăng nhập thất bại');
      }

      const appUser = toAppUser(payloadUser);

      if (expectedRole && appUser.role !== expectedRole) {
        throw new Error('Tài khoản không đúng vai trò đã chọn');
      }

      setAccessToken(accessToken);
      setUser(appUser);
      return { requiresVerification: false };
    } catch (error) {
      clearAccessToken();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (FRONTEND_AUTH_ONLY) {
      clearAccessToken();
      setUser(null);
      return;
    }

    try {
      await authApi.logout();
    } catch {
      // no-op
    }

    clearAccessToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isLoading, login, logout, setUser }),
    [user, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
