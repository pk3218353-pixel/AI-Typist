import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const OcrPage = lazy(() => import('./pages/OcrPage'));
const VoiceTypistPage = lazy(() => import('./pages/VoiceTypistPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ocr" element={<OcrPage />} />
            <Route path="/voice" element={<VoiceTypistPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
