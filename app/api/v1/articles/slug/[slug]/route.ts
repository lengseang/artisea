import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await db.article.findUnique({
      where: { slug },
      include: { stats: true }
    });

    if (!article) {
      return NextResponse.json({ message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ data: normalizeDbArticle(article) });
  } catch (error: any) {
    console.error("GET Article By Slug Error:", error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
