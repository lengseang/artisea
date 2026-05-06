/**
 * API request / response contract types.
 * Follows the RESTful endpoints from the ArtiSea SRS §9.
 */

import type { UserRole } from './user';

// ─── Auth ────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  display_name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    profile: {
      display_name: string;
      avatar_url: string | null;
    };
  };
}


export interface RefreshTokenRequest {
  refresh_token: string;
}

// ─── Articles ────────────────────────────────────────────────
export interface ArticleCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
}

export interface ArticleUpdateRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  cover_image?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted' | 'private';
}

export interface ArticleStatusRequest {
  status: 'draft' | 'ready_to_publish' | 'published' | 'archived';
}

export interface ArticleListParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'popular' | 'oldest';
  tag?: string;
  search?: string;
  author_id?: string;
  status?: string;
}

// ─── Interactions ────────────────────────────────────────────
export interface InteractRequest {
  type: 'like' | 'save' | 'share';
}

export interface CommentRequest {
  content: string;
  parent_id?: string;
}

// ─── Profile ─────────────────────────────────────────────────
export interface ProfileUpdateRequest {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  social_links?: Record<string, string>;
  location?: string;
}

// ─── Search ──────────────────────────────────────────────────
export interface SearchParams {
  q: string;
  type?: 'articles' | 'authors' | 'tags';
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'latest' | 'popular';
  tag?: string;
  date_from?: string;
  date_to?: string;
}
