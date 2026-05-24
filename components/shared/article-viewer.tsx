'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface ArticleViewerProps {
  content: string | null;
  contentText?: string | null;
}

export function ArticleViewer({ content, contentText }: ArticleViewerProps) {
  // Determine initial document structure
  const parsedContent = (() => {
    if (!content) {
      return {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: contentText || '' }] }],
      };
    }

    try {
      // If it's a string representation of JSON, parse it
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch {
      // If parsing fails, fall back to plain text
      return {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: content || contentText || '' }] }],
      };
    }
  })();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto my-8 border border-zinc-200 dark:border-zinc-800 shadow-sm mx-auto',
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-zinc-900 dark:text-zinc-100 underline underline-offset-4 font-medium hover:opacity-85',
        },
      }),
    ],
    content: parsedContent,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none font-serif text-lg leading-relaxed text-zinc-800 dark:text-zinc-200',
      },
    },
  });

  // Dynamically sync content if it changes
  useEffect(() => {
    if (editor && content) {
      try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        editor.commands.setContent(parsed, { emitUpdate: false });
      } catch {
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
export default ArticleViewer;
