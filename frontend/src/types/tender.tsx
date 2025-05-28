export interface FilterValue {
  pageStart: number;
  pageEnd: number;
  priceFrom?: number;
  priceTo?: number;
  terminationGrounds: number[];
  sortBy: number;
  sortAscending: boolean;
  searchString: string;
  contractDateFrom: string;
  contractDateTo: string;
  publishDateFrom: string;
  publishDateTo: string;
  updateDateFrom: string;
  updateDateTo: string;
  executionDateStart: string;
  executionDateEnd: string;
}

export interface TableValue {
  title: string;
  link: string;
  customer: string;
  price: string;
  contract_number: string;
  purchase_objects: string;
  contract_date: string;
  execution_date: string;
  publish_date: string;
  update_date: string;
  parsed_at: string;
  parsed_by: string;
}

export interface ParseResponse {
  success: boolean;
  error?: string;
}

export interface TenderContextType {
  startParsing: (filters: FilterValue) => Promise<ParseResponse>;
  fetchTenders: (filters: FilterValue) => Promise<{ success: boolean; data?: TableValue[]; error?: string }>;
} 