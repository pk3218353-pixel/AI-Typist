/**
 * Rich text editor component using TipTap — word-processor-like editing experience.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import type { Editor } from '@tiptap/react';

import { UncertainWord } from './extensions/UncertainWord';
import { FontSize } from './extensions/FontSize';
import Toolbar from './Toolbar';
import UncertainWordPanel, { type UncertainItem } from './UncertainWordPanel';
import { FONT_OPTIONS } from '../../types';

export interface RichTextEditorProps {
  initialContent?: Record<string, unknown>;
  fontFamily?: string;
  onFontFamilyChange?: (font: string) => void;
  onEditorReady?: (editor: Editor) => void;
  onExport?: (editor: Editor) => void;
  exportLabel?: string;
  toolbarExtra?: React.ReactNode;
  showUncertainPanel?: boolean;
  onChange?: (content: Record<string, unknown>) => void;
}

/**
 * Scan document for uncertainWord marks and return panel items with positions.
 */
function collectUncertainItems(editor: Editor): UncertainItem[] {
  const items: UncertainItem[] = [];
  const { doc } = editor.state;

  doc.descendants((node, pos) => {
    if (!node.isText) return;
    const mark = node.marks.find((m) => m.type.name === 'uncertainWord');
    if (mark) {
      items.push({
        wordId: String(mark.attrs.wordId ?? pos),
        text: node.text ?? '',
        from: pos,
        to: pos + (node.text?.length ?? 0),
      });
    }
  });

  return items;
}

export default function RichTextEditor({
  initialContent,
  fontFamily: initialFont = 'mangal',
  onFontFamilyChange,
  onEditorReady,
  onExport,
  exportLabel,
  toolbarExtra,
  showUncertainPanel = true,
  onChange,
}: RichTextEditorProps) {
  const [fontFamily, setFontFamily] = useState(initialFont);
  const [uncertainItems, setUncertainItems] = useState<UncertainItem[]>([]);

  const fontCss = useMemo(
    () => FONT_OPTIONS.find((f) => f.value === fontFamily)?.css ?? 'Mangal, sans-serif',
    [fontFamily],
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      UncertainWord,
    ],
    content: initialContent ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[320px] focus:outline-none px-4 py-3',
        style: `font-family: ${fontCss}; font-size: 14px;`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      setUncertainItems(collectUncertainItems(ed));
      onChange?.(ed.getJSON());
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) onEditorReady(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
      setUncertainItems(collectUncertainItems(editor));
    }
  }, [editor, initialContent]);

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setFontFamily(fontCss).run();
    }
  }, [editor, fontCss]);

  const handleConfirm = useCallback(
    (item: UncertainItem) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .setTextSelection({ from: item.from, to: item.to })
        .unsetMark('uncertainWord')
        .run();
      setUncertainItems(collectUncertainItems(editor));
    },
    [editor],
  );

  const handleCorrect = useCallback(
    (item: UncertainItem, newText: string) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .setTextSelection({ from: item.from, to: item.to })
        .insertContent(newText)
        .unsetMark('uncertainWord')
        .run();
      setUncertainItems(collectUncertainItems(editor));
    },
    [editor],
  );

  const stats = useMemo(() => {
    if (!editor) return { words: 0, characters: 0, readTime: 0 };
    const text = editor.getText();
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const characters = text.length;
    const readTime = Math.ceil(words / 200);
    return { words, characters, readTime };
  }, [editor?.state.doc]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Toolbar
        editor={editor}
        fontFamily={fontFamily}
        onFontFamilyChange={(font) => {
          setFontFamily(font);
          onFontFamilyChange?.(font);
        }}
        onExport={onExport && editor ? () => onExport(editor) : undefined}
        exportLabel={exportLabel}
        extra={toolbarExtra}
      />
      <EditorContent editor={editor} />
      {editor && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
          <div className="flex gap-4">
            <span>Words: <strong className="text-slate-600">{stats.words}</strong></span>
            <span>Characters: <strong className="text-slate-600">{stats.characters}</strong></span>
          </div>
          <span>Est. Reading Time: <strong className="text-slate-600">{stats.readTime} min</strong></span>
        </div>
      )}
      {showUncertainPanel && (
        <div className="border-t border-slate-200 p-4">
          <UncertainWordPanel
            items={uncertainItems}
            editor={editor}
            onConfirm={handleConfirm}
            onCorrect={handleCorrect}
          />
        </div>
      )}
    </div>
  );
}
