# AI Typist

Web-based AI typist application with **Image-to-Document (OCR)** and **Voice-to-Text** features.

- **Backend:** Python FastAPI — OCR on server, `.docx` export
- **Frontend:** React + TailwindCSS + TipTap rich text editor
- **Free defaults:** Tesseract OCR, EasyOCR fallback, Web Speech API
- **Paid upgrades (config flags):** Google Cloud Vision, Google Speech-to-Text, OpenAI Whisper

---

## Features

| Feature | Free (default) | Paid upgrade (`.env` flag) |
|--------|----------------|----------------------------|
| OCR | Tesseract → EasyOCR fallback | `USE_GOOGLE_VISION=true` |
| Voice | Web Speech API (browser) | `USE_WHISPER` / `USE_GOOGLE_SPEECH` (hooks ready) |
| Export | python-docx | — |

Low-confidence OCR words are highlighted **orange** in the editor. Confirm or correct them before exporting.

---

## Prerequisites (Windows)

1. **Python 3.11+** — [python.org](https://www.python.org/downloads/)
2. **Node.js 20+** — [nodejs.org](https://nodejs.org/)
3. **Tesseract OCR** — [UB Mannheim installer](https://github.com/UB-Mannheim/tesseract/wiki)
   - During install, select **Hindi**, **English**, and any regional language packs you need
   - Default path: `C:\Program Files\Tesseract-OCR\tesseract.exe`
4. **Chrome or Edge** — required for Web Speech API (Hindi/English voice typing)

---

## Project structure

```
ai-typist/
├── backend/          # FastAPI, OCR providers, docx export
├── frontend/         # React + TipTap + Tailwind
├── docker-compose.yml
└── README.md
```

---

## Backend setup (Windows)

```powershell
cd ai-typist\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend\.env`:

```env
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
USE_GOOGLE_VISION=false
OCR_CONFIDENCE_THRESHOLD=0.75
CORS_ORIGINS=http://localhost:5173
```

Start the API:

```powershell
uvicorn app.main:app --reload --port 8000
```

Health check: http://localhost:8000/health

---

## Frontend setup (Windows)

```powershell
cd ai-typist\frontend
npm install
copy .env.example .env
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` to `http://localhost:8000` (see `vite.config.ts`).

---

## Usage

### Image to Document (`/ocr`)

1. Upload a photo of a handwritten or printed document
2. Set languages (e.g. `hin,eng` for Hindi + English)
3. Review orange-highlighted uncertain words in the side panel
4. Click **Download .docx** — uses Mangal / Noto Devanagari fonts when installed on Windows

### Voice Typist (`/voice`)

1. Select speech language (e.g. Hindi India `hi-IN`)
2. Click **Start recording** — text appears live in the editor
3. Click anywhere to edit manually while or after speaking
4. Export to `.docx` when done

---

## Enabling paid APIs

Set flags in `backend/.env` — no code changes required:

```env
USE_GOOGLE_VISION=true
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json
```

```env
USE_WHISPER=true
OPENAI_API_KEY=sk-...
```

Restart the backend after changing `.env`.

---

## Docker (optional)

```powershell
cd ai-typist
docker compose up --build
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health + feature flags |
| POST | `/api/ocr/extract` | Upload image → OCR JSON |
| POST | `/api/document/export-docx` | Editor JSON → `.docx` file |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `TesseractNotFoundError` | Set `TESSERACT_CMD` in `.env` to your `tesseract.exe` path |
| OCR returns empty text | Install `hin` / `eng` language packs; try **Preprocess image** |
| Voice not working | Use Chrome/Edge; allow microphone permission |
| Hindi font missing in Word | Install Mangal or Noto Sans Devanagari on Windows |

---

## License

MIT — uses open-source libraries (Tesseract, EasyOCR, TipTap, FastAPI).
