export type TransactionServiceType = "Airtime" | "Data";

export type TransactionStatus = "Successful" | "Pending" | "Failed";

export type Transaction = {
  id: string;
  serviceType: TransactionServiceType;
  network: string;
  phoneNumber: string;
  description: string;
  amount: number;
  totalAmount: number;
  transactionReference: string;
  completedAt: string;
  status: TransactionStatus;
};
