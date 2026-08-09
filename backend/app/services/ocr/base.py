"""Abstract OCR provider interface — all engines implement extract()."""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class OcrWord:
    """Single word with confidence score for highlighting uncertain text."""

    text: str
    confidence: float
    bbox: tuple[int, int, int, int] | None = None
    line_index: int = 0
    paragraph_index: int = 0


@dataclass
class OcrResult:
    """Full OCR output with word-level metadata."""

    words: list[OcrWord] = field(default_factory=list)
    full_text: str = ""
    provider: str = "unknown"


class OCRProvider(ABC):
    """Strategy interface — swap Tesseract, EasyOCR, or Google Vision via factory."""

    @abstractmethod
    def extract(self, image_bytes: bytes, languages: list[str]) -> OcrResult:
        """Run OCR on raw image bytes and return word-level confidence data."""
        ...
