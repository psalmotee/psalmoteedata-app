import type {
  LoginCredentials,
  LoginResponse,
  MeResponse,
  RegistrationCredentials,
  RegistrationResponse,
  CountriesResponse,
  RegistrationConfigResponse,
  LogoutResponse,
  HeartbeatResponse,
} from "../types/auth";
import type { WalletHistoryResponse, WalletResponse } from "../types/wallet";
import type { ServiceTransactionHistoryResponse } from "../types/serviceTransaction";
import type {
  VirtualAccountResponse,
  VirtualAccountGenerationResponse,
} from "../types/virtualAccount";

const API_BASE_URL =
  "https://psalmoteedata.com.ng/wp-json/psalmoteedata-mobile/v1";

type RequestOptions = {
  method: "GET" | "POST";
  token?: string;
  body?: object;
};

type ApiErrorResponse = {
  message?: string;
  code?: string;
};

export type ActivationResponse = {
  success: boolean;
  message: string;
  user?: {
    username: string;
  };
};

export type ResendActivationResponse = {
  success: boolean;
  message: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error(
      "Unable to connect. Please check your internet connection.",
    );
  }

  let data: T | ApiErrorResponse;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    throw new ApiError(
      errorData.message || "Something went wrong. Please try again.",
      response.status,
      errorData.code,
    );
  }

  return data as T;
}

export const authApi = {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/login", {
      method: "POST",
      body: credentials,
    });
  },

  getMe(token: string): Promise<MeResponse> {
    return apiRequest<MeResponse>("/me", {
      method: "GET",
      token,
    });
  },

  register(
    credentials: RegistrationCredentials,
  ): Promise<RegistrationResponse> {
    return apiRequest<RegistrationResponse>("/register", {
      method: "POST",
      body: credentials,
    });
  },

  getCountries(): Promise<CountriesResponse> {
    return apiRequest<CountriesResponse>("/countries", {
      method: "GET",
    });
  },

  getRegistrationConfig(): Promise<RegistrationConfigResponse> {
    return apiRequest<RegistrationConfigResponse>("/registration-config", {
      method: "GET",
    });
  },

  activateAccount(
    identifier: string,
    activation_code: string,
  ): Promise<ActivationResponse> {
    return apiRequest<ActivationResponse>("/activate", {
      method: "POST",
      body: {
        identifier,
        activation_code,
      },
    });
  },

  resendActivation(identifier: string): Promise<ResendActivationResponse> {
    return apiRequest<ResendActivationResponse>("/resend-activation", {
      method: "POST",
      body: {
        identifier,
      },
    });
  },

  heartbeat(token: string): Promise<HeartbeatResponse> {
    return apiRequest<HeartbeatResponse>("/heartbeat", {
      method: "POST",
      token,
    });
  },

  logout(token: string): Promise<LogoutResponse> {
    return apiRequest<LogoutResponse>("/logout", {
      method: "POST",
      token,
    });
  },
};

// Wallet
export const walletApi = {
  getBalance(token: string): Promise<WalletResponse> {
    return apiRequest<WalletResponse>("/wallet", {
      method: "GET",
      token,
    });
  },

  getHistory(
    token: string,
    page = 1,
    perPage = 20,
  ): Promise<WalletHistoryResponse> {
    return apiRequest<WalletHistoryResponse>(
      `/wallet/history?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        token,
      },
    );
  },
};

// Transaction
export const transactionApi = {
  getHistory(
    token: string,
    page = 1,
    perPage = 20,
  ): Promise<ServiceTransactionHistoryResponse> {
    return apiRequest<ServiceTransactionHistoryResponse>(
      `/transactions?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        token,
      },
    );
  },
};

// Virtual Accounts
export const virtualAccountApi = {
  getAccounts(token: string): Promise<VirtualAccountResponse> {
    return apiRequest<VirtualAccountResponse>("/virtual-accounts", {
      method: "GET",
      token,
    });
  },

  generateAccounts(
    token: string,
  ): Promise<VirtualAccountGenerationResponse> {
    return apiRequest<VirtualAccountGenerationResponse>(
      "/virtual-accounts/generate",
      {
        method: "POST",
        token,
      },
    );
  },
};