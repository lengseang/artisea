'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { uploadMedia } from '@/lib/api/media';
import { useState, useEffect } from 'react';
import { ArticleViewer } from '@/components/shared/article-viewer';
import { Bold, Italic, Strikethrough, Link as LinkIcon } from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface RichTextEditorProps {
  title: string;
  onChangeTitle: (title: string) => void;
  content: string;
  onChange: (contentJson: string, contentText: string) => void;
  isPreviewMode?: boolean;
  onEditorReady?: (editor: Editor) => void;
}

export function RichTextEditor({
  title,
  onChangeTitle,
  content,
  onChange,
  isPreviewMode = false,
  onEditorReady,
}: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Parse initial content safely
  const getInitialContent = () => {
    if (!content) return null;
    try {
      return JSON.parse(content);
    } catch {
      return {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }],
      };
    }
  };

  const handleImageUploadAndInsert = async (file: File, view: { state: any; dispatch: any }, pos: number) => {
    setIsUploading(true);
    try {
      const res = await uploadMedia(file);
      const node = view.state.schema.nodes.image.create({ src: res.url });
      view.dispatch(view.state.tr.insert(pos, node));
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-6 shadow-sm mx-auto block',
        },
      }),
      Placeholder.configure({
        placeholder: 'Tell your story…',
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:opacity-75 cursor-pointer',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content: getInitialContent(),
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(JSON.stringify(ed.getJSON()), ed.getText());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[600px] font-serif text-lg leading-relaxed text-zinc-800 dark:text-zinc-200',
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (!images.length) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        const pos = coords?.pos ?? view.state.selection.from;
        images.forEach((img) => handleImageUploadAndInsert(img, view, pos));
        return true;
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const images = Array.from(items)
          .filter((i) => i.type.startsWith('image/'))
          .map((i) => i.getAsFile())
          .filter(Boolean) as File[];
        if (!images.length) return false;
        event.preventDefault();
        const pos = view.state.selection.from;
        images.forEach((img) => handleImageUploadAndInsert(img, view, pos));
        return true;
      },
    },
  });

  // ✅ Notify parent when editor is ready so toolbar can re-render
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync content from DB after load
  useEffect(() => {
    if (!editor || !content) return;
    try {
      const currentJson = JSON.stringify(editor.getJSON());
      if (content !== currentJson) {
        editor.commands.setContent(JSON.parse(content), { emitUpdate: false });
      }
    } catch {
      if (content !== editor.getText()) {
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }
    // Only sync when content changes externally (on load), not on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  if (!editor) return null;

  return (
    <div className="flex flex-col bg-[#f0f0f0] dark:bg-zinc-950 flex-1 w-full relative overflow-hidden">
      {/* Upload progress bar */}
      {isUploading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-50 animate-pulse" />
      )}

      {/* Scrollable canvas area */}
      <div className="flex-1 overflow-y-auto py-6 md:py-10 px-4 md:px-6 flex justify-center items-start">
        {/* White A4 paper */}
        <div
          className="w-full max-w-[780px] bg-white dark:bg-zinc-900 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)] min-h-[1000px] px-6 py-8 md:px-[96px] md:py-[80px] flex flex-col"
          onClick={() => {
            if (!isPreviewMode) editor.commands.focus();
          }}
        >
          {isPreviewMode ? (
            <>
              <h1 className="text-3xl md:text-[2.6rem] font-bold text-zinc-900 dark:text-zinc-50 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-8 leading-tight tracking-tight break-words">
                {title || 'Untitled Document'}
              </h1>
              <ArticleViewer content={content} />
            </>
          ) : (
            <>
              <textarea
                value={title}
                onChange={(e) => {
                  onChangeTitle(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Article title…"
                rows={1}
                className="w-full text-3xl md:text-[2.6rem] font-bold text-zinc-900 dark:text-zinc-50 bg-transparent border-none outline-none placeholder-zinc-300 dark:placeholder-zinc-700 pb-5 mb-8 focus:ring-0 focus:outline-none leading-tight tracking-tight border-b border-zinc-200 dark:border-zinc-800 resize-none break-words overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                ref={(el) => {
                  if (el) {
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
              />
              <div className="flex-1">
                <EditorContent editor={editor} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bubble menu — appears when text is selected */}
      {!isPreviewMode && (
        <BubbleMenu
          editor={editor}
          options={{ offset: 8 }}
          className="flex items-center gap-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100"
        >
          {(
            [
              {
                label: 'Bold',
                icon: Bold,
                action: () => editor.chain().focus().toggleBold().run(),
                active: editor.isActive('bold'),
              },
              {
                label: 'Italic',
                icon: Italic,
                action: () => editor.chain().focus().toggleItalic().run(),
                active: editor.isActive('italic'),
              },
              {
                label: 'Strike',
                icon: Strikethrough,
                action: () => editor.chain().focus().toggleStrike().run(),
                active: editor.isActive('strike'),
              },
              {
                label: 'Link',
                icon: LinkIcon,
                action: () => {
                  const prev = editor.getAttributes('link').href as string | undefined;
                  const url = window.prompt('URL:', prev ?? '');
                  if (url === null) return;
                  if (url === '') {
                    editor.chain().focus().extendMarkRange('link').unsetLink().run();
                  } else {
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                  }
                },
                active: editor.isActive('link'),
              },
            ] as const
          ).map(({ label, icon: Icon, action, active }) => (
            <button
              key={label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                action();
              }}
              className={`p-1.5 rounded transition-colors ${
                active
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              title={label}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </BubbleMenu>
      )}
    </div>
  );
}

