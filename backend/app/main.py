from fastapi import FastAPI
from app.routes.research import router as research_router

app = FastAPI(
    title="Multi-Agent Research API",
    description="AI-powered research system using Gemini + Tavily + Agents",
    version="1.0.0"
)

app.include_router(research_router)

@app.get("/")
def home():
    return {
        "message": "Multi-Agent Research API is running"
    }