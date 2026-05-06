/**
 * Auth API service — login, register, logout, refresh.
 * Endpoints from SRS §9.1
 */

import { apiClient, setTokens, clearTokens, getRefreshToken } from '@/lib/api-client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api';

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    public: true,
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    public: true,
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function refreshAccessToken(): Promise<AuthResponse | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const data = await apiClient<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      public: true,
    });
    setTokens(data.access_token, data.refresh_token);
    return data;
  } catch {
    clearTokens();
    return null;
  }
}

export function logout(): void {
  clearTokens();
}
