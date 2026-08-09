/**
 * Serialize TipTap editor JSON to backend docx export payload.
 */
import type { Editor } from '@tiptap/react';
import type { DocxExportPayload, ParagraphBlock, TextRun } from '../types';

function getAlign(node: Record<string, unknown>): 'left' | 'center' | 'right' {
  const attrs = (node.attrs as Record<string, unknown>) || {};
  const align = attrs.textAlign as string | undefined;
  if (align === 'center' || align === 'right') return align;
  return 'left';
}

function collectRuns(
  nodes: Array<Record<string, unknown>>,
  fontSize: number,
): TextRun[] {
  const runs: TextRun[] = [];

  for (const node of nodes) {
    if (node.type === 'text') {
      const marks = (node.marks as Array<Record<string, unknown>>) || [];
      const textStyle = marks.find((m) => m.type === 'textStyle');
      const styleAttrs = (textStyle?.attrs as Record<string, unknown>) || {};
      const parsedSize = styleAttrs.fontSize
        ? parseInt(String(styleAttrs.fontSize).replace('px', ''), 10)
        : fontSize;
      runs.push({
        text: String(node.text ?? ''),
        bold: marks.some((m) => m.type === 'bold'),
        italic: marks.some((m) => m.type === 'italic'),
        underline: marks.some((m) => m.type === 'underline'),
        fontSize: Number.isNaN(parsedSize) ? fontSize : parsedSize,
        uncertain: marks.some((m) => m.type === 'uncertainWord'),
      });
    } else if (node.content) {
      runs.push(...collectRuns(node.content as Array<Record<string, unknown>>, fontSize));
    }
  }

  return runs;
}

/**
 * Convert editor document to structured blocks for python-docx export.
 */
export function editorToDocxPayload(editor: Editor, fontFamily: string): DocxExportPayload {
  const json = editor.getJSON();
  const blocks: ParagraphBlock[] = [];
  const fontSize = 14;

  const content = (json.content as Array<Record<string, unknown>>) || [];
  for (const node of content) {
    if (node.type === 'paragraph') {
      const children = (node.content as Array<Record<string, unknown>>) || [];
      blocks.push({
        type: 'paragraph',
        align: getAlign(node),
        runs: collectRuns(children, fontSize),
      });
    }
  }

  return { fontFamily, blocks };
}
