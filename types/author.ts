/**
 * Author / Profile display types — used across components.
 * Built from the PROFILES and USERS tables in the ERD.
 */

export interface Author {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  location: string | null;
  social_links: Record<string, string> | null;
  is_featured: boolean;
  follower_count: number;
  following_count: number;
  article_count: number;
}