import asyncio
import aiohttp
import io
import base64
from PIL import Image
import fitz
import PyPDF2
import time
import requests
from dotenv import load_dotenv
import os



load_dotenv()

YANDEX_OAUTH_TOKEN = os.getenv("YANDEX_OCR_TOKEN") 
YANDEX_LLM_FOLD_ID = os.getenv("YANDEX_LLM_FOLD_ID") 

# Семафор для ограничения числа одновременных запросов
SEM = asyncio.Semaphore(5)


def encode_image(img: Image.Image) -> str:
    with io.BytesIO() as buffer:
        img.save(buffer, format="JPEG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")


async def yandex_ocr(session: aiohttp.ClientSession, image_b64: str, max_retries=5) -> dict | None:
    url = "https://ocr.api.cloud.yandex.net/ocr/v1/recognizeText"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {YANDEX_OAUTH_TOKEN}",
        "x-folder-id": YANDEX_LLM_FOLD_ID,
    }
    data = {
        "mimeType": "image/jpeg",
        "languageCodes": ["ru", "en"],
        "content": image_b64
    }

    backoff = 0.6  # начальная задержка

    for attempt in range(1, max_retries + 1):
        async with SEM:
            try:
                async with session.post(url, headers=headers, json=data, timeout=30) as response:
                    if response.status == 429:
                        print(f"[!] 429 Too Many Requests — попытка {attempt}/{max_retries}, ждём {backoff:.1f} сек.")
                        await asyncio.sleep(backoff)
                        backoff *= 2
                        continue

                    response.raise_for_status()
                    return await response.json()

            except aiohttp.ClientError as e:
                print(f"[!] Ошибка сети (попытка {attempt}): {e}")
                await asyncio.sleep(backoff)
                backoff *= 2
                continue
            except Exception as e:
                print(f"[!] Ошибка Yandex OCR: {e}")
                return None

    print("[!] Превышено количество попыток для Yandex OCR")
    return None


def extract_text_from_yandex_response(response_json: dict) -> str:
    try:
        blocks = response_json["result"]["textAnnotation"]["blocks"]
        lines_text = []
        for block in blocks:
            for line in block.get("lines", []):
                words = [word.get("text", "") for word in line.get("words", []) if word.get("text")]
                if words:
                    lines_text.append(" ".join(words))
        return "\n".join(lines_text)
    except Exception as e:
        print(f"[!] Ошибка обработки ответа Yandex OCR: {e}")
        return ""


async def ocr_page(session: aiohttp.ClientSession, page_num: int, page) -> str:
    pix = page.get_pixmap(dpi=300)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    img_b64 = encode_image(img)
    response_json = await yandex_ocr(session, img_b64)
    text = extract_text_from_yandex_response(response_json) if response_json else "[Ошибка OCR]"
    return f"{page_num:04d}|||--- Страница {page_num} (OCR) ---\n{text}"


async def parallel_ocr_async(doc) -> list[str]:
    async with aiohttp.ClientSession() as session:
        tasks = [ocr_page(session, i + 1, page) for i, page in enumerate(doc)]
        results = await asyncio.gather(*tasks)
    # Сортируем, чтобы сохранить порядок страниц
    return [res.split("|||", 1)[1] for res in sorted(results)]


def extract_text(pdf_url: str, use_ocr: bool = True) -> str | None:
    try:
        start_all = time.time()
        response = requests.get(pdf_url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=15)
        response.raise_for_status()

        text_pages = []
        pdf_bytes = io.BytesIO(response.content)

        try:
            reader = PyPDF2.PdfReader(pdf_bytes)
            for page_num, page in enumerate(reader.pages, 1):
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_pages.append(f"--- Страница {page_num} ---\n{page_text}")
        except Exception as e:
            print(f"PyPDF2 ошибка: {e}")

        if not text_pages or use_ocr:
            print("OCR через Yandex API (асинхронно)...")
            pdf_bytes.seek(0)
            doc = fitz.open(stream=pdf_bytes.read(), filetype="pdf")

            # Запускаем асинхронную OCR обработку
            ocr_results = asyncio.run(parallel_ocr_async(doc))
            text_pages.extend(ocr_results)

            duration_ocr = time.time() - start_all
            print(f"OCR завершён за {duration_ocr:.1f} сек.")

        total_duration = time.time() - start_all
        print(f"Общая длительность: {total_duration:.1f} сек.")

        return "\n\n".join(text_pages) if text_pages else None

    except Exception as e:
        print(f"[!] Ошибка загрузки/обработки PDF: {e}")
        return None
