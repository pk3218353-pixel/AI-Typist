"""
Map UI font identifiers to Windows-installed Devanagari/regional font names for .docx export.
"""

FONT_MAP: dict[str, str] = {
    "mangal": "Mangal",
    "noto-devanagari": "Noto Sans Devanagari",
    "noto sans devanagari": "Noto Sans Devanagari",
    "lohit-devanagari": "Lohit Devanagari",
    "lohit devanagari": "Lohit Devanagari",
    "arial": "Arial",
    "default": "Mangal",
}


def resolve_font(name: str | None) -> str:
    """Resolve a user-facing font key to a .docx font family name."""
    if not name:
        return FONT_MAP["default"]
    key = name.lower().strip()
    return FONT_MAP.get(key, FONT_MAP["default"])
