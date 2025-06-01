'use client';

import { useEffect, } from 'react';
import { TableValue, FilterValue } from '@/types/tender';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { useTenders } from '@/providers/TenderProvider';
import { faChevronLeft, faChevronRight, faSearch, faHistory, faChartLine } from '@fortawesome/free-solid-svg-icons';

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
  isLoading: boolean;
}

export default function ContractTable({ 
  data, 
  currentPage, 
  itemsPerPage, 
  setCurrentPage, 
  showContractDetails,
  setFilteredData,
  currentFilters,
  isLoading
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

  const fetchNewTenders = async () => {
    setFilteredData([]);
    const { success, data } = await fetchTenders(currentFilters);
    if (success && data) {
      setFilteredData(data);
    }
  };

  const fetchLatestTenders = async () => {
    setFilteredData([]);
    const { success, data } = await fetchTenders({
      ...currentFilters,
      latest: true
    });
    if (success && data) {
      setFilteredData(data);
    }
  };

  const headers = [
    'Номер',
    'Заказчик',
    'Цена',
    'Контракт',
    'Первый объект закупки',
    'Дата заключения',
    'Срок исполнения',
    'Дата публикации',
    'Дата обновления',
    'Действие'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Таблица</h2>
        <div className="text-sm text-gray-500">Найдено {data.length} контрактов</div>
      </div>
      
      <Table 
        headers={headers}
        emptyMessage={data.length === 0 ? 'Таблица пустая. Загрузите сохранённую или новую.' : 'Согласно выставленным критериям ничего не найдено.'}
        isLoading={isLoading}
        loadingMessage="Выполняется парсинг тендеров..."
      >
        {paginatedData.map((item, index) => (
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
                icon={faChartLine}
              >
                Анализ
              </Button>
            </td>
          </tr>
        ))}
      </Table>
      
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {data.length > 0 && (
            <>
              <Button
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
                variant="subprimary"
                type="button"
                icon={faChevronLeft}
                size="sm"
              />
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                variant="subprimary"
                type="button"
                icon={faChevronRight}
                size="sm"
              />
              <span className="text-sm text-gray-600 ml-3">
                <span className="hidden sm:inline">Страница </span>
                {currentPage} из {totalPages || 1}
              </span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchLatestTenders}
            variant="subprimary"
            type="button"
            icon={faHistory}
            className="sm:w-auto w-12"
          >
            Сохранённая
          </Button>
          <Button
            onClick={fetchNewTenders}
            variant="primary"
            type="button"
            icon={faSearch}
            className="sm:w-auto w-12"
          >
            Новая
          </Button>
        </div>
      </div>
    </div>
  );
}