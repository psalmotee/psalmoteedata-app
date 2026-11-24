import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  VirtualAccount,
  VirtualAccountGenerationResult,
} from "../types/virtualAccount";

import { virtualAccountApi } from "../services/api";
import { getAuthToken } from "../utils/secureStorage";
import { useAuth } from "./AuthContext";

type VirtualAccountContextType = {
  accounts: VirtualAccount[];
  generationResults: VirtualAccountGenerationResult[];

  isLoading: boolean;
  isRefreshing: boolean;
  isGenerating: boolean;

  error: string | null;

  fetchAccounts: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  generateAccounts: () => Promise<void>;
};

const VirtualAccountContext = createContext<
  VirtualAccountContextType | undefined
>(undefined);

type VirtualAccountProviderProps = {
  children: ReactNode;
};

export function VirtualAccountProvider({
  children,
}: VirtualAccountProviderProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [accounts, setAccounts] = useState<VirtualAccount[]>([]);
  const [generationResults, setGenerationResults] = useState<
    VirtualAccountGenerationResult[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const generatingRef = useRef(false);

  /**
   * Retrieve saved virtual accounts from the backend.
   */
  const fetchAccounts = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    const currentRequestId = ++requestId.current;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await virtualAccountApi.getAccounts(token);

      if (currentRequestId !== requestId.current) {
        return;
      }

      setAccounts(response.accounts);
    } catch (err) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setError(
        err instanceof Error ? err.message : "Unable to load virtual accounts.",
      );
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated]);

  /**
   * Refresh the saved virtual account list.
   */
  const refreshAccounts = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    const currentRequestId = ++requestId.current;

    setIsRefreshing(true);
    setError(null);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await virtualAccountApi.getAccounts(token);

      if (currentRequestId !== requestId.current) {
        return;
      }

      setAccounts(response.accounts);
    } catch (err) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh virtual accounts.",
      );
    } finally {
      if (currentRequestId === requestId.current) {
        setIsRefreshing(false);
      }
    }
  }, [isAuthenticated]);

  /**
   * Generate virtual accounts for all eligible gateways.
   */
  const generateAccounts = useCallback(async () => {
    if (!isAuthenticated || generatingRef.current) {
      return;
    }

    generatingRef.current = true;

    // Invalidate any outstanding account retrieval request.
    requestId.current += 1;

    setIsGenerating(true);
    setError(null);
    setGenerationResults([]);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await virtualAccountApi.generateAccounts(token);

      if (!response.success) {
        throw new Error(
          response.message || "Unable to generate virtual accounts.",
        );
      }

      setGenerationResults(response.results);
      setAccounts(response.accounts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate virtual accounts.",
      );

      throw err;
    } finally {
      generatingRef.current = false;
      setIsGenerating(false);
    }
  }, [isAuthenticated]);

  /**
   * Load accounts after authentication and session restoration.
   */
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (isAuthenticated) {
      void fetchAccounts();
    } else {
      requestId.current += 1;

      setAccounts([]);
      setGenerationResults([]);
      setError(null);

      setIsLoading(false);
      setIsRefreshing(false);
      setIsGenerating(false);

      generatingRef.current = false;
    }
  }, [isAuthenticated, isAuthLoading, fetchAccounts]);

  return (
    <VirtualAccountContext.Provider
      value={{
        accounts,
        generationResults,
        isLoading,
        isRefreshing,
        isGenerating,
        error,
        fetchAccounts,
        refreshAccounts,
        generateAccounts,
      }}
    >
      {children}
    </VirtualAccountContext.Provider>
  );
}

export function useVirtualAccounts() {
  const context = useContext(VirtualAccountContext);

  if (!context) {
    throw new Error(
      "useVirtualAccounts must be used within a VirtualAccountProvider.",
    );
  }

  return context;
}
