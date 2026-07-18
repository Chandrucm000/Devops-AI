from fastapi import APIRouter
from models.chat import ChatRequest, ChatResponse
from services.analysis import analyse_request

router = APIRouter(tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    result = analyse_request(request.mode, request.capability, request.message)
    return ChatResponse(mode=request.mode, capability=request.capability, **result)
