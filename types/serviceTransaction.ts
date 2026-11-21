export type ServiceTransaction = {
  id: number;
  service: string;
  recipient: string;
  amount: number;
  status: string;
  via: string;
  reference: string;
  balance_before: number | null;
  balance_after: number | null;
  description: string | null;
  country: string;
  date: string | null;
};

export type ServiceTransactionPagination = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type ServiceTransactionHistoryResponse = {
  success: boolean;
  transactions: ServiceTransaction[];
  pagination: ServiceTransactionPagination;
};
