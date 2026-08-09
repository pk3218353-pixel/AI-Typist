/**
 * Build TipTap JSON document from OCR words with uncertain-word marks.
 */
import type { OcrWord } from '../types';

interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TipTapTextNode {
  type: 'text';
  text: string;
  marks?: TipTapMark[];
}

interface TipTapParagraph {
  type: 'paragraph';
  content: TipTapTextNode[];
}

interface TipTapDoc {
  type: 'doc';
  content: TipTapParagraph[];
}

/**
 * Group OCR words by line_index and build a TipTap document with orange uncertain marks.
 */
export function ocrWordsToTipTapDoc(words: OcrWord[]): TipTapDoc {
  const lines = new Map<number, OcrWord[]>();

  for (const word of words) {
    const line = word.line_index ?? 0;
    if (!lines.has(line)) lines.set(line, []);
    lines.get(line)!.push(word);
  }

  const paragraphs: TipTapParagraph[] = [];

  for (const lineNum of [...lines.keys()].sort((a, b) => a - b)) {
    const lineWords = lines.get(lineNum)!;
    const content: TipTapTextNode[] = [];

    lineWords.forEach((word, idx) => {
      const marks: TipTapMark[] = [];
      if (word.uncertain) {
        marks.push({
          type: 'uncertainWord',
          attrs: { wordId: `${lineNum}-${idx}`, original: word.text },
        });
      }
      content.push({
        type: 'text',
        text: idx < lineWords.length - 1 ? `${word.text} ` : word.text,
        ...(marks.length ? { marks } : {}),
      });
    });

    paragraphs.push({ type: 'paragraph', content });
  }

  if (paragraphs.length === 0) {
    paragraphs.push({ type: 'paragraph', content: [] });
  }

  return { type: 'doc', content: paragraphs };
}
