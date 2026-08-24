/**
 * Voice typist page — live Web Speech API transcription into TipTap editor.
 */
import { useCallback, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';

import RichTextEditor from '../components/RichTextEditor/RichTextEditor';
import VoiceControls from '../components/VoiceControls';
import { useWebSpeech } from '../hooks/useWebSpeech';
import { exportDocx, downloadBlob } from '../api/client';
import { editorToDocxPayload } from '../utils/editorExport';
import type { SpeechLang } from '../types';

export default function VoiceTypistPage() {
  const editorRef = useRef<Editor | null>(null);
  const [language, setLanguage] = useState<SpeechLang>('hi-IN');
  const [interimText, setInterimText] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const fontFamilyRef = useRef('mangal');

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
    <div className="space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Voice Typist</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">
          Dictate documents live with real-time speech transcription in Hindi, English, and regional languages.
        </p>
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
        <div className="rounded-2xl bg-red-50 p-4 border border-red-100 text-sm font-bold text-red-700 max-w-xl mx-auto shadow-sm">
          ⚠️ {exportError}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <RichTextEditor
          onEditorReady={(ed) => {
            editorRef.current = ed;
          }}
          onFontFamilyChange={(f) => {
            fontFamilyRef.current = f;
          }}
          onExport={handleExport}
          exportLabel={exporting ? 'Exporting…' : 'Download .docx'}
          showUncertainPanel={false}
        />
      </div>
    </div>
  );
}
