'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'parent' | 'daycare';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, type: 'parent' | 'daycare') => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        // Redirect if on auth pages while logged in
        if (pathname.startsWith('/auth/') && pathname !== '/auth/logout') {
          router.push(data.user.type === 'daycare' ? '/daycare/dashboard' : '/dashboard');
        }
      } else {
        setUser(null);
        // Redirect to login if on protected routes
        if (!pathname.startsWith('/auth/') && pathname !== '/') {
          router.push('/auth/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const login = async (email: string, password: string, type: 'parent' | 'daycare') => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, type }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);

      // Redirect based on user type
      if (data.user.type === 'daycare') {
        router.push('/daycare/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        router.push('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state on error
      setUser(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 