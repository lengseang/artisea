'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { LoginRequest, RegisterRequest } from '@/types/api';
import type { UserRole } from '@/types/user';

// ─── Types ───────────────────────────────────────────────────
interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  display_name: string;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

// ─── Context ─────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = 'artisea_user';

// ─── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    // Simulate delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Static validation for demo
    if (credentials.email === 'bob@artisea.com' && credentials.password === 'password123') {
      const authUser: AuthUser = {
        id: 'u123',
        email: 'bob@artisea.com',
        username: 'bob_the_writer',
        role: 'author' as UserRole,
        display_name: 'Bob the Writer',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      };
      setUser(authUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      return;
    }

    if (credentials.email === 'admin@artisea.com' && credentials.password === 'admin123') {
      const authUser: AuthUser = {
        id: 'u001',
        email: 'admin@artisea.com',
        username: 'admin',
        role: 'admin' as UserRole,
        display_name: 'ArtiSea Admin',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      };
      setUser(authUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      return;
    }

    throw new Error('Invalid email or password. Hint: bob@artisea.com / password123');
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const authUser: AuthUser = {
      id: `u${Math.floor(Math.random() * 1000)}`,
      email: payload.email,
      username: payload.username,
      role: 'author' as UserRole,
      display_name: payload.display_name,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.username}`,
    };
    setUser(authUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      hasRole,
    }),
    [user, isLoading, login, register, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
