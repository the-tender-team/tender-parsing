import os
from dotenv import load_dotenv
from database.models import ParsedTender

# import pdfplumber

load_dotenv()

# def extract_text_from_pdf(file_path: str) -> str:
#     text = ""
#     with pdfplumber.open(file_path) as pdf:
#         for page in pdf.pages:
#             page_text = page.extract_text()
#             if page_text:
#                 text += page_text + "\n"
#     return text.strip()


async def analyze_tender(tender: ParsedTender) -> str:
#     prompt = f"""Ты — юридический помощник. Проанализируй следующий тендер и укажи риски, проблемы, несоответствия и потенциальные последствия:
# {text}
# """
#     messages = [{"role": "user", "text": prompt}]
#     completion = await yandex_gpt.get_async_completion(messages=messages)
    return ""
