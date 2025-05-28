import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor
import time, random
from tqdm import tqdm
from models.parse import ParseFilters, ALLOWED_SORT_BY_STRINGS
from database.models import ParsedTender
from fastapi import HTTPException

url_base = "https://zakupki.gov.ru/epz/contract/search/results.html"
params = (
    "?morphology=on&search-filter=Дате+размещения"
    "&fz44=on&contractStageList_2=on&contractStageList=2"
    "&budgetLevelsIdNameHidden=%7B%7D"
    "&recordsPerPage=_50&showLotsInfoHidden=false"
)
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 YaBrowser/25.2.2.0 Yowser/2.5 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Referer": "https://zakupki.gov.ru/"}


def parse_zakupki(filters: ParseFilters):
    max_workers = 3
    all_results: list[ParsedTender] = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        pages = list(range(filters.pageStart, filters.pageEnd + 1))
        tasks = [(filters, page) for page in pages]
        futures = list(tqdm(executor.map(parse_page, tasks), total=len(pages)))

    for page_results in futures:
        all_results.extend(page_results)

    return all_results


def parse_page(args: tuple[ParseFilters, int]):
    filters, page_number = args
    url = build_url(filters, page_number)
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"[!] Ошибка на стр. {page_number}: {e}")
        return []


    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Ошибка загрузки страницы с zakupki.gov.ru")
    
    soup = BeautifulSoup(response.text, "html.parser")
    results: list[ParsedTender] = []
    
    for block in soup.select(".search-registry-entry-block"):
        try:
            title_block = block.select_one(".registry-entry__header-mid__number")
            title = title_block.get_text(strip=True)
            link = title_block.select_one("a")["href"]
            customer = block.select_one(".registry-entry__body-href").get_text(strip=True)
            price = block.select_one(".price-block__value").get_text(strip=True)
            contractNumber = block.select_one(".registry-entry__body-value").get_text(strip=True).replace('\n', '').replace(' ', '').replace("№", "№ ")
            try:
                purchaseObjects = block.select_one(".lots-wrap-content__body__val span span").get_text(strip=True)
            except Exception as e:
                purchaseObjects = ""
            dates = block.select(".data-block__value")
            contractDate = dates[0].get_text(strip=True)
            executionDate = dates[1].get_text(strip=True)
            publishDate = dates[2].get_text(strip=True)
            updateDate = dates[3].get_text(strip=True)
            # status_block = block.select_one(".registry-entry__header-mid__title")
            # status = status_block.get_text(strip=True).lower() if status_block else ""
            
            results.append(ParsedTender(
                title=title,
                link=f"https://zakupki.gov.ru{link}",
                customer=customer,
                price=price,
                contract_number=contractNumber,
                purchase_objects=purchaseObjects,
                contract_date=contractDate,
                execution_date=executionDate,
                publish_date=publishDate,
                update_date=updateDate
            ))

        except Exception as e:
            continue
        
    time.sleep(random.uniform(1.0, 2.5))
    return results

def build_url(filters: ParseFilters, page_number: int):
    url = f"{url_base}{params}&pageNumber={page_number}"
    
    res = ""
    for i in range(1, 4):
        if i in filters.terminationGrounds:
            url += f"&groundsTerminationContractsList_{i}=on"
            if len(res) > 0:
                res += "%2C"
            res += f"{i}"
    url += f"&groundsTerminationContractsList={res}"
    
    if filters.priceFrom:
        url += f"&contractPriceFrom={filters.priceFrom}"
    
    if filters.priceTo:
        url += f"&contractPriceTo={filters.priceTo}"
    
    if filters.searchString:
        url += f"&searchString={filters.searchString}"
    
    if filters.sortAscending:
        url += f"&sortDirection={True}"
    else:
        url += f"&sortDirection={False}"
    
    url += f"&sortBy={ALLOWED_SORT_BY_STRINGS[filters.sortBy - 1]}"
    
    if filters.contractDateFrom:
        url += f"&contractDateFrom={filters.contractDateFrom}"
    if filters.contractDateTo:
        url += f"&contractDateTo={filters.contractDateTo}"
    if filters.executionDateStart:
        url += f"&executionDateStart={filters.executionDateStart}"
    if filters.executionDateEnd:
        url += f"&executionDateEnd={filters.executionDateEnd}"
    if filters.updateDateFrom:
        url += f"&updateDateFrom={filters.updateDateFrom}"
    if filters.updateDateTo:
        url += f"&updateDateTo={filters.updateDateTo}"
    if filters.publishDateFrom:
        url += f"&publishDateFrom={filters.publishDateFrom}"
    if filters.publishDateTo:
        url += f"&publishDateTo={filters.publishDateTo}"
    return url

def termination_grounds_are_valid(filters: ParseFilters):
    if (not filters.terminationGrounds 
        or len(filters.terminationGrounds) == 0 
        or len(filters.terminationGrounds > 3)):
        return False
    
    for i in range(1, 4):
        if i in filters.terminationGrounds:
            return True
    
    return False