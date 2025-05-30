'use client';

import { TableValue, FilterValue } from '@/types/tender';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faExternalLinkAlt, faChevronLeft, faChevronRight, faSearch, faHistory } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import { useTenders } from '@/providers/TenderProvider';
import { useEffect } from 'react';

// Функция для парсинга цены
const parsePrice = (priceStr: string): number => {
  // Убираем символ рубля, пробелы и заменяем запятую на точку
  return parseFloat(priceStr.replace('₽', '').replace(/\s/g, '').replace(',', '.'));
};

interface ContractTableProps {
  data: TableValue[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  showContractDetails: (contract: TableValue) => void;
  setFilteredData: (data: TableValue[]) => void;
  currentFilters: FilterValue;
}

export default function ContractTable({ 
  data, 
  currentPage, 
  itemsPerPage, 
  setCurrentPage, 
  showContractDetails,
  setFilteredData,
  currentFilters
}: ContractTableProps) {
  const { fetchTenders } = useTenders();
  
  useEffect(() => {
    console.log('Table data:', data);
    if (data.length > 0) {
      console.log('First item:', data[0]);
    }
  }, [data]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const fetchNewTenders = async () => {
    const { success, data } = await fetchTenders(currentFilters);
    if (success && data) {
      setFilteredData(data);
    }
  };

  const fetchLatestTenders = async () => {
    const { success, data } = await fetchTenders({
      ...currentFilters,
      latest: true
    });
    if (success && data) {
      setFilteredData(data);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Результаты</h2>
        <div className="text-sm text-gray-500">Найдено {data.length} контрактов</div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="table-col">Номер</th>
              <th scope="col" className="table-col min-w-[400px]">Заказчик</th>
              <th scope="col" className="table-col">Цена</th>
              <th scope="col" className="table-col">Контракт</th>
              <th scope="col" className="table-col min-w-[400px]">Объекты закупки</th>
              <th scope="col" className="table-col">Дата заключения</th>
              <th scope="col" className="table-col">Срок исполнения</th>
              <th scope="col" className="table-col">Дата публикации</th>
              <th scope="col" className="table-col">Дата обновления</th>
              <th scope="col" className="table-col">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                  {data.length === 0 ? 'Таблица пустая. Загрузите сохранённую или новую.' : 'Согласно выставленным критериям ничего не найдено.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      {item.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 min-w-[400px]">
                    <div className="text-sm text-gray-900 break-words">{item.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {parsePrice(item.price).toLocaleString('ru-RU')} ₽
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.contractNumber}</div>
                  </td>
                  <td className="px-6 py-4 min-w-[400px]">
                    <div className="text-sm text-gray-900 break-words">{item.purchaseObjects}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.contractDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.executionDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.publishDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.updateDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => {
                        console.log('Opening analysis for tender:', item);
                        showContractDetails(item);
                      }}
                      variant="primary"
                      type="button"
                      size="sm"
                    >
                      Анализ
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Назад
          </button>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages || totalPages === 0}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button 
              onClick={goToPrevPage} 
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Назад</span>
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
            </button>
            <div className="flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage 
                      ? 'z-10 bg-indigo-100 border-indigo-600 text-indigo-600' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Вперед</span>
              <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
            </button>
          </nav>
          <div className="flex gap-2">
            <Button
              onClick={fetchLatestTenders}
              variant="subprimary"
              type="button"
              icon={faHistory}
            >
              Сохранённая
            </Button>
            <Button
              onClick={fetchNewTenders}
              variant="primary"
              type="button"
              icon={faSearch}
            >
              Новая
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}