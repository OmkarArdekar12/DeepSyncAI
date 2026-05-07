from langgraph.prebuilt import create_react_agent
from app.core.llm import get_llm
from app.tools.web_tools import scrape_url

def build_reader_agent():
    llm = get_llm()

    return create_react_agent(
        model=llm,
        tools=[scrape_url],
        prompt="You read web pages and extract useful, detailed information."
    )