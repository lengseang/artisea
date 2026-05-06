/**
 * Notification entity types — mirrors the NOTIFICATIONS table
 * from the ArtiSea ERD.
 */

export type NotificationType =
  | 'new_follower'
  | 'article_liked'
  | 'article_commented'
  | 'article_saved'
  | 'article_shared'
  | 'article_published'
  | 'mention';

export type ReferenceType = 'article' | 'comment' | 'user';

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  reference_id: string | null;
  reference_type: ReferenceType | null;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  /** Populated via join */
  actor?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
}
