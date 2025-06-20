'use client';

import ModalWindow from '@/components/Modal';
import ModalSection from "@/components/ModalSection";
import ModalField from "@/components/ModalField";
import { formatDate } from '@/libs/formatDate';
import { TableValue, TenderAnalysis } from '@/types/tender';
import ReactMarkdown from 'react-markdown';
import { faFileAlt, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ContractModalProps {
  contract: TableValue;
  onClose: () => void;
  analysis: TenderAnalysis | null;
  loading: boolean;
  error: string | null;
}

export default function ContractModal({ 
  contract, 
  onClose,
  analysis,
  loading,
  error
}: ContractModalProps) {
  return (
    <ModalWindow
      isOpen={true}
      onClose={onClose}
      title="Анализ тендера"
      disableClose={loading}
    >
      <ModalSection
        icon={<FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />}
        title="Информация о тендере"
      >
        <div className="space-y-4">
          <ModalField
            label="Название"
            value={
              <a 
                href={contract.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {contract.title}
              </a>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModalField
              label="Номер"
              value={contract.contractNumber}
              className="break-all"
            />
            <ModalField
              label="Цена"
              value={`${parseFloat(contract.price.replace('₽', '').replace(/\s/g, '').replace(',', '.')).toLocaleString('ru-RU')} ₽`}
            />
            <ModalField
              label="Дата заключения"
              value={contract.contractDate || 'Не указана'}
            />
            <ModalField
              label="Срок исполнения"
              value={contract.executionDate || 'Не указана'}
            />
            <ModalField
              label="Дата публикации"
              value={contract.publishDate || 'Не указана'}
            />
            <ModalField
              label="Дата обновления"
              value={contract.updateDate || 'Не указана'}
            />
          </div>
          <ModalField
            label="Заказчик"
            value={contract.customer}
          />
          <ModalField
            label="Первый объект закупки"
            value={contract.purchaseObjects}
          />
          <div className="grid grid-cols-2 gap-4">
            <ModalField
              label="Дата и время парсинга"
              value={contract.parsedAt ? formatDate(contract.parsedAt) : 'Не указана'}
            />
            <ModalField
              label="Автор парсинга"
              value={contract.parsedBy || 'Не указано'}
            />
          </div>
        </div>
      </ModalSection>

      <ModalSection
        icon={<FontAwesomeIcon icon={faSearch} className="w-5 h-5" />}
        title="Результаты анализа"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500">Выполняется анализ тендера...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : analysis ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
            {analysis.cached && (
              <p className="mt-4 text-sm text-gray-500">
                Анализ был загружен из базы данных.
              </p>
            )}
          </div>
        ) : null}
      </ModalSection>
    </ModalWindow>
  );
}