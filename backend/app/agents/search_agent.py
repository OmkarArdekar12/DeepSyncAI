from langchain.agents import create_agent
from app.core.llm import get_llm
from app.tools.web_tools import web_search

def build_search_agent():
    llm = get_llm()

    return create_agent(
        model=llm,
        tools=[web_search],
        system_prompt="You are a research assistant. Find the most relevant and recent information using web search."
    )