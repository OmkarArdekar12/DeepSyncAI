from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import GEMINI_API_KEY

def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-3-flash-preview",
        google_api_key=GEMINI_API_KEY,
        temperature=0
    )