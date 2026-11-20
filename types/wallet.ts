export type WalletResponse = {
  success: boolean;
  wallet: {
    balance: number;
  };
};

export type WalletTransaction = {
  id: number;
  type: string;
  name: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  status: string;
  date: string;
};

export type WalletHistoryResponse = {
  success: boolean;
  transactions: WalletTransaction[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};