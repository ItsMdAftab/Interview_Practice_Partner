import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found in .env file.")

# Configure Gemini
genai.configure(api_key=api_key)

# Create a reusable model instance
model = genai.GenerativeModel("gemini-2.0-flash")

def ask_gemini(prompt: str) -> str:
    """
    Simple wrapper to send a prompt to Gemini and return text response.
    """
    response = model.generate_content(prompt)
    return response.text
