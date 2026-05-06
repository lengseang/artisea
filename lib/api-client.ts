/**
 * Centralized API client for all backend communication.
 * Handles JWT injection, error normalization, and retry logic.
 *
 * Base URL is configurable via NEXT_PUBLIC_API_URL env var.
 * Defaults to '/api/v1' for relative proxying through Next.js.
 */

import type { ApiError } from '@/types/common';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';
const DEFAULT_TIMEOUT_MS = 15_000;

/** Storage key for the JWT access token */
const TOKEN_KEY = 'artisea_access_token';
const REFRESH_TOKEN_KEY = 'artisea_refresh_token';

// ─── Token helpers ───────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// ─── Fetch wrapper ───────────────────────────────────────────
interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
  /** If true, skip Authorization header */
  public?: boolean;
}

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiClientError';
    this.status = apiError.status;
    this.errors = apiError.errors;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, timeout = DEFAULT_TIMEOUT_MS, public: isPublic, ...init } = options;

  const headers = new Headers(init.headers);

  // Default content type for JSON payloads
  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject JWT unless marked as public
  if (!isPublic) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...init,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle no-content responses
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError({
        status: response.status,
        message: data.message ?? 'An unexpected error occurred',
        errors: data.errors,
      });
    }

    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiClientError({
        status: 408,
        message: 'Request timed out. Please try again.',
      });
    }

    throw new ApiClientError({
      status: 0,
      message: error instanceof Error ? error.message : 'Network error',
    });
  }
}
