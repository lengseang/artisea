'use client';

import { useEffect, useState, type ComponentType, type SVGProps } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { 
  Users, 
  FileCheck, 
  ClipboardList, 
  Bot,
  Brain,
  ExternalLink, 
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { getAdminUsers } from '@/lib/api/admin';
import type { User } from '@/types/user';

interface ManagedAuthor {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  article_count: number;
  status: 'active' | 'pending' | 'revoked';
  last_activity: string;
}

function toManagedAuthor(user: User): ManagedAuthor {
  return {
    id: user.id,
    display_name: user.profile?.display_name ?? user.username,
    username: user.username,
    avatar_url: user.profile?.avatar_url ?? null,
    article_count: user.profile?.article_count ?? 0,
    status:
      user.status === 'pending_verification'
        ? 'pending'
        : user.status === 'active'
          ? 'active'
          : 'revoked',
    last_activity: user.last_login_at ?? user.updated_at ?? user.created_at,
  };
}

export function AgentView() {
  const [authors, setAuthors] = useState<ManagedAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAdminUsers()
      .then((response) => {
        setAuthors(response.data.map(toManagedAuthor));
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load managed users from the API.'
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const pendingCount = authors.filter((author) => author.status === 'pending').length;
  const activeCount = authors.filter((author) => author.status === 'active').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Agent Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          icon={Users} 
          label="Managed Owners" 
          value={authors.length}
          subtext="Accounts available for agent-assisted work"
        />
        <StatCard 
          icon={FileCheck} 
          label="Pending Review" 
          value={pendingCount}
          subtext="Items that should stay behind approval gates"
          trend="warning"
        />
        <StatCard 
          icon={ClipboardList} 
          label="Active Owners" 
          value={activeCount}
          subtext="Profiles currently ready for execution"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Authors List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Managed Owners</h3>
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              View All
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
            {errorMessage && (
              <div className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                {errorMessage}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                    <th className="px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Author</th>
                    <th className="px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Articles</th>
                    <th className="px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Last Activity</th>
                    <th className="px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-zinc-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : authors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8">
                        <EmptyState
                          icon={Users}
                          title="No managed users"
                          description="The API did not return users for this view."
                        />
                      </td>
                    </tr>
                  ) : authors.map((author) => (
                    <tr key={author.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={author.avatar_url} alt={author.display_name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{author.display_name}</p>
                            <p className="text-xs text-zinc-500">@{author.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={author.status === 'active' ? 'success' : author.status === 'pending' ? 'warning' : 'muted'}>
                          {author.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {author.article_count}
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-500">
                        {author.last_activity}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Workflow Suggestions (Sidebar) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Workflow Suggestions</h3>
          <div className="space-y-3">
            <SuggestionCard
              icon={Bot}
              title="Add Planner + Executor split"
              description="Keep task planning separate from article mutations so retries and approvals stay deterministic."
            />
            <SuggestionCard
              icon={Brain}
              title="Scope memory by owner and article"
              description="Store tone, prior drafts, and review feedback as task context instead of one shared agent history."
            />
            <SuggestionCard
              icon={FileCheck}
              title="Require approval before publish"
              description="Use AI for suggestions and draft generation first, then gate publish and destructive actions behind human review."
              isHighPriority
            />
          </div>
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-4 text-sm text-zinc-500 dark:text-zinc-400">
            Next backend slice: `planner`, `memory`, `executor`, prompt templates, and `/api/v1/agent/tasks`.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext,
  trend = 'default'
}: { 
  icon: ComponentType<SVGProps<SVGSVGElement>>, 
  label: string, 
  value: number | string,
  subtext: string,
  trend?: 'default' | 'warning' | 'success'
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
            <h4 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{value}</h4>
          </div>
          <div className={`p-3 rounded-xl ${
            trend === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 
            trend === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
            'bg-zinc-50 dark:bg-zinc-800 text-zinc-500'
          }`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-4 flex items-center gap-1.5">
          {trend === 'warning' && <AlertCircle className="h-3 w-3" />}
          {trend === 'success' && <CheckCircle2 className="h-3 w-3" />}
          {subtext}
        </p>
      </CardContent>
    </Card>
  );
}

function SuggestionCard({
  icon: Icon,
  title,
  description,
  isHighPriority,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  isHighPriority?: boolean
}) {
  return (
    <div className={`p-4 rounded-xl border ${
      isHighPriority 
        ? 'border-amber-200 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10' 
        : 'border-zinc-100 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/50'
    } transition-all hover:scale-[1.02] cursor-pointer group`}>
      <div className="flex justify-between items-start gap-2">
        <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-zinc-600 transition-colors">
          {title}
        </h5>
        <ExternalLink className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-3 flex items-start gap-2">
        <div className="rounded-lg bg-white/80 p-2 text-zinc-500 shadow-sm dark:bg-zinc-900/70 dark:text-zinc-300">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}
