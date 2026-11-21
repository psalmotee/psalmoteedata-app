import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import type { Transaction } from "../types/transaction";
import type {
  ServiceTransaction,
  ServiceTransactionPagination,
} from "../types/serviceTransaction";

import { mockTransactions } from "../constants/mockTransactions";
import { transactionApi } from "../services/api";
import { getAuthToken } from "../utils/secureStorage";
import { useAuth } from "./AuthContext";

type TransactionContextType = {
  // Existing local transactions, retained for the current purchase flow.
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;

  // Actual transaction records from VTU Press.
  history: ServiceTransaction[];
  pagination: ServiceTransactionPagination | null;

  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;

  refreshHistory: () => Promise<void>;
  loadMoreHistory: () => Promise<void>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

type TransactionProviderProps = {
  children: ReactNode;
};

export function TransactionProvider({ children }: TransactionProviderProps) {
  const { isAuthenticated } = useAuth();

  // Existing local transaction state.
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);

  // Live transaction history state.
  const [history, setHistory] = useState<ServiceTransaction[]>([]);
  const [pagination, setPagination] =
    useState<ServiceTransactionPagination | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const loadingMoreRef = useRef(false);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions.filter((item) => item.id !== transaction.id),
    ]);
  }, []);

  const fetchHistory = useCallback(
    async (refresh = false) => {
      if (!isAuthenticated) {
        return;
      }

      const currentRequestId = ++requestId.current;

      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const token = await getAuthToken();

        if (!token) {
          throw new Error("Your session has expired. Please log in again.");
        }

        const response = await transactionApi.getHistory(token, 1, 20);

        if (currentRequestId !== requestId.current) {
          return;
        }

        setHistory(response.transactions);
        setPagination(response.pagination);
      } catch (err) {
        if (currentRequestId !== requestId.current) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load transaction history.",
        );
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [isAuthenticated],
  );

  const refreshHistory = useCallback(async () => {
    await fetchHistory(true);
  }, [fetchHistory]);

  const loadMoreHistory = useCallback(async () => {
    if (
      !isAuthenticated ||
      !pagination ||
      isLoading ||
      isRefreshing ||
      loadingMoreRef.current ||
      pagination.current_page >= pagination.total_pages
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    const currentRequestId = requestId.current;

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const nextPage = pagination.current_page + 1;

      const response = await transactionApi.getHistory(
        token,
        nextPage,
        pagination.per_page,
      );

      if (currentRequestId !== requestId.current) {
        return;
      }

      setHistory((currentHistory) => {
        const existingIds = new Set(currentHistory.map((item) => item.id));

        const newTransactions = response.transactions.filter(
          (item) => !existingIds.has(item.id),
        );

        return [...currentHistory, ...newTransactions];
      });

      setPagination(response.pagination);
    } catch (err) {
      if (currentRequestId === requestId.current) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load more transactions.",
        );
      }
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [isAuthenticated, pagination, isLoading, isRefreshing]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchHistory();
    } else {
      // Invalidate outstanding requests when the user logs out.
      requestId.current += 1;

      setHistory([]);
      setPagination(null);
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
      loadingMoreRef.current = false;

      // Clear locally generated transactions from the previous session.
      setTransactions([]);
    }
  }, [isAuthenticated, fetchHistory]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        history,
        pagination,
        isLoading,
        isRefreshing,
        isLoadingMore,
        error,
        refreshHistory,
        loadMoreHistory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider",
    );
  }

  return context;
}
