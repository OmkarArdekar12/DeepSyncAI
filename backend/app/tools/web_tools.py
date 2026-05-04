import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient

from app.core.config import TAVILY_API_KEY

tavily = TavilyClient(api_key=TAVILY_API_KEY)

def web_search(query: str) -> str:
    """
    Search the web using Tavily and return formatted results.
    """
    try:
        results = tavily.search(query=query, max_results=5)

        output = []

        for r in results.get("results", []):
            output.append(
                f"Title: {r['title']}\n"
                f"URL: {r['url']}\n"
                f"Snippet: {r['content'][:200]}\n"
            )

        return "\n----\n".join(output)

    except Exception as e:
        return f"Error during web search: {str(e)}"

def scrape_url(url: str) -> str:
    """
    Scrape a webpage and return clean text content.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, timeout=10, headers=headers)

        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)

        return text[:3000]

    except Exception as e:
        return f"Error scraping URL: {str(e)}"