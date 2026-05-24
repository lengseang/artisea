'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Tag, Globe, Lock, EyeOff, UserCircle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { createArticle, getArticleById, publishArticle, updateArticle } from '@/lib/api/articles';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { UnifiedEditorBar, type SaveStatus } from '@/components/editor/unified-editor-bar';
import { extractFirstImageUrl } from '@/lib/media-util';
import type { Editor } from '@tiptap/react';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', icon: Globe },
  { value: 'unlisted', label: 'Unlisted', icon: EyeOff },
  { value: 'private', label: 'Private', icon: Lock },
] as const;

function WriteEditor() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ useState (not useRef) so toolbar re-renders when editor mounts
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [articleId, setArticleId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const debouncedContent = useDebounce(content, 1500);
  const debouncedTitle = useDebounce(title, 1500);

  // Load existing article on mount
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;
    getArticleById(id)
      .then((article) => {
        setArticleId(id);
        setTitle(article.title);
        const c = article.content ?? article.content_text ?? '';
        setContent(typeof c === 'object' ? JSON.stringify(c) : String(c));
        setExcerpt(article.excerpt ?? '');
        setVisibility(article.visibility ?? 'public');
        setCoverImage(article.cover_image ?? undefined);
        setTags(article.tags?.map((t: { name: string }) => t.name).join(', ') ?? '');
      })
      .catch((err) =>
        setErrorMessage(err instanceof Error ? err.message : 'Unable to load article.')
      );
  }, [searchParams]);

  // Core save function — always reads latest state via closure params
  const saveArticle = useCallback(
    async (opts?: { title?: string; content?: string }): Promise<{ id: string } | null> => {
      const t = opts?.title ?? title;
      const c = opts?.content ?? content;
      if (!t.trim() && !c) return null;

      setSaveStatus('saving');
      try {
        const payload = {
          title: t,
          content: c,
          excerpt,
          cover_image: coverImage,
          tags: tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          visibility,
        };
        let article;
        if (articleId) {
          article = await updateArticle(articleId, payload);
        } else {
          article = await createArticle(payload);
          setArticleId(article.id);
        }
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
        return article;
      } catch {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
        return null;
      }
    },
    [articleId, content, coverImage, excerpt, tags, title, visibility]
  );

  // Auto-save when debounced values change
  useEffect(() => {
    if (!debouncedTitle && !debouncedContent) return;
    if (!articleId && !debouncedTitle.trim()) return;
    void saveArticle({ title: debouncedTitle, content: debouncedContent });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  // Publish handler
  const handlePublish = async () => {
    setIsPublishing(true);
    setErrorMessage(null);
    try {
      const draft = await saveArticle();
      if (!draft) throw new Error('Save failed before publish.');
      await publishArticle(draft.id);
      router.push('/dashboard');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to publish article.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Ctrl+S shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        void saveArticle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveArticle]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f0f0f0] dark:bg-zinc-950">
      {/* ── Unified single-row editor bar ── */}
      <UnifiedEditorBar
        editor={editorInstance}
        title={title}
        saveStatus={saveStatus}
        isPreviewMode={isPreviewMode}
        showSettings={showSettings}
        isPublishing={isPublishing}
        canPublish={!!title.trim()}
        onBack={() => router.back()}
        onForward={() => router.forward()}
        onTogglePreview={() => setIsPreviewMode((v) => !v)}
        onToggleSettings={() => setShowSettings((v) => !v)}
        onSave={() => void saveArticle()}
        onPublish={handlePublish}
      />

      {/* Error banner */}
      {errorMessage && (
        <div className="flex-none flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
          <AlertCircle className="h-4 w-4 flex-none" />
          {errorMessage}
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-400 hover:text-red-600 font-bold text-base leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Body row */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Editor canvas */}
        <RichTextEditor
          title={title}
          onChangeTitle={setTitle}
          content={content}
          onChange={(jsonStr, text) => {
            setContent(jsonStr);
            const extracted = extractFirstImageUrl(jsonStr);
            if (extracted) setCoverImage(extracted);
          }}
          isPreviewMode={isPreviewMode}
          onEditorReady={(ed) => setEditorInstance(ed)}
        />

        {/* Settings sidebar */}
        {showSettings && (
          <aside className="absolute right-0 top-0 bottom-0 z-20 w-72 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col flex-none overflow-y-auto shadow-2xl md:shadow-none md:static">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                Article Settings
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Ctrl+S saves anytime</p>
            </div>

            <div className="p-4 space-y-5 flex-1">
              {/* Cover preview */}
              {coverImage && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Cover Image
                  </label>
                  <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-video bg-zinc-100 dark:bg-zinc-900">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-zinc-400 italic">
                    Auto-extracted from first image in document.
                  </p>
                </div>
              )}

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short summary…"
                  rows={3}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-shadow"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Tags
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="writing, craft, journalism"
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-shadow"
                />
                <p className="text-[10px] text-zinc-400">Separate with commas</p>
              </div>

              {/* Visibility */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Visibility
                </label>
                <div className="space-y-1.5">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-all text-sm ${
                        visibility === opt.value
                          ? 'border-zinc-900 dark:border-zinc-200 bg-zinc-50 dark:bg-zinc-800 font-medium'
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
                      <opt.icon className="h-4 w-4 text-zinc-500 flex-none" />
                      <span className="text-zinc-700 dark:text-zinc-300">{opt.label}</span>
                      {visibility === opt.value && (
                        <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-zinc-900 dark:text-zinc-200" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Agent info */}
              {user?.role === 'agent' && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                  <label className="block text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <UserCircle className="h-3.5 w-3.5" /> Publication Author
                  </label>
                  <input
                    value={user?.id ?? ''}
                    readOnly
                    className="w-full rounded-lg border border-amber-200 dark:border-amber-900/30 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              )}
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
        <div className="flex h-screen items-center justify-center text-zinc-400 gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading editor…</span>
        </div>
      }
    >
      <WriteEditor />
    </Suspense>
  );
}
