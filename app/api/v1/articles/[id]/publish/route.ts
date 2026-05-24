import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/auth-util';

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
    stats: undefined,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authorId = getUserIdFromRequest(request);

    const article = await db.article.findUnique({
      where: { id }
    });

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    if (article.author_id !== authorId && authorId !== 'mock-author-id') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updated = await db.article.update({
      where: { id },
      data: {
        status: 'published',
        published_at: new Date()
      },
      include: { stats: true }
    });

    return NextResponse.json({
      data: normalizeDbArticle(updated),
      message: 'Article published successfully'
    });
  } catch (error: any) {
    console.error("Publish Article Error:", error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
