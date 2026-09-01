import { useCallback, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Editor } from '@tiptap/react';

import axios from 'axios';
import OcrUpload from '../components/OcrUpload';
import RichTextEditor from '../components/RichTextEditor/RichTextEditor';
import { extractOcr, exportDocx, downloadBlob } from '../api/client';
import { ocrWordsToTipTapDoc } from '../utils/ocrToEditor';
import { editorToDocxPayload } from '../utils/editorExport';
import { getDocument, saveDocument } from '../utils/storage';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [documentTitle, setDocumentTitle] = useState('Untitled OCR Document');
  const fontFamilyRef = useRef('mangal');

  const docId = searchParams.get('id');

  // Load existing document if id parameter is set
  useEffect(() => {
    if (docId) {
      const doc = getDocument(docId);
      if (doc && doc.type === 'ocr') {
        setEditorContent(doc.content);
        setDocumentTitle(doc.title);
        fontFamilyRef.current = doc.fontFamily;
        setContentKey((k) => k + 1);
      }
    }
  }, [docId]);

  const handleUpload = useCallback(
    async (file: File) => {
      setImageUrl(URL.createObjectURL(file));
      setLoading(true);
      setError(null);
      try {
        const result = await extractOcr(file, languages, preprocess);
        const doc = ocrWordsToTipTapDoc(result.words);

        // Generate a new ID and save the document
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 9);
        const newTitle = `Scan - ${new Date().toLocaleDateString()}`;

        const newDoc = {
          id: newId,
          title: newTitle,
          content: doc as unknown as Record<string, unknown>,
          fontFamily: fontFamilyRef.current,
          updatedAt: new Date().toISOString(),
          type: 'ocr' as const,
        };
        saveDocument(newDoc);

        setDocumentTitle(newTitle);
        setEditorContent(doc as unknown as Record<string, unknown>);
        setContentKey((k) => k + 1);
        setOcrMeta({ provider: result.provider, threshold: result.threshold });
        setSearchParams({ id: newId });
      } catch (err: unknown) {
        let message = 'OCR extraction failed';
        if (axios.isAxiosError(err)) {
          if (err.response?.data?.detail) {
            message = String(err.response.data.detail);
          } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
            message = 'Unable to reach backend server. If using the free cloud tier, the server may be waking up (cold start ~30s). Please try again in a few moments.';
          } else {
            message = err.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    },
    [languages, preprocess, setSearchParams],
  );

  const handleReset = useCallback(() => {
    setEditorContent(undefined);
    setImageUrl(null);
    setOcrMeta(null);
    setError(null);
    setSearchParams({});
  }, [setSearchParams]);

  const handleEditorChange = useCallback(
    (content: Record<string, unknown>) => {
      if (docId) {
        const doc = getDocument(docId);
        if (doc) {
          const updated = {
            ...doc,
            content,
            updatedAt: new Date().toISOString(),
          };
          saveDocument(updated);
        }
      }
    },
    [docId],
  );

  const handleTitleChange = (newTitle: string) => {
    setDocumentTitle(newTitle);
    if (docId) {
      const doc = getDocument(docId);
      if (doc) {
        const updated = {
          ...doc,
          title: newTitle,
          updatedAt: new Date().toISOString(),
        };
        saveDocument(updated);
      }
    }
  };

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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Image to Document</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Convert image text into an editable Word document with Hindi and regional font support.
          </p>
        </div>
        {editorContent && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 hover:border-red-200 hover:text-red-600 hover:bg-red-50/30 dark:hover:border-red-900/60 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all shadow-sm"
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
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-700 dark:text-slate-300">Reference Document</span>
                {ocrMeta && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-350 uppercase tracking-wider">
                    {ocrMeta.provider} OCR
                  </span>
                )}
              </div>
              <div className="relative flex justify-center items-center bg-slate-100/50 dark:bg-slate-950/20 rounded-2xl overflow-hidden mt-3 max-h-[300px] md:max-h-[500px] border border-slate-100 dark:border-slate-800">
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
              <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 p-4 border border-slate-200/40 dark:border-slate-800/40 text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between shadow-sm">
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
              onChange={handleEditorChange}
              title={documentTitle}
              onTitleChange={handleTitleChange}
              fontFamily={fontFamilyRef.current}
              onFontFamilyChange={(f) => {
                fontFamilyRef.current = f;
                if (docId) {
                  const doc = getDocument(docId);
                  if (doc) {
                    const updated = {
                      ...doc,
                      fontFamily: f,
                      updatedAt: new Date().toISOString(),
                    };
                    saveDocument(updated);
                  }
                }
              }}
              onExport={handleExport}
              exportLabel={exporting ? 'Exporting…' : 'Download .docx'}
              showUncertainPanel
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/40 text-sm font-bold text-red-700 dark:text-red-400 max-w-xl mx-auto shadow-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
