"""
PAID plug-in OCR via Google Cloud Vision API.

Enabled when USE_GOOGLE_VISION=true in config — requires GOOGLE_APPLICATION_CREDENTIALS.
"""
from google.cloud import vision

from app.services.ocr.base import OCRProvider, OcrResult, OcrWord


class GoogleVisionOCR(OCRProvider):
    """Google Cloud Vision — paid, plug-and-play via feature flag."""

    def extract(self, image_bytes: bytes, languages: list[str]) -> OcrResult:
        del languages  # Vision auto-detects scripts; hint could be added via image_context
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_bytes)
        response = client.document_text_detection(image=image)

        if response.error.message:
            raise RuntimeError(response.error.message)

        words: list[OcrWord] = []
        full_parts: list[str] = []
        line_idx = 0

        annotation = response.full_text_annotation
        if not annotation:
            return OcrResult(words=[], full_text="", provider="google_vision")

        for page in annotation.pages:
            for block in page.blocks:
                block_lines: list[str] = []
                for paragraph in block.paragraphs:
                    for word in paragraph.words:
                        text = "".join(symbol.text for symbol in word.symbols)
                        conf = getattr(word, "confidence", 1.0) or 1.0
                        verts = word.bounding_box.vertices
                        xs = [v.x for v in verts]
                        ys = [v.y for v in verts]
                        bbox = (min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys))
                        words.append(
                            OcrWord(text=text, confidence=float(conf), bbox=bbox, line_index=line_idx)
                        )
                        block_lines.append(text)
                    line_idx += 1
                full_parts.append(" ".join(block_lines))

        return OcrResult(
            words=words,
            full_text="\n\n".join(full_parts),
            provider="google_vision",
        )
