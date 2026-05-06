/**
 * Article entity types — mirrors the ARTICLES, ARTICLE_MEDIA,
 * TAGS, ARTICLE_TAGS, and DRAFT_VERSIONS tables from the ArtiSea ERD.
 */

export type ArticleStatus = 'draft' | 'ready_to_publish' | 'published' | 'archived' | 'under_review';

export type ArticleVisibility = 'public' | 'unlisted' | 'private';

export interface Article {
  id: string;
  author_id: string;
  agent_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  content_text: string | null;
  cover_image: string | null;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  is_verified: boolean;
  verified_at: string | null;
  published_at: string | null;
  read_time_minutes: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  save_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  auto_saved_at: string | null;
  /** Populated via join */
  author?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
  /** Populated via join */
  tags?: Tag[];
}

export interface ArticleMedia {
  id: string;
  article_id: string;
  file_name: string;
  original_url: string;
  optimized_url: string | null;
  thumbnail_url: string | null;
  file_type: string;
  file_size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
}

export interface DraftVersion {
  id: string;
  article_id: string;
  content: Record<string, unknown>;
  content_text: string | null;
  version_number: number;
  saved_at: string;
}
