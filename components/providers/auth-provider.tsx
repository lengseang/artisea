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
import * as apiAuth from '@/lib/api/auth';

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
    const data = await apiAuth.login(credentials);
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      role: data.user.role,
      display_name: data.user.profile.display_name,
      avatar_url: data.user.profile.avatar_url,
    };
    setUser(authUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const data = await apiAuth.register(payload);
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      role: data.user.role,
      display_name: data.user.profile.display_name,
      avatar_url: data.user.profile.avatar_url,
    };
    setUser(authUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
  }, []);

  const logout = useCallback(() => {
    apiAuth.logout();
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
