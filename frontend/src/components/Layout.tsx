/**
 * Application shell with navigation between OCR and Voice typist pages.
 */
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/ocr', label: 'Image to Document' },
  { to: '/voice', label: 'Voice Typist' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-indigo-700">
            AI Typist
          </Link>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  location.pathname === item.to
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
