/**
 * Common / shared types used across the ArtiSea frontend.
 */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export type SortOrder = 'asc' | 'desc';

export interface FilterParams {
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
  page?: number;
  limit?: number;
}
