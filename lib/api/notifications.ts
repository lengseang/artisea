import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Notification } from '@/types/notification';
import type { PaginatedResponse, ApiResponse } from '@/types/common';

export async function getNotifications(): Promise<PaginatedResponse<Notification>> {
  return apiClient<PaginatedResponse<Notification>>(API_ENDPOINTS.notifications.list);
}

export async function getLatestUserNotifications(): Promise<Notification[]> {
  const res = await apiClient<ApiResponse<Notification[]>>(API_ENDPOINTS.users.notifications);
  return res?.data ?? [];
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.notifications.read(id), { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.users.markNotificationsRead, { method: 'PATCH' });
}
