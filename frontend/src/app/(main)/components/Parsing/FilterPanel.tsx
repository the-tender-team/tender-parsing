'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useParser } from '@/providers/ParserProvider';
import { FilterValue } from './parsing';
import { faRedo, faFilter } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button'
import { useNotification } from '@/providers/NotificationProvider';

interface FilterPanelProps {
  setFilteredData: (data: any[]) => void;
  setCurrentPageNumber: (page: number) => void;
  setCurrentFilters: (filters: FilterValue) => void;
  setTableLoading: (isLoading: boolean) => void;
}

const formatDateToRussian = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

export default function FilterPanel({ 
  setFilteredData, 
  setCurrentPageNumber, 
  setCurrentFilters,
  setTableLoading 
}: FilterPanelProps) {
  const { user, isAuthenticated } = useAuth();
  const { startParsing, fetchTenders } = useParser();
  const { notify } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTableLoading(isLoading);
  }, [isLoading, setTableLoading]);

  // Проверяем, что у пользователя есть права на просмотр фильтров
  if (user?.role === 'user') {
    return null;
  }

  const canParse = user?.role === 'admin' || user?.role === 'owner';

  // Функция для получения текущей даты и даты месяц назад
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0]; // Возвращает YYYY-MM-DD
    };

    return {
      startDateStr: formatDate(startDate),
      endDateStr: formatDate(endDate)
    };
  };

  const [filters, setFilters] = useState<FilterValue>(() => ({
    pageStart: 1,
    pageEnd: 1,
    priceFrom: 0,
    priceTo: 0,
    terminationGrounds: [],
    sortBy: 1,
    sortAscending: false,
    searchString: '',
    contractDateFrom: '',
    contractDateTo: '',
    publishDateFrom: '',
    publishDateTo: '',
    updateDateFrom: '',
    updateDateTo: '',
    executionDateStart: '',
    executionDateEnd: ''
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Проверяем, что значение даты не в будущем
    if (type === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        notify({
          type: 'error',
          title: 'Ошибка',
          message: 'Дата не может быть в будущем'
        });
        return;
      }

      // Проверка диапазонов дат
      const dateRanges = {
        contractDateFrom: 'contractDateTo',
        contractDateTo: 'contractDateFrom',
        publishDateFrom: 'publishDateTo',
        publishDateTo: 'publishDateFrom',
        updateDateFrom: 'updateDateTo',
        updateDateTo: 'updateDateFrom',
        executionDateStart: 'executionDateEnd',
        executionDateEnd: 'executionDateStart'
      };

      const isEndDate = name.endsWith('To') || name.endsWith('End');
      const isStartDate = name.endsWith('From') || name.endsWith('Start');
      
      if (isEndDate || isStartDate) {
        const pairedFieldName = dateRanges[name as keyof typeof dateRanges];
        const pairedValue = filters[pairedFieldName as keyof FilterValue] as string;
        
        if (pairedValue) {
          const currentDate = new Date(value);
          const pairedDate = new Date(pairedValue);
          
          if (isEndDate && currentDate < pairedDate) {
            // Если конечная дата меньше начальной, приравниваем к начальной
            setFilters(prev => ({
              ...prev,
              [name]: pairedValue
            }));
            return;
          }
          
          if (isStartDate && currentDate > new Date(pairedValue)) {
            // Если начальная дата больше конечной, приравниваем конечную к начальной
            setFilters(prev => ({
              ...prev,
              [pairedFieldName]: value,
              [name]: value
            }));
            return;
          }
        }
      }
    }

    // Для числовых полей преобразуем значение в число или 0
    if (type === 'number') {
      const numValue = value === '' ? 0 : Number(value);
      
      // Обработка диапазонов страниц и цен
      if (name === 'pageEnd' && numValue < filters.pageStart) {
        setFilters(prev => ({
          ...prev,
          [name]: prev.pageStart
        }));
        return;
      }
      if (name === 'pageStart') {
        setFilters(prev => ({
          ...prev,
          pageEnd: (!prev.pageEnd || prev.pageEnd < numValue) ? numValue : prev.pageEnd,
          [name]: numValue
        }));
        return;
      }
      if (name === 'priceTo' && numValue !== 0 && numValue < filters.priceFrom) {
        setFilters(prev => ({
          ...prev,
          [name]: prev.priceFrom
        }));
        return;
      }
      if (name === 'priceFrom') {
        setFilters(prev => {
          const currentPriceTo = prev.priceTo || 0;
          return {
            ...prev,
            priceTo: (currentPriceTo !== 0 && currentPriceTo < numValue) ? numValue : currentPriceTo,
            [name]: numValue
          };
        });
        return;
      }

      setFilters(prev => ({
        ...prev,
        [name]: numValue
      }));
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const numValue = parseInt(value);

    setFilters(prev => ({
      ...prev,
      terminationGrounds: checked 
        ? [...(prev.terminationGrounds || []), numValue]
        : (prev.terminationGrounds || []).filter(v => v !== numValue)
    }));
  };

  const prepareFiltersForBackend = () => {
    const preparedFilters = { ...filters };

    // Форматируем все даты в формат DD.MM.YYYY или возвращаем пустую строку
    preparedFilters.contractDateFrom = preparedFilters.contractDateFrom ? formatDateToRussian(preparedFilters.contractDateFrom) : '';
    preparedFilters.contractDateTo = preparedFilters.contractDateTo ? formatDateToRussian(preparedFilters.contractDateTo) : '';
    preparedFilters.publishDateFrom = preparedFilters.publishDateFrom ? formatDateToRussian(preparedFilters.publishDateFrom) : '';
    preparedFilters.publishDateTo = preparedFilters.publishDateTo ? formatDateToRussian(preparedFilters.publishDateTo) : '';
    preparedFilters.updateDateFrom = preparedFilters.updateDateFrom ? formatDateToRussian(preparedFilters.updateDateFrom) : '';
    preparedFilters.updateDateTo = preparedFilters.updateDateTo ? formatDateToRussian(preparedFilters.updateDateTo) : '';
    preparedFilters.executionDateStart = preparedFilters.executionDateStart ? formatDateToRussian(preparedFilters.executionDateStart) : '';
    preparedFilters.executionDateEnd = preparedFilters.executionDateEnd ? formatDateToRussian(preparedFilters.executionDateEnd) : '';

    // Гарантируем значения по умолчанию согласно API
    preparedFilters.pageStart = preparedFilters.pageStart || 1;
    preparedFilters.pageEnd = preparedFilters.pageEnd || 1;
    preparedFilters.priceFrom = preparedFilters.priceFrom || 0;
    preparedFilters.priceTo = preparedFilters.priceTo || 0;
    preparedFilters.sortBy = preparedFilters.sortBy || 1;
    preparedFilters.sortAscending = preparedFilters.sortAscending ?? false;
    preparedFilters.terminationGrounds = preparedFilters.terminationGrounds || [];
    preparedFilters.searchString = preparedFilters.searchString || '';

    return preparedFilters;
  };

  const applyFilters = async () => {
    if (!isAuthenticated) {
      notify({
        type: 'error',
        title: 'Ошибка',
        message: 'Необходима авторизация'
      });
      return;
    }

    setIsLoading(true);
    try {
      const preparedFilters = prepareFiltersForBackend();
      console.log('Applying filters:', preparedFilters);
      
      if (canParse) {
        console.log('Starting parsing with filters:', preparedFilters);
        const parseResult = await startParsing(preparedFilters);
        console.log('Parse result:', parseResult);
        
        if (!parseResult.success) {
          if (parseResult.error === 'Необходима авторизация') {
            return;
          }
          throw new Error(parseResult.error || 'Ошибка запуска парсинга');
        }
      }

      console.log('Fetching tenders with filters:', preparedFilters);
      const { success, data, error } = await fetchTenders(preparedFilters);
      console.log('Fetch result:', { success, data, error });
      
      if (!success || !data) {
        throw new Error(error || 'Ошибка получения данных');
      }

      console.log('Setting filtered data:', data);
      setFilteredData(data);
      setCurrentPageNumber(1);
      setCurrentFilters(preparedFilters);
      notify({
        type: 'success',
        title: 'Успех',
        message: 'Фильтры успешно применены'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при применении фильтров';
      if (errorMessage !== 'Необходима авторизация') {
        notify({
          type: 'error',
          title: 'Ошибка',
          message: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    const defaultFilters: FilterValue = {
      pageStart: 1,
      pageEnd: 1,
      priceFrom: 0,
      priceTo: 0,
      terminationGrounds: [],
      sortBy: 1,
      sortAscending: false,
      searchString: '',
      contractDateFrom: '',
      contractDateTo: '',
      publishDateFrom: '',
      publishDateTo: '',
      updateDateFrom: '',
      updateDateTo: '',
      executionDateStart: '',
      executionDateEnd: ''
    };
    setFilters(defaultFilters);
    setFilteredData([]);
    setCurrentPageNumber(1);
    setCurrentFilters(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Параметры</h2>
      {isAuthenticated && !canParse && (
        <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
          Вы можете просматривать существующие данные. Для запуска нового парсинга необходимы права администратора.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search String */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="input-label">Поисковая строка</label>
          <input 
            type="text" 
            name="searchString"
            value={filters.searchString}
            onChange={handleInputChange}
            placeholder="Введите критерии поиска"
            className="input-base"
          />
        </div>
        
        {/* Price Range */}
        <div>
          <label className="input-label">Цена (в рублях)</label>
          <div className="flex items-center gap-2">
            <input
              type="number" 
              name="priceFrom"
              value={filters.priceFrom || ''}
              onChange={handleInputChange}
              placeholder="От"
              className="input-base w-full"
            />
            <span className="text-gray-500">—</span>
            <input 
              type="number" 
              name="priceTo"
              value={filters.priceTo || ''}
              onChange={handleInputChange}
              placeholder="До" 
              className="input-base w-full"
            />
          </div>
        </div>
        
        {/* Pages Range */}
        <div>
          <label className="input-label">Номера страниц (1-10)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              name="pageStart"
              value={filters.pageStart || 1}
              onChange={handleInputChange}
              min="1" 
              max="10" 
              placeholder="От 1" 
              className="input-base w-full"
            />
            <span className="text-gray-500">—</span>
            <input 
              type="number" 
              name="pageEnd"
              value={filters.pageEnd || 1}
              onChange={handleInputChange}
              min="1" 
              max="10" 
              placeholder="До 10" 
              className="input-base w-full"
            />
          </div>
        </div>
        
        {/* Termination Grounds */}
        <div>
          <label className="input-label">Основания расторжения</label>
          <div className="space-y-2">
            <div className="checkbox-container flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                id="ground1" 
                value="1" 
                checked={(filters.terminationGrounds || []).includes(1)}
                onChange={handleCheckboxChange}
                className="checkbox-input"
              />
              <label htmlFor="ground1" className="checkbox-label">Судебный акт</label>
            </div>
            <div className="checkbox-container flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                id="ground2" 
                value="2" 
                checked={(filters.terminationGrounds || []).includes(2)}
                onChange={handleCheckboxChange}
                className="checkbox-input"
              />
              <label htmlFor="ground2" className="checkbox-label">Соглашение сторон</label>
            </div>
            <div className="checkbox-container flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                id="ground3" 
                value="3" 
                checked={(filters.terminationGrounds || []).includes(3)}
                onChange={handleCheckboxChange}
                className="checkbox-input"
              />
              <label htmlFor="ground3" className="checkbox-label">Односторонний отказ</label>
            </div>
          </div>
        </div>

        {/* Contract Date */}
        <div>
          <label className="input-label">Дата контракта</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              name="contractDateFrom"
              value={filters.contractDateFrom}
              onChange={handleInputChange}
              className="input-base w-full"
            />
            <span className="text-gray-500">—</span>
            <input 
              type="date" 
              name="contractDateTo"
              value={filters.contractDateTo}
              onChange={handleInputChange}
              className="input-base w-full"
            />
          </div>
        </div>

        {/* Publish Date */}
        <div>
          <label className="input-label">Дата размещения</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              name="publishDateFrom"
              value={filters.publishDateFrom}
              onChange={handleInputChange}
              className="input-base w-full"
            />
            <span className="text-gray-500">—</span>
            <input 
              type="date" 
              name="publishDateTo"
              value={filters.publishDateTo}
              onChange={handleInputChange}
              className="input-base w-full"
            />
          </div>
        </div>

        {/* Update Date */}
        <div>
          <label className="input-label">Дата обновления</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              name="updateDateFrom"
              value={filters.updateDateFrom}
              onChange={handleInputChange}
              className="input-base w-full"
            />
            <span className="text-gray-500">—</span>
            <input 
              type="date" 
              name="updateDateTo"
              value={filters.updateDateTo}
              onChange={handleInputChange}
              className="input-base w-full"
            />
          </div>
        </div>

        {/* Execution Date */}
        <div>
          <label className="input-label">Дата исполнения</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              name="executionDateStart"
              value={filters.executionDateStart}
              onChange={handleInputChange}
              className="input-base w-full"
            />
            <span className="text-gray-500">—</span>
            <input 
              type="date" 
              name="executionDateEnd"
              value={filters.executionDateEnd}
              onChange={handleInputChange}
              className="input-base w-full"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="input-label">Сортировка</label>
          <div className="flex items-center gap-2">
            <select 
              name="sortBy"
              value={filters.sortBy || 1}
              onChange={handleInputChange}
              className="input-base w-full"
            >
              <option value={1}>По дате обновления</option>
              <option value={2}>По дате публикации</option>
              <option value={3}>По цене</option>
              <option value={4}>По релевантности</option>
            </select>
            <select 
              name="sortAscending"
              value={(filters.sortAscending ?? false).toString()}
              onChange={handleInputChange}
              className="input-base w-full"
            >
              <option value="true">По возрастанию</option>
              <option value="false">По убыванию</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <Button
          onClick={resetFilters}
          type="button"
          variant="subprimary"
          icon={faRedo}
          disabled={isLoading}
        >
          Сбросить
        </Button>
        <Button
          onClick={applyFilters}
          type="submit"
          variant="primary"
          icon={faFilter}
          disabled={isLoading}
        >
          Применить
        </Button>
      </div>
    </div>
  );
}