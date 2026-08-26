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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Voice Dictation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Speak to transcribe. Select your language and tap record.
          </p>
        </div>

        {/* Animated Listening Badge */}
        {listening && (
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-100 px-3.5 py-1.5 text-xs font-bold text-red-600 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400 animate-pulse uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400 animate-ping" />
            Live listening
          </div>
        )}
      </div>

      {!supported && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/40 text-sm font-bold text-red-700 dark:text-red-400">
          ⚠️ Web Speech API is not supported in this browser. Please use Chrome or Microsoft Edge.
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-900/40 text-sm font-bold text-red-700 dark:text-red-400">
          ⚠️ Microphone error: {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-12 items-end">
        {/* Language Selection */}
        <div className="md:col-span-5 space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Speech Language
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SpeechLang)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-800"
            disabled={listening}
          >
            {SPEECH_LANG_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Recording Buttons */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-4">
          {!listening ? (
            <button
              type="button"
              onClick={onStart}
              disabled={!supported}
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-200 dark:shadow-red-950/35 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 transition duration-300"
            >
              🎤 Start Recording
            </button>
          ) : (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-2.5 rounded-2xl bg-slate-800 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-slate-900 shadow-md shadow-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 dark:shadow-slate-950/40 hover:-translate-y-0.5 transition duration-300 animate-fadeIn"
            >
              🛑 Stop Recording
            </button>
          )}

          {/* Sound Wave Animation Visualizer */}
          {listening && (
            <div className="flex items-end gap-1 px-4 h-8">
              <span className="w-1 bg-red-500 rounded-full h-full transform origin-bottom animate-wave-1" />
              <span className="w-1 bg-red-500 rounded-full h-full transform origin-bottom animate-wave-2" />
              <span className="w-1 bg-red-500 rounded-full h-full transform origin-bottom animate-wave-3" />
              <span className="w-1 bg-red-500 rounded-full h-full transform origin-bottom animate-wave-4" />
              <span className="w-1 bg-red-500 rounded-full h-full transform origin-bottom animate-wave-5" />
            </div>
          )}
        </div>
      </div>

      {/* Interim Live Transcript */}
      {listening && interimText && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 border-l-4 border-l-indigo-500 animate-fadeIn dark:border-slate-800 dark:bg-slate-950/30 dark:border-l-indigo-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Dictating Live</span>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "{interimText}"
          </p>
        </div>
      )}
    </div>
  );
}
