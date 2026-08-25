/** Shared TypeScript types for OCR and document export */

export interface OcrWord {
  text: string;
  confidence: number;
  uncertain: boolean;
  line_index: number;
}

export interface OcrResponse {
  provider: string;
  full_text: string;
  words: OcrWord[];
  threshold: number;
}

export interface TextRun {
  text: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  uncertain: boolean;
}

export interface ParagraphBlock {
  type: 'paragraph';
  align: 'left' | 'center' | 'right';
  runs: TextRun[];
}

export interface DocxExportPayload {
  fontFamily: string;
  blocks: ParagraphBlock[];
}

export type SpeechLang =
  | 'hi-IN'
  | 'en-IN'
  | 'en-US'
  | 'ta-IN'
  | 'te-IN'
  | 'mr-IN'
  | 'gu-IN'
  | 'bn-IN';

export const SPEECH_LANG_OPTIONS: { value: SpeechLang; label: string }[] = [
  { value: 'hi-IN', label: 'Hindi (India)' },
  { value: 'en-IN', label: 'English (India)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'ta-IN', label: 'Tamil' },
  { value: 'te-IN', label: 'Telugu' },
  { value: 'mr-IN', label: 'Marathi' },
  { value: 'gu-IN', label: 'Gujarati' },
  { value: 'bn-IN', label: 'Bengali' },
];

export const FONT_OPTIONS = [
  { value: 'mangal', label: 'Mangal', css: 'Mangal, sans-serif' },
  { value: 'noto-devanagari', label: 'Noto Sans Devanagari', css: '"Noto Sans Devanagari", sans-serif' },
  { value: 'lohit-devanagari', label: 'Lohit Devanagari', css: '"Lohit Devanagari", sans-serif' },
  { value: 'arial', label: 'Arial', css: 'Arial, sans-serif' },
];

export interface LocalDocument {
  id: string;
  title: string;
  content: Record<string, unknown>;
  fontFamily: string;
  updatedAt: string;
  type: 'ocr' | 'voice';
}

