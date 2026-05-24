import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth-util';
import { extractFirstImageUrl } from '@/lib/media-util';

// Helper to generate a URL-safe slug and handle collisions
async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const finalSlug = baseSlug || 'untitled';
  
  // Check if exists
  const existing = await db.article.findUnique({
    where: { slug: finalSlug }
  });
  
  if (!existing) return finalSlug;
  
  // Append a short random string on collision
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${finalSlug}-${randomStr}`;
}

// Helper to calculate read time
function calculateReadTime(text: string | null): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Helper to normalize article record for the frontend client
function normalizeDbArticle(article: any) {
  const stats = article.stats || {
    view_count: 0,
    like_count: 0,
    comment_count: 0,
    save_count: 0,
    share_count: 0,
  };

  return {
    ...article,
    view_count: stats.view_count,
    like_count: stats.like_count,
    comment_count: stats.comment_count,
    save_count: stats.save_count,
    share_count: stats.share_count,
    tags: (article.tags || []).map((t: string) => ({
      id: t,
      name: t,
      slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      usage_count: 0,
    })),
    author: {
      display_name: `Author ${article.author_id.substring(0, 5)}`,
      username: `writer_${article.author_id.substring(0, 5)}`,
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${article.author_id}`,
    },
    stats: undefined, // remove raw stats object
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10'));
    const skip = (page - 1) * limit;

    const sort = searchParams.get('sort') || 'latest';
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const author_id = searchParams.get('author_id');
    const status = searchParams.get('status') || 'published';

    // Build Prisma filters
    const where: any = {};
    if (author_id) where.author_id = author_id;
    if (status) where.status = status;
    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    let articles: any[] = [];
    let total = 0;

    // Use a try-catch for PostgreSQL full-text search with a fallback
    if (search) {
      try {
        // Try executing full-text search with ranking (casting author_id to prevent Postgres type resolution errors)
        const rawArticles: any[] = await db.$queryRaw`
          SELECT a.*, 
                 json_build_object(
                   'view_count', COALESCE(s.view_count, 0),
                   'like_count', COALESCE(s.like_count, 0),
                   'comment_count', COALESCE(s.comment_count, 0),
                   'save_count', COALESCE(s.save_count, 0),
                   'share_count', COALESCE(s.share_count, 0)
                 ) as stats
          FROM "Article" a
          LEFT JOIN "ArticleStats" s ON a.id = s.article_id
          WHERE a.search_vector @@ websearch_to_tsquery('english', ${search})
            AND (${author_id}::text IS NULL OR a.author_id = ${author_id})
            AND (a.status = ${status}::"ArticleStatus")
          ORDER BY ts_rank(a.search_vector, websearch_to_tsquery('english', ${search})) DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        const rawCount: any[] = await db.$queryRaw`
          SELECT COUNT(*)::int as count 
          FROM "Article"
          WHERE search_vector @@ websearch_to_tsquery('english', ${search})
            AND (${author_id}::text IS NULL OR author_id = ${author_id})
            AND (status = ${status}::"ArticleStatus")
        `;

        articles = rawArticles;
        total = rawCount[0]?.count || 0;
      } catch (err) {
        console.warn("Full-text search trigger not active or failed, falling back to contains filter:", err);
        // Fallback: standard prisma contains query
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { content_text: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    // If search wasn't executed or fell back
    if (!search || articles.length === 0) {
      const orderBy: any = {};
      if (sort === 'oldest') {
        orderBy.created_at = 'asc';
      } else if (sort === 'popular') {
        orderBy.stats = {
          view_count: 'desc',
        };
      } else {
        orderBy.created_at = 'desc'; // latest
      }

      articles = await db.article.findMany({
        where,
        include: { stats: true },
        orderBy,
        skip,
        take: limit,
      });

      total = await db.article.count({ where });
    }

    const normalized = articles.map(normalizeDbArticle);

    return NextResponse.json({
      data: normalized,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    console.error("GET Articles Error:", error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authorId = getUserIdFromRequest(request);
    const body = await request.json();

    const { title, content, excerpt, cover_image, tags = [], visibility = 'public' } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    // Extract plain text if content is a Tiptap JSON structure
    let contentText = '';
    let parsedContent: any = null;

    if (content) {
      if (typeof content === 'string') {
        try {
          parsedContent = JSON.parse(content);
        } catch {
          // If it is just a string, store it as a fallback structure or text
          parsedContent = { type: 'doc', content: [{ type: 'paragraph', text: content }] };
          contentText = content;
        }
      } else {
        parsedContent = content;
      }

      // If we parsed the Tiptap document, let's extract the plain text for search
      if (parsedContent && parsedContent.content) {
        const extractText = (node: any): string => {
          if (node.text) return node.text;
          if (node.content) return node.content.map(extractText).join(' ');
          return '';
        };
        contentText = extractText(parsedContent).trim().replace(/\s+/g, ' ');
      }
    }

    const readTime = calculateReadTime(contentText);

    // Create the article and initialize its 1:1 stats
    const article = await db.article.create({
      data: {
        author_id: authorId,
        title,
        slug,
        excerpt: excerpt || null,
        content: parsedContent,
        content_text: contentText || null,
        cover_image: cover_image || extractFirstImageUrl(parsedContent) || null,
        status: 'draft', // defaults to draft
        visibility,
        read_time_minutes: readTime,
        tags,
        stats: {
          create: {
            view_count: 0,
            like_count: 0,
            comment_count: 0,
            save_count: 0,
            share_count: 0,
          }
        }
      },
      include: {
        stats: true,
      }
    });

    return NextResponse.json({
      data: normalizeDbArticle(article),
      message: 'Article draft created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Article Error:", error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
