from app.agents.search_agent import build_search_agent
from app.agents.writer_agent import writer_chain
from app.agents.critic_agent import critic_chain
from app.tools.web_tools import scrape_url
import re


def _message_to_text(message) -> str:
    """
    Convert LangChain/LangGraph message content into plain text safely.
    """
    content = getattr(message, "content", "")

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict) and "text" in item:
                parts.append(item["text"])
            else:
                parts.append(str(item))
        return "\n".join(parts)

    return str(content)


def run_research(topic: str) -> dict:
    state = {}

    print("\nStarting research...\n")

    # Step 1: Search
    print("Running search agent...")
    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages": [("user", f"Find recent info about: {topic}")]
    })

    search_message = search_result["messages"][-1]
    search_text = _message_to_text(search_message)

    state["search"] = search_text
    print("Search done")
    print("STATE after search:\n", state, "\n")

    # Step 2: Extract URL and scrape
    print("Running reader step...")
    urls = re.findall(r"https?://[^\s\"\'\]\)]+", search_text)

    if urls:
        first_url = urls[0]
        print("Scraping URL:", first_url)
        scraped_content = scrape_url(first_url)
        state["content"] = scraped_content
    else:
        print("No URL found in search results")
        state["content"] = "No URL found in search results"

    print("✅ Reader step done")
    print("📦 STATE after reader:\n", state, "\n")

    # Step 3: Writer
    print("Writing report...")
    report = writer_chain.invoke({
        "topic": topic,
        "research": state["content"][:3000]
    })

    state["report"] = report
    print("Writer done")
    print("STATE after writer:\n", state, "\n")

    # Step 4: Critic
    print("Reviewing report...")
    feedback = critic_chain.invoke({
        "report": report
    })

    state["feedback"] = feedback
    print("Critic done")
    print("FINAL STATE:\n", state, "\n")

    return state