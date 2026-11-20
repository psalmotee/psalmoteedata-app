import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { walletApi } from "../services/api";
import { getAuthToken } from "../utils/secureStorage";
import { useAuth } from "./AuthContext";

type WalletContextType = {
  balance: number;
  isLoading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  /**
   * Retrieve the authenticated user's wallet balance.
   */
  const refreshBalance = useCallback(async () => {
    if (!isAuthenticated) {
      setBalance(0);
      setError(null);
      setIsLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await walletApi.getBalance(token);

      // Ignore outdated requests.
      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!response.success) {
        throw new Error("Unable to retrieve your wallet balance.");
      }

      setBalance(Number(response.wallet.balance));
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve your wallet balance.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated]);

  /**
   * Automatically retrieve the balance when authentication changes.
   */
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      requestIdRef.current += 1;

      setBalance(0);
      setError(null);
      setIsLoading(false);

      return;
    }

    void refreshBalance();
  }, [isAuthenticated, authLoading, refreshBalance]);

  const value: WalletContextType = {
    balance,
    isLoading,
    error,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
}
