"""
OCR upload endpoint — FREE Tesseract/EasyOCR or PAID Google Vision via factory.

POST /api/ocr/extract accepts an image and returns word-level confidence for highlighting.
"""
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import settings
from app.models.schemas import OcrResponse, OcrWordOut
from app.services.ocr.factory import get_fallback_provider, get_ocr_provider
from app.utils.image_preprocess import preprocess_image

router = APIRouter(prefix="/ocr", tags=["ocr"])


@router.post("/extract", response_model=OcrResponse)
async def extract_text(
    file: UploadFile = File(...),
    languages: str = Form("hin,eng"),
    use_fallback: bool = Form(True),
    preprocess: bool = Form(False),
):
    """
    Extract text from an uploaded document image.

    Uses Tesseract (FREE) by default; EasyOCR (FREE) fallback when confidence is low;
    Google Vision (PAID) when USE_GOOGLE_VISION=true.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload must be an image file")

    image_bytes = await file.read()
    if preprocess:
        image_bytes = preprocess_image(image_bytes)

    lang_list = [lang.strip() for lang in languages.split(",") if lang.strip()]

    provider = get_ocr_provider()
    try:
        result = provider.extract(image_bytes, lang_list)
    except Exception as e:
        if not settings.USE_GOOGLE_VISION:
            import logging
            logging.warning(f"Primary OCR provider failed ({e}). Falling back to EasyOCR...")
            result = get_fallback_provider().extract(image_bytes, lang_list)
        else:
            raise

    avg_conf = sum(w.confidence for w in result.words) / max(len(result.words), 1)
    if (
        use_fallback
        and not settings.USE_GOOGLE_VISION
        and result.provider != "easyocr"
        and avg_conf < settings.OCR_CONFIDENCE_THRESHOLD
    ):
        try:
            result = get_fallback_provider().extract(image_bytes, lang_list)
        except Exception as e:
            import logging
            logging.error(f"EasyOCR fallback also failed: {e}")
            raise

    threshold = settings.OCR_CONFIDENCE_THRESHOLD
    words_out = [
        OcrWordOut(
            text=w.text,
            confidence=w.confidence,
            uncertain=w.confidence < threshold,
            line_index=w.line_index,
        )
        for w in result.words
    ]

    return OcrResponse(
        provider=result.provider,
        full_text=result.full_text,
        words=words_out,
        threshold=threshold,
    )
