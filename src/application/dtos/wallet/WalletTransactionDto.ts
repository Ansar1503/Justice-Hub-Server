type transactionCategory =
  | "deposit"
  | "withdrawal"
  | "payment"
  | "refund"
  | "transfer";
type transactionStatus = "pending" | "completed" | "failed" | "cancelled";
type transactionType = "debit" | "credit";

export interface WalletTransactionDto {
  id: string;
  walletId: string;
  amount: number;
  type: transactionType;
  description: string;
  category: transactionCategory;
  status: transactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface getWalletTransactionsOutputDto {
  data: WalletTransactionDto[] | [];
  page: number;
  totalPages: number;
}
// export interface addFundsToWalletInputDto {
//   userId: string;
//   amount: number;
// }

// export interface addFundsToWalletOutputDto {}
