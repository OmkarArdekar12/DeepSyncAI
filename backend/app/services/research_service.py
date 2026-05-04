from app.agents.search_agent import build_search_agent
from app.agents.reader_agent import build_reader_agent
from app.agents.writer_agent import writer_chain
from app.agents.critic_agent import critic_chain

# def run_research(topic: str) -> dict:
#     """
#     Main pipeline to run multi-agent research.
#     """

#     state = {}

#     search_agent = build_search_agent()

#     search_result = search_agent.invoke({
#         "messages": [
#             ("user", f"Find recent and reliable information about: {topic}")
#         ]
#     })

#     state["search"] = search_result["messages"][-1].content

#     reader_agent = build_reader_agent()

#     reader_result = reader_agent.invoke({
#         "messages": [
#             ("user",
#              f"From the following search results, pick the best URL and extract detailed content:\n\n{state['search'][:1000]}"
#             )
#         ]
#     })

#     state["content"] = reader_result["messages"][-1].content

#     combined_research = f"""
# SEARCH RESULTS:
# {state['search']}

# DETAILED CONTENT:
# {state['content']}
# """

#     report = writer_chain.invoke({
#         "topic": topic,
#         "research": combined_research
#     })

#     state["report"] = report

#     feedback = critic_chain.invoke({
#         "report": report
#     })

#     state["feedback"] = feedback

#     return state

def run_research(topic: str) -> dict:

    state = {}

    print("\n🚀 Starting research...\n")

    # 🔍 Step 1: Search
    print("🔍 Running search agent...")
    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages": [("user", f"Find recent info about: {topic}")]
    })

    state["search"] = str(search_result)
    print("✅ Search done")
    print("📦 STATE after search:\n", state, "\n")


    # 📄 Step 2: Reader
    print("📄 Running reader agent...")
    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user", f"Extract details:\n{state['search'][:500]}")]
    })

    state["content"] = str(reader_result)
    print("✅ Reader done")
    print("📦 STATE after reader:\n", state, "\n")


    # ✍️ Step 3: Writer
    print("✍️ Writing report...")
    report = writer_chain.invoke({
        "topic": topic,
        "research": state["content"][:1000]
    })

    state["report"] = report
    print("✅ Writer done")
    print("📦 STATE after writer:\n", state, "\n")


    # 🧐 Step 4: Critic
    print("🧐 Reviewing report...")
    feedback = critic_chain.invoke({
        "report": report
    })

    state["feedback"] = feedback
    print("✅ Critic done")
    print("📦 FINAL STATE:\n", state, "\n")

    return state