import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import OcrPage from './pages/OcrPage';
import VoiceTypistPage from './pages/VoiceTypistPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/ocr" element={<OcrPage />} />
          <Route path="/voice" element={<VoiceTypistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
