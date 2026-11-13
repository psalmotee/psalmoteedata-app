export type VirtualAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  gateway: string;
  charges: string;
};

export const MOCK_VIRTUAL_ACCOUNTS: VirtualAccount[] = [
  {
    id: "1",
    bankName: "Wema Bank",
    accountName: "PSALMOTEEDATA / JOHN DOE",
    accountNumber: "1234567890",
    gateway: "Paystack",
    charges: "To be confirmed",
  },
  {
    id: "2",
    bankName: "Sterling Bank",
    accountName: "PSALMOTEEDATA / JOHN DOE",
    accountNumber: "0987654321",
    gateway: "Paystack",
    charges: "To be confirmed",
  },
  {
    id: "3",
    bankName: "Moniepoint",
    accountName: "PSALMOTEEDATA / JOHN DOE",
    accountNumber: "1122334455",
    gateway: "Paystack",
    charges: "To be confirmed",
  },
];
