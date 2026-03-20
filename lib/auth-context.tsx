'use client';

import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'leader' | 'officer' | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
  'admin@ubnd.vn': {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@ubnd.vn',
    role: 'admin',
    avatar: '👤',
  },
  'leader@ubnd.vn': {
    id: '2',
    name: 'Trần Thị Lãnh Đạo',
    email: 'leader@ubnd.vn',
    role: 'leader',
    department: 'Chủ tịch UBND',
    avatar: '👨‍💼',
  },
  'officer@ubnd.vn': {
    id: '3',
    name: 'Lê Văn Cán Bộ',
    email: 'officer@ubnd.vn',
    role: 'officer',
    department: 'Địa chính - Xây dựng',
    avatar: '👨‍💻',
  },
  'citizen@ubnd.vn': {
    id: '4',
    name: 'Phạm Công Dân',
    email: 'citizen@ubnd.vn',
    role: 'citizen',
    avatar: '👤',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string, role: UserRole) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.role === role) {
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
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
