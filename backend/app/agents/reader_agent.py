from langchain.agents import create_agent
from app.core.llm import get_llm
from app.tools.web_tools import scrape_url

def build_reader_agent():
    llm = get_llm()

    return create_agent(
        model=llm,
        tools=[scrape_url],
        system_prompt="You read web pages and extract useful, detailed information."
    )