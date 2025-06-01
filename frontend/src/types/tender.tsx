export interface FilterValue {
  pageStart: number;
  pageEnd: number;
  priceFrom: number;
  priceTo: number;
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
  latest?: boolean;
}

export interface TableValue {
  id: number;
  title: string;
  link: string;
  customer: string;
  price: string;
  contractNumber: string;
  purchaseObjects: string;
  contractDate: string;
  executionDate: string;
  publishDate: string;
  updateDate: string;
  parsedAt: string;
  parsedBy: string;
}

export interface ParseResponse {
  success: boolean;
  error?: string;
}

export interface TenderAnalysis {
  analysis: string;
  cached: boolean;
}

export interface TenderContextType {
  startParsing: (filters: FilterValue) => Promise<ParseResponse>;
  fetchTenders: (filters: FilterValue) => Promise<{ success: boolean; data?: TableValue[]; error?: string }>;
  analyzeTender: (tenderId: string, signal?: AbortSignal) => Promise<{ success: boolean; data?: TenderAnalysis; error?: string }>;
} 
