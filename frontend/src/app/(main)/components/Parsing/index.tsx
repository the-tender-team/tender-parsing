import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider'
import Filters from "./components/Filters"
import Table from "./components/Table"
import TableModal from './components/TableModal';
import { TableValue } from './components/types';
import Section from "@/components/Section"

export default function Parsing() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    const [filteredData, setFilteredData] = useState<TableValue[]>([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [selectedContract, setSelectedContract] = useState<TableValue | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const itemsPerPage = 10;

    const showContractDetails = (contract: TableValue) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
    };

    return (
      <Section
        id="parsing"
        title="Парсинг" 
        description="Представление и сравнение перечней возможностей."
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

  else {
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
}


