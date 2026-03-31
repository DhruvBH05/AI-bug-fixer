from fastapi import APIRouter, HTTPException
from models.bug_fixer_models import BugFixRequest, BugFixResponse
from services.bug_fixer_service import BugFixerService
from utils.response_handler import success_response
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
service = BugFixerService()


@router.post("/fix-bug", response_model=dict)
async def fix_bug(payload: BugFixRequest):
    try:
        result = await service.analyze_and_fix(payload)
        return success_response(data=result.model_dump(), message="Bug analysis complete")
    except Exception as e:
        logger.error(f"Bug fix failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))