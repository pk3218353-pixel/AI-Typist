"""
Document export endpoint — generates .docx using python-docx (FREE).
"""
from io import BytesIO

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import DocxExportRequest
from app.services.document.docx_generator import build_docx

router = APIRouter(prefix="/document", tags=["document"])


@router.post("/export-docx")
async def export_docx(body: DocxExportRequest):
    """Export editor content to a downloadable Word document with formatting preserved."""
    content = build_docx(body.model_dump())
    return StreamingResponse(
        BytesIO(content),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": 'attachment; filename="document.docx"'},
    )
