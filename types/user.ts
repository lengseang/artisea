/**
 * User entity types — mirrors the USERS, PROFILES, AGENT_PROFILES,
 * and AGENT_ASSIGNMENTS tables from the ArtiSea ERD.
 */

export type UserRole = 'reader' | 'author' | 'agent' | 'admin' | 'offline_owner';

export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'deactivated';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  /** Populated on fetch — not stored on USERS table */
  profile?: Profile;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  social_links: Record<string, string> | null;
  location: string | null;
  is_featured: boolean;
  follower_count: number;
  following_count: number;
  article_count: number;
  created_at: string;
  updated_at: string;
}

export interface AgentProfile {
  id: string;
  user_id: string;
  agency_name: string;
  license_number: string;
  is_verified: boolean;
  max_clients: number;
  created_at: string;
}

export type AssignmentStatus = 'active' | 'pending' | 'revoked';

export interface AgentAssignment {
  id: string;
  agent_id: string;
  owner_id: string;
  offline_owner_email: string | null;
  offline_owner_name: string | null;
  status: AssignmentStatus;
  permissions: Record<string, boolean>;
  assigned_at: string;
  revoked_at: string | null;
}
