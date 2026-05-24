'use client';

import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Strikethrough, Code,
  Link as LinkIcon,
  Heading1, Heading2, List, ListOrdered, Quote,
  Image as ImageIcon, Undo, Redo,
  ChevronLeft, ChevronRight,
  Eye, EyeOff,
  PanelRight, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useRef } from 'react';
import { uploadMedia } from '@/lib/api/media';
import { cn } from '@/lib/utils';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UnifiedEditorBarProps {
  editor: Editor | null;
  title: string;
  saveStatus: SaveStatus;
  isPreviewMode: boolean;
  showSettings: boolean;
  isPublishing: boolean;
  canPublish: boolean;
  onBack: () => void;
  onForward: () => void;
  onTogglePreview: () => void;
  onToggleSettings: () => void;
  onSave: () => void;
  onPublish: () => void;
}

export function UnifiedEditorBar({
  editor,
  title,
  saveStatus,
  isPreviewMode,
  showSettings,
  isPublishing,
  canPublish,
  onBack,
  onForward,
  onTogglePreview,
  onToggleSettings,
  onSave,
  onPublish,
}: UnifiedEditorBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Image insert ────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    e.target.value = '';
    try {
      const res = await uploadMedia(file);
      editor.chain().focus().setImage({ src: res.url }).run();
    } catch {
      console.error('Image upload failed');
    }
  };

  // ─── Link prompt ─────────────────────────────────────────────────
  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL:', prev ?? '');
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  // ─── Save indicator ──────────────────────────────────────────────
  const SaveIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="flex items-center gap-1.5 text-xs text-zinc-400 min-w-[72px] whitespace-nowrap">
            <Loader2 className="h-3.5 w-3.5 animate-spin flex-none" />
            Saving…
          </span>
        );
      case 'saved':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 min-w-[72px] whitespace-nowrap">
            <CheckCircle2 className="h-3.5 w-3.5 flex-none" />
            Saved
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-xs text-red-500 min-w-[72px] whitespace-nowrap">
            <AlertCircle className="h-3.5 w-3.5 flex-none" />
            Failed
          </span>
        );
      default:
        return <span className="min-w-[72px]" />;
    }
  };

  // ─── Toolbar button ───────────────────────────────────────────────
  const Btn = ({
    onClick,
    active,
    disabled,
    title: tooltip,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent editor blur — keep focus inside Tiptap
        e.preventDefault();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      title={tooltip}
      className={cn(
        'h-9 min-w-[36px] px-2 rounded-md flex items-center justify-center transition-all duration-100 select-none',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        active
          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
      )}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-1 flex-none" />
  );

  return (
    <header className="flex-none flex items-center justify-between h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 gap-0 select-none z-30 shadow-sm">
      {/* ─── LEFT: Navigation ─────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 flex-none mr-3">
        <button
          type="button"
          onClick={onBack}
          title="Go back"
          className="h-9 w-9 rounded-md flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onForward}
          title="Go forward"
          className="h-9 w-9 rounded-md flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        {/* Breadcrumb doc title */}
        <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-600 truncate max-w-[150px] hidden lg:block">
          {title.trim() || 'Untitled'}
        </span>
      </div>

      <Divider />

      {/* ─── CENTER: Formatting Tools ─────────────────────────────── */}
      <div className="flex-1 overflow-x-auto scrollbar-none flex justify-center items-center mx-2 min-w-0">
        {!isPreviewMode && editor ? (
          <div className="flex items-center gap-0.5 flex-none whitespace-nowrap min-w-0">
            {/* Text style */}
            <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
              <Bold className="h-4 w-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
              <Italic className="h-4 w-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
              <Strikethrough className="h-4 w-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
              <Code className="h-4 w-4" />
            </Btn>

            <Divider />

            {/* Headings */}
            <Btn
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Btn>
            <Btn
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Btn>

            <Divider />

            {/* Lists & quote */}
            <Btn
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Btn>
            <Btn
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Btn>
            <Btn
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </Btn>

            <Divider />

            {/* Insert */}
            <Btn onClick={setLink} active={editor.isActive('link')} title="Insert / Edit Link">
              <LinkIcon className="h-4 w-4" />
            </Btn>
            <Btn onClick={() => fileInputRef.current?.click()} title="Insert Image">
              <ImageIcon className="h-4 w-4" />
            </Btn>

            <Divider />

            {/* History */}
            <Btn
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </Btn>
            <Btn
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </Btn>
          </div>
        ) : (
          <span className="text-xs text-zinc-400 italic whitespace-nowrap">
            {isPreviewMode ? 'Preview mode — read only' : 'Loading editor…'}
          </span>
        )}
      </div>

      <Divider />

      {/* ─── RIGHT: Save + Actions ────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-none ml-3">
        {/* Save status indicator */}
        <SaveIndicator />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={onTogglePreview}
          title={isPreviewMode ? 'Back to editing' : 'Preview as reader'}
          className={cn(
            'h-9 w-9 rounded-md flex items-center justify-center transition-all',
            isPreviewMode
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
          )}
        >
          {isPreviewMode ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
        </button>

        {/* Settings panel toggle */}
        <button
          type="button"
          onClick={onToggleSettings}
          title="Article settings"
          className={cn(
            'h-9 w-9 rounded-md flex items-center justify-center transition-all',
            showSettings
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
          )}
        >
          <PanelRight className="h-4.5 w-4.5" />
        </button>

        <Divider />

        {/* Save draft */}
        <button
          type="button"
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          className="h-9 px-4 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          Save
        </button>

        {/* Publish */}
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing || !canPublish}
          className="h-9 px-4 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
        >
          {isPublishing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Publish
        </button>
      </div>

      {/* Hidden file input for image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </header>
  );
}
