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

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
      <select
        className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
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
        className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
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

      <div className="mx-1 h-6 w-px bg-slate-300" />

      <button
        type="button"
        className={`rounded px-2 py-1 text-sm font-bold ${editor.isActive('bold') ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        className={`rounded px-2 py-1 text-sm italic ${editor.isActive('italic') ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        className={`rounded px-2 py-1 text-sm underline ${editor.isActive('underline') ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        U
      </button>

      <div className="mx-1 h-6 w-px bg-slate-300" />

      <button
        type="button"
        className="rounded px-2 py-1 text-sm hover:bg-slate-200"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        Left
      </button>
      <button
        type="button"
        className="rounded px-2 py-1 text-sm hover:bg-slate-200"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        Center
      </button>
      <button
        type="button"
        className="rounded px-2 py-1 text-sm hover:bg-slate-200"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        Right
      </button>

      {extra}

      {onExport && (
        <>
          <div className="flex-1" />
          <button
            type="button"
            className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            onClick={onExport}
          >
            {exportLabel}
          </button>
        </>
      )}
    </div>
  );
}
