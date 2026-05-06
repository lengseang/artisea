/**
 * Articles API service — CRUD + status changes.
 * Endpoints from SRS §9.2
 */

import { apiClient } from '@/lib/api-client';
import type { Article } from '@/types/article';
import type { PaginatedResponse, ApiResponse } from '@/types/common';
import type {
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleStatusRequest,
  ArticleListParams,
} from '@/types/api';

export async function getArticles(
  params?: ArticleListParams
): Promise<PaginatedResponse<Article>> {
  const query = params ? '?' + new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString() : '';

  return apiClient<PaginatedResponse<Article>>(`/articles${query}`, { public: true });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const res = await apiClient<ApiResponse<Article>>(`/articles/${slug}`, { public: true });
  return res.data;
}

export async function getArticleById(id: string): Promise<Article> {
  const res = await apiClient<ApiResponse<Article>>(`/articles/${id}`);
  return res.data;
}

export async function createArticle(payload: ArticleCreateRequest): Promise<Article> {
  const res = await apiClient<ApiResponse<Article>>('/articles', {
    method: 'POST',
    body: payload,
  });
  return res.data;
}

export async function updateArticle(
  id: string,
  payload: ArticleUpdateRequest
): Promise<Article> {
  const res = await apiClient<ApiResponse<Article>>(`/articles/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return res.data;
}

export async function updateArticleStatus(
  id: string,
  payload: ArticleStatusRequest
): Promise<Article> {
  const res = await apiClient<ApiResponse<Article>>(`/articles/${id}/status`, {
    method: 'PATCH',
    body: payload,
  });
  return res.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await apiClient<void>(`/articles/${id}`, { method: 'DELETE' });
}
