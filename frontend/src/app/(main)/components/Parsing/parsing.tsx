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