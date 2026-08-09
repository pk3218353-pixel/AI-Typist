/**
 * OCR image upload component — sends image to backend for text extraction.
 */
interface OcrUploadProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  languages: string;
  onLanguagesChange: (value: string) => void;
  preprocess: boolean;
  onPreprocessChange: (value: boolean) => void;
}

export default function OcrUpload({
  onFileSelect,
  loading,
  languages,
  onLanguagesChange,
  preprocess,
  onPreprocessChange,
}: OcrUploadProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
      <h2 className="mb-2 text-lg font-semibold text-slate-800">Upload document image</h2>
      <p className="mb-4 text-sm text-slate-600">
        Supports handwritten or printed Hindi, English, and regional Indian languages.
      </p>

      <label className="mb-4 block text-sm font-medium text-slate-700">
        OCR languages (comma-separated Tesseract codes)
        <input
          type="text"
          value={languages}
          onChange={(e) => onLanguagesChange(e.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="hin,eng"
        />
      </label>

      <label className="mb-4 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={preprocess}
          onChange={(e) => onPreprocessChange(e.target.checked)}
        />
        Preprocess image (contrast enhancement)
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 bg-white px-6 py-10 hover:bg-indigo-50">
        <span className="mb-2 text-4xl">📄</span>
        <span className="text-sm font-medium text-indigo-700">
          {loading ? 'Processing OCR…' : 'Click or drag an image here'}
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
