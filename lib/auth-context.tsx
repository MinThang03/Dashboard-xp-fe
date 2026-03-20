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

function mapRole(roleId: number): UserRole {
  if (roleId === 1) return 'admin';
  if (roleId === 2) return 'leader';
  if (roleId === 3) return 'officer';
  return 'citizen';
}

function toAppUser(user: AuthUserPayload): User {
  // Generate avatar from first letters of name
  const names = user.fullName.trim().split(/\s+/);
  const avatar = names.map(n => n[0]).join('').toUpperCase().slice(0, 2) || '👤';
  
  return {
    id: String(user.id),
    username: user.username,
    name: user.fullName,
    email: user.email,
    role: mapRole(user.roleId),
    avatar,
  };
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
