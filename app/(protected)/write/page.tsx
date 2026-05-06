'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { ImagePlus, Tag, Globe, Lock, EyeOff, Save, Loader2, UserCircle } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';


interface PublicationItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
}

const PUBLICATIONS_DATA: PublicationItem[] = [
  {
    id: '1',
    title: 'The Future of Collaborative Writing',
    excerpt: 'How modern tools are reshaping the way writers work together.',
    content: '',
    status: 'published',
  },
  {
    id: '2',
    title: 'On Craft: Finding Your Voice',
    excerpt: 'Practical exercises to help you discover your unique style.',
    content: '',
    status: 'draft',
  },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe },
  { value: 'unlisted', label: 'Unlisted', icon: EyeOff },
  { value: 'private', label: 'Private', icon: Lock },
] as const;

const MOCK_ASSIGNED_AUTHORS = [
  { id: 'a1', name: 'John Doe', username: 'johndoe' },
  { id: 'a2', name: 'Jane Smith', username: 'janesmith' },
  { id: 'a3', name: 'Robert Brown', username: 'rbrown' },
];

function WriteEditor() {
  const { user } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize selectedOwnerId to self or first assigned author
  useEffect(() => {
    if (user?.role === 'agent') {
      setSelectedOwnerId(MOCK_ASSIGNED_AUTHORS[0].id);
    } else {
      setSelectedOwnerId(user?.id || '');
    }
  }, [user]);


  // Auto-save with debounce
  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 2000);

  // Hydrate from query param
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const found = PUBLICATIONS_DATA.find((p) => p.id === id);
      if (found) {
        setTitle(found.title);
        setContent(found.content);
        setExcerpt(found.excerpt);
      }
    }
  }, [searchParams]);

  // Auto-save effect
  const handleAutoSave = useCallback(() => {
    if (!debouncedTitle && !debouncedContent) return;
    setLastSaved(new Date().toLocaleTimeString());
  }, [debouncedTitle, debouncedContent]);

  useEffect(() => {
    handleAutoSave();
  }, [handleAutoSave]);

  const handlePublish = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Published:', { title, content, excerpt, tags, visibility });
    setIsSaving(false);
    router.push('/dashboard');
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setLastSaved(new Date().toLocaleTimeString());
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toolbar */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← Cancel
          </button>
          {lastSaved && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-zinc-400">
              <Save className="h-3 w-3" />
              Saved {lastSaved}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Settings
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving || !title.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Publish
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Editor */}
        <main className="flex-1 mx-auto w-full max-w-2xl py-12 px-4 sm:px-6 flex flex-col gap-6">
          {/* Cover image area */}
          <button className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 h-48 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 dark:hover:border-zinc-600 dark:hover:text-zinc-400 transition-colors">
            <ImagePlus className="h-6 w-6" />
            <span className="text-sm font-medium">Add cover image</span>
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title…"
            className="w-full text-4xl font-bold text-zinc-900 dark:text-zinc-50 bg-transparent border-none outline-none placeholder-zinc-300 dark:placeholder-zinc-700"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story…"
            rows={20}
            className="w-full flex-1 text-lg leading-8 text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none placeholder-zinc-300 dark:placeholder-zinc-700 resize-none"
          />
        </main>

        {/* Settings panel */}
        {showSettings && (
          <aside className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-6 overflow-y-auto">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Article Settings
            </h3>

            {/* Author Selection (Agent Only) */}
            {user?.role === 'agent' && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                <label className="block text-sm font-semibold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <UserCircle className="h-4 w-4" />
                  Publication Author
                </label>
                <select
                  value={selectedOwnerId}
                  onChange={(e) => setSelectedOwnerId(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 dark:border-amber-900/30 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {MOCK_ASSIGNED_AUTHORS.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name} (@{author.username})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-amber-600/70 dark:text-amber-400/50 mt-2 italic">
                  * Publishing as an Agent on behalf of an offline owner.
                </p>
              </div>
            )}


            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary of your article…"
                rows={3}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                <Tag className="inline h-3.5 w-3.5 mr-1" />
                Tags
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="writing, craft, journalism"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
              <p className="text-xs text-zinc-400 mt-1">Separate with commas</p>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Visibility
              </label>
              <div className="space-y-2">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                      visibility === opt.value
                        ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-50 dark:bg-zinc-800'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.value}
                      checked={visibility === opt.value}
                      onChange={() => setVisibility(opt.value)}
                      className="sr-only"
                    />
                    <opt.icon className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-zinc-400">
          Loading editor…
        </div>
      }
    >
      <WriteEditor />
    </Suspense>
  );
}
