from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.llm import get_llm

llm = get_llm()

writer_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert research writer."),
    ("human", """Write a detailed research report.

Topic: {topic}

Research:
{research}

Structure:
- Introduction
- Key Points
- Conclusion
- Sources
"""),
])

writer_chain = writer_prompt | llm | StrOutputParser()