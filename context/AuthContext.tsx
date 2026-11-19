import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AppState, View } from "react-native";

import type { AuthUser, LoginCredentials } from "../types/auth";
import { ApiError, authApi } from "../services/api";

import {
  saveAuthToken,
  getAuthToken,
  clearAuthToken,
} from "../utils/secureStorage";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 60 * 1000;

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  retrySession: () => Promise<void>;
  recordActivity: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Session monitoring references
  const lastActivityAtRef = useRef<number>(Date.now());
  const backgroundAtRef = useRef<number | null>(null);

const appStateRef = useRef<typeof AppState.currentState>(AppState.currentState);

  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const heartbeatInProgressRef = useRef(false);
  const logoutInProgressRef = useRef(false);

  /**
   * Restore an existing session when the app starts.
   */
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

      lastActivityAtRef.current = Date.now();
      setUser(response.user);
    } catch (err) {
      // Clear the stored token if the backend has invalidated this session.
      if (
        err instanceof ApiError &&
        (err.status === 401 || err.code === "account_suspended")
      ) {
        try {
          await clearAuthToken();
        } catch {
          // Continue even if secure storage cleanup fails.
        }
      }

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

  /**
   * Log in and save the access token securely.
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);

    const response = await authApi.login(credentials);

    if (!response.success || !response.access_token) {
      throw new Error(response.message || "Login failed.");
    }

    await saveAuthToken(response.access_token);

    lastActivityAtRef.current = Date.now();
    backgroundAtRef.current = null;

    setUser(response.user);
  }, []);

  /**
   * Clear the local session before attempting server logout.
   *
   * This ensures the user is not trapped on the app if the
   * server is unreachable or the token has already expired.
   */
  const logout = useCallback(async () => {
    if (logoutInProgressRef.current) {
      return;
    }

    logoutInProgressRef.current = true;

    let token: string | null = null;

    try {
      try {
        token = await getAuthToken();
      } catch {
        // Continue with local cleanup even if token retrieval fails.
      }

      try {
        await clearAuthToken();
      } finally {
        setUser(null);
        setError(null);
      }

      // Server-side revocation is attempted after local cleanup.
      if (token) {
        try {
          await authApi.logout(token);
        } catch (err) {
          // These responses mean the session is already invalid.
          // The user is effectively signed out.
          if (
            err instanceof ApiError &&
            (err.status === 401 || err.code === "account_suspended")
          ) {
            return;
          }

          // Preserve genuine network and server errors.
          throw err;
        }
      }
    } finally {
      logoutInProgressRef.current = false;
    }
  }, []);

  /**
   * End the session automatically.
   *
   * Network or logout errors are intentionally suppressed here
   * because automatic expiration should not display an alert.
   */
  const expireSession = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Local session has already been cleared.
    }
  }, [logout]);

  /**
   * Send a heartbeat to keep the server session active.
   */
  const sendHeartbeat = useCallback(async () => {
    if (heartbeatInProgressRef.current || logoutInProgressRef.current) {
      return;
    }

    // Never allow a heartbeat to keep an inactive user signed in.
    const inactivityDuration = Date.now() - lastActivityAtRef.current;

    if (inactivityDuration >= INACTIVITY_TIMEOUT_MS) {
      await expireSession();
      return;
    }

    heartbeatInProgressRef.current = true;

    try {
      const token = await getAuthToken();

      if (!token) {
        await expireSession();
        return;
      }

      await authApi.heartbeat(token);
    } catch (err) {
      // A 401 means the server no longer accepts this session.
      // Expire the local session if the backend invalidates it.
      if (
        err instanceof ApiError &&
        (err.status === 401 || err.code === "account_suspended")
      ) {
        await expireSession();
      }

      // Other errors are treated as temporary network/server issues.
      // The next heartbeat will retry.
    } finally {
      heartbeatInProgressRef.current = false;
    }
  }, [expireSession]);

  /**
   * Stop the inactivity timer and heartbeat interval.
   */
  const stopSessionMonitoring = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  }, []);

  /**
   * Schedule automatic logout based on the last user interaction.
   */
  const scheduleInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }

    if (!user || appStateRef.current !== "active") {
      return;
    }

    const elapsedTime = Date.now() - lastActivityAtRef.current;

    const remainingTime = INACTIVITY_TIMEOUT_MS - elapsedTime;

    if (remainingTime <= 0) {
      void expireSession();
      return;
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      void expireSession();
    }, remainingTime);
  }, [user, expireSession]);

  /**
   * Start session monitoring while the app is active.
   */
  const startSessionMonitoring = useCallback(() => {
    stopSessionMonitoring();

    if (!user || appStateRef.current !== "active") {
      return;
    }

    scheduleInactivityTimeout();

    heartbeatIntervalRef.current = setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);
  }, [user, stopSessionMonitoring, scheduleInactivityTimeout, sendHeartbeat]);

  /**
   * Record user activity from screen touches and interactions.
   */
  const recordActivity = useCallback(() => {
    if (
      !user ||
      appStateRef.current !== "active" ||
      logoutInProgressRef.current
    ) {
      return;
    }

    lastActivityAtRef.current = Date.now();

    scheduleInactivityTimeout();
  }, [user, scheduleInactivityTimeout]);

  /**
   * Start and stop monitoring whenever authentication changes.
   */
  useEffect(() => {
    if (user && appStateRef.current === "active") {
      startSessionMonitoring();
    } else {
      stopSessionMonitoring();
    }

    return stopSessionMonitoring;
  }, [user, startSessionMonitoring, stopSessionMonitoring]);

  /**
   * Handle the app moving into the background and returning.
   */
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;

      appStateRef.current = nextState;

      // Stop monitoring while the app is not active.
      if (nextState !== "active") {
        if (previousState === "active") {
          backgroundAtRef.current = Date.now();
        }

        stopSessionMonitoring();
        return;
      }

      // Ignore events that do not represent a return to active state.
      if (previousState === "active") {
        return;
      }

      const now = Date.now();

      const backgroundDuration = backgroundAtRef.current
        ? now - backgroundAtRef.current
        : 0;

      backgroundAtRef.current = null;

      if (!user) {
        return;
      }

      const inactivityDuration = now - lastActivityAtRef.current;

      // Expire the session if either timeout has been reached.
      if (
        backgroundDuration >= INACTIVITY_TIMEOUT_MS ||
        inactivityDuration >= INACTIVITY_TIMEOUT_MS
      ) {
        void expireSession();
        return;
      }

      // The session is still valid. Restart monitoring.
      startSessionMonitoring();

      // Verify the server session immediately after resuming.
      void sendHeartbeat();
    });

    return () => {
      subscription.remove();
    };
  }, [
    user,
    expireSession,
    startSessionMonitoring,
    sendHeartbeat,
    stopSessionMonitoring,
  ]);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: user !== null,
    login,
    logout,
    retrySession: restoreSession,
    recordActivity,
  };
  
  return (
    <AuthContext.Provider value={value}>
      <View style={{ flex: 1 }} onTouchStart={recordActivity}>
        {children}
      </View>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
