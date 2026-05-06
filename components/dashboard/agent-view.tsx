'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { 
  Users, 
  FileCheck, 
  ClipboardList, 
  ExternalLink, 
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface ManagedAuthor {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  article_count: number;
  status: 'active' | 'pending' | 'revoked';
  last_activity: string;
}

const MOCK_AUTHORS: ManagedAuthor[] = [
  {
    id: 'a1',
    display_name: 'John Doe',
    username: 'johndoe',
    avatar_url: null,
    article_count: 12,
    status: 'active',
    last_activity: '2 hours ago',
  },
  {
    id: 'a2',
    display_name: 'Jane Smith',
    username: 'janesmith',
    avatar_url: null,
    article_count: 5,
    status: 'pending',
    last_activity: '1 day ago',
  },
  {
    id: 'a3',
    display_name: 'Robert Brown',
    username: 'rbrown',
    avatar_url: null,
    article_count: 28,
    status: 'active',
    last_activity: '30 mins ago',
  },
];

export function AgentView() {
  const [authors] = useState<ManagedAuthor[]>(MOCK_AUTHORS);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Agent Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          icon={Users} 
          label="Assigned Authors" 
          value={authors.length} 
          subtext="Managing content for 3 owners"
        />
        <StatCard 
          icon={FileCheck} 
          label="Pending Verification" 
          value={4} 
          subtext="Articles requiring review"
          trend="warning"
        />
        <StatCard 
          icon={ClipboardList} 
          label="Total Managed" 
          value={45} 
          subtext="Articles published across owners"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Authors List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Assigned Authors</h3>
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              View All
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
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
                  {authors.map((author) => (
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

        {/* Verification Queue (Sidebar) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Verification Queue</h3>
          <div className="space-y-3">
            <VerificationCard 
              title="The Impact of AI on UX"
              author="John Doe"
              time="10 mins ago"
            />
            <VerificationCard 
              title="Sustainable Design Patterns"
              author="Robert Brown"
              time="45 mins ago"
            />
            <VerificationCard 
              title="Editorial Ethics 101"
              author="John Doe"
              time="2 hours ago"
              isHighPriority
            />
          </div>
          <button className="w-full py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-100 dark:hover:text-zinc-100 transition-all">
            View Full Queue
          </button>
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
  icon: any, 
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

function VerificationCard({ title, author, time, isHighPriority }: { 
  title: string, 
  author: string, 
  time: string,
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
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-zinc-500">by <span className="font-medium text-zinc-700 dark:text-zinc-300">{author}</span></p>
        <span className="text-[10px] text-zinc-400">{time}</span>
      </div>
    </div>
  );
}
