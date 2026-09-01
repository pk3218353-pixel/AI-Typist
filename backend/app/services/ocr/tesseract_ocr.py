"""
FREE primary OCR using Tesseract with per-word confidence scores.

Requires Tesseract installed on the host with language packs (hin, eng, etc.).
"""
import io

import pytesseract
from PIL import Image
from pytesseract import Output

from app.config import settings
from app.services.ocr.base import OCRProvider, OcrResult, OcrWord


class TesseractOCR(OCRProvider):
    """Tesseract OCR — free, open-source, primary engine."""

    def __init__(self) -> None:
        if settings.TESSERACT_CMD:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    def extract(self, image_bytes: bytes, languages: list[str]) -> OcrResult:
        try:
            available = pytesseract.get_languages()
        except Exception:
            available = []

        if available and languages:
            valid = [l for l in languages if l in available]
            lang = "+".join(valid) if valid else "+".join([l for l in ["hin", "eng"] if l in available] or ["eng"])
        elif languages:
            lang = "+".join(languages)
        else:
            lang = settings.OCR_PRIMARY_LANG

        image = Image.open(io.BytesIO(image_bytes))
        try:
            data = pytesseract.image_to_data(image, lang=lang, output_type=Output.DICT)
        except Exception:
            # Fallback to default or eng if custom language fails
            data = pytesseract.image_to_data(image, lang="eng", output_type=Output.DICT)

        words: list[OcrWord] = []
        lines: dict[int, list[str]] = {}

        for i, text in enumerate(data["text"]):
            if not text or not str(text).strip():
                continue
            conf = float(data["conf"][i])
            if conf < 0:
                conf = 0.0
            conf /= 100.0
            line_num = int(data["line_num"][i])
            words.append(
                OcrWord(
                    text=text.strip(),
                    confidence=conf,
                    bbox=(
                        int(data["left"][i]),
                        int(data["top"][i]),
                        int(data["width"][i]),
                        int(data["height"][i]),
                    ),
                    line_index=line_num,
                )
            )
            lines.setdefault(line_num, []).append(text.strip())

        full_text = "\n".join(" ".join(lines[k]) for k in sorted(lines))
        return OcrResult(words=words, full_text=full_text, provider="tesseract")
