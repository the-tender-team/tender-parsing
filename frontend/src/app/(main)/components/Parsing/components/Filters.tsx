'use client';

import { useState, useEffect } from 'react';
import { FilterValue } from './types';
import { sampleData } from './sampleData';

interface FilterPanelProps {
  setFilteredData: (data: any[]) => void;
  setCurrentPageNumber: (page: number) => void;
}

export default function FilterPanel({ setFilteredData, setCurrentPageNumber }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterValue>({
    pageStart: 1,
    pageEnd: 1,
    priceFrom: 1000,
    priceTo: 50000,
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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFilters(prev => ({
      ...prev,
      contractDateFrom: today,
      contractDateTo: today,
      publishDateFrom: today,
      publishDateTo: today,
      updateDateFrom: today,
      updateDateTo: today,
      executionDateStart: today,
      executionDateEnd: today
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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

  const applyFilters = () => {
    // Validate filters
    if (filters.priceFrom > filters.priceTo) {
      alert('Цена "От" не может быть больше цены "До"');
      return;
    }

    if (filters.pageStart < 1 || filters.pageStart > 10 || filters.pageEnd < 1 || filters.pageEnd > 10) {
      alert('Диапазон страниц должен быть от 1 до 10');
      return;
    }

    if (filters.pageStart > filters.pageEnd) {
      alert('Начальная страница не может быть больше конечной');
      return;
    }

    // Filter data
    const filtered = sampleData.filter(item => {
      // Price filter
      const itemPrice = parseFloat(item.price);
      if (itemPrice < filters.priceFrom || itemPrice > filters.priceTo) {
        return false;
      }

      // Search string filter
      if (filters.searchString && 
          !item.title.toLowerCase().includes(filters.searchString.toLowerCase()) && 
          !item.customer.toLowerCase().includes(filters.searchString.toLowerCase()) && 
          !item.purchaseObjects.toLowerCase().includes(filters.searchString.toLowerCase())) {
        return false;
      }

      // Termination grounds filter
      if (filters.terminationGrounds.length > 0) {
        const randomInclusion = Math.random() > 0.3;
        if (!randomInclusion) return false;
      }

      return true;
    });

    // Sort data
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 1: // UPDATE_DATE
          comparison = new Date(a.updateDate.split('.').reverse().join('-')).getTime() - 
                      new Date(b.updateDate.split('.').reverse().join('-')).getTime();
          break;
        case 2: // PUBLISH_DATE
          comparison = new Date(a.publishDate.split('.').reverse().join('-')).getTime() - 
                      new Date(b.publishDate.split('.').reverse().join('-')).getTime();
          break;
        case 3: // PRICE
          comparison = parseFloat(a.price) - parseFloat(b.price);
          break;
        case 4: // RELEVANCE
          const aRelevance = (a.title.toLowerCase().includes(filters.searchString.toLowerCase()) ? 2 : 0) + 
                           (a.customer.toLowerCase().includes(filters.searchString.toLowerCase()) ? 1 : 0) + 
                           (a.purchaseObjects.toLowerCase().includes(filters.searchString.toLowerCase()) ? 1 : 0);
          const bRelevance = (b.title.toLowerCase().includes(filters.searchString.toLowerCase()) ? 2 : 0) + 
                           (b.customer.toLowerCase().includes(filters.searchString.toLowerCase()) ? 1 : 0) + 
                           (b.purchaseObjects.toLowerCase().includes(filters.searchString.toLowerCase()) ? 1 : 0);
          comparison = bRelevance - aRelevance;
          break;
      }

      return filters.sortAscending ? comparison : -comparison;
    });

    setFilteredData(filtered);
    setCurrentPageNumber(1);
  };

  const resetFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    setFilters({
      pageStart: 1,
      pageEnd: 1,
      priceFrom: 1000,
      priceTo: 50000,
      terminationGrounds: [],
      sortBy: 1,
      sortAscending: false,
      searchString: '',
      contractDateFrom: today,
      contractDateTo: today,
      publishDateFrom: today,
      publishDateTo: today,
      updateDateFrom: today,
      updateDateTo: today,
      executionDateStart: today,
      executionDateEnd: today
    });
    setFilteredData([]);
    setCurrentPageNumber(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search String */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Поисковая строка</label>
          <input 
            type="text" 
            name="searchString"
            value={filters.searchString}
            onChange={handleInputChange}
            placeholder="Введите критерии поиска" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цена (руб.)</label>
          <div className="flex space-x-2">
            <input 
              type="number" 
              name="priceFrom"
              value={filters.priceFrom}
              onChange={handleInputChange}
              placeholder="От" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <input 
              type="number" 
              name="priceTo"
              value={filters.priceTo}
              onChange={handleInputChange}
              placeholder="До" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Pages Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Страницы (1-10)</label>
          <div className="flex space-x-2">
            <input 
              type="number" 
              name="pageStart"
              value={filters.pageStart}
              onChange={handleInputChange}
              min="1" 
              max="10" 
              placeholder="От" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <input 
              type="number" 
              name="pageEnd"
              value={filters.pageEnd}
              onChange={handleInputChange}
              min="1" 
              max="10" 
              placeholder="До" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Termination Grounds */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Основания расторжения</label>
          <div className="space-y-2">
            <div className="checkbox-container flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                id="ground1" 
                value="1" 
                checked={filters.terminationGrounds.includes(1)}
                onChange={handleCheckboxChange}
                className="checkbox-input h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all"
              />
              <label htmlFor="ground1" className="checkbox-label text-sm text-gray-700 transition-all">Судебный акт</label>
            </div>
            <div className="checkbox-container flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                id="ground2" 
                value="2" 
                checked={filters.terminationGrounds.includes(2)}
                onChange={handleCheckboxChange}
                className="checkbox-input h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all"
              />
              <label htmlFor="ground2" className="checkbox-label text-sm text-gray-700 transition-all">Отказ заказчика</label>
            </div>
            <div className="checkbox-container flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                id="ground3" 
                value="3" 
                checked={filters.terminationGrounds.includes(3)}
                onChange={handleCheckboxChange}
                className="checkbox-input h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all"
              />
              <label htmlFor="ground3" className="checkbox-label text-sm text-gray-700 transition-all">Отказ поставщика</label>
            </div>
          </div>
        </div>
        
        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Сортировка</label>
          <div className="flex space-x-2">
            <select 
              name="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">Дата обновления</option>
              <option value="2">Дата размещения</option>
              <option value="3">Цена</option>
              <option value="4">Релевантность</option>
            </select>
            <select 
              name="sortAscending"
              value={filters.sortAscending.toString()}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">По возрастанию</option>
              <option value="false">По убыванию</option>
            </select>
          </div>
        </div>
        
        {/* Date Ranges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата заключения</label>
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="contractDateFrom"
              value={filters.contractDateFrom}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
            <input 
              type="date" 
              name="contractDateTo"
              value={filters.contractDateTo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата размещения</label>
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="publishDateFrom"
              value={filters.publishDateFrom}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
            <input 
              type="date" 
              name="publishDateTo"
              value={filters.publishDateTo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата обновления</label>
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="updateDateFrom"
              value={filters.updateDateFrom}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
            <input 
              type="date" 
              name="updateDateTo"
              value={filters.updateDateTo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата исполнения</label>
          <div className="flex space-x-2">
            <input 
              type="date" 
              name="executionDateStart"
              value={filters.executionDateStart}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
            <input 
              type="date" 
              name="executionDateEnd"
              value={filters.executionDateEnd}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 date-input"
            />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all"
        >
          <i className="fas fa-redo mr-2"></i>Сбросить
        </button>
        <button 
          onClick={applyFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          <i className="fas fa-filter mr-2"></i>Применить фильтры
        </button>
      </div>
    </div>
  );
}