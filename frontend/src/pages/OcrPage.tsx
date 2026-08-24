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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fontFamilyRef = useRef('mangal');

  const handleUpload = useCallback(
    async (file: File) => {
      setImageUrl(URL.createObjectURL(file));
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
        setImageUrl(null); // Clear image url if processing failed
      } finally {
        setLoading(false);
      }
    },
    [languages, preprocess],
  );

  const handleReset = useCallback(() => {
    setEditorContent(undefined);
    setImageUrl(null);
    setOcrMeta(null);
    setError(null);
  }, []);

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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Image to Document</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Convert image text into an editable Word document with Hindi and regional font support.
          </p>
        </div>
        {editorContent && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50/30 transition-all"
          >
            Start New Scan
          </button>
        )}
      </div>

      {!editorContent ? (
        <OcrUpload
          onFileSelect={handleUpload}
          loading={loading}
          languages={languages}
          onLanguagesChange={setLanguages}
          preprocess={preprocess}
          onPreprocessChange={setPreprocess}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Uploaded Image Preview */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-700">Reference Document</span>
                {ocrMeta && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {ocrMeta.provider} OCR
                  </span>
                )}
              </div>
              <div className="relative flex justify-center items-center bg-slate-100/50 rounded-2xl overflow-hidden mt-3 max-h-[300px] md:max-h-[500px] border border-slate-100">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Original Uploaded Reference"
                    className="max-h-[300px] md:max-h-[500px] w-full object-contain rounded-2xl select-none"
                  />
                )}
              </div>
            </div>
            {ocrMeta && (
              <div className="rounded-2xl bg-slate-100/80 p-4 border border-slate-200/40 text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>Confidence Threshold: <strong>{(ocrMeta.threshold * 100).toFixed(0)}%</strong></span>
                <span>Flagged low confidence words in orange</span>
              </div>
            )}
          </div>

          {/* Right Side: TipTap Editor Workspace */}
          <div className="lg:col-span-7">
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
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 border border-red-100 text-sm font-bold text-red-700 max-w-xl mx-auto shadow-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
