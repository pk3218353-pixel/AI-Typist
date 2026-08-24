/**
 * Landing page with feature overview and navigation.
 */
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold text-indigo-800 backdrop-blur-sm">
          <span>✨</span> Now fully live and cloud-connected
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Modern Document Processing,{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
            Supercharged by AI
          </span>
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
          Convert document images to text with smart confidence flagging, or dictate live using your voice. Export formatted documents in seconds.
        </p>
      </section>

      {/* Feature Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        <Link
          to="/ocr"
          className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/80 hover:shadow-xl hover:shadow-indigo-100/30 flex flex-col justify-between"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-700 transition">
              Image to Document (OCR)
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed font-medium">
              Upload photos or scans of pages. Review flagged low-confidence words in our side-by-side editor, and download pre-styled Microsoft Word `.docx` documents.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
            Start Scanning <span>→</span>
          </div>
        </Link>

        <Link
          to="/voice"
          className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/80 hover:shadow-xl hover:shadow-violet-100/30 flex flex-col justify-between"
        >
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-violet-700 transition">
              Voice Dictation Typist
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed font-medium">
              Speak naturally in Hindi, English, Tamil, and other regional languages. Watch transcription flow directly into your editor live, ready to format and download.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm font-bold text-violet-600 group-hover:text-violet-700">
            Start Dictating <span>→</span>
          </div>
        </Link>
      </div>

      {/* Interactive Mockup Preview */}
      <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100 flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Features Spotlight
          </span>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            Review Flagged OCR Words Side-by-Side
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm font-medium">
            AI Typist highlights words with low confidence in a custom color. You can quickly select and cycle through them, typing corrections in context or accepting them with one click.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Free Tesseract & EasyOCR fallbacks
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Native Microsoft Word formatting export
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Optimized for Indian regional typography
            </li>
          </ul>
        </div>
        
        <div className="w-full lg:w-[480px] rounded-2xl bg-slate-950 p-4 font-mono text-[10px] text-slate-400 shadow-inner flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="ml-1 text-slate-500 font-bold">ai-typist-editor.exe</span>
            </div>
            <span className="text-xs">OCR Confidence Panel</span>
          </div>
          <div className="space-y-1.5 py-1">
            <div className="text-slate-300">{"// OCR Text Output (Low confidence flagged)"}</div>
            <div className="text-slate-300">
              यह एक <span className="rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 px-1 py-0.5">सस्ता [62%]</span> दस्तावेज़ है जिसे <span className="rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 px-1 py-0.5">संशोधित [51%]</span> किया जा रहा है।
            </div>
            <div className="text-slate-600 mt-3">{"// Review List"}</div>
            <div className="flex items-center justify-between rounded bg-slate-900 border border-slate-800 p-2 text-slate-300">
              <span>Word: "सस्ता" (62% confidence)</span>
              <div className="flex gap-1.5">
                <span className="bg-green-600/90 text-white rounded px-2 py-0.5 cursor-pointer text-[9px] hover:bg-green-500">Confirm</span>
                <span className="bg-slate-700 text-white rounded px-2 py-0.5 cursor-pointer text-[9px] hover:bg-slate-600">Correct</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
