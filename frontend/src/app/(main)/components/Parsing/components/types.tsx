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
}

export interface TableValue {
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
