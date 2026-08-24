/**
 * OCR image upload component — sends image to backend for text extraction.
 */
import { useState } from 'react';

interface OcrUploadProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  languages: string;
  onLanguagesChange: (value: string) => void;
  preprocess: boolean;
  onPreprocessChange: (value: boolean) => void;
}

const LANGUAGE_PRESETS = [
  { label: 'Hindi + English', value: 'hin,eng' },
  { label: 'English Only', value: 'eng' },
  { label: 'Hindi Only', value: 'hin' },
  { label: 'Tamil + English', value: 'tam,eng' },
  { label: 'Marathi + English', value: 'mar,eng' },
  { label: 'Bengali + English', value: 'ben,eng' },
];

export default function OcrUpload({
  onFileSelect,
  loading,
  languages,
  onLanguagesChange,
  preprocess,
  onPreprocessChange,
}: OcrUploadProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Upload document image</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Supports handwriting and print. Upload an image to begin extraction.
        </p>
      </div>

      {/* Language Selection Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">
          Document Language
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_PRESETS.map((preset) => {
            const active = languages === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onLanguagesChange(preset.value)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  active
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              showAdvanced
                ? 'border-slate-700 bg-slate-800 text-white'
                : 'border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            {showAdvanced ? 'Hide Advanced' : 'Custom Codes...'}
          </button>
        </div>

        {showAdvanced && (
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 mt-2 space-y-1.5 animate-fadeIn">
            <span className="text-xs font-bold text-slate-700">Tesseract Language Codes (comma-separated)</span>
            <input
              type="text"
              value={languages}
              onChange={(e) => onLanguagesChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. hin,eng,tam"
            />
            <span className="text-[10px] text-slate-500 block">Use standard codes like: `hin` (Hindi), `eng` (English), `tam` (Tamil), `tel` (Telugu), `mar` (Marathi).</span>
          </div>
        )}
      </div>

      {/* Options Row */}
      <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
        <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={preprocess}
            onChange={(e) => onPreprocessChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Auto-preprocess image (improves contrast for scans)
        </label>
      </div>

      {/* Upload Dropzone */}
      <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 px-6 py-12 hover:bg-indigo-50/50 hover:border-indigo-400/60 transition-all duration-300 group">
        <span className="mb-3 text-5xl group-hover:scale-110 transition duration-300">
          {loading ? '⚙️' : '📸'}
        </span>
        <span className="text-base font-bold text-indigo-950">
          {loading ? 'Processing Document with OCR…' : 'Select or drag document image'}
        </span>
        <span className="text-xs text-slate-500 font-medium mt-1">
          Supports PNG, JPG, JPEG (handwritten or typed)
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={loading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
      </label>
    </div>
  );
}
