/**
 * TipTap mark for low-confidence OCR words — rendered orange until user confirms.
 */
import { Mark, mergeAttributes } from '@tiptap/core';

export const UncertainWord = Mark.create({
  name: 'uncertainWord',

  addAttributes() {
    return {
      wordId: { default: null },
      original: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-uncertain-word]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-uncertain-word': 'true',
        class: 'bg-orange-200 text-orange-900 rounded px-0.5 cursor-pointer hover:bg-orange-300',
      }),
      0,
    ];
  },
});
