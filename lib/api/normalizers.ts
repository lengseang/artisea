import type { Article, Tag } from '@/types/article';
import type { Author } from '@/types/author';
import type { PaginatedResponse } from '@/types/common';
import type { User } from '@/types/user';

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function getNested(record: AnyRecord, path: string[]): unknown {
  return path.reduce<unknown>((current, key) => {
    if (!isRecord(current)) return undefined;
    return current[key];
  }, record);
}

export function unwrapData<T>(payload: unknown): T {
  if (isRecord(payload) && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export function unwrapList<T>(payload: unknown): T[] {
  const data = unwrapData<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  if (isRecord(data) && Array.isArray(data.items)) return data.items as T[];
  if (isRecord(data) && Array.isArray(data.results)) return data.results as T[];
  return [];
}

export function toPaginatedResponse<T>(
  payload: unknown,
  mapper: (item: unknown) => T
): PaginatedResponse<T> {
  const container = isRecord(payload) && 'data' in payload ? payload : undefined;
  const rawData = container ? container.data : payload;
  const nested = isRecord(rawData) ? rawData : undefined;
  const source = Array.isArray(rawData)
    ? rawData
    : Array.isArray(nested?.items)
      ? nested.items
      : Array.isArray(nested?.results)
        ? nested.results
        : [];

  return {
    data: source.map(mapper),
    total: asNumber(container?.total ?? nested?.total, source.length),
    page: asNumber(container?.page ?? nested?.page, 1),
    limit: asNumber(container?.limit ?? nested?.limit, source.length),
  };
}

export function normalizeTag(value: unknown): Tag {
  const tag = isRecord(value) ? value : {};
  return {
    id: asString(tag.id ?? tag.slug),
    name: asString(tag.name ?? tag.title ?? tag.slug, 'Untagged'),
    slug: asString(tag.slug ?? tag.name),
    usage_count: asNumber(tag.usage_count ?? tag.usageCount),
  };
}

export function normalizeAuthor(value: unknown): Author {
  const user = isRecord(value) ? value : {};
  const profile = isRecord(user.profile) ? user.profile : user;
  const displayName =
    profile.display_name ??
    profile.displayName ??
    user.display_name ??
    user.displayName ??
    user.name ??
    user.username;

  return {
    id: asString(user.id ?? profile.user_id ?? profile.userId),
    name: asString(displayName, 'Unknown author'),
    username: asString(user.username ?? profile.username),
    bio: asNullableString(profile.bio),
    avatar_url: asNullableString(profile.avatar_url ?? profile.avatarUrl),
    cover_image_url: asNullableString(profile.cover_image_url ?? profile.coverImageUrl),
    location: asNullableString(profile.location),
    social_links: isRecord(profile.social_links)
      ? (profile.social_links as Record<string, string>)
      : isRecord(profile.socialLinks)
        ? (profile.socialLinks as Record<string, string>)
        : null,
    is_featured: Boolean(profile.is_featured ?? profile.isFeatured),
    follower_count: asNumber(profile.follower_count ?? profile.followerCount),
    following_count: asNumber(profile.following_count ?? profile.followingCount),
    article_count: asNumber(profile.article_count ?? profile.articleCount),
  };
}

export function normalizeArticle(value: unknown): Article {
  const article = isRecord(value) ? value : {};
  const authorSource = article.author ?? article.user ?? getNested(article, ['profile', 'user']);
  const author = isRecord(authorSource) ? normalizeAuthor(authorSource) : null;

  return {
    id: asString(article.id),
    author_id: asString(article.author_id ?? article.authorId ?? author?.id),
    agent_id: asNullableString(article.agent_id ?? article.agentId),
    title: asString(article.title, 'Untitled'),
    slug: asString(article.slug ?? article.id),
    excerpt: asNullableString(article.excerpt ?? article.description),
    content: typeof article.content === 'string' ? article.content : null,
    content_text: asNullableString(article.content_text ?? article.contentText),
    cover_image: asNullableString(article.cover_image ?? article.coverImage ?? article.cover_image_url),
    status: asString(article.status, 'draft') as Article['status'],
    visibility: asString(article.visibility, 'public') as Article['visibility'],
    is_verified: Boolean(article.is_verified ?? article.isVerified),
    verified_at: asNullableString(article.verified_at ?? article.verifiedAt),
    published_at: asNullableString(article.published_at ?? article.publishedAt),
    read_time_minutes: asNumber(article.read_time_minutes ?? article.readTimeMinutes),
    view_count: asNumber(article.view_count ?? article.viewCount),
    like_count: asNumber(article.like_count ?? article.likeCount),
    comment_count: asNumber(article.comment_count ?? article.commentCount),
    save_count: asNumber(article.save_count ?? article.saveCount),
    share_count: asNumber(article.share_count ?? article.shareCount),
    created_at: asString(article.created_at ?? article.createdAt),
    updated_at: asString(article.updated_at ?? article.updatedAt),
    auto_saved_at: asNullableString(article.auto_saved_at ?? article.autoSavedAt),
    author: author
      ? {
          display_name: author.name,
          username: author.username,
          avatar_url: author.avatar_url,
        }
      : undefined,
    tags: Array.isArray(article.tags) ? article.tags.map(normalizeTag) : undefined,
  };
}

export function normalizeUser(value: unknown): User {
  const user = isRecord(value) ? value : {};
  return {
    id: asString(user.id),
    email: asString(user.email),
    username: asString(user.username),
    role: asString(user.role, 'reader') as User['role'],
    status: asString(user.status, 'active') as User['status'],
    email_verified: Boolean(user.email_verified ?? user.emailVerified),
    last_login_at: asNullableString(user.last_login_at ?? user.lastLoginAt),
    created_at: asString(user.created_at ?? user.createdAt),
    updated_at: asString(user.updated_at ?? user.updatedAt),
    profile: isRecord(user.profile)
      ? {
          id: asString(user.profile.id),
          user_id: asString(user.profile.user_id ?? user.profile.userId ?? user.id),
          display_name: normalizeAuthor(user).name,
          bio: asNullableString(user.profile.bio),
          avatar_url: asNullableString(user.profile.avatar_url ?? user.profile.avatarUrl),
          cover_image_url: asNullableString(user.profile.cover_image_url ?? user.profile.coverImageUrl),
          social_links: isRecord(user.profile.social_links)
            ? (user.profile.social_links as Record<string, string>)
            : null,
          location: asNullableString(user.profile.location),
          is_featured: Boolean(user.profile.is_featured ?? user.profile.isFeatured),
          follower_count: asNumber(user.profile.follower_count ?? user.profile.followerCount),
          following_count: asNumber(user.profile.following_count ?? user.profile.followingCount),
          article_count: asNumber(user.profile.article_count ?? user.profile.articleCount),
          created_at: asString(user.profile.created_at ?? user.profile.createdAt),
          updated_at: asString(user.profile.updated_at ?? user.profile.updatedAt),
        }
      : undefined,
  };
}
