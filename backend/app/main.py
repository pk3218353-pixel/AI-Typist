"""
FastAPI application entrypoint for AI Typist backend.

Registers CORS, OCR routes, and document export routes.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_document, routes_ocr
from app.config import settings

app = FastAPI(
    title="AI Typist API",
    description="OCR and document export backend for AI Typist",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_ocr.router, prefix=settings.API_PREFIX)
app.include_router(routes_document.router, prefix=settings.API_PREFIX)


@app.get("/health")
def health_check():
    """Health check — reports which paid features are enabled."""
    return {
        "status": "ok",
        "use_google_vision": settings.USE_GOOGLE_VISION,
        "use_google_speech": settings.USE_GOOGLE_SPEECH,
        "use_whisper": settings.USE_WHISPER,
    }
