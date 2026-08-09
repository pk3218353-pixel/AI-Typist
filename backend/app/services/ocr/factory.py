"""
OCR provider factory — selects engine based on config feature flags.

Priority:
  1. Google Cloud Vision (PAID) if USE_GOOGLE_VISION
  2. Tesseract (FREE) as primary
  EasyOCR (FREE) used as route-level fallback when confidence is low.
"""
from app.config import settings
from app.services.ocr.base import OCRProvider
from app.services.ocr.easyocr_provider import EasyOCRProvider
from app.services.ocr.google_vision import GoogleVisionOCR
from app.services.ocr.tesseract_ocr import TesseractOCR


def get_ocr_provider() -> OCRProvider:
    """Return the configured primary OCR provider."""
    if settings.USE_GOOGLE_VISION:
        return GoogleVisionOCR()
    return TesseractOCR()


def get_fallback_provider() -> OCRProvider:
    """Return the free EasyOCR fallback provider."""
    return EasyOCRProvider()
