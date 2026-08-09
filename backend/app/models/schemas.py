"""Pydantic request/response models for API endpoints."""
from pydantic import BaseModel, Field


class OcrWordOut(BaseModel):
    text: str
    confidence: float
    uncertain: bool
    line_index: int = 0


class OcrResponse(BaseModel):
    provider: str
    full_text: str
    words: list[OcrWordOut]
    threshold: float


class TextRun(BaseModel):
    text: str = ""
    bold: bool = False
    italic: bool = False
    underline: bool = False
    fontSize: int = 14
    uncertain: bool = False


class ParagraphBlock(BaseModel):
    type: str = "paragraph"
    align: str = "left"
    runs: list[TextRun] = Field(default_factory=list)


class DocxExportRequest(BaseModel):
    fontFamily: str = "mangal"
    blocks: list[ParagraphBlock] = Field(default_factory=list)
