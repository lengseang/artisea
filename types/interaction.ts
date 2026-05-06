/**
 * Interaction entity types — mirrors the INTERACTIONS, FOLLOWS,
 * and SAVED_ARTICLES tables from the ArtiSea ERD.
 */

export type InteractionType = 'like' | 'comment' | 'save' | 'share';

export interface Interaction {
  id: string;
  article_id: string;
  user_id: string;
  type: InteractionType;
  /** Only populated for comments */
  content: string | null;
  /** Parent comment ID for threaded replies */
  parent_id: string | null;
  created_at: string;
}

/** Alias for comment-type interactions with required content */
export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  type: 'comment';
  content: string;
  parent_id: string | null;
  created_at: string;
  /** Populated via join — not stored on INTERACTIONS table */
  author?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface SavedArticle {
  id: string;
  user_id: string;
  article_id: string;
  folder_name: string | null;
  created_at: string;
}
