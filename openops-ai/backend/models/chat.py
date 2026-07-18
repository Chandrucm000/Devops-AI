from typing import Literal
from pydantic import BaseModel, Field

Mode = Literal["no_integration", "connected"]

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    mode: Mode
    capability: str

class ChatResponse(BaseModel):
    mode: Mode
    capability: str
    answer: str
    suggestions: list[str]
