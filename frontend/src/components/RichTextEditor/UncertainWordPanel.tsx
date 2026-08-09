/**
 * Side panel listing uncertain OCR words — click to jump and confirm/correct.
 */
import type { Editor } from '@tiptap/react';

export interface UncertainItem {
  wordId: string;
  text: string;
  from: number;
  to: number;
}

interface UncertainWordPanelProps {
  items: UncertainItem[];
  editor: Editor | null;
  onConfirm: (item: UncertainItem) => void;
  onCorrect: (item: UncertainItem, newText: string) => void;
}

export default function UncertainWordPanel({
  items,
  editor,
  onConfirm,
  onCorrect,
}: UncertainWordPanelProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        All words confirmed. You can export the document.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
      <h3 className="mb-2 font-semibold text-orange-900">
        Review flagged words ({items.length})
      </h3>
      <p className="mb-3 text-xs text-orange-800">
        Orange highlights indicate low OCR confidence. Confirm or correct each word.
      </p>
      <ul className="max-h-64 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.wordId}
            className="flex flex-wrap items-center gap-2 rounded bg-white p-2 shadow-sm"
          >
            <button
              type="button"
              className="text-sm font-medium text-orange-700 underline"
              onClick={() => {
                editor?.chain().focus().setTextSelection({ from: item.from, to: item.to }).run();
              }}
            >
              {item.text}
            </button>
            <input
              type="text"
              defaultValue={item.text}
              className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCorrect(item, (e.target as HTMLInputElement).value);
                }
              }}
              id={`correct-${item.wordId}`}
            />
            <button
              type="button"
              className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
              onClick={() => onConfirm(item)}
            >
              Confirm
            </button>
            <button
              type="button"
              className="rounded bg-slate-600 px-2 py-1 text-xs text-white hover:bg-slate-700"
              onClick={() => {
                const input = document.getElementById(`correct-${item.wordId}`) as HTMLInputElement;
                onCorrect(item, input?.value ?? item.text);
              }}
            >
              Apply
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

