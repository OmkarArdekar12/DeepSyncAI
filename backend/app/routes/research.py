from fastapi import APIRouter
from app.services.research_service import run_research
from app.schemas.research_schema import ResearchRequest

router = APIRouter(prefix="/research", tags=["Research"])

@router.post("/")
def research(request: ResearchRequest):
    return run_research(request.topic)
