/**
 * OCR page — upload image, review uncertain words, export .docx.
 */
import { useCallback, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';

import OcrUpload from '../components/OcrUpload';
import RichTextEditor from '../components/RichTextEditor/RichTextEditor';
import { extractOcr, exportDocx, downloadBlob } from '../api/client';
import { ocrWordsToTipTapDoc } from '../utils/ocrToEditor';
import { editorToDocxPayload } from '../utils/editorExport';

export default function OcrPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState('hin,eng');
  const [preprocess, setPreprocess] = useState(false);
  const [editorContent, setEditorContent] = useState<Record<string, unknown> | undefined>();
  const [contentKey, setContentKey] = useState(0);
  const [ocrMeta, setOcrMeta] = useState<{ provider: string; threshold: number } | null>(null);
  const [exporting, setExporting] = useState(false);
  const fontFamilyRef = useRef('mangal');

  const handleUpload = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      try {
        const result = await extractOcr(file, languages, preprocess);
        const doc = ocrWordsToTipTapDoc(result.words);
        setEditorContent(doc as unknown as Record<string, unknown>);
        setContentKey((k) => k + 1);
        setOcrMeta({ provider: result.provider, threshold: result.threshold });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'OCR failed';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [languages, preprocess],
  );

  const handleExport = useCallback(async (editor: Editor) => {
    setExporting(true);
    setError(null);
    try {
      const payload = editorToDocxPayload(editor, fontFamilyRef.current);
      const blob = await exportDocx(payload);
      downloadBlob(blob, 'ocr-document.docx');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed';
      setError(message);
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Image to Document</h1>
        <p className="text-sm text-slate-600">
          OCR via Tesseract (free) with EasyOCR fallback. Low-confidence words appear in orange.
        </p>
      </div>

      <OcrUpload
        onFileSelect={handleUpload}
        loading={loading}
        languages={languages}
        onLanguagesChange={setLanguages}
        preprocess={preprocess}
        onPreprocessChange={setPreprocess}
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {ocrMeta && (
        <p className="text-xs text-slate-500">
          Provider: <strong>{ocrMeta.provider}</strong> · Confidence threshold:{' '}
          {(ocrMeta.threshold * 100).toFixed(0)}%
        </p>
      )}

      {editorContent && (
        <RichTextEditor
          key={contentKey}
          initialContent={editorContent}
          fontFamily={fontFamilyRef.current}
          onFontFamilyChange={(f) => {
            fontFamilyRef.current = f;
          }}
          onExport={handleExport}
          exportLabel={exporting ? 'Exporting…' : 'Download .docx'}
          showUncertainPanel
        />
      )}
    </div>
  );
}
