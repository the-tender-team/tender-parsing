'use client';

import { TableValue } from '@/types/tender';

interface ContractModalProps {
  contract: TableValue;
  onClose: () => void;
}

export default function ContractModal({ contract, onClose }: ContractModalProps) {
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Детали контракта</h3>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Название:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ссылка:</p>
                      <a 
                        href={contract.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-sm text-blue-600 hover:underline"
                      >
                        {contract.link}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Заказчик:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Цена:</p>
                      <p className="mt-1 text-sm text-gray-900">{parseFloat(contract.price).toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Номер контракта:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.contract_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Объекты закупки:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.purchase_objects}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Дата контракта:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.contract_date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Дата исполнения:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.execution_date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Дата размещения:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.publish_date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Дата обновления:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.update_date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Дата парсинга:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.parsed_at}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Пользователь:</p>
                      <p className="mt-1 text-sm text-gray-900">{contract.parsed_by}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}