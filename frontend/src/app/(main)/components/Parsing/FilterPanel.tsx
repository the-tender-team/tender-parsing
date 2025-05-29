'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useParser } from '@/providers/ParserProvider';
import { FilterValue } from '@/types/tender';
import { faRedo, faFilter } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button'

interface FilterPanelProps {
  setFilteredData: (data: any[]) => void;
  setCurrentPageNumber: (page: number) => void;
}

export default function FilterPanel({ setFilteredData, setCurrentPageNumber }: FilterPanelProps) {
  const { user, isAuthenticated } = useAuth();
  const { startParsing, fetchTenders } = useParser();
  const [isLoading, setIsLoading] = useState(false);

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

  const [filters, setFilters] = useState<FilterValue>(() => {
    return {
      pageStart: 1,
      pageEnd: 1,
      priceFrom: undefined,
      priceTo: undefined,
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Проверяем, что значение даты не в будущем
    if (type === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        alert('Дата не может быть в будущем');
        return;
      }
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
        ? [...prev.terminationGrounds, numValue]
        : prev.terminationGrounds.filter(v => v !== numValue)
    }));
  };

  const applyFilters = async () => {
    if (!isAuthenticated) {
      alert('Необходимо войти в систему');
      return;
    }

    setIsLoading(true);
    try {
      if (canParse) {
        // Сначала запускаем парсинг
        const parseResult = await startParsing(filters);
        
        if (!parseResult.success) {
          if (parseResult.error === 'Необходима авторизация') {
            // Не показываем дополнительное сообщение, оно уже показано в fetchTenders
            return;
          }
          throw new Error(parseResult.error || 'Ошибка запуска парсинга');
        }
      }

      // Получаем данные (для всех пользователей)
      const { success, data, error } = await fetchTenders(filters);
      
      if (!success || !data) {
        throw new Error(error || 'Ошибка получения данных');
      }

      setFilteredData(data);
      setCurrentPageNumber(1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при применении фильтров';
      if (errorMessage !== 'Необходима авторизация') {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      pageStart: 1,
      pageEnd: 1,
      priceFrom: undefined,
      priceTo: undefined,
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
    });
    setFilteredData([]);
    setCurrentPageNumber(1);
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
          <div className="flex space-x-2">
            <input
              type="number" 
              name="priceFrom"
              value={filters.priceFrom}
              onChange={handleInputChange}
              placeholder="От"
              className="input-base"
            />
            <input 
              type="number" 
              name="priceTo"
              value={filters.priceTo}
              onChange={handleInputChange}
              placeholder="До" 
              className="input-base"
            />
          </div>
        </div>
        
        {/* Pages Range */}
        <div>
          <label className="input-label">Номера страниц (1-10)</label>
          <div className="flex space-x-2">
            <input 
              type="number" 
              name="pageStart"
              value={filters.pageStart}
              onChange={handleInputChange}
              min="1" 
              max="10" 
              placeholder="От 1" 
              className="input-base"
            />
            <input 
              type="number" 
              name="pageEnd"
              value={filters.pageEnd}
              onChange={handleInputChange}
              min="1" 
              max="10" 
              placeholder="До 10" 
              className="input-base"
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
                checked={filters.terminationGrounds.includes(1)}
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
                checked={filters.terminationGrounds.includes(2)}
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
                checked={filters.terminationGrounds.includes(3)}
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
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="contractDateFrom"
              value={filters.contractDateFrom}
              onChange={handleInputChange}
              className="input-base"
            />
            <input 
              type="date" 
              name="contractDateTo"
              value={filters.contractDateTo}
              onChange={handleInputChange}
              className="input-base"
            />
          </div>
        </div>

        {/* Publish Date */}
        <div>
          <label className="input-label">Дата размещения</label>
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="publishDateFrom"
              value={filters.publishDateFrom}
              onChange={handleInputChange}
              className="input-base"
            />
            <input 
              type="date" 
              name="publishDateTo"
              value={filters.publishDateTo}
              onChange={handleInputChange}
              className="input-base"
            />
          </div>
        </div>

        {/* Update Date */}
        <div>
          <label className="input-label">Дата обновления</label>
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="updateDateFrom"
              value={filters.updateDateFrom}
              onChange={handleInputChange}
              className="input-base"
            />
            <input 
              type="date" 
              name="updateDateTo"
              value={filters.updateDateTo}
              onChange={handleInputChange}
              className="input-base"
            />
          </div>
        </div>

        {/* Execution Date */}
        <div>
          <label className="input-label">Дата исполнения</label>
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="executionDateStart"
              value={filters.executionDateStart}
              onChange={handleInputChange}
              className="input-base"
            />
            <input 
              type="date" 
              name="executionDateEnd"
              value={filters.executionDateEnd}
              onChange={handleInputChange}
              className="input-base"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="input-label">Сортировка</label>
          <div className="flex space-x-2">
            <select 
              name="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              className="input-base flex-grow"
            >
              <option value={1}>По дате обновления</option>
              <option value={2}>По дате публикации</option>
              <option value={3}>По цене</option>
              <option value={4}>По релевантности</option>
            </select>
            <select 
              name="sortAscending"
              value={filters.sortAscending.toString()}
              onChange={handleInputChange}
              className="input-base w-32"
            >
              <option value="true">По возрастанию</option>
              <option value="false">По убыванию</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
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
          {isLoading ? 'Загрузка...' : 'Применить'}
        </Button>
      </div>
    </div>
  );
}