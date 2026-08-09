/**
 * Landing page with feature overview and navigation.
 */
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">AI Typist</h1>
        <p className="max-w-2xl text-slate-600">
          Convert document images to editable text with OCR review, or dictate directly into a rich
          text editor. Built with free open-source tools, with plug-and-play upgrades for Google
          Cloud Vision and Whisper.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/ocr"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
          <span className="text-3xl">📷</span>
          <h2 className="mt-3 text-xl font-semibold text-slate-900 group-hover:text-indigo-700">
            Image to Document
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload a photo, review low-confidence words highlighted in orange, and export to .docx
            with Hindi/regional fonts.
          </p>
        </Link>

        <Link
          to="/voice"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
          <span className="text-3xl">🎤</span>
          <h2 className="mt-3 text-xl font-semibold text-slate-900 group-hover:text-indigo-700">
            Voice Typist
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Speak in Hindi, English, or regional languages. Live transcription appears in the editor
            while you type and edit freely.
          </p>
        </Link>
      </div>
    </div>
  );
}
