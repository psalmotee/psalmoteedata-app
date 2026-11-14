import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser, LoginCredentials } from "../types/auth";
import { authApi } from "../services/api";
import {
  saveAuthToken,
  getAuthToken,
  clearAuthToken,
} from "../utils/secureStorage";

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  retrySession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response = await authApi.getMe(token);

      if (!response.success) {
        throw new Error("Unable to verify your session.");
      }

      setUser(response.user);
    } catch (err) {
      setUser(null);
      setError(
        err instanceof Error ? err.message : "Unable to restore your session.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = async (credentials: LoginCredentials) => {
    setError(null);

    const response = await authApi.login(credentials);

    if (!response.success || !response.access_token) {
      throw new Error(response.message || "Login failed.");
    }

    await saveAuthToken(response.access_token);
    setUser(response.user);
  };

  const logout = async () => {
    const token = await getAuthToken();

    try {
      if (token) {
        await authApi.logout(token);
      }
    } finally {
      await clearAuthToken();
      setUser(null);
      setError(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: user !== null,
    login,
    logout,
    retrySession: restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
