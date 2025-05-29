import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider'
import Filters from "./FilterPanel"
import Table from "./TablePanel"
import TableModal from './TableModal';
import { TableValue, FilterValue, TenderAnalysis } from '@/types/tender';
import Section from "@/components/Section"
import { useTenders } from '@/providers/TenderProvider';

const defaultFilters: FilterValue = {
  pageStart: 1,
  pageEnd: 10,
  terminationGrounds: [],
  sortBy: 0,
  sortAscending: true,
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

export default function Parsing() {
  const { isAuthenticated } = useAuth()
  const { analyzeTender } = useTenders();
  const [filteredData, setFilteredData] = useState<TableValue[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedContract, setSelectedContract] = useState<TableValue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterValue>(defaultFilters);
  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const itemsPerPage = 10;

  const showContractDetails = async (contract: TableValue) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
      const { success, data, error } = await analyzeTender(contract.id);
      if (success && data) {
        setAnalysis(data);
      } else {
        setAnalysisError(error || 'Не удалось загрузить данные анализа');
      }
    } catch (err) {
      setAnalysisError('Произошла ошибка при загрузке анализа');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
    setAnalysis(null);
    setAnalysisError(null);
  };

  if (!isAuthenticated) {
    return (
      <Section
        id="parsing"
        title="Парсинг"
        description="Необходимо авторизироваться, чтобы начать пользоваться сервисом."
        bgColor="bg-gray-50"
      >
      </Section>
    )
  }

  return (
    <Section
      id="parsing"
      title="Парсинг"
      description="Анализ тендеров на сайтах государственных закупок по установленным критериям."
      bgColor="bg-gray-50"
    >
      <div className="space-y-6">
        <Filters
          setFilteredData={setFilteredData}
          setCurrentPageNumber={setCurrentPageNumber}
          setCurrentFilters={setCurrentFilters}
        />
        <Table
          data={filteredData}
          currentPage={currentPageNumber}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPageNumber}
          showContractDetails={showContractDetails}
          setFilteredData={setFilteredData}
          currentFilters={currentFilters}
        />
        {isModalOpen && selectedContract && (
          <TableModal
            contract={selectedContract}
            onClose={closeModal}
            analysis={analysis}
            loading={analysisLoading}
            error={analysisError}
          />
        )}
      </div>
    </Section>
  );
}
