"""Unit tests for OCR factory provider selection."""
from app.config import settings
from app.services.ocr.factory import get_fallback_provider, get_ocr_provider
from app.services.ocr.tesseract_ocr import TesseractOCR
from app.services.ocr.easyocr_provider import EasyOCRProvider


def test_default_provider_is_tesseract():
    """When USE_GOOGLE_VISION is False, primary provider should be Tesseract (FREE)."""
    original = settings.USE_GOOGLE_VISION
    settings.USE_GOOGLE_VISION = False
    try:
        provider = get_ocr_provider()
        assert isinstance(provider, TesseractOCR)
    finally:
        settings.USE_GOOGLE_VISION = original


def test_fallback_provider_is_easyocr():
    """Fallback provider should always be EasyOCR (FREE)."""
    provider = get_fallback_provider()
    assert isinstance(provider, EasyOCRProvider)
