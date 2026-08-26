import { useCallback, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Editor } from '@tiptap/react';

import RichTextEditor from '../components/RichTextEditor/RichTextEditor';
import VoiceControls from '../components/VoiceControls';
import { useWebSpeech } from '../hooks/useWebSpeech';
import { exportDocx, downloadBlob } from '../api/client';
import { editorToDocxPayload } from '../utils/editorExport';
import { getDocument, saveDocument } from '../utils/storage';
import type { SpeechLang } from '../types';

export default function VoiceTypistPage() {
  const editorRef = useRef<Editor | null>(null);
  const [language, setLanguage] = useState<SpeechLang>('hi-IN');
  const [interimText, setInterimText] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [documentTitle, setDocumentTitle] = useState('Untitled Voice Document');
  const [initialContent, setInitialContent] = useState<Record<string, unknown> | undefined>();
  const [contentKey, setContentKey] = useState(0);
  const fontFamilyRef = useRef('mangal');

  const docId = searchParams.get('id');

  // Load existing document if id parameter is set
  useEffect(() => {
    if (docId) {
      const doc = getDocument(docId);
      if (doc && doc.type === 'voice') {
        setInitialContent(doc.content);
        setDocumentTitle(doc.title);
        fontFamilyRef.current = doc.fontFamily;
        setContentKey((k) => k + 1);
      }
    }
  }, [docId]);

  const insertAtCursor = useCallback((text: string) => {
    const editor = editorRef.current;
    if (!editor || !text.trim()) return;
    editor.chain().focus().insertContent(text).run();
  }, []);

  const { listening, supported, start, stop } = useWebSpeech({
    onInterim: setInterimText,
    onFinal: (text) => {
      insertAtCursor(`${text} `);
      setInterimText('');
    },
    onError: (msg) => setSpeechError(msg),
  });

  const handleStart = useCallback(() => {
    setSpeechError(null);
    start(language);
  }, [language, start]);

  const handleReset = useCallback(() => {
    setInitialContent(undefined);
    setDocumentTitle('Untitled Voice Document');
    setSearchParams({});
    setContentKey((k) => k + 1);
  }, [setSearchParams]);

  const handleEditorChange = useCallback(
    (content: Record<string, unknown>) => {
      let currentId = docId;
      if (!currentId) {
        // Auto-create document on first edit or speak
        currentId = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 9);
        const newTitle = `Dictation - ${new Date().toLocaleDateString()}`;

        const newDoc = {
          id: currentId,
          title: newTitle,
          content,
          fontFamily: fontFamilyRef.current,
          updatedAt: new Date().toISOString(),
          type: 'voice' as const,
        };
        saveDocument(newDoc);
        setDocumentTitle(newTitle);
        setSearchParams({ id: currentId });
      } else {
        // Update existing document
        const doc = getDocument(currentId);
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
    [docId, setSearchParams],
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
    setExportError(null);
    try {
      const payload = editorToDocxPayload(editor, fontFamilyRef.current);
      const blob = await exportDocx(payload);
      downloadBlob(blob, 'voice-document.docx');
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Voice Typist</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Dictate documents live with real-time speech transcription in Hindi, English, and regional languages.
          </p>
        </div>
        {docId && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 hover:border-red-200 hover:text-red-600 hover:bg-red-50/30 dark:hover:border-red-900/60 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-all shadow-sm"
          >
            Start New Dictation
          </button>
        )}
      </div>

      <VoiceControls
        listening={listening}
        supported={supported}
        language={language}
        onLanguageChange={setLanguage}
        onStart={handleStart}
        onStop={stop}
        interimText={interimText}
        error={speechError}
      />

      {exportError && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/40 text-sm font-bold text-red-700 dark:text-red-400 max-w-xl mx-auto shadow-sm">
          ⚠️ {exportError}
        </div>
      )}

      <div>
        <RichTextEditor
          key={contentKey}
          initialContent={initialContent}
          onChange={handleEditorChange}
          title={documentTitle}
          onTitleChange={handleTitleChange}
          onEditorReady={(ed) => {
            editorRef.current = ed;
          }}
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
          showUncertainPanel={false}
        />
      </div>
    </div>
  );
}
