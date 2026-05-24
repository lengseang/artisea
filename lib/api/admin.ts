import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { normalizeArticle, normalizeUser, toPaginatedResponse, unwrapData } from '@/lib/api/normalizers';
import type { Article } from '@/types/article';
import type { User, UserStatus } from '@/types/user';
import type { PaginatedResponse } from '@/types/common';

export async function getAdminUsers(): Promise<PaginatedResponse<User>> {
  const res = await apiClient<unknown>(API_ENDPOINTS.admin.users);
  return toPaginatedResponse<User>(res, normalizeUser);
}

export async function updateUserStatus(
  id: string,
  status: UserStatus
): Promise<User> {
  const res = await apiClient<unknown>(API_ENDPOINTS.admin.userStatus(id), {
    method: 'PATCH',
    body: { status },
  });
  return normalizeUser(unwrapData(res));
}

export async function moderateArticle(
  id: string,
  action: 'approve' | 'reject',
  reason?: string
): Promise<Article> {
  const res = await apiClient<unknown>(API_ENDPOINTS.admin.moderateArticle(id), {
    method: 'PATCH',
    body: { action, reason },
  });
  return normalizeArticle(unwrapData(res));
}
