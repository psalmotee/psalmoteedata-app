import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type WalletContextType = {
  balance: number;
  addFunds: (amount: number) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [balance, setBalance] = useState<number>(25000);

  const addFunds = useCallback((amount: number) => {
    if (amount <= 0) return;

    setBalance((currentBalance) => currentBalance + amount);
  }, []);

  return (
    <WalletContext.Provider value={{ balance, addFunds }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
}
