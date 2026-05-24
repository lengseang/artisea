/**
 * Auth API service — login, register, logout, refresh.
 * Endpoints from SRS §9.1
 */

import { apiClient, setTokens, clearTokens, getRefreshToken } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { unwrapData } from '@/lib/api/normalizers';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api';

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>(API_ENDPOINTS.auth.login, {
    method: 'POST',
    body: credentials,
    public: true,
  });
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>(API_ENDPOINTS.auth.register, {
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
    const data = await apiClient<AuthResponse>(API_ENDPOINTS.auth.refresh, {
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

export async function getCurrentUser(): Promise<AuthResponse['user']> {
  const data = await apiClient<unknown>(API_ENDPOINTS.auth.me);
  return unwrapData<AuthResponse['user']>(data);
}

export async function logout(): Promise<void> {
  try {
    await apiClient<void>(API_ENDPOINTS.auth.logout, { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export function logoutLocal(): void {
  clearTokens();
}
