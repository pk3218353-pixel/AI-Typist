/**
 * Microphone controls for live voice transcription (Web Speech API — FREE).
 */
import type { SpeechLang } from '../types';
import { SPEECH_LANG_OPTIONS } from '../types';

interface VoiceControlsProps {
  listening: boolean;
  supported: boolean;
  language: SpeechLang;
  onLanguageChange: (lang: SpeechLang) => void;
  onStart: () => void;
  onStop: () => void;
  interimText?: string;
  error?: string | null;
}

export default function VoiceControls({
  listening,
  supported,
  language,
  onLanguageChange,
  onStart,
  onStop,
  interimText,
  error,
}: VoiceControlsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">Voice typing</h2>

      {!supported && (
        <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">
          Web Speech API is not supported. Use Chrome or Microsoft Edge.
        </p>
      )}

      {error && (
        <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
      )}

      <label className="mb-3 block text-sm font-medium text-slate-700">
        Speech language
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as SpeechLang)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          disabled={listening}
        >
          {SPEECH_LANG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-3">
        {!listening ? (
          <button
            type="button"
            onClick={onStart}
            disabled={!supported}
            className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            <span className="text-lg">🎤</span> Start recording
          </button>
        ) : (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-2 rounded-full bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-red-400" />
            Stop recording
          </button>
        )}
      </div>

      {interimText && (
        <p className="mt-3 rounded bg-slate-100 p-2 text-sm italic text-slate-600">
          Listening: {interimText}
        </p>
      )}
    </div>
  );
}
