import requests
from bs4 import BeautifulSoup
from database.models import ParsedTender




def get_contract_termination_pdf(tender: ParsedTender) -> str:
    """
    Парсит страницу и возвращает ссылку на PDF-файл, связанный с расторжением контракта.
    Только из блока с заголовком: 'Информация об исполнении (о расторжении) контракта'
    """

    reestrNumber = tender.title

    url = "https://zakupki.gov.ru/epz/contract/contractCard/document-info.html?reestrNumber=" + reestrNumber[2:]

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print("Не удалось распарсить линк: " + url)
        print(f"Ошибка при загрузке страницы: {response.status_code}")
        return ""

    soup = BeautifulSoup(response.text, 'html.parser')


    blocks = soup.find_all('div', class_='card-attachments__block')
    for block in blocks:
        title_div = block.find('div', class_='title pb-0')
        if title_div and "информация об исполнении" in title_div.text.lower():
            pdf_links = block.find_all('a', href=True)
            for link in pdf_links:
                href = link['href']
                title = link.get('title', '').lower()
                if "pdf" in title and "filestore" in href:
                    return href