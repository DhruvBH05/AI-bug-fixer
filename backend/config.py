from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "AI Bug Fixer"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # AI Provider (e.g. OpenAI, Anthropic)
    AI_API_KEY: str = ""
    AI_MODEL: str = "gpt-4o"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()