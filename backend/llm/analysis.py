import requests
import os
from typing import Optional
from llm.ocr import extract_text
from dotenv import load_dotenv

from database.models import ParsedTender
from llm.fileLinkParser import get_contract_termination_pdf


load_dotenv()

YANDEX_OAUTH_TOKEN = os.getenv("YANDEX_OAUTH_TOKEN") 
YANDEX_LLM_FOLD_ID = os.getenv("YANDEX_LLM_FOLD_ID") 


def generate_analysis_prompt(contract_text: str) -> str:
    """Генерирует промт для юридического анализа"""
    base_prompt = """
        Ты - опытный юрист с специализацией на договорном праве. 
        Проанализируй предоставленный текст договора и выполни следующие задачи:

        1. Определи все существенные условия договора
        2. Выяви потенциальные юридические риски для стороны, с которой был заключён тендер:
        - Неясные формулировки
        - Несбалансированные обязательства
        - Проблемы с исполнимостью
        - Возможные нарушения законодательства
        3. Оцени, какие положения могут быть оспорены в суде
        4. Определи, нуждается ли сторона в юридической помощи по этому договору

        Текст договора:
        {contract_text}

        Предоставь развернутый анализ с конкретными примерами из текста. 
        Сначала кратко суммируй основные положения, затем детально разбери риски, 
        и в конце дай четкую рекомендацию о необходимости юридической помощи.
        """
    return base_prompt.format(contract_text=contract_text)


async def analyze_tender(tender: ParsedTender) -> Optional[dict]:
    """Отправляет промт в Yandex LLM и возвращает ответ"""
    pdf_url = get_contract_termination_pdf(tender)
    print(pdf_url)
    if not pdf_url:
        return ""
    contract_text = await extract_text(pdf_url)
    message = generate_analysis_prompt(contract_text)

    prompt = {
        "modelUri": f"gpt://{YANDEX_LLM_FOLD_ID}/yandexgpt",
        "completionOptions": {
            "stream": False,
            "temperature": 0.6,
            "maxTokens": "5000"
        },
        "messages": [
        {
                "role": "user",
                "text": message 
            }
        ]
    }

    url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Api-Key {YANDEX_OAUTH_TOKEN}"
    }

    try:
        response = requests.post(url, headers=headers, json=prompt)
        response.raise_for_status()
        return response.json().get("result", {}).get("alternatives", [{}])[0].get("message", {}).get("text", "Не удалось получить ответ")
    except requests.RequestException as e:
        print(f' Ошибка при запросе к Yandex LLM: {e}')
        return None
