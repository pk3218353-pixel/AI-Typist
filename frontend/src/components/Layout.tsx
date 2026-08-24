import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/ocr', label: 'Image to Document' },
  { to: '/voice', label: 'Voice Typist' },
];

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Background ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-indigo-200/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] h-[70%] w-[50%] rounded-full bg-violet-200/20 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition">
                ✍️
              </span>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                AI Typist
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 rounded-xl bg-slate-100/80 p-1 border border-slate-200/40">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative rounded-lg px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                      active
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation Panel */}
          {menuOpen && (
            <nav className="flex md:hidden flex-col gap-1 mt-4 rounded-2xl bg-slate-100/50 p-2 border border-slate-200/40 animate-fadeIn">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${
                      active
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:bg-white/30'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>
      
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
