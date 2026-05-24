/**
 * Articles API service — CRUD + status changes.
 * Endpoints from SRS §9.2
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { normalizeArticle, toPaginatedResponse, unwrapData } from '@/lib/api/normalizers';
import type { Article } from '@/types/article';
import type { PaginatedResponse } from '@/types/common';
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

  const res = await apiClient<unknown>(`${API_ENDPOINTS.articles.list}${query}`, {
    public: true,
  });
  return toPaginatedResponse<Article>(res, normalizeArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const res = await apiClient<unknown>(API_ENDPOINTS.articles.bySlug(slug), {
    public: true,
  });
  return normalizeArticle(unwrapData(res));
}

export async function getArticleById(id: string): Promise<Article> {
  const res = await apiClient<unknown>(API_ENDPOINTS.articles.byId(id));
  return normalizeArticle(unwrapData(res));
}

export async function createArticle(payload: ArticleCreateRequest): Promise<Article> {
  const res = await apiClient<unknown>(API_ENDPOINTS.articles.list, {
    method: 'POST',
    body: payload,
  });
  return normalizeArticle(unwrapData(res));
}

export async function updateArticle(
  id: string,
  payload: ArticleUpdateRequest
): Promise<Article> {
  const res = await apiClient<unknown>(API_ENDPOINTS.articles.byId(id), {
    method: 'PATCH',
    body: payload,
  });
  return normalizeArticle(unwrapData(res));
}

export async function updateArticleStatus(
  id: string,
  payload: ArticleStatusRequest
): Promise<Article> {
  if (payload.status !== 'published') {
    const res = await apiClient<unknown>(API_ENDPOINTS.articles.byId(id), {
      method: 'PATCH',
      body: payload,
    });
    return normalizeArticle(unwrapData(res));
  }

  const res = await apiClient<unknown>(API_ENDPOINTS.articles.publish(id), {
    method: 'POST',
  });
  return normalizeArticle(unwrapData(res));
}

export async function deleteArticle(id: string): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.articles.byId(id), { method: 'DELETE' });
}

export async function getMyDraftArticles(): Promise<PaginatedResponse<Article>> {
  const res = await apiClient<unknown>(API_ENDPOINTS.articles.drafts);
  return toPaginatedResponse<Article>(res, normalizeArticle);
}

export async function publishArticle(id: string): Promise<Article> {
  const res = await apiClient<unknown>(API_ENDPOINTS.articles.publish(id), {
    method: 'POST',
  });
  return normalizeArticle(unwrapData(res));
}

export async function recordArticleView(id: string): Promise<void> {
  await apiClient<void>(API_ENDPOINTS.articles.view(id), {
    method: 'POST',
    public: true,
  });
}
