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
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-4 text-sm font-bold text-green-800 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400">
        All words confirmed. You can export the document.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5 space-y-4 dark:border-orange-900/30 dark:bg-orange-950/10">
      <div>
        <h3 className="text-sm font-extrabold tracking-wider uppercase text-orange-800 dark:text-orange-400 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-xs">
            ⚠️
          </span>
          Review flagged words ({items.length})
        </h3>
        <p className="text-xs text-orange-700/80 dark:text-orange-300/80 font-medium mt-1">
          Words with low OCR confidence are highlighted. You can verify them below:
        </p>
      </div>

      <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <li
            key={item.wordId}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-orange-100/50 bg-white p-3 shadow-sm hover:shadow dark:border-slate-800 dark:bg-slate-900 transition duration-200"
          >
            <button
              type="button"
              className="text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline underline-offset-4 cursor-pointer"
              onClick={() => {
                editor?.chain().focus().setTextSelection({ from: item.from, to: item.to }).run();
              }}
              title="Click to jump to word"
            >
              {item.text}
            </button>
            
            <input
              type="text"
              defaultValue={item.text}
              className="min-w-[120px] flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-250 dark:focus:bg-slate-950 transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCorrect(item, (e.target as HTMLInputElement).value);
                }
              }}
              id={`correct-${item.wordId}`}
            />

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-xl bg-green-500 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-green-600 shadow-sm transition"
                onClick={() => onConfirm(item)}
              >
                Confirm
              </button>
              <button
                type="button"
                className="rounded-xl bg-slate-700 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 shadow-sm transition"
                onClick={() => {
                  const input = document.getElementById(`correct-${item.wordId}`) as HTMLInputElement;
                  onCorrect(item, input?.value ?? item.text);
                }}
              >
                Apply
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

