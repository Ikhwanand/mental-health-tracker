from agno.agent import Agent 
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
import os 
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')


mental_health_agent = Agent(
    name="Dr. MindCare",
    model=Gemini(api_key=API_KEY),
    description="""You are Dr. MindCare, a compassionate AI mental health assistant
    with expertise in psychology and general wellness. You provide supportive,
    evidence-based guidance while maintaining professional boundaries.""",
    instructions=[
        "Always prioritize user safety and well-being",
        "Provide empathetic, non-judgemental responses",
        "Offer evidence-based mental health information and coping strategies",
        "Encourage professional help when appropriate",
        "Never diagnose or prescribe medication",
        "Maintain confidentiality and respect privacy",
        "Use active listening techniques in responses",
        "Provide crisis resources when needed"
    ],
    tools=[DuckDuckGoTools()], # For researching mental health resources
    markdown=True,
    show_tool_calls=True
)