'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  PenSquare, 
  Eye, 
  Heart, 
  Users, 
  FileText, 
  Trash2, 
  Edit3, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { AgentView } from '@/components/dashboard/agent-view';
import { SocialLayout } from '@/components/layout/social-layout';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardArticle {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'archived';
  date: string;
  excerpt: string;
  view_count: number;
  like_count: number;
}

const MOCK_ARTICLES: DashboardArticle[] = [
  {
    id: '1',
    title: 'The Future of Collaborative Writing',
    status: 'published',
    date: '2024-03-15',
    excerpt: 'How modern tools are reshaping the way writers work together.',
    view_count: 1240,
    like_count: 48,
  },
  {
    id: '2',
    title: 'On Craft: Finding Your Voice',
    status: 'draft',
    date: '2024-03-20',
    excerpt: 'Practical exercises to help you discover your unique style.',
    view_count: 0,
    like_count: 0,
  },
  {
    id: '3',
    title: 'Long-form Journalism in the Digital Age',
    status: 'published',
    date: '2024-03-10',
    excerpt: 'Exploring the resurgence of deep narrative-driven reporting.',
    view_count: 2100,
    like_count: 92,
  },
];

const STATUS_BADGE_MAP: Record<DashboardArticle['status'], 'success' | 'warning' | 'muted'> = {
  published: 'success',
  draft: 'warning',
  archived: 'muted',
};

const TAB_ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
];

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-50" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [articles, setArticles] = useState<DashboardArticle[]>([...MOCK_ARTICLES]);
  const [activeTab, setActiveTab] = useState('all');

  const isAgentView = user?.role === 'agent' && searchParams.get('view') === 'agent';

  const filteredArticles =
    activeTab === 'all' ? articles : articles.filter((a) => a.status === activeTab);

  const totalViews = articles.reduce((sum, a) => sum + a.view_count, 0);
  const totalLikes = articles.reduce((sum, a) => sum + a.like_count, 0);
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <SocialLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <PageHeader
            title={isAgentView ? 'Agent Manager' : 'Dashboard'}
            description={isAgentView ? 'Manage assigned authors and verify content.' : 'Manage your articles and track performance.'}
            className="mb-0"
          />
          
          <div className="flex items-center gap-3">
            {user?.role === 'agent' && (
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mr-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                    !isAgentView ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Author
                </button>
                <button
                  onClick={() => router.push('/dashboard?view=agent')}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                    isAgentView ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Agent
                </button>
              </div>
            )}
            
            {!isAgentView && (
              <button
                onClick={() => router.push('/write')}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity"
              >
                <PenSquare className="h-4 w-4" />
                New Article
              </button>
            )}
          </div>
        </div>

        {isAgentView ? (
          <AgentView />
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={FileText} label="Published" value={publishedCount} />
              <StatCard icon={Edit3} label="Drafts" value={draftCount} />
              <StatCard icon={Eye} label="Total Views" value={totalViews} />
              <StatCard icon={Heart} label="Total Likes" value={totalLikes} />
            </div>

            {/* Tabs */}
            <Tabs items={TAB_ITEMS} value={activeTab} onChange={setActiveTab} />

            {/* Articles List */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
              {filteredArticles.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No articles here"
                  description={
                    activeTab === 'all'
                      ? 'Click "New Article" to start writing your first piece.'
                      : `No ${activeTab} articles found.`
                  }
                />
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredArticles.map((article) => (
                    <li
                      key={article.id}
                      className="flex items-start justify-between gap-4 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {article.title}
                          </p>
                          <Badge variant={STATUS_BADGE_MAP[article.status]}>
                            {article.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-zinc-400 dark:text-zinc-600">
                          <span>{article.date}</span>
                          {article.status === 'published' && (
                            <>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.view_count.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {article.like_count}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => router.push(`/write?id=${article.id}`)}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </SocialLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-2 text-zinc-600 dark:text-zinc-400">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {value.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
