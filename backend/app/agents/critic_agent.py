from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.llm import get_llm

llm = get_llm()

critic_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a strict research reviewer."),
    ("human", """Review this report:

{report}

Give:
- Score (out of 10)
- Strengths
- Weaknesses
- Final verdict
"""),
])

critic_chain = critic_prompt | llm | StrOutputParser()