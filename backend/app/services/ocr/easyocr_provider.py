"""
FREE fallback OCR using EasyOCR — often better on handwriting.

Slower than Tesseract; downloads language models on first use.
"""
import io

import easyocr
import numpy as np
from PIL import Image

from app.services.ocr.base import OCRProvider, OcrResult, OcrWord

# Map Tesseract-style codes to EasyOCR codes
_LANG_MAP = {
    "hin": "hi",
    "hi": "hi",
    "eng": "en",
    "en": "en",
    "tam": "ta",
    "ta": "ta",
    "tel": "te",
    "te": "te",
    "mar": "mr",
    "mr": "mr",
    "guj": "gu",
    "gu": "gu",
    "ben": "bn",
    "bn": "bn",
    "kan": "kn",
    "kn": "kn",
    "mal": "ml",
    "ml": "ml",
    "pan": "pa",
    "pa": "pa",
}


class EasyOCRProvider(OCRProvider):
    """EasyOCR — free, open-source fallback engine."""

    _reader_cache: dict[str, easyocr.Reader] = {}

    def _map_languages(self, languages: list[str]) -> list[str]:
        mapped: list[str] = []
        for lang in languages:
            code = _LANG_MAP.get(lang.lower(), lang.lower()[:2])
            if code not in mapped:
                mapped.append(code)
        return mapped or ["en", "hi"]

    def _reader(self, languages: list[str]) -> easyocr.Reader:
        mapped = self._map_languages(languages)
        key = ",".join(sorted(mapped))
        if key not in self._reader_cache:
            self._reader_cache[key] = easyocr.Reader(mapped, gpu=False)
        return self._reader_cache[key]

    def extract(self, image_bytes: bytes, languages: list[str]) -> OcrResult:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        arr = np.array(image)
        results = self._reader(languages).readtext(arr)

        words: list[OcrWord] = []
        line_buckets: dict[int, list[str]] = {}

        for idx, (_bbox, text, conf) in enumerate(results):
            line_idx = idx // 5
            line_buckets.setdefault(line_idx, []).append(text)
            words.append(OcrWord(text=text, confidence=float(conf), line_index=line_idx))

        full_text = "\n".join(" ".join(line_buckets[k]) for k in sorted(line_buckets))
        return OcrResult(words=words, full_text=full_text, provider="easyocr")
