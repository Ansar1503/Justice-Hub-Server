export interface CommissionSettingsDto {
  id: string;
  initialCommission: number;
  followupCommission: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrUpdateCommissionSettingsInputDto {
  id?: string;
  initialCommission: number;
  followupCommission: number;
}
