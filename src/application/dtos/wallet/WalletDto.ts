export interface WalletDto {
  id: string;
  user_id: string;
  balance: number;
  status: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
