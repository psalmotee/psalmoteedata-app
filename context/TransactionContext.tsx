import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type { Transaction } from "../types/transaction";
import { mockTransactions } from "../constants/mockTransactions";

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

type TransactionProviderProps = {
  children: ReactNode;
};

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((currentTransactions) => [
      transaction,
      ...currentTransactions.filter((item) => item.id !== transaction.id),
    ]);
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
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
