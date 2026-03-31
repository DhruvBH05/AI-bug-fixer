from fastapi import APIRouter
from utils.response_handler import success_response

router = APIRouter()


@router.get("/health")
async def health_check():
    return success_response(data={"status": "ok"}, message="Service is healthy")