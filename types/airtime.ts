export type AirtimePurchaseRequest = {
  pin: string;
  network: string;
  type: string;
  phone_number: string;
  amount: number;
  request_id: string;
  ported_number: boolean;
};

export type AirtimeTransactionStatus =
  | "successful"
  | "processing"
  | "failed"
  | "unknown";

export type AirtimePurchaseResponse = {
  success: boolean;
  message: string;
  transaction: {
    reference: string;
    transaction_id: number | null;
    service: string;
    network: string;
    type: string;
    recipient: string;
    amount: number;
    charged_amount: number | null;
    status: AirtimeTransactionStatus;
    wallet_balance: number | null;
  };
};

export type AirtimePricing = {
  original: number;
  provider_bonus: number;
  service_bonus: number;
  tiered_bonus: number;
  total_bonus: number;
  payable: number;
  discount_method: "discount" | "commission";
  bonus_source: "provider" | "service" | "none";
};

export type AirtimeQuoteRequest = {
  network: string;
  type: string;
  amount: number;
};

export type AirtimeQuoteResponse = {
  success: boolean;
  message: string;
  pricing: AirtimePricing;
};