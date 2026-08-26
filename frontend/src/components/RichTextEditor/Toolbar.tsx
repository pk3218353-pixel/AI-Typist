/**
 * Rich text editor toolbar — font, size, bold, italic, underline, alignment.
 */
import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import { FONT_OPTIONS } from '../../types';

interface ToolbarProps {
  editor: Editor | null;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  onExport?: () => void;
  exportLabel?: string;
  extra?: ReactNode;
}

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

export default function Toolbar({
  editor,
  fontFamily,
  onFontFamilyChange,
  onExport,
  exportLabel = 'Export .docx',
  extra,
}: ToolbarProps) {
  if (!editor) return null;

  const getBtnClass = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
      active
        ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/80 bg-slate-50/50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/20">
      <select
        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        value={fontFamily}
        onChange={(e) => {
          const next = e.target.value;
          onFontFamilyChange(next);
          const css = FONT_OPTIONS.find((f) => f.value === next)?.css ?? 'Mangal, sans-serif';
          editor.chain().focus().setFontFamily(css).run();
        }}
        title="Font family"
      >
        {FONT_OPTIONS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        defaultValue="14"
        onChange={(e) => {
          editor.chain().focus().setFontSize(`${e.target.value}px`).run();
        }}
        title="Font size"
      >
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>

      <div className="mx-1.5 h-5 w-px bg-slate-200 dark:bg-slate-800" />

      <button
        type="button"
        className={getBtnClass(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button
        type="button"
        className={getBtnClass(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button
        type="button"
        className={getBtnClass(editor.isActive('underline'))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
          <line x1="4" y1="21" x2="20" y2="21"></line>
        </svg>
      </button>

      <div className="mx-1.5 h-5 w-px bg-slate-200 dark:bg-slate-800" />

      {/* Headings */}
      <button
        type="button"
        className={`text-xs font-black ${getBtnClass(editor.isActive('heading', { level: 1 }))}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        className={`text-xs font-black ${getBtnClass(editor.isActive('heading', { level: 2 }))}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </button>

      <div className="mx-1.5 h-5 w-px bg-slate-200 dark:bg-slate-800" />

      {/* Lists */}
      <button
        type="button"
        className={getBtnClass(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        type="button"
        className={getBtnClass(editor.isActive('orderedList'))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="10" y1="6" x2="21" y2="6"></line>
          <line x1="10" y1="12" x2="21" y2="12"></line>
          <line x1="10" y1="18" x2="21" y2="18"></line>
          <path d="M4 6h1v4"></path>
          <path d="M4 10h2"></path>
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
        </svg>
      </button>

      <div className="mx-1.5 h-5 w-px bg-slate-200 dark:bg-slate-800" />

      <button
        type="button"
        className={getBtnClass(false)}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Align Left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="17" y1="10" x2="3" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="17" y1="18" x2="3" y2="18"></line>
        </svg>
      </button>
      <button
        type="button"
        className={getBtnClass(false)}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Align Center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="18" y1="10" x2="6" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="18" y1="18" x2="6" y2="18"></line>
        </svg>
      </button>
      <button
        type="button"
        className={getBtnClass(false)}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Align Right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="21" y1="10" x2="7" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="7" y2="18"></line>
        </svg>
      </button>

      {extra && (
        <>
          <div className="mx-1.5 h-5 w-px bg-slate-200 dark:bg-slate-800" />
          {extra}
        </>
      )}

      {onExport && (
        <>
          <div className="flex-1" />
          <button
            type="button"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-indigo-950/50 transition-all hover:-translate-y-0.5"
            onClick={onExport}
          >
            {exportLabel}
          </button>
        </>
      )}
    </div>
  );
}
