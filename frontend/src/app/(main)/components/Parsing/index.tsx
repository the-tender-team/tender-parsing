import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider'
import Filters from "./FilterPanel"
import Table from "./TablePanel"
import TableModal from './TableModal';
import { TableValue } from '@/types/tender';
import Section from "@/components/Section"

export default function Parsing() {
  const { isAuthenticated } = useAuth()
  const [filteredData, setFilteredData] = useState<TableValue[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedContract, setSelectedContract] = useState<TableValue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  const showContractDetails = (contract: TableValue) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
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
      <Filters 
        setFilteredData={setFilteredData} 
        setCurrentPageNumber={setCurrentPageNumber} 
      />
      <Table 
        data={filteredData} 
        currentPage={currentPageNumber} 
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPageNumber}
        showContractDetails={showContractDetails}
      />
      {isModalOpen && selectedContract && (
        <TableModal 
          contract={selectedContract} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </Section>
  )
}
