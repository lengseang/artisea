'use client';

import { type Editor } from '@tiptap/react';
import { 
  Bold, Italic, Strikethrough, Code, Link, 
  Heading1, Heading2, List, ListOrdered, Quote, 
  Undo, Redo, Image as ImageIcon, Link2Off
} from 'lucide-react';
import { uploadMedia } from '@/lib/api/media';
import { useRef } from 'react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadMedia(file);
      editor.chain().focus().setImage({ src: res.url }).run();
    } catch (err) {
      console.error("Failed to upload toolbar image:", err);
    }
  };

  const buttons = [
    {
      icon: Bold,
      label: 'Bold',
      active: editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: 'Italic',
      active: editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      label: 'Strikethrough',
      active: editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
    },
    {
      icon: Code,
      label: 'Inline Code',
      active: editor.isActive('code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
      disabled: !editor.can().chain().focus().toggleCode().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      active: editor.isActive('heading', { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      active: editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      label: 'Bullet List',
      active: editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: 'Ordered List',
      active: editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Quote,
      label: 'Blockquote',
      active: editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      type: 'divider',
    },
    {
      icon: Link,
      label: 'Link',
      active: editor.isActive('link'),
      onClick: setLink,
    },
    {
      icon: ImageIcon,
      label: 'Insert Image',
      onClick: () => fileInputRef.current?.click(),
    },
    {
      type: 'divider',
    },
    {
      icon: Undo,
      label: 'Undo',
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      label: 'Redo',
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 select-none sticky top-[53px] z-20 shadow-sm">
      {buttons.map((btn, i) => {
        if (btn.type === 'divider') {
          return <div key={`div-${i}`} className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1.5" />;
        }

        const Icon = btn.icon!;
        return (
          <button
            key={`btn-${i}`}
            type="button"
            onClick={btn.onClick}
            disabled={btn.disabled}
            title={btn.label}
            className={`h-8 min-w-[32px] px-1.5 rounded transition-all duration-100 flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium ${
              btn.active 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Icon className="h-4 w-4 flex-none" />
          </button>
        );
      })}
      
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
