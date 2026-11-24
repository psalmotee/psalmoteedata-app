export type VirtualAccount = {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  account_reference: string;
  gateway: string;
  created_at: string | null;
  updated_at: string | null;
};

export type VirtualAccountResponse = {
  success: boolean;
  accounts: VirtualAccount[];
};

export type VirtualAccountGenerationStatus =
  | "success"
  | "failed"
  | "already_exists"
  | "profile_required";

export type VirtualAccountGenerationResult = {
  gateway: string;
  status: VirtualAccountGenerationStatus;
  message: string;
};

export type VirtualAccountGenerationSummary = {
  generated: number;
  failed: number;
  already_exists: number;
  profile_required: number;
  total_accounts: number;
};

export type VirtualAccountGenerationResponse = {
  success: boolean;
  message: string;
  summary: VirtualAccountGenerationSummary;
  results: VirtualAccountGenerationResult[];
  accounts: VirtualAccount[];
};
