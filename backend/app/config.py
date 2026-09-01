"""
Central configuration and feature flags for free vs paid services.

When USE_GOOGLE_VISION / USE_GOOGLE_SPEECH / USE_WHISPER are False,
the application automatically uses free open-source alternatives.
"""
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Feature flags — flip to True to enable paid API providers
    USE_GOOGLE_VISION: bool = False
    USE_GOOGLE_SPEECH: bool = False
    USE_WHISPER: bool = False
    ENABLE_EASYOCR_FALLBACK: bool = False

    # OCR settings
    OCR_CONFIDENCE_THRESHOLD: float = 0.75
    OCR_PRIMARY_LANG: str = "hin+eng"
    TESSERACT_CMD: str | None = None

    # API keys — loaded from .env, never hardcoded
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None
    OPENAI_API_KEY: str | None = None

    # CORS — comma-separated string or JSON list in .env
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://ai-typist-liard.vercel.app,https://ai-typist.vercel.app"

    API_PREFIX: str = "/api"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors(cls, value: str | list[str]) -> str:
        if isinstance(value, list):
            return ",".join(value)
        return str(value)

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
