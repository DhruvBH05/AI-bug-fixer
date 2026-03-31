from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class Language(str, Enum):
    python = "python"
    javascript = "javascript"
    typescript = "typescript"
    java = "java"
    cpp = "cpp"
    go = "go"


class BugFixRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Buggy source code")
    language: Language = Field(..., description="Programming language")
    error_message: Optional[str] = Field(None, description="Optional error/stack trace")
    context: Optional[str] = Field(None, description="Additional context about the bug")


class BugFixResponse(BaseModel):
    original_code: str
    fixed_code: str
    explanation: str
    bugs_found: list[str]
    language: Language